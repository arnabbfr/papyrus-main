// Function to display files from local storage
        function displayFiles() {
            const fileList = document.getElementById("fileList");
            const errorMessage = document.getElementById("errorMessage");
            
            try {
                // Fetch files from local storage
                const papyrusData = localStorage.getItem('papyrusFiles');
                
                if (!papyrusData) {
                    fileList.innerHTML = '<div class="empty-message">No files available. Please upload question papers first.</div>';
                    return;
                }
                
                const files = JSON.parse(papyrusData);
                
                // Filter files by category - only show question papers
                const questionPapers = files.filter(file => file && file.category === 'question-papers');
                
                if (!questionPapers.length) {
                    fileList.innerHTML = '<div class="empty-message">No question papers available. Please upload some first.</div>';
                    return;
                }
                
                fileList.innerHTML = questionPapers.map((file, index) => `
                    <li>
                        <span>${file.name}</span>
                        <button class="download-btn" onclick="downloadFile('${file.id}')">Download</button>
                    </li>
                `).join("");
                
                console.log(`Found ${questionPapers.length} question papers in local storage`);
            } catch (error) {
                fileList.innerHTML = "Error loading files.";
                errorMessage.textContent = `Error: ${error.message}`;
                console.error("Error loading files:", error);
            }
        }

        // Function to download a file
        function downloadFile(fileId) {
            try {
                const files = JSON.parse(localStorage.getItem('papyrusFiles') || '[]');
                const errorMessage = document.getElementById("errorMessage");
                errorMessage.textContent = "";
                
                // Find the file by ID
                const file = files.find(f => f.id === fileId);
                
                if (!file) {
                    errorMessage.textContent = "File not found.";
                    return;
                }
                
                // Use file.data which is where the content is stored
                if (!file.data) {
                    errorMessage.textContent = "File data is missing. Cannot download.";
                    console.error("File data missing for:", file.name);
                    return;
                }
                
                // Create download link using the data URL
                const link = document.createElement('a');
                link.href = file.data; // This is already a data URL
                link.download = file.name;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                
                console.log(`File ${file.name} downloaded successfully`);
            } catch (error) {
                document.getElementById("errorMessage").textContent = `Download error: ${error.message}`;
                console.error("Download error:", error);
            }
        }

        // Display files when page loads
        document.addEventListener("DOMContentLoaded", displayFiles);