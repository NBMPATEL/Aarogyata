// Dashboard JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Check authentication
    if (localStorage.getItem('userLoggedIn') !== 'true') {
        window.location.href = 'login.html';
        return;
    }
    
    // Initialize dashboard
    loadUserData();
    initializeSidebar();
    initializeBMICalculator();
    initializeCalorieCounter();
    initializeDietPlanner();
    initializeAIChat();
    
    // Load user data and display
    function loadUserData() {
        const userName = localStorage.getItem('userName') || 'User';
        const userEmail = localStorage.getItem('userEmail') || 'user@example.com';
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        
        // Update user info in sidebar
        document.getElementById('user-name').textContent = userName;
        document.getElementById('user-email').textContent = userEmail;
        
        // Update dashboard stats
        if (userData.weight) {
            document.getElementById('current-weight').textContent = userData.weight + ' kg';
        }
        if (userData.targetWeight) {
            document.getElementById('target-weight-display').textContent = userData.targetWeight + ' kg';
        }
        if (userData.dailyCalories) {
            document.getElementById('daily-calories').textContent = userData.dailyCalories + ' cal';
            document.getElementById('calorie-goal').textContent = userData.dailyCalories;
            document.getElementById('calories-remaining').textContent = userData.dailyCalories;
        }
        if (userData.bmi) {
            document.getElementById('bmi-display').textContent = userData.bmi;
        }
    }
    
    // Initialize sidebar navigation
    function initializeSidebar() {
        const sidebarToggle = document.getElementById('sidebar-toggle');
        const sidebar = document.getElementById('sidebar');
        const navItems = document.querySelectorAll('.nav-item');
        const contentSections = document.querySelectorAll('.content-section');
        
        // Sidebar toggle for mobile
        sidebarToggle.addEventListener('click', function() {
            sidebar.classList.toggle('active');
        });
        
        // Navigation handling
        navItems.forEach(item => {
            item.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Remove active class from all nav items
                navItems.forEach(nav => nav.classList.remove('active'));
                
                // Add active class to clicked item
                this.classList.add('active');
                
                // Hide all content sections
                contentSections.forEach(section => section.classList.remove('active'));
                
                // Show target content section
                const targetSection = this.dataset.section;
                document.getElementById(targetSection).classList.add('active');
                
                // Close sidebar on mobile
                sidebar.classList.remove('active');
            });
        });
        
        // Logout functionality
        document.getElementById('logout-btn').addEventListener('click', function() {
            if (confirm('Are you sure you want to logout?')) {
                localStorage.removeItem('userLoggedIn');
                localStorage.removeItem('userEmail');
                localStorage.removeItem('userName');
                window.location.href = 'index.html';
            }
        });
    }
    
    // BMI Calculator
    function initializeBMICalculator() {
        const calculateBtn = document.getElementById('calculate-bmi');
        const weightInput = document.getElementById('bmi-weight');
        const heightInput = document.getElementById('bmi-height');
        const resultValue = document.getElementById('bmi-value');
        const resultCategory = document.getElementById('bmi-category');
        const resultDescription = document.getElementById('bmi-description');
        
        // Load user's current data
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        if (userData.weight) {
            weightInput.value = userData.weight;
        }
        if (userData.height) {
            heightInput.value = userData.height;
        }
        
        calculateBtn.addEventListener('click', function() {
            const weight = parseFloat(weightInput.value);
            const height = parseFloat(heightInput.value);
            
            if (weight && height) {
                const heightInM = height / 100;
                const bmi = weight / (heightInM * heightInM);
                const roundedBMI = Math.round(bmi * 10) / 10;
                
                resultValue.textContent = roundedBMI;
                
                // Determine BMI category
                let category, description;
                if (bmi < 18.5) {
                    category = 'Underweight';
                    description = 'You may need to gain weight. Consider consulting with a healthcare provider.';
                } else if (bmi >= 18.5 && bmi < 25) {
                    category = 'Normal Weight';
                    description = 'You have a healthy weight. Keep up the good work!';
                } else if (bmi >= 25 && bmi < 30) {
                    category = 'Overweight';
                    description = 'You may benefit from weight loss. Consider a balanced diet and regular exercise.';
                } else {
                    category = 'Obese';
                    description = 'Consider consulting with a healthcare provider for a weight management plan.';
                }
                
                resultCategory.textContent = category;
                resultDescription.textContent = description;
            } else {
                alert('Please enter valid weight and height values');
            }
        });
    }
    
    // Calorie Counter
    function initializeCalorieCounter() {
        const addFoodBtn = document.getElementById('add-food-btn');
        const foodNameInput = document.getElementById('food-name');
        const foodQuantityInput = document.getElementById('food-quantity');
        const foodItemsList = document.getElementById('food-items-list');
        const caloriesConsumed = document.getElementById('calories-consumed');
        const caloriesRemaining = document.getElementById('calories-remaining');
        
        let totalCalories = 0;
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        const dailyGoal = userData.dailyCalories || 2000;
        
        // Common foods database (simplified)
        const foodDatabase = {
            'apple': 52,
            'banana': 89,
            'rice': 130,
            'chicken breast': 165,
            'salmon': 208,
            'broccoli': 34,
            'bread': 265,
            'egg': 155,
            'milk': 60,
            'yogurt': 59,
            'oatmeal': 68,
            'pasta': 131,
            'potato': 77,
            'avocado': 160,
            'almonds': 579
        };
        
        addFoodBtn.addEventListener('click', function() {
            const foodName = foodNameInput.value.toLowerCase().trim();
            const quantity = parseFloat(foodQuantityInput.value);
            
            if (foodName && quantity) {
                let caloriesPerGram = foodDatabase[foodName];
                
                if (!caloriesPerGram) {
                    // Estimate calories if food not in database
                    caloriesPerGram = 2; // Default 2 calories per gram
                }
                
                const foodCalories = Math.round((caloriesPerGram * quantity) / 100);
                
                // Add food item to list
                const foodItem = document.createElement('div');
                foodItem.className = 'food-item';
                foodItem.innerHTML = `
                    <div class="food-info">
                        <span class="food-name">${foodName.charAt(0).toUpperCase() + foodName.slice(1)}</span>
                        <span class="food-quantity">${quantity}g</span>
                    </div>
                    <span class="food-calories">${foodCalories} cal</span>
                `;
                
                foodItemsList.appendChild(foodItem);
                
                // Update totals
                totalCalories += foodCalories;
                caloriesConsumed.textContent = totalCalories;
                caloriesRemaining.textContent = Math.max(0, dailyGoal - totalCalories);
                
                // Clear inputs
                foodNameInput.value = '';
                foodQuantityInput.value = '';
            } else {
                alert('Please enter food name and quantity');
            }
        });
        
        // Enter key support for food input
        foodQuantityInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                addFoodBtn.click();
            }
        });
    }
    
    // Diet Planner
    function initializeDietPlanner() {
        const generatePlanBtn = document.getElementById('generate-plan');
        const breakfastPlan = document.getElementById('breakfast-plan');
        const lunchPlan = document.getElementById('lunch-plan');
        const dinnerPlan = document.getElementById('dinner-plan');
        
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        const allergies = userData.allergies || [];
        const goal = userData.goal || 'maintain';
        
        // Meal options based on goals and allergies
        const mealOptions = {
            breakfast: [
                { name: 'Oatmeal with berries and nuts', calories: 320, allergens: ['nuts'] },
                { name: 'Greek yogurt with honey', calories: 150, allergens: ['dairy'] },
                { name: 'Scrambled eggs with toast', calories: 280, allergens: ['eggs', 'gluten'] },
                { name: 'Smoothie bowl with fruits', calories: 250, allergens: [] },
                { name: 'Avocado toast', calories: 300, allergens: ['gluten'] }
            ],
            lunch: [
                { name: 'Grilled chicken salad with quinoa', calories: 450, allergens: [] },
                { name: 'Salmon with steamed vegetables', calories: 380, allergens: [] },
                { name: 'Vegetable stir-fry with tofu', calories: 320, allergens: ['soy'] },
                { name: 'Turkey sandwich with whole grain bread', calories: 400, allergens: ['gluten'] },
                { name: 'Lentil soup with side salad', calories: 350, allergens: [] }
            ],
            dinner: [
                { name: 'Baked salmon with steamed vegetables', calories: 380, allergens: [] },
                { name: 'Grilled chicken with sweet potato', calories: 420, allergens: [] },
                { name: 'Vegetarian pasta with marinara sauce', calories: 350, allergens: ['gluten'] },
                { name: 'Beef stir-fry with brown rice', calories: 450, allergens: [] },
                { name: 'Fish tacos with corn tortillas', calories: 380, allergens: [] }
            ]
        };
        
        function filterMealsByAllergies(meals) {
            return meals.filter(meal => {
                return !meal.allergens.some(allergen => allergies.includes(allergen));
            });
        }
        
        function generateMealPlan() {
            const availableBreakfast = filterMealsByAllergies(mealOptions.breakfast);
            const availableLunch = filterMealsByAllergies(mealOptions.lunch);
            const availableDinner = filterMealsByAllergies(mealOptions.dinner);
            
            const selectedBreakfast = availableBreakfast[Math.floor(Math.random() * availableBreakfast.length)];
            const selectedLunch = availableLunch[Math.floor(Math.random() * availableLunch.length)];
            const selectedDinner = availableDinner[Math.floor(Math.random() * availableDinner.length)];
            
            breakfastPlan.innerHTML = `
                <p>${selectedBreakfast.name}</p>
                <span class="meal-calories">${selectedBreakfast.calories} cal</span>
            `;
            
            lunchPlan.innerHTML = `
                <p>${selectedLunch.name}</p>
                <span class="meal-calories">${selectedLunch.calories} cal</span>
            `;
            
            dinnerPlan.innerHTML = `
                <p>${selectedDinner.name}</p>
                <span class="meal-calories">${selectedDinner.calories} cal</span>
            `;
        }
        
        generatePlanBtn.addEventListener('click', generateMealPlan);
        
        // Generate initial plan
        generateMealPlan();
    }
    
    // AI Chat
    function initializeAIChat() {
        const chatMessages = document.getElementById('chat-messages');
        const chatInputField = document.getElementById('chat-input-field');
        const sendMessageBtn = document.getElementById('send-message');
        
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        
        // Predefined responses based on user data and common health questions
        const responses = {
            'bmi': `Based on your profile, your BMI is ${userData.bmi || 'not calculated yet'}. This falls in the ${getBMICategory(userData.bmi)} category.`,
            'calories': `Your daily calorie goal is ${userData.dailyCalories || 2000} calories based on your activity level and goals.`,
            'weight loss': 'For healthy weight loss, aim for 1-2 pounds per week through a combination of calorie deficit and regular exercise.',
            'weight gain': 'For healthy weight gain, focus on nutrient-dense foods and strength training to build muscle mass.',
            'exercise': 'Regular exercise should include both cardio and strength training. Aim for at least 150 minutes of moderate exercise per week.',
            'nutrition': 'Focus on whole foods, lean proteins, healthy fats, and complex carbohydrates. Stay hydrated and limit processed foods.',
            'meal prep': 'Meal prep can help you stick to your nutrition goals. Plan your meals, prep ingredients in advance, and portion your meals.',
            'motivation': 'Remember, small consistent changes lead to big results. Celebrate your progress and be patient with yourself.',
            'water': 'Aim to drink at least 8 glasses of water per day. Proper hydration supports metabolism and overall health.',
            'sleep': 'Quality sleep is crucial for health. Aim for 7-9 hours per night and maintain a consistent sleep schedule.'
        };
        
        function getBMICategory(bmi) {
            if (!bmi) return 'unknown';
            if (bmi < 18.5) return 'underweight';
            if (bmi < 25) return 'normal weight';
            if (bmi < 30) return 'overweight';
            return 'obese';
        }
        
        function addMessage(content, isUser = false) {
            const messageDiv = document.createElement('div');
            messageDiv.className = `message ${isUser ? 'user-message' : 'bot-message'}`;
            
            messageDiv.innerHTML = `
                <div class="message-avatar">
                    <i class="fas fa-${isUser ? 'user' : 'robot'}"></i>
                </div>
                <div class="message-content">
                    <p>${content}</p>
                </div>
            `;
            
            chatMessages.appendChild(messageDiv);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
        
        function generateResponse(userMessage) {
            const message = userMessage.toLowerCase();
            
            // Check for keywords in user message
            for (const [keyword, response] of Object.entries(responses)) {
                if (message.includes(keyword)) {
                    return response;
                }
            }
            
            // Default responses for common patterns
            if (message.includes('hello') || message.includes('hi')) {
                return `Hello! I'm here to help with your health journey. You can ask me about nutrition, exercise, BMI, calories, or any health-related questions.`;
            }
            
            if (message.includes('thank')) {
                return "You're welcome! I'm here to support your health goals. Feel free to ask me anything else!";
            }
            
            if (message.includes('help')) {
                return "I can help you with questions about nutrition, exercise, BMI calculation, calorie counting, meal planning, and general health advice. What would you like to know?";
            }
            
            // Default response
            return "That's a great question! While I can provide general health information, I'd recommend consulting with a healthcare professional for personalized medical advice. Is there anything specific about nutrition, exercise, or wellness I can help you with?";
        }
        
        function sendMessage() {
            const message = chatInputField.value.trim();
            if (message) {
                // Add user message
                addMessage(message, true);
                
                // Clear input
                chatInputField.value = '';
                
                // Generate and add bot response after a short delay
                setTimeout(() => {
                    const response = generateResponse(message);
                    addMessage(response);
                }, 1000);
            }
        }
        
        sendMessageBtn.addEventListener('click', sendMessage);
        
        chatInputField.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }
});
