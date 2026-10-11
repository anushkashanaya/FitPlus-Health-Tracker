// Notification System
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = message;
    
    document.getElementById('notification-area').appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Reminder System
const reminders = {
    water: {
        interval: 2 * 60 * 60 * 1000, // 2 hours
        message: "Time to drink water! 💧"
    },
    meals: {
        times: ['09:00', '13:00', '19:00'],
        messages: [
            "Time for breakfast! 🍳",
            "Time for lunch! 🥗",
            "Time for dinner! 🍽️"
        ]
    }
};

// Initialize reminders
function initializeReminders() {
    if (!("Notification" in window)) {
        console.log("This browser does not support notifications");
        return;
    }

    Notification.requestPermission().then(permission => {
        if (permission === "granted") {
            setupWaterReminders();
            setupMealReminders();
        }
    });
}

function setupWaterReminders() {
    setInterval(() => {
        if (healthData.water.current < healthData.water.goal) {
            showNotification(reminders.water.message);
            new Notification("Health Tracker", {
                body: reminders.water.message,
                icon: "favicon.ico"
            });
        }
    }, reminders.water.interval);
}

function setupMealReminders() {
    function checkMealTime() {
        const now = new Date();
        const currentTime = now.getHours().toString().padStart(2, '0') + ':' + 
                          now.getMinutes().toString().padStart(2, '0');
        
        reminders.meals.times.forEach((time, index) => {
            if (currentTime === time) {
                showNotification(reminders.meals.messages[index]);
                new Notification("Health Tracker", {
                    body: reminders.meals.messages[index],
                    icon: "favicon.ico"
                });
            }
        });
    }
    
    // Check every minute
    setInterval(checkMealTime, 60000);
}

// Initialize reminders when the page loads
document.addEventListener('DOMContentLoaded', () => {
    initializeReminders();
}); 