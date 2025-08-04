document.addEventListener('DOMContentLoaded', () => {
  const map = window.urbexMap;
  const listEl = document.getElementById('urbex-list');

  const togglePanel = () => {
    const panel = document.getElementById('urbex-panel');
    // const mapClickPanel = document.getElementById('map-click-panel');
    
    if (panel.classList.contains('visible')) {
      panel.classList.remove('visible');
    } else {
      panel.style.left = '20px';
      panel.style.top = '185px';
      panel.classList.add('visible');
    }
    
    // Removed repositioning of map-click-panel to prevent it moving when urbex panel toggles
    // if (mapClickPanel.classList.contains('visible')) {
    //   positionMapClickPanel();
    // }
  };
  document.getElementById('open-urbex-btn').addEventListener('click', togglePanel);
  document.getElementById('close-urbex-btn').addEventListener('click', togglePanel);

  // Todo panel toggle
  const toggleTodoPanel = () => {
    const panel = document.getElementById('todo-panel');
    // const mapClickPanel = document.getElementById('map-click-panel');
    
    if (panel.classList.contains('visible')) {
      panel.classList.remove('visible');
    } else {
      panel.style.left = '20px';
      panel.style.top = '300px';
      panel.classList.add('visible');
    }
    
    // Removed repositioning of map-click-panel to prevent it moving when todo panel toggles
    // positionMapClickPanel();
  };
  document.getElementById('open-todo-btn').addEventListener('click', toggleTodoPanel);
  document.getElementById('close-todo-btn').addEventListener('click', toggleTodoPanel);

  // Custom blue and green icons for markers
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

  // Data structure to hold todo sites and their markers
  const todoSites = {
    explored: [],
    unexplored: []
  };
  const markers = new Map(); // Map site label to marker

  const exploredListEl = document.getElementById('explored-list');
  const unexploredListEl = document.getElementById('unexplored-list');

  // Function to render todo lists
  function renderTodoLists() {
    exploredListEl.innerHTML = '';
    unexploredListEl.innerHTML = '';

    todoSites.explored.forEach(site => {
      const li = document.createElement('li');
      li.textContent = site;
      const btn = document.createElement('button');
      btn.textContent = 'Marcar no explorado';
      btn.onclick = () => {
        todoSites.explored = todoSites.explored.filter(s => s !== site);
        todoSites.unexplored.push(site);
        // Update marker icon to blue
        const marker = markers.get(site);
        if (marker) marker.setIcon(blueIcon);
        renderTodoLists();
      };
      li.appendChild(btn);
      exploredListEl.appendChild(li);
    });

    todoSites.unexplored.forEach(site => {
      const li = document.createElement('li');
      li.textContent = site;
      const btn = document.createElement('button');
      btn.textContent = 'Marcar explorado';
      btn.onclick = () => {
        todoSites.unexplored = todoSites.unexplored.filter(s => s !== site);
        todoSites.explored.push(site);
        // Update marker icon to green
        const marker = markers.get(site);
        if (marker) marker.setIcon(greenIcon);
        renderTodoLists();
      };
      li.appendChild(btn);
      unexploredListEl.appendChild(li);
    });
  }

  // Function to add a new urbex site with marker and add to unexplored list
  function addUrbexSite(lat, lon, label) {
    const marker = L.marker([lat, lon], { icon: blueIcon }).addTo(map).bindPopup(label);
    markers.set(label, marker);

    const li = document.createElement('li');
    li.textContent = label;
    const btn = document.createElement('button');
    btn.textContent = 'Eliminar';
    btn.onclick = () => {
      map.removeLayer(marker);
      li.remove();
      // Remove from todo lists and markers map
      todoSites.explored = todoSites.explored.filter(s => s !== label);
      todoSites.unexplored = todoSites.unexplored.filter(s => s !== label);
      markers.delete(label);
      renderTodoLists();
    };
    li.appendChild(btn);
    listEl.appendChild(li);

    // Add to unexplored todo list and render
    todoSites.unexplored.push(label);
    renderTodoLists();
  }

  document.getElementById('add-urbex-btn').addEventListener('click', async () => {
    const addr = document.getElementById('urbex-input').value.trim();
    if (!addr) return;
    const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(addr)}&countrycodes=es`);
    const data = await res.json();
    if (!data[0]) return alert('Dirección no encontrada');
    const { lat, lon } = data[0];
    addUrbexSite(lat, lon, addr);
    document.getElementById('urbex-input').value = '';
  });

  // New draggable function copied from main.js
  function hacerArrastrable(id) {
    const panel = document.getElementById(id);
    const header = panel.querySelector('.panel-header');

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

  // Show/hide functions for map click panel
  const mapClickPanel = document.getElementById('map-click-panel');
  const mapClickNameInput = document.getElementById('map-click-name');
  const mapClickCoordsDiv = document.getElementById('map-click-coords');
  const saveMapClickBtn = document.getElementById('save-map-click-btn');
  const closeMapClickBtn = document.getElementById('close-map-click-panel');
  const todoPanel = document.getElementById('todo-panel');

  // Function to position the map-click-panel below the todo-panel
  function positionMapClickPanel() {
    const mapClickPanel = document.getElementById('map-click-panel');
    // Remove dynamic positioning, set fixed position below todo-panel
    mapClickPanel.style.top = '450px'; // Fixed position below todo-panel at 300px
  }

  function showMapClickPanel(lat, lng) {
    mapClickCoordsDiv.textContent = `Coordenadas: ${lat.toFixed(5)}, ${lng.toFixed(5)}`;
    mapClickNameInput.value = '';
    
    // Set fixed position below todo-panel
    mapClickPanel.style.top = '450px';
    
    // Show the panel after setting position
    mapClickPanel.classList.add('visible');
  }

  function hideMapClickPanel() {
    mapClickPanel.classList.remove('visible');
  }

  closeMapClickBtn.addEventListener('click', () => {
    hideMapClickPanel();
  });

  saveMapClickBtn.addEventListener('click', () => {
    const name = mapClickNameInput.value.trim();
    if (!name) {
      alert('Por favor, introduce un nombre para el lugar.');
      return;
    }
    const coordsText = mapClickCoordsDiv.textContent;
    const coordsMatch = coordsText.match(/Coordenadas: ([\d.-]+), ([\d.-]+)/);
    if (!coordsMatch) return;
    const lat = parseFloat(coordsMatch[1]);
    const lng = parseFloat(coordsMatch[2]);
    addUrbexSite(lat, lng, name);
    hideMapClickPanel();
  });

  // Modify map click handler to show custom panel instead of prompt
  map.off('click'); // Remove previous click handlers
  map.on('click', e => {
    const { lat, lng } = e.latlng;
    showMapClickPanel(lat, lng);
  });

  // Make the new panel draggable
  hacerArrastrable('map-click-panel');

  // Function to load and render changelog markdown
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

  // Load changelog when DOM content is loaded
  loadChangelog();

  // --- Nuevo código para hub de usuario ---

  const userProfileBtn = document.getElementById('user-profile-btn');
  const userDropdownPanel = document.getElementById('user-dropdown-panel');
  const userNameDisplay = document.getElementById('user-name-display');
  const dropdownUserName = document.getElementById('dropdown-user-name');
  const dropdownUserEmail = document.getElementById('dropdown-user-email');
  const changePasswordBtn = document.getElementById('change-password-btn');
  const logoutBtnNew = document.getElementById('logout-btn-new');

  // Toggle dropdown panel
  userProfileBtn.addEventListener('click', () => {
    userDropdownPanel.classList.toggle('hidden');
    userProfileBtn.classList.toggle('active');
  });

  // Close dropdown if clicked outside
  document.addEventListener('click', (event) => {
    if (!userProfileBtn.contains(event.target) && !userDropdownPanel.contains(event.target)) {
      userDropdownPanel.classList.add('hidden');
      userProfileBtn.classList.remove('active');
    }
  });

  // Load user data from Supabase
  async function loadUserData() {
    const { data: { user } } = await window.supabaseClient.auth.getUser();
    if (user) {
      userNameDisplay.textContent = user.user_metadata?.username || user.user_metadata?.full_name || user.email || 'Usuario';
      dropdownUserName.textContent = user.user_metadata?.username || user.user_metadata?.full_name || user.email || 'Usuario';
      dropdownUserEmail.textContent = user.email || '';
    }
  }

  loadUserData();

  // Change password button handler
  changePasswordBtn.addEventListener('click', () => {
    alert('Funcionalidad para cambiar contraseña no implementada aún.');
    // Aquí se podría abrir un modal o redirigir a una página para cambiar contraseña
  });

  // Logout button handler
  logoutBtnNew.addEventListener('click', async () => {
    if (confirm('¿Estás seguro de que quieres cerrar sesión?')) {
      const result = await window.supabaseAuthService.logout();
      if (result.success) {
        window.location.href = 'login.html';
      }
    }
  });
});
