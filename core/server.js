const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()

const PORT = process.env.PORT || 3000

const AWS = require('aws-sdk')
AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'ASIAU4DBVIO3RXY3HEAE', 
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY  || '1JY/Dr0DLJBDkr5wyIm3fkbQGaLEZN2uQJu1i6ED',
    sessionToken: process.env.AWS_SESSION_TOKEN || 
    'FwoGZXIvYXdzECIaDO81PGx+mvoXF47uviLlAXBZaYAZ3vOiMhmW58KmDal82Duzj1qGADUXAwYDm3xGYqcEKSEDhTZeHO8slss7fyORqkO88OgzShhd5cSlpjAinmm7srKOT64W8V/IjJo23o0zj0bXtif5hy5E8mfO3ciGtHme3h/BBu+KQ7X3Oi5M4SRP4od4pyGZ9nIHUy5/XIkdPpnj0MKBVPWD3DKCXibtF2yIJRlzSDNUWyTK6E3YJHo/aEozGxZ54LMn504XOW/LbIW5/01juO3z6SgLgkX100BW8CpFTX+tXjLuphXQVz+uf/5KsZE735YtsgWVs7yFhIYova/UmwYyLTczCIgK/DWco8L2U04yZGXBtWAJ2zPKavrDTfw+Yme0GF4uAUGmW4YwY2j74A==',
    region: 'us-east-1'
});

console.log(process.env.AWS_SESSION_TOKEN)

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

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})