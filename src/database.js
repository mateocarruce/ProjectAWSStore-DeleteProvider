const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('ProviderDB', 'erick', 'Password@123', {
    host: '18.232.175.191', // Cambia esto por la IP pública de esta instancia EC2
    dialect: 'mysql',
    logging: false,
});

sequelize.authenticate()
    .then(() => console.log('Database connected successfully!'))
    .catch(err => console.error('Error connecting to the database:', err));

module.exports = sequelize;
