const bcrypt = require("bcryptjs");
const { GetCommand, PutCommand } = require("@aws-sdk/lib-dynamodb");
const { randomUUID } = require("crypto");

const dynamoDB = require("../config/dynamodb");
const generateToken = require("../utils/generateToken");

// ================= REGISTER =================
const registerUser = async (req, res) => {
  try {
    console.log("Body:", req.body);
    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    // Check existing user
    const existingUser = await dynamoDB.send(
      new GetCommand({
        TableName: process.env.USERS_TABLE,
        Key: {
          email: email,
        },
      })
    );

    if (existingUser.Item) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = {
      userId: randomUUID(),
      name,
      email,
      password: hashedPassword,
      createdAt: new Date().toISOString(),
    };

    await dynamoDB.send(
      new PutCommand({
        TableName: process.env.USERS_TABLE,
        Item: user,
      })
    );

    res.status(201).json({
      message: "Registration Successful",
      token: generateToken(email),
      user: {
        userId: user.userId,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

// ================= LOGIN =================
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const data = await dynamoDB.send(
      new GetCommand({
        TableName: process.env.USERS_TABLE,
        Key: {
          email: email,
        },
      })
    );

    if (!data.Item) {
      return res.status(400).json({
        message: "Invalid Email",
      });
    }

    const match = await bcrypt.compare(
      password,
      data.Item.password
    );

    if (!match) {
      return res.status(400).json({
        message: "Invalid Password",
      });
    }

    res.json({
      message: "Login Successful",
      token: generateToken(email),
      user: {
        userId: data.Item.userId,
        name: data.Item.name,
        email: data.Item.email,
      },
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
};