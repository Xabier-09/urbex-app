const { supabaseClient } = require('../config/supabase');

const roleAuth = {
    // Check if user has required role
    requireRole: (requiredRole) => {
        return async (req, res, next) => {
            try {
                const userId = req.user.id;
                
                const { data: userRole, error } = await supabaseClient
                    .from('user_roles')
                    .select('role')
                    .eq('user_id', userId)
                    .single();

                if (error || !userRole) {
                    return res.status(403).json({ error: 'Access denied' });
                }

                // Check role hierarchy
                const roleHierarchy = {
                    'admin': 3,
                    'premium': 2,
                    'user': 1
                };

                const userRoleLevel = roleHierarchy[userRole.role] || 0;
                const requiredRoleLevel = roleHierarchy[requiredRole] || 0;

                if (userRoleLevel < requiredRoleLevel) {
                    return res.status(403).json({ 
                        error: 'Insufficient permissions',
                        required: requiredRole,
                        current: userRole.role
                    });
                }

                next();
            } catch (error) {
                console.error('Role check error:', error);
                res.status(500).json({ error: 'Internal server error' });
            }
        };
    },

    // Check if user is admin
    requireAdmin: () => {
        return roleAuth.requireRole('admin');
    },

    // Check if user is premium or admin
    requirePremium: () => {
        return async (req, res, next) => {
            try {
                const userId = req.user.id;
                
                const { data: userRole, error } = await supabaseClient
                    .from('user_roles')
                    .select('role')
                    .eq('user_id', userId)
                    .single();

                if (error || !userRole) {
                    return res.status(403).json({ error: 'Access denied' });
                }

                const allowedRoles = ['admin', 'premium'];
                if (!allowedRoles.includes(userRole.role)) {
                    return res.status(403).json({ 
                        error: 'Premium features required',
                        required: 'premium or admin',
                        current: userRole.role
                    });
                }

                next();
            } catch (error) {
                console.error('Premium check error:', error);
                res.status(500).json({ error: 'Internal server error' });
            }
        };
    }
};

module.exports = roleAuth;
