// Onboarding JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Check authentication
    if (localStorage.getItem('userLoggedIn') !== 'true') {
        window.location.href = 'login.html';
        return;
    }
    
    const steps = document.querySelectorAll('.step');
    const progressFill = document.getElementById('progress-fill');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const submitBtn = document.getElementById('submit-btn');
    const onboardingForm = document.getElementById('onboarding-form');
    
    let currentStep = 0;
    const totalSteps = steps.length;
    
    // Goal selection handling
    const goalOptions = document.querySelectorAll('.goal-option');
    const goalInput = document.getElementById('goal');
    
    goalOptions.forEach(option => {
        option.addEventListener('click', function() {
            goalOptions.forEach(opt => opt.classList.remove('selected'));
            this.classList.add('selected');
            goalInput.value = this.dataset.goal;
        });
    });
    
    // Height input handling
    const heightCm = document.getElementById('height-cm');
    const heightM = document.getElementById('height-m');
    
    heightCm.addEventListener('input', function() {
        if (this.value) {
            heightM.value = '';
        }
    });
    
    heightM.addEventListener('input', function() {
        if (this.value) {
            heightCm.value = '';
        }
    });
    
    // Update progress bar
    function updateProgress() {
        const progressPercent = ((currentStep + 1) / totalSteps) * 100;
        progressFill.style.width = progressPercent + '%';
    }
    
    // Show current step
    function showStep(stepIndex) {
        steps.forEach((step, index) => {
            step.classList.toggle('active', index === stepIndex);
        });
        
        prevBtn.disabled = stepIndex === 0;
        
        if (stepIndex === totalSteps - 1) {
            nextBtn.classList.add('hidden');
            submitBtn.classList.remove('hidden');
        } else {
            nextBtn.classList.remove('hidden');
            submitBtn.classList.add('hidden');
        }
        
        updateProgress();
    }
    
    // Validate current step
    function validateStep(stepIndex) {
        const currentStepElement = steps[stepIndex];
        const requiredInputs = currentStepElement.querySelectorAll('input[required], select[required]');
        
        for (let input of requiredInputs) {
            if (!input.value.trim()) {
                input.focus();
                return false;
            }
        }
        
        // Special validation for height
        if (stepIndex === 0) {
            const heightCmValue = document.getElementById('height-cm').value;
            const heightMValue = document.getElementById('height-m').value;
            
            if (!heightCmValue && !heightMValue) {
                alert('Please enter your height in either cm or meters');
                return false;
            }
        }
        
        // Special validation for goal selection
        if (stepIndex === 1) {
            if (!goalInput.value) {
                alert('Please select your health goal');
                return false;
            }
        }
        
        return true;
    }
    
    // Next button click
    nextBtn.addEventListener('click', function() {
        if (validateStep(currentStep)) {
            currentStep++;
            showStep(currentStep);
        }
    });
    
    // Previous button click
    prevBtn.addEventListener('click', function() {
        currentStep--;
        showStep(currentStep);
    });
    
    // Form submission
    onboardingForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (!validateStep(currentStep)) {
            return;
        }
        
        // Collect all form data
        const formData = {
            weight: parseFloat(document.getElementById('weight').value),
            height: document.getElementById('height-cm').value ? 
                   parseInt(document.getElementById('height-cm').value) : 
                   parseFloat(document.getElementById('height-m').value) * 100,
            age: parseInt(document.getElementById('age').value),
            gender: document.getElementById('gender').value,
            goal: document.getElementById('goal').value,
            targetWeight: parseFloat(document.getElementById('target-weight').value),
            timePeriod: parseInt(document.getElementById('time-period').value),
            activityLevel: document.getElementById('activity-level').value,
            allergies: Array.from(document.querySelectorAll('input[type="checkbox"]:checked')).map(cb => cb.value)
        };
        
        // Calculate BMI
        const heightInM = formData.height / 100;
        const bmi = formData.weight / (heightInM * heightInM);
        formData.bmi = Math.round(bmi * 10) / 10;
        
        // Calculate daily calorie needs (Mifflin-St Jeor Equation)
        let bmr;
        if (formData.gender === 'male') {
            bmr = 88.362 + (13.397 * formData.weight) + (4.799 * formData.height) - (5.677 * formData.age);
        } else {
            bmr = 447.593 + (9.247 * formData.weight) + (3.098 * formData.height) - (4.330 * formData.age);
        }
        
        // Activity multipliers
        const activityMultipliers = {
            'sedentary': 1.2,
            'light': 1.375,
            'moderate': 1.55,
            'active': 1.725,
            'very-active': 1.9
        };
        
        const tdee = bmr * activityMultipliers[formData.activityLevel];
        
        // Adjust calories based on goal
        if (formData.goal === 'lose') {
            formData.dailyCalories = Math.round(tdee - 500); // 500 calorie deficit for ~1lb/week loss
        } else if (formData.goal === 'gain') {
            formData.dailyCalories = Math.round(tdee + 500); // 500 calorie surplus for ~1lb/week gain
        } else {
            formData.dailyCalories = Math.round(tdee); // Maintenance calories
        }
        
        // Store user data
        localStorage.setItem('userData', JSON.stringify(formData));
        localStorage.setItem('onboardingComplete', 'true');
        
        // Show success message and redirect
        alert('Profile setup complete! Welcome to Aarogyata!');
        window.location.href = 'dashboard.html';
    });
    
    // Initialize first step
    showStep(0);
});
