/*/const axios = require('axios');
const Provider = require('./models/provider');

const resolvers = {
    Mutation: {
        deleteProvider: async (_, { id }) => {
            try {
                // Verifica si el proveedor existe
                const provider = await Provider.findByPk(id);
                if (!provider) {
                    throw new Error('Provider not found');
                }

                // Elimina el proveedor de la base de datos
                await provider.destroy();

                console.log(`Provider with ID ${id} deleted locally`);

                // Notifica a otras instancias para sincronización
                const instances = [
                    'http://<98.84.155.123>:5000/sync-provider', // Cambia la IP
                ];

                for (const instance of instances) {
                    try {
                        await axios.post(instance, { id });
                        console.log(`Notification sent to ${instance}`);
                    } catch (error) {
                        console.error(`Error notifying ${instance}:`, error.message);
                    }
                }

                return `Provider with ID ${id} deleted`;
            } catch (error) {
                console.error('Error deleting provider:', error);
                throw new Error('Failed to delete provider');
            }
        },
    },
};

module.exports = resolvers;/*/
const axios = require('axios');
const Provider = require('./models/provider');

const resolvers = {
    Mutation: {
        deleteProvider: async (_, { id }) => {
            try {
                // Verifica si el proveedor existe
                const provider = await Provider.findByPk(id);
                if (!provider) {
                    throw new Error(`Provider with ID ${id} not found`);
                }

                // Elimina el proveedor de la base de datos local
                await provider.destroy();
                console.log(`Proveedor con ID ${id} eliminado localmente`);

                // Notifica al microservicio de Crear
                const createServiceURL = 'http://localhost:5000/sync-delete'; // Cambia a la IP correcta
                try {
                    await axios.post(createServiceURL, { id });
                    console.log(`Notificación enviada al microservicio de Crear para eliminar el proveedor con ID ${id}`);
                } catch (error) {
                    console.error(`Error notificando al microservicio de Crear:`, error.message);
                }

                return `Proveedor con ID ${id} eliminado`;
            } catch (error) {
                console.error('Error eliminando proveedor:', error);
                throw new Error('Failed to delete provider');
            }
        },
    },
};

module.exports = resolvers;

