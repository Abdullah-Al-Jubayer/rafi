// Required 
const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient } = require("mongodb");
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MongoDb Connection link
const uri =
  "mongodb+srv://Jubayer:Jubayer@cluster0.jwtcn5h.mongodb.net/?retryWrites=true&w=majority";

// Client connection
const client = new MongoClient(uri);

async function run() {
  try {

    // <-------------------------------------------webstore database connection---------------------------------------->
    const database = client.db('webstore');

    // <---------------------------------------Fetching orders for testing purposes------------------------------------->
    const orders = database.collection('orders');
    const query = { name: 'John Doe' };
    const Orders = await orders.findOne(query);
    console.log(Orders);




    //<----------------------------------- GET route to retrieve all lessons----------------------------------------------->
    app.get('/lessons', (req, res) => {
      client.connect(err => {
        const database = client.db('webstore');
        const lessons = database.collection('lessons');
        lessons.find({}).toArray((error, lessonDocuments) => {
          if (error) {
            res.status(500).send(error);
          } else {
            res.send(lessonDocuments);
          }
          client.close();
        });
      });
    });



    //<--------------------------------------- GET route to retrieve all orders------------------------------------------->
    app.get('/orders', (req, res) => {
      client.connect(err => {
        const database = client.db('webstore');
        const orders = database.collection('orders');
        orders.find({}).toArray((error, lessonDocuments) => {
          if (error) {
            res.status(500).send(error);
          } else {
            res.send(lessonDocuments);
          }
          client.close();
        });
      });
    });


    // <-------------------------------POST route to save a new order to the "orders" collection---------------------------------->
    app.post('/orders', async (req, res) => {
      console.log('Result', req.body);
      try {
        const userData = {
          "name": req.body.name,
          "phone_number": req.body.phone_number,
          "lesson_id": req.body.lesson_id,
          "number_of_spaces": req.body.number_of_spaces
        };
        database.collection("orders").insertOne(userData, function (err, result) {
          if (err) {
            return res.status(500).send({ error: err });
          }
          console.log("Number of documents inserted: " + result.insertedCount);
          return res.status(200).send({ message: "Data inserted successfully" });
        });
      } catch (error) {
        res.status(400).json({
          'status': 'error message'
        });
      }
    });


    //<------------------------------ Load Lessons from MongoDB atlas--------------------------------------->
    async function loadLessons() {
      const uri =
        "mongodb+srv://Jubayer:Jubayer@cluster0.jwtcn5h.mongodb.net/?retryWrites=true&w=majority";
      const client = new MongoClient(uri);
      return client.db('webstore').collection('lessons');
    }



    //<----------------------------------- Load Orders from MongoDB atlas----------------------------------->
    async function loadOrders() {
      const uri =
        "mongodb+srv://Jubayer:Jubayer@cluster0.jwtcn5h.mongodb.net/?retryWrites=true&w=majority";
      const client = new MongoClient(uri);
      const database = client.db('webstore');
      const orders = database.collection('orders');

      const query = { name: 'John Doe' };
      const Orders = await orders.findOne(query);
      console.log(Orders);

      return client.db('webstore').collection('orders');
    }


    //<-------------------------------------- If any error occurs-------------------------------------->
    app.use(function (request, response) {
      response.status(404).send("Page not found. Enter /lessons  or /orders");

    });


    //<---------------------------------------  Running the server on port 3000------------------------>
    const port = process.env.PORT || 3000;
    app.listen(port, () => console.log('server started on port 3000'));


  } finally {
    // Cloising the client server
    await client.close();
  }
}
run().catch(console.dir);





