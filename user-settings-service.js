/* ==========================================
   USER SETTINGS SERVICE - PERSISTENCE LAYER
   ========================================== */

class UserSettingsService {
  constructor() {
    this.client = window.supabaseClient;
    this.currentUser = null;
  }

  async initialize(user) {
    this.currentUser = user;
    await this.ensureUserPreferences();
  }

  // Ensure user preferences exist
  async ensureUserPreferences() {
    if (!this.currentUser) return;

    const { data, error } = await this.client
      .from('user_preferences')
      .select('*')
      .eq('user_id', this.currentUser.id)
      .single();

    if (error && error.code === 'PGRST116') {
      // No preferences exist, create default
      await this.createDefaultPreferences();
    }
  }

  // Create default preferences for new user
  async createDefaultPreferences() {
    const defaultPreferences = {
      user_id: this.currentUser.id,
      theme: 'light',
      language: 'es',
      notifications_enabled: true,
      email_notifications: true,
      map_view: { zoom: 6.5, center: [40.4168, -3.7038] },
      ui_settings: {}
    };

    const { error } = await this.client
      .from('user_preferences')
      .insert([defaultPreferences]);

    if (error) {
      console.error('Error creating default preferences:', error);
    }
  }

  // Get user preferences
  async getPreferences() {
    if (!this.currentUser) return null;

    const { data, error } = await this.client
      .from('user_preferences')
      .select('*')
      .eq('user_id', this.currentUser.id)
      .single();

    if (error) {
      console.error('Error fetching preferences:', error);
      return null;
    }

    return data;
  }

  // Update user preferences
  async updatePreferences(updates) {
    if (!this.currentUser) return { success: false, error: 'No user logged in' };

    const { data, error } = await this.client
      .from('user_preferences')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', this.currentUser.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating preferences:', error);
      return { success: false, error: error.message };
    }

    // Log the activity
    await this.logActivity('preferences_updated', updates);

    return { success: true, data };
  }

  // Save user location
  async saveLocation(locationData) {
    if (!this.currentUser) return { success: false, error: 'No user logged in' };

    const { data, error } = await this.client
      .from('user_saved_locations')
      .insert([{
        user_id: this.currentUser.id,
        ...locationData,
        created_at: new Date().toISOString()
      }]);

    if (error) {
      console.error('Error saving location:', error);
      return { success: false, error: error.message };
    }

    await this.logActivity('location_saved', locationData);
    return { success: true, data };
  }

  // Get user saved locations
  async getSavedLocations() {
    if (!this.currentUser) return [];

    const { data, error } = await this.client
      .from('user_saved_locations')
      .select('*')
      .eq('user_id', this.currentUser.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching saved locations:', error);
      return [];
    }

    return data;
  }

  // Delete saved location
  async deleteSavedLocation(locationId) {
    if (!this.currentUser) return { success: false, error: 'No user logged in' };

    const { error } = await this.client
      .from('user_saved_locations')
      .delete()
      .eq('id', locationId)
      .eq('user_id', this.currentUser.id);

    if (error) {
      console.error('Error deleting location:', error);
      return { success: false, error: error.message };
    }

    await this.logActivity('location_deleted', { locationId });
    return { success: true };
  }

  // Log user activity
  async logActivity(actionType, actionData) {
    if (!this.currentUser) return;

    await this.client
      .from('user_activity')
      .insert([{
        user_id: this.currentUser.id,
        action_type: actionType,
        action_data: actionData,
        created_at: new Date().toISOString()
      }]);
  }

  // Get user activity history
  async getActivityHistory(limit = 50) {
    if (!this.currentUser) return [];

    const { data, error } = await this.client
      .from('user_activity')
      .select('*')
      .eq('user_id', this.currentUser.id)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching activity history:', error);
      return [];
    }

    return data;
  }
}

// Initialize the user settings service globally
window.userSettingsService = new UserSettingsService();
