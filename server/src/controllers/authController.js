const { supabaseClient } = require('../config/supabase');
const Joi = require('joi');

// Validation schemas
const registerSchema = Joi.object({
  username: Joi.string().min(3).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required()
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

const authController = {
  // Register new user
  register: async (req, res, next) => {
    try {
      const { error, value } = registerSchema.validate(req.body);
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }

      const { username, email, password } = value;

      // Sign up user
      const { data, error: signUpError } = await supabaseClient.auth.signUp({
        email,
        password,
        options: {
          data: { username }
        }
      });

      if (signUpError) {
        return res.status(400).json({ error: signUpError.message });
      }

      // Create user profile
      const { error: profileError } = await supabaseClient
        .from('users')
        .insert([{ id: data.user.id, username, email }]);

      if (profileError) {
        console.error('Profile creation error:', profileError);
      }

      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        user: data.user
      });
    } catch (error) {
      next(error);
    }
  },

  // Login user
  login: async (req, res, next) => {
    try {
      const { error, value } = loginSchema.validate(req.body);
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }

      const { email, password } = value;

      const { data, error: signInError } = await supabaseClient.auth.signInWithPassword({
        email,
        password
      });

      if (signInError) {
        return res.status(401).json({ error: signInError.message });
      }

      res.json({
        success: true,
        user: data.user,
        session: data.session
      });
    } catch (error) {
      next(error);
    }
  },

  // Logout user
  logout: async (req, res, next) => {
    try {
      const { error } = await supabaseClient.auth.signOut();
      
      if (error) {
        return res.status(400).json({ error: error.message });
      }

      res.json({ success: true, message: 'Logged out successfully' });
    } catch (error) {
      next(error);
    }
  },

  // Forgot password
  forgotPassword: async (req, res, next) => {
    try {
      const { email } = req.body;
      
      const { error } = await supabaseClient.auth.resetPasswordForEmail(email, {
        redirectTo: `${process.env.FRONTEND_URL}/reset-password`
      });

      if (error) {
        return res.status(400).json({ error: error.message });
      }

      res.json({ success: true, message: 'Password reset email sent' });
    } catch (error) {
      next(error);
    }
  },

  // Reset password
  resetPassword: async (req, res, next) => {
    try {
      const { token, password } = req.body;
      
      const { error } = await supabaseClient.auth.updateUser({
        password
      });

      if (error) {
        return res.status(400).json({ error: error.message });
      }

      res.json({ success: true, message: 'Password updated successfully' });
    } catch (error) {
      next(error);
    }
  },

  // Get current user
  getCurrentUser: async (req, res, next) => {
    try {
      const { data: user } = await supabaseClient.auth.getUser();
      res.json({ user: req.user });
    } catch (error) {
      next(error);
    }
  },

  // Update user profile
  updateProfile: async (req, res, next) => {
    try {
      const { username, ...otherData } = req.body;
      
      const { error } = await supabaseClient
        .from('users')
        .update({ username, ...otherData })
        .eq('id', req.user.id);

      if (error) {
        return res.status(400).json({ error: error.message });
      }

      res.json({ success: true, message: 'Profile updated successfully' });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = authController;
