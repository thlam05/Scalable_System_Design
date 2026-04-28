import knex from 'knex';
import dotenv from 'dotenv/config';

const masterDB = knex({
    client: "pg",
    connection: {
        host: process.env.NODE_ENV === 'local' ? 'localhost' : process.env.MASTER_DB_HOST,
        port: Number(process.env.MASTER_DB_PORT),
        user: process.env.MASTER_DB_USER,
        password: process.env.MASTER_DB_PASSWORD,
        database: process.env.MASTER_DB_DATABASE
    }
})

const slaveDB = knex({
    client: "pg",
    connection: {
        host: process.env.NODE_ENV === 'local' ? 'localhost' : process.env.SLAVE_DB_HOST,
        port: Number(process.env.SLAVE_DB_PORT),
        user: process.env.SLAVE_DB_USER,
        password: process.env.SLAVE_DB_PASSWORD,
        database: process.env.SLAVE_DB_DATABASE
    }
})

export { masterDB, slaveDB };