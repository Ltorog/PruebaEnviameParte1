const fetch = require('node-fetch');
const { Client } = require('pg');

const inputBody = require('./input.json');


const conexionDb = async () => {
    try {
        const client = new Client({
            user: 'postgres',
            host: '127.0.0.1',
            database: 'enviamedb',
            password: '1234',
            port: 5432,
          });
        await client.connect();

        return client;
    }
    catch (err) {
        //TODO: mejora usar log
        console.log(err);
        return null;
    }
};


const insertDb = async (client, data) => {
    try {
        const sql = 'INSERT INTO datos_envios(data_query) VALUES ($1)';
        const values = [JSON.stringify(data)];

        const res = await client.query(sql, values);
        return res;
    }
    catch (err) {
        //TODO: Cambiar por log
        console.error(err);
        return null;
    }  
};

const main = async () => {
    
    const client = await conexionDb();
    if (client === null) {
        console.error("No se pudo conectar con la base de datos");
        return;
    }

    try {
        const response = await fetch('https://stage.api.enviame.io/api/s2/v2/companies/620/deliveries', {
            method: 'POST',
            body: JSON.stringify(inputBody),
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'api-key': '798171c39baf6fd212aaacacc5793b8e'
            }
        });
        const json = await response.json();
        console.log(JSON.stringify(json));

        const responseInsert = await insertDb(client, json);
        if (responseInsert === null){
            //TODO: Cambiar por log
            console.error("Error al insertar json");
        }
        console.log("Programa ejecutado con éxito, revisar DB");
    }
    catch (err) {
        console.error("Hubo un problema en la petición: "+err);
    }
    finally {
        //Siempre se cierra la conexión
        await client.end();
    }
};


main();