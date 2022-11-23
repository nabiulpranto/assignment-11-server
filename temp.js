const express = require('express')
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

// middle wares
app.use(cors());
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.swijrrg.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
  try{
const serviceCollection = client.db('juiceBar').collection('services');
const reviewCollection = client.db('juiceBar').collection('reviews');

app.get('/services', async(req,res) =>{
  const query = {};
  const cursor = serviceCollection.find(query);
  const service = await cursor.toArray();
  res.send(service);
});
app.get('/services/:id', async (req, res) => {
  const id = req.params.id;
  const query = { _id: ObjectId(id) };
  const service = await serviceCollection.findOne(query);
  res.send(service);
});
//insert item
app.post('/services', async (req, res) => {
  const services = req.body;
  const result = await serviceCollection.insertOne(services);
  res.send(result);
});

//for review

app.get('/reviews', async (req, res) => {
  let query = {};
  if (req.query.email) {
      query = {
          email: req.query.email
      }
  }
  const cursor = reviewCollection.find(query);
  const review = await cursor.toArray();
  res.send(review);
});

app.post('/reviews', async (req, res) => {
  const review = req.body;
  const result = await reviewCollection.insertOne(review);
  res.send(result);
});

 //update
 app.patch('/reviews/:id', async (req, res) => {
  const { id, reviewtext } = req.params;
  const query = { _id: ObjectId(id) }
  const updatedInfo = {
      $set: {
          reviewtext: reviewtext
      }
  }
  const result = await reviewCollection.updateOne(query, updatedInfo);
  if (result.modifiedCount) {
      res.send({
          message: result
      });
  }

})

//delete
app.delete('/reviews/:id', async (req, res) => {
  const id = req.params.id;
  const query = { _id: ObjectId(id) };
  const result = await reviewCollection.deleteOne(query);
  res.send(result);
});
  }
finally{

}
}

run().catch(error => console.error(error));


app.get('/', (req, res) =>{
    res.send('Juice Bar Server Running')
});



app.listen(port, () => {
    console.log(`Juice Bar Server is Running on port ${port} `);
   
})
