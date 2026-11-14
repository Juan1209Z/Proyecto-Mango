// 1. Datos y referencias a los elementos de la página.
let inventario = [
    { id: 1, nombre: 'AMD Ryzen 5 5600X', precio: 150, categoria: 'CPU', cantidad: 10, imagen: 'img/cpuamd.jpg' },
    { id: 2, nombre: 'Intel Core i5-12400F', precio: 160, categoria: 'CPU', cantidad: 0, imagen: 'img/cpuintel.jpg' },
    { id: 3, nombre: 'NVIDIA RTX 4060', precio: 300, categoria: 'GPU', cantidad: 5, imagen: 'img/gpunvidia.jpg' },
    { id: 4, nombre: 'AMD Radeon RX 7600', precio: 270, categoria: 'GPU', cantidad: 2, imagen: 'img/gpuamd.jpg' },
    { id: 5, nombre: 'Corsair Vengeance 16GB', precio: 45, categoria: 'RAM', cantidad: 20, imagen: 'img/ram.jpg' },
    { id: 6, nombre: 'Crucial 1TB NVMe', precio: 60, categoria: 'Almacenamiento', cantidad: 8, imagen: 'img/almacenamiento.jpg' }
];

let categoriaActual = 'Todas';
let textoBusqueda = '';

const contenedorTarjetas = document.getElementById('contenedor-tarjetas');
const contenedorFiltros = document.getElementById('contenedor-filtros');
const listaResumen = document.getElementById('lista-resumen');
const cuerpoTabla = document.getElementById('cuerpo-tabla');
const inputBuscador = document.getElementById('input-buscador');
const contadorResultados = document.getElementById('contador-resultados');
const avisoVacio = document.getElementById('aviso-vacio');
const formAgregar = document.getElementById('form-agregar');
const errorAgregar = document.getElementById('error-agregar');
const formContacto = document.getElementById('form-contacto');
const mensajeExito = document.getElementById('mensaje-exito');

// 2. Funciones de ayuda (formato, validación).
function filtrarYBuscar() {
    return inventario.filter(producto => {
        const coincideCategoria = categoriaActual === 'Todas' || producto.categoria === categoriaActual;
        const coincideTexto = producto.nombre.toLowerCase().includes(textoBusqueda.toLowerCase());
        return coincideCategoria && coincideTexto;
    });
}

function validarNuevoProducto(nombre, precio, cantidad) {
    if (nombre === '' || precio === '' || cantidad === '') {
        return 'Todos los campos son obligatorios.';
    }
    if (precio > 10000000) {
    return 'El sistema no admite productos con precios mayores a $10.000.000 COP.';
    }
    const existe = inventario.some(p => p.nombre.toLowerCase() === nombre.toLowerCase());
    if (existe) {
        return 'Ya existe un producto con ese nombre.';
    }
    if (precio > 2000) {
        return 'El sistema no admite productos con precios mayores a $2000 USD.';
    }
    return null; 
}

function actualizarVistas() {
    const datosProcesados = filtrarYBuscar();
    dibujarTarjetas(datosProcesados);
    dibujarResumen();
    dibujarTabla();
}

// 3. Funciones que dibujan en la página.
function dibujarTarjetas(lista) {
    contenedorTarjetas.textContent = '';
    contadorResultados.textContent = `Mostrando ${lista.length} resultados.`;
    
    if (lista.length === 0) {
        avisoVacio.classList.remove('oculto');
    } else {
        avisoVacio.classList.add('oculto');
    }

    lista.forEach(producto => {
        const tarjeta = document.createElement('article');
        tarjeta.classList.add('tarjeta');
        
        // Estado visual de agotado usando las clases de style.css
        if (producto.cantidad === 0) {
            tarjeta.classList.add('tarjeta--agotada'); 
        }

        const img = document.createElement('img');
        img.src = producto.imagen;
        img.alt = producto.nombre;
        img.classList.add('tarjeta_imagen');

        const titulo = document.createElement('h3');
        titulo.textContent = producto.nombre;
        titulo.classList.add('tarjeta_titulo');

        const info = document.createElement('p');
        info.textContent = `$${producto.precio} COP | Stock: ${producto.cantidad}`;
        info.classList.add('tarjeta_precio');

        const avisoAgotado = document.createElement('span');
        if (producto.cantidad === 0) {
            avisoAgotado.textContent = '¡Agotado!';
            avisoAgotado.classList.add('tarjeta_aviso');
        }

        const btnEliminar = document.createElement('button');
        btnEliminar.textContent = 'Eliminar';
        btnEliminar.classList.add('boton', 'boton--peligro');
        btnEliminar.dataset.id = producto.id;

        tarjeta.appendChild(img);
        tarjeta.appendChild(titulo);
        tarjeta.appendChild(info);
        if (producto.cantidad === 0) { tarjeta.appendChild(avisoAgotado); }
        tarjeta.appendChild(btnEliminar);

        contenedorTarjetas.appendChild(tarjeta);
    });
}

function dibujarFiltros() {
    contenedorFiltros.textContent = '';
    const categorias = ['Todas', 'CPU', 'GPU', 'RAM', 'Almacenamiento'];
    
    categorias.forEach(cat => {
        const btn = document.createElement('button');
        btn.textContent = cat;
        
        // Usa los botones base de mango.css 
        if (cat === categoriaActual) {
            btn.classList.add('boton'); 
        } else {
            btn.classList.add('boton', 'boton--secundario'); 
        }
        
        btn.addEventListener('click', () => {
            categoriaActual = cat;
            dibujarFiltros(); 
            actualizarVistas();
        });
        
        contenedorFiltros.appendChild(btn);
    });
}

function dibujarResumen() {
    listaResumen.textContent = '';
    
    const totalProductos = inventario.length;
    const productosAgotados = inventario.filter(p => p.cantidad === 0).length;
    const valorInventario = inventario.reduce((acumulador, p) => acumulador + (p.precio * p.cantidad), 0);

    const liTotal = document.createElement('li');
    liTotal.textContent = `Total de componentes: ${totalProductos}`;
    
    const liAgotados = document.createElement('li');
    liAgotados.textContent = `Agotados: ${productosAgotados}`;
    
    const liValor = document.createElement('li');
    liValor.textContent = `Valor de inventario: $${valorInventario} COP`;

    listaResumen.appendChild(liTotal);
    listaResumen.appendChild(liAgotados);
    listaResumen.appendChild(liValor);
}

function dibujarTabla() {
    cuerpoTabla.textContent = '';
    inventario.forEach(producto => {
        const fila = document.createElement('tr');
        
        const tdId = document.createElement('td');
        tdId.textContent = producto.id;
        
        const tdNombre = document.createElement('td');
        tdNombre.textContent = producto.nombre;
        
        const tdCat = document.createElement('td');
        tdCat.textContent = producto.categoria;
        
        const tdPrecio = document.createElement('td');
        tdPrecio.textContent = `$${producto.precio}`;
        
        const tdStock = document.createElement('td');
        tdStock.textContent = producto.cantidad;

        fila.appendChild(tdId);
        fila.appendChild(tdNombre);
        fila.appendChild(tdCat);
        fila.appendChild(tdPrecio);
        fila.appendChild(tdStock);
        
        cuerpoTabla.appendChild(fila);
    });
}

// 4. Eventos.
inputBuscador.addEventListener('input', (evento) => {
    textoBusqueda = evento.target.value;
    actualizarVistas();
});

formAgregar.addEventListener('submit', (evento) => {
    evento.preventDefault();
    errorAgregar.textContent = '';

    const nombre = document.getElementById('nombre-item').value.trim();
    const precio = Number(document.getElementById('precio-item').value);
    const categoria = document.getElementById('cat-item').value;
    const cantidad = Number(document.getElementById('cant-item').value);

    const error = validarNuevoProducto(nombre, precio, cantidad);
    
    if (error) {
        errorAgregar.textContent = error;
        return; 
    }

    const nuevoId = inventario.length > 0 ? Math.max(...inventario.map(p => p.id)) + 1 : 1;
    
    inventario.push({
        id: nuevoId,
        nombre: nombre,
        precio: precio,
        categoria: categoria,
        cantidad: cantidad,
        imagen: 'img/default.jpg' // Asegúrate de tener esta imagen en tu carpeta
    });

    formAgregar.reset();
    actualizarVistas();
});

contenedorTarjetas.addEventListener('click', (evento) => {
    if (evento.target.tagName === 'BUTTON') {
        const idEliminar = Number(evento.target.dataset.id);
        const confirmar = confirm('¿Estás seguro de que deseas eliminar este componente?');
        
        if (confirmar) {
            inventario = inventario.filter(p => p.id !== idEliminar);
            actualizarVistas();
        }
    }
});

formContacto.addEventListener('submit', (evento) => {
    evento.preventDefault();
    const nombreContacto = document.getElementById('contacto-nombre').value;
    
    mensajeExito.textContent = `¡Gracias por contactarnos, ${nombreContacto}! Tu mensaje fue enviado correctamente.`;
    mensajeExito.classList.remove('oculto');
    
    formContacto.reset();
    
    setTimeout(() => {
        mensajeExito.classList.add('oculto');
    }, 4000);
});

// 5. Arranque con DOMContentLoaded.
document.addEventListener('DOMContentLoaded', () => {
    dibujarFiltros();
    actualizarVistas();
});

