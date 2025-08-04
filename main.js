document.addEventListener('DOMContentLoaded', () => {
  const map = L.map('map', {
    zoomControl: false,
    minZoom: 6.5,
    maxZoom: 19, attributionControl: false}).setView([40.4168, -3.7038], 6.5);

  window.urbexMap = map;

  const bounds = L.latLngBounds([35, -10], [44.5, 5]);
  map.setMaxBounds(bounds);
  map.on('drag', () => map.panInsideBounds(bounds, { animate: false }));

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map);

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
  document.getElementById('version-info').addEventListener('click', toggleChangelog);
  document.getElementById('close-changelog-btn').addEventListener('click', toggleChangelog);

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
