const {query}=require('./psqlWrapper');

const createUser = async function(name, email, pass){
    try {
        const user= await query(`
            INSERT INTO Users (name, email, password) VALUES ($1,$2,$3)
            RETURNING *;    
        `,[name, email, pass]
        );
        return user.rows[0];
    } catch (error) {
        console.log(error);
    }
}

module.exports={
    createUser
}