 document.addEventListener('DOMContentLoaded', function() {
        const signupForm = document.getElementById('facultysignupForm');
        const formContainer = document.getElementById('facultyformContainer');
        const messageDiv = document.getElementById('messageDiv'); // Add this line to reference the message div
        
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const dob = document.getElementById('dob').value;

            //  create form data object
            const formData = new FormData();
            formData.append('name', name);
            formData.append('email', email);
            formData.append('password', password);
            formData.append('dob', dob);

            // Send data to server using fetch API
            fetch('facultysignup.php', { // Remove ./ for consistency
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            })
            
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    messageDiv.innerHTML = `<p class="success-message">✅ ${data.message} Redirecting to login...</p>`;
                    
                    // Redirect to login page after 2 seconds
                    setTimeout(() => {
                        window.location.href = "Faculty-login.html";
                    }, 2000);
                } else {
                    messageDiv.innerHTML = `<p class="error-message">❌ ${data.message}</p>`;
                }
            })
            .catch(error => {
                messageDiv.innerHTML = `<p class="error-message">❌ An error occurred. Please try again.</p>`;
                console.error('Error:', error);
            });
         
        });
    });