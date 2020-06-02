# Parte 1 - Prueba Envíame

Usar base de datos con docker
* docker run --name enviame-postgres -e POSTGRES_PASSWORD=1234 -d postgres

Crear base de datos
```sql
CREATE DATABASE enviamedb;

CREATE TABLE enviamedb.datos_envios (
	ID serial NOT NULL PRIMARY KEY,
	data_query json NOT NULL
);
```

Iniciar proyecto
* npm install
* npm start