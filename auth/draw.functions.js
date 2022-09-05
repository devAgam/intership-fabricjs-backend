const Users = require("../database/models/user.model");

class draw {
  async save(id, json) {
    const user = await Users.findOne({ _id: id });
    if (user == null) {
      return {
        status: 400,
        message: "Cannot find user",
        success: false,
      };
    }
    user.lastSaveJson = JSON.stringify(json);
    await user.save();
    return {
      status: 200,
      message: "Success",
      success: true,
    };
  }
  async get(id) {
    const user = await Users.findOne({ _id: id });
    return {
      status: 200,
      message: "Success",
      success: true,
      json: JSON.parse(user.lastSaveJson),
    };
  }
}

module.exports = new draw();
