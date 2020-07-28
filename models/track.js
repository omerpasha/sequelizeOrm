const sequelize=require('../database/sequelize');

const Sequelize=require('sequelize');

module.exports=sequelize.define('track',{
    id:{
        field:'TrackId',
        type:Sequelize.INTEGER,
        primaryKey:true
    },
    title:{
        field:'Name',
        type:Sequelize.STRING
    }
},
    {
            timestamps:false
    
});