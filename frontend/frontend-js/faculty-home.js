// Simple JavaScript to handle active states and interactions
        document.addEventListener('DOMContentLoaded', function() {
            // Sidebar items
            const sidebarItems = document.querySelectorAll('.sidebar-item');
            sidebarItems.forEach(item => {
                item.addEventListener('click', function() {
                    sidebarItems.forEach(i => i.classList.remove('active'));
                    this.classList.add('active');
                });
            });
            
            // Bottom nav items
            const navItems = document.querySelectorAll('.nav-item');
            navItems.forEach(item => {
                item.addEventListener('click', function() {
                    navItems.forEach(i => i.classList.remove('active'));
                    this.classList.add('active');
                });
            });
        });
        // Get references to the cards
        const attendanceCard = document.getElementById('student-card');
        const uploadCard = document.getElementById('teacher-card');
        const eventCard = document.getElementById('teacher-card');
        const reportsCard = document.getElementById('teacher-card');
        
        // Function to handle card clicks
        function handleCardClick(card) {
        // Add clicked class for visual feedback
        card.classList.add('clicked');
        
        // Get the redirect URL from the data-redirect attribute
        const redirectUrl = card.getAttribute('data-redirect');
        
        // Redirect after a small delay for the animation to complete
        setTimeout(() => {
            window.location.href = "SignUp.html";
        }, 300);
        }

        function handleTeacherCardClick(card) {
        // Add clicked class for visual feedback
        card.classList.add('clicked');
        
        // Get the redirect URL from the data-redirect attribute
        const redirectUrl = card.getAttribute('data-redirect');
        
        // Redirect after a small delay for the animation to complete
        setTimeout(() => {
            window.location.href = "Faculty-signup.html";
        }, 300);
        }
        
        // Add click event listeners to each card
        studentCard.addEventListener('click', function() {
        handleCardClick(this);
        });
        
        teacherCard.addEventListener('click', function() {
            handleTeacherCardClick(this);
        });
        
        // Add click event listeners to the buttons inside the cards
        const studentButton = studentCard.querySelector('.sign-up-btn');
        const teacherButton = teacherCard.querySelector('.sign-up-btn');
        
        studentButton.addEventListener('click', function(event) {
        // Prevent the event from bubbling up to the card
        event.stopPropagation();
        handleCardClick(studentCard);
        });
        
        teacherButton.addEventListener('click', function(event) {
        // Prevent the event from bubbling up to the card
        event.stopPropagation();
        handleCardClick(teacherCard);
        });

       document.addEventListener('DOMContentLoaded', function() {
        const settingsItem = document.getElementById('settings-item');
        
        settingsItem.addEventListener('click', function(e) {
            e.preventDefault();
            this.classList.toggle('active');
        });
        
        // Close dropdown when clicking elsewhere
        document.addEventListener('click', function(e) {
            if (!settingsItem.contains(e.target)) {
                settingsItem.classList.remove('active');
            }
        });
    });