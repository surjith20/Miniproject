from flask import Blueprint, jsonify
from utils.db import get_db
from flask_jwt_extended import jwt_required

admin_bp = Blueprint('admin', __name__)

@admin_bp.route('/users', methods=['GET'])
@jwt_required()
# In a real app, check for 'admin' role claim
def get_users():
    db = get_db()
    users = db.execute('SELECT id, name, email, role, created_at FROM users').fetchall()
    return jsonify([dict(row) for row in users]), 200
