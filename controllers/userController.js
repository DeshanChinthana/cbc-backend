import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config()

export async function createUser(req, res) {
  try {
    const newUserData = req.body;

    if (newUserData.type == "admin") { // check if newly creating user account's user type is "admin"
      if (req.user == null) { // check if user logged-in
        res.json({
          message: "Please login as administrator to create admin accounts"
        })
        return
      }
      if (req.user.type != "admin") { //check if logged user is an admin
        res.json({
          message: "Please login as administrator to create admin accounts"
        })
        return
      }
    }

    newUserData.password = await bcrypt.hash(newUserData.password, 10); // Hash the password asynchronously
    const user = new User(newUserData); // Create a new user instance
    await user.save(); // Save the user to the database

    res.json({
      message: "User created"
    });
  } catch (error) {
    res.json({
      message: "User not created",
      error: error.message
    });
  }
}

export async function loginUser(req, res) {
  try {
    // Find the user by email
    const users = await User.find({ email: req.body.email });

    // If no users are found, send a "User not found" response
    if (users.length === 0) {
      return res.json({
        message: "User not found"
      });
    }

    // Get the first user, email is unique
    const user = users[0];

    // Compare the provided password with the hashed password
    const isPasswordCorrect = await bcrypt.compare(req.body.password, user.password);

    if (isPasswordCorrect) {
      // Generate a JWT token
      const token = jwt.sign(
        {
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          isBlocked: user.isBlocked,
          type: user.type,
          profilePicture: user.profilePicture
        },
        process.env.JWT_SECRET,
        // { expiresIn: '1h' } // Optional: token expiration
      );

      // Send a success response with the token
      res.json({
        message: "User logged in",
        token: token
      });
    } else {
      // Send a "wrong password" response
      res.json({
        message: "User not logged in (wrong password)"
      });
    }
  } catch (error) {
    // Handle any unexpected errors
    res.status(500).json({
      message: "An error occurred during login",
      error: error.message
    });
  }
}