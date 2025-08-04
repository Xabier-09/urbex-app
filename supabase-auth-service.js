/* ==========================================
   SUPABASE AUTHENTICATION SERVICE - CLOUD VERSION
   ========================================== */

class SupabaseAuthService {
  constructor() {
    this.client = window.supabaseClient;
    this.currentUser = null;
    this.session = null;
  }

  async initialize() {
    // Check for existing session
    const { data: { session } } = await this.client.auth.getSession();
    if (session) {
      this.session = session;
      this.currentUser = session.user;
    }
  }

  async login(email, password) {
    try {
      const { data, error } = await this.client.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return {
          success: false,
          error: this.getErrorMessage(error)
        };
      }

      this.session = data.session;
      this.currentUser = data.user;
      
      // Store session in localStorage
      localStorage.setItem('supabase_session', JSON.stringify(data.session));
      
      return {
        success: true,
        user: data.user,
        session: data.session
      };
    } catch (error) {
      return {
        success: false,
        error: 'Error al conectar con el servidor'
      };
    }
  }

  async register(username, email, password) {
    try {
      // Sign up the user
      const { data, error } = await this.client.auth.signUp({
        email,
        password,
        options: {
          data: {
            username: username,
            created_at: new Date().toISOString()
          }
        }
      });

      if (error) {
        return {
          success: false,
          error: this.getErrorMessage(error)
        };
      }

      if (data.user) {
        // Create user profile in public.users table
        const { error: profileError } = await this.client
          .from('users')
          .insert([
            {
              id: data.user.id,
              username: username,
              email: email,
              created_at: new Date().toISOString()
            }
          ]);

        if (profileError) {
          console.error('Error creating user profile:', profileError);
        }
      }

      return {
        success: true,
        user: data.user,
        message: 'Usuario registrado exitosamente. Por favor verifica tu email.'
      };
    } catch (error) {
      return {
        success: false,
        error: 'Error al registrar el usuario'
      };
    }
  }

  async recoverPassword(email) {
    try {
      const { error } = await this.client.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/login.html',
      });

      if (error) {
        return {
          success: false,
          error: this.getErrorMessage(error)
        };
      }

      return {
        success: true,
        message: 'Se ha enviado un correo de recuperación a tu email'
      };
    } catch (error) {
      return {
        success: false,
        error: 'Error al enviar el correo de recuperación'
      };
    }
  }

  async logout() {
    try {
      const { error } = await this.client.auth.signOut();
      
      if (error) {
        return {
          success: false,
          error: this.getErrorMessage(error)
        };
      }

      // Clear local storage
      localStorage.removeItem('supabase_session');
      localStorage.removeItem('loggedIn');
      localStorage.removeItem('username');
      localStorage.removeItem('userEmail');
      
      this.session = null;
      this.currentUser = null;

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: 'Error al cerrar sesión'
      };
    }
  }

  async isLoggedIn() {
    const { data: { session } } = await this.client.auth.getSession();
    return !!session;
  }

  getCurrentUser() {
    return this.currentUser;
  }

  getSession() {
    return this.session;
  }

  getErrorMessage(error) {
    const errorMessages = {
      'Invalid login credentials': 'Credenciales inválidas',
      'Email not confirmed': 'Por favor verifica tu email antes de iniciar sesión',
      'User already registered': 'El email ya está registrado',
      'Password should be at least 6 characters': 'La contraseña debe tener al menos 6 caracteres',
      'Unable to validate email address: invalid format': 'Formato de email inválido',
      'Network request failed': 'Error de conexión. Por favor verifica tu internet'
    };

    return errorMessages[error.message] || error.message || 'Error desconocido';
  }

  // Real-time auth state changes
  onAuthStateChange(callback) {
    return this.client.auth.onAuthStateChange(callback);
  }

  // Get user profile from public.users table
  async getUserProfile(userId) {
    try {
      const { data, error } = await this.client
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  }

  // Update user profile
  async updateUserProfile(userId, updates) {
    try {
      const { data, error } = await this.client
        .from('users')
        .update(updates)
        .eq('id', userId);

      if (error) {
        return {
          success: false,
          error: this.getErrorMessage(error)
        };
      }

      return {
        success: true,
        data
      };
    } catch (error) {
      return {
        success: false,
        error: 'Error al actualizar el perfil'
      };
    }
  }
}

// Initialize the Supabase auth service globally
window.supabaseAuthService = new SupabaseAuthService();
