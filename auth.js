// Authentication JavaScript
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const formTitle = document.getElementById('form-title');
    const formSubtitle = document.getElementById('form-subtitle');
    const toggleText = document.getElementById('toggle-text');
    const toggleLink = document.getElementById('toggle-link');
    
    let isLoginMode = true;
    
    // Toggle between login and register forms
    toggleLink.addEventListener('click', function() {
        isLoginMode = !isLoginMode;
        
        if (isLoginMode) {
            loginForm.classList.remove('hidden');
            registerForm.classList.add('hidden');
            formTitle.textContent = 'Welcome Back';
            formSubtitle.textContent = 'Sign in to continue your health journey';
            toggleText.innerHTML = 'Don\'t have an account? <span id="toggle-link">Sign up</span>';
        } else {
            loginForm.classList.add('hidden');
            registerForm.classList.remove('hidden');
            formTitle.textContent = 'Create Account';
            formSubtitle.textContent = 'Join us to start your health transformation';
            toggleText.innerHTML = 'Already have an account? <span id="toggle-link">Sign in</span>';
        }
        
        // Re-attach event listener to new toggle link
        document.getElementById('toggle-link').addEventListener('click', arguments.callee);
    });
    
    // Handle login form submission
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        
        // Simulate login (replace with actual authentication)
        if (email && password) {
            // Store user session
            localStorage.setItem('userLoggedIn', 'true');
            localStorage.setItem('userEmail', email);
            localStorage.setItem('userName', email.split('@')[0]);
            
            // Check if user has completed onboarding
            const hasCompletedOnboarding = localStorage.getItem('onboardingComplete');
            
            if (hasCompletedOnboarding) {
                window.location.href = 'dashboard.html';
            } else {
                window.location.href = 'onboarding.html';
            }
        } else {
            alert('Please fill in all fields');
        }
    });
    
    // Handle register form submission
    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = document.getElementById('register-name').value;
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;
        
        // Simulate registration (replace with actual authentication)
        if (name && email && password) {
            // Store user data
            localStorage.setItem('userLoggedIn', 'true');
            localStorage.setItem('userEmail', email);
            localStorage.setItem('userName', name);
            
            // Redirect to onboarding
            window.location.href = 'onboarding.html';
        } else {
            alert('Please fill in all fields');
        }
    });
    
    // Check if user is already logged in
    if (localStorage.getItem('userLoggedIn') === 'true') {
        const hasCompletedOnboarding = localStorage.getItem('onboardingComplete');
        
        if (hasCompletedOnboarding) {
            window.location.href = 'dashboard.html';
        }
    }
});
