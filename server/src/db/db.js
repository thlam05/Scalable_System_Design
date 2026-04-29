import knex from 'knex';
import dotenv from 'dotenv/config';

const masterDB = knex({
    client: "pg",
    connection: {
        host: process.env.MASTER_DB_HOST,
        port: Number(process.env.DB_PORT),
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE
    },
    pool: {
        min: 2,
        max: 10
    }
})

const slaveDB = knex({
    client: "pg",
    connection: {
        host: process.env.SLAVE_DB_HOST,
        port: Number(process.env.DB_PORT),
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE
    },
    pool: {
        min: 2,
        max: 10
    }
})

export { masterDB, slaveDB };