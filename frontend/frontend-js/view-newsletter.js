// This script will update the current date and can be expanded to handle newsletter loading
        document.addEventListener('DOMContentLoaded', function() {
            const options = { year: 'numeric', month: 'long', day: 'numeric' };
            const formattedDate = new Date().toLocaleDateString('en-US', options);
            document.getElementById('current-date').textContent = formattedDate;
            
            // Function to load newsletter content - this is where you would implement your content loading
            function loadNewsletter(newsletterId) {
                const newsletterDisplay = document.getElementById('newsletter-display');
                
                
                if (newsletterId) {
                    
                    newsletterDisplay.innerHTML = `<p style="text-align: center; margin-top: 200px;">Loading newsletter ID: ${newsletterId}...</p>`;
                }
            }
            
            const urlParams = new URLSearchParams(window.location.search);
            const newsletterId = urlParams.get('id');
            if (newsletterId) {
                loadNewsletter(newsletterId);
            }
        });
        // This code should be added to Viewing.html inside the script tag
    document.addEventListener('DOMContentLoaded', function() {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = new Date().toLocaleDateString('en-US', options);
    document.getElementById('current-date').textContent = formattedDate;
    
    // Function to load newsletter content from localStorage
    function loadNewsletters() {
        const newsletterDisplay = document.getElementById('newsletter-display');
        
        try {
            // Fetch files from localStorage
            const papyrusData = localStorage.getItem('papyrusFiles');
            
            if (!papyrusData) {
                newsletterDisplay.innerHTML = "<p style='text-align: center;' class='normal'>No newsletters available yet. Please upload one first.</p>";
                return;
            }
            
            const files = JSON.parse(papyrusData);
            
            // Filter only newsletter files
            const newsletters = files.filter(file => file && file.category === 'newsletter');
            
            if (newsletters.length === 0) {
                newsletterDisplay.innerHTML = "<p style='text-align: center;' class='normal'>No newsletters available yet. Please upload one first.</p>";
                return;
            }
            
            // Get the latest newsletter (assuming the last one added is the latest)
            const latestNewsletter = newsletters[newsletters.length - 1];
            
            // Create newsletter selection dropdown
            let newsletterOptions = '<div style="margin-bottom: 20px;"><label for="newsletter-select">Select Newsletter: </label>';
            newsletterOptions += '<select id="newsletter-select" class="normal" style="padding: 5px; border-radius: 5px; margin-left: 10px;">';
            
            newsletters.forEach((newsletter, index) => {
                const date = new Date(newsletter.uploadDate).toLocaleDateString('en-US', options);
                newsletterOptions += `<option value="${index}" ${index === newsletters.length - 1 ? 'selected' : ''}>${date} - ${newsletter.name}</option>`;
            });
            
            newsletterOptions += '</select></div>';
            
            // Display content based on file type
            const displayContent = createContentDisplay(latestNewsletter);
            
            newsletterDisplay.innerHTML = newsletterOptions + displayContent;
            
            // Add event listener to the dropdown to change the displayed newsletter
            document.getElementById('newsletter-select').addEventListener('change', function() {
                const selectedIndex = this.value;
                const selectedNewsletter = newsletters[selectedIndex];
                const contentArea = document.getElementById('newsletter-content-area');
                contentArea.innerHTML = createContentDisplay(selectedNewsletter, false);
            });
            
            console.log(`Found ${newsletters.length} newsletters in local storage`);
        } catch (error) {
            newsletterDisplay.innerHTML = `<p style='text-align: center;' class='normal'>Error loading newsletters: ${error.message}</p>`;
            console.error("Error loading newsletters:", error);
        }
    }
    
    // Function to create content display based on file type
    function createContentDisplay(file, includeWrapper = true) {
        let content = '';
        
        if (file.type.includes('image')) {
            // Display image
            content = `<img src="${file.data}" alt="${file.name}" style="max-width: 100%; max-height: 700px; display: block; margin: 0 auto;">`;
        } else if (file.type.includes('pdf')) {
            // Display PDF embed
            content = `<embed src="${file.data}" type="application/pdf" width="100%" height="600px">`;
        } else if (file.type.includes('text')) {
            // Display text content
            try {
                // Attempt to extract text content from data URL
                const base64Content = file.data.split(',')[1];
                const decodedContent = atob(base64Content);
                content = `<pre style="white-space: pre-wrap; font-family: inherit;">${decodedContent}</pre>`;
            } catch (e) {
                content = `<p>Unable to display text content. <a href="#" onclick="downloadNewsletter('${file.id}'); return false;">Download instead</a></p>`;
            }
        } else {
            // For other file types, offer download
            content = `<div style="text-align: center; padding: 50px;">
                <p>This file type cannot be previewed directly.</p>
                <button class="btn" onclick="downloadNewsletter('${file.id}')">Download Newsletter</button>
            </div>`;
        }
        
        if (includeWrapper) {
            return `<div id="newsletter-content-area">${content}</div>`;
        } else {
            return content;
        }
    }
    
    // Add download function to window scope
    window.downloadNewsletter = function(fileId) {
        try {
            const files = JSON.parse(localStorage.getItem('papyrusFiles') || '[]');
            const file = files.find(f => f.id === fileId);
            
            if (!file || !file.data) {
                alert("File content is missing. Cannot download.");
                return;
            }
            
            // Create download link
            const link = document.createElement('a');
            link.href = file.data;
            link.download = file.name;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
        } catch (error) {
            alert(`Download error: ${error.message}`);
            console.error("Download error:", error);
        }
    };
    
    // Load newsletters when page loads
    loadNewsletters();
});

// Add this function to the existing script in Viewing.html
function clearNewsletters() {
    if (confirm("Are you sure you want to clear all newsletters? This action cannot be undone.")) {
        try {
            // Get all files from localStorage
            const papyrusData = localStorage.getItem('papyrusFiles');
            
            if (!papyrusData) {
                alert("No data found in storage.");
                return;
            }
            
            let files = JSON.parse(papyrusData);
            
            // Filter out newsletter files
            const filteredFiles = files.filter(file => file.category !== 'newsletter');
            
            // Save the filtered files back to localStorage
            localStorage.setItem('papyrusFiles', JSON.stringify(filteredFiles));
            
            // Refresh the newsletter display
            alert("All newsletters have been cleared successfully.");
            document.getElementById('newsletter-display').innerHTML = "<p style='text-align: center;' class='normal'>No newsletters available yet. Please upload one first.</p>";
            
            console.log("Newsletters cleared from localStorage");
        } catch (error) {
            alert(`Error clearing newsletters: ${error.message}`);
            console.error("Error clearing newsletters:", error);
        }
    }
}

// Add this to window object to make it accessible from HTML
window.clearNewsletters = clearNewsletters;