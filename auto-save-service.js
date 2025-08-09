/* ==========================================
   AUTO-SAVE SERVICE WITH DEBOUNCING
   ========================================== */

class AutoSaveService {
  constructor() {
    this.saveQueue = new Map();
    this.debounceTimers = new Map();
    this.saveInProgress = new Map();
  }

  // Debounced save function
  async debouncedSave(key, saveFunction, data, delay = 1000) {
    // Clear existing timer for this key
    if (this.debounceTimers.has(key)) {
      clearTimeout(this.debounceTimers.get(key));
    }

    // Set new timer
    this.debounceTimers.set(key, setTimeout(async () => {
      await this.executeSave(key, saveFunction, data);
    }, delay));
  }

  // Execute the actual save
  async executeSave(key, saveFunction, data) {
    // Skip if already saving
    if (this.saveInProgress.has(key)) {
      return;
    }

    this.saveInProgress.set(key, true);

    try {
      const result = await saveFunction(data);
      
      if (result.success) {
        window.notificationSystem.success('Cambios guardados automáticamente');
      } else {
        window.notificationSystem.error('Error al guardar: ' + (result.error || 'Error desconocido'));
      }
      
      return result;
    } catch (error) {
      console.error('Auto-save error:', error);
      window.notificationSystem.error('Error al guardar los cambios');
      return { success: false, error: error.message };
    } finally {
      this.saveInProgress.delete(key);
      this.debounceTimers.delete(key);
    }
  }

  // Save preferences with debouncing
  async savePreferences(preferences) {
    if (!window.userSettingsService?.currentUser) return;

    return this.debouncedSave(
      'preferences',
      (data) => window.userSettingsService.updatePreferences(data),
      preferences,
      800 // Shorter delay for preferences
    );
  }

  // Save location immediately (for explicit saves)
  async saveLocation(locationData) {
    if (!window.userSettingsService?.currentUser) return;

    return this.executeSave(
      'location-' + Date.now(),
      (data) => window.userSettingsService.saveLocation(data),
      locationData
    );
  }

  // Save map state with debouncing
  async saveMapState(mapState) {
    if (!window.userSettingsService?.currentUser) return;

    return this.debouncedSave(
      'map-state',
      (data) => window.userSettingsService.updatePreferences({ map_view: data }),
      mapState,
      1500 // Longer delay for map movements
    );
  }

  // Enhanced save for urbex sites with immediate feedback
  async saveUrbexSite(siteData) {
    if (!window.userSettingsService?.currentUser) return;

    return this.executeSave(
      'urbex-site-' + Date.now(),
      async (data) => {
        const { error } = await window.supabaseClient
          .from('user_saved_locations')
          .insert({
            user_id: window.userSettingsService.currentUser.id,
            name: data.name,
            latitude: data.latitude,
            longitude: data.longitude,
            description: data.description || '',
            category: data.category || 'urbex'
          });
        
        if (error) {
          throw error;
        }
        
        return { success: true };
      },
      siteData
    );
  }

  // Enhanced save for todo status changes
  async saveTodoStatus(siteName, isExplored) {
    if (!window.userSettingsService?.currentUser) return;

    return this.executeSave(
      'todo-status-' + Date.now(),
      async (data) => {
        // Update the description based on explored status
        const description = isExplored ? 'Explorado' : '';
        
        const { error } = await window.supabaseClient
          .from('user_saved_locations')
          .update({ description })
          .eq('user_id', window.userSettingsService.currentUser.id)
          .eq('name', data.siteName);
        
        if (error) {
          throw error;
        }
        
        return { success: true };
      },
      { siteName, isExplored }
    );
  }

  // Force save any pending changes
  async forceSave(key) {
    if (this.debounceTimers.has(key)) {
      clearTimeout(this.debounceTimers.get(key));
      const timer = this.debounceTimers.get(key);
      this.debounceTimers.delete(key);
      // Execute immediately
      await this.executeSave(key, ...this.saveQueue.get(key));
    }
  }

  // Check if there are pending saves
  hasPendingSaves() {
    return this.debounceTimers.size > 0;
  }
}

// Initialize auto-save service
window.autoSaveService = new AutoSaveService();
