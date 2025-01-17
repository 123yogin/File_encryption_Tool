# File Encryption Tool

## Overview
A secure and user-friendly file encryption tool that uses industry-standard encryption algorithms to protect sensitive files. This tool supports both file encryption and decryption with password protection, making it ideal for securing personal or professional documents.

## Features
- Strong AES-256 encryption
- Password-based key derivation
- File integrity verification
- Support for multiple file formats
- Batch encryption capabilities
- Secure password handling
- Cross-platform compatibility
- Command-line interface
- Optional GUI interface

## Requirements
```
python>=3.8
cryptography>=3.4.7
PyQt5>=5.15.4  # For GUI version
click>=8.0.1   # For CLI version
```

## Installation

### From Source
```bash
git clone https://github.com/yourusername/file-encryption-tool.git
cd file-encryption-tool
pip install -r requirements.txt
```

### Using pip
```bash
pip install secure-file-encryptor
```

## Basic Usage

### Command Line Interface
```bash
# Encrypt a file
python encrypt.py -e -f path/to/file -p password

# Decrypt a file
python encrypt.py -d -f path/to/encrypted_file -p password

# Batch encrypt files
python encrypt.py -e -b path/to/directory -p password
```

### GUI Usage
1. Launch the application: `python encrypt_gui.py`
2. Select operation mode (Encrypt/Decrypt)
3. Choose file(s) using the file browser
4. Enter password
5. Click Process

## Security Features

### Encryption Process
1. Password-Based Key Derivation (PBKDF2)
2. AES-256 in GCM mode
3. Secure random IV generation
4. MAC for integrity verification
5. Secure memory handling

### File Format
```
[Version][Salt][IV][Tag][Encrypted Data]
```

## Advanced Usage

### API Integration
```python
from file_encryptor import FileEncryptor

# Initialize encryptor
encryptor = FileEncryptor()

# Encrypt file
encryptor.encrypt_file('document.pdf', 'secure_password')

# Decrypt file
encryptor.decrypt_file('document.pdf.encrypted', 'secure_password')
```

### Configuration Options
```python
# Custom encryption settings
settings = {
    'iteration_count': 600000,
    'key_length': 32,
    'chunk_size': 64 * 1024,
    'salt_length': 32
}

encryptor = FileEncryptor(settings=settings)
```

## Best Practices
1. Use strong, unique passwords
2. Keep encrypted files backed up
3. Store passwords securely
4. Verify file integrity after decryption
5. Use secure channels for password sharing

## Error Handling

### Common Error Messages
- `InvalidPasswordError`: Incorrect password provided
- `CorruptedFileError`: File integrity check failed
- `UnsupportedVersionError`: Incompatible file version
- `InsufficientSpaceError`: Not enough disk space

### Recovery Options
1. Password recovery procedures
2. Backup file restoration
3. Integrity verification tools
4. Version compatibility checks

## Development

### Building from Source
```bash
# Setup development environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements-dev.txt

# Run tests
pytest tests/

# Build distribution
python setup.py sdist bdist_wheel
```

### Contributing
1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## Testing
```bash
# Run all tests
pytest

# Run specific test category
pytest tests/test_encryption.py

# Generate coverage report
pytest --cov=file_encryptor tests/
```

## Security Considerations

### Key Points
- All encryption operations are performed in memory
- Temporary files are securely wiped
- Passwords are never stored
- Memory is cleared after use
- Random number generation uses secure sources

### Known Limitations
- No built-in key management
- Password strength depends on user
- Memory requirements for large files
- Performance impact on low-end systems

## Troubleshooting

### Common Issues
1. File permission errors
2. Memory limitations
3. Password handling issues
4. Platform-specific quirks

### Debug Mode
```bash
python encrypt.py --debug -e -f file.txt -p password
```

## License
This project is licensed under the MIT License. See LICENSE file for details.

## Acknowledgments
- Cryptography library developers
- Security researchers and auditors
- Open-source community contributors

## Contact
- Author: Yogin Parmar
- Email: parmaryogin04@gmail.com

## Version History
- 1.0.0: Initial release
- 1.1.0: Added GUI interface
- 1.2.0: Enhanced security features
- 1.3.0: Performance improvements
