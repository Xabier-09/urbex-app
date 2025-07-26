document.addEventListener('DOMContentLoaded', () => {
  const map = L.map('map', {
    zoomControl: false,
    minZoom: 6.5,
    maxZoom: 19
  }).setView([40.4168, -3.7038], 6.5);

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

  const toggleChangelog = () =>
    document.getElementById('changelog').classList.toggle('visible');
  document.getElementById('version-info').addEventListener('click', toggleChangelog);
  document.getElementById('close-changelog-btn').addEventListener('click', toggleChangelog);

  window.urbexMap = map;

  // === Función para hacer arrastrables los paneles flotantes ===
  function hacerArrastrable(idPanel) {
    const panel = document.getElementById(idPanel);
    const header = panel.querySelector('.panel-header');
    let offsetX, offsetY, isDragging = false;

    header.addEventListener('mousedown', e => {
      isDragging = true;
      offsetX = e.clientX - panel.getBoundingClientRect().left;
      offsetY = e.clientY - panel.getBoundingClientRect().top;
      panel.style.transition = 'none';
    });

    document.addEventListener('mousemove', e => {
      if (!isDragging) return;
      panel.style.left = `${e.clientX - offsetX}px`;
      panel.style.top = `${e.clientY - offsetY}px`;
      panel.style.transform = 'none';
    });

    document.addEventListener('mouseup', () => {
      isDragging = false;
    });
  }

  hacerArrastrable('changelog');
  hacerArrastrable('urbex-panel');
});
