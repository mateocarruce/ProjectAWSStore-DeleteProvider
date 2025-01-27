const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('ProveedorDB', 'user', 'password', {
    host: '3.80.113.165', // Cambia por la IP pública de tu instancia MySQL
    dialect: 'mysql',
    logging: false,
});

sequelize.authenticate()
    .then(() => console.log('Database connected successfully!'))
    .catch(err => console.error('Error connecting to the database:', err));

module.exports = sequelize;
