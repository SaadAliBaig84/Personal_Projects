// const pg = require('pg');

// const db = new pg.Pool({
//     user:"postgres",
//     host:"localhost",
//     database:"p1",
//     password:"fast",
//     port:"5432"
// });

// const dbConnect = async function (){
//     try{
//         await db.connect();
//         await db.query(`
//             create table if not exists Users(
//             id serial primary key,
//             name varchar(100),
//             email varchar(100) unique not null,
//             password varchar(200) not null,
//             created_at timestamp default CURRENT_TIMESTAMP,
//             last_updated timestamp default CURRENT_TIMESTAMP
//             );

//         `)
//         console.log("Table created");
//     }
//     catch(err){
//         console.log(err);
//     }

// }

// const query = async (text, values) => {
//     return await db.query(text, values);
// }

// module.exports={
//     dbConnect,
//     query
// }

const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();
const dbConnect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Atlas Connected");
  } catch (error) {
    console.error("❌ MongoDB Connection Failed:", error);
  }
};

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, maxlength: 100 },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, minlength: 6 },
    created_at: { type: Date, default: Date.now },
    last_updated: { type: Date, default: Date.now },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "last_updated" } }
);

const User = mongoose.model("User", userSchema);

module.exports = {
  dbConnect,
  User,
};
