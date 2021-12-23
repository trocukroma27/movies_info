// const mysql = require('mysql2')
const dotenv = require('dotenv');
const { Sequelize } = require('sequelize');

dotenv.config();

const db = new Sequelize(`${process.env.DB}`, `${process.env.DB_USER}`, `${process.env.DB_PASSWORD}`, {
    host: `${process.env.DB_HOST}`,
    dialect: `${process.env.DIALECT}`,
    define: {
        timestamps: false
    }
});

module.exports = db;
