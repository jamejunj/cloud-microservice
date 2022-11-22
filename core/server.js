const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()

const PORT = process.env.PORT || 3000

app.use(cors({
    origin: process.env.ORIGIN || '*',
}))

app.use(express.json())

app.get('/', (req, res) => {
    res.send('Server is working successfully')
})

app.get('/api', (req, res) => {
    res.send('API is working properly')
})

app.all('/*', (req, res) => {
    res.status(404).send('Not Found')
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})