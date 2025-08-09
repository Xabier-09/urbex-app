const { supabaseClient } = require('../config/supabase');
const Joi = require('joi');

// Validation schemas
const locationSchema = Joi.object({
  name: Joi.string().min(1).max(255).required(),
  latitude: Joi.number().min(-90).max(90).required(),
  longitude: Joi.number().min(-180).max(180).required(),
  description: Joi.string().max(1000).optional(),
  category: Joi.string().valid('urbex', 'explored', 'favorite').default('urbex')
});

const updateLocationSchema = Joi.object({
  name: Joi.string().min(1).max(255).optional(),
  latitude: Joi.number().min(-90).max(90).optional(),
  longitude: Joi.number().min(-180).max(180).optional(),
  description: Joi.string().max(1000).optional(),
  category: Joi.string().valid('urbex', 'explored', 'favorite').optional()
});

const locationController = {
  // Get all locations for current user
  getAllLocations: async (req, res, next) => {
    try {
      const { page = 1, limit = 20, category, search } = req.query;
      const offset = (page - 1) * limit;

      let query = supabaseClient
        .from('user_saved_locations')
        .select('*')
        .eq('user_id', req.user.id)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (category) {
        query = query.eq('category', category);
      }

      if (search) {
        query = query.ilike('name', `%${search}%`);
      }

      const { data, error } = await query;

      if (error) {
        return res.status(400).json({ error: error.message });
      }

      // Get total count
      const { count } = await supabaseClient
        .from('user_saved_locations')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', req.user.id);

      res.json({
        locations: data,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: count,
          pages: Math.ceil(count / limit)
        }
      });
    } catch (error) {
      next(error);
    }
  },

  // Get location by ID
  getLocationById: async (req, res, next) => {
    try {
      const { id } = req.params;

      const { data, error } = await supabaseClient
        .from('user_saved_locations')
        .select('*')
        .eq('id', id)
        .eq('user_id', req.user.id)
        .single();

      if (error) {
        return res.status(404).json({ error: 'Location not found' });
      }

      res.json({ location: data });
    } catch (error) {
      next(error);
    }
  },

  // Create new location
  createLocation: async (req, res, next) => {
    try {
      const { error, value } = locationSchema.validate(req.body);
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }

      const { data, error: insertError } = await supabaseClient
        .from('user_saved_locations')
        .insert({
          user_id: req.user.id,
          ...value
        })
        .select()
        .single();

      if (insertError) {
        return res.status(400).json({ error: insertError.message });
      }

      res.status(201).json({
        success: true,
        location: data
      });
    } catch (error) {
      next(error);
    }
  },

  // Update location
  updateLocation: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { error, value } = updateLocationSchema.validate(req.body);
      
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }

      const { data, error: updateError } = await supabaseClient
        .from('user_saved_locations')
        .update(value)
        .eq('id', id)
        .eq('user_id', req.user.id)
        .select()
        .single();

      if (updateError) {
        return res.status(404).json({ error: 'Location not found' });
      }

      res.json({
        success: true,
        location: data
      });
    } catch (error) {
      next(error);
    }
  },

  // Delete location
  deleteLocation: async (req, res, next) => {
    try {
      const { id } = req.params;

      const { error } = await supabaseClient
        .from('user_saved_locations')
        .delete()
        .eq('id', id)
        .eq('user_id', req.user.id);

      if (error) {
        return res.status(404).json({ error: 'Location not found' });
      }

      res.json({ success: true, message: 'Location deleted successfully' });
    } catch (error) {
      next(error);
    }
  },

  // Get nearby locations
  getNearbyLocations: async (req, res, next) => {
    try {
      const { lat, lng, radius = 10 } = req.query;

      if (!lat || !lng) {
        return res.status(400).json({ error: 'Latitude and longitude are required' });
      }

      const { data, error } = await supabaseClient
        .from('user_saved_locations')
        .select('*')
        .eq('user_id', req.user.id);

      if (error) {
        return res.status(400).json({ error: error.message });
      }

      // Calculate distance (simplified)
      const nearbyLocations = data.filter(location => {
        const distance = Math.sqrt(
          Math.pow(location.latitude - parseFloat(lat), 2) +
          Math.pow(location.longitude - parseFloat(lng), 2)
        );
        return distance <= (radius / 111); // Convert km to degrees
      });

      res.json({ locations: nearbyLocations });
    } catch (error) {
      next(error);
    }
  },

  // Search locations
  searchLocations: async (req, res, next) => {
    try {
      const { q, category } = req.query;

      if (!q) {
        return res.status(400).json({ error: 'Search query is required' });
      }

      let query = supabaseClient
        .from('user_saved_locations')
        .select('*')
        .eq('user_id', req.user.id)
        .ilike('name', `%${q}%`);

      if (category) {
        query = query.eq('category', category);
      }

      const { data, error } = await query;

      if (error) {
        return res.status(400).json({ error: error.message });
      }

      res.json({ locations: data });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = locationController;
