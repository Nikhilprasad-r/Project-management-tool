import User from "../models/User.js";
import Token from "../models/Token.js";
import bcrypt from "bcryptjs";
import crypto, { randomUUID } from "crypto";
import {
  sendResetEmail,
  sendActivationEmail,
  sendWelcomeEmail,
} from "../utils/mailer.js";
import jwt from "jsonwebtoken";

export const signUp = async (req, res) => {
  const { name, email, mobileNumber, dob, password, profilePic } = req.body;
  try {
    let user = await User.findOne({ email: email });
    if (user) {
      return res.status(400).json({ msg: "User already exists" });
    }

    user = new User({
      name,
      email,
      mobileNumber,
      dob,
      password,
      isadmin: true,
      profilePic,
    });

    await user.save();

    const token = new Token({
      userId: user._id,
      token: crypto.randomBytes(32).toString("hex"),
      type: "activation",
    });
    await token.save();

    const activationLink = `${process.env.FRONTEND_URL}/activate/${token.token}`;
    await sendActivationEmail(email, activationLink);

    res.status(201).send("User registered, activation email sent.");
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};
export const validateToken = (req, res) => {
  res.status(200).json({ msg: "Token is valid" });
};
export const activateAccount = async (req, res) => {
  const { token } = req.params;

  try {
    const activationToken = await Token.findOne({ token, type: "activation" });
    if (!activationToken) {
      return res
        .status(400)
        .json({ msg: "Invalid or expired activation token" });
    }

    const user = await User.findById(activationToken.userId);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    user.isActive = true;
    await user.save();
    await Token.findByIdAndDelete(activationToken._id);

    res.send("Account activated successfully.");
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

export const resetPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    await Token.deleteMany({ userId: user._id, type: "reset" });

    const token = new Token({
      userId: user._id,
      token: crypto.randomBytes(32).toString("hex"),
      type: "reset",
    });
    await token.save();

    const resetLink = `${process.env.FRONTEND_URL}/reset/${token.token}`;
    await sendResetEmail(email, resetLink);

    res.status(200).send("Reset password link sent.");
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

export const submitNewPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;
  try {
    const passwordResetToken = await Token.findOne({ token, type: "reset" });
    if (!passwordResetToken) {
      return res
        .status(400)
        .json({ msg: "Invalid or expired password reset token" });
    }

    const user = await User.findById(passwordResetToken.userId);
    user.password = bcrypt.hashSync(password, 10);
    await user.save();
    await Token.findByIdAndDelete(passwordResetToken._id);
    res.send("Password has been reset.");
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

export const signIn = async (req, res) => {
  const { email, mobileNumber, password } = req.body;

  try {
    if (!email && !mobileNumber) {
      console.error("Sign in failed: Email or mobile number is required");
      return res
        .status(400)
        .json({ msg: "Email or mobile number is required" });
    }
    if (!password) {
      console.error("Sign in failed: Password is required");
      return res.status(400).json({ msg: "Password is required" });
    }
    let user;
    if (email) {
      user = await User.findOne({ email });
    } else if (mobileNumber) {
      user = await User.findOne({ mobileNumber });
    }

    if (!user) {
      console.error("Sign in failed: User not found for email:", email);
      return res.status(404).json({ msg: "User not found" });
    }

    if (!user.isActive) {
      console.error("Sign in failed: User not activated for email:", email);
      return res.status(403).json({ msg: "User not activated" });
    }

    const isVerified = await user.comparePassword(password);
    if (!isVerified) {
      console.error("Sign in failed: Invalid credentials for email:", email);
      return res.status(401).json({ msg: "Invalid credentials" });
    }

    const payload = {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        mobileNumber: user.mobileNumber,
        isActive: user.isActive,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "5h" },
      (err, token) => {
        if (err) {
          console.error("Error signing the JWT for email:", email, err);
          throw err;
        }
        res.json({ token, user: payload.user });
      }
    );
  } catch (err) {
    res.status(500).send("Server error");
  }
};

export const createUser = async (req, res) => {
  const { name, email, mobileNumber, skills, hourlyRate } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: "User already exists" });
    }
    const password = randomUUID();
    user = new User({
      name,
      email,
      mobileNumber,
      skills,
      hourlyRate,
      password: password,
      isActive: true,
    });
    await user.save();
    sendWelcomeEmail(email, password);
    res.status(201).json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

export const updateUser = async (req, res) => {
  const { id } = req.params;
  const {
    name,
    email,
    mobileNumber,
    skills,
    profilePic,
    hourlyRate,
    role,
    isActive,
    isAdmin,
    dob,
  } = req.body;
  try {
    let user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    user = await User.findByIdAndUpdate(
      id,
      {
        name,
        email,
        mobileNumber,
        skills,
        profilePic,
        hourlyRate,
        role,
        isActive,
        isAdmin,
        dob,
      },
      { new: true }
    );
    res.status(200).json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};
export const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};
export const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    res.status(200).json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};
