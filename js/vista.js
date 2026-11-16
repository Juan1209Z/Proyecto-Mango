// ===================== CAPA DE PRESENTACIÓN =====================
// Dibuja y lee el HTML.

const Vista = {
  pesos: new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }),


  
pintarTabla(productos) {
    const cuerpo = document.querySelector("#cuerpo");
    cuerpo.replaceChildren();
    productos.forEach((p) => {
      const fila = document.createElement("tr");
      
      [p.id, p.nombre, p.categoria, this.pesos.format(p.precio), p.cantidad].forEach((valor) => {
        const celda = document.createElement("td");
        celda.textContent = valor;
        fila.append(celda);
      });
      
      const acciones = document.createElement("td");
      acciones.append(this.boton("Editar", "editar", p.id), this.boton("Eliminar", "eliminar", p.id));
      fila.append(acciones);
      cuerpo.append(fila);
    });
  },

boton(texto, accion, id) {
    const b = document.createElement("button");
    b.type = "button";
    b.textContent = texto;
    b.dataset.accion = accion;
    b.dataset.id = id;
    
    // Asignar las clases CSS según el tipo de botón
    if (accion === "editar") {
      b.className = "boton boton--secundario";
      b.style.marginRight = "8px"; // Da una pequeña separación entre ambos botones
    } else if (accion === "eliminar") {
      b.className = "boton boton--peligro";
    }

    return b;
  },

  pintarResumen(cantidad, valor) {
    document.querySelector("#resumen").textContent =
      `${cantidad} productos · Valor del inventario: ${this.pesos.format(valor)}`;
  },

  leerFormulario() {
    return {
      nombre: document.querySelector("#nombre").value,
      categoria: document.querySelector("#categoria").value, 
      precio: Number(document.querySelector("#precio").value),
      stock: Number(document.querySelector("#stock").value)
    };
  },

llenarFormulario(p) {
    document.querySelector("#id").value = p.id;
    document.querySelector("#nombre").value = p.nombre;
    document.querySelector("#categoria").value = p.categoria;
    document.querySelector("#precio").value = p.precio;
    document.querySelector("#stock").value = p.cantidad;
    document.querySelector("#guardar").textContent = "Guardar cambios";
    document.querySelector("#cancelar").hidden = false;
  },

  limpiarFormulario() {
    document.querySelector("#formulario").reset();
    document.querySelector("#guardar").textContent = "Agregar";
    document.querySelector("#cancelar").hidden = true;
  },

  mostrarMensaje(texto, tipo) {
    const m = document.querySelector("#mensaje");
    m.textContent = texto;
    m.className = `mensaje--${tipo}`;
  }


};

 const VistaAuth = {
    cambiarPanel(idVisible) {
        document.getElementById("panel-seleccion").classList.add("oculto");
        document.getElementById("panel-login").classList.add("oculto");
        document.getElementById("panel-registro").classList.add("oculto");
        
        document.getElementById(idVisible).classList.remove("oculto");
    },

    mostrarError(idElemento, mensaje) {
        const el = document.getElementById(idElemento);
        el.textContent = mensaje;
        el.classList.remove("oculto");
    },

    mostrarExito(idElemento, mensaje) {
        const el = document.getElementById(idElemento);
        el.textContent = mensaje;
        el.classList.remove("oculto");
    },

    limpiarFormularios() {
        document.getElementById("form-login").reset();
        document.getElementById("form-registro").reset();
        document.getElementById("msg-login").textContent = "";
        document.getElementById("msg-registro").textContent = "";
        document.getElementById("msg-registro-exito").classList.add("oculto");
    }

      
};

// ===================== VISTA DE LA TIENDA =====================
const VistaTienda = {
    iniciar() {
        this.partsList = document.getElementById('parts-list');
        this.buildList = document.getElementById('build-list');
        this.totalPrice = document.getElementById('total-price');
        this.categoryButtons = document.querySelectorAll('#category-selector button');
        this.form = document.getElementById('form-aspirante');
        this.nombre = document.getElementById('nombre');
        this.correo = document.getElementById('correo');
        this.cuerpoTabla = document.getElementById('cuerpo-tabla');
        this.searchInput = document.getElementById('comp-search');
        this.minPriceInput = document.getElementById('comp-min-price');
        this.maxPriceInput = document.getElementById('comp-max-price');
        this.sortSelect = document.getElementById('comp-sort');
        this.btnExportCSV = document.getElementById('btn-export-csv');
    },

    // Detectar cambios en los filtros y búsqueda 
    bindFiltros(handler) {
        const trigger = () => {
            handler({
                search: this.searchInput.value,
                minPrice: this.minPriceInput.value,
                maxPrice: this.maxPriceInput.value,
                sort: this.sortSelect.value
            });
        };
        this.searchInput.addEventListener('input', trigger);
        this.minPriceInput.addEventListener('input', trigger);
        this.maxPriceInput.addEventListener('input', trigger);
        this.sortSelect.addEventListener('change', trigger);
    },

    // Detectar clicks de Paginación
    bindPagination(handler) {
        this.btnPrev.addEventListener('click', () => handler(-1));
        this.btnNext.addEventListener('click', () => handler(1));
    },

    // Detectar click en Exportar
    bindExportCSV(handler) {
        if(this.btnExportCSV) {
            this.btnExportCSV.addEventListener('click', () => handler());
        }
    },

    // Ejecutar la descarga del archivo CSV
    downloadCSV(csvContent, filename) {
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    },

    limpiar() {
        this.form.reset();
    },

    renderAvailableParts(parts, category) { 
        this.partsList.innerHTML = ''; 
        parts.forEach(part => {
            const card = document.createElement('div');
            card.className = 'part-card';
            card.innerHTML = `
                <img src="img/${part.imagen || 'default.jpg'}" alt="${part.nombre}" style="max-width: 100%; height: 300px; object-fit: contain; margin-bottom: 10px;">
                <h3>${part.nombre}</h3>
                <p>${Vista.pesos.format(part.precio)}</p>
                <button class="add-btn" data-category="${category}" data-id="${part.id}">Seleccionar</button>
            `;
            this.partsList.appendChild(card);
        });
    },

    renderBuildSummary(build, total) {
      
        this.buildList.innerHTML = '';
        const names = { cpu: 'Procesador', gpu: 'Gráfica', ram: 'Memoria RAM', storage: 'Disco' };
        for (const key in build) {
            const li = document.createElement('li');
            li.innerHTML = build[key] 
                ? `<strong>${names[key]}:</strong> <span>${build[key].nombre} (${Vista.pesos.format(build[key].precio)})</span>`
                : `<strong>${names[key]}:</strong> <span style="color: #999;">Falta seleccionar</span>`;
            this.buildList.appendChild(li);
        }
        this.totalPrice.textContent = Vista.pesos.format(total);


    },

    renderTable(cotizaciones) {
        this.cuerpoTabla.innerHTML = '';
        cotizaciones.forEach(cot => {
            const tr = document.createElement('tr');
            
            const cpuName = cot.build.cpu ? cot.build.cpu.nombre : '-';
            const gpuName = cot.build.gpu ? cot.build.gpu.nombre : '-';
            const ramName = cot.build.ram ? cot.build.ram.nombre : '-';
            const storageName = cot.build.storage ? cot.build.storage.nombre : '-';
            tr.innerHTML = `
                <td>${cot.nombre}</td>
                <td>${cot.correo}</td>
                <td><small>${cpuName}</small></td>
                <td><small>${gpuName}</small></td>
                <td><small>${ramName}</small></td>
                <td><small>${storageName}</small></td>
                <td><strong>${Vista.pesos.format(cot.total)}</strong></td>
            `;
            this.cuerpoTabla.appendChild(tr);
        });
    },

    bindCategoryChange(handler) {
        this.categoryButtons.forEach(button => button.addEventListener('click', (e) => handler(e.target.dataset.category)));
    },

    bindAddPart(handler) {
        this.partsList.addEventListener('click', (e) => {
            if (e.target.className === 'add-btn') handler(e.target.dataset.category, e.target.dataset.id);
        });
    },

    bindSaveForm(handler) {
        this.form.addEventListener('submit', (e) => {
            e.preventDefault(); 
            handler(this.nombre.value, this.correo.value);
        });
    }
};

// ===================== VISTA API BUILDCORES =====================
const VistaAPI = {
    pintarComponentes(componentes, categoria) {
        const contenedor = document.getElementById('api-catalogo');
        const estado = document.getElementById('api-estado');
        contenedor.innerHTML = ''; 
        
        if (!componentes || componentes.length === 0) {
            estado.textContent = 'Error al cargar los datos o lista vacía.';
            estado.style.color = 'var(--color-alerta)';
            estado.classList.remove('oculto');
            return;
        }
        
        estado.classList.add('oculto'); 
        
        componentes.slice(0, 12).forEach(comp => {
            const tarjeta = document.createElement('article');
            tarjeta.className = 'tarjeta'; 
            // Generar detalles dinámicos según la categoría
            let detallesHTML = '';
            if (categoria === 'CPUs') {
                detallesHTML = `<li><strong>Núcleos:</strong> ${comp.Core_Count}</li>
                                <li><strong>Hilos:</strong> ${comp.Thread_Count}</li>`;
            } else if (categoria === 'GPUs') {
                detallesHTML = `<li><strong>Memoria:</strong> ${comp.Memory} GB</li>
                                <li><strong>Chipset:</strong> ${comp.Chipset}</li>`;
            } else if (categoria === 'RAM') {
                detallesHTML = `<li><strong>Módulos:</strong> ${comp.Modules}</li>
                                <li><strong>Velocidad:</strong> ${comp.Speed}</li>`;
            } else if (categoria === 'Storage') {
                detallesHTML = `<li><strong>Capacidad:</strong> ${comp.Capacity}</li>
                                <li><strong>Formato:</strong> ${comp.Form_Factor}</li>`;
            }

            tarjeta.innerHTML = `
                <div style="background: var(--color-borde); padding: 15px; border-radius: 4px; text-align: center; font-weight: bold; margin-bottom: 10px; color: var(--color-primario);">
                    ${comp.Manufacturer || 'Genérico'}
                </div>
                <h3 class="tarjeta_titulo" style="font-size: 15px;">${comp.Manufacturer} ${comp.Model}</h3>
                <ul class="tarjeta_lista" style="margin: 10px 0;">
                    ${detallesHTML}
                </ul>
            `;
            contenedor.appendChild(tarjeta);
        });
    },

    actualizarEstiloBotones(categoriaSeleccionada) {
        const botones = document.querySelectorAll('#api-filtros button');
        botones.forEach(btn => {
            if (btn.dataset.categoria === categoriaSeleccionada) {
                btn.className = 'boton';
            } else {
                btn.className = 'boton boton--secundario';
            }
        });
    }
}; 

const VistaGuias = {
    mostrarCargando(cargando) {
        const estado = document.getElementById('estado-busqueda');
        const btnBuscar = document.getElementById('btn-buscar-juego');
        if (cargando) {
            estado.textContent = 'Buscando juegos en el catálogo...';
            estado.style.color = 'var(--color-primario)';
            estado.classList.remove('oculto');
            btnBuscar.disabled = true;
        } else {
            estado.classList.add('oculto');
            btnBuscar.disabled = false;
        }
    },

    mostrarError(mensaje) {
        const estado = document.getElementById('estado-busqueda');
        const contenedor = document.getElementById('resultados-juego');
        contenedor.innerHTML = '';

        estado.textContent = mensaje;
        estado.style.color = 'var(--color-alerta)';
        estado.classList.remove('oculto');
    },

    pintarJuegos(juegosCrudos) {
        const contenedor = document.getElementById('resultados-juego');
        contenedor.innerHTML = '';
        const juegosFormateados = juegosCrudos
            .filter(juego => juego && juego.name)
            .map(juego => ({
                titulo: juego.name,
                imagen: juego.cover
                    ? `https://images.igdb.com/igdb/image/upload/t_cover_big/${juego.cover.url.split('/').pop()}`
                    : 'img/default.jpg',
                plataformas: juego.platforms
                    ? juego.platforms.map(p => p.name).join(', ')
                    : 'No especificadas',
                calificacion: juego.rating
                    ? `${Math.round(juego.rating)} / 100`
                    : 'Sin calificación'
            }));

        if (juegosFormateados.length === 0) {
            contenedor.innerHTML = "<p class='tarjeta_aviso'>No se encontraron juegos con ese nombre.</p>";
            return;
        }

        juegosFormateados.forEach(juego => {
            const tarjeta = document.createElement('article');
            tarjeta.className = 'tarjeta';
            tarjeta.innerHTML = `
                <img src="${juego.imagen}" class="tarjeta_imagen" alt="${juego.titulo}">
                <h3 class="tarjeta_titulo">${juego.titulo}</h3>
                <ul class="tarjeta_lista">
                    <li><strong>Plataformas:</strong> ${juego.plataformas}</li>
                    <li><strong>Puntuación:</strong> ${juego.calificacion}</li>
                </ul>
                <button class="boton boton--secundario" style="margin-top: 10px;">Ver requisitos recomendados</button>
            `;
            contenedor.appendChild(tarjeta);
        });
    }
};
