from utils.db import get_db
from flask_bcrypt import Bcrypt

bcrypt = Bcrypt()

class User:
    @staticmethod
    def create_user(name, email, password, role='user'):
        db = get_db()
        hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
        try:
            cursor = db.execute(
                'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
                (name, email, hashed_password, role)
            )
            db.commit()
            return cursor.lastrowid
        except Exception as e:
            return None

    @staticmethod
    def find_by_email(email):
        db = get_db()
        user = db.execute('SELECT * FROM users WHERE email = ?', (email,)).fetchone()
        return user

    @staticmethod
    def verify_password(stored_password, provided_password):
        return bcrypt.check_password_hash(stored_password, provided_password)
