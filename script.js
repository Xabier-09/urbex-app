const versiones = {
  "v0.1.0": [
    "Versión inicial del mapa urbano en Leaflet",
    "Buscador de ciudades/pueblos con Nominatim",
    "Estilo limpio y bonito en el HUD",
    "Panel de versión clicable con changelog"
  ],
  "v0.1.1": [
    "Quitados los botones de zoom + y - del mapa",
    "Changelog centrado en pantalla con animación suave"
  ],
  "v0.2.0": [
    "Changelog con versiones múltiples acumulativas",
    "Visualización de todas las versiones anteriores sin borrar",
    "Mejora en el diseño y usabilidad del changelog"
  ],
  "v0.3.0": [
    "Añadida publicación automática con GitHub Pages"
  ],
  "v0.3.1": [
    "Añadido icono 🏚 solo en el favicon (pestaña del navegador), sin tocar HUD ni changelog"
  ],
  "v0.4.0": [
    "Mapa restringido para no salirse del área geográfica de España",
    "Búsqueda filtrada para devolver solo lugares dentro de España"
  ],
  "v0.5.0": [
    "Limitado zoom mínimo para que no se pueda alejar más allá de España",
    "Marcador anterior se elimina al hacer nueva búsqueda"
  ]
};

let versionActual = "v0.5.0";

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("version-text").textContent = versionActual;
});

// Límites geográficos para España (aproximados)
const southWest = L.latLng(35.0, -10.5);
const northEast = L.latLng(44.0, 4.5);
const bounds = L.latLngBounds(southWest, northEast);

// Crear mapa con restricción a España, sin controles de zoom, y con zoom mínimo y máximo
const map = L.map('map', {
  zoomControl: false,
  maxBounds: bounds,
  maxBoundsViscosity: 0.9,
  minZoom: 6,   // zoom mínimo que no permite alejarse más (ajusta si quieres)
  maxZoom: 19
}).setView([40.4168, -3.7038], 6);

// Añadir capa base OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

let marcadorActual = null;  // variable para guardar marcador activo

// Función buscar con filtro para España
async function buscarLugar(texto) {
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(texto)}&countrycodes=es`;
  const response = await fetch(url);
  const datos = await response.json();
  return datos;
}

// Botón buscar
document.getElementById('search-btn').addEventListener('click', async () => {
  const query = document.getElementById('search-input').value.trim();
  if (!query) {
    alert('Escribe una ciudad o pueblo para buscar');
    return;
  }

  const resultados = await buscarLugar(query);

  if (resultados.length === 0) {
    alert('No se encontró ningún lugar en España');
    return;
  }

  // Primer resultado
  const lugar = resultados[0];
  const lat = lugar.lat;
  const lon = lugar.lon;

  // Eliminar marcador anterior si existe
  if (marcadorActual) {
    map.removeLayer(marcadorActual);
  }

  // Centrar y marcar en el mapa
  map.setView([lat, lon], 12);

  marcadorActual = L.marker([lat, lon])
    .addTo(map)
    .bindPopup(lugar.display_name)
    .openPopup();
});

// Enter para buscar
document.getElementById('search-input').addEventListener('keyup', (event) => {
  if (event.key === 'Enter') {
    document.getElementById('search-btn').click();
  }
});

// Mostrar changelog completo con versiones acumuladas
function mostrarChangelog() {
  const changelog = document.getElementById("changelog");
  const content = document.getElementById("changelog-content");

  content.innerHTML = "";

  for (const [version, cambios] of Object.entries(versiones)) {
    const versionTitulo = document.createElement("h3");
    versionTitulo.textContent = version;
    content.appendChild(versionTitulo);

    const ul = document.createElement("ul");
    cambios.forEach(cambio => {
      const li = document.createElement("li");
      li.textContent = cambio;
      ul.appendChild(li);
    });
    content.appendChild(ul);
  }

  changelog.classList.remove("oculto");
  requestAnimationFrame(() => {
    changelog.classList.add("visible");
  });
}

function ocultarChangelog() {
  const changelog = document.getElementById("changelog");
  changelog.classList.remove("visible");
  setTimeout(() => {
    changelog.classList.add("oculto");
  }, 300);
}
