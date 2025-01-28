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

// Endpoint para sincronización de proveedores
app.post('/sync-provider', async (req, res) => {
    const { id, name, address, email } = req.body;

    try {
        // Verifica si el proveedor ya existe
        const existingProvider = await Provider.findByPk(id);
        if (!existingProvider) {
            await Provider.create({ id, name, address, email });
            console.log(`Proveedor con ID ${id} sincronizado localmente`);
        }

        res.status(200).send({ message: `Proveedor con ID ${id} sincronizado exitosamente` });
    } catch (error) {
        console.error('Error sincronizando proveedor:', error);
        res.status(500).send({ error: 'Failed to sync provider' });
    }
});

// Iniciar ambos servidores (GraphQL y REST)
sequelize.sync().then(() => {
    // Inicia Apollo Server
    server.listen({ port: 4001 }).then(({ url }) => {
        console.log(`🚀 GraphQL server ready at ${url}`);
    });

    // Inicia Express Server
    app.listen(5001, () => {
        console.log('REST server listening on port 5001');
    });
});
