
const {MongoClient} = require('mongodb');
const client = new MongoClient(process.env.UriStore, { useNewUrlParser: true,useUnifiedTopology:true });
let database;
async function connectDb()
{
    await client.connect();
    database=await client.db("Store");
    console.log('Book db connected');
}

connectDb();
const db=()=>database;
module.exports.db=db;