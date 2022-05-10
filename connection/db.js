 //import pg package
const {Pool} = require('pg')

//setup connection pool
const dbPool = new Pool ({
    database : 'db_project',
    port :5432,
    user:'postgres',
    password:'nuraini16'

})

//export dbpool
module.exports = dbPool