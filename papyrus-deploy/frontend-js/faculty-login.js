document.addEventListener('DOMContentLoaded', function() {
            const loginForm = document.getElementById('loginForm');
            const messageDiv = document.getElementById('message');
            
            loginForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                const email = document.getElementById('email').value;
                const password = document.getElementById('password').value;

                // Create form data object
                const formData = new FormData();
                formData.append('email', email);
                formData.append('password', password);

                // Send data to server using fetch API
                fetch('facultylogin.php', {
                    method: 'POST',
                    body: formData
                })
                
                .then(response => response.json())
                .then(data => {
                    if (data.status === 'success') {
                        messageDiv.innerHTML = `<p class="success-message">✅ ${data.message} Redirecting...</p>`;
                        
                        // Redirect to homepage after 1 second
                        setTimeout(() => {
                            window.location.href = "FacultyHome.html";
                        }, 1000);
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