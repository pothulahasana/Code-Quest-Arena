// Profile page specific JavaScript
// This works with auth.js for authentication and user display

document.addEventListener('DOMContentLoaded', function() {
    // Check authentication (auth.js handles this)
    if (!authManager.isLoggedIn()) {
        alert('Please login first');
        window.location.href = '../html/signin.html';
        return;
    }

    // Update profile-specific elements
    updateProfileSpecificElements();
    
    // Display coin count from localStorage
    displayCoinsOnProfile();

    // Setup bio editing functionality
    setupBioEditing();

    // Refresh user data on page load
    authManager.refreshUserData();
});

function updateProfileSpecificElements() {
    const user = authManager.getUser();

    // Update profile heading
    const profileHeading = document.querySelector('.heading h1');
    if (profileHeading) {
        profileHeading.textContent = `${user.username.toUpperCase()}'S PROFILE`;
    }

    // Update sidebar user name (auth.js handles this, but ensure it's set)
    const sidebarUserName = document.querySelector('.card h3');
    if (sidebarUserName) {
        sidebarUserName.textContent = user.username;
    }

    console.log('Profile page updated for user:', user.username);
}

function displayBio() {
    const user = authManager.getUser();
    const bioDisplay = document.getElementById('bio-display');
    
    // Get bio from localStorage, or use default
    const userKey = `bio_${user.id || user.username}`;
    let bio = localStorage.getItem(userKey);
    
    if (!bio) {
        bio = `I'm ${user.username}, a passionate learner on Code Quest Arena. I enjoy coding and exploring new technologies. Welcome to my profile!`;
    }
    
    if (bioDisplay) {
        bioDisplay.textContent = bio;
    }
}

function setupBioEditing() {
    const editBtn = document.getElementById('edit-bio-btn');
    const saveBtn = document.getElementById('save-bio-btn');
    const cancelBtn = document.getElementById('cancel-bio-btn');
    const bioDisplay = document.getElementById('bio-display');
    const bioForm = document.getElementById('bio-edit-form');
    const bioTextarea = document.getElementById('bio-textarea');
    
    // Display bio first
    displayBio();
    
    // Edit button click
    if (editBtn) {
        editBtn.addEventListener('click', function() {
            bioDisplay.style.display = 'none';
            bioForm.style.display = 'block';
            bioTextarea.value = bioDisplay.textContent;
        });
    }
    
    // Save button click
    if (saveBtn) {
        saveBtn.addEventListener('click', function() {
            const user = authManager.getUser();
            const newBio = bioTextarea.value.trim();
            
            if (newBio) {
                // Save to localStorage
                const userKey = `bio_${user.id || user.username}`;
                localStorage.setItem(userKey, newBio);
                
                // Update display
                bioDisplay.textContent = newBio;
                
                // Hide form, show display
                bioForm.style.display = 'none';
                bioDisplay.style.display = 'block';
                
                alert('Bio updated successfully!');
                console.log('Bio saved:', newBio);
            } else {
                alert('Bio cannot be empty!');
            }
        });
    }
    
    // Cancel button click
    if (cancelBtn) {
        cancelBtn.addEventListener('click', function() {
            bioForm.style.display = 'none';
            bioDisplay.style.display = 'block';
        });
    }
}

function displayCoinsOnProfile() {
    // Get coin count from user data (initial display)
    const coins = authManager.getStoredCoins();
    const coinElement = document.getElementById('coin-count');
    if (coinElement) {
        coinElement.textContent = coins;
        console.log('Coin count displayed on profile:', coins);
    }
    
    // Fetch fresh coins from MongoDB
    fetchCoinsFromDatabase();
}

async function fetchCoinsFromDatabase() {
    const token = localStorage.getItem('token');
    if (!token) {
        console.error('No token found for coin fetch');
        return;
    }

    try {
        const response = await fetch('http://localhost:5000/api/coins', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            const data = await response.json();
            const coinElement = document.getElementById('coin-count');
            if (coinElement) {
                coinElement.innerText = data.coins;
                console.log('Coins updated from database:', data.coins);
                
                // Update localStorage to match database
                const user = JSON.parse(localStorage.getItem('user') || '{}');
                user.coins = data.coins;
                localStorage.setItem('user', JSON.stringify(user));
            }
        } else {
            console.error('Failed to fetch coins:', response.status);
        }
    } catch (error) {
        console.error('Error fetching coins from database:', error);
    }
}

// Additional profile-specific functionality can be added here
// For example: editing profile, updating bio, etc.