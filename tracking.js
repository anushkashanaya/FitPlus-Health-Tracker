// First Aid Tips Database
const firstAidTips = {
    cuts: {
        title: "Cuts and Scrapes",
        steps: [
            "Clean your hands thoroughly with soap and water",
            "Stop the bleeding by applying gentle pressure with a clean cloth",
            "Clean the wound with clean water and mild soap",
            "Apply antibiotic ointment to prevent infection",
            "Cover with a sterile bandage or gauze",
            "Change bandage daily or whenever it gets wet or dirty"
        ],
        warning: "Seek medical attention if the cut is deep, has jagged edges, or shows signs of infection (redness, swelling, warmth, or pus)",
        demonstration: "https://www.youtube.com/embed/NxwNuoNK8Kw"
    },
    burns: {
        title: "Minor Burns",
        steps: [
            "Cool the burn under cool (not cold) running water for 10-20 minutes",
            "Remove any jewelry or tight items from the burned area",
            "Don't break any blisters that may form",
            "Apply aloe vera gel or moisturizer",
            "Cover with a sterile gauze bandage",
            "Take over-the-counter pain reliever if needed"
        ],
        warning: "Seek immediate medical attention for: burns larger than 3 inches, burns on face/hands/feet, electrical burns, or chemical burns",
        demonstration: "https://www.youtube.com/embed/EaJmzB8YgS0"
    },
    sprains: {
        title: "Sprains",
        steps: [
            "Follow the RICE method:",
            "REST - Stop using the injured area",
            "ICE - Apply ice pack for 15-20 minutes every 2-3 hours",
            "COMPRESSION - Use an elastic bandage to reduce swelling",
            "ELEVATION - Keep the injured area above heart level when possible",
            "Take over-the-counter pain medication if needed"
        ],
        warning: "See a doctor if you cannot bear weight, have severe pain, or hear a popping sound during injury",
        demonstration: "https://www.youtube.com/embed/gNFNJWd7NGI"
    },
    choking: {
        title: "Choking First Aid",
        steps: [
            "For conscious victim:",
            "Stand behind the person and lean them slightly forward",
            "Give 5 sharp blows between shoulder blades with heel of hand",
            "If unsuccessful, perform Heimlich maneuver:",
            "- Make a fist with one hand and place above navel",
            "- Grasp fist with other hand and give quick upward thrusts",
            "Continue until object is expelled or person becomes unconscious"
        ],
        warning: "Call emergency services immediately if person becomes unconscious",
        demonstration: "https://www.youtube.com/embed/PA9hpOnvtCk"
    },
    nosebleed: {
        title: "Nosebleed",
        steps: [
            "Sit upright and lean slightly forward",
            "Pinch the soft part of your nose just below the bridge",
            "Breathe through your mouth while keeping nose pinched",
            "Hold this position for 10-15 minutes",
            "Apply a cold compress or ice pack to your nose and cheeks",
            "After bleeding stops, avoid bending down or blowing nose for a few hours"
        ],
        warning: "Seek medical attention if bleeding persists beyond 30 minutes, or if nosebleeds occur frequently",
        demonstration: "https://www.youtube.com/embed/ZvtF1nVX7q8"
    },
    bee_sting: {
        title: "Bee Sting",
        steps: [
            "Remove the stinger immediately by scraping with a flat object",
            "Wash the area with soap and water",
            "Apply a cold compress to reduce swelling",
            "Apply calamine lotion or hydrocortisone cream for itching",
            "Take an antihistamine if needed",
            "Monitor the area for signs of allergic reaction"
        ],
        warning: "Seek immediate medical attention if there are signs of allergic reaction: difficulty breathing, swelling of throat/face, dizziness",
        demonstration: "https://www.youtube.com/embed/cM7uUZkR-xg"
    },
    heat_exhaustion: {
        title: "Heat Exhaustion",
        steps: [
            "Move to a cool, shaded area immediately",
            "Lie down and elevate feet slightly",
            "Remove any excess clothing",
            "Apply cool, wet cloths to body or take a cool bath",
            "Sip water or sports drinks slowly",
            "Use fan or AC to help cooling"
        ],
        warning: "Seek emergency care if symptoms worsen, person becomes confused, or body temperature rises above 104°F (40°C)",
        demonstration: "https://www.youtube.com/embed/0fL-pn80s-c"
    },
    fracture: {
        title: "Suspected Fracture",
        steps: [
            "Keep the injured area still and supported",
            "Apply ice pack wrapped in cloth to reduce swelling",
            "If necessary, improvise a splint using firm, straight material",
            "Check circulation beyond injury (pulse, skin color, temperature)",
            "Keep person still and warm",
            "Call for emergency medical help"
        ],
        warning: "Do not attempt to realign broken bones. If bone is visible through skin, cover with clean dressing and seek immediate medical attention",
        demonstration: "https://www.youtube.com/embed/0dacEgSdZCs"
    },
    poisoning: {
        title: "Poisoning",
        steps: [
            "Call poison control center immediately",
            "Do not induce vomiting unless instructed by professionals",
            "If poison on skin, remove contaminated clothing and rinse skin",
            "If poison in eye, flush with clean water for 15-20 minutes",
            "Collect the poison container/sample for identification",
            "Monitor vital signs until help arrives"
        ],
        warning: "Call emergency services immediately. Do not give anything by mouth unless advised by poison control",
        demonstration: "https://www.youtube.com/embed/ZVrw8ypr_oo"
    }
};

// Search functionality for First Aid section
function searchFirstAid(query) {
    query = query.toLowerCase();
    const firstAidList = document.querySelectorAll('.firstaid-list button');
    let foundMatch = false;
    let firstMatch = null;

    firstAidList.forEach(button => {
        const text = button.textContent.toLowerCase();
        const injury = button.getAttribute('onclick').split("'")[1];
        const tips = firstAidTips[injury];
        
        // Search in title, steps, and warning
        const matchTitle = tips.title.toLowerCase().includes(query);
        const matchSteps = tips.steps.some(step => step.toLowerCase().includes(query));
        const matchWarning = tips.warning.toLowerCase().includes(query);
        
        if (matchTitle || matchSteps || matchWarning) {
            button.style.display = 'flex';
            button.classList.add('highlight');
            if (!firstMatch) {
                firstMatch = button;
            }
            foundMatch = true;
        } else {
            button.style.display = 'none';
            button.classList.remove('highlight');
        }
    });

    // If there's a match, show its information and scroll to it
    if (firstMatch && query.length > 0) {
        const injury = firstMatch.getAttribute('onclick').split("'")[1];
        showFirstAidTips(injury);
        firstMatch.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    // Reset display if search is empty
    if (query === '') {
        firstAidList.forEach(button => {
            button.style.display = 'flex';
            button.classList.remove('highlight');
        });
    }
}

// Streak Tracking System
class StreakTracker {
    constructor() {
        this.streak = 0;
        this.lastActivityDate = null;
        this.todayActivities = {
            water: false,
            meals: false,
            sleep: false
        };
        this.loadStreak();
    }

    loadStreak() {
        try {
            const savedData = localStorage.getItem('healthStreak');
            if (savedData) {
                const data = JSON.parse(savedData);
                this.streak = parseInt(data.streak) || 0;
                this.lastActivityDate = data.lastActivityDate ? new Date(data.lastActivityDate) : null;
                this.todayActivities = data.todayActivities || {
                    water: false,
                    meals: false,
                    sleep: false
                };

                // Check if it's a new day
                const today = new Date();
                if (this.lastActivityDate) {
                    const lastDate = new Date(this.lastActivityDate);
                    if (today.toDateString() !== lastDate.toDateString()) {
                        this.resetDailyActivities();
                    }
                }
            }
        } catch (error) {
            console.error('Error loading streak data:', error);
            this.resetStreak();
        }
        this.updateStreakDisplay();
    }

    saveStreak() {
        try {
            const data = {
                streak: this.streak,
                lastActivityDate: this.lastActivityDate ? this.lastActivityDate.toISOString() : null,
                todayActivities: this.todayActivities
            };
            localStorage.setItem('healthStreak', JSON.stringify(data));
            this.updateStreakDisplay();
        } catch (error) {
            console.error('Error saving streak data:', error);
        }
    }

    resetStreak() {
        this.streak = 0;
        this.lastActivityDate = null;
        this.resetDailyActivities();
        this.saveStreak();
    }

    resetDailyActivities() {
        this.todayActivities = {
            water: false,
            meals: false,
            sleep: false
        };
    }

    logActivity(activityType) {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Normalize to start of day

        // First ever activity
        if (!this.lastActivityDate) {
            this.streak = 1;
            this.lastActivityDate = today;
            this.todayActivities[activityType] = true;
            this.saveStreak();
            this.checkAchievements();
            return;
        }

        const lastDate = new Date(this.lastActivityDate);
        lastDate.setHours(0, 0, 0, 0); // Normalize to start of day

        // Calculate days difference
        const daysDiff = Math.floor((today - lastDate) / (1000 * 60 * 60 * 24));

        // Same day activity
        if (daysDiff === 0) {
            if (!this.todayActivities[activityType]) {
                this.todayActivities[activityType] = true;
                this.saveStreak();
            }
            return;
        }

        // Next day activity
        if (daysDiff === 1) {
            this.streak++;
            this.resetDailyActivities();
            this.todayActivities[activityType] = true;
            this.lastActivityDate = today;
            this.saveStreak();
            this.checkAchievements();
            return;
        }

        // Missed a day or more
        if (daysDiff > 1) {
            this.streak = 1;
            this.resetDailyActivities();
            this.todayActivities[activityType] = true;
            this.lastActivityDate = today;
            this.saveStreak();
            this.checkAchievements();
            return;
        }
    }

    updateStreakDisplay() {
        try {
            // Update dashboard streak
            const streakCount = document.getElementById('streakCount');
            if (streakCount) {
                streakCount.textContent = this.streak;
            }

            // Update streaks section
            const streakCountDetail = document.getElementById('streakCountDetail');
            if (streakCountDetail) {
                streakCountDetail.textContent = this.streak;
            }

            this.updateAchievements();
        } catch (error) {
            console.error('Error updating streak display:', error);
        }
    }

    checkAchievements() {
        const achievements = [];
        
        // Add achievements based on streak milestones
        if (this.streak >= 1) {
            achievements.push({
                name: 'First Step',
                icon: 'fa-shoe-prints',
                description: 'Started your health tracking journey!'
            });
        }
        if (this.streak >= 3) {
            achievements.push({
                name: 'Three-Day Warrior',
                icon: 'fa-award',
                description: 'Maintained tracking for 3 days!'
            });
        }
        if (this.streak >= 7) {
            achievements.push({
                name: 'Week Champion',
                icon: 'fa-medal',
                description: 'A full week of consistent tracking!'
            });
        }
        if (this.streak >= 14) {
            achievements.push({
                name: 'Fortnight Master',
                icon: 'fa-star',
                description: 'Two weeks of dedication!'
            });
        }
        if (this.streak >= 30) {
            achievements.push({
                name: 'Monthly Maven',
                icon: 'fa-trophy',
                description: 'An entire month of tracking!'
            });
        }

        localStorage.setItem('achievements', JSON.stringify(achievements));
        this.updateAchievements();
    }

    updateAchievements() {
        const achievementsContainer = document.getElementById('achievements');
        if (!achievementsContainer) return;

        const achievements = JSON.parse(localStorage.getItem('achievements') || '[]');
        achievementsContainer.innerHTML = achievements.map(achievement => `
            <li class="achievement">
                <i class="fas ${achievement.icon}"></i>
                <div>
                    <strong>${achievement.name}</strong>
                    <p>${achievement.description}</p>
                </div>
            </li>
        `).join('');
    }
}

// Initialize streak tracker
const streakTracker = new StreakTracker();

// Ensure streak display is updated when page loads
document.addEventListener('DOMContentLoaded', () => {
    streakTracker.updateStreakDisplay();
});

// Water tracking
let waterCount = 0;
let waterGoal = 8;
let waterChart = null;

// Initialize water tracking
function initializeWaterTracking() {
    // Load saved data
    const savedData = localStorage.getItem('waterTracking');
    if (savedData) {
        const data = JSON.parse(savedData);
        waterCount = data.count;
        waterGoal = data.goal;
        
        // Update displays
        updateWaterDisplays();
        document.getElementById('waterGoalDisplay').textContent = waterGoal;
        document.getElementById('waterGoal').value = waterGoal;
        
        // Load history
        const waterHistory = document.getElementById('waterHistory');
        if (waterHistory && data.history) {
            waterHistory.innerHTML = data.history;
        }
    }
    
    // Initialize charts
    initializeWaterChart();
}

// Function to update all water count displays
function updateWaterDisplays() {
    document.getElementById('dashboardWaterCount').textContent = waterCount;
    document.getElementById('detailWaterCount').textContent = waterCount;
}

function initializeWaterChart() {
    const ctx = document.getElementById('waterChart').getContext('2d');
    
    // Destroy existing chart if it exists
    if (waterChart) {
        waterChart.destroy();
    }
    
    waterChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            datasets: [{
                data: [waterCount, Math.max(0, waterGoal - waterCount)],
                backgroundColor: [
                    'rgba(90, 191, 183, 0.8)',  // filled
                    'rgba(90, 191, 183, 0.2)'   // remaining
                ],
                borderWidth: 0,
                borderRadius: 5,
            }]
        },
        options: {
            cutout: '75%',
            responsive: true,
            maintainAspectRatio: true,
            animation: {
                animateRotate: true,
                animateScale: true
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    enabled: false
                }
            }
        }
    });
}

function updateWaterChart() {
    if (waterChart) {
        waterChart.data.datasets[0].data = [waterCount, Math.max(0, waterGoal - waterCount)];
        waterChart.update();
    }
}

function updateWaterGoal() {
    const newGoal = parseInt(document.getElementById('waterGoal').value);
    if (newGoal && newGoal > 0) {
        waterGoal = newGoal;
        document.getElementById('waterGoalDisplay').textContent = waterGoal;
        updateWaterChart();
        saveWaterData();
        showNotification('Water goal updated successfully!', 'success');
    } else {
        showNotification('Please enter a valid goal number', 'error');
    }
}

function addWater() {
    if (waterCount < waterGoal) {
        waterCount++;
        updateWaterDisplays();
        updateWaterChart();
        
        // Add to water history
        const waterHistory = document.getElementById('waterHistory');
        if (waterHistory) {
            const time = new Date().toLocaleTimeString();
            const li = document.createElement('li');
            li.innerHTML = `
                <span>Glass of water added</span>
                <span class="time">${time}</span>
            `;
            waterHistory.insertBefore(li, waterHistory.firstChild);
        }
        
        // Save data
        saveWaterData();
        
        // Update streak
        streakTracker.logActivity('water');
        
        if (waterCount === waterGoal) {
            showNotification('Congratulations! You\'ve reached your water goal for today! 🎉', 'success');
        } else {
            showNotification('Water intake logged successfully!', 'success');
        }
    } else {
        showNotification('You\'ve already reached your water goal for today!', 'info');
    }
}

function subtractWater() {
    if (waterCount > 0) {
        waterCount--;
        updateWaterDisplays();
        updateWaterChart();
        
        // Add to water history
        const waterHistory = document.getElementById('waterHistory');
        if (waterHistory) {
            const time = new Date().toLocaleTimeString();
            const li = document.createElement('li');
            li.innerHTML = `
                <span>Glass of water removed</span>
                <span class="time">${time}</span>
            `;
            waterHistory.insertBefore(li, waterHistory.firstChild);
        }
        
        // Save data
        saveWaterData();
        showNotification('Water intake updated', 'info');
    }
}

function saveWaterData() {
    const waterHistory = document.getElementById('waterHistory');
    const data = {
        count: waterCount,
        goal: waterGoal,
        history: waterHistory ? waterHistory.innerHTML : ''
    };
    localStorage.setItem('waterTracking', JSON.stringify(data));
}

// Initialize water tracking when the page loads
document.addEventListener('DOMContentLoaded', initializeWaterTracking);

// Meal Tracking System
class MealTracker {
    constructor() {
        this.meals = [];
        this.selectedRating = null;
        this.loadMeals();
        this.setupEventListeners();
    }

    loadMeals() {
        const savedMeals = localStorage.getItem('meals');
        if (savedMeals) {
            this.meals = JSON.parse(savedMeals);
            this.updateMealHistory();
            this.updateTodayMeals();
            this.updateStats();
        }
    }

    saveMeals() {
        localStorage.setItem('meals', JSON.stringify(this.meals));
    }

    setupEventListeners() {
        // Add any additional event listeners here
    }

    logMeal() {
        const items = document.getElementById('mealItems').value.trim();
        const time = document.getElementById('mealTime').value;
        const notes = document.getElementById('mealNotes').value.trim();
        const mealType = document.getElementById('mealType').value;

        if (!items || !time) {
            showNotification('Please fill in the meal items and time', 'error');
            return;
        }

        if (!this.selectedRating) {
            showNotification('Please select a meal rating', 'error');
            return;
        }

        const meal = {
            type: mealType,
            items: items,
            time: time,
            notes: notes,
            rating: this.selectedRating,
            date: new Date().toISOString().split('T')[0]
        };

        this.meals.push(meal);
        this.saveMeals();
        this.updateMealHistory();
        this.updateTodayMeals();
        this.updateStats();
        this.resetForm();

        showNotification('Meal logged successfully!', 'success');
        streakTracker.logActivity('meals');
    }

    updateTodayMeals() {
        const today = new Date().toISOString().split('T')[0];
        const todayMeals = this.meals.filter(meal => meal.date === today);

        ['breakfast', 'lunch', 'dinner'].forEach(mealType => {
            const meal = todayMeals.find(m => m.type === mealType);
            // Update main meals tab
            const mainContainer = document.getElementById(`today${mealType.charAt(0).toUpperCase() + mealType.slice(1)}`);
            // Update dashboard
            const dashboardContainer = document.getElementById(`dashboard${mealType.charAt(0).toUpperCase() + mealType.slice(1)}`);
            
            const content = meal ? this.createMealEntry(meal) : '<p class="empty-meal">No ' + mealType + ' logged yet</p>';
            
            if (mainContainer) {
                mainContainer.innerHTML = content;
            }
            if (dashboardContainer) {
                dashboardContainer.innerHTML = content;
            }
        });
    }

    updateMealHistory() {
        const historyContainer = document.getElementById('mealHistory');
        const groupedMeals = this.groupMealsByDate();
        
        let html = '';
        for (const [date, meals] of Object.entries(groupedMeals).sort().reverse()) {
            html += `
                <div class="meal-entry">
                    <div class="meal-header">
                        <h4>${this.formatDate(date)}</h4>
                    </div>
                    ${meals.map(meal => this.createMealEntry(meal)).join('')}
                </div>
            `;
        }
        
        historyContainer.innerHTML = html || '<p class="empty-meal">No meal history available</p>';
    }

    updateStats() {
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        
        const weeklyMeals = this.meals.filter(meal => {
            const mealDate = new Date(meal.date);
            return mealDate >= weekAgo;
        });

        const healthyMeals = weeklyMeals.filter(meal => meal.rating === 'healthy').length;
        document.getElementById('healthyMealsCount').textContent = healthyMeals;
        document.getElementById('totalMealsCount').textContent = this.meals.length;
        
        // Calculate streak
        const streak = this.calculateStreak();
        document.getElementById('mealStreakCount').textContent = streak;
    }

    calculateStreak() {
        let streak = 0;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        for (let i = 0; i < 365; i++) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            
            const hasMeals = this.meals.some(meal => meal.date === dateStr);
            if (!hasMeals) break;
            streak++;
        }
        
        return streak;
    }

    groupMealsByDate() {
        return this.meals.reduce((groups, meal) => {
            if (!groups[meal.date]) {
                groups[meal.date] = [];
            }
            groups[meal.date].push(meal);
            return groups;
        }, {});
    }

    createMealEntry(meal) {
        return `
            <div class="meal-content">
                <div class="meal-header">
                    <span class="meal-type">${meal.type.charAt(0).toUpperCase() + meal.type.slice(1)}</span>
                    <span class="meal-time">${this.formatTime(meal.time)}</span>
                </div>
                <div class="meal-items">${meal.items}</div>
                ${meal.notes ? `<div class="meal-notes">${meal.notes}</div>` : ''}
                <span class="meal-rating-badge rating-${meal.rating}">
                    <i class="fas fa-${this.getRatingIcon(meal.rating)}"></i> ${meal.rating.charAt(0).toUpperCase() + meal.rating.slice(1)}
                </span>
            </div>
        `;
    }

    getRatingIcon(rating) {
        switch (rating) {
            case 'healthy': return 'apple-alt';
            case 'moderate': return 'cookie-bite';
            case 'unhealthy': return 'hamburger';
            default: return 'question';
        }
    }

    formatDate(dateStr) {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateStr).toLocaleDateString(undefined, options);
    }

    formatTime(timeStr) {
        return new Date(`2000-01-01T${timeStr}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    resetForm() {
        document.getElementById('mealItems').value = '';
        document.getElementById('mealTime').value = '';
        document.getElementById('mealNotes').value = '';
        document.getElementById('mealType').value = 'breakfast';
        this.selectedRating = null;
        document.querySelectorAll('.rating-btn').forEach(btn => btn.classList.remove('selected'));
    }
}

// Initialize meal tracker
const mealTracker = new MealTracker();

function setMealRating(rating) {
    mealTracker.selectedRating = rating;
    document.querySelectorAll('.rating-btn').forEach(btn => {
        btn.classList.remove('selected');
    });
    document.querySelector(`.rating-btn[onclick="setMealRating('${rating}')"]`).classList.add('selected');
}

function logMeal() {
    mealTracker.logMeal();
}

// Sleep tracking functionality
let sleepLogs = JSON.parse(localStorage.getItem('sleepLogs')) || [];

function logSleep() {
    // Try both dashboard and detail view IDs
    const sleepTime = document.getElementById('sleepTimeDetail')?.value || document.getElementById('sleepTime')?.value;
    const wakeTime = document.getElementById('wakeTimeDetail')?.value || document.getElementById('wakeTime')?.value;
    const quality = document.getElementById('sleepQuality')?.value || 'good';
    const notes = document.getElementById('sleepNotes')?.value || '';

    if (!sleepTime || !wakeTime) {
        showNotification('Please enter both sleep and wake times', 'error');
        return;
    }

    const sleepLog = {
        id: Date.now(),
        date: new Date().toISOString().split('T')[0],
        sleepTime,
        wakeTime,
        quality,
        notes
    };

    sleepLogs.push(sleepLog);
    saveSleepLogs();
    updateSleepHistory();
    updateSleepStats();
    
    // Update streak
    streakTracker.logActivity('sleep');
    showNotification('Sleep logged successfully! 😴', 'success');
}

function deleteSleepLog(id) {
    if (confirm('Are you sure you want to delete this sleep log?')) {
        sleepLogs = sleepLogs.filter(log => log.id !== id);
        saveSleepLogs();
        updateSleepHistory();
        updateSleepStats();
    }
}

function clearAllSleepLogs() {
    if (confirm('Are you sure you want to delete all sleep logs? This action cannot be undone.')) {
        sleepLogs = [];
        saveSleepLogs();
        updateSleepHistory();
        updateSleepStats();
    }
}

function saveSleepLogs() {
    localStorage.setItem('sleepLogs', JSON.stringify(sleepLogs));
}

function updateSleepHistory() {
    const historyContainer = document.getElementById('sleepHistory');
    const historyHTML = sleepLogs.map(log => `
        <div class="sleep-log-entry">
            <div class="log-content">
                <div class="log-date">${formatDate(log.date)}</div>
                <div class="log-times">
                    <span><i class="fas fa-moon"></i> ${formatTime(log.sleepTime)}</span>
                    <span><i class="fas fa-sun"></i> ${formatTime(log.wakeTime)}</span>
                </div>
                <div class="log-quality">
                    <i class="fas fa-star"></i> ${log.quality}
                </div>
                ${log.notes ? `<div class="log-notes">${log.notes}</div>` : ''}
            </div>
            <button onclick="deleteSleepLog(${log.id})" class="delete-log-btn">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `).join('');

    historyContainer.innerHTML = `
        ${historyHTML}
        <div class="history-actions">
            <button onclick="clearAllSleepLogs()" class="clear-all-btn">
                <i class="fas fa-trash"></i> Clear All Logs
            </button>
        </div>
    `;
}

function updateSleepStats() {
    if (sleepLogs.length === 0) {
        document.getElementById('avgSleepDuration').textContent = '--:--';
        document.getElementById('avgBedtime').textContent = '--:--';
        document.getElementById('avgWakeTime').textContent = '--:--';
        return;
    }

    // Calculate average sleep duration
    const avgDuration = calculateAverageSleepDuration();
    document.getElementById('avgSleepDuration').textContent = formatDuration(avgDuration);

    // Calculate average bedtime
    const avgBedtime = calculateAverageBedtime();
    document.getElementById('avgBedtime').textContent = formatTime(avgBedtime);

    // Calculate average wake time
    const avgWakeTime = calculateAverageWakeTime();
    document.getElementById('avgWakeTime').textContent = formatTime(avgWakeTime);
}

// Helper functions
function formatDate(dateString) {
    const options = { weekday: 'short', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

function formatTime(timeString) {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });
}

function formatDuration(minutes) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
}

function calculateAverageSleepDuration() {
    const durations = sleepLogs.map(log => {
        const sleep = new Date(`2000-01-01T${log.sleepTime}`);
        const wake = new Date(`2000-01-01T${log.wakeTime}`);
        let diff = wake - sleep;
        if (diff < 0) diff += 24 * 60 * 60 * 1000; // Add 24 hours if wake time is next day
        return diff / (1000 * 60); // Convert to minutes
    });
    return Math.round(durations.reduce((a, b) => a + b, 0) / durations.length);
}

function calculateAverageBedtime() {
    const times = sleepLogs.map(log => log.sleepTime);
    return calculateAverageTime(times);
}

function calculateAverageWakeTime() {
    const times = sleepLogs.map(log => log.wakeTime);
    return calculateAverageTime(times);
}

function calculateAverageTime(times) {
    const timeInMinutes = times.map(time => {
        const [hours, minutes] = time.split(':').map(Number);
        return hours * 60 + minutes;
    });
    const avgMinutes = timeInMinutes.reduce((a, b) => a + b, 0) / times.length;
    const hours = Math.floor(avgMinutes / 60);
    const minutes = Math.round(avgMinutes % 60);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

// Initialize sleep history on page load
document.addEventListener('DOMContentLoaded', () => {
    updateSleepHistory();
    updateSleepStats();
});

// Notification function
function showNotification(message, type = 'info') {
    const notificationArea = document.getElementById('notification-area');
    if (!notificationArea) return;

    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : 
                       type === 'error' ? 'fa-exclamation-circle' : 
                       'fa-info-circle'}"></i>
        <span>${message}</span>
    `;

    notificationArea.appendChild(notification);

    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Emergency Contacts (Indian)
const emergencyContacts = {
    emergency: "112", // National Emergency Number
    ambulance: "108",
    police: "100",
    fire: "101",
    women: "1091", // Women's Helpline
    child: "1098", // Child Helpline
    covid: "1075" // COVID-19 Helpline
};

// Menstrual Cycle Tracking
class MenstrualTracker {
    constructor() {
        this.cycles = [];
        this.loadData();
    }

    loadData() {
        const savedData = localStorage.getItem('menstrualData');
        if (savedData) {
            this.cycles = JSON.parse(savedData);
        }
    }

    saveData() {
        localStorage.setItem('menstrualData', JSON.stringify(this.cycles));
    }

    logPeriod(startDate, symptoms = [], flowIntensity = '') {
        this.cycles.unshift({
            startDate,
            symptoms,
            flowIntensity,
            endDate: null,
            timestamp: new Date().toISOString()
        });
        this.saveData();
    }

    endPeriod(endDate) {
        if (this.cycles.length > 0) {
            this.cycles[0].endDate = endDate;
            this.saveData();
        }
    }

    predictNextPeriod() {
        if (this.cycles.length < 2) return null;

        const lastCycles = this.cycles.slice(-3);
        let totalDays = 0;
        let count = 0;

        for (let i = 1; i < lastCycles.length; i++) {
            if (lastCycles[i-1].startDate && lastCycles[i].startDate) {
                const start1 = new Date(lastCycles[i-1].startDate);
                const start2 = new Date(lastCycles[i].startDate);
                const cycleDays = Math.round((start2 - start1) / (1000 * 60 * 60 * 24));
                if (cycleDays > 0) {
                    totalDays += cycleDays;
                    count++;
                }
            }
        }

        if (count === 0) return null;

        const averageCycle = Math.round(totalDays / count);
        const lastStart = new Date(this.cycles[0].startDate);
        const nextPeriod = new Date(lastStart);
        nextPeriod.setDate(nextPeriod.getDate() + averageCycle);

        return nextPeriod;
    }

    getAverageCycleLength() {
        if (this.cycles.length < 2) return null;

        let totalDays = 0;
        let count = 0;

        for (let i = 1; i < this.cycles.length; i++) {
            if (this.cycles[i-1].startDate && this.cycles[i].startDate) {
                const start1 = new Date(this.cycles[i-1].startDate);
                const start2 = new Date(this.cycles[i].startDate);
                const cycleDays = Math.round((start2 - start1) / (1000 * 60 * 60 * 24));
                if (cycleDays > 0) {
                    totalDays += cycleDays;
                    count++;
                }
            }
        }

        return count > 0 ? Math.round(totalDays / count) : null;
    }

    getAveragePeriodLength() {
        const completedCycles = this.cycles.filter(cycle => cycle.startDate && cycle.endDate);
        if (completedCycles.length === 0) return null;

        let totalDays = 0;
        completedCycles.forEach(cycle => {
            const start = new Date(cycle.startDate);
            const end = new Date(cycle.endDate);
            const days = Math.round((end - start) / (1000 * 60 * 60 * 24)) + 1;
            totalDays += days;
        });

        return Math.round(totalDays / completedCycles.length);
    }
}

// Initialize tracking systems
const menstrualTracker = new MenstrualTracker();

// Function to display first aid information
function showFirstAidTips(condition) {
    const tips = firstAidTips[condition];
    if (!tips) return;

    let html = `
        <h3>${tips.title}</h3>
        <div class="first-aid-steps">
            <h4>Steps:</h4>
            <ol>
                ${tips.steps.map(step => `<li>${step}</li>`).join('')}
            </ol>
        </div>
        <div class="warning">
            <h4>⚠️ Warning:</h4>
            <p>${tips.warning}</p>
        </div>
        ${tips.demonstration ? `
            <div class="demonstration">
                <h4>Video Demonstration:</h4>
                <div class="video-container">
                    <iframe src="${tips.demonstration}" frameborder="0" allowfullscreen></iframe>
                </div>
            </div>
        ` : ''}
    `;

    document.getElementById('firstAidInfo').innerHTML = html;
}

// Function to get nearby emergency services
function getNearbyEmergencyServices() {
    if (!navigator.geolocation) {
        showNotification('Geolocation is not supported by your browser', 'error');
        return;
    }

    const servicesDiv = document.getElementById('nearbyServices');
    servicesDiv.innerHTML = '<p>Loading nearby services...</p>';

    navigator.geolocation.getCurrentPosition(
        position => {
            // Here you would typically make an API call to get nearby services
            // For demonstration, we'll show dummy data
            servicesDiv.innerHTML = `
                <div class="service-category">
                    <h4>Hospitals</h4>
                    <ul>
                        <li>City General Hospital (2.3 km)</li>
                        <li>St. John's Medical Center (3.1 km)</li>
                        <li>Apollo Hospital (4.5 km)</li>
                    </ul>
                </div>
                <div class="service-category">
                    <h4>Pharmacies</h4>
                    <ul>
                        <li>MedPlus Pharmacy (0.8 km)</li>
                        <li>Apollo Pharmacy (1.2 km)</li>
                        <li>Guardian Pharmacy (1.9 km)</li>
                    </ul>
                </div>
            `;
        },
        error => {
            servicesDiv.innerHTML = '<p>Unable to get your location. Please check your settings and try again.</p>';
            showNotification('Error getting location: ' + error.message, 'error');
        }
    );
}

// Export functions and data for use in main.js
window.healthTracking = {
    firstAidTips,
    emergencyContacts,
    menstrualTracker,
    showFirstAidTips,
    getNearbyEmergencyServices
};

// Medication Tracking System
class MedicationTracker {
    constructor() {
        this.medications = [];
        this.notifications = [];
        this.loadMedications();
        this.initializeNotifications();
        this.setupEventListeners();
        this.checkPermissions();
    }

    loadMedications() {
        const savedMeds = localStorage.getItem('medications');
        if (savedMeds) {
            this.medications = JSON.parse(savedMeds);
            this.updateMedicationsList();
            this.updateSchedule();
        }
    }

    saveMedications() {
        localStorage.setItem('medications', JSON.stringify(this.medications));
    }

    setupEventListeners() {
        // Frequency change handler
        document.getElementById('medFrequency').addEventListener('change', (e) => {
            const weeklyGroup = document.getElementById('weeklyDaysGroup');
            weeklyGroup.classList.toggle('hidden', e.target.value !== 'weekly');
        });

        // Form submission handler
        document.getElementById('medicationForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addMedication();
        });
    }

    async checkPermissions() {
        if ('Notification' in window) {
            if (Notification.permission !== 'granted' && Notification.permission !== 'denied') {
                await Notification.requestPermission();
            }
        }
    }

    addMedication() {
        const medication = {
            id: Date.now(),
            name: document.getElementById('medName').value,
            dosage: document.getElementById('medDosage').value,
            unit: document.getElementById('medUnit').value,
            frequency: document.getElementById('medFrequency').value,
            times: Array.from(document.getElementsByClassName('medTime')).map(input => input.value),
            startDate: document.getElementById('medStartDate').value,
            endDate: document.getElementById('medEndDate').value || null,
            notes: document.getElementById('medNotes').value,
            notifyBrowser: document.getElementById('notifyBrowser').checked,
            notifySound: document.getElementById('notifySound').checked,
            status: 'active',
            history: []
        };

        if (medication.frequency === 'weekly') {
            medication.days = Array.from(document.querySelectorAll('.day-checkbox input:checked'))
                .map(checkbox => checkbox.value);
        }

        this.medications.push(medication);
        this.saveMedications();
        this.updateMedicationsList();
        this.updateSchedule();
        this.scheduleNotifications(medication);
        
        // Reset form
        document.getElementById('medicationForm').reset();
        showNotification('Medication added successfully!', 'success');
    }

    updateMedicationsList() {
        const container = document.getElementById('activeMedications');
        if (!container) return;

        container.innerHTML = this.medications
            .filter(med => med.status === 'active')
            .map(med => `
                <div class="medication-item" data-id="${med.id}">
                    <div class="medication-header">
                        <div>
                            <div class="medication-name">${med.name}</div>
                            <div class="medication-dosage">${med.dosage} ${med.unit}</div>
                        </div>
                        <button class="remove-med" onclick="medicationTracker.removeMedication(${med.id})">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="medication-schedule">
                        ${this.formatSchedule(med)}
                    </div>
                    <div class="medication-actions">
                        <button class="action-button take-button" onclick="medicationTracker.logMedication(${med.id}, 'taken')">
                            <i class="fas fa-check"></i> Take
                        </button>
                        <button class="action-button skip-button" onclick="medicationTracker.logMedication(${med.id}, 'skipped')">
                            <i class="fas fa-forward"></i> Skip
                        </button>
                    </div>
                </div>
            `).join('');
    }

    formatSchedule(medication) {
        if (medication.frequency === 'daily') {
            return `Daily at ${medication.times.map(time => this.formatTime(time)).join(', ')}`;
        } else if (medication.frequency === 'weekly') {
            return `${medication.days.join(', ')} at ${medication.times.map(time => this.formatTime(time)).join(', ')}`;
        }
        return 'Custom schedule';
    }

    formatTime(time) {
        return new Date(`2000-01-01T${time}`).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    }

    updateSchedule() {
        const container = document.getElementById('medicationSchedule');
        if (!container) return;

        const today = new Date();
        const schedule = this.getTodaySchedule();

        container.innerHTML = schedule.length ? schedule
            .sort((a, b) => a.time.localeCompare(b.time))
            .map(item => `
                <div class="timeline-item">
                    <div class="timeline-time">${this.formatTime(item.time)}</div>
                    <div class="timeline-content">
                        <div class="medication-name">${item.name}</div>
                        <div class="medication-dosage">${item.dosage} ${item.unit}</div>
                    </div>
                </div>
            `).join('') : '<p class="empty-schedule">No medications scheduled for today</p>';
    }

    getTodaySchedule() {
        const today = new Date();
        const dayOfWeek = today.toLocaleDateString('en-US', { weekday: 'short' }).toLowerCase();
        
        return this.medications
            .filter(med => med.status === 'active')
            .filter(med => {
                if (med.frequency === 'daily') return true;
                if (med.frequency === 'weekly') return med.days.includes(dayOfWeek);
                return false;
            })
            .flatMap(med => med.times.map(time => ({
                ...med,
                time
            })));
    }

    scheduleNotifications(medication) {
        if (!medication.notifyBrowser && !medication.notifySound) return;

        const checkTime = () => {
            const now = new Date();
            const currentTime = now.toLocaleTimeString('en-US', { hour12: false });
            
            medication.times.forEach(scheduleTime => {
                if (currentTime === scheduleTime) {
                    this.showNotification(medication);
                }
            });
        };

        // Check every minute
        const intervalId = setInterval(checkTime, 60000);
        this.notifications.push(intervalId);
    }

    showNotification(medication) {
        if (medication.notifyBrowser && 'Notification' in window && Notification.permission === 'granted') {
            new Notification('Medication Reminder', {
                body: `Time to take ${medication.name} - ${medication.dosage} ${medication.unit}`,
                icon: '/path/to/icon.png'
            });
        }

        if (medication.notifySound) {
            this.playNotificationSound();
        }
    }

    playNotificationSound() {
        const audio = new Audio('/path/to/notification-sound.mp3');
        audio.play().catch(error => console.log('Error playing notification sound:', error));
    }

    logMedication(medicationId, status) {
        const medication = this.medications.find(med => med.id === medicationId);
        if (!medication) return;

        const log = {
            date: new Date().toISOString(),
            status,
            time: new Date().toLocaleTimeString()
        };

        medication.history.unshift(log);
        this.saveMedications();
        this.updateMedicationHistory();
        showNotification(`Medication ${status}!`, 'success');
    }

    updateMedicationHistory() {
        const container = document.getElementById('medicationHistory');
        if (!container) return;

        const history = this.medications
            .flatMap(med => med.history.map(log => ({
                ...log,
                medicationName: med.name,
                dosage: med.dosage,
                unit: med.unit
            })))
            .sort((a, b) => new Date(b.date) - new Date(a.date));

        container.innerHTML = history.map(entry => `
            <div class="history-entry">
                <div>
                    <div class="medication-name">${entry.medicationName}</div>
                    <div class="medication-dosage">${entry.dosage} ${entry.unit}</div>
                    <div class="entry-time">${new Date(entry.date).toLocaleString()}</div>
                </div>
                <span class="history-status status-${entry.status}">${entry.status}</span>
            </div>
        `).join('');
    }

    removeMedication(medicationId) {
        const index = this.medications.findIndex(med => med.id === medicationId);
        if (index !== -1) {
            this.medications.splice(index, 1);
            this.saveMedications();
            this.updateMedicationsList();
            this.updateSchedule();
            showNotification('Medication removed successfully', 'success');
        }
    }

    initializeNotifications() {
        // Clear existing intervals
        this.notifications.forEach(intervalId => clearInterval(intervalId));
        this.notifications = [];

        // Set up notifications for all active medications
        this.medications
            .filter(med => med.status === 'active')
            .forEach(med => this.scheduleNotifications(med));
    }
}

// Initialize medication tracker
const medicationTracker = new MedicationTracker();

function addTimeInput() {
    const container = document.getElementById('timesContainer');
    const timeInput = document.createElement('div');
    timeInput.className = 'time-input';
    timeInput.innerHTML = `
        <input type="time" class="medTime" required>
        <button type="button" class="remove-time" onclick="removeTimeInput(this)">
            <i class="fas fa-times"></i>
        </button>
    `;
    container.appendChild(timeInput);
}

function removeTimeInput(button) {
    const timeInput = button.parentElement;
    if (document.getElementsByClassName('time-input').length > 1) {
        timeInput.remove();
    }
} 