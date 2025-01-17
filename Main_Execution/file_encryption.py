from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
from cryptography.hazmat.primitives import padding
from cryptography.hazmat.backends import default_backend
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
from cryptography.hazmat.primitives import hashes
import os
import base64

from flask import app


# Function to generate a key from a password
def generate_key(password: str, salt: bytes) -> bytes:
    kdf = PBKDF2HMAC(
        algorithm=hashes.SHA256(),
        length=32,  # 256 bits key
        salt=salt,
        iterations=100000,
        backend=default_backend()
    )
    return kdf.derive(password.encode())

# Function to encrypt the file

def encrypt_file(file_path: str, password: str, encrypted_file_path: str):
    # Generate salt and key
    salt = os.urandom(16)  # 16 bytes of salt
    key = generate_key(password, salt)

    # Open the file to encrypt
    with open(file_path, 'rb') as file:
        data = file.read()

    # Padding to make data length multiple of block size (128 bits)
    padder = padding.PKCS7(128).padder()
    padded_data = padder.update(data) + padder.finalize()

    # Encrypt using AES in CBC mode
    iv = os.urandom(16)  # 16-byte IV (initialization vector)
    cipher = Cipher(algorithms.AES(key), modes.CBC(iv), backend=default_backend())
    encryptor = cipher.encryptor()
    encrypted_data = encryptor.update(padded_data) + encryptor.finalize()

    # Write encrypted data to a file
    with open(encrypted_file_path, 'wb') as encrypted_file:
        encrypted_file.write(salt + iv + encrypted_data)  # Store salt and IV at the beginning

   


# Function to decrypt the file

def decrypt_file(encrypted_file_path: str, password: str, decrypted_file_path: str):
    # Open the encrypted file
    with open(encrypted_file_path, 'rb') as encrypted_file:
        encrypted_data = encrypted_file.read()

    # Extract salt and IV
    salt = encrypted_data[:16]
    iv = encrypted_data[16:32]
    encrypted_content = encrypted_data[32:]

    # Generate key from password and salt
    key = generate_key(password, salt)

    # Decrypt using AES in CBC mode
    cipher = Cipher(algorithms.AES(key), modes.CBC(iv), backend=default_backend())
    decryptor = cipher.decryptor()
    decrypted_data = decryptor.update(encrypted_content) + decryptor.finalize()

    # Remove padding
    unpadder = padding.PKCS7(128).unpadder()
    unpadded_data = unpadder.update(decrypted_data) + unpadder.finalize()

    # Write decrypted data to a file
    with open(decrypted_file_path, 'wb') as decrypted_file:
        decrypted_file.write(unpadded_data)



# Example usage
if __name__ == '__main__':
    app.run(debug=True)
