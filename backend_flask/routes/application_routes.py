from flask import Blueprint, request, jsonify
from models.application_model import Application
from flask_jwt_extended import jwt_required, get_jwt_identity

application_bp = Blueprint('applications', __name__)

@application_bp.route('', methods=['POST'])
@jwt_required()
def create_application():
    user_id = get_jwt_identity()
    data = request.get_json()
    
    required = ['businessName', 'businessType', 'address']
    if not all(k in data for k in required):
        return jsonify({"message": "Missing fields"}), 400

    app_id = Application.create(user_id, data['businessName'], data['businessType'], data['address'])
    return jsonify({"message": "Application submitted", "applicationId": app_id}), 201

@application_bp.route('', methods=['GET'])
@jwt_required()
def get_applications():
    user_id = request.args.get('userId')
    filters = {}
    if user_id:
        filters['user_id'] = user_id
        
    apps = Application.get_all(filters)
    # Convert Row objects to dict
    result = [dict(row) for row in apps]
    return jsonify(result), 200

@application_bp.route('/<int:id>', methods=['GET'])
@jwt_required()
def get_application(id):
    app = Application.get_by_id(id)
    if app:
        return jsonify(dict(app)), 200
    return jsonify({"message": "Not found"}), 404

@application_bp.route('/<int:id>', methods=['PATCH'])
@jwt_required()
def update_application(id):
    data = request.get_json()
    status = data.get('status')
    if status:
        Application.update_status(id, status)
        return jsonify({"message": "Status updated"}), 200
    return jsonify({"message": "No updates provided"}), 400
