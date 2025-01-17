from flask import Flask, render_template, request, jsonify
from file_encryption import encrypt_file, decrypt_file
import os
import logging

app = Flask(__name__)

# Configure logging
logging.basicConfig(level=logging.DEBUG)

# Ensure directories exist
if not os.path.exists('encrypted_files'):
    os.makedirs('encrypted_files')
if not os.path.exists('decrypted_files'):
    os.makedirs('decrypted_files')

@app.route('/')
def index():
    return render_template('login.html')

@app.route('/encrypt', methods=['POST'])
def encrypt():
    try:
        file = request.files['file']
        password = request.form['password']
        encrypted_file_path = os.path.join('encrypted_files', file.filename + '.enc')

        if not file or not password:
            return jsonify({'error': 'Missing required parameters'}), 400

        file.save(file.filename)
        encrypt_file(file.filename, password, encrypted_file_path)
        os.remove(file.filename)

        return jsonify({'message': 'File encrypted successfully', 'encrypted_file_path': encrypted_file_path}), 200
    except Exception as e:
        app.logger.error(f"Encryption failed: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/decrypt', methods=['POST'])
def decrypt():
    try:
        file = request.files['file']
        password = request.form['password']
        decrypted_file_path = os.path.join('decrypted_files', file.filename.replace('.enc', ''))

        if not file or not password:
            return jsonify({'error': 'Missing required parameters'}), 400

        file.save(file.filename)
        decrypt_file(file.filename, password, decrypted_file_path)
        os.remove(file.filename)

        return jsonify({'message': 'File decrypted successfully', 'decrypted_file_path': decrypted_file_path}), 200
    except Exception as e:
        app.logger.error(f"Decryption failed: {e}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)