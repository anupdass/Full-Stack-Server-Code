const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient;
app.use(cors());
app.use(bodyParser.json())
require("dotenv").config();

 const ObjectID = require('mongodb').ObjectID


const port = process.env.port || 8000



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rwb1x.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    console.log('connection fail', err)
    const collection = client.db("BookStore").collection("BookStore");
    const ordercollection = client.db("BookStore").collection("OrderCollection");


    app.get('/products',(req,res)=>{
        collection.find({})
        .toArray((err,document) => {
            res.send(document)
        })
    })
    app.get('/product/:id',(req,res)=>{
        const id = req.params.id;
        collection.find({_id:ObjectID(id)})
        .toArray((err,document) => {
            res.send(document[0])
        })
    })

    app.get('/orders',(req,res)=>{
        ordercollection.find({})
        .toArray((err,document) => {
            res.send(document)
        })
    })
    app.get('/order/:email',(req,res)=>{
        const email = req.params.email;
        ordercollection.find({email: email})
        .toArray((err,document) => {
            res.send(document)
        })
    })

    app.post('/order',(req,res)=>{
        const order = req.body;
        ordercollection.insertOne(order,(err,result)=>{
            res.send({count: result});
        })
    })
    app.post('/addproduct',(req,res)=>{
        const product = req.body;
        collection.insertOne(product,(err,result)=>{
            res.send({count: result});
        })
    })

    // app.post('/addproducts',(req,res)=>{
    //     const product = req.body;
    //     collection.insertMany(product,(err,result)=>{
    //         res.send({count: result});
    //     })
    // })

    app.delete('/delete/:id',(req,res)=>{
        const id = req.params.id;
        ordercollection.deleteOne({_id:ObjectID(id)},(err)=>{

        })
    })




    app.get('/', (req, res) => {
        res.send('Hello World!')
    })

    //   client.close();
});




app.listen(port)