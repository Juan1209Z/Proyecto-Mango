const CLAVE = "inventario-s117";


const Modelo = {
    productos: [],
    cargar() {
        const guardado = localStorage.getItem(CLAVE);
        this.productos = guardado ? JSON.parse(guardado) : [
            { id: 1, nombre: 'AMD Ryzen 5 5600X', precio: 600000, categoria: 'CPU', cantidad: 10, imagen: 'img/cpuamd.jpg' },
            { id: 2, nombre: 'Intel Core i5-12400F', precio: 650000, categoria: 'CPU', cantidad: 0, imagen: 'img/cpuintel.jpg' },
            { id: 3, nombre: 'NVIDIA RTX 4060', precio: 1200000, categoria: 'GPU', cantidad: 5, imagen: 'img/gpunvidia.jpg' },
            { id: 4, nombre: 'AMD Radeon RX 7600', precio: 1100000, categoria: 'GPU', cantidad: 2, imagen: 'img/gpuamd.jpg' },
            { id: 5, nombre: 'Corsair Vengeance 16GB', precio: 180000, categoria: 'RAM', cantidad: 20, imagen: 'img/ram.jpg' },
            { id: 6, nombre: 'Crucial 1TB NVMe', precio: 250000, categoria: 'Almacenamiento', cantidad: 8, imagen: 'img/almacenamiento.jpg' }
        ];
    },

    guardar() {
        localStorage.setItem(CLAVE, JSON.stringify(this.productos));
    },

    // Reglas de negocio
    validar({ id, nombre, precio, categoria, cantidad, imagen }) {
        const errores = [];
        if (nombre === '' || precio === '' || cantidad === '') errores.push("Todos los campos son obligatorios");
        if (nombre.trim().length < 3) errores.push("El nombre debe tener al menos 3 letras.");
        if (categoria.trim().length < 2) errores.push("El nombre de la categoria debe tener al menos 3 letras.");
        if (precio <= 0) errores.push("El precio debe ser mayor que cero.");
        
        if (precio > 10000000) errores.push("El precio no puede ser mayor a $10.000.000 COP");
        
        if (!Number.isInteger(Number(cantidad)) || cantidad < 0) errores.push("Las existencias deben ser un entero mayor o igual a cero.");
        const repetido = this.productos.some(
            (p) => p.nombre.toLowerCase() === nombre.trim().toLowerCase() && p.id !== id
        ); 
        if (repetido) errores.push("Ya existe un producto con ese nombre.");
        return errores;
    },

    agregar(datos) {
        const nuevoId = this.productos.reduce((max, p) => Math.max(max, p.id), 0) + 1;
        this.productos.push({ id: nuevoId, ...datos, nombre: datos.nombre.trim() });
        this.guardar();
    },

    buscarPorId(id) {
        return this.productos.find((p) => p.id === id);
    },

    actualizar(id, datos) {
        this.productos = this.productos.map((p) =>
            p.id === id ? { ...p, ...datos, nombre: datos.nombre.trim() } : p
        );
        this.guardar();
    },

    eliminar(id) {
        this.productos = this.productos.filter((p) => p.id !== id);
        this.guardar();
    },

    valorTotal() {
        return this.productos.reduce((t, p) => t + p.precio * p.cantidad, 0);
    }

 
};

const ModeloAuth = {
    clave: "pcbuilder_admins",
    codigosEstaticos: ["ADMIN01", "ROOT02", "MASTER03"],

    inicializar() {
        let admins = JSON.parse(localStorage.getItem(this.clave));
        if (!admins) {
            localStorage.setItem(this.clave, JSON.stringify([{ usuario: "admin", pass: "1234" }]));
        }
    },

    validarCredenciales(usuario, pass) {
        const admins = JSON.parse(localStorage.getItem(this.clave)) || [];
        return admins.some(a => a.usuario === usuario && a.pass === pass);
    },

    validarNuevoRegistro(usuario, codigo, pass) {
        if (usuario.length < 4) {
            return "El nombre de usuario debe tener al menos 4 caracteres.";
        }        
        if (!this.codigosEstaticos.includes(codigo)) {
            return "El código de autorización es inválido.";
        }
        if (pass.length < 4) {
            return "La contraseña debe tener al menos 4 caracteres.";
        }
        const admins = JSON.parse(localStorage.getItem(this.clave)) || [];
        if (admins.some(a => a.usuario === usuario)) {
            return "El nombre de usuario ya está registrado.";
        }

        return null; 
    },

    registrarAdmin(usuario, pass) {
        const admins = JSON.parse(localStorage.getItem(this.clave)) || [];
        admins.push({ usuario, pass });
        localStorage.setItem(this.clave, JSON.stringify(admins));
    },


};

// ===================== TIENDA =====================
const ModeloTienda = {
    inventory: {
        cpu: [
            { id: '1', nombre: 'AMD Ryzen 5 5600X', precio: 600000, imagen: 'cpuamd.jpg' }, 
            { id: '2', nombre: 'Intel Core i5-12400F', precio: 650000, imagen: 'cpuintel.jpg' }
        ],
        gpu: [
            { id: '3', nombre: 'NVIDIA RTX 4060', precio: 1200000, imagen: 'gpunvidia.jpg' }, 
            { id: '4', nombre: 'AMD Radeon RX 7600', precio: 1100000, imagen: 'gpuamd.jpg' }
        ],
        ram: [
            { id: '5', nombre: 'Corsair Vengeance 16GB', precio: 180000, imagen: 'ram.jpg' }
        ],
        storage: [
            { id: '6', nombre: 'Crucial 1TB NVMe', precio: 250000, imagen: 'almacenamiento.jpg' }
        ]
    },

    currentBuild: { cpu: null, gpu: null, ram: null, storage: null },
    savedCotizaciones: JSON.parse(localStorage.getItem("pedidos_tienda")) || [],

filtros: { search: '', minPrice: null, maxPrice: null, sort: '' }, 

    setFiltros(nuevos) {
        this.filtros = { ...this.filtros, ...nuevos };
    },

    getFilteredParts(category) { 
        let parts = [...(this.inventory[category] || [])]; 
        
        // 1. Búsqueda por nombre
        if (this.filtros.search) {
            const query = this.filtros.search.toLowerCase();
            parts = parts.filter(p => p.nombre.toLowerCase().includes(query));
        }

        // 2. Filtros Combinados (Precio Mínimo y Máximo)
        if (this.filtros.minPrice !== null && this.filtros.minPrice !== '') {
            parts = parts.filter(p => p.precio >= Number(this.filtros.minPrice));
        }
        if (this.filtros.maxPrice !== null && this.filtros.maxPrice !== '') {
            parts = parts.filter(p => p.precio <= Number(this.filtros.maxPrice));
        }

        // 3. Ordenamiento
        if (this.filtros.sort === 'price-asc') parts.sort((a, b) => a.precio - b.precio);
        if (this.filtros.sort === 'price-desc') parts.sort((a, b) => b.precio - a.precio);
        if (this.filtros.sort === 'name-asc') parts.sort((a, b) => a.nombre.localeCompare(b.nombre));

        return parts;
    },
        
        // Lógica para generar CSV
    generateCSV() {
        const headers = ['Nombre', 'Correo', 'CPU', 'GPU', 'RAM', 'Almacenamiento', 'Precio Total'];
        const rows = this.savedCotizaciones.map(cot => [
            cot.nombre,
            cot.correo,
            cot.build.cpu ? cot.build.cpu.nombre : '-',
            cot.build.gpu ? cot.build.gpu.nombre : '-',
            cot.build.ram ? cot.build.ram.nombre : '-',
            cot.build.storage ? cot.build.storage.nombre : '-',
            cot.total
        ]);
        
        // Armar el texto con comas y saltos de línea
        return [
            headers.join(','),
            ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
        ].join('\n');

    },
    



    getPartsByCategory(category) { 
        return this.inventory[category] || []; 
    },

    addPartToBuild(category, partId) {
        const part = this.inventory[category].find(p => p.id === partId);
        if (part) this.currentBuild[category] = part;
    },

    getBuild() { 
        return this.currentBuild; 
    },

    getTotalPrice() {
        return Object.values(this.currentBuild).reduce((acc, part) => part ? acc + part.precio : acc, 0);
    },

    saveCotizacion(nombre, correo) {
        const buildSnapshot = { ...this.currentBuild }; 
        const total = this.getTotalPrice();

        this.savedCotizaciones.push({ nombre, correo, build: buildSnapshot, total });
        this.currentBuild = { cpu: null, gpu: null, ram: null, storage: null };

        localStorage.setItem("pedidos_tienda", JSON.stringify(this.savedCotizaciones));
    },

    getSavedCotizaciones() { 
        return this.savedCotizaciones; 
    }

    
};


// ==========================================
// MÓDULO DE CONTACTO (Envío de correos)
// ==========================================
const formContacto = document.getElementById('form-contacto');
const mensajeExito = document.getElementById('mensaje-exito');

if (formContacto) {
    formContacto.addEventListener('submit', async (e) => {
        e.preventDefault(); // Evita que la página se recargue

        // Recolectar los datos
        const nombre = document.getElementById('contacto-nombre').value;
        const correo = document.getElementById('contacto-correo').value;

        // Mostrar mensaje de "Enviando..."
        mensajeExito.textContent = "Enviando mensaje...";
        mensajeExito.classList.remove('oculto');
        mensajeExito.style.color = "blue"; 

        try {
            const respuesta = await fetch('https://formspree.io/f/xnpdpenw', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 
                    nombre: nombre, 
                    correo: correo,
                    asunto: "Nuevo cliente interesado desde la Tienda"
                })
            });

            if (respuesta.ok) {
                // Éxito
                mensajeExito.textContent = "¡Mensaje enviado correctamente! Te contactaremos pronto.";
                mensajeExito.style.color = "var(--color-exito, green)";
                formContacto.reset(); // Limpiar el formulario
            } else {
                // Error del servidor
                mensajeExito.textContent = "Hubo un problema al enviar el mensaje. Intenta de nuevo.";
                mensajeExito.style.color = "red";
            }
        } catch (error) {
            // Error de conexión
            mensajeExito.textContent = "Error de red. Verifica tu conexión.";
            mensajeExito.style.color = "red";
        }
        
        // Ocultar el mensaje después de 5 segundos
        setTimeout(() => {
            mensajeExito.classList.add('oculto');
        }, 5000);
    });
}
