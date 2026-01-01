// Function to display images from local storage
        function displayGallery() {
            const gallery = document.getElementById("gallery");
            const errorMessage = document.getElementById("errorMessage");
            
            try {
                // Fetch files from local storage
                const papyrusData = localStorage.getItem('papyrusFiles');
                
                if (!papyrusData) {
                    gallery.innerHTML = "<p class='empty-gallery'>No images available. Upload some photos first!</p>";
                    return;
                }
                
                const files = JSON.parse(papyrusData);
                
                if (!Array.isArray(files) || files.length === 0) {
                    gallery.innerHTML = "<p class='empty-gallery'>No images available.</p>";
                    return;
                }
                
                // Filter only image files
                const imageFiles = files.filter(file => 
                    file && 
                    file.type && 
                    file.type.startsWith('image/') && 
                    file.category === 'photo-gallery' && 
                    file.data
                );
                
                if (imageFiles.length === 0) {
                    gallery.innerHTML = "<p class='empty-gallery'>No images found in the gallery. Upload some photos first!</p>";
                    return;
                }
                
                // Display the gallery items
                gallery.innerHTML = imageFiles.map((file, index) => `
                    <div class="gallery-item">
                        <img src="${file.data}" alt="${file.name}" onclick="showFullscreen('${file.data}')">
                        <div class="gallery-item-info">${file.name}</div>
                        <div class="gallery-item-actions">
                            <button class="action-btn" onclick="viewImage(${index})">View</button>
                            <button class="action-btn" onclick="downloadImage(${index})">Download</button>
                        </div>
                    </div>
                `).join("");
                
                console.log(`Found ${imageFiles.length} images in local storage`);
            } catch (error) {
                gallery.innerHTML = "<p class='empty-gallery'>Error loading gallery.</p>";
                errorMessage.textContent = `Error: ${error.message}`;
                console.error("Error loading gallery:", error);
            }
        }

        // Function to view image in fullscreen
        function viewImage(index) {
            try {
                const files = JSON.parse(localStorage.getItem('papyrusFiles') || '[]');
                const imageFiles = files.filter(file => 
                    file && file.type && file.type.startsWith('image/') && file.category === 'photo-gallery'
                );
                
                if (index >= 0 && index < imageFiles.length) {
                    showFullscreen(imageFiles[index].data);
                }
            } catch (error) {
                document.getElementById("errorMessage").textContent = `View error: ${error.message}`;
                console.error("View error:", error);
            }
        }
        
        // Show fullscreen overlay
        function showFullscreen(imageSrc) {
            const fullscreenView = document.getElementById("fullscreenView");
            const fullscreenImage = document.getElementById("fullscreenImage");
            
            fullscreenImage.src = imageSrc;
            fullscreenView.style.display = "flex";
            
            // Prevent scrolling of the background
            document.body.style.overflow = "hidden";
        }
        
        // Close fullscreen overlay
        function closeFullscreen() {
            document.getElementById("fullscreenView").style.display = "none";
            document.body.style.overflow = "auto";
        }

        // Function to download an image
        function downloadImage(index) {
            try {
                const files = JSON.parse(localStorage.getItem('papyrusFiles') || '[]');
                const imageFiles = files.filter(file => 
                    file && file.type && file.type.startsWith('image/') && file.category === 'photo-gallery'
                );
                const errorMessage = document.getElementById("errorMessage");
                errorMessage.textContent = "";
                
                if (index >= 0 && index < imageFiles.length) {
                    const file = imageFiles[index];
                    
                    // Check if file has data
                    if (!file.data) {
                        errorMessage.textContent = "Image data is missing. Cannot download.";
                        console.error("Image data missing for:", file.name);
                        return;
                    }
                    
                    // Create download link
                    const link = document.createElement('a');
                    link.href = file.data;
                    link.download = file.name;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                } else {
                    errorMessage.textContent = "Image index out of range.";
                }
            } catch (error) {
                document.getElementById("errorMessage").textContent = `Download error: ${error.message}`;
                console.error("Download error:", error);
            }
        }

        // Display gallery when page loads
        document.addEventListener("DOMContentLoaded", displayGallery);
        
        // Close fullscreen when Escape key is pressed
        document.addEventListener('keydown', function(event) {
            if (event.key === 'Escape') {
                closeFullscreen();
            }
        });