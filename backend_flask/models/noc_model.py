from utils.db import get_db

class NOC:
    @staticmethod
    def issue(application_id, expiry_date, file_url):
        db = get_db()
        cursor = db.execute(
            'INSERT INTO nocs (application_id, expiry_date, noc_file_url) VALUES (?, ?, ?)',
            (application_id, expiry_date, file_url)
        )
        # Update application status
        db.execute('UPDATE applications SET status = ? WHERE id = ?', ('Approved', application_id))
        db.commit()
        return cursor.lastrowid
