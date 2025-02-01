const fs = require('fs');
const path = require('path');
const { ApolloServer } = require('apollo-server');
const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./database');
const resolvers = require('./resolvers');
const Provider = require('./models/provider');

// Leer el esquema GraphQL
const typeDefs = fs.readFileSync(path.join(__dirname, 'schema.graphql'), 'utf-8');

// Configurar Apollo Server
const server = new ApolloServer({
    typeDefs,
    resolvers,
});

// Configurar Express para el servidor REST
const app = express();
app.use(bodyParser.json());

// ✅ Endpoint para sincronización de proveedores cuando se crean en Crear
app.post('/sync-create', async (req, res) => {
    console.log('Solicitud recibida en /sync-create:', req.body);
    const { id, name, address, email } = req.body;

    try {
        const existingProvider = await Provider.findByPk(id);
        if (!existingProvider) {
            await Provider.create({ id, name, address, email });
            console.log(`Proveedor con ID ${id} sincronizado en la base de Eliminar`);
        } else {
            console.log(`Proveedor con ID ${id} ya existe en la base de Eliminar`);
        }

        res.status(200).send({ message: `Proveedor con ID ${id} sincronizado correctamente en Eliminar` });
    } catch (error) {
        console.error('Error sincronizando proveedor en Eliminar:', error);
        res.status(500).send({ error: 'Failed to sync provider creation' });
    }
});

// ✅ Endpoint para sincronizar actualizaciones desde el microservicio de Update
app.post('/sync-update', async (req, res) => {
    console.log('Solicitud recibida en /sync-update:', req.body);
    const { id, name, address, email } = req.body;

    try {
        const provider = await Provider.findByPk(id);
        if (provider) {
            await provider.update({ name, address, email });
            console.log(`Proveedor con ID ${id} actualizado en la base de Eliminar`);
        } else {
            console.log(`Proveedor con ID ${id} no encontrado en la base de Eliminar`);
        }

        res.status(200).send({ message: `Proveedor con ID ${id} actualizado correctamente en Eliminar` });
    } catch (error) {
        console.error('Error sincronizando actualización de proveedor en Eliminar:', error);
        res.status(500).send({ error: 'Failed to sync provider update' });
    }
});

// ✅ Endpoint para recibir la eliminación de un proveedor desde otro microservicio
app.post('/sync-delete', async (req, res) => {
    console.log('Solicitud recibida en /sync-delete:', req.body);
    const { id } = req.body;

    try {
        const provider = await Provider.findByPk(id);
        if (provider) {
            await provider.destroy();
            console.log(`Proveedor con ID ${id} eliminado en la base de Eliminar`);
        } else {
            console.log(`Proveedor con ID ${id} no encontrado en la base de Eliminar`);
        }

        res.status(200).send({ message: `Proveedor con ID ${id} eliminado correctamente en Eliminar` });
    } catch (error) {
        console.error('Error eliminando proveedor en Eliminar:', error);
        res.status(500).send({ error: 'Failed to sync provider delete' });
    }
});

// 🔹 Sincronizar base de datos y luego iniciar los servidores
sequelize.sync().then(() => {
    console.log('Database synced successfully!');

    // Inicia Apollo Server (GraphQL)
    server.listen({ port: 4001 }).then(({ url }) => {
        console.log(`🚀 GraphQL server ready at ${url}`);
    });

    // Inicia Express Server (REST)
    const PORT = process.env.PORT || 5001;
    app.listen(PORT, () => {
        console.log(`REST server listening on port ${PORT}`);
    });
}).catch(err => {
    console.error('Error syncing database:', err);
});
