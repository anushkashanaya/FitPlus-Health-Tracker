// Hamburger menu functionality
document.addEventListener('DOMContentLoaded', () => {
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const sidebar = document.querySelector('.sidebar');
    const mainContent = document.querySelector('.main-content');
    const overlay = document.querySelector('.sidebar-overlay');

    function toggleSidebar() {
        sidebar.classList.toggle('open');
        mainContent.classList.toggle('sidebar-open');
        overlay.classList.toggle('active');
    }

    hamburgerBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleSidebar();
    });

    // Close sidebar when clicking overlay
    overlay.addEventListener('click', () => {
        toggleSidebar();
    });

    // Close sidebar when clicking outside
    document.addEventListener('click', (e) => {
        if (!sidebar.contains(e.target) && 
            !hamburgerBtn.contains(e.target) && 
            sidebar.classList.contains('open')) {
            toggleSidebar();
        }
    });
});

// Initialize data structure
const healthData = {
    water: {
        goal: 8,
        current: 0,
        history: []
    },
    meals: [],
    sleep: {
        history: []
    },
    streak: {
        current: 0,
        lastUpdate: null,
        todayActivities: {
            hasActivity: false,
            lastChecked: null
        }
    },
    todos: [],
    steps: {
        current: 0,
        goal: 10000,
        history: [],
        achievements: [],
        lastReset: new Date().toISOString()
    }
};

// Period tracking data structure
const periodData = {
    history: [],
    saveToLocalStorage: function() {
        localStorage.setItem('periodHistory', JSON.stringify(this.history));
    },
    loadFromLocalStorage: function() {
        const saved = localStorage.getItem('periodHistory');
        if (saved) {
            this.history = JSON.parse(saved);
            updatePeriodHistory();
        }
    }
};

// Load data from localStorage
function loadData() {
    const savedData = localStorage.getItem('healthTrackerData');
    if (savedData) {
        Object.assign(healthData, JSON.parse(savedData));
        updateUI();
    }
}

// Save data to localStorage
function saveData() {
    localStorage.setItem('healthTrackerData', JSON.stringify(healthData));
}

// Navigation
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href').substring(1);
        showSection(targetId);
    });
});

function showSection(sectionId) {
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.classList.remove('active');
    });
    
    document.getElementById(sectionId).classList.add('active');
    document.querySelector(`a[href="#${sectionId}"]`).classList.add('active');
}

// Water tracking
function addWater() {
    if (healthData.water.current < healthData.water.goal) {
        healthData.water.current++;
        const time = new Date().toISOString();
        healthData.water.history.push(time);
        updateWaterUI();
        saveData();
        showNotification('Water logged successfully! 💧');
        updateStreak();
    }
}

function subtractWater() {
    if (healthData.water.current > 0) {
        healthData.water.current--;
        healthData.water.history.pop();
        updateWaterUI();
        saveData();
        showNotification('Removed last water entry');
    }
}

function updateWaterUI() {
    document.getElementById('dashboardWaterCount').textContent = healthData.water.current;
    document.getElementById('detailWaterCount').textContent = healthData.water.current;
    updateWaterChart();
    updateWaterHistory();
}

function updateWaterChart() {
    const ctx = document.getElementById('waterChart').getContext('2d');
    const chart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Completed', 'Remaining'],
            datasets: [{
                data: [healthData.water.current, healthData.water.goal - healthData.water.current],
                backgroundColor: ['#2196F3', '#e0e0e0']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
}

function updateWaterHistory() {
    const historyList = document.getElementById('waterHistory');
    historyList.innerHTML = '';
    
    healthData.water.history.forEach((time, index) => {
        const date = new Date(time);
        const listItem = document.createElement('li');
        listItem.innerHTML = `Glass ${index + 1}: ${date.toLocaleTimeString()}`;
        historyList.appendChild(listItem);
    });
}

// Meal tracking
function addMeal() {
    const mealForm = document.createElement('div');
    mealForm.innerHTML = `
        <input type="text" id="mealName" placeholder="What did you eat?" class="meal-input">
        <input type="text" id="mealNotes" placeholder="Any notes? (optional)" class="meal-input">
    `;
    
    showDialog('Add Meal', mealForm, () => {
        const mealName = document.getElementById('mealName').value;
        const mealNotes = document.getElementById('mealNotes').value;
        
        if (mealName) {
            const meal = {
                food: mealName,
                notes: mealNotes,
                time: new Date().toISOString()
            };
            healthData.meals.push(meal);
            saveData();
            updateMealHistory();
            showNotification('Meal logged successfully! 🍽️');
            updateStreak();
        }
    });
}

function updateMealHistory() {
    const mealsList = document.getElementById('mealHistory');
    if (!mealsList) return;
    
    mealsList.innerHTML = '';
    const today = new Date().toDateString();
    
    healthData.meals.forEach(meal => {
        const mealDate = new Date(meal.time);
        if (mealDate.toDateString() === today) {
            const listItem = document.createElement('li');
            listItem.innerHTML = `
                <strong>${mealDate.toLocaleTimeString()}</strong>
                <p>${meal.food}</p>
                ${meal.notes ? `<small>${meal.notes}</small>` : ''}
            `;
            mealsList.appendChild(listItem);
        }
    });
}

// Sleep tracking
function logSleep() {
    const sleepTime = document.getElementById('sleepTime').value;
    const wakeTime = document.getElementById('wakeTime').value;
    
    if (sleepTime && wakeTime) {
        const sleepEntry = {
            sleep: sleepTime,
            wake: wakeTime,
            date: new Date().toISOString()
        };
        healthData.sleep.history.push(sleepEntry);
        saveData();
        updateSleepHistory();
        showNotification('Sleep logged successfully! 😴');
        updateStreak();
    }
}

function updateSleepHistory() {
    const sleepList = document.getElementById('sleepHistory');
    if (!sleepList) return;
    
    sleepList.innerHTML = '';
    
    healthData.sleep.history.slice().reverse().forEach(entry => {
        const date = new Date(entry.date);
        const listItem = document.createElement('li');
        
        // Calculate sleep duration
        const sleepStart = new Date(`2000/01/01 ${entry.sleep}`);
        const sleepEnd = new Date(`2000/01/01 ${entry.wake}`);
        let duration = (sleepEnd - sleepStart) / (1000 * 60 * 60);
        if (duration < 0) duration += 24; // Handle sleep past midnight
        
        listItem.innerHTML = `
            <strong>${date.toLocaleDateString()}</strong>
            <p>Sleep: ${entry.sleep} - Wake: ${entry.wake}</p>
            <small>Duration: ${duration.toFixed(1)} hours</small>
        `;
        sleepList.appendChild(listItem);
    });
}

// Dialog helper
function showDialog(title, content, onConfirm) {
    const dialog = document.createElement('div');
    dialog.className = 'dialog-overlay';
    dialog.innerHTML = `
        <div class="dialog">
            <h3>${title}</h3>
            <div class="dialog-content"></div>
            <div class="dialog-buttons">
                <button onclick="this.closest('.dialog-overlay').remove()">Cancel</button>
                <button class="confirm-btn">Confirm</button>
            </div>
        </div>
    `;
    
    dialog.querySelector('.dialog-content').appendChild(content);
    document.body.appendChild(dialog);
    
    dialog.querySelector('.confirm-btn').addEventListener('click', () => {
        onConfirm();
        dialog.remove();
    });
}

// Updated Streak system
function updateStreak() {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize to start of day
    const todayStr = today.toISOString();

    // Check if we need to reset today's activity flag
    if (healthData.streak.todayActivities.lastChecked) {
        const lastChecked = new Date(healthData.streak.todayActivities.lastChecked);
        lastChecked.setHours(0, 0, 0, 0);
        
        // If it's a new day, reset the activity flag
        if (today.getTime() !== lastChecked.getTime()) {
            healthData.streak.todayActivities.hasActivity = false;
        }
    }

    // If we already logged something today, don't increase the streak
    if (healthData.streak.todayActivities.hasActivity) {
        return;
    }

    // Mark that we've logged something today
    healthData.streak.todayActivities.hasActivity = true;
    healthData.streak.todayActivities.lastChecked = todayStr;

    // Handle streak counting
    if (!healthData.streak.lastUpdate) {
        // First ever activity
        healthData.streak.current = 1;
    } else {
        const lastUpdate = new Date(healthData.streak.lastUpdate);
        lastUpdate.setHours(0, 0, 0, 0);
        const daysDiff = Math.floor((today - lastUpdate) / (1000 * 60 * 60 * 24));

        if (daysDiff === 1) {
            // Activity on consecutive day
            healthData.streak.current++;
        } else if (daysDiff > 1) {
            // Missed a day or more
            healthData.streak.current = 1;
        }
        // If daysDiff === 0, it's same day activity, don't change streak
    }

    healthData.streak.lastUpdate = todayStr;
    saveData();
    updateStreakDisplay();
}

function updateStreakDisplay() {
    const streakCount = document.getElementById('streakCount');
    const streakCountDetail = document.getElementById('streakCountDetail');
    
    if (streakCount) {
        streakCount.textContent = healthData.streak.current;
    }
    if (streakCountDetail) {
        streakCountDetail.textContent = healthData.streak.current;
    }
}

// Get selected symptoms from checkboxes
function getSelectedSymptoms() {
    const checkboxes = document.querySelectorAll('.symptom-checkboxes input[type="checkbox"]:checked');
    return Array.from(checkboxes).map(checkbox => checkbox.value);
}

// Remedies suggestions system
const remediesSuggestions = {
    cramps: {
        quick: ['Apply a heating pad to your lower abdomen', 'Try gentle stretching exercises', 'Take a warm bath'],
        natural: ['Drink ginger or chamomile tea', 'Practice deep breathing exercises', 'Try acupressure points'],
        lifestyle: ['Regular light exercise', 'Avoid caffeine and salt', 'Stay hydrated']
    },
    headache: {
        quick: ['Rest in a dark, quiet room', 'Apply cold or warm compress to your head', 'Practice neck stretches'],
        natural: ['Stay hydrated', 'Try peppermint tea', 'Practice relaxation techniques'],
        lifestyle: ['Maintain regular sleep schedule', 'Manage stress levels', 'Consider keeping a headache diary']
    },
    mood: {
        quick: ['Take a short walk outside', 'Listen to calming music', 'Practice deep breathing'],
        natural: ['Try aromatherapy with lavender', 'Get some sunlight', 'Write in a journal'],
        lifestyle: ['Regular exercise routine', 'Maintain social connections', 'Practice mindfulness']
    },
    fatigue: {
        quick: ['Take a power nap (15-20 minutes)', 'Have a small protein-rich snack', 'Get some fresh air'],
        natural: ['Try B-complex vitamins', 'Drink green tea', 'Practice light stretching'],
        lifestyle: ['Maintain regular sleep schedule', 'Balance activity with rest', 'Stay hydrated']
    },
    bloating: {
        quick: ['Avoid carbonated drinks', 'Try gentle abdominal massage', 'Take a short walk'],
        natural: ['Drink peppermint or fennel tea', 'Try yoga poses for digestion', 'Eat smaller meals'],
        lifestyle: ['Reduce salt intake', 'Eat more fiber-rich foods', 'Stay active']
    },
    backache: {
        quick: ['Apply heating pad', 'Try gentle stretching', 'Practice good posture'],
        natural: ['Take a warm bath with Epsom salts', 'Try yoga poses for back pain', 'Light massage'],
        lifestyle: ['Regular exercise to strengthen back muscles', 'Maintain good posture', 'Use proper lifting techniques']
    },
    breast_tenderness: {
        quick: ['Wear a supportive bra', 'Apply cold compress', 'Avoid caffeine'],
        natural: ['Try evening primrose oil', 'Increase vitamin E intake', 'Gentle massage'],
        lifestyle: ['Wear comfortable, well-fitting bras', 'Reduce salt intake', 'Regular gentle exercise']
    },
    acne: {
        quick: ['Keep hands away from face', 'Use oil-free moisturizer', 'Apply ice to reduce inflammation'],
        natural: ['Try tea tree oil spot treatment', 'Use honey as a face mask', 'Stay hydrated'],
        lifestyle: ['Regular face washing routine', 'Change pillowcase frequently', 'Maintain a balanced diet']
    },
    nausea: {
        quick: ['Try ginger candy or capsules', 'Practice deep breathing', 'Stay in upright position'],
        natural: ['Drink peppermint tea', 'Try acupressure wristbands', 'Eat small, frequent meals'],
        lifestyle: ['Avoid strong smells', 'Eat bland foods', 'Stay hydrated']
    },
    insomnia: {
        quick: ['Practice relaxation techniques', 'Try white noise', 'Keep room cool and dark'],
        natural: ['Drink chamomile tea', 'Try magnesium supplements', 'Use lavender essential oil'],
        lifestyle: ['Maintain regular sleep schedule', 'Avoid screens before bed', 'Create bedtime routine']
    },
    appetite: {
        quick: ['Eat small, frequent meals', 'Keep healthy snacks handy', 'Stay hydrated'],
        natural: ['Try ginger tea for nausea', 'Include protein-rich foods', 'Eat mindfully'],
        lifestyle: ['Regular meal schedule', 'Balance nutrients', 'Listen to hunger cues']
    },
    dizziness: {
        quick: ['Sit or lie down immediately', 'Take slow, deep breaths', 'Stay hydrated'],
        natural: ['Try ginger tea', 'Increase iron-rich foods', 'Practice gentle movement'],
        lifestyle: ['Regular meals', 'Adequate rest', 'Avoid sudden movements']
    },
    anxiety: {
        quick: ['Practice 4-7-8 breathing', 'Try grounding exercises', 'Listen to calming music'],
        natural: ['Try chamomile tea', 'Use lavender aromatherapy', 'Practice meditation'],
        lifestyle: ['Regular exercise', 'Adequate sleep', 'Stress management techniques']
    },
    cravings: {
        quick: ['Drink water', 'Have a small healthy snack', 'Try sugar-free gum'],
        natural: ['Eat dark chocolate', 'Try fruit for sweet cravings', 'Include protein-rich foods'],
        lifestyle: ['Regular balanced meals', 'Meal planning', 'Mindful eating']
    },
    joint_pain: {
        quick: ['Apply ice or heat', 'Gentle stretching', 'Rest affected joints'],
        natural: ['Try turmeric tea', 'Epsom salt bath', 'Gentle massage'],
        lifestyle: ['Low-impact exercise', 'Maintain healthy weight', 'Good posture habits']
    }
};

// Update remedies based on selected symptoms
function updateRemedies() {
    const selectedSymptoms = getSelectedSymptoms();
    console.log('Selected symptoms:', selectedSymptoms);
    
    const quickTipsList = document.getElementById('quickReliefTips');
    const naturalRemediesList = document.getElementById('naturalRemedies');
    const lifestyleList = document.getElementById('lifestyleAdjustments');
    const remediesPlaceholder = document.querySelector('.remedies-placeholder');
    const remediesList = document.querySelector('.remedies-list');

    console.log('Found DOM elements:', {
        quickTipsList,
        naturalRemediesList,
        lifestyleList,
        remediesPlaceholder,
        remediesList
    });

    // Clear previous suggestions
    quickTipsList.innerHTML = '';
    naturalRemediesList.innerHTML = '';
    lifestyleList.innerHTML = '';

    if (selectedSymptoms.length === 0) {
        console.log('No symptoms selected');
        remediesPlaceholder.style.display = 'block';
        remediesList.style.display = 'none';
        return;
    }

    console.log('Showing remedies for symptoms');
    remediesPlaceholder.style.display = 'none';
    remediesList.style.display = 'block';

    // Collect unique remedies for selected symptoms
    const uniqueRemedies = {
        quick: new Set(),
        natural: new Set(),
        lifestyle: new Set()
    };

    selectedSymptoms.forEach(symptom => {
        console.log('Processing symptom:', symptom);
        if (remediesSuggestions[symptom]) {
            remediesSuggestions[symptom].quick.forEach(tip => uniqueRemedies.quick.add(tip));
            remediesSuggestions[symptom].natural.forEach(tip => uniqueRemedies.natural.add(tip));
            remediesSuggestions[symptom].lifestyle.forEach(tip => uniqueRemedies.lifestyle.add(tip));
        }
    });

    console.log('Unique remedies:', uniqueRemedies);

    // Add remedies to lists
    uniqueRemedies.quick.forEach(tip => {
        const li = document.createElement('li');
        li.innerHTML = `<i class="fas fa-check-circle"></i>${tip}`;
        quickTipsList.appendChild(li);
    });

    uniqueRemedies.natural.forEach(tip => {
        const li = document.createElement('li');
        li.innerHTML = `<i class="fas fa-leaf"></i>${tip}`;
        naturalRemediesList.appendChild(li);
    });

    uniqueRemedies.lifestyle.forEach(tip => {
        const li = document.createElement('li');
        li.innerHTML = `<i class="fas fa-heart"></i>${tip}`;
        lifestyleList.appendChild(li);
    });
}

// Add event listeners to symptom checkboxes
document.addEventListener('DOMContentLoaded', () => {
    const symptomCheckboxes = document.querySelectorAll('.symptom-checkboxes input[type="checkbox"]');
    symptomCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', updateRemedies);
    });
});

// Function to log period data
function logPeriodData() {
    const startDate = document.getElementById('periodStartDate').value;
    const endDate = document.getElementById('periodEndDate').value;
    const symptoms = getSelectedSymptoms();
    const flowIntensity = document.getElementById('flowIntensity').value;

    if (!startDate || !endDate) {
        showNotification('Please select both start and end dates', 'warning');
        return;
    }

    // Validate dates
    if (new Date(endDate) < new Date(startDate)) {
        showNotification('End date cannot be before start date', 'warning');
        return;
    }

    // Add to history using the MenstrualTracker instance
    window.healthTracking.menstrualTracker.logPeriod(startDate, symptoms, flowIntensity);
    window.healthTracking.menstrualTracker.endPeriod(endDate);
    updatePeriodHistory();
    showNotification('Period data logged successfully! 📝');

    // Clear form
    document.getElementById('periodStartDate').value = '';
    document.getElementById('periodEndDate').value = '';
    document.getElementById('flowIntensity').value = '';
    document.querySelectorAll('.symptom-checkboxes input[type="checkbox"]').forEach(cb => cb.checked = false);
    updateRemedies(); // Clear remedies display

    // Update cycle stats
    const cycleStats = document.getElementById('cycleStats');
    const avgCycle = window.healthTracking.menstrualTracker.getAverageCycleLength();
    const avgPeriod = window.healthTracking.menstrualTracker.getAveragePeriodLength();

    if (avgCycle || avgPeriod) {
        cycleStats.innerHTML = `
            ${avgCycle ? `<li>Average Cycle Length: ${avgCycle} days</li>` : ''}
            ${avgPeriod ? `<li>Average Period Length: ${avgPeriod} days</li>` : ''}
        `;
    } else {
        cycleStats.innerHTML = '<li>Need more data to calculate statistics</li>';
    }
}

// Function to update period history display
function updatePeriodHistory() {
    const historyList = document.getElementById('periodHistory');
    historyList.innerHTML = '';

    const cycles = window.healthTracking.menstrualTracker.cycles;
    cycles.forEach((entry, index) => {
        const startDate = new Date(entry.startDate).toLocaleDateString();
        const endDate = entry.endDate ? new Date(entry.endDate).toLocaleDateString() : 'Ongoing';
        const duration = entry.endDate ? calculateDuration(entry.startDate, entry.endDate) : 'In progress';

        const li = document.createElement('li');
        li.className = 'period-entry';
        
        let flowClass = '';
        if (entry.flowIntensity) {
            flowClass = `flow-${entry.flowIntensity.toLowerCase()}`;
        }

        li.innerHTML = `
            <div class="period-entry-header">
                <div class="period-dates">
                    <span class="date-range">${startDate} - ${endDate}</span>
                    <span class="duration">${duration} ${typeof duration === 'number' ? 'days' : ''}</span>
                </div>
                <button class="delete-entry" onclick="deletePeriodEntry(${index})" title="Delete this entry">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
            ${entry.flowIntensity ? `<div class="flow-indicator ${flowClass}">${entry.flowIntensity}</div>` : ''}
            ${entry.symptoms && entry.symptoms.length > 0 ? `
                <div class="symptoms-tags">
                    ${entry.symptoms.map(symptom => `
                        <span class="symptom-tag">${symptom.replace('_', ' ')}</span>
                    `).join('')}
                </div>
            ` : ''}
        `;

        historyList.appendChild(li);
    });

    // Update next period prediction
    const nextPeriod = window.healthTracking.menstrualTracker.predictNextPeriod();
    const nextPeriodElement = document.getElementById('nextPeriodDate');
    if (nextPeriod) {
        nextPeriodElement.textContent = nextPeriod.toLocaleDateString();
    } else {
        nextPeriodElement.textContent = 'Need more data to predict';
    }
}

// Function to delete a period entry
function deletePeriodEntry(index) {
    if (confirm('Are you sure you want to delete this entry?')) {
        window.healthTracking.menstrualTracker.cycles.splice(index, 1);
        window.healthTracking.menstrualTracker.saveData();
        updatePeriodHistory();
        showNotification('Entry deleted successfully');
    }
}

// Helper function to calculate duration between dates
function calculateDuration(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays + 1; // Include both start and end days
}

// Add event listeners for date inputs
document.addEventListener('DOMContentLoaded', () => {
    loadData();
    updateWaterChart();
    updateWaterHistory();
    updateMealHistory();
    updateSleepHistory();
    showSection('dashboard');

    // Initialize period tracking
    const startDateInput = document.getElementById('periodStartDate');
    const endDateInput = document.getElementById('periodEndDate');
    const flowIntensityInput = document.getElementById('flowIntensity');

    // Add submit button to period tracking form
    const periodInputDiv = document.querySelector('.period-input');
    if (periodInputDiv) {
        const submitButton = document.createElement('button');
        submitButton.textContent = 'Log Period';
        submitButton.className = 'submit-period';
        submitButton.onclick = logPeriodData;
        periodInputDiv.appendChild(submitButton);
    }

    // Update period history on page load
    updatePeriodHistory();

    // Update cycle stats
    const cycleStats = document.getElementById('cycleStats');
    const avgCycle = window.healthTracking.menstrualTracker.getAverageCycleLength();
    const avgPeriod = window.healthTracking.menstrualTracker.getAveragePeriodLength();

    if (cycleStats) {
        if (avgCycle || avgPeriod) {
            cycleStats.innerHTML = `
                ${avgCycle ? `<li>Average Cycle Length: ${avgCycle} days</li>` : ''}
                ${avgPeriod ? `<li>Average Period Length: ${avgPeriod} days</li>` : ''}
            `;
        } else {
            cycleStats.innerHTML = '<li>Need more data to calculate statistics</li>';
        }
    }

    // Update next period prediction
    const nextPeriodElement = document.getElementById('nextPeriodDate');
    if (nextPeriodElement) {
        const nextPeriod = window.healthTracking.menstrualTracker.predictNextPeriod();
        if (nextPeriod) {
            nextPeriodElement.textContent = nextPeriod.toLocaleDateString();
        } else {
            nextPeriodElement.textContent = 'Need more data to predict';
        }
    }

    // Add search functionality
    const searchInput = document.querySelector('.symptoms-search input');
    console.log('Search input found:', searchInput);
    
    if (searchInput) {
        let debounceTimer;
        searchInput.addEventListener('input', (e) => {
            try {
                console.log('Search input event triggered:', e.target.value);
                clearTimeout(debounceTimer);
                debounceTimer = setTimeout(() => {
                    searchSymptoms(e.target.value);
                }, 300);
            } catch (err) {
                console.error('Error in search input event handler:', err);
            }
        });
    } else {
        console.error('Search input element not found');
    }
});

// Emergency numbers for different countries
const emergencyNumbers = {
    india: {
        medical: [
            { name: 'Ambulance', number: '108' },
            { name: 'National Emergency', number: '112' },
            { name: 'COVID-19 Helpline', number: '1075' }
        ],
        policeAndFire: [
            { name: 'Police', number: '100' },
            { name: 'Fire', number: '101' },
            { name: 'Disaster Management', number: '108' }
        ],
        helplines: [
            { name: 'Women Helpline', number: '1091' },
            { name: 'Child Helpline', number: '1098' },
            { name: 'Senior Citizen Helpline', number: '14567' },
            { name: 'Mental Health Helpline', number: '1800-599-0019' }
        ]
    },
    usa: {
        medical: [
            { name: 'Emergency (All Services)', number: '911' },
            { name: 'Poison Control', number: '1-800-222-1222' }
        ],
        policeAndFire: [
            { name: 'Emergency (All Services)', number: '911' }
        ],
        helplines: [
            { name: 'Suicide Prevention', number: '988' },
            { name: 'Domestic Violence', number: '1-800-799-7233' }
        ]
    },
    uk: {
        medical: [
            { name: 'Emergency Services', number: '999' },
            { name: 'Non-Emergency Medical', number: '111' }
        ],
        policeAndFire: [
            { name: 'Emergency Services', number: '999' },
            { name: 'Non-Emergency Police', number: '101' }
        ],
        helplines: [
            { name: 'Samaritans', number: '116 123' }
        ]
    },
    australia: {
        medical: [
            { name: 'Emergency Services', number: '000' }
        ],
        policeAndFire: [
            { name: 'Emergency Services', number: '000' }
        ],
        helplines: [
            { name: 'Lifeline', number: '13 11 14' },
            { name: 'Kids Helpline', number: '1800 55 1800' }
        ]
    },
    canada: {
        medical: [
            { name: 'Emergency Services', number: '911' }
        ],
        policeAndFire: [
            { name: 'Emergency Services', number: '911' }
        ],
        helplines: [
            { name: 'Mental Health Crisis', number: '1-833-456-4566' }
        ]
    },
    japan: {
        medical: [
            { name: 'Ambulance & Fire', number: '119' }
        ],
        policeAndFire: [
            { name: 'Police', number: '110' },
            { name: 'Fire & Ambulance', number: '119' }
        ],
        helplines: [
            { name: 'TELL Lifeline', number: '03-5774-0992' }
        ]
    },
    singapore: {
        medical: [
            { name: 'Emergency Ambulance', number: '995' }
        ],
        policeAndFire: [
            { name: 'Police', number: '999' },
            { name: 'Fire', number: '995' }
        ],
        helplines: [
            { name: 'Mental Health Helpline', number: '6389-2222' }
        ]
    },
    uae: {
        medical: [
            { name: 'Ambulance', number: '998' },
            { name: 'Emergency', number: '999' }
        ],
        policeAndFire: [
            { name: 'Police', number: '999' },
            { name: 'Fire', number: '997' }
        ],
        helplines: [
            { name: 'Mental Health Support', number: '800-4673' }
        ]
    }
};

// Function to update emergency numbers based on selected country
function updateEmergencyNumbers() {
    const country = document.getElementById('countrySelect').value;
    const numbers = emergencyNumbers[country];

    // Update medical emergency numbers
    const medicalList = document.getElementById('medicalEmergency');
    medicalList.innerHTML = numbers.medical.map(item => `
        <li>
            <span class="emergency-name">${item.name}:</span>
            <a href="tel:${item.number}" class="emergency-number">
                <i class="fas fa-phone"></i> ${item.number}
            </a>
        </li>
    `).join('');

    // Update police and fire numbers
    const policeFireList = document.getElementById('policeAndFire');
    policeFireList.innerHTML = numbers.policeAndFire.map(item => `
        <li>
            <span class="emergency-name">${item.name}:</span>
            <a href="tel:${item.number}" class="emergency-number">
                <i class="fas fa-phone"></i> ${item.number}
            </a>
        </li>
    `).join('');

    // Update helpline numbers
    const helplinesList = document.getElementById('helplines');
    helplinesList.innerHTML = numbers.helplines.map(item => `
        <li>
            <span class="emergency-name">${item.name}:</span>
            <a href="tel:${item.number}" class="emergency-number">
                <i class="fas fa-phone"></i> ${item.number}
            </a>
        </li>
    `).join('');
}

// Initialize emergency numbers when page loads
document.addEventListener('DOMContentLoaded', () => {
    // ... existing DOMContentLoaded code ...
    updateEmergencyNumbers(); // Initialize with India's numbers
});

// Symptoms information database
const symptomsData = {
    // GENERAL CATEGORY
    headache: {
        name: 'Headache',
        description: 'Pain or discomfort in any region of the head, varying in pattern, location, and intensity.',
        commonCauses: [
            'Tension and stress',
            'Dehydration',
            'Lack of sleep',
            'Eye strain from screens',
            'Sinus congestion'
        ],
        selfCare: [
            'Rest in a quiet, dark room',
            'Apply cold or warm compress to head/neck',
            'Stay hydrated with water',
            'Practice relaxation techniques',
            'Take breaks from screens'
        ],
        severity: {
            mild: 'Dull, manageable pain that responds to over-the-counter medication',
            moderate: 'Throbbing pain that affects daily activities',
            severe: 'Intense pain with nausea, sensitivity to light/sound, or vision changes'
        }
    },
    fever: {
        name: 'Fever',
        description: 'Elevated body temperature above 98.6°F (37°C), often indicating that your body is fighting an infection.',
        commonCauses: [
            'Viral infections (flu, COVID-19)',
            'Bacterial infections',
            'Heat exhaustion',
            'Inflammatory conditions',
            'Vaccination reactions'
        ],
        selfCare: [
            'Rest and get plenty of sleep',
            'Stay hydrated with water and clear fluids',
            'Take lukewarm baths',
            'Dress in light clothing',
            'Monitor temperature regularly'
        ],
        severity: {
            mild: 'Temperature 99-100.9°F (37.2-38.3°C), feeling slightly warm',
            moderate: 'Temperature 101-103°F (38.4-39.4°C), with fatigue and body aches',
            severe: 'Temperature above 103°F (39.4°C), or fever lasting more than 3 days'
        }
    },
    fatigue: {
        name: 'Fatigue',
        description: 'Persistent feeling of tiredness, low energy, and reduced physical or mental capacity.',
        commonCauses: [
            'Poor sleep quality or quantity',
            'Physical overexertion',
            'Mental stress or anxiety',
            'Nutritional deficiencies',
            'Underlying medical conditions'
        ],
        selfCare: [
            'Establish a regular sleep schedule',
            'Practice good sleep hygiene',
            'Eat a balanced, nutritious diet',
            'Take short power naps (15-20 minutes)',
            'Moderate exercise within energy limits'
        ],
        severity: {
            mild: 'Tiredness that improves with rest',
            moderate: 'Persistent fatigue affecting daily activities',
            severe: 'Extreme exhaustion not relieved by rest, affecting quality of life'
        }
    },
    dizziness: {
        name: 'Dizziness',
        description: 'Sensation of lightheadedness, unsteadiness, or feeling that the room is spinning (vertigo).',
        commonCauses: [
            'Inner ear problems',
            'Low blood pressure',
            'Dehydration',
            'Anxiety or panic attacks',
            'Medication side effects'
        ],
        selfCare: [
            'Sit or lie down immediately when dizzy',
            'Stay hydrated with water',
            'Move slowly when changing positions',
            'Avoid sudden head movements',
            'Rest in a well-ventilated area'
        ],
        severity: {
            mild: 'Brief episodes that resolve quickly with position change',
            moderate: 'Frequent episodes affecting balance and movement',
            severe: 'Severe dizziness with fainting, vomiting, or chest pain'
        }
    },

    // RESPIRATORY CATEGORY
    cough: {
        name: 'Cough',
        description: 'Reflex action to clear airways of mucus, irritants, or foreign particles.',
        commonCauses: [
            'Upper respiratory infections',
            'Allergies or hay fever',
            'Postnasal drip',
            'Asthma or bronchitis',
            'Acid reflux (GERD)'
        ],
        selfCare: [
            'Stay hydrated with warm liquids',
            'Use honey for soothing (if over 1 year old)',
            'Use a humidifier while sleeping',
            'Avoid irritants like smoke',
            'Elevate head while sleeping'
        ],
        severity: {
            mild: 'Occasional dry or productive cough',
            moderate: 'Frequent cough affecting sleep or activities',
            severe: 'Persistent cough with difficulty breathing or bloody mucus'
        }
    },
    sore_throat: {
        name: 'Sore Throat',
        description: 'Pain, irritation, or inflammation of the throat, especially when swallowing.',
        commonCauses: [
            'Viral infections (common cold)',
            'Strep throat (bacterial)',
            'Allergies',
            'Voice strain',
            'Dry air or environmental irritants'
        ],
        selfCare: [
            'Gargle with warm salt water',
            'Suck on throat lozenges',
            'Drink warm herbal tea with honey',
            'Use throat sprays',
            'Rest your voice'
        ],
        severity: {
            mild: 'Mild pain when swallowing',
            moderate: 'Constant pain affecting eating and drinking',
            severe: 'Severe pain with difficulty breathing or swollen lymph nodes'
        }
    },
    runny_nose: {
        name: 'Runny Nose',
        description: 'Excess nasal drainage, which can be clear, thick, or colored.',
        commonCauses: [
            'Common cold or flu',
            'Seasonal allergies',
            'Sinusitis',
            'Cold weather',
            'Spicy foods'
        ],
        selfCare: [
            'Blow nose gently',
            'Use saline nasal sprays',
            'Stay hydrated',
            'Use a humidifier',
            'Elevate head while sleeping'
        ],
        severity: {
            mild: 'Clear discharge, minimal discomfort',
            moderate: 'Thicker discharge affecting breathing',
            severe: 'Colored discharge with facial pain or fever'
        }
    },
    shortness_of_breath: {
        name: 'Shortness of Breath',
        description: 'Difficulty breathing or feeling like you cannot get enough air (dyspnea).',
        commonCauses: [
            'Physical exertion',
            'Anxiety or panic attacks',
            'Asthma',
            'High altitude',
            'Respiratory infections'
        ],
        selfCare: [
            'Practice pursed-lip breathing',
            'Sit upright and lean slightly forward',
            'Use a fan for air circulation',
            'Practice relaxation techniques',
            'Avoid triggers (if known)'
        ],
        severity: {
            mild: 'Occurs only with physical activity',
            moderate: 'Occurs with minimal exertion',
            severe: 'Occurs at rest or with blue lips/fingers'
        }
    },

    // DIGESTIVE CATEGORY
    nausea: {
        name: 'Nausea',
        description: 'Unpleasant sensation of wanting to vomit, often accompanied by queasiness.',
        commonCauses: [
            'Food poisoning',
            'Motion sickness',
            'Pregnancy',
            'Migraine headaches',
            'Medication side effects'
        ],
        selfCare: [
            'Eat small, bland meals',
            'Drink clear fluids slowly',
            'Try ginger tea or candies',
            'Avoid strong odors',
            'Rest in semi-upright position'
        ],
        severity: {
            mild: 'Occasional queasiness without vomiting',
            moderate: 'Persistent nausea affecting eating',
            severe: 'Severe nausea with repeated vomiting or dehydration'
        }
    },
    stomach_pain: {
        name: 'Stomach Pain',
        description: 'Discomfort or pain in the abdomen, ranging from mild cramps to sharp pain.',
        commonCauses: [
            'Indigestion',
            'Gas or bloating',
            'Food intolerance',
            'Stomach virus',
            'Menstrual cramps'
        ],
        selfCare: [
            'Eat smaller, frequent meals',
            'Avoid trigger foods',
            'Apply warm compress',
            'Try peppermint tea',
            'Practice gentle movement'
        ],
        severity: {
            mild: 'Intermittent discomfort that comes and goes',
            moderate: 'Persistent pain affecting daily activities',
            severe: 'Intense pain with fever, vomiting, or severe tenderness'
        }
    },
    diarrhea: {
        name: 'Diarrhea',
        description: 'Frequent loose or watery bowel movements, often with urgency.',
        commonCauses: [
            'Viral gastroenteritis',
            'Food poisoning',
            'Food intolerances',
            'Medication side effects',
            'Stress or anxiety'
        ],
        selfCare: [
            'Stay hydrated with water and electrolytes',
            'Eat bland foods (BRAT diet)',
            'Avoid dairy and caffeine',
            'Probiotics may help',
            'Rest and stay near bathroom'
        ],
        severity: {
            mild: 'Few episodes that resolve in 1-2 days',
            moderate: 'Multiple daily episodes lasting several days',
            severe: 'Frequent episodes with dehydration or bloody stools'
        }
    },
    loss_of_appetite: {
        name: 'Loss of Appetite',
        description: 'Decreased desire to eat, often accompanied by reduced food intake.',
        commonCauses: [
            'Infections or illness',
            'Emotional stress',
            'Depression or anxiety',
            'Medication side effects',
            'Digestive issues'
        ],
        selfCare: [
            'Eat small, frequent meals',
            'Choose nutrient-dense foods',
            'Try liquid nutrition supplements',
            'Set regular meal times',
            'Light exercise before meals'
        ],
        severity: {
            mild: 'Reduced interest in food but still eating',
            moderate: 'Significant decrease in food intake',
            severe: 'Complete aversion to food with weight loss'
        }
    },

    // MUSCULOSKELETAL CATEGORY
    muscle_pain: {
        name: 'Muscle Pain',
        description: 'Pain or aching in muscles, which can be localized or widespread.',
        commonCauses: [
            'Exercise or overuse',
            'Poor posture',
            'Tension or stress',
            'Injury or strain',
            'Viral infections'
        ],
        selfCare: [
            'Rest affected muscles',
            'Apply ice for acute pain',
            'Use heat for chronic pain',
            'Gentle stretching',
            'Over-the-counter pain relievers'
        ],
        severity: {
            mild: "Localized soreness that does not limit activity",
            moderate: 'Pain affecting daily activities',
            severe: 'Intense pain with swelling or limited movement'
        }
    },
    joint_pain: {
        name: 'Joint Pain',
        description: 'Pain, stiffness, or swelling in joints that can affect movement.',
        commonCauses: [
            'Osteoarthritis',
            'Rheumatoid arthritis',
            'Injury or overuse',
            'Gout',
            'Weather changes'
        ],
        selfCare: [
            'Rest affected joints',
            'Apply ice/heat therapy',
            'Gentle range of motion exercises',
            'Use joint supports if needed',
            'Maintain healthy weight'
        ],
        severity: {
            mild: 'Occasional stiffness with full movement',
            moderate: 'Regular pain affecting joint use',
            severe: 'Constant pain with reduced mobility'
        }
    },
    back_pain: {
        name: 'Back Pain',
        description: 'Pain in the upper, middle, or lower back, which can be sharp, dull, or aching.',
        commonCauses: [
            'Poor posture',
            'Muscle strain',
            'Herniated disc',
            'Spinal stenosis',
            'Lifting heavy objects'
        ],
        selfCare: [
            'Practice good posture',
            'Use proper lifting techniques',
            'Apply ice/heat therapy',
            'Gentle stretching exercises',
            'Strengthen core muscles'
        ],
        severity: {
            mild: "Temporary pain that does not limit activity",
            moderate: 'Pain affecting daily activities',
            severe: 'Severe pain with numbness or weakness'
        }
    },
    neck_pain: {
        name: 'Neck Pain',
        description: 'Pain or stiffness in the neck and upper spine area, often affecting head movement.',
        commonCauses: [
            'Poor posture (tech neck)',
            'Sleeping position',
            'Muscle strain',
            'Stress and tension',
            'Cervical spine issues'
        ],
        selfCare: [
            'Maintain good posture',
            'Use ergonomic setup for work',
            'Gentle neck stretches',
            'Apply ice/heat therapy',
            'Take regular screen breaks'
        ],
        severity: {
            mild: 'Stiffness with full range of motion',
            moderate: 'Pain affecting head movement',
            severe: 'Intense pain with radiating symptoms'
        }
    }
};

// Function to check symptoms
function checkSymptoms(symptom) {
    console.log('Checking symptom:', symptom); // Debug log
    const info = symptomsData[symptom];
    if (!info) {
        console.log('No information found for symptom:', symptom); // Debug log
        document.getElementById('symptomInfo').innerHTML = '<p>Information not available.</p>';
        return;
    }

    console.log('Found symptom info:', info); // Debug log

    // Clear any active states from previous selections
    document.querySelectorAll('.symptom-button').forEach(button => {
        button.classList.remove('active');
    });

    // Add active state to clicked symptom
    const clickedButton = document.querySelector(`button[onclick="checkSymptoms('${symptom}')"]`);
    if (clickedButton) {
        clickedButton.classList.add('active');
    }

    const severityIndicators = document.querySelectorAll('.severity-indicator div');
    severityIndicators.forEach(div => div.classList.add('hidden'));

    let html = `
        <h4 class="symptom-name">${info.name}</h4>
        <p class="symptom-description">${info.description}</p>
        
        <div class="symptom-section">
            <h5><i class="fas fa-question-circle"></i> Common Causes</h5>
            <ul>
                ${info.commonCauses.map(cause => `<li>${cause}</li>`).join('')}
            </ul>
        </div>

        <div class="symptom-section">
            <h5><i class="fas fa-home"></i> Self-Care Tips</h5>
            <ul>
                ${info.selfCare.map(tip => `<li>${tip}</li>`).join('')}
            </ul>
        </div>

        <div class="symptom-section">
            <h5><i class="fas fa-exclamation-circle"></i> Severity Levels</h5>
            <div class="severity-levels">
                <div class="severity-level mild">
                    <span class="level-label">Mild:</span> ${info.severity.mild}
                </div>
                <div class="severity-level moderate">
                    <span class="level-label">Moderate:</span> ${info.severity.moderate}
                </div>
                <div class="severity-level severe">
                    <span class="level-label">Severe:</span> ${info.severity.severe}
                </div>
            </div>
        </div>
    `;

    const symptomInfoElement = document.getElementById('symptomInfo');
    if (symptomInfoElement) {
        symptomInfoElement.innerHTML = html;
        // Ensure the symptom info is visible
        symptomInfoElement.style.display = 'block';
    } else {
        console.error('Could not find symptomInfo element'); // Debug log
    }

    // Show severity indicators
    const indicators = [
        document.querySelector('.severity-mild'),
        document.querySelector('.severity-moderate'),
        document.querySelector('.severity-severe')
    ];

    indicators.forEach(indicator => {
        if (indicator) {
            indicator.classList.remove('hidden');
        }
    });

    // Scroll the symptom info into view
    symptomInfoElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Function to search symptoms
function searchSymptoms(searchTerm) {
    if (!searchTerm) {
        // Show all symptoms if search is empty
        document.querySelectorAll('.symptom-button').forEach(button => {
            button.closest('li').style.display = '';
            button.classList.remove('highlight');
        });
        return;
    }

    searchTerm = searchTerm.toLowerCase();
    const buttons = document.querySelectorAll('.symptom-button');
    let foundMatch = false;
    
    buttons.forEach(button => {
        const text = button.querySelector('.symptom-text').textContent.toLowerCase();
        const symptomKey = button.getAttribute('onclick').match(/checkSymptoms\('(.+?)'\)/)[1];
        const symptomInfo = symptomsData[symptomKey];
        const li = button.closest('li');
        
        // Search in symptom name and information
        const isMatch = text.includes(searchTerm) || 
            (symptomInfo && (
                symptomInfo.description.toLowerCase().includes(searchTerm) ||
                symptomInfo.commonCauses.some(cause => cause.toLowerCase().includes(searchTerm)) ||
                symptomInfo.selfCare.some(tip => tip.toLowerCase().includes(searchTerm))
            ));
        
        if (isMatch) {
            li.style.display = '';
            button.classList.add('highlight');
            if (!foundMatch) {
                foundMatch = true;
                button.scrollIntoView({ behavior: 'smooth', block: 'center' });
                checkSymptoms(symptomKey);
            }
        } else {
            li.style.display = 'none';
            button.classList.remove('highlight');
        }
    });
}

// Todo list functionality
function addTodo(source = 'main') {
    const inputId = source === 'dashboard' ? 'dashboardTodoInput' : 'todoInput';
    const todoInput = document.getElementById(inputId);
    const todoText = todoInput.value.trim();
    
    if (todoText) {
        const todo = {
            id: Date.now(),
            text: todoText,
            completed: false,
            createdAt: new Date().toISOString()
        };
        
        healthData.todos.push(todo);
        saveData();
        updateTodoLists();
        todoInput.value = '';
        showNotification('Task added successfully! ✅');
    }
}

function toggleTodo(id) {
    const todo = healthData.todos.find(t => t.id === id);
    if (todo) {
        todo.completed = !todo.completed;
        saveData();
        updateTodoLists();
    }
}

function deleteTodo(id) {
    healthData.todos = healthData.todos.filter(t => t.id !== id);
    saveData();
    updateTodoLists();
    showNotification('Task deleted');
}

function updateTodoLists() {
    // Update main todo list
    const todoList = document.getElementById('todoList');
    if (todoList) {
        updateTodoListContent(todoList);
    }
    
    // Update dashboard todo list
    const dashboardTodoList = document.getElementById('dashboardTodoList');
    if (dashboardTodoList) {
        updateTodoListContent(dashboardTodoList);
    }
}

function updateTodoListContent(listElement) {
    listElement.innerHTML = '';
    
    healthData.todos.forEach(todo => {
        const li = document.createElement('li');
        if (todo.completed) {
            li.classList.add('completed');
        }
        
        li.innerHTML = `
            <div class="todo-checkbox ${todo.completed ? 'checked' : ''}" 
                 onclick="toggleTodo(${todo.id})"></div>
            <span class="todo-text">${todo.text}</span>
            <button class="delete-todo" onclick="deleteTodo(${todo.id})">
                <i class="fas fa-trash"></i>
            </button>
        `;
        
        listElement.appendChild(li);
    });
}

// Add event listeners for todo inputs
document.addEventListener('DOMContentLoaded', () => {
    const todoInputs = ['todoInput', 'dashboardTodoInput'];
    
    todoInputs.forEach(inputId => {
        const input = document.getElementById(inputId);
        if (input) {
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    addTodo(inputId === 'dashboardTodoInput' ? 'dashboard' : 'main');
                }
            });
        }
    });
    
    // Update todo lists on initial load
    updateTodoLists();
});

// Step Counter functionality
let stepSensor = null;

async function initializeStepCounter() {
    try {
        if ('LinearAccelerationSensor' in window) {
            stepSensor = new LinearAccelerationSensor({ frequency: 60 });
            stepSensor.addEventListener('reading', detectStep);
            stepSensor.start();
        } else {
            console.log('Step sensor not available');
            // Fallback to manual input or device motion events
            window.addEventListener('devicemotion', handleDeviceMotion);
        }
    } catch (error) {
        console.log('Error initializing step counter:', error);
        // Fallback to device motion events
        window.addEventListener('devicemotion', handleDeviceMotion);
    }
}

const STEP_THRESHOLD = 10; // Adjust this value based on testing
let lastAcceleration = 0;
let isStepCounted = false;

function detectStep(event) {
    const acceleration = Math.sqrt(
        event.target.x ** 2 + 
        event.target.y ** 2 + 
        event.target.z ** 2
    );

    if (acceleration > STEP_THRESHOLD && !isStepCounted) {
        if (Math.abs(acceleration - lastAcceleration) > STEP_THRESHOLD) {
            addStep();
            isStepCounted = true;
        }
    } else if (acceleration < STEP_THRESHOLD) {
        isStepCounted = false;
    }

    lastAcceleration = acceleration;
}

function handleDeviceMotion(event) {
    const acceleration = event.acceleration;
    if (!acceleration) return;

    const total = Math.sqrt(
        acceleration.x ** 2 + 
        acceleration.y ** 2 + 
        acceleration.z ** 2
    );

    if (total > STEP_THRESHOLD && !isStepCounted) {
        if (Math.abs(total - lastAcceleration) > STEP_THRESHOLD) {
            addStep();
            isStepCounted = true;
        }
    } else if (total < STEP_THRESHOLD) {
        isStepCounted = false;
    }

    lastAcceleration = total;
}

function addStep() {
    healthData.steps.current++;
    updateStepDisplay();
    checkStepAchievements();
    saveData();
}

function updateStepDisplay() {
    const stepCount = document.getElementById('stepCount');
    const dashboardStepCount = document.getElementById('dashboardStepCount');
    const stepGoal = document.getElementById('stepGoal');
    const dashboardStepGoal = document.getElementById('dashboardStepGoal');
    const stepPercentage = document.getElementById('stepPercentage');
    const progressRing = document.querySelector('.progress-ring-circle');
    const dashboardProgressBar = document.getElementById('dashboardStepProgressBar');

    if (stepCount) stepCount.textContent = healthData.steps.current.toLocaleString();
    if (dashboardStepCount) dashboardStepCount.textContent = healthData.steps.current.toLocaleString();
    if (stepGoal) stepGoal.textContent = healthData.steps.goal.toLocaleString();
    if (dashboardStepGoal) dashboardStepGoal.textContent = healthData.steps.goal.toLocaleString();

    const percentage = Math.min((healthData.steps.current / healthData.steps.goal) * 100, 100);
    
    if (stepPercentage) stepPercentage.textContent = Math.round(percentage);
    
    if (progressRing) {
        const circumference = 2 * Math.PI * 90;
        const offset = circumference - (percentage / 100) * circumference;
        progressRing.style.strokeDasharray = `${circumference} ${circumference}`;
        progressRing.style.strokeDashoffset = offset;
    }

    if (dashboardProgressBar) {
        dashboardProgressBar.style.width = `${percentage}%`;
    }

    updateActivityStats();
}

function updateActivityStats() {
    const caloriesBurned = document.getElementById('caloriesBurned');
    const distanceWalked = document.getElementById('distanceWalked');
    const activeMinutes = document.getElementById('activeMinutes');

    // Average stride length is about 0.7 meters
    const distanceInKm = (healthData.steps.current * 0.7) / 1000;
    // Average calorie burn is about 0.04 calories per step
    const calories = Math.round(healthData.steps.current * 0.04);
    // Estimate active minutes (assuming average walking speed)
    const minutes = Math.round((healthData.steps.current / 100) * 1.5);

    if (caloriesBurned) caloriesBurned.textContent = calories;
    if (distanceWalked) distanceWalked.textContent = distanceInKm.toFixed(2);
    if (activeMinutes) activeMinutes.textContent = minutes;
}

function resetSteps() {
    if (confirm('Are you sure you want to reset your step count?')) {
        // Save current steps to history before resetting
        healthData.steps.history.push({
            date: healthData.steps.lastReset,
            steps: healthData.steps.current
        });
        
        healthData.steps.current = 0;
        healthData.steps.lastReset = new Date().toISOString();
        
        updateStepDisplay();
        updateStepHistory();
        saveData();
    }
}

function showStepGoalDialog() {
    const newGoal = prompt('Enter your daily step goal:', healthData.steps.goal);
    if (newGoal !== null) {
        const goal = parseInt(newGoal);
        if (!isNaN(goal) && goal > 0) {
            healthData.steps.goal = goal;
            updateStepDisplay();
            saveData();
        } else {
            alert('Please enter a valid number greater than 0');
        }
    }
}

function updateStepHistory() {
    const ctx = document.getElementById('stepHistoryChart');
    if (!ctx) return;

    const last7Days = healthData.steps.history.slice(-7);
    const labels = last7Days.map(day => new Date(day.date).toLocaleDateString());
    const data = last7Days.map(day => day.steps);

    if (window.stepHistoryChart) {
        window.stepHistoryChart.destroy();
    }

    window.stepHistoryChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Steps',
                data: data,
                backgroundColor: 'rgba(90, 191, 183, 0.5)',
                borderColor: 'rgba(90, 191, 183, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

function checkStepAchievements() {
    const achievements = [
        { id: 'first-step', name: 'First Steps', requirement: 1, icon: '👶' },
        { id: '1000-steps', name: 'Getting Started', requirement: 1000, icon: '🌱' },
        { id: '5000-steps', name: 'Walking Warrior', requirement: 5000, icon: '⚔️' },
        { id: '10000-steps', name: 'Step Master', requirement: 10000, icon: '👑' }
    ];

    const achievementsList = document.getElementById('stepAchievements');
    if (!achievementsList) return;

    achievements.forEach(achievement => {
        if (healthData.steps.current >= achievement.requirement &&
            !healthData.steps.achievements.includes(achievement.id)) {
            
            healthData.steps.achievements.push(achievement.id);
            
            const li = document.createElement('li');
            li.innerHTML = `
                <span class="achievement-icon">${achievement.icon}</span>
                <span class="achievement-name">${achievement.name}</span>
            `;
            achievementsList.appendChild(li);
            
            showNotification(`Achievement Unlocked: ${achievement.name}!`);
        }
    });
}

// Initialize step counter when the page loads
document.addEventListener('DOMContentLoaded', () => {
    initializeStepCounter();
    updateStepDisplay();
    updateStepHistory();
});

// Add this function to handle first aid tips
function showFirstAidTips(condition) {
    // First, update the content
    const firstAidInfo = document.getElementById('firstAidInfo');
    
    // Your existing first aid content logic here
    // ... existing code ...

    // After updating the content, scroll to the first aid info section
    const firstAidContent = document.getElementById('firstaidContent');
    if (firstAidContent) {
        firstAidContent.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start'
        });
    }
} 