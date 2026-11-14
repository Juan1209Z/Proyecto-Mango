const API_URL = 'https://mockend.com/api/juan1209z/Proyecto-Mango/guias';

export async function obtenerGuias() {
    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error(Error en el servidor: ${response.status});
        }

        return await response.json();
    } catch (error) {
        console.error("Error al conectar con Mockend:", error);
        throw new Error("No pudimos cargar las guías. Verifica tu conexión e intenta de nuevo.");
    }
}
