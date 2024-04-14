const mongoose = require('mongoose');
const initData = require("./data.js");
const Listing = require("../models/listing.js")
const dotenv = require("dotenv");
dotenv.config({
    path: './.env'
});

dotenv.config({
    path: '../.env'
});

main()
.then(res => console.log("Connect to DB"))
.catch(err => console.log(err));

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);

//   await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
}
  

const initDB = async () =>{
    async function main() {
        await mongoose.connect(MONGO_URL);
      }
      
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj)=> ({...obj, owner: "661c2ea5440905ef4b7ce04b"})) 
    // console.log(initData.data);
    await Listing.insertMany(initData.data);
    console.log("data was iitialized");
}

initDB();