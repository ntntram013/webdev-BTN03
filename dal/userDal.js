
const {MongoClient} = require('mongodb');
const client = new MongoClient('mongodb+srv://webteam:development@cluster0.qqvwj.mongodb.net/Demo?retryWrites=true&w=majority', { useNewUrlParser: true,useUnifiedTopology:true });
let database;
async function connectDb()
{
    await client.connect();
    database=await client.db("Demo");
    console.log('Db connected');
}

connectDb();
const db=()=>database;
module.exports.db=db;