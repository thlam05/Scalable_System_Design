import express from 'express';
import db from './db/db.js';

const app = express()
const port = 3000

app.get('/', (req, res) => {

    res.send('Hello World!')
})

app.get('/health', async (req, res) => {
    try {
        await db.raw('SELECT 1');

        res.status(200).json({
            status: 'UP',
            database: 'Connected',
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(503).json({
            status: 'DOWN',
            database: 'Disconnected',
            error: error.message
        });
    }
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})