const pg = require('pg');

const db = new pg.Pool({
    user:"postgres",
    host:"localhost",
    database:"p1",
    password:"fast",
    port:"5432"
});

const dbConnect = async function (){
    try{
        await db.connect();
        await db.query(`
            create table if not exists Users(
            id serial primary key,
            name varchar(100),
            email varchar(100) unique not null,
            password varchar(200) not null,
            created_at timestamp default CURRENT_TIMESTAMP,
            last_updated timestamp default CURRENT_TIMESTAMP
            );    
            
        `)
        console.log("Table created");
    }
    catch(err){
        console.log(err);
    }
    
}

const query = async (text, values) => {
    return await db.query(text, values);
}

module.exports={
    dbConnect,
    query
}