let { DataTypes } = require('sequelize')
let db = require('./database')

// Worker db Module
let Worker = db.define('Worker', {
    id : {
        type: DataTypes.UUIDV4,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
    },
    fullName: {
        type: DataTypes.STRING
    },
    department: {
        type: DataTypes.STRING
    },
    bio: {
        type: DataTypes.STRING
    }
}, {
    tableName: 'Workers'
})

// Module Exporting as "Worker"
module.exports = Worker