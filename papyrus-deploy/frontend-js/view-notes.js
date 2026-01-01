 document.addEventListener('DOMContentLoaded', function() {
            loadNotes();
            
            // Add event listener for sort filter
            document.getElementById('sort-filter').addEventListener('change', function() {
                loadNotes();
            });
            
            function loadNotes() {
                const notesGrid = document.getElementById('notes-grid');
                const noNotesMessage = document.getElementById('no-notes');
                const sortFilter = document.getElementById('sort-filter').value;
                
                // Retrieve files from localStorage
                let files = JSON.parse(localStorage.getItem('papyrusFiles')) || [];
                
                // Filter only notes & minutes files
                const notesFiles = files.filter(file => file.category === 'notices&minutes');
                
                // Sort files based on selected filter
                switch(sortFilter) {
                    case 'newest':
                        notesFiles.sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate));
                        break;
                    case 'oldest':
                        notesFiles.sort((a, b) => new Date(a.uploadDate) - new Date(b.uploadDate));
                        break;
                    case 'name-asc':
                        notesFiles.sort((a, b) => a.name.localeCompare(b.name));
                        break;
                    case 'name-desc':
                        notesFiles.sort((a, b) => b.name.localeCompare(a.name));
                        break;
                }
                
                // Clear previous content
                notesGrid.innerHTML = '';
                
                // Display no notes message if no files found
                if (notesFiles.length === 0) {
                    noNotesMessage.style.display = 'block';
                    return;
                } else {
                    noNotesMessage.style.display = 'none';
                }
                
                // Create cards for each note
                notesFiles.forEach(file => {
                    const fileDate = new Date(file.uploadDate);
                    const formattedDate = fileDate.toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric' 
                    });
                    
                    // Determine file icon based on type
                    let fileIcon = '📄';
                    if (file.type.includes('pdf')) {
                        fileIcon = '📑';
                    } else if (file.type.includes('word') || file.type.includes('document')) {
                        fileIcon = '📝';
                    } else if (file.type.includes('text')) {
                        fileIcon = '📋';
                    }
                    
                    // Format file size
                    const fileSize = formatFileSize(file.size);
                    
                    // Create note card
                    const noteCard = document.createElement('div');
                    noteCard.className = 'note-card';
                    noteCard.innerHTML = `
                        <div class="note-icon">${fileIcon}</div>
                        <h3 class="note-title">${file.name}</h3>
                        <div class="note-date">Uploaded on ${formattedDate}</div>
                        <div class="note-size">${fileSize}</div>
                        <div class="note-actions">
                            <a href="#" class="btn view-btn" data-id="${file.id}">View</a>
                            <a href="#" class="btn btn-secondary download-btn" data-id="${file.id}">Download</a>
                        </div>
                    `;
                    
                    notesGrid.appendChild(noteCard);
                });
                
                // Add event listeners for view and download buttons
                document.querySelectorAll('.view-btn').forEach(btn => {
                    btn.addEventListener('click', function(e) {
                        e.preventDefault();
                        const fileId = this.getAttribute('data-id');
                        viewFile(fileId);
                    });
                });
                
                document.querySelectorAll('.download-btn').forEach(btn => {
                    btn.addEventListener('click', function(e) {
                        e.preventDefault();
                        const fileId = this.getAttribute('data-id');
                        downloadFile(fileId);
                    });
                });
            }
            
            function formatFileSize(bytes) {
                if (bytes === 0) return '0 Bytes';
                
                const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
                const i = Math.floor(Math.log(bytes) / Math.log(1024));
                
                return parseFloat((bytes / Math.pow(1024, i)).toFixed(2)) + ' ' + sizes[i];
            }
            
            function viewFile(fileId) {
                const files = JSON.parse(localStorage.getItem('papyrusFiles')) || [];
                const file = files.find(f => f.id === fileId);
                
                if (file) {
                    // Open file in new window or tab
                    const newWindow = window.open('', '_blank');
                    
                    if (file.type.includes('pdf') || file.type.includes('image')) {
                        // For PDFs and images, directly show the file
                        newWindow.document.write(`
                            <html>
                                <head>
                                    <title>${file.name}</title>
                                    <style>
                                        body { margin: 0; display: flex; justify-content: center; }
                                        object, img { max-width: 100%; height: auto; }
                                    </style>
                                </head>
                                <body>
                                    ${file.type.includes('pdf') 
                                        ? `<object data="${file.data}" type="application/pdf" width="100%" height="100%">
                                            <p>Unable to display PDF. <a href="${file.data}" download="${file.name}">Download</a> instead.</p>
                                          </object>`
                                        : `<img src="${file.data}" alt="${file.name}" />`
                                    }
                                </body>
                            </html>
                        `);
                    } else if (file.type.includes('text')) {
                        // For text files, attempt to display content
                        fetch(file.data)
                            .then(response => response.text())
                            .then(text => {
                                newWindow.document.write(`
                                    <html>
                                        <head>
                                            <title>${file.name}</title>
                                            <style>
                                                body { font-family: Arial, sans-serif; padding: 20px; line-height: 1.6; }
                                                pre { white-space: pre-wrap; }
                                            </style>
                                        </head>
                                        <body>
                                            <h1>${file.name}</h1>
                                            <pre>${text}</pre>
                                        </body>
                                    </html>
                                `);
                            })
                            .catch(error => {
                                // If can't read as text, provide download link
                                newWindow.document.write(`
                                    <html>
                                        <head>
                                            <title>${file.name}</title>
                                            <style>
                                                body { font-family: Arial, sans-serif; padding: 20px; text-align: center; }
                                            </style>
                                        </head>
                                        <body>
                                            <h1>Cannot display this file directly</h1>
                                            <p>This file type cannot be previewed in the browser.</p>
                                            <p><a href="${file.data}" download="${file.name}">Click here to download</a></p>
                                        </body>
                                    </html>
                                `);
                            });
                    } else {
                        // For other file types, provide download link
                        newWindow.document.write(`
                            <html>
                                <head>
                                    <title>${file.name}</title>
                                    <style>
                                        body { font-family: Arial, sans-serif; padding: 20px; text-align: center; }
                                    </style>
                                </head>
                                <body>
                                    <h1>Cannot display this file directly</h1>
                                    <p>This file type cannot be previewed in the browser.</p>
                                    <p><a href="${file.data}" download="${file.name}">Click here to download</a></p>
                                </body>
                            </html>
                        `);
                    }
                    
                    newWindow.document.close();
                }
            }
            
            function downloadFile(fileId) {
                const files = JSON.parse(localStorage.getItem('papyrusFiles')) || [];
                const file = files.find(f => f.id === fileId);
                
                if (file) {
                    // Create download link
                    const a = document.createElement('a');
                    a.href = file.data;
                    a.download = file.name;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                }
            }
        });