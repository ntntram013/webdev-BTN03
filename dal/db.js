
const {MongoClient} = require('mongodb');
const uri = "mongodb+srv://webteam:development@cluster0.qqvwj.mongodb.net/Store?retryWrites=true&w=majority"
const client = new MongoClient(uri, { useNewUrlParser: true,useUnifiedTopology:true });
let database;
async function connectDb()
{
    await client.connect();
    database=await client.db("Store");
    console.log('Db connected');
}

connectDb();
const db=()=>database;
module.exports.db=db;