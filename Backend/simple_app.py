from flask import Flask, jsonify
import os

app = Flask(__name__)

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy', 'service': 'GeoTaste API - Simple Test'})

@app.route('/api', methods=['GET'])
def api_root():
    return jsonify({
        'message': 'GeoTaste API is running - Simple Test',
        'version': '1.0.0'
    })

@app.route('/', methods=['GET'])
def root():
    return jsonify({'message': 'GeoTaste is running - Simple Test'})

if __name__ == '__main__':
    try:
        port = int(os.environ.get('PORT', 5000))
        print(f"🚀 Starting Simple GeoTaste Flask app on port {port}")
        print(f"🌐 Binding to 0.0.0.0:{port}")
        print(f"🏥 Health check endpoint: /api/health")
        
        app.run(host='0.0.0.0', port=port, debug=False)
        
    except Exception as e:
        print(f"❌ Failed to start simple Flask app: {e}")
        import traceback
        print(f"💥 Full traceback: {traceback.format_exc()}")
        import sys
        sys.exit(1) 