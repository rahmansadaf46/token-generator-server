const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config()
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.5vqxj.mongodb.net/?retryWrites=true&w=majority`;
const app = express()

app.use(bodyParser.json());
app.use(cors());

const port = 4200;


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const tokenCollection = client.db("tokenGenerator").collection("token");

    app.get('/', (req, res) => {
        tokenCollection.find({})
            .toArray((err, documents) => {
                res.send(documents[0]);
                if (documents[0]) {
                    tokenCollection.deleteOne({ _id: ObjectId(documents[0]._id) })
                }
            })
    })

    app.get('/tokens', (req, res) => {
        tokenCollection.find({})
            .toArray((err, documents) => {
                res.send(documents);
            })
    })
    
    app.post('/addToken', (req, res) => {
        const token = req.body.data;

        tokenCollection.insertOne({ token })
            .then(result => {
                res.send(result);
            })
    })

    app.delete('/deleteToken/:id', (req, res) => {
        tokenCollection.deleteOne({ _id: ObjectId(req.params.id) })
            .then((result) => {
                res.send(result.deletedCount > 0);
            })
    })



});


app.listen(process.env.PORT || port)