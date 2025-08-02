## Beta v0.7.3 (menor)
- Ajustada la posición inicial de apertura de los paneles para mejor alineación visual:
  - Panel "Lugares Urbex" abre más abajo, entre los botones y la lista.
  - Panel "Lista TooDo" ajustado para abrir más abajo.
  - Panel "Registro de cambios" ahora se abre centrado en la pantalla.
- Mejoras en la experiencia de usuario con posiciones de paneles más intuitivas y consistentes.

## Beta v0.7.2 (menor)
- Añadido nuevo panel personalizado para añadir lugares haciendo clic en el mapa, con estilo y comportamiento consistente con otros paneles.
- Reemplazado el diálogo prompt por un panel con entrada para nombre, visualización de coordenadas y botones guardar/cerrar.
- Panel nuevo es arrastrable y estilizado con animaciones y efectos coherentes.
- Mejoras en CSS para el nuevo panel, incluyendo estilos para inputs, botones y cabecera.
- Pruebas exhaustivas realizadas para asegurar funcionalidad y experiencia de usuario sin regresiones.

## Beta v0.7.1 (menor)
- Añadida lista toodo funcional con sitios explorados y no explorados en ventana arrastrable.
- Añadido botón para mostrar/ocultar la lista toodo debajo de "Añadir lugares".
- Al añadir un lugar, se añade automáticamente a la lista de no explorados y el marcador es azul.
- Cuando un lugar se marca como explorado, el marcador cambia a verde.
- Corrección de bugs menores en la interfaz y funcionalidad.
- Actualización de la experiencia de usuario con nuevas funcionalidades.

## Beta v0.6.9 (menor)
1. Añadida animación `pulseGlow` a todos los botones, incluyendo las 'X' de cierre. **Leve**
2. Restaurado estilo original del botón de versión 'Beta' sin animaciones. **Leve**
3. Ajustada posición de apertura del panel "Añadir lugares" para evitar solapamiento con el HUD. **Medio**
4. Corregido comportamiento de arrastre en paneles. **Crítico**

## Beta v0.6.8 (menor)
- Corregido el bug de arrastre que causaba agarre extraño al mover ventanas.
- Solo se puede arrastrar haciendo clic en la cabecera, no en cualquier parte del panel.
- Cursor visual de arrastre (grab/grabbing) añadido.

## Beta v0.6.7 (menor)
- Ventanas flotantes ya no “saltan” al moverse. Corrección de animación y bugs de posición.

## Beta v0.6.6 (menor)
- Ventanas flotantes (Changelog y Urbex) con animación de entrada sin moverse del sitio inicial.

## Beta v0.6.5 (menor)
- Los paneles (changelog y lugares urbex) ahora son arrastrables y flotantes.

## Beta v0.6.4
- Zoom inicial ajustado para mostrar toda España completa.
- Bloqueado el zoom out: solo se puede ampliar desde esa vista.

## Beta v0.6.3
- Eliminada máscara fuera de España.
- Zoom mínimo limitado para no poder alejarse más allá del país.

## Beta v0.6.2
- Permitir clic en el mapa para añadir un sitio Urbex con diálogo de confirmación.

## Beta v0.6.1
- Ajuste de posición del HUD secundario para evitar colisión con HUD principal.

## Beta v0.6.0
- Panel Urbex estilizado: mejor UX al añadir/eliminar sitios.
- Changelog actualizado con v0.6.0.

## Beta v0.5.1
- Panel Urbex funcional: añadir/eliminar marcadores.
- Botón en HUD para abrir el panel de marcadores.

## v0.5.0
- Limitado zoom mínimo para no alejarse más allá de España.
- Marcador anterior se elimina al hacer nueva búsqueda.

## v0.4.0
- Mapa restringido para no salirse del área geográfica de España.
- Búsqueda filtrada para devolver solo lugares dentro de España.

## v0.3.1
- Añadido icono 🏚 solo en el favicon (pestaña del navegador), sin tocar HUD ni changelog.

## v0.3.0
- Añadida publicación automática con GitHub Pages.

## v0.2.0
- Changelog con versiones múltiples acumulativas.
- Visualización de todas las versiones anteriores sin borrar.
- Mejora en el diseño y usabilidad del changelog.

## v0.1.1
- Quitados los botones de zoom + y - del mapa.
- Changelog centrado en pantalla con animación suave.

## v0.1.0
- Versión inicial del mapa urbano en Leaflet.
- Buscador de ciudades/pueblos con Nominatim.
- Estilo limpio y bonito en el HUD.
- Panel de versión clicable con changelog.
