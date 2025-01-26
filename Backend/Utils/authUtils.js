const validator = require('validator');
const validateUserParams = function (body, mode){
    try {
        if(mode=='s'){
            if(!body.name || !body.email || !body.pass){
                throw Error('Enter all required fields');
            }

            if(!validator.isStrongPassword(body.pass)){
                throw Error('Password should have atleast 8 characters, 1 lower-case character, 1 upper-case character, 1 symbol, and 1 number.');
            }

            if(!validator.isEmail(body.email)){
                throw Error('Invalid email');
            }
        }
        else{
            if(!body.email || !body.pass){
                throw Error('Enter all required fields');
            }
        }
        return body;
        
    } catch (error) {
        console.log(error);
    }

}

module.exports={
    validateUserParams
}