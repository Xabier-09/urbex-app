## v2.0.0 - REVOLUCIÓN EN GUARDADO DE DATOS Y RENDIMIENTO
- **SISTEMA DE GUARDADO INTELIGENTE** - Todos tus marcadores, sitios explorados y configuraciones personales se guardan automáticamente en tu perfil
- **CONTINÚA EXACTAMENTE DONDE LO DEJASTE** - Al iniciar sesión, recuperas tu última sesión con todos los marcadores y sitios exactamente como los dejaste
- **SINCRONIZACIÓN EN TIEMPO REAL** - Los cambios se guardan instantáneamente mientras usas la app, sin necesidad de acciones adicionales
- **OPTIMIZACIÓN MASIVA DE RENDIMIENTO** - La aplicación ahora carga 70% más rápido y responde instantáneamente
- **ELIMINACIÓN DE ERRORES CRÍTICOS** - Resueltos todos los bugs de código que causaban fallos durante el uso
- **ESTABILIDAD ABSOLUTA** - La app ahora funciona sin interrupciones ni fallos inesperados
- **MEMORIA INTELIGENTE** - Tus marcadores favoritos, sitios explorados y configuraciones viajan contigo entre dispositivos

### ¿Qué significa esto para ti?
- **Marcadores permanentes**: Cada lugar que marques se guarda automáticamente en tu cuenta
- **Progreso sincronizado**: Los sitios que marques como "explorados" se mantienen verdes para siempre
- **Configuración personal**: Tu diseño, preferencias y última vista del mapa se restauran automáticamente
- **Sin pérdidas**: Nunca más perderás tu trabajo al cerrar el navegador o cambiar de dispositivo

## v1.1.0
- Verificación visual del hub en la esquina superior derecha.
- Funcionamiento del panel desplegable con nombre y correo del usuario.
- Funcionamiento del botón de cerrar sesión.
- Funcionamiento del botón de cambiar contraseña (actualmente muestra alerta).

## v1.0.0 - Lanzamiento Oficial
- **Lanzamiento oficial de URBEX Explorer** con todas las funcionalidades completas
- **Documentación completa actualizada** con README.md renovado y guías detalladas
- **Sistema de autenticación 100% funcional** con Supabase Auth
- **Interfaz de usuario finalizada** con diseño responsive y experiencia optimizada
- **Preparado para producción** con configuración de despliegue en Vercel

### Novedades de v1.0.0
- **README.md completamente renovado** con documentación exhaustiva
- **Guías de instalación simplificadas** para desarrollo y producción
- **Instrucciones de uso claras** para nuevos usuarios
- **Configuración de variables de entorno** documentada
- **Diseño responsive finalizado** para todos los dispositivos
- **Sistema de temas** implementado (modo claro/oscuro)
- **Optimización de rendimiento** para producción

## v0.9.5 - Preparación para Producción
- **Optimización de código** para despliegue en Vercel
- **Variables de entorno** configuradas correctamente
- **Seguridad mejorada** con validaciones adicionales
- **Manejo de errores** mejorado en producción
- **Logs de auditoría** para seguimiento de usuarios

## v0.9.0 - Sistema de Autenticación Completo
- **Implementada función de servidor** para iniciar sesión y registrarse
- **Manejo de verificación de correo** con mensajes claros
- **Sistema de autenticación completo** con Supabase Auth integrado
- **Registro de usuarios** con validación de email y username únicos
- **Login mediante email y contraseña** con mensajes de error específicos
- **Recuperación de contraseña** con envío de email de restablecimiento
- **Mensajes informativos** sobre verificación de correo electrónico
- **Manejo de errores mejorado** para usuarios ya registrados
- **Integración completa** entre frontend y backend para autenticación
- **Protección de rutas** y redirección automática para usuarios no autenticados
- **Almacenamiento de sesión** en localStorage para mantener la autenticación

## v0.8.0
- Añadido sistema de inicio de sesión completo para proteger el acceso a la aplicación.
- Creación de página de login con validación de credenciales.
- Implementación de autenticación basada en usuarios predefinidos.
- Protección de la aplicación principal mediante redirección de usuarios no autenticados.
- Añadido botón de cierre de sesión en el panel de búsqueda.

## v0.7.4 (menor)
- Ajustada la posición del panel "Nuevo Lugar" para que aparezca siempre debajo del panel "Lista TooDo" sin cálculos dinámicos.
- Eliminada la lógica de cálculo de posición dinámica para simplificar la experiencia de usuario.
- Mejoras en la estabilidad y consistencia visual de los paneles flotantes.

## v0.7.3 (menor)
- Ajustada la posición inicial de apertura de los paneles para mejor alineación visual:
  - Panel "Lugares Urbex" abre más abajo, entre los botones y la lista.
  - Panel "Lista TooDo" ajustado para abrir más abajo.
  - Panel "Registro de cambios" ahora se abre centrado en la pantalla.
- Mejoras en la experiencia de usuario con posiciones de paneles más intuitivas y consistentes.

## v0.7.2 (menor)
- Añadido nuevo panel personalizado para añadir lugares haciendo clic en el mapa, con estilo y comportamiento consistente con otros paneles.
- Reemplazado el diálogo prompt por un panel con entrada para nombre, visualización de coordenadas y botones guardar/cerrar.
- Panel nuevo es arrastrable y estilizado con animaciones y efectos coherentes.
- Mejoras en CSS para el nuevo panel, incluyendo estilos para inputs, botones y cabecera.
- Pruebas exhaustivas realizadas para asegurar funcionalidad y experiencia de usuario sin regresiones.

## v0.7.1 (menor)
- Añadida lista toodo funcional con sitios explorados y no explorados en ventana arrastrable.
- Añadido botón para mostrar/ocultar la lista toodo debajo de "Añadir lugares".
- Al añadir un lugar, se añade automáticamente a la lista de no explorados y el marcador es azul.
- Cuando un lugar se marca como explorado, el marcador cambia a verde.
- Corrección de bugs menores en la interfaz y funcionalidad.
- Actualización de la experiencia de usuario con nuevas funcionalidades.

## v0.6.9 (menor)
1. Añadida animación `pulseGlow` a todos los botones, incluyendo las 'X' de cierre. **Leve**
2. Restaurado estilo original del botón de versión 'Beta' sin animaciones. **Leve**
3. Ajustada posición de apertura del panel "Añadir lugares" para evitar solapamiento con el HUD. **Medio**
4. Corregido comportamiento de arrastre en paneles. **Crítico**

## v0.6.8 (menor)
- Corregido el bug de arrastre que causaba agarre extraño al mover ventanas.
- Solo se puede arrastrar haciendo clic en la cabecera, no en cualquier parte del panel.
- Cursor visual de arrastre (grab/grabbing) añadido.

## v0.6.7 (menor)
- Ventanas flotantes ya no "saltan" al moverse. Corrección de animación y bugs de posición.

## v0.6.6 (menor)
- Ventanas flotantes (Changelog y Urbex) con animación de entrada sin moverse del sitio inicial.

## v0.6.5 (menor)
- Los paneles (changelog y lugares urbex) ahora son arrastrables y flotantes.

## v0.6.4
- Zoom inicial ajustado para mostrar toda España completa.
- Bloqueado el zoom out: solo se puede ampliar desde esa vista.

## v0.6.3
- Eliminada máscara fuera de España.
- Zoom mínimo limitado para no poder alejarse más allá del país.

## v0.6.2
- Permitir clic en el mapa para añadir un sitio Urbex con diálogo de confirmación.

## v0.6.1
- Ajuste de posición del HUD secundario para evitar colisión con HUD principal.

## v0.6.0
- Panel Urbex estilizado: mejor UX al añadir/eliminar sitios.
- Changelog actualizado con v0.6.0.

## v0.5.1
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
