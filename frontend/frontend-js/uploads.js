// File handling and localStorage implementation
document.addEventListener("DOMContentLoaded", function () {
    const dropArea = document.getElementById("drop-area");
    const fileInput = document.getElementById("file-input");
    const uploadsList = document.getElementById("uploads-list");
    let currentUploadType = "";

    // Open file dialog on click
    dropArea.addEventListener("click", () => fileInput.click());

    // Handle file selection
    fileInput.addEventListener("change", function () {
        handleFiles(fileInput.files);
    });

    // Drag and drop functionality
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    dropArea.addEventListener('dragenter', () => dropArea.classList.add('highlight'));
    dropArea.addEventListener('dragleave', () => dropArea.classList.remove('highlight'));
    dropArea.addEventListener('drop', (e) => {
        dropArea.classList.remove('highlight');
        const dt = e.dataTransfer;
        const files = dt.files;
        handleFiles(files);
    });

    function handleFiles(files) {
        [...files].forEach(file => {
            // Create UI element
            let fileItem = document.createElement("div");
            fileItem.classList.add("file-item");

            let fileType = file.type.includes("image") ? "🖼" : file.type.includes("pdf") ? "📄" : "📁";
            const fileId = `file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            
            fileItem.innerHTML = `
                <span class="file-type">${fileType}</span>
                <span class="file-name">${file.name}</span>
                <span class="file-size">${(file.size / 1024 / 1024).toFixed(2)} MB</span>
                <button class="preview-btn" data-id="${fileId}">👁</button>
                <button class="delete-btn" data-id="${fileId}">🗑</button>
                <div class="progress-bar"><div class="progress" style="width: 0%;"></div></div>
            `;

            uploadsList.appendChild(fileItem);

            // Simulate Upload Progress
            let progressBar = fileItem.querySelector(".progress");
            let uploadSpeed = Math.random() * (1000 - 300) + 300;
            let interval = setInterval(() => {
                let width = parseInt(progressBar.style.width || "0");
                if (width >= 100) {
                    clearInterval(interval);
                    saveFileToLocalStorage(file, fileId, currentUploadType);
                } else {
                    progressBar.style.width = (width + 10) + "%";
                }
            }, uploadSpeed);

            // Preview File
            fileItem.querySelector(".preview-btn").addEventListener("click", () => {
                let url = URL.createObjectURL(file);
                window.open(url, "_blank");
            });

            // Delete File
            fileItem.querySelector(".delete-btn").addEventListener("click", () => {
                removeFileFromLocalStorage(fileId);
                fileItem.remove();
            });
        });
    }

    // Save file to localStorage
    function saveFileToLocalStorage(file, fileId, category) {
        const reader = new FileReader();
        reader.onload = function(event) {
            const fileData = {
                id: fileId,
                name: file.name,
                type: file.type,
                category: category,
                size: file.size,
                data: event.target.result,
                uploadDate: new Date().toISOString()
            };
            
            // Get existing files or initialize empty array
            let files = JSON.parse(localStorage.getItem('papyrusFiles')) || [];
            files.push(fileData);
            
            try {
                localStorage.setItem('papyrusFiles', JSON.stringify(files));
                console.log(`File ${file.name} saved to localStorage under ${category}`);
            } catch (e) {
                if (e.name === 'QuotaExceededError') {
                    alert('Storage quota exceeded! The file is too large to store.');
                } else {
                    alert('Failed to save the file to localStorage.');
                }
                console.error(e);
            }
        };
        
        reader.readAsDataURL(file);
    }

    // Remove file from localStorage
    function removeFileFromLocalStorage(fileId) {
        let files = JSON.parse(localStorage.getItem('papyrusFiles')) || [];
        files = files.filter(file => file.id !== fileId);
        localStorage.setItem('papyrusFiles', JSON.stringify(files));
        console.log(`File with ID ${fileId} removed from localStorage`);
    }

    // Open Upload Dialog with category
    window.showUpload = function(category) {
        const dialog = document.getElementById("upload-dialog");
        const uploadTitle = document.getElementById("upload-title");
        currentUploadType = category;
        
        // Format the category name for display
        let displayTitle = category.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
        uploadTitle.innerHTML = `<p class="bold">Upload ${displayTitle}</p>`;
        
        dialog.style.display = "block";
        uploadsList.innerHTML = ''; // Clear previous uploads list
    };

    // Close Upload Dialog
    window.closeDialog = function() {
        const dialog = document.getElementById("upload-dialog");
        dialog.style.display = "none";
        uploadsList.innerHTML = ''; // Clear uploads list
    };
});
