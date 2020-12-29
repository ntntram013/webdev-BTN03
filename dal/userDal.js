const {MongoClient} = require('mongodb');

const client = new MongoClient(process.env.UriUser, { useNewUrlParser: true,useUnifiedTopology:true });
let database;

async function connectDb() {
    await client.connect();
    database=await client.db("Account");
    console.log('Account db connected');
}

connectDb();
const db = () => database;
module.exports.db = db;