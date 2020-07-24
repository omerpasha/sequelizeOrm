//const { Sequelize } = require("sequelize/types");

const Sequelize=require('sequelize');
module.exports=new Sequelize('sqlite:chinook.db');