// ==========================================
// 1. MODELO
// ==========================================
class PCModel {
    constructor() {
        this.inventory = {
            cpu: [{ id: 'c1', name: 'AMD Ryzen 5 5600X', price: 150 }, { id: 'c2', name: 'Intel Core i5-12400F', price: 160 }],
            gpu: [{ id: 'g1', name: 'NVIDIA RTX 4060', price: 300 }, { id: 'g2', name: 'AMD Radeon RX 7600', price: 270 }],
            ram: [{ id: 'r1', name: 'Corsair Vengeance 16GB', price: 45 }, { id: 'r2', name: 'G.Skill 32GB', price: 110 }],
            storage: [{ id: 's1', name: 'Crucial 1TB NVMe', price: 60 }, { id: 's2', name: 'Samsung 2TB', price: 170 }]
        };

        this.currentBuild = { cpu: null, gpu: null, ram: null, storage: null };
        this.savedCotizaciones = [];
    }

    getPartsByCategory(category) { return this.inventory[category] || []; }

    addPartToBuild(category, partId) {
        const part = this.inventory[category].find(p => p.id === partId);
        if (part) this.currentBuild[category] = part;
    }

    getBuild() { return this.currentBuild; }

    getTotalPrice() {
        return Object.values(this.currentBuild).reduce((acc, part) => part ? acc + part.price : acc, 0);
    }

    // Actualizado: Recibe nombre y correo
    saveCotizacion(nombre, correo) {
        const buildSnapshot = { ...this.currentBuild }; 
        const total = this.getTotalPrice();

        this.savedCotizaciones.push({ nombre, correo, build: buildSnapshot, total });
        
        this.currentBuild = { cpu: null, gpu: null, ram: null, storage: null };
    }

    getSavedCotizaciones() { return this.savedCotizaciones; }
}

// ==========================================
// 2. VISTA
// ==========================================
class PCView {
    constructor() {
        this.partsList = document.getElementById('parts-list');
        this.buildList = document.getElementById('build-list');
        this.totalPrice = document.getElementById('total-price');
        this.categoryButtons = document.querySelectorAll('#category-selector button');
        
        // Elementos del formulario y tabla actualizados
        this.form = document.getElementById('form-aspirante');
        this.nombre = document.getElementById('nombre');
        this.correo = document.getElementById('correo'); // Ahora es correo
        this.cuerpoTabla = document.getElementById('cuerpo-tabla');
    }

    limpiar() {
        this.form.reset();
    }

    renderAvailableParts(parts, category) {
        this.partsList.innerHTML = ''; 
        parts.forEach(part => {
            const card = document.createElement('div');
            card.className = 'part-card';
            card.innerHTML = `
                <h3>${part.name}</h3><p>$${part.price}</p>
                <button class="add-btn" data-category="${category}" data-id="${part.id}">Seleccionar</button>
            `;
            this.partsList.appendChild(card);
        });
    }

    renderBuildSummary(build, total) {
        this.buildList.innerHTML = '';
        const names = { cpu: 'Procesador', gpu: 'Gráfica', ram: 'Memoria RAM', storage: 'Disco' };
        for (const key in build) {
            const li = document.createElement('li');
            li.innerHTML = build[key] 
                ? `<strong>${names[key]}:</strong> <span>${build[key].name} ($${build[key].price})</span>`
                : `<strong>${names[key]}:</strong> <span style="color: #999;">Falta seleccionar</span>`;
            this.buildList.appendChild(li);
        }
        this.totalPrice.textContent = total;
    }

    // Actualizado: Rellena columnas independientes
    renderTable(cotizaciones) {
        this.cuerpoTabla.innerHTML = '';
        cotizaciones.forEach(cot => {
            const tr = document.createElement('tr');
            
            // Extraer nombres de componentes o poner un guion si no se seleccionó
            const cpuName = cot.build.cpu ? cot.build.cpu.name : '-';
            const gpuName = cot.build.gpu ? cot.build.gpu.name : '-';
            const ramName = cot.build.ram ? cot.build.ram.name : '-';
            const storageName = cot.build.storage ? cot.build.storage.name : '-';

            tr.innerHTML = `
                <td>${cot.nombre}</td>
                <td>${cot.correo}</td>
                <td><small>${cpuName}</small></td>
                <td><small>${gpuName}</small></td>
                <td><small>${ramName}</small></td>
                <td><small>${storageName}</small></td>
                <td><strong>$${cot.total}</strong></td>
            `;
            this.cuerpoTabla.appendChild(tr);
        });
    }

    bindCategoryChange(handler) {
        this.categoryButtons.forEach(button => button.addEventListener('click', (e) => handler(e.target.dataset.category)));
    }

    bindAddPart(handler) {
        this.partsList.addEventListener('click', (e) => {
            if (e.target.className === 'add-btn') handler(e.target.dataset.category, e.target.dataset.id);
        });
    }

    bindSaveForm(handler) {
        this.form.addEventListener('submit', (e) => {
            e.preventDefault(); 
            // Pasa nombre y correo al controlador
            handler(this.nombre.value, this.correo.value);
        });
    }
}

// ==========================================
// 3. CONTROLADOR
// ==========================================
class PCController {
    constructor(model, view) {
        this.model = model;
        this.view = view;

        this.view.bindCategoryChange(this.handleCategoryChange.bind(this));
        this.view.bindAddPart(this.handleAddPart.bind(this));
        this.view.bindSaveForm(this.handleSaveForm.bind(this));

        this.handleCategoryChange('cpu');
        this.updateBuildView();
    }

    handleCategoryChange(category) {
        this.view.renderAvailableParts(this.model.getPartsByCategory(category), category);
    }

    handleAddPart(category, partId) {
        this.model.addPartToBuild(category, partId);
        this.updateBuildView();
    }

    // Actualizado: Recibe nombre y correo
    handleSaveForm(nombre, correo) {
        this.model.saveCotizacion(nombre, correo);
        this.view.renderTable(this.model.getSavedCotizaciones());
        this.view.limpiar();
        this.updateBuildView();
    }

    updateBuildView() {
        this.view.renderBuildSummary(this.model.getBuild(), this.model.getTotalPrice());
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const app = new PCController(new PCModel(), new PCView());
});