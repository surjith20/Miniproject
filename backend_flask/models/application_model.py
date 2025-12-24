from utils.db import get_db

class Application:
    @staticmethod
    def create(user_id, business_name, business_type, address):
        db = get_db()
        cursor = db.execute(
            'INSERT INTO applications (user_id, business_name, business_type, address) VALUES (?, ?, ?, ?)',
            (user_id, business_name, business_type, address)
        )
        db.commit()
        return cursor.lastrowid

    @staticmethod
    def get_all(filters=None):
        db = get_db()
        query = 'SELECT a.*, u.name as applicant_name FROM applications a JOIN users u ON a.user_id = u.id'
        params = []
        
        if filters:
            conditions = []
            if 'user_id' in filters:
                conditions.append('a.user_id = ?')
                params.append(filters['user_id'])
            if conditions:
                query += ' WHERE ' + ' AND '.join(conditions)
                
        query += ' ORDER BY a.submitted_at DESC'
        return db.execute(query, params).fetchall()

    @staticmethod
    def get_by_id(app_id):
        db = get_db()
        return db.execute('SELECT * FROM applications WHERE id = ?', (app_id,)).fetchone()

    @staticmethod
    def update_status(app_id, status):
        db = get_db()
        db.execute('UPDATE applications SET status = ? WHERE id = ?', (status, app_id))
        db.commit()
