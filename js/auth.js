// Common authentication and user display JavaScript
// Include this in all pages that need to show user information

console.log('Auth.js script loaded');

class AuthManager {
    constructor() {
        console.log('AuthManager constructor called');
        this.token = localStorage.getItem('token');
        this.user = null;

        try {
            const userData = localStorage.getItem('user');
            this.user = userData ? JSON.parse(userData) : null;
            console.log('User data loaded:', this.user);

            if (this.user && typeof this.user.coins !== 'number') {
                this.user.coins = 0;
                localStorage.setItem('user', JSON.stringify(this.user));
            }
        } catch (error) {
            console.error('Error parsing user data:', error);
            this.logout();
        }
    }

    isLoggedIn() {
        return !!(this.token && this.user);
    }

    getUser() {
        return this.user;
    }

    getToken() {
        return this.token;
    }

    getStoredCoins() {
        return this.user && typeof this.user.coins === 'number' ? this.user.coins : 0;
    }

    setLocalUserCoins(coins) {
        if (!this.user) return;
        this.user.coins = coins;
        localStorage.setItem('user', JSON.stringify(this.user));
        this.updateCoins();
    }

    async updateCoinsOnBackend(coins) {
        if (!this.isLoggedIn()) return null;

        try {
            const response = await fetch('http://localhost:5000/api/users/coins', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.token}`
                },
                body: JSON.stringify({ coins })
            });

            const data = await response.json();
            if (response.ok && data.user) {
                this.user = data.user;
                localStorage.setItem('user', JSON.stringify(this.user));
                this.updateCoins();
                return this.user;
            }

            console.error('Failed to sync coins to backend:', data);
        } catch (error) {
            console.error('Error syncing coins to backend:', error);
        }

        return null;
    }

    updateCoins() {
        const coins = this.getStoredCoins();
        // Target all coin display elements including profile coins section
        const coinElements = document.querySelectorAll(
            '.action_name1, #coin-count, #coinDisplay, [data-coins], .coin-counter span, .coins #coin-count'
        );
        coinElements.forEach(element => {
            if (element) {
                element.textContent = coins;
            }
        });
    }

    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '../html/signin.html';
    }

    updateUserDisplay() {
        if (!this.isLoggedIn()) {
            // Show login/signup links
            this.showAuthLinks();
            this.updateCoins();
            return;
        }

        console.log('Updating user display for:', this.user.username);

        // Function to update elements
        const updateElements = () => {
            // Update user name in header/navigation - try multiple selectors
            const selectors = [
                '.user-name a',
                '.action_container a[href*="profile"]',
                'a[href*="profile"]',
                '.user-name a[href*="profile"]'
            ];

            selectors.forEach(selector => {
                const elements = document.querySelectorAll(selector);
                elements.forEach(link => {
                    if (link && this.user.username && link.textContent !== this.user.username) {
                        link.textContent = this.user.username;
                        console.log('Updated link text to:', this.user.username, 'using selector:', selector);
                    }
                });
            });

            // Update user info displays
            const userInfoElements = document.querySelectorAll('.user-info, [data-user-field]');
            userInfoElements.forEach(element => {
                const field = element.getAttribute('data-user-field');
                if (field && this.user && this.user[field]) {
                    if (field === 'username') {
                        element.textContent = `User: ${this.user[field]}`;
                    } else {
                        element.textContent = this.user[field];
                    }
                }
            });

            // Update coin displays
            const coinElements = document.querySelectorAll('.action_name1, #coin-count, #coinDisplay, [data-coins], .coin-counter span');
            const coins = this.getStoredCoins();
            coinElements.forEach(element => {
                if (element) {
                    element.textContent = coins;
                }
            });
        };

        // Try to update immediately
        updateElements();

        // Also try after a short delay in case elements aren't ready yet
        setTimeout(updateElements, 500);
        setTimeout(updateElements, 1000);
    }

    showAuthLinks() {
        // Show login/signup links instead of user info
        const authContainers = document.querySelectorAll('.user-name, .action_bar');
        authContainers.forEach(container => {
            const loginLink = container.querySelector('.action_name a[href*="signin"]');
            if (loginLink) {
                loginLink.style.display = 'inline';
            }
            const userLink = container.querySelector('a[href*="profile"]');
            if (userLink) {
                userLink.style.display = 'none';
            }
        });
    }

    async refreshUserData() {
        if (!this.isLoggedIn()) return;

        try {
            const response = await fetch('http://localhost:5000/api/users/profile', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${this.token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                this.user = data.user;
                localStorage.setItem('user', JSON.stringify(this.user));
                this.updateUserDisplay();
                // Ensure coins are updated on the profile page
                this.updateCoins();
            }
        } catch (error) {
            console.error('Error refreshing user data:', error);
        }
    }
}

// Global auth manager instance
const authManager = new AuthManager();
console.log('AuthManager instance created:', authManager.isLoggedIn());

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('Auth.js loaded, initializing...');
    authManager.updateUserDisplay();
});

// Also try to update immediately in case DOMContentLoaded already fired
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        console.log('Auth.js loaded, initializing...');
        authManager.updateUserDisplay();
    });
} else {
    // DOM already loaded
    console.log('Auth.js loaded, DOM already ready, initializing...');
    authManager.updateUserDisplay();
}

// Try to update immediately as well
setTimeout(() => {
    console.log('Running delayed update...');
    authManager.updateUserDisplay();
}, 100);

// Handle logout clicks
document.addEventListener('click', function(e) {
    if (e.target.closest('[data-logout], .account h3:last-child')) {
        e.preventDefault();
        if (confirm('Are you sure you want to logout?')) {
            authManager.logout();
        }
    }
});

// Export for use in other scripts
window.AuthManager = AuthManager;
window.authManager = authManager;