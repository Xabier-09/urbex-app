/* ==========================================
   SAVE INTEGRATION SERVICE - ENSURES PROPER FUNCTIONALITY
   ========================================== */

class SaveIntegrationService {
  constructor() {
    this.isInitialized = false;
    this.user = null;
  }

  async initialize() {
    try {
      console.log('🔄 Initializing Save Integration Service...');
      
      // Wait for Supabase to be ready
      if (!window.supabaseClient) {
        console.error('❌ Supabase client not found');
        return false;
      }

      // Wait for user authentication
      const { data: { user } } = await window.supabaseClient.auth.getUser();
      
      if (!user) {
        console.error('❌ No user logged in');
        return false;
      }

      this.user = user;
      
      // Initialize all services in sequence
      console.log('🔄 Initializing save system...');
      const saveSystemReady = await window.saveSystem.initialize();
      
      console.log('🔄 Initializing auto-save service...');
      const autoSaveReady = window.autoSaveService ? true : false;
      
      console.log('🔄 Initializing debug service...');
      const debugReady = window.debugSaveService ? true : false;
      
      console.log('🔄 Initializing notification system...');
      const notificationReady = window.notificationSystem ? true : false;

      if (saveSystemReady && autoSaveReady && debugReady && notificationReady) {
        this.isInitialized = true;
        console.log('✅ All save services initialized successfully');
        
        // Run verification test
        await this.verifySystem();
        
        return true;
      } else {
        console.error('❌ Some services failed to initialize');
        return false;
      }
      
    } catch (error) {
      console.error('❌ Save integration initialization failed:', error);
      return false;
    }
  }

  async verifySystem() {
    try {
      console.log('🔍 Verifying save system functionality...');
      
      // Test connection
      const connectionTest = await window.debugSaveService.testSupabaseConnection();
      
      if (!connectionTest.success) {
        console.error('❌ Connection test failed:', connectionTest.error);
        return false;
      }

      // Test save functionality
      const saveTest = await window.debugSaveService.testSaveLocation('Verification Test', 40.4168, -3.7038);
      
      if (!saveTest.success) {
        console.error('❌ Save test failed:', saveTest.error);
        return false;
      }

      // Test load functionality
      const loadTest = await window.debugSaveService.testLoadLocations();
      
      if (!loadTest.success) {
        console.error('❌ Load test failed:', loadTest.error);
        return false;
      }

      console.log('✅ Save system verification completed successfully');
      return true;
      
    } catch (error) {
      console.error('❌ Verification failed:', error);
      return false;
    }
  }

  async saveWithConfirmation(data) {
    if (!this.isInitialized) {
      console.error('❌ Save system not initialized');
      return { success: false, error: 'System not initialized' };
    }

    try {
      const result = await window.saveSystem.saveLocation(
        data.name,
        data.latitude,
        data.longitude,
        data.description,
        data.category
      );

      if (result.success) {
        window.notificationSystem.success('✅ Ubicación guardada exitosamente');
      } else {
        window.notificationSystem.error('❌ Error al guardar: ' + result.error);
      }

      return result;
      
    } catch (error) {
      console.error('❌ Save error:', error);
      window.notificationSystem.error('❌ Error al guardar los cambios');
      return { success: false, error: error.message };
    }
  }

  async autoSaveWithConfirmation(data) {
    if (!this.isInitialized) {
      console.error('❌ Save system not initialized');
      return { success: false, error: 'System not initialized' };
    }

    return await window.autoSaveService.saveLocation(
      data.name,
      data.latitude,
      data.longitude,
      data.description,
      data.category
    );
  }

  async getAllSavedLocations() {
    if (!this.isInitialized) {
      console.error('❌ Save system not initialized');
      return { success: false, error: 'System not initialized', locations: [] };
    }

    return await window.saveSystem.loadLocations();
  }

  async deleteSavedLocation(name) {
    if (!this.isInitialized) {
      console.error('❌ Save system not initialized');
      return { success: false, error: 'System not initialized' };
    }

    return await window.saveSystem.deleteLocation(name);
  }
}

// Initialize global save integration service
window.saveIntegrationService = new SaveIntegrationService();
