const { validateUserParams } = require("../Utils/authUtils");
const { createUser } = require("../models/authQuery");
const jwt = require('jsonwebtoken');
const { getAllUsers, getUserByEmail } = require("../models/userQuery");
const bcrypt= require('bcrypt');

async function encyptPass(pass){
    const saltRounds=10;
    try {
        const salt = await bcrypt.genSalt(saltRounds);
        const hash = await bcrypt.hash(pass, salt);
        return hash;
    } catch (err) {
        console.error(err);
        throw err;
    }
}
const signUp = async function(req, res){
    try {
        const params = validateUserParams(req.body, 's');
        const hashedPass= await encyptPass(params.pass);
        const user = await createUser(params.name, params.email, hashedPass);
        const currJwt = jwt.sign({id: user.id}, process.env.JWT_SECRET_KEY, {expiresIn:86400});
        res.status(200).send({
            name: user.name, 
            jwt: currJwt, 
            googleVerified: false
        })
        
    } catch (error) {
        res.status(400).send( {Error: error});
    }
} 

// const logIn = async function(req, res){
    
//     try {
//         const params = validateUserParams(req.body, 'l');
//         console.log("params done");
//         const user = await getUserByEmail(params.email);
//         let tokenHeaderKey = process.env.TOKEN_HEADER_KEY;
//         let jwtSecretKey = process.env.JWT_SECRET_KEY;
        
//         const token = req.header('Authorization');
        
//         console.log(token);
//         if(!token){
//             res.status(400)
//         }
//         const tokenParts = token.split(' ');
//         let actualToken;
//         if (tokenParts.length === 2 && tokenParts[0].toLowerCase() === 'bearer') {
//             actualToken = tokenParts[1];
//             console.log("Extracted Token:", actualToken);
            
//         }
//         const verified = jwt.verify(actualToken, jwtSecretKey);
//         if (!verified) {
//             return res.status(400).send({Error:"Invlid jwt"});
//         }
//         const newJwt = jwt.sign({id: user.id}, process.env.JWT_SECRET_KEY, {expiresIn:86400});
//         res.status(200).send({
//             name: user.name, 
//             jwt: newJwt, 
//             googleVerified: false
//         })
//         console.log(user);
//     } catch (error) {
//         console.log(error);
//         res.status(400).send( {Error: error});
//     }
    
// }

const logIn = async function (req, res) {
    try {
        const params = validateUserParams(req.body, 'l');
        console.log("params done");

        // Fetch the user by email
        const user = await getUserByEmail(params.email);
        if (!user) {
            return res.status(404).send({ Error: "User not found" });
        }

        const match = await bcrypt.compare(params.pass, user.password)
        if(!match){
            throw Error("Invalid credentials");
        }
        let jwtSecretKey = process.env.JWT_SECRET_KEY;

        // // Extract token from the Authorization header
        // const token = req.header('Authorization');
        // if (!token) {
        //     return res.status(400).send({ Error: "Authorization token missing" });
        // }

        // const tokenParts = token.split(' ');
        // let actualToken;
        // if (tokenParts.length === 2 && tokenParts[0].toLowerCase() === 'bearer') {
        //     actualToken = tokenParts[1];
        //     console.log("Extracted Token:", actualToken);
        // } else {
        //     return res.status(400).send({ Error: "Invalid token format" });
        // }

        // // Verify the token
        // let verified;
        // try {
        //     verified = jwt.verify(actualToken, jwtSecretKey);
        // } catch (err) {
        //     console.error("JWT Verification Failed:", err.message);
        //     return res.status(401).send({ Error: "Invalid JWT" });
        // }
        // console.log(verified.id);
        // if (verified.id !== user.id) {
        //     return res.status(403).send({ error: "JWT does not match the logged-in user" });
        // }
        // console.log("Verified token payload:", verified);

        // Generate a new JWT and return the response
        const newJwt = jwt.sign({ id: user.id }, jwtSecretKey, { expiresIn: 86400 });
        res.status(200).send({
            name: user.name,
            jwt: newJwt,
            googleVerified: false,
        });

    } catch (error) {
        console.error("Error in logIn:", error);
        res.status(400).send({ Error: error.message });
    }
};


module.exports={
    signUp,
    logIn
}