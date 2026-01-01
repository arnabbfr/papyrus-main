document.addEventListener('DOMContentLoaded', function() {
        const tabButtons = document.querySelectorAll('.tab-btn');
        tabButtons.forEach(button => {
            button.addEventListener('click', function() {
                const tab = this.dataset.tab;
                
                // Update active tab
                tabButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                
                
            });
        });

        // Card scrolling functionality
        const scrollLeftBtn = document.querySelector('.scroll-left');
        const scrollRightBtn = document.querySelector('.scroll-right');
        const cardsContainer = document.querySelector('.cards-container');

        function handleScroll(direction) {
            const scrollAmount = 300;
            if (direction === 'left') {
                cardsContainer.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
            } else {
                cardsContainer.scrollBy({ left: scrollAmount, behavior: 'smooth' });
            }
        }

        // Event listeners for scroll buttons
        if (scrollLeftBtn && scrollRightBtn && cardsContainer) {
            scrollLeftBtn.addEventListener('click', () => handleScroll('left'));
            scrollRightBtn.addEventListener('click', () => handleScroll('right'));
        }

        // Get Started button functionality
        const getStartedBtn = document.getElementById('getStartedBtn');
        if (getStartedBtn) {
            getStartedBtn.addEventListener('click', function() {
                
            });
        }

        
    });
    function NavToAuthOptions() {
        window.location.href = "signup-options.html";
    }
    function NavToLoginAuthOptions() {
        window.location.href = "login-options.html";
    }

    
    function NavToHome(){
            window.location.href = "login-options.html";
    }