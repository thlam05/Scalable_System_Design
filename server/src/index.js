import express from 'express';
import db from './db/db.js';
import dotenv from 'dotenv/config';

const app = express()
const port = 3000

app.use(express.json());

app.get('/health', async (req, res) => {
    try {
        await db.raw('SELECT 1');

        res.status(200).json({
            processed_by: `localhost:${process.env.PORT}`,
            success: true,
        });
    } catch (error) {
        res.json({
            processed_by: `localhost:${process.env.PORT}`,
            success: false,
            message: err.message
        });
    }
})

app.get('/products', async (req, res) => {
    try {
        const products = await db('products');
        res.json({
            processed_by: `localhost:${process.env.PORT}`,
            success: true,
            data: products
        })
    } catch (err) {
        res.json({
            processed_by: `localhost:${process.env.PORT}`,
            success: false,
            message: err.message
        })
    }
})

app.post('/products', async (req, res) => {
    try {
        const { name, price } = req.body;
        const [product] = await db('products').insert({ name, price }).returning('*');
        res.json({
            processed_by: `localhost:${process.env.PORT}`,
            success: true,
            data: product
        })

    } catch (err) {
        res.json({
            processed_by: `localhost:${process.env.PORT}`,
            success: false,
            message: err.message
        })
    }
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})