import os

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'dev_secret_key_12345'
    # Using absolute path for DB to avoid confusion
    BASE_DIR = os.path.dirname(os.path.abspath(__file__))
    DB_FOLDER = os.path.join(BASE_DIR, 'database')
    DATABASE_URI = os.path.join(DB_FOLDER, 'fire_dept.db')
    
    # Ensure database folder exists
    if not os.path.exists(DB_FOLDER):
        os.makedirs(DB_FOLDER)
