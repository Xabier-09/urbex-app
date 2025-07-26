document.addEventListener('DOMContentLoaded', () => {
  const map = window.urbexMap;
  const listEl = document.getElementById('urbex-list');

  // Toggle panel Urbex
  const toggle = () => document.getElementById('urbex-panel').classList.toggle('visible');
  document.getElementById('open-urbex-btn').addEventListener('click', toggle);
  document.getElementById('close-urbex-btn').addEventListener('click', toggle);

  // Añadir marcadores
  document.getElementById('add-urbex-btn').addEventListener('click', async () => {
    const addr = document.getElementById('urbex-input').value.trim();
    if (!addr) return;
    const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(addr)}&countrycodes=es`);
    const data = await res.json();
    if (!data[0]) return alert('Dirección no encontrada');
    const { lat, lon } = data[0];
    const marker = L.marker([lat, lon]).addTo(map).bindPopup(addr);

    // Lista
    const li = document.createElement('li');
    li.textContent = addr;
    const btn = document.createElement('button');
    btn.textContent = 'Eliminar';
    btn.onclick = () => {
      map.removeLayer(marker);
      li.remove();
    };
    li.appendChild(btn);
    listEl.appendChild(li);

    document.getElementById('urbex-input').value = '';
  });
});
