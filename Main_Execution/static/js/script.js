document.querySelectorAll('input[type="file"]').forEach(input => {
    const fileInfo = input.parentElement.querySelector('.file-info');
    
    input.addEventListener('change', function() {
        const label = this.previousElementSibling;
        const labelText = label.querySelector('.label-text');
        const maxLength = 20;

        if (this.files[0]) {
            let fileName = this.files[0].name;
            if (fileName.length > maxLength) {
                fileName = fileName.substring(0, maxLength) + '...';
            }
            labelText.textContent = fileName;
            label.classList.add('has-file');
            
            // Update file info
            const fileSize = (this.files[0].size / 1024 / 1024).toFixed(2);
            fileInfo.textContent = `Size: ${fileSize} MB`;
        } else {
            labelText.textContent = 'Choose File';
            label.classList.remove('has-file');
            fileInfo.textContent = '';
        }
    });
});

// Password visibility toggle
document.querySelectorAll('.toggle-password').forEach(toggle => {
    toggle.addEventListener('click', function() {
        const input = this.previousElementSibling;
        const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
        input.setAttribute('type', type);
        this.classList.toggle('fa-eye');
        this.classList.toggle('fa-eye-slash');
    });
});

// Form validation
function validateForm(formData) {
    const file = formData.get('file');
    const password = formData.get('password');
    const errors = [];

    // File validation
    if (!file || file.size === 0) {
        errors.push('Please select a file');
    }

    const maxSize = 100 * 1024 * 1024; // 100MB
    if (file && file.size > maxSize) {
        errors.push('File size exceeds maximum limit of 100MB');
    }

    // Password validation
    if (!password) {
        errors.push('Password is required');
    } else if (password.length < 8) {
        errors.push('Password must be at least 8 characters long');
    }

    return errors;
}

// Progress simulation with realistic stages
function simulateProgress(progressBar, statusElement, stages) {
    let currentStage = 0;
    let progress = 0;

    return new Promise((resolve) => {
        const interval = setInterval(() => {
            if (currentStage >= stages.length) {
                clearInterval(interval);
                resolve();
                return;
            }

            const stage = stages[currentStage];
            progress = Math.min(stage.progress, progress + Math.random() * 2);
            progressBar.style.width = `${progress}%`;
            statusElement.textContent = `${stage.message} (${Math.round(progress)}%)`;

            if (progress >= stage.progress) {
                currentStage++;
            }
        }, 100);
    });
}

// Enhanced form submission handling
['encrypt', 'decrypt'].forEach(action => {
    const form = document.getElementById(`${action}-form`);
    const progressBar = document.getElementById(`${action}-progress`);
    const progressWrapper = form.nextElementSibling;
    const statusElement = progressWrapper.querySelector('.progress-status');
    const message = document.getElementById(`${action}-message`);

    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        const formData = new FormData(this);
        const button = form.querySelector('button');
        const errors = validateForm(formData);

        // Reset state
        progressBar.style.width = '0%';
        message.className = 'message';
        button.disabled = true;

        if (errors.length > 0) {
            message.innerHTML = `
                <i class="fas fa-exclamation-circle"></i>
                ${errors.join(', ')}
            `;
            message.className = 'message error show';
            button.disabled = false;
            return;
        }

        progressWrapper.classList.add('active');

        try {
            // Define processing stages
            const stages = [
                { progress: 20, message: 'Reading file' },
                { progress: 40, message: `Preparing for ${action}ion` },
                { progress: 70, message: `${action}ing file` },
                { progress: 90, message: 'Finalizing' }
            ];

            // Start progress simulation
            await simulateProgress(progressBar, statusElement, stages);

            // Actual API call
            const response = await fetch(`/${action}`, {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error(`${action} failed: ${response.statusText}`);
            }

            const data = await response.json();

            // Complete progress
            progressBar.style.width = '100%';
            statusElement.textContent = 'Complete (100%)';

            // Show success message with file details
            const file = formData.get('file');
            message.innerHTML = `
                <i class="fas fa-check-circle"></i>
                <div>
                    <div>${data.message || `File ${action}ed successfully!`}</div>
                    <small>File: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)</small>
                </div>
            `;
            message.className = 'message success show';

        } catch (error) {
            message.innerHTML = `
                <i class="fas fa-exclamation-circle"></i>
                <div>${error.message}</div>
            `;
            message.className = 'message error show';
            progressBar.style.width = '0%';
        } finally {
            setTimeout(() => {
                progressWrapper.classList.remove('active');
                button.disabled = false;
            }, 1000);
        }
    });

    // Enhanced drag and drop handling
    const dropZone = form.querySelector('.file-upload-label');
    const fileInput = form.querySelector('input[type="file"]');
    const labelText = dropZone.querySelector('.label-text');

    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    ['dragenter', 'dragover'].forEach(eventName => {
        dropZone.addEventListener(eventName, highlight, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, unhighlight, false);
    });

    function highlight() {
        dropZone.classList.add('has-file');
        dropZone.style.borderColor = '#4299e1';
        dropZone.style.backgroundColor = '#ebf8ff';
    }

    function unhighlight() {
        dropZone.classList.remove('has-file');
        dropZone.style.borderColor = '';
        dropZone.style.backgroundColor = '';
    }

    dropZone.addEventListener('drop', handleDrop, false);

    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;

        if (files.length > 0) {
            fileInput.files = files;
            const fileName = files[0].name;
            labelText.textContent = fileName.length > 20 
                ? fileName.substring(0, 20) + '...' 
                : fileName;
            dropZone.classList.add('has-file');
            
            // Show file size message
            const fileSize = (files[0].size / 1024 / 1024).toFixed(2);
            message.innerHTML = `
                <i class="fas fa-info-circle"></i>
                File selected: ${fileName} (${fileSize} MB)
            `;
            message.className = 'message show';
        }
    }
});

// Add file size validation tooltip
document.querySelectorAll('input[type="file"]').forEach(input => {
    input.addEventListener('change', function() {
        const file = this.files[0];
        if (file) {
            const fileSize = (file.size / 1024 / 1024).toFixed(2);
            const form = this.closest('form');
            const message = form.parentElement.querySelector('.message');
            
            if (file.size > 100 * 1024 * 1024) {
                message.innerHTML = `
                    <i class="fas fa-exclamation-triangle"></i>
                    File size (${fileSize} MB) exceeds maximum limit of 100MB
                `;
                message.className = 'message warning show';
            } else {
                message.innerHTML = `
                    <i class="fas fa-info-circle"></i>
                    File selected: ${file.name} (${fileSize} MB)
                `;
                message.className = 'message show';
            }
        }
    });
});