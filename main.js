document.addEventListener('DOMContentLoaded', () => {
  // Hamburger menu functionality
  const hamburgerMenu = document.getElementById('hamburger-menu');
  const sidebar = document.getElementById('sidebar');
  const sidebarToggle = document.getElementById('sidebar-toggle');
  const navButtons = document.querySelectorAll('.nav-btn');
  
  // Toggle sidebar with hamburger menu
  hamburgerMenu?.addEventListener('click', () => {
    sidebar.classList.toggle('collapsed');
  });
  
  // Toggle sidebar with internal toggle button
  sidebarToggle?.addEventListener('click', () => {
    sidebar.classList.toggle('collapsed');
  });

  // Function to toggle the todo panel
  function toggleTodoPanel() {
    const todoPanel = document.getElementById('todo-panel');
    todoPanel.classList.toggle('visible');
  }

  // Function to toggle the urbex panel
  function togglePanel() {
    const urbexPanel = document.getElementById('urbex-panel');
    urbexPanel.classList.toggle('visible');
  }

  // Handle navigation button clicks
  navButtons.forEach(button => {
    button.addEventListener('click', () => {
      const panelType = button.getAttribute('data-panel');
      
      // Remove active class from all buttons
      navButtons.forEach(btn => btn.classList.remove('active'));
      
      // Add active class to clicked button
      button.classList.add('active');
      
      // Handle different panel types
      switch(panelType) {
        case 'todo':
          toggleTodoPanel();
          break;
        case 'urbex':
          togglePanel();
          break;
        case 'social':
          // Placeholder for social functionality
          alert('Funcionalidad Social - Próximamente');
          break;
        case 'gallery':
          // Placeholder for gallery functionality
          alert('Galería Comunitaria - Próximamente');
          break;
        case 'create':
          // Placeholder for create functionality
          alert('Crear - Próximamente');
          break;
      }
    });
  });

  if (!window.urbexMap) {
    const map = L.map('map', {
      zoomControl: false,
      minZoom: 6.5,
      maxZoom: 19,
      attributionControl: false
    }).setView([40.4168, -3.7038], 6.5);

    window.urbexMap = map;

    const bounds = L.latLngBounds([35, -10], [44.5, 5]);
    map.setMaxBounds(bounds);
    map.on('drag', () => map.panInsideBounds(bounds, { animate: false }));

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);
  }

  const map = window.urbexMap;

  let currentMarker = null;

  document.getElementById('search-btn').addEventListener('click', async () => {
    const q = document.getElementById('search-input').value.trim();
    if (!q) return;
    const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}&countrycodes=es`);
    const data = await res.json();
    if (!data[0]) return alert('No encontrado');
    const { lat, lon } = data[0];
    if (currentMarker) map.removeLayer(currentMarker);
    currentMarker = L.marker([lat, lon]).addTo(map);
    map.setView([lat, lon], 14);
  });

  document.getElementById('clear-marker-btn').addEventListener('click', () => {
    if (currentMarker) {
      map.removeLayer(currentMarker);
      currentMarker = null;
    }
  });

  const toggleChangelog = () => {
    const el = document.getElementById('changelog');
    if (el.classList.contains('visible')) {
      el.classList.remove('visible');
    } else {
      // Center the changelog panel
      const panelWidth = el.offsetWidth;
      const panelHeight = el.offsetHeight;
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      el.style.left = `${(windowWidth - panelWidth) / 2}px`;
      el.style.top = `${(windowHeight - panelHeight) / 2}px`;
      el.classList.add('visible');
    }
  };
  const versionInfoBtn = document.getElementById('version-info');
  if (versionInfoBtn) {
    versionInfoBtn.addEventListener('click', toggleChangelog);
  }
  const closeChangelogBtn = document.getElementById('close-changelog-btn');
  if (closeChangelogBtn) {
    closeChangelogBtn.addEventListener('click', toggleChangelog);
  }

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

  hacerArrastrable('changelog');
  hacerArrastrable('urbex-panel');
  hacerArrastrable('todo-panel');
});
