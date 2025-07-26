document.addEventListener('DOMContentLoaded', () => {
  const map = window.urbexMap;
  const listEl = document.getElementById('urbex-list');

  // Toggle panel Urbex
  const togglePanel = () => document.getElementById('urbex-panel').classList.toggle('visible');
  document.getElementById('open-urbex-btn').addEventListener('click', togglePanel);
  document.getElementById('close-urbex-btn').addEventListener('click', togglePanel);

  // Función común para añadir un marcador + lista
  const addUrbexSite = (lat, lon, label) => {
    const marker = L.marker([lat, lon]).addTo(map).bindPopup(label);
    const li = document.createElement('li');
    li.textContent = label;
    const btn = document.createElement('button');
    btn.textContent = 'Eliminar';
    btn.onclick = () => { map.removeLayer(marker); li.remove(); };
    li.appendChild(btn);
    listEl.appendChild(li);
  };

  // Añadir manual (input de texto)
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

  // Clic en el mapa para añadir sitio
  map.on('click', async e => {
    const { lat, lng } = e.latlng;
    const nombre = prompt('¿Cómo quieres llamar a este lugar?');
    if (!nombre || !nombre.trim()) return;
    addUrbexSite(lat, lng, nombre.trim());
  });
});
