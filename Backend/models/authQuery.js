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
const createGoogleUser = async function (profile, access_token, refresh_token) {
  try {
    const user = new User({
      google_data: {
        google_id: profile.id,
        refresh_token: refresh_token,
        access_token: access_token,
      },
      name: profile.displayName,
      email: profile.emails[0].value,
    });
    await user.save();
    console.log("✅ User created successfully:", user);
    return user;
  } catch (error) {
    console.log(error);
  }
};

const updateGoogleToken = async function (
  profile,
  access_token,
  refresh_token
) {
  try {
    const user = await User.findOneAndUpdate(
      { "google_data.google_id": profile.id },
      {
        $set: {
          "google_data.refresh_token": refresh_token,
          "google_data.access_token": access_token,
        },
      },
      { new: true }
    );
    console.log("Updated user:", user);
    return user;
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  createUser,
  createGoogleUser,
  updateGoogleToken,
};
