const WORKER_URL = 'https://igdb-api.juanjomoreno1209.workers.dev/';

export async function buscarJuegoIGDB(nombreJuego) {
    try {
        const response = await fetch(WORKER_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'text/plain'
            },
            body: 'search "' + nombreJuego + '"; fields name, platforms.name, cover.url, rating; limit 8;'
        });

        if (!response.ok) {
            const detalle = await response.text();
            throw new Error('Estado ' + response.status + ': ' + detalle);
        }

        return await response.json();
    } catch (error) {
        console.error('Error al conectar con IGDB:', error);
        throw error;
    }
}
