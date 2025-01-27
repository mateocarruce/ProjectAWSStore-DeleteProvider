const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Provider = sequelize.define('Provider', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    address: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isEmail: true,
        },
    },
}, {
    freezeTableName: true, // Evita que Sequelize pluralice el nombre de la tabla
});

module.exports = Provider;
