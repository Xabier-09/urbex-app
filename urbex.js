document.addEventListener('DOMContentLoaded', async () => {
  const map = window.urbexMap;
  const listEl = document.getElementById('urbex-list');
  let currentUser = null;

  // Get current user
  async function getCurrentUser() {
    try {
      const { data: { user } } = await window.supabaseClient.auth.getUser();
      currentUser = user;
      if (user) {
        await window.userSettingsService.initialize(user);
      }
      return user;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }

  // Save user action to database
  async function saveUserAction(actionType, actionData) {
    if (!currentUser) {
      console.warn('No user logged in, cannot save action');
      return;
    }

    try {
      const { error } = await window.supabaseClient
        .from('user_activity')
        .insert({
          user_id: currentUser.id,
          action_type: actionType,
          action_data: actionData
        });

      if (error) {
        console.error('Error saving user action:', error);
      }
    } catch (error) {
      console.error('Error saving user action:', error);
    }
  }

  // Save user location to database
  async function saveUserLocation(name, lat, lng, description = '', category = 'urbex') {
    if (!currentUser) {
      console.warn('No user logged in, cannot save location');
      return false;
    }

    try {
      const result = await window.userSettingsService.saveLocation({
        name: name,
        latitude: lat,
        longitude: lng,
        description: description,
        category: category
      });

      if (result.success) {
        console.log('Location saved successfully:', name);
        await saveUserAction('location_saved', { name, lat, lng, category });
        return true;
      } else {
        console.error('Error saving user location:', result.error);
        return false;
      }
    } catch (error) {
      console.error('Error saving user location:', error);
      return false;
    }
  }

  // Load user locations from database
  async function loadUserLocations() {
    if (!currentUser) return;

    try {
      const locations = await window.userSettingsService.getSavedLocations();

      // Clear existing markers
      markers.forEach(marker => map.removeLayer(marker));
      markers.clear();
      listEl.innerHTML = '';
      todoSites.explored = [];
      todoSites.unexplored = [];

      // Add loaded locations
      locations.forEach(location => {
        addUrbexSite(location.latitude, location.longitude, location.name, false);
        // Mark as explored if it has a description
        if (location.description && location.description.trim() !== '') {
          todoSites.unexplored = todoSites.unexplored.filter(s => s !== location.name);
          todoSites.explored.push(location.name);
          const marker = markers.get(location.name);
          if (marker) marker.setIcon(greenIcon);
        }
      });

      renderTodoLists();
      console.log('Loaded', locations.length, 'locations from database');
    } catch (error) {
      console.error('Error loading user locations:', error);
    }
  }

  // Panel toggles
  const togglePanel = () => {
    const panel = document.getElementById('urbex-panel');

    if (panel.classList.contains('visible')) {
      panel.classList.remove('visible');
    } else {
      panel.style.left = '20px';
      panel.style.top = '185px';
      panel.classList.add('visible');
    }
  };
  document.getElementById('open-urbex-btn')?.addEventListener('click', togglePanel);
  document.getElementById('close-urbex-btn')?.addEventListener('click', togglePanel);

  const toggleTodoPanel = () => {
    const panel = document.getElementById('todo-panel');

    if (panel.classList.contains('visible')) {
      panel.classList.remove('visible');
    } else {
      panel.style.left = '20px';
      panel.style.top = '300px';
      panel.classList.add('visible');
    }
  };
  document.getElementById('open-todo-btn')?.addEventListener('click', toggleTodoPanel);
  document.getElementById('close-todo-btn')?.addEventListener('click', toggleTodoPanel);

  // Marker icons
  const blueIcon = new L.Icon({
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  });
  const greenIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  });

  // Data
  const todoSites = { explored: [], unexplored: [] };
  const markers = new Map();
  const exploredListEl = document.getElementById('explored-list');
  const unexploredListEl = document.getElementById('unexplored-list');

  // Save todo list
  async function saveTodoList() {
    if (!currentUser) {
      console.warn('No user logged in, cannot save todo list');
      return;
    }

    try {
      // Primero, obtener todas las ubicaciones actuales del usuario
      const { data: existingLocations } = await window.supabaseClient
        .from('user_saved_locations')
        .select('*')
        .eq('user_id', currentUser.id);

      // Actualizar el estado de exploración basado en las listas actuales
      const allLocations = [...todoSites.explored, ...todoSites.unexplored];
      
      for (const name of allLocations) {
        const marker = markers.get(name);
        const isExplored = todoSites.explored.includes(name);
        
        if (marker) {
          const lat = marker.getLatLng().lat;
          const lng = marker.getLatLng().lng;
          
          // Buscar si ya existe esta ubicación
          const existing = existingLocations?.find(loc => loc.name === name);
          
          if (existing) {
            // Actualizar el estado de exploración
            await window.supabaseClient
              .from('user_saved_locations')
              .update({ 
                explored: isExplored,
                updated_at: new Date().toISOString()
              })
              .eq('id', existing.id)
              .eq('user_id', currentUser.id);
          } else {
            // Crear nueva ubicación
            await window.supabaseClient
              .from('user_saved_locations')
              .insert({
                user_id: currentUser.id,
                name: name,
                latitude: lat,
                longitude: lng,
                explored: isExplored,
                category: 'urbex'
              });
          }
        }
      }

      window.notificationSystem.success('Lista TooDo guardada correctamente');
    } catch (error) {
      console.error('Error saving todo list:', error);
      window.notificationSystem.error('Error al guardar la lista TooDo: ' + error.message);
    }
  }

  // Render todo lists (single implementation)
  function renderTodoLists() {
    if (exploredListEl) exploredListEl.innerHTML = '';
    if (unexploredListEl) unexploredListEl.innerHTML = '';

    todoSites.explored.forEach(site => {
      const li = document.createElement('li');
      li.textContent = site;
      const btn = document.createElement('button');
      btn.textContent = 'Marcar no explorado';
      btn.onclick = () => {
        todoSites.explored = todoSites.explored.filter(s => s !== site);
        todoSites.unexplored.push(site);
        const marker = markers.get(site);
        if (marker) marker.setIcon(blueIcon);
        renderTodoLists();
        saveTodoList();
      };
      li.appendChild(btn);
      exploredListEl?.appendChild(li);
    });

    todoSites.unexplored.forEach(site => {
      const li = document.createElement('li');
      li.textContent = site;
      const btn = document.createElement('button');
      btn.textContent = 'Marcar explorado';
      btn.onclick = () => {
        todoSites.unexplored = todoSites.unexplored.filter(s => s !== site);
        todoSites.explored.push(site);
        const marker = markers.get(site);
        if (marker) marker.setIcon(greenIcon);
        renderTodoLists();
        saveTodoList();
      };
      li.appendChild(btn);
      unexploredListEl?.appendChild(li);
    });
  }

  // Add new urbex site
  async function addUrbexSite(lat, lng, label, saveToDatabase = true) {
    const marker = L.marker([lat, lng], { icon: blueIcon }).addTo(map).bindPopup(label);
    markers.set(label, marker);

    const li = document.createElement('li');
    li.textContent = label;

    const btn = document.createElement('button');
    btn.textContent = 'Eliminar';
    btn.onclick = async () => {
      if (currentUser) {
        try {
          // Delete from database
          const { error } = await window.supabaseClient
            .from('user_saved_locations')
            .delete()
            .eq('user_id', currentUser.id)
            .eq('name', label);

          if (error) throw error;

          saveUserAction('site_deleted', { name: label, lat, lng });
          window.notificationSystem.success('Lugar eliminado y guardado automáticamente');
        } catch (error) {
          console.error('Error deleting from database:', error);
          window.notificationSystem.error('Error al eliminar el lugar');
        }
      }

      map.removeLayer(marker);
      li.remove();
      todoSites.explored = todoSites.explored.filter(s => s !== label);
      todoSites.unexplored = todoSites.unexplored.filter(s => s !== label);
      markers.delete(label);
      renderTodoLists();
      saveTodoList();
    };

    li.appendChild(btn);
    listEl?.appendChild(li);

    todoSites.unexplored.push(label);
    renderTodoLists();

    if (saveToDatabase && currentUser) {
      // Always save to database
      const result = await saveUserLocation(label, lat, lng, '', 'urbex');
      if (result.success) {
        saveUserAction('site_added', { name: label, lat, lng });
        saveTodoList();
      }
    }
  }

  // Add-urbex button
  document.getElementById('add-urbex-btn')?.addEventListener('click', async () => {
    const addr = document.getElementById('urbex-input')?.value.trim();
    if (!addr) return;
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(addr)}&countrycodes=es`);
      const data = await res.json();
      if (!data[0]) return alert('Dirección no encontrada');
      const { lat, lon } = data[0];
      await addUrbexSite(lat, lon, addr);
      document.getElementById('urbex-input').value = '';
      window.notificationSystem.success('Lugar añadido y guardado automáticamente');
      await saveTodoList();
    } catch (err) {
      console.error('Error buscando dirección:', err);
      alert('Error al buscar la dirección');
    }
  });

  // Draggable helper (single copy)
  function hacerArrastrable(id) {
    const panel = document.getElementById(id);
    if (!panel) return;
    const header = panel.querySelector('.panel-header');
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
        panel.style.transform = `none`;
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

  // Map click panel
  const mapClickPanel = document.getElementById('map-click-panel');
  const mapClickNameInput = document.getElementById('map-click-name');
  const mapClickCoordsDiv = document.getElementById('map-click-coords');
  const saveMapClickBtn = document.getElementById('save-map-click-btn');
  const closeMapClickBtn = document.getElementById('close-map-click-panel');

  function showMapClickPanel(lat, lng) {
    if (!mapClickCoordsDiv || !mapClickNameInput || !mapClickPanel) return;
    mapClickCoordsDiv.textContent = `Coordenadas: ${lat.toFixed(5)}, ${lng.toFixed(5)}`;
    mapClickNameInput.value = '';
    mapClickPanel.style.top = '450px';
    mapClickPanel.classList.add('visible');
  }

  function hideMapClickPanel() {
    mapClickPanel?.classList.remove('visible');
  }

  closeMapClickBtn?.addEventListener('click', hideMapClickPanel);

  saveMapClickBtn?.addEventListener('click', () => {
    const name = mapClickNameInput?.value.trim();
    if (!name) {
      alert('Por favor, introduce un nombre para el lugar.');
      return;
    }
    const coordsText = mapClickCoordsDiv?.textContent;
    const coordsMatch = coordsText?.match(/Coordenadas: ([\d.-]+), ([\d.-]+)/);
    if (!coordsMatch) return;
    const lat = parseFloat(coordsMatch[1]);
    const lng = parseFloat(coordsMatch[2]);
    addUrbexSite(lat, lng, name);
    hideMapClickPanel();
  });

  if (map && map.off && map.on) {
    try {
      map.off('click');
    } catch (e) {
      // ignore if no previous handlers
    }
    map.on('click', e => {
      const { lat, lng } = e.latlng;
      showMapClickPanel(lat, lng);
    });
  }

  hacerArrastrable('map-click-panel');

  // Load changelog
  async function loadChangelog() {
    try {
      const response = await fetch('CHANGELOG.md');
      if (!response.ok) {
        throw new Error('Failed to fetch changelog.md');
      }
      const markdown = await response.text();
      const html = marked.parse(markdown);
      const changelogContainer = document.querySelector('.changelog-content');
      if (changelogContainer) {
        changelogContainer.innerHTML = html;
      }
    } catch (error) {
      console.error('Error loading changelog:', error);
    }
  }
  loadChangelog();

  // User hub
  const userProfileBtn = document.getElementById('user-profile-btn');
  const userDropdownPanel = document.getElementById('user-dropdown-panel');
  const userNameDisplay = document.getElementById('user-name-display');
  const dropdownUserName = document.getElementById('dropdown-user-name');
  const dropdownUserEmail = document.getElementById('dropdown-user-email');
  const changePasswordBtn = document.getElementById('change-password-btn');
  const logoutBtnNew = document.getElementById('logout-btn-new');

  userProfileBtn?.addEventListener('click', () => {
    userDropdownPanel?.classList.toggle('hidden');
    userProfileBtn.classList.toggle('active');
  });

  document.addEventListener('click', (event) => {
    if (!userProfileBtn?.contains(event.target) && !userDropdownPanel?.contains(event.target)) {
      userDropdownPanel?.classList.add('hidden');
      userProfileBtn?.classList.remove('active');
    }
  });

  async function loadUserData() {
    try {
      const { data: { user } } = await window.supabaseClient.auth.getUser();
      if (user) {
        userNameDisplay && (userNameDisplay.textContent = user.user_metadata?.username || user.user_metadata?.full_name || user.email || 'Usuario');
        dropdownUserName && (dropdownUserName.textContent = user.user_metadata?.username || user.user_metadata?.full_name || user.email || 'Usuario');
        dropdownUserEmail && (dropdownUserEmail.textContent = user.email || '');
      }
    } catch (err) {
      console.error('Error loading user data:', err);
    }
  }
  loadUserData();

  changePasswordBtn?.addEventListener('click', () => {
    alert('Funcionalidad para cambiar contraseña no implementada aún.');
  });

  logoutBtnNew?.addEventListener('click', async () => {
    if (confirm('¿Estás seguro de que quieres cerrar sesión?')) {
      const result = await window.supabaseAuthService.logout();
      if (result.success) {
        window.location.href = 'login.html';
      }
    }
  });

  // Init: get user and load locations
  await getCurrentUser();
  await loadUserLocations();
});
