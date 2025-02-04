const { User } = require("./psqlWrapper");

const getAllUsers = async function () {
  try {
    const users = await User.find();
    return users;
  } catch (error) {
    console.log(error);
  }
};

const getUserByEmail = async function (email) {
  try {
    const users = await User.findOne({ email });
    return users;
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  getAllUsers,
  getUserByEmail,
};
