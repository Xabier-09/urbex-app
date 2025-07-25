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
  ]
};

let versionActual = "v0.3.1";

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("version-text").textContent = versionActual;
});

// Crear el mapa centrado en España, sin controles de zoom
const map = L.map('map', { zoomControl: false }).setView([40.4168, -3.7038], 6);

// Añadir el mapa base de OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Función para buscar con Nominatim (OpenStreetMap)
async function buscarLugar(texto) {
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(texto)}`;
  const response = await fetch(url);
  const datos = await response.json();
  return datos; // Array de resultados
}

// Evento al hacer clic en botón buscar
document.getElementById('search-btn').addEventListener('click', async () => {
  const query = document.getElementById('search-input').value.trim();
  if (!query) {
    alert('Escribe una ciudad o pueblo para buscar');
    return;
  }

  const resultados = await buscarLugar(query);

  if (resultados.length === 0) {
    alert('No se encontró ningún lugar');
    return;
  }

  // Tomamos el primer resultado
  const lugar = resultados[0];
  const lat = lugar.lat;
  const lon = lugar.lon;

  // Centrar mapa y poner marcador
  map.setView([lat, lon], 12);

  L.marker([lat, lon])
    .addTo(map)
    .bindPopup(lugar.display_name)
    .openPopup();
});

// Buscar al pulsar Enter en el input
document.getElementById('search-input').addEventListener('keyup', (event) => {
  if (event.key === 'Enter') {
    document.getElementById('search-btn').click();
  }
});

// Mostrar changelog con todas las versiones y sus cambios
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
