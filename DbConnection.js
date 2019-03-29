const pg = require('pg')

const connection = pg.Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'Hrm',
    password: 'abcd1234',
    port: 5432,
})
connection.connect()

module.exports = connection;