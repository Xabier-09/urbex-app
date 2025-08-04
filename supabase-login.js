/* ==========================================
   SUPABASE USER MANAGEMENT SYSTEM - CLOUD VERSION
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Get DOM elements
  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');
  const recoveryForm = document.getElementById('recovery-form');
  const errorMessage = document.getElementById('error-message');
  const registerErrorMessage = document.getElementById('register-error-message');
  const recoveryErrorMessage = document.getElementById('recovery-error-message');
  const recoveryMessage = document.getElementById('recovery-message');

  // Section elements
  const loginSection = document.getElementById('login-section');
  const registerSection = document.getElementById('register-section');
  const recoverySection = document.getElementById('recovery-section');

  // Navigation links
  const forgotPasswordLink = document.getElementById('forgot-password-link');
  const showRegisterLink = document.getElementById('show-register');
  const showLoginLink = document.getElementById('show-login');
  const backToLoginLink = document.getElementById('back-to-login');

  // Initialize Supabase auth service
  window.supabaseAuthService.initialize().then(() => {
    // Check if user is already logged in
    window.supabaseAuthService.isLoggedIn().then(loggedIn => {
      if (loggedIn) {
        window.location.href = 'index.html';
      }
    });
  });

  // Navigation event handlers
  forgotPasswordLink.addEventListener('click', (e) => {
    e.preventDefault();
    loginSection.style.display = 'none';
    recoverySection.style.display = 'block';
    clearMessages();
  });

  showRegisterLink.addEventListener('click', (e) => {
    e.preventDefault();
    loginSection.style.display = 'none';
    registerSection.style.display = 'block';
    clearMessages();
  });

  showLoginLink.addEventListener('click', (e) => {
    e.preventDefault();
    registerSection.style.display = 'none';
    loginSection.style.display = 'block';
    clearMessages();
  });

  backToLoginLink.addEventListener('click', (e) => {
    e.preventDefault();
    recoverySection.style.display = 'none';
    loginSection.style.display = 'block';
    clearMessages();
  });

  // Handle login form submission
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const result = await window.supabaseAuthService.login(email, password);
    if (result.success) {
      localStorage.setItem('loggedIn', 'true');
      localStorage.setItem('username', result.user.user_metadata?.username || email);
      localStorage.setItem('userEmail', result.user.email);
      localStorage.setItem('userId', result.user.id);
      if (result.session) {
        localStorage.setItem('supabase_session', JSON.stringify(result.session));
      }
      window.location.href = 'index.html';
    } else {
      errorMessage.textContent = result.error || 'Error en el inicio de sesión';
      errorMessage.style.display = 'block';
      loginForm.classList.add('shake');
      setTimeout(() => {
        loginForm.classList.remove('shake');
      }, 500);
    }
  });

  // Handle register form submission
  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('register-username').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('register-confirm-password').value;

    if (password !== confirmPassword) {
      registerErrorMessage.textContent = 'Las contraseñas no coinciden';
      registerErrorMessage.style.display = 'block';
      return;
    }

    if (password.length < 6) {
      registerErrorMessage.textContent = 'La contraseña debe tener al menos 6 caracteres';
      registerErrorMessage.style.display = 'block';
      return;
    }

    const result = await window.supabaseAuthService.register(username, email, password);
    if (result.success) {
      alert('Usuario registrado exitosamente. Por favor verifica tu email antes de iniciar sesión.');
      registerSection.style.display = 'none';
      loginSection.style.display = 'block';
      clearMessages();
      registerForm.reset();
    } else {
      registerErrorMessage.textContent = result.error || 'Error en el registro';
      registerErrorMessage.style.display = 'block';
    }
  });

  // Handle password recovery form submission
  recoveryForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('recovery-email').value;

    const result = await window.supabaseAuthService.recoverPassword(email);
    if (result.success) {
      recoveryMessage.textContent = 'Instrucciones enviadas a tu correo';
      recoveryMessage.style.display = 'block';
      recoveryErrorMessage.style.display = 'none';
      recoveryForm.reset();
    } else {
      recoveryErrorMessage.textContent = result.error || 'Error en la recuperación';
      recoveryErrorMessage.style.display = 'block';
      recoveryMessage.style.display = 'none';
    }
  });

  // Clear all messages
  function clearMessages() {
    errorMessage.style.display = 'none';
    registerErrorMessage.style.display = 'none';
    recoveryErrorMessage.style.display = 'none';
    recoveryMessage.style.display = 'none';
    errorMessage.textContent = '';
    registerErrorMessage.textContent = '';
    recoveryErrorMessage.textContent = '';
    recoveryMessage.textContent = '';
  }

  // Add shake animation for errors
  const style = document.createElement('style');
  style.textContent = `
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      20%, 60% { transform: translateX(-10px); }
      40%, 80% { transform: translateX(10px); }
    }

    .shake {
      animation: shake 0.5s ease-in-out;
    }
  `;
  document.head.appendChild(style);

  // Listen for auth state changes
  window.supabaseAuthService.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_IN') {
      localStorage.setItem('loggedIn', 'true');
      localStorage.setItem('supabase_session', JSON.stringify(session));
    } else if (event === 'SIGNED_OUT') {
      localStorage.removeItem('loggedIn');
      localStorage.removeItem('supabase_session');
    }
  });
});
