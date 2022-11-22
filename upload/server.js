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
const s3 = new AWS.S3()
const ddb = new AWS.DynamoDB.DocumentClient();

const multer = require('multer')

const sizeOf = require('image-size'); // npm i image-size

app.use(cors({
    origin: process.env.ORIGIN || '*',
}))
app.use(express.json())

const storage = multer.memoryStorage()
const upload = multer({storage: storage})

app.get('/', (req, res) => {
    res.send('Server is working successfully')
})

app.get('/api', (req, res) => {
    res.send('API is working properly')
})

const exist = async (id) => {
    params = {
        TableName: 'project2-dynamodb',
        Key: {
            user_id: id,
        },
    }
    let result = await ddb.get(params).promise();
    if (result.Item) {
        return true
    }else{
        return false;
    }
}

function validate_image(file){
    const dimensions = sizeOf(file.buffer);
    const size = file.size;
    if (size <= 50000 && dimensions.width <= 200 && dimensions.height <= 200 && dimensions.type == 'jpg') {
        return true
    }
    return false
}

const uploadBufferToS3 = async (file) => {
    const key = 'uploads/' + file.originalname.split('.').slice(0,-1).join('.') + '-' + Date.now() + '.' + file.mimetype.split('/')[1];
    console.log(key)
    const params = {
        Bucket: 'project2-bucket-6234409723',
        Key: key,
        Body: file.buffer,
        ACL: 'public-read',
        ContentType: file.mimetype,
    };
    const base = `https://${params.Bucket}.s3.us-east-1.amazonaws.com/`
    const putRequest = await s3.putObject(params).promise();
    return base+key
}

app.post('/api/upload', upload.single('file'), async (req, res) => {
    // console.log(req.body);
    check = validate_image(req.file)
    const location = await uploadBufferToS3(req.file)
    isExist = await exist(req.body.user_id)
    if (isExist) {
        let result = await ddb.update({
            TableName: 'project2-dynamodb',
            Key: {
                user_id: req.body.user_id,
            },
            UpdateExpression: 'SET history = list_append (history, :new)',
            ExpressionAttributeValues: {
                ':new': [{
                    path: location,
                    response: check,
                    timestamp: Date.now(),
                }],
            },
            ReturnValues: 'ALL_NEW',
        }).promise();
        res.json({
            status: 'success',
            aws_response: result,
        })
    }else{
        let result = await ddb.put({
            TableName: 'project2-dynamodb',
            Item: {
                user_id: req.body.user_id,
                history: [{
                    path: location,
                    response: check,
                    timestamp: Date.now(),
                }],
                data: JSON.parse(req.body.user_data)
            },
            ReturnValues: 'ALL_OLD',
        }).promise();
        res.json({
            status: 'success',
            aws_response: result,
        })
    }
})

app.all('*', (req, res) => {
    res.status(404).json({
        message: 'Not found'
    })
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})