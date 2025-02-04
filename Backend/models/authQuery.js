const { User } = require("./psqlWrapper");

const createUser = async function (name, email, password) {
  try {
    const user = new User({ name, email, password });
    await user.save();
    console.log("✅ User created successfully:", user);
    return user;
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  createUser,
};
