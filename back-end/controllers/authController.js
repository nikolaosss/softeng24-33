const jwt = require("jsonwebtoken");
const dbConnection = require("../models/db");

const SECRET_KEY = process.env.JWT_SECRET || "your-secret-key";

const login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ status: "failed", message: "Username and password are required" });
  }

  try {
    // 🔹 Modified SQL query to LEFT JOIN in case there's no matching operator
    const [rows] = await dbConnection.execute(
      `SELECT users.idUSERS, users.username, users.password, users.privilege, 
              users.fk_operator_id, operators.operator_name
       FROM users
       LEFT JOIN operators ON users.fk_operator_id = operators.id_operator
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

    // 🔹 Build JWT payload
    const tokenPayload = {
      id: user.idUSERS,
      username: user.username,
      role: user.privilege,
    };

    // 🔹 Only include operatorId/operatorName if the user is NOT an admin
    if (user.fk_operator_id) {
      tokenPayload.operatorId = user.fk_operator_id;
      tokenPayload.operatorName = user.operator_name;
    }

    const token = jwt.sign(tokenPayload, SECRET_KEY, { expiresIn: "1h" });

    res.status(200).json({
      status: "success",
      token,
      role: user.privilege,
      operatorId: user.fk_operator_id || null, // If no operatorId, return null
      operatorName: user.operator_name || null, // If no operatorName, return null
    });
  } catch (error) {
    console.error("Error during login:", error.message);
    res.status(500).json({ status: "failed", message: "Internal server error" });
  }
};

// 🔹 Logout remains the same
const logout = (req, res) => {
  res.status(200).send({ status: "success", message: "Successfully logged out" });
};

module.exports = { login, logout };
