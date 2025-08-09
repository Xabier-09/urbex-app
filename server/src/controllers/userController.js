const { supabaseClient } = require('../config/supabase');
const Joi = require('joi');

// Validation schemas
const profileSchema = Joi.object({
  username: Joi.string().min(3).max(50).optional(),
  bio: Joi.string().max(500).optional(),
  avatar_url: Joi.string().uri().optional()
});

const preferencesSchema = Joi.object({
  theme: Joi.string().valid('light', 'dark').optional(),
  language: Joi.string().valid('es', 'en').optional(),
  notifications_enabled: Joi.boolean().optional(),
  email_notifications: Joi.boolean().optional(),
  map_view: Joi.object({
    zoom: Joi.number().min(1).max(20).optional(),
    center: Joi.array().items(Joi.number()).length(2).optional()
  }).optional(),
  ui_settings: Joi.object().optional()
});

const userController = {
  // Get user profile
  getProfile: async (req, res, next) => {
    try {
      const { data, error } = await supabaseClient
        .from('users')
        .select('*')
        .eq('id', req.user.id)
        .single();

      if (error) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json({ profile: data });
    } catch (error) {
      next(error);
    }
  },

  // Update user profile
  updateProfile: async (req, res, next) => {
    try {
      const { error, value } = profileSchema.validate(req.body);
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }

      const { data, error: updateError } = await supabaseClient
        .from('users')
        .update(value)
        .eq('id', req.user.id)
        .select()
        .single();

      if (updateError) {
        return res.status(400).json({ error: updateError.message });
      }

      res.json({
        success: true,
        profile: data
      });
    } catch (error) {
      next(error);
    }
  },

  // Get user preferences
  getPreferences: async (req, res, next) => {
    try {
      const { data, error } = await supabaseClient
        .from('user_preferences')
        .select('*')
        .eq('user_id', req.user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        return res.status(400).json({ error: error.message });
      }

      // Create default preferences if not exists
      if (!data) {
        const { data: newPreferences, error: insertError } = await supabaseClient
          .from('user_preferences')
          .insert({ user_id: req.user.id })
          .select()
          .single();

        if (insertError) {
          return res.status(400).json({ error: insertError.message });
        }

        return res.json({ preferences: newPreferences });
      }

      res.json({ preferences: data });
    } catch (error) {
      next(error);
    }
  },

  // Update user preferences
  updatePreferences: async (req, res, next) => {
    try {
      const { error, value } = preferencesSchema.validate(req.body);
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }

      // Check if preferences exist
      const { data: existing } = await supabaseClient
        .from('user_preferences')
        .select('*')
        .eq('user_id', req.user.id)
        .single();

      let result;
      if (existing) {
        // Update existing
        const { data, error: updateError } = await supabaseClient
          .from('user_preferences')
          .update(value)
          .eq('user_id', req.user.id)
          .select()
          .single();
        
        result = data;
        
        if (updateError) {
          return res.status(400).json({ error: updateError.message });
        }
      } else {
        // Create new
        const { data, error: insertError } = await supabaseClient
          .from('user_preferences')
          .insert({ user_id: req.user.id, ...value })
          .select()
          .single();
        
        result = data;
        
        if (insertError) {
          return res.status(400).json({ error: insertError.message });
        }
      }

      res.json({
        success: true,
        preferences: result
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = userController;
