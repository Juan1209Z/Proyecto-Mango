# PC Builder - Arma tu PC Ideal

Desarrolladores: David Grau Ramírez - Juan José Moreno Flórez

## Descripción del Proyecto
PC Builder es una aplicación web interactiva que permite a los usuarios simular el ensamblaje de computadoras personalizadas y a los administradores gestionar el inventario de componentes. Está desarrollada bajo el patrón de arquitectura Modelo-Vista-Controlador (MVC) utilizando JavaScript puro (Vanilla JS).

## Características Principales
*   **Panel de Administración:** Autenticación por código maestro para gestionar el catálogo de piezas (Crear, Leer, Actualizar, Eliminar).
*   **Simulador de Ensamblaje (Tienda):** Interfaz para que los clientes seleccionen CPU, GPU, RAM y Almacenamiento, calculando el presupuesto total en tiempo real.
*   **Persistencia de Datos:** Almacenamiento local de pedidos, inventario y usuarios administradores.
*   **Integración de API:** Consumo de datos externos para complementar la experiencia del usuario en la sección de guías.

## Tecnologías Utilizadas
*   HTML5 (Semántico)
*   CSS3 (Variables de CSS, Grid, Flexbox)
*   JavaScript (ES6+, Vanilla, Arquitectura MVC)
*   Formatos de datos: JSON

## Documentación Oficial y Referencias
Para el desarrollo de la lógica y la integración de funcionalidades de este proyecto, se consultó la siguiente documentación oficial[cite: 12]:

1.  **[MDN Web Docs: Window.localStorage](https://developer.mozilla.org/es/docs/Web/API/Window/localStorage)**
    *   **Uso en el proyecto:** Sirvió para implementar la persistencia de datos en la capa del `modelo.js`. Se utilizó para guardar el catálogo de productos, las cotizaciones de la tienda y las credenciales de los administradores sin necesidad de una base de datos externa.
2.  **[MDN Web Docs: Intl.NumberFormat](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat)**
    *   **Uso en el proyecto:** Sirvió para formatear dinámicamente los valores numéricos de los componentes dentro de `vista.js`. Permitió mostrar los precios estandarizados en pesos colombianos (COP) a lo largo de toda la interfaz (ej. `$ 1.200.000`).
3.  **[Documentación Oficial de IGDB API](https://api-docs.igdb.com/)** 
    *   **Uso en el proyecto:** Sirvió para comprender los endpoints, la autenticación (Bearer Token) y la sintaxis Apicalypse necesaria para realizar peticiones POST. Se usó en `api.js` para extraer y mostrar información real de videojuegos en la sección de guías.
4. **[Documentación Oficial de Cloudfare Worker](https://developers.cloudflare.com/workers/)**
    *   **Uso en el proyecto:** Sirvio para crear un proxy backend, para que la pagina pida los datos del worker y este ultimo, pida los datos de IGDB. Tambien sirvio para guardar dos tokens como el client_id y client_secret de twitch, necesarios para acceder a la base de datos.
5. **[Documentación Oficial de Github Pages](https://docs.github.com/es/pages)**
    *   **Uso en el proyecto:** Sirvio para alojar la pagina en el repositorio de GitHub.
6. **[Documentación Oficial de fromspree](https://help.formspree.io/es/)**
    *   **Uso en el proyecto:** Se uso para permitir el envio de correo al usuario utilizar el apartado de contacto.

## Instalación y Uso
1.  Clona este repositorio o descarga los archivos.
2.  Tener una herramienta de programacion apta para estos archivos (se recomiendo VS studio code).
3.  En caso de no tenerla, se busca la extension "live server" y se instala.
4.  Click derecho en el archivo `index.html` y le da "abrir con live server".
5.  Para acceder como cliente simplemente es darle click al boton "cliente".
7.  Para acceder como administrador por primera vez, selecciona "Registrar Nuevo Admin" e ingresa el código de autorización (ej. `ADMIN01`).
8.  Para acceder como administrador ya registrado, ingresa las credenciales asignadas en el boton "administrador".

## Estructura del Proyecto
El código está organizado separando la interfaz, la lógica de negocio y los eventos:
*   `/css/style.css`: Estilos globales y utilidades.
*   `/js/modelo.js`: Reglas de negocio y conexión con localStorage.
*   `/js/vista.js`: Manipulación directa del DOM (pintar datos y leer formularios).
*   `/js/controlador.js`: Intermediario que maneja los eventos del usuario y coordina la Vista con el Modelo.
*   `/servicios/api.js`: Lógica de conexión con servicios externos.
