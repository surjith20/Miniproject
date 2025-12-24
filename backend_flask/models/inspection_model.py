from utils.db import get_db

class Inspection:
    @staticmethod
    def create(application_id, inspector_name, date):
        db = get_db()
        cursor = db.execute(
            'INSERT INTO inspections (application_id, inspector_name, inspection_date) VALUES (?, ?, ?)',
            (application_id, inspector_name, date)
        )
        # Update application status
        db.execute('UPDATE applications SET status = ? WHERE id = ?', ('Inspection Scheduled', application_id))
        db.commit()
        return cursor.lastrowid

    @staticmethod
    def get_by_application(app_id):
        db = get_db()
        return db.execute('SELECT * FROM inspections WHERE application_id = ?', (app_id,)).fetchall()
        
    @staticmethod
    def get_all():
        db = get_db()
        return db.execute('SELECT i.*, a.business_name FROM inspections i JOIN applications a ON i.application_id = a.id').fetchall()

    @staticmethod
    def update_result(inspection_id, status, remarks, report_url=None):
        db = get_db()
        db.execute(
            'UPDATE inspections SET status = ?, remarks = ?, report_url = ? WHERE id = ?',
            (status, remarks, report_url, inspection_id)
        )
        db.commit()
