const {query} = require('./psqlWrapper');

const getAllUsers = async function(){
    try {
        const users = await query(
            `SELECT * FROM Users`,
            []
        )
        return users.rows;
    } catch (error) {
        console.log(error);
    }
}

const getUserByEmail = async function(email){
    try {
        const users = await query(
            `SELECT * FROM Users WHERE email=$1`,
            [email]
        )
        return users.rows[0];
    } catch (error) {
        console.log(error);
    }
}

module.exports={
    getAllUsers,
    getUserByEmail
}