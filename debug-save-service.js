/* ==========================================
   DEBUG SAVE SERVICE - COMPREHENSIVE TESTING
   ========================================== */

class DebugSaveService {
  constructor() {
    this.debugMode = true;
    this.testResults = [];
  }

  async testSupabaseConnection() {
    try {
      console.log('🔍 Testing Supabase connection...');
      
      // Test 1: Basic connection
      const { data: { user }, error: authError } = await window.supabaseClient.auth.getUser();
      
      if (authError) {
        console.error('❌ Auth Error:', authError);
        return { success: false, error: authError.message };
      }
      
      if (!user) {
        console.error('❌ No user logged in');
        return { success: false, error: 'No user logged in' };
      }

      console.log('✅ User authenticated:', user.email);

      // Test 2: Check if userSettingsService is initialized
      if (!window.userSettingsService || !window.userSettingsService.currentUser) {
        console.error('❌ userSettingsService not initialized');
        return { success: false, error: 'userSettingsService not initialized' };
      }

      console.log('✅ userSettingsService initialized');

      // Test 3: Test table access
      const { data: testData, error: tableError } = await window.supabaseClient
        .from('user_saved_locations')
        .select('id')
        .limit(1);

      if (tableError) {
        console.error('❌ Table access error:', tableError);
        return { success: false, error: tableError.message };
      }

      console.log('✅ Table access successful');
      return { success: true, user: user };
      
    } catch (error) {
      console.error('❌ Connection test failed:', error);
      return { success: false, error: error.message };
    }
  }

  async testSaveLocation(name, lat, lng) {
    try {
      console.log('🔍 Testing save location...', { name, lat, lng });
      
      const result = await window.userSettingsService.saveLocation({
        name: name,
        latitude: lat,
        longitude: lng,
        description: 'Test location',
        category: 'urbex'
      });

      console.log('✅ Save test result:', result);
      return result;
      
    } catch (error) {
      console.error('❌ Save test failed:', error);
      return { success: false, error: error.message };
    }
  }

  async testLoadLocations() {
    try {
      console.log('🔍 Testing load locations...');
      
      const locations = await window.userSettingsService.getSavedLocations();
      
      console.log('✅ Load test result:', locations.length, 'locations found');
      console.table(locations);
      
      return { success: true, count: locations.length, locations };
      
    } catch (error) {
      console.error('❌ Load test failed:', error);
      return { success: false, error: error.message };
    }
  }

  async runFullTest() {
    console.log('🚀 Starting comprehensive save system test...');
    
    const results = {
      connection: await this.testSupabaseConnection(),
      save: null,
      load: null
    };

    if (results.connection.success) {
      results.save = await this.testSaveLocation('Test Location', 40.4168, -3.7038);
      results.load = await this.testLoadLocations();
    }

    console.log('📊 Test Results:', results);
    return results;
  }

  log(message, data = null) {
    if (this.debugMode) {
      const timestamp = new Date().toISOString();
      console.log(`[${timestamp}] ${message}`, data || '');
    }
  }
}

// Initialize debug service
window.debugSaveService = new DebugSaveService();
