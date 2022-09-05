const userDB = require("../database/models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

class auth {
  async register(username, password) {
    const existingUser = await userDB.findOne({ username: username });
    if (existingUser) {
      return {
        status: 400,
        message: "Username already exists",
        success: false,
        login: true,
      };
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new userDB({
      username: username,
      password: hashedPassword,
    });
    const ACCESS_TOKEN_SECRET = jwt.sign(
      {
        username: user.username,
        id: user._id,
      },
      process.env.ACCESS_TOKEN_SECRET
    );
    await user.save();
    return {
      status: 200,
      message: "Success",
      success: true,
      token: ACCESS_TOKEN_SECRET,
    };
  }
  async login(username, password) {
    const user = await userDB.findOne({ username: username });
    if (user == null) {
      return {
        status: 400,
        message: "Cannot find user",
        success: false,
      };
    }
    try {
      if (await bcrypt.compare(password, user.password)) {
        const ACCESS_TOKEN_SECRET = jwt.sign(
          {
            id: user._id,
          },
          process.env.ACCESS_TOKEN_SECRET
        );
        return {
          status: 200,
          message: "Success",
          success: true,
          token: ACCESS_TOKEN_SECRET,
        };
      } else {
        return {
          status: 400,
          message: "Username or password is incorrect",
          success: false,
        };
      }
    } catch (e) {
      return {
        status: 500,
        message: "Internal server error",
        success: false,
      };
    }
  }
  async validateJWT(token) {
    try {
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      return {
        status: 200,
        message: "Success",
        success: true,
        id: decoded.id,
      };
    } catch (e) {
      return {
        status: 400,
        message: "Invalid token",
        success: false,
      };
    }
  }
}
module.exports = new auth();
