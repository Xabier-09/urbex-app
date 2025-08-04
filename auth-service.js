/* ==========================================
   SIMPLE AUTHENTICATION SERVICE - GITHUB PAGES VERSION
   ========================================== */

class AuthService {
  constructor() {
    // Initialize empty credentials array - users must register first
    this.validCredentials = [];
    
    // Initialize from localStorage if available
    this.initializeFromStorage();
  }

  initializeFromStorage() {
    const savedUsers = localStorage.getItem('registeredUsers');
    if (savedUsers) {
      try {
        const users = JSON.parse(savedUsers);
        this.validCredentials = [...this.validCredentials, ...users];
      } catch (e) {
        console.error('Error loading registered users:', e);
      }
    }
  }

  async login(email, password) {
    // Simulate async operation
    return new Promise((resolve) => {
      setTimeout(() => {
        const user = this.validCredentials.find(
          cred => cred.email === email && cred.password === password
        );
        
        if (user) {
          const session = {
            user: {
              id: Math.random().toString(36).substr(2, 9),
              email: user.email,
              username: user.username
            },
            access_token: 'mock_token_' + Math.random().toString(36).substr(2, 9),
            refresh_token: 'mock_refresh_' + Math.random().toString(36).substr(2, 9)
          };
          
          resolve({
            success: true,
            user: user,
            session: session
          });
        } else {
          resolve({
            success: false,
            error: 'Credenciales inválidas. Usa: admin@urbex.com / admin123 o user@urbex.com / user123'
          });
        }
      }, 500);
    });
  }

  async register(username, email, password) {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Check if email already exists
        const existingUser = this.validCredentials.find(cred => cred.email === email);
        if (existingUser) {
          resolve({
            success: false,
            error: 'El correo electrónico ya está registrado'
          });
          return;
        }

        // Check if username already exists
        const existingUsername = this.validCredentials.find(cred => cred.username === username);
        if (existingUsername) {
          resolve({
            success: false,
            error: 'El nombre de usuario ya está en uso'
          });
          return;
        }

        // Add new user
        const newUser = { email, password, username };
        this.validCredentials.push(newUser);
        
        // Save to localStorage
        const existingUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
        existingUsers.push(newUser);
        localStorage.setItem('registeredUsers', JSON.stringify(existingUsers));

        resolve({
          success: true,
          user: newUser
        });
      }, 500);
    });
  }

  async recoverPassword(email) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const user = this.validCredentials.find(cred => cred.email === email);
        if (user) {
          resolve({
            success: true,
            message: 'Se ha enviado un correo de recuperación (simulado)'
          });
        } else {
          resolve({
            success: false,
            error: 'No existe una cuenta con ese correo electrónico'
          });
        }
      }, 500);
    });
  }

  async isLoggedIn() {
    return localStorage.getItem('loggedIn') === 'true';
  }

  async logout() {
    localStorage.removeItem('loggedIn');
    localStorage.removeItem('username');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('session');
    return { success: true };
  }

  getCurrentUser() {
    const username = localStorage.getItem('username');
    const email = localStorage.getItem('userEmail');
    return username ? { username, email } : null;
  }
}

// Initialize the auth service globally
window.authService = new AuthService();
