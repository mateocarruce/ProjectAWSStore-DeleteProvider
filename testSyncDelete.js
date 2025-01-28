const axios = require('axios');

async function testSyncDelete() {
    try {
        const response = await axios.post('http://localhost:5000/sync-delete', {
            id: 9,
        });
        console.log('Respuesta del servidor:', response.data);
    } catch (error) {
        console.error('Error notificando al servidor:', error.message);
    }
}

testSyncDelete();
