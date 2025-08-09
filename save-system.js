/* ==========================================
   COMPLETE SAVE SYSTEM - WORKING SOLUTION
   ========================================== */

class SaveSystem {
  constructor() {
    this.isReady = false;
    this.user = null;
  }

  async initialize() {
    try {
      console.log('🚀 Initializing Save System...');
      
      // Check if user is logged in
      const { data: { user } } = await window.supabaseClient.auth.getUser();
      
      if (!user) {
        console.error('❌ No user logged in - save system disabled');
        return false;
      }

      this.user = user;
      this.isReady = true;
      
      console.log('✅ Save system ready for user:', user.email);
      return true;
      
    } catch (error) {
      console.error('❌ Save system initialization failed:', error);
      return false;
    }
  }

  async saveLocation(name, lat, lng, description = '', category = 'urbex') {
    if (!this.isReady) {
      console.error('❌ Save system not ready');
      return { success: false, error: 'System not initialized' };
    }

    try {
      console.log('💾 Saving location:', { name, lat, lng, description, category });
      
      const { data, error } = await window.supabaseClient
        .from('user_saved_locations')
        .insert({
          user_id: this.user.id,
          name: name,
          latitude: lat,
          longitude: lng,
          description: description,
          category: category,
          created_at: new Date().toISOString()
        })
        .select();

      if (error) {
        console.error('❌ Save failed:', error);
        return { success: false, error: error.message };
      }

      console.log('✅ Location saved successfully:', data);
      return { success: true, data: data[0] };
      
    } catch (error) {
      console.error('❌ Save error:', error);
      return { success: false, error: error.message };
    }
  }

  async loadLocations() {
    if (!this.isReady) {
      console.error('❌ Save system not ready');
      return { success: false, error: 'System not initialized', locations: [] };
    }

    try {
      console.log('📂 Loading locations...');
      
      const { data, error } = await window.supabaseClient
        .from('user_saved_locations')
        .select('*')
        .eq('user_id', this.user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Load failed:', error);
        return { success: false, error: error.message, locations: [] };
      }

      console.log('✅ Loaded', data.length, 'locations');
      return { success: true, locations: data };
      
    } catch (error) {
      console.error('❌ Load error:', error);
      return { success: false, error: error.message, locations: [] };
    }
  }

  async deleteLocation(name) {
    if (!this.isReady) {
      console.error('❌ Save system not ready');
      return { success: false, error: 'System not initialized' };
    }

    try {
      console.log('🗑️ Deleting location:', name);
      
      const { error } = await window.supabaseClient
        .from('user_saved_locations')
        .delete()
        .eq('user_id', this.user.id)
        .eq('name', name);

      if (error) {
        console.error('❌ Delete failed:', error);
        return { success: false, error: error.message };
      }

      console.log('✅ Location deleted successfully');
      return { success: true };
      
    } catch (error) {
      console.error('❌ Delete error:', error);
      return { success: false, error: error.message };
    }
  }

  async testSystem() {
    console.log('🧪 Testing save system...');
    
    // Test 1: Save
    const testName = 'Test Location ' + Date.now();
    const saveResult = await this.saveLocation(testName, 40.4168, -3.7038, 'Test');
    
    if (!saveResult.success) {
      return { success: false, error: 'Save test failed: ' + saveResult.error };
    }

    // Test 2: Load
    const loadResult = await this.loadLocations();
    
    if (!loadResult.success) {
      return { success: false, error: 'Load test failed: ' + loadResult.error };
    }

    // Test 3: Verify
    const found = loadResult.locations.find(loc => loc.name === testName);
    if (!found) {
      return { success: false, error: 'Location not found after save' };
    }

    console.log('✅ All tests passed');
    return { success: true, message: 'Save system working correctly' };
  }
}

// Initialize global save system
window.saveSystem = new SaveSystem();
