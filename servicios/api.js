// servicios/api.js
// Reemplaza con tu usuario y repo de GitHub
const API_URL = 'https://mockend.com/Juan1209Z/Proyecto-Mango/guias';

export async function obtenerGuias() {
    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error(`Error en el servidor: ${response.status}`);
        }

        const data = await response.json();
        return data;
        
    } catch (error) {
        console.error("Error al conectar con Mockend:", error);
        throw new Error("No pudimos cargar las guías. Verifica tu conexión e intenta de nuevo.");
    }
}
