const axios = require('axios');
const Provider = require('./models/provider');

const resolvers = {
    Mutation: {
        deleteProvider: async (_, { id }) => {
            try {
                // Verifica si el proveedor existe en la base de datos local
                const provider = await Provider.findByPk(id);
                if (!provider) {
                    throw new Error(`Provider with ID ${id} not found`);
                }

                // Elimina el proveedor de la base de datos local
                await provider.destroy();
                console.log(`Proveedor con ID ${id} eliminado localmente en Eliminar`);

                // ✅ Notificar a los otros microservicios (Crear y Editar)
                const instances = [
                    'http://localhost:5000/sync-delete', // Microservicio de Crear
                    'http://localhost:5002/sync-delete'  // Microservicio de Editar
                ];

                for (const instance of instances) {
                    try {
                        await axios.post(instance, { id });
                        console.log(`Notificación enviada a ${instance} para sincronizar eliminación`);
                    } catch (error) {
                        console.error(`Error notificando a ${instance}:`, error.message);
                    }
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
