/* ==========================================
   ENHANCED MAIN APPLICATION WITH USER PERSISTENCE
   ========================================== */

class UrbexApp {
  constructor() {
    this.map = null;
    this.currentMarker = null;
    this.userPreferences = null;
    this.savedLocations = [];
    this.isLoggedIn = false;
    
    this.init();
  }

  async init() {
    await this.initializeMap();
    await this.initializeUserSession();
    this.setupEventListeners();
    this.setupUI();
  }

  initializeMap() {
    this.map = L.map('map', {
      zoomControl: false,
      minZoom: 6.5,
      maxZoom: 19,
      attributionControl: false
    }).setView([40.4168, -3.7038], 6.5);

    const bounds = L.latLngBounds([35, -10], [44.5, 5]);
    this.map.setMaxBounds(bounds);
    this.map.on('drag', () => this.map.panInsideBounds(bounds, { animate: false }));

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

  // Save map state changes with debouncing
  this.map.on('moveend', () => {
    if (this.isLoggedIn) {
      window.autoSaveService.saveMapState({
        center: [this.map.getCenter().lat, this.map.getCenter().lng],
        zoom: this.map.getZoom()
      });
    }
  });
  }

  async initializeUserSession() {
    // Check if user is logged in
    const isAuthenticated = await window.supabaseAuthService.isLoggedIn();
    
    if (isAuthenticated) {
      this.isLoggedIn = true;
      const user = window.supabaseAuthService.getCurrentUser();
      
      // Initialize user settings service
      await window.userSettingsService.initialize(user);
      
      // Load user preferences
      await this.loadUserPreferences();
      
      // Load saved locations
      await this.loadSavedLocations();
      
      this.updateUIForLoggedInUser();
    }
  }

  async loadUserPreferences() {
    const preferences = await window.userSettingsService.getPreferences();
    if (preferences) {
      this.userPreferences = preferences;
      
      // Apply saved preferences
      if (preferences.map_view) {
        const { center, zoom } = preferences.map_view;
        this.map.setView(center, zoom);
      }
      
      // Apply theme
      if (preferences.theme) {
        this.applyTheme(preferences.theme);
      }
      
      // Apply language
      if (preferences.language) {
        this.setLanguage(preferences.language);
      }
    }
  }

  async loadSavedLocations() {
    this.savedLocations = await window.userSettingsService.getSavedLocations();
    this.renderSavedLocations();
  }

  async saveMapState() {
    if (!this.isLoggedIn) return;
    
    const center = this.map.getCenter();
    const zoom = this.map.getZoom();
    
    await window.userSettingsService.updatePreferences({
      map_view: {
        center: [center.lat, center.lng],
        zoom: zoom
      }
    });
  }

  async saveLocation(name, lat, lng, description = '', category = '') {
    if (!this.isLoggedIn) {
      alert('Por favor inicia sesión para guardar ubicaciones');
      return;
    }

    const locationData = {
      name,
      latitude: lat,
      longitude: lng,
      description,
      category
    };

    const result = await window.userSettingsService.saveLocation(locationData);
    
    if (result.success) {
      await this.loadSavedLocations();
      alert('Ubicación guardada exitosamente');
    } else {
      alert('Error al guardar ubicación: ' + result.error);
    }
  }

  async deleteLocation(locationId) {
    const result = await window.userSettingsService.deleteSavedLocation(locationId);
    
    if (result.success) {
      await this.loadSavedLocations();
      alert('Ubicación eliminada exitosamente');
    } else {
      alert('Error al eliminar ubicación: ' + result.error);
    }
  }

  renderSavedLocations() {
    const container = document.getElementById('saved-locations-container');
    if (!container) return;

    container.innerHTML = '';
    
    this.savedLocations.forEach(location => {
      const locationElement = document.createElement('div');
      locationElement.className = 'saved-location-item';
      locationElement.innerHTML = `
        <h4>${location.name}</h4>
        <p>${location.description || 'Sin descripción'}</p>
        <button onclick="urbexApp.viewLocation(${location.latitude}, ${location.longitude})">
          Ver en mapa
        </button>
        <button onclick="urbexApp.deleteLocation('${location.id}')">
          Eliminar
        </button>
      `;
      container.appendChild(locationElement);
    });
  }

  viewLocation(lat, lng) {
    this.map.setView([lat, lng], 14);
    if (this.currentMarker) {
      this.map.removeLayer(this.currentMarker);
    }
    this.currentMarker = L.marker([lat, lng]).addTo(this.map);
  }

  applyTheme(theme) {
    document.body.className = document.body.className.replace(/theme-\w+/g, '');
    document.body.classList.add(`theme-${theme}`);
  }

  setLanguage(language) {
    // Implementation for language switching
    console.log('Language set to:', language);
  }

  updateUIForLoggedInUser() {
    // Show user-specific UI elements
    const userPanel = document.getElementById('user-panel');
    if (userPanel) {
      userPanel.style.display = 'block';
    }
    
    // Update login/logout buttons
    const loginBtn = document.getElementById('login-btn');
    const logoutBtn = document.getElementById('logout-btn-new');
    
    if (loginBtn) loginBtn.style.display = 'none';
    if (logoutBtn) logoutBtn.style.display = 'block';
  }

  setupEventListeners() {
    // Search functionality
    const searchBtn = document.getElementById('search-btn');
    if (searchBtn) {
      searchBtn.addEventListener('click', async () => {
        await this.searchLocation();
      });
    }

    // Clear marker
    const clearMarkerBtn = document.getElementById('clear-marker-btn');
    if (clearMarkerBtn) {
      clearMarkerBtn.addEventListener('click', () => {
        this.clearMarker();
      });
    }

    // Save current location
    const saveCurrentLocationBtn = document.getElementById('save-current-location');
    if (saveCurrentLocationBtn) {
      saveCurrentLocationBtn.addEventListener('click', () => {
        this.promptSaveCurrentLocation();
      });
    }

    // Theme toggle
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
      themeToggle.addEventListener('change', (e) => {
        this.updateTheme(e.target.value);
      });
    }

    // Language selector
    const languageSelector = document.getElementById('language-selector');
    if (languageSelector) {
      languageSelector.addEventListener('change', (e) => {
        this.updateLanguage(e.target.value);
      });
    }
  }

  setupUI() {
    // Make panels draggable
    this.makeDraggable('changelog');
    this.makeDraggable('urbex-panel');
    this.makeDraggable('todo-panel');
  }

  async searchLocation() {
    const searchInput = document.getElementById('search-input');
    const q = searchInput?.value.trim();
    
    if (!q) return;
    
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}&countrycodes=es`);
      const data = await res.json();
      
      if (!data[0]) {
        alert('No encontrado');
        return;
      }
      
      const { lat, lon } = data[0];
      this.viewLocation(parseFloat(lat), parseFloat(lon));
    } catch (error) {
      console.error('Error searching location:', error);
      alert('Error al buscar ubicación');
    }
  }

  clearMarker() {
    if (this.currentMarker) {
      this.map.removeLayer(this.currentMarker);
      this.currentMarker = null;
    }
  }

  promptSaveCurrentLocation() {
    if (!this.currentMarker) {
      alert('No hay ninguna ubicación seleccionada');
      return;
    }

    const name = prompt('Nombre para esta ubicación:');
    if (!name) return;

    const description = prompt('Descripción (opcional):') || '';
    const category = prompt('Categoría (opcional):') || '';

    const latlng = this.currentMarker.getLatLng();
    this.saveLocation(name, latlng.lat, latlng.lng, description, category);
  }

  async updateTheme(theme) {
    if (!this.isLoggedIn) return;
    
    await window.userSettingsService.updatePreferences({ theme });
    this.applyTheme(theme);
  }

  async updateLanguage(language) {
    if (!this.isLoggedIn) return;
    
    await window.userSettingsService.updatePreferences({ language });
    this.setLanguage(language);
  }

  makeDraggable(id) {
    const panel = document.getElementById(id);
    const header = panel?.querySelector('.panel-header');

    if (!header) return;

    let isDragging = false;
    let offsetX = 0;
    let offsetY = 0;

    header.addEventListener('mousedown', (e) => {
      e.preventDefault();
      if (e.button !== 0) return;

      if (!panel.classList.contains('moved')) {
        const rect = panel.getBoundingClientRect();
        panel.style.left = `${rect.left}px`;
        panel.style.top = `${rect.top}px`;
        panel.style.transform = 'none';
        panel.classList.add('moved');
      }

      isDragging = true;
      offsetX = e.clientX - panel.getBoundingClientRect().left;
      offsetY = e.clientY - panel.getBoundingClientRect().top;
      header.style.cursor = 'grabbing';
    });

    document.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      panel.style.left = `${e.clientX - offsetX}px`;
      panel.style.top = `${e.clientY - offsetY}px`;
    });

    document.addEventListener('mouseup', () => {
      isDragging = false;
      header.style.cursor = 'grab';
    });
  }

  async logout() {
    const result = await window.supabaseAuthService.logout();
    if (result.success) {
      this.isLoggedIn = false;
      this.userPreferences = null;
      this.savedLocations = [];
      
      // Reset UI
      location.reload();
    }
  }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
  window.urbexApp = new UrbexApp();
});
