document.addEventListener('DOMContentLoaded', () => {
  const map = window.urbexMap;
  const listEl = document.getElementById('urbex-list');

  const togglePanel = () => document.getElementById('urbex-panel').classList.toggle('visible');
  document.getElementById('open-urbex-btn').addEventListener('click', togglePanel);
  document.getElementById('close-urbex-btn').addEventListener('click', togglePanel);

  // Todo panel toggle
  const toggleTodoPanel = () => document.getElementById('todo-panel').classList.toggle('visible');
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

  map.on('click', async e => {
    const { lat, lng } = e.latlng;
    const nombre = prompt('¿Cómo quieres llamar a este lugar?');
    if (!nombre || !nombre.trim()) return;
    addUrbexSite(lat, lng, nombre.trim());
  });

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
});
