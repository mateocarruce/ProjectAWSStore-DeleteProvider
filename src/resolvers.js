const axios = require('axios');
const Provider = require('./models/provider');

const resolvers = {
    Mutation: {
        deleteProvider: async (_, { id }) => {
            try {
                const provider = await Provider.findByPk(id);
                if (!provider) {
                    throw new Error(`Provider with ID ${id} not found`);
                }

                await provider.destroy();
                console.log(`✅ Proveedor con ID ${id} eliminado en la base de Eliminar`);

                // ✅ Notificar a los otros microservicios (Crear, Editar y Leer)
                const instances = [
                    'http://localhost:5000/sync-delete', // Microservicio de Crear
                    'http://localhost:5002/sync-delete', // Microservicio de Editar
                    'http://localhost:5003/sync-delete'  // ✅ Microservicio de Leer
                ];

                for (const instance of instances) {
                    try {
                        const response = await axios.post(instance, { id });
                        console.log(`✅ Notificación enviada a ${instance}:`, response.data);
                    } catch (error) {
                        console.error(`❌ Error notificando a ${instance}:`, error.message);
                    }
                }

                return `Proveedor con ID ${id} eliminado`;
            } catch (error) {
                console.error('❌ Error eliminando proveedor:', error);
                throw new Error('Failed to delete provider');
            }
        },
    },
};

module.exports = resolvers;
