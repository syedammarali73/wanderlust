const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js")

const MONGO_URL = 'mongodb://syedammarali73:mYdTrtLKR8wyfOgS@ac-ipboakd-shard-00-00.9bfztoe.mongodb.net:27017,ac-ipboakd-shard-00-01.9bfztoe.mongodb.net:27017,ac-ipboakd-shard-00-02.9bfztoe.mongodb.net:27017/?ssl=true&replicaSet=atlas-ybyi77-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0'
main().then(()=>{
    console.log("connected to DB");
})
.catch((err)=>{
    console.log(err);
})


const initDB = async () =>{
    async function main() {
        await mongoose.connect(MONGO_URL);
      }
      
    await Listing.deleteMany({});
    await Listing.insertMany(initData.data);
    console.log("data was iitialized");
}

initDB();