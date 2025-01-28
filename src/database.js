const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('ProviderDB', 'erick', 'Password@123', {
    host: '54.91.106.29', // Cambia esto por la IP pública de esta instancia EC2
    dialect: 'mysql',
    logging: false,
});

sequelize.authenticate()
    .then(() => console.log('Database connected successfully!'))
    .catch(err => console.error('Error connecting to the database:', err));

module.exports = sequelize;
