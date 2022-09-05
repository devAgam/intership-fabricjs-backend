const mongoose = require("mongoose");

const user_schema = {
  username: { type: mongoose.SchemaTypes.String, required: true },
  password: { type: mongoose.SchemaTypes.String, required: true },
  createdAt: { type: mongoose.SchemaTypes.Date, default: Date.now },
  updatedAt: { type: mongoose.SchemaTypes.Date, default: Date.now },
  lastSaveJson: { type: mongoose.SchemaTypes.String, default: null },
};
const collectionName = "users";
const users_ = mongoose.Schema(user_schema);
const Users = mongoose.model(collectionName, users_);
module.exports = Users;
