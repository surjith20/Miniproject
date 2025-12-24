import sqlite3
from flask import g
from config import Config

def get_db():
    if 'db' not in g:
        g.db = sqlite3.connect(Config.DATABASE_URI)
        g.db.row_factory = sqlite3.Row
    return g.db

def close_db(e=None):
    db = g.pop('db', None)
    if db is not None:
        db.close()

def init_db():
    db = get_db()
    
    # Create tables
    # Users Table
    db.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            role TEXT DEFAULT 'user', -- user, admin, inspector
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Applications Table
    db.execute('''
        CREATE TABLE IF NOT EXISTS applications (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            business_name TEXT NOT NULL,
            business_type TEXT,
            address TEXT,
            status TEXT DEFAULT 'Pending', -- Pending, Under Review, Inspection Scheduled, Approved, Rejected
            submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
    ''')

    # Inspections Table
    db.execute('''
        CREATE TABLE IF NOT EXISTS inspections (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            application_id INTEGER,
            inspector_name TEXT,
            inspection_date DATE,
            status TEXT DEFAULT 'Scheduled', -- Scheduled, Completed, Failed
            remarks TEXT,
            report_url TEXT,
            FOREIGN KEY (application_id) REFERENCES applications (id)
        )
    ''')
    
    # NOC Table
    db.execute('''
        CREATE TABLE IF NOT EXISTS nocs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            application_id INTEGER,
            issued_date DATE DEFAULT CURRENT_DATE,
            expiry_date DATE,
            noc_file_url TEXT,
            FOREIGN KEY (application_id) REFERENCES applications (id)
        )
    ''')
    
    db.commit()

def init_app(app):
    app.teardown_appcontext(close_db)
    with app.app_context():
        init_db()
