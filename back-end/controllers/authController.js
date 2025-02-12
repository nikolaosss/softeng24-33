const jwt = require("jsonwebtoken");
const dbConnection = require("../models/db");

const SECRET_KEY = process.env.JWT_SECRET || "your-secret-key";

const login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ status: "failed", message: "Username and password are required" });
  }

  try {
    const [rows] = await dbConnection.execute(
      `SELECT users.idUSERS, users.username, users.password, users.privilege, 
              users.fk_operator_id, operators.operator_name
       FROM users
       JOIN operators ON users.fk_operator_id = operators.id_operator
       WHERE users.username = ?`,
      [username]
    );


    if (rows.length === 0) {
      return res.status(401).json({ status: "failed", message: "Invalid username or password" });
    }

    const user = rows[0];

    if (password !== user.password) {
      return res.status(401).json({ status: "failed", message: "Invalid username or password" });
    }

    const token = jwt.sign(
      {
        id: user.idUSER,
        username: user.username,
        role: user.privilege,
        operatorId: user.fk_operator_id,
        operatorName: user.operator_name,
      },
      SECRET_KEY,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      status: "success",
      token,
      role: user.privilege,
      operatorId: user.fk_operator_id,
      operatorName: user.operator_name,
    });
  } catch (error) {
    console.error("Error during login:", error.message);
    res.status(500).json({ status: "failed", message: "Internal server error" });
  }
};

const logout = (req, res) => {
  const token = req.headers["x-observatory-auth"];
  if (!token) {
    return res.status(400).json({ status: "failed", message: "Token is required for logout" });
  }

  res.status(200).send({ status: "success", message: "Successfully logged out" });
};

// ✅ Εξασφαλίζουμε ότι εξάγουμε σωστά τις συναρτήσεις
module.exports = { login, logout };
