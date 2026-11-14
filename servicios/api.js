const CLIENT_ID = 'p39i8lbo9nxk4bdv04b9vpyz6ad5pw'; // Pegalo aquí
const TOKEN = 'vtkc6jcx172j5s2g1e1b6jw0r5r3ys';         // Pegalo aquí
// El proxy evita el error de CORS en el navegador
const PROXY_URL = 'https://corsproxy.io/';
const IGDB_URL = encodeURIComponent('https://api.igdb.com/v4/games');

export async function buscarJuegoIGDB(nombreJuego) {
    try {
        const response = await fetch(PROXY_URL + IGDB_URL, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Client-ID': CLIENT_ID,
                'Authorization': Bearer ${TOKEN}
            },
            // Sintaxis Apicalypse de IGDB para pedir nombre y plataforma
            body: search "${nombreJuego}"; fields name, platforms.name, cover.url; limit 5;
        });

        if (!response.ok) throw new Error(Error: ${response.status});
        return await response.json();

    } catch (error) {
        console.error("Error al conectar con IGDB:", error);
        return [];
    }
}
