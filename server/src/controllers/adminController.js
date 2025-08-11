const { supabaseClient } = require('../config/supabase');
const Joi = require('joi');

// Validation schemas
const adminLoginSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required()
});

const userUpdateSchema = Joi.object({
  username: Joi.string().min(3).max(50).optional(),
  email: Joi.string().email().optional(),
  role: Joi.string().valid('user', 'admin').optional(),
  status: Joi.string().valid('active', 'suspended', 'banned').optional()
});

const locationSchema = Joi.object({
  name: Joi.string().min(1).max(255).required(),
  description: Joi.string().max(1000).optional(),
  latitude: Joi.number().min(-90).max(90).required(),
  longitude: Joi.number().min(-180).max(180).required(),
  is_global: Joi.boolean().default(true),
  category: Joi.string().max(50).optional()
});

const adminController = {
  // Admin login
  login: async (req, res, next) => {
    try {
      const { error, value } = adminLoginSchema.validate(req.body);
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }

      const { username, password } = value;

      // Check if credentials match admin credentials
      const adminUsername = process.env.ADMIN_USERNAME || 'admin';
      const adminPassword = process.env.ADMIN_PASSWORD || 'Xabier21';

      if (username === adminUsername && password === adminPassword) {
        // Create or update admin user in database
        const { data: adminUser, error: userError } = await supabaseClient
          .from('users')
          .upsert({
            username: 'admin',
            email: 'admin@urbex-app.com',
            role: 'admin',
            status: 'active'
          }, {
            onConflict: 'username'
          })
          .select()
          .single();

        if (userError) {
          console.error('Admin user creation error:', userError);
        }

        // Generate session token
        const { data: sessionData, error: sessionError } = await supabaseClient.auth.signInWithPassword({
          email: 'admin@urbex-app.com',
          password: adminPassword
        });

        if (sessionError) {
          // Create admin user in auth if doesn't exist
          const { data: authData, error: authError } = await supabaseClient.auth.signUp({
            email: 'admin@urbex-app.com',
            password: adminPassword,
            options: {
              data: { 
                username: 'admin',
                role: 'admin'
              }
            }
          });

          if (authError) {
            return res.status(400).json({ error: authError.message });
          }
        }

        res.json({
          success: true,
          message: 'Admin login successful',
          user: {
            id: adminUser?.id || sessionData?.user?.id,
            username: 'admin',
            email: 'admin@urbex-app.com',
            role: 'admin'
          },
          token: sessionData?.session?.access_token
        });
      } else {
        res.status(401).json({ error: 'Invalid admin credentials' });
      }
    } catch (error) {
      next(error);
    }
  },

  // Get all users
  getUsers: async (req, res, next) => {
    try {
      const { data: users, error } = await supabaseClient
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        return res.status(400).json({ error: error.message });
      }

      res.json({
        success: true,
        users: users || []
      });
    } catch (error) {
      next(error);
    }
  },

  // Create new user
  createUser: async (req, res, next) => {
    try {
      const { username, email, password, role = 'user' } = req.body;

      // Create user in auth
      const { data: authData, error: authError } = await supabaseClient.auth.signUp({
        email,
        password,
        options: {
          data: { username, role }
        }
      });

      if (authError) {
        return res.status(400).json({ error: authError.message });
      }

      // Create user profile
      const { error: profileError } = await supabaseClient
        .from('users')
        .insert([{ 
          id: authData.user.id, 
          username, 
          email, 
          role: role || 'user',
          status: 'active'
        }]);

      if (profileError) {
        console.error('Profile creation error:', profileError);
      }

      res.status(201).json({
        success: true,
        message: 'User created successfully',
        user: authData.user
      });
    } catch (error) {
      next(error);
    }
  },

  // Update user
  updateUser: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { error, value } = userUpdateSchema.validate(req.body);
      
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }

      const { data, error: updateError } = await supabaseClient
        .from('users')
        .update(value)
        .eq('id', id)
        .select()
        .single();

      if (updateError) {
        return res.status(400).json({ error: updateError.message });
      }

      res.json({
        success: true,
        message: 'User updated successfully',
        user: data
      });
    } catch (error) {
      next(error);
    }
  },

  // Delete user
  deleteUser: async (req, res, next) => {
    try {
      const { id } = req.params;

      // Delete from auth (requires admin privileges)
      const { error: authError } = await supabaseClient.auth.admin.deleteUser(id);
      
      if (authError) {
        return res.status(400).json({ error: authError.message });
      }

      // Delete from users table
      const { error: deleteError } = await supabaseClient
        .from('users')
        .delete()
        .eq('id', id);

      if (deleteError) {
        return res.status(400).json({ error: deleteError.message });
      }

      res.json({
        success: true,
        message: 'User deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  },

  // Get all locations
  getLocations: async (req, res, next) => {
    try {
      const { page = 1, limit = 50, search = '' } = req.query;
      const offset = (page - 1) * limit;

      let query = supabaseClient
        .from('locations')
        .select('*')
        .order('created_at', { ascending: false });

      if (search) {
        query = query.ilike('name', `%${search}%`);
      }

      query = query.range(offset, offset + parseInt(limit) - 1);

      const { data: locations, error } = await query;

      if (error) {
        return res.status(400).json({ error: error.message });
      }

      res.json({
        success: true,
        locations: locations || [],
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit)
        }
      });
    } catch (error) {
      next(error);
    }
  },

  // Create location
  createLocation: async (req, res, next) => {
    try {
      const { error, value } = locationSchema.validate(req.body);
      
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }

      const { data, error: insertError } = await supabaseClient
        .from('locations')
        .insert([{ 
          ...value,
          created_by: req.user.id
        }])
        .select()
        .single();

      if (insertError) {
        return res.status(400).json({ error: insertError.message });
      }

      res.status(201).json({
        success: true,
        message: 'Location created successfully',
        location: data
      });
    } catch (error) {
      next(error);
    }
  },

  // Upload image for location
  uploadLocationImage: async (req, res, next) => {
    try {
      const { locationId } = req.params;
      const { image_url, description } = req.body;

      if (!image_url) {
        return res.status(400).json({ error: 'Image URL is required' });
      }

      const { data, error } = await supabaseClient
        .from('location_images')
        .insert([{ 
          location_id: locationId,
          image_url,
          description: description || '',
          uploaded_by: req.user.id
        }])
        .select()
        .single();

      if (error) {
        return res.status(400).json({ error: error.message });
      }

      res.status(201).json({
        success: true,
        message: 'Image uploaded successfully',
        image: data
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = adminController;
