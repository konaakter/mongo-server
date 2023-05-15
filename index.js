const express = require('express')
const app = express()
const cors = require('cors')
const port = process.env.PORT || 5000
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!')
})
//tea-mongo RICa4ZicmrFoSOVX


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = "mongodb+srv://kona:2t67i8oedg@cluster0.ah3a7qz.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const userscollectoin = client.db("userstDB").collection("users");
    //const userscollectoin = database.collection("users");
    app.get('/users', async (req, res) => {
        const cursor = userscollectoin.find()
        const results = await cursor.toArray();
        console.log(results);
        res.send(results)
        
    })


    app.get('/users/:id', async (req, res) => {
        const id = req.params.id;
       console.log(id)
       const query = { _id: new ObjectId(id)};
       const resul = await userscollectoin.findOne(query) 
       console.log(resul)
       res.send(resul);

    
        
    })

    app.put('/users/:id', async (req, res ) =>{
        const id = req.params.id;
        const updateuser = req.body;
        console.log(id, updateuser )

        const filter = { _id: new ObjectId(id)};
        const options = { upsert: true };
        const upadatedoc = {
            $set:{
                email: updateuser.email,
                password: updateuser.password
            }
        }
        const updateresult = await userscollectoin.updateOne(filter, upadatedoc, options);
        console.log(updateresult)
        res.send(updateresult)
    })

    app.post('/users', async (req, res) =>{
         const user = req.body;
         console.log('user', user)
         const result = await userscollectoin.insertOne(user);
         res.send(result);
    })

    app.delete('/users/:id', async (req, res) =>{
        const id = req.params.id;
        console.log('dlrete', id)
        const query = { _id: new ObjectId(id)};
        const resultes = await userscollectoin.deleteOne(query);
        res.send(resultes)

    })



   
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    //await client.close();
  }
}
run().catch(console.dir);


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})