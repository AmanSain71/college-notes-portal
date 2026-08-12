const jwt = require("jsonwebtoken");
const { GetCommand } = require("@aws-sdk/lib-dynamodb");
const dynamoDB = require("../config/dynamodb");

const protect = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const result = await dynamoDB.send(
        new GetCommand({
          TableName: process.env.USERS_TABLE,
          Key: {
            email: decoded.email,
          },
        })
      );

      if (!result.Item) {
        return res.status(401).json({
          message: "User not found",
        });
      }

      req.user = result.Item;

      next();
    } else {
      return res.status(401).json({
        message: "No Token",
      });
    }
  } catch (error) {
    console.error(error);

    res.status(401).json({
      message: "Invalid Token",
    });
  }
};

module.exports = { protect };