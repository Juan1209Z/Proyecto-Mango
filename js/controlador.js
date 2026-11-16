// ===================== CONTROLADOR =====================
// Escucha al usuario, le pide al modelo y le dice a la vista qué pintar.
import { buscarJuegoIGDB } from '../servicios/api.js';
const Controlador = {
  
  idEditando: null,
  
  iniciar() {
    Modelo.cargar();
    this.refrescar();

    document.querySelector("#formulario").addEventListener("submit", (e) => {
      e.preventDefault();
      this.guardar();
    });

    document.querySelector("#cancelar").addEventListener("click", () => this.cancelarEdicion());

    document.querySelector("#cuerpo").addEventListener("click", (e) => {
      const { accion, id } = e.target.dataset;
      if (accion === "editar") this.editar(Number(id));
      if (accion === "eliminar") this.eliminar(Number(id));
    });
  },

guardar() {
    let datos = Vista.leerFormulario();


    const datosProcesados = {
      ...datos,
      precio: Number(datos.precio),
      cantidad: Number(datos.cantidad !== undefined ? datos.cantidad : datos.stock) 
    };

    const errores = Modelo.validar({ id: this.idEditando, ...datosProcesados });
    
    if (errores.length > 0) {
      Vista.mostrarMensaje(errores.join(" \n"), "error");
      return;
    }

    if (this.idEditando === null) {
      Modelo.agregar(datosProcesados); 
      Vista.mostrarMensaje("Producto agregado.", "ok");
    } else {
      Modelo.actualizar(this.idEditando, datosProcesados); 
      Vista.mostrarMensaje("Producto actualizado.", "ok");
    }
    
    this.cancelarEdicion();
    this.refrescar();
  },

  editar(id) {
    this.idEditando = id;
    Vista.llenarFormulario(Modelo.buscarPorId(id));
  },

  cancelarEdicion() {
    this.idEditando = null;
    Vista.limpiarFormulario();
  },

  eliminar(id) {
    const p = Modelo.buscarPorId(id);
    if (confirm(`¿Eliminar "${p.nombre}"?`)) {
      Modelo.eliminar(id);
      if (this.idEditando === id) this.cancelarEdicion();
      Vista.mostrarMensaje("Producto eliminado.", "ok");
      this.refrescar();
    }
  },

  refrescar() {
    Vista.pintarTabla(Modelo.productos);
    Vista.pintarResumen(Modelo.productos.length, Modelo.valorTotal());
  }

  
};

const ControladorAuth = {
    iniciar() {
        // Verificar que estamos en la página de inicio (App initialization)
        if (!document.getElementById("panel-seleccion")) return;

        ModeloAuth.inicializar();

        // 1. Navegación
        document.getElementById("btn-cliente").addEventListener("click", () => window.location.href = "tienda.html");
        
        document.getElementById("btn-admin").addEventListener("click", () => VistaAuth.cambiarPanel("panel-login"));
        
        document.getElementById("btn-ir-registro").addEventListener("click", () => {
            VistaAuth.limpiarFormularios();
            VistaAuth.cambiarPanel("panel-registro");
        });

        document.querySelectorAll(".btn-volver").forEach(btn => {
            btn.addEventListener("click", () => {
                VistaAuth.limpiarFormularios();
                VistaAuth.cambiarPanel("panel-seleccion");
            });
        });

        // 2. Evento Login
        document.getElementById("form-login").addEventListener("submit", (e) => {
            e.preventDefault();
            const user = document.getElementById("login-user").value.trim();
            const pass = document.getElementById("login-pass").value;
            
            if (ModeloAuth.validarCredenciales(user, pass)) {
                window.location.href = "inventario.html";
            } else {
                VistaAuth.mostrarError("msg-login", "Usuario o contraseña incorrectos.");
            }
        });

        // 3. Evento Registro
        document.getElementById("form-registro").addEventListener("submit", (e) => {
            e.preventDefault();
            const user = document.getElementById("reg-user").value.trim();
            const pass = document.getElementById("reg-pass").value;
            const code = document.getElementById("reg-code").value.trim();
            
            // Ocultar mensajes previos
            document.getElementById("msg-registro").textContent = "";
            
            const error = ModeloAuth.validarNuevoRegistro(user, code, pass);
            
            if (error) {
                VistaAuth.mostrarError("msg-registro", error);
                return;
            }

            ModeloAuth.registrarAdmin(user, pass);
            VistaAuth.mostrarExito("msg-registro-exito", "¡Administrador creado con éxito!");
            document.getElementById("form-registro").reset();
            
            setTimeout(() => {
                VistaAuth.cambiarPanel("panel-login");
                VistaAuth.limpiarFormularios();
            }, 1800);
        });
    },


  
};

// ===================== CONTROLADOR DE LA TIENDA =====================
const ControladorTienda = {
    currentCategory: 'cpu', //  rastrear categoría activa

    iniciar() {
        if (!document.getElementById("category-selector")) return;
        VistaTienda.iniciar();

        VistaTienda.bindCategoryChange(this.handleCategoryChange.bind(this));
        VistaTienda.bindAddPart(this.handleAddPart.bind(this));
        VistaTienda.bindSaveForm(this.handleSaveForm.bind(this));

        VistaTienda.bindFiltros(this.handleFiltros.bind(this));
        VistaTienda.bindPagination(this.handlePagination.bind(this));
        VistaTienda.bindExportCSV(this.handleExportCSV.bind(this));

        this.handleCategoryChange('cpu');
        this.updateBuildView();
        VistaTienda.renderTable(ModeloTienda.getSavedCotizaciones());
    },

    handleCategoryChange(category) {
        this.currentCategory = category;
        ModeloTienda.setFiltros({ page: 1 }); // Reinicia paginación al cambiar de tab
        this.refreshParts();
    },

    // Refresca vista pidiendo datos filtrados al Modelo
    refreshParts() {
        const { parts, totalPages, currentPage } = ModeloTienda.getFilteredParts(this.currentCategory);
        VistaTienda.renderAvailableParts(parts, this.currentCategory);
        VistaTienda.renderPagination(currentPage, totalPages);
    },

    // Manejo de Filtros
    handleFiltros(filtrosAplicados) {
        ModeloTienda.setFiltros(filtrosAplicados);
        this.refreshParts();
    },

    // Manejo de Paginación (+1 o -1)
    handlePagination(direccion) {
        const nuevaPagina = ModeloTienda.filtros.page + direccion;
        ModeloTienda.setFiltros({ page: nuevaPagina });
        this.refreshParts();
    },

    // Manejo de Exportación CSV
    handleExportCSV() {
        const csvContent = ModeloTienda.generateCSV();
        VistaTienda.downloadCSV(csvContent, 'Mis_Pedidos_PCBuilder.csv');
    },
    
    handleCategoryChange(category) {
        VistaTienda.renderAvailableParts(ModeloTienda.getPartsByCategory(category), category);
    },

    handleAddPart(category, partId) {
        ModeloTienda.addPartToBuild(category, partId);
        this.updateBuildView();
    },

    handleSaveForm(nombre, correo) {
        ModeloTienda.saveCotizacion(nombre, correo);
        VistaTienda.renderTable(ModeloTienda.getSavedCotizaciones());
        VistaTienda.limpiar();
        this.updateBuildView();
    },

    updateBuildView() {
        VistaTienda.renderBuildSummary(ModeloTienda.getBuild(), ModeloTienda.getTotalPrice());
    }
};


const ControladorGuias = {
    iniciar() {
        const btnBuscar = document.getElementById('btn-buscar-juego');
        const inputJuego = document.getElementById('input-juego');

        if (!btnBuscar) return;

        const ejecutarBusqueda = async () => {
            const busqueda = inputJuego.value.trim();
            if (busqueda.length < 2) {
                VistaGuias.mostrarError('Escribe al menos 2 caracteres para buscar un juego.');
                return;
            }

            VistaGuias.mostrarCargando(true);

            try {
                const resultados = await buscarJuegoIGDB(busqueda);
                VistaGuias.mostrarCargando(false);
                VistaGuias.pintarJuegos(resultados);
            } catch (error) {
                VistaGuias.mostrarCargando(false);
                VistaGuias.mostrarError(
                    'No pudimos obtener los juegos en este momento. Revisa tu conexión a internet o intenta más tarde.'
                );
            }
        };

        btnBuscar.addEventListener('click', ejecutarBusqueda);
        inputJuego.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') ejecutarBusqueda();
        });
    }
};


// ===================== ARRANQUE GLOBAL SEGURO =====================

document.addEventListener("DOMContentLoaded", () => {

  if (document.getElementById("panel-seleccion")) {
        ControladorAuth.iniciar();  // Arranca Inicio
    }
    
    if (document.getElementById("formulario") && document.getElementById("cuerpo")) {
        Controlador.iniciar();      // Arranca Inventario
    }
    
    if (document.getElementById("category-selector")) {
        ControladorTienda.iniciar(); // Arranca Tienda
    }

    if (document.getElementById("api-catalogo")) {
        ControladorAPI.iniciar(); // Arranca Guias
    }
    
    if (document.getElementById("btn-buscar-juego")) {
        ControladorGuias.iniciar(); // Arranca la busqueda de juegos
    }
});
