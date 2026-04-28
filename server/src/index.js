import express from 'express';
import { masterDB, slaveDB } from './db/db.js';
import dotenv from 'dotenv/config';


const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

async function initializeDatabase() {
    try {
        const exists = await masterDB.schema.hasTable('products');

        if (!exists) {
            await masterDB.schema.createTable('products', (table) => {
                table.increments('id').primary();
                table.string('name').notNullable();
                table.decimal('price', 10, 2).notNullable();
                table.timestamps(true, true);
            });
            console.log("Create table products successfully.");
        } else {
            console.log("Table products has already existed");
        }
    } catch (error) {
        console.error("Create table error: ", error);
    }
}

app.get('/health', async (req, res) => {
    try {
        await slaveDB.raw('SELECT 1');

        res.json({
            processed_by: process.env.NODE_NAME,
            success: true,
        });
    } catch (error) {
        console.log("ERROR: ", error);
        res.status(500).json({
            processed_by: process.env.NODE_NAME,
            success: false,
            message: error.message
        });
    }
})

app.get('/products', async (req, res) => {
    try {
        const products = await slaveDB('products');
        res.json({
            processed_by: process.env.NODE_NAME,
            success: true,
            data: products
        })
    } catch (error) {
        res.status(500).json({
            processed_by: process.env.NODE_NAME,
            success: false,
            message: error.message
        })
    }
})

app.post('/products', async (req, res) => {
    try {
        const { name, price } = req.body;
        const [product] = await masterDB('products').insert({ name, price }).returning('*');
        res.json({
            processed_by: process.env.NODE_NAME,
            success: true,
            data: product
        })

    } catch (error) {
        res.status(500).json({
            processed_by: process.env.NODE_NAME,
            success: false,
            message: error.message
        })
    }
})

initializeDatabase().then(() => {
    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`)
    })
})