const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Provider = sequelize.define('Provider', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
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
    freezeTableName: true, // Evita pluralización del nombre de la tabla
});

module.exports = Provider;
