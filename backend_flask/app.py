from flask import Flask, jsonify
from flask_cors import CORS
from config import Config
from utils.db import init_app

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    
    # Initialize Extensions
    CORS(app, resources={r"/api/*": {"origins": "*"}})
    
    # Initialize DB
    init_app(app)
    
    # Register Blueprints
    from routes.auth_routes import auth_bp
    from routes.application_routes import application_bp
    from routes.inspection_routes import inspection_bp
    from routes.admin_routes import admin_bp

    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(application_bp, url_prefix='/api/applications')
    app.register_blueprint(inspection_bp, url_prefix='/api/inspections')
    app.register_blueprint(admin_bp, url_prefix='/api/admin')

    @app.route('/api/health')
    def health_check():
        return jsonify({"status": "healthy", "service": "Fire Dept Backend (Python)"})

    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True, port=5000)
