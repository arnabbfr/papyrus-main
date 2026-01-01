// Get references to the cards
    const studentCard = document.getElementById('student-card');
    const teacherCard = document.getElementById('teacher-card');
    
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