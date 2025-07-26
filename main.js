document.addEventListener('DOMContentLoaded', () => {
  // Mapa
  const map = L.map('map', { zoomControl: false, minZoom: 6, maxZoom: 19 })
    .setView([40.4168, -3.7038], 6);

  const bounds = L.latLngBounds([35, -10], [44.5, 5]);
  map.setMaxBounds(bounds);
  map.on('drag', () => map.panInsideBounds(bounds, { animate: false }));

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map);

  let currentMarker = null;

  // Búsqueda
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
    if (currentMarker) { map.removeLayer(currentMarker); currentMarker = null; }
  });

  // Changelog
  const toggleChangelog = () => document.getElementById('changelog').classList.toggle('visible');
  document.getElementById('version-info').addEventListener('click', toggleChangelog);
  document.getElementById('close-changelog-btn').addEventListener('click', toggleChangelog);

  // Exponer mapa para urbex.js
  window.urbexMap = map;
});
