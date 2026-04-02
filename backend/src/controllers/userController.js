import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error reading users' });
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error reading user' });
  }
};

export const addUser = async (req, res) => {
  try {
    const { name, email, password, phone, rememberMe } = req.body;

    // Ignore confirmPassword (frontend handles it)

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    if (!email.endsWith('@psgtech.ac.in')) {
      return res.status(400).json({ message: 'Use college email only' });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      phone
    });

    await newUser.save();

    // Generate token for automatic login after signup
    const expiresIn = rememberMe ? '30d' : '1h';
    const token = jwt.sign(
      { id: newUser._id, email: newUser.email },
      process.env.JWT_SECRET || 'SECRET_KEY',
      { expiresIn }
    );

    res.status(201).json({ 
      message: 'Signup successful',
      token,
      user: { id: newUser._id, email: newUser.email, name: newUser.name, phone: newUser.phone }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error during signup' });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password, rememberMe } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Incorrect password' });
    }

    // Generate token
    const expiresIn = rememberMe ? '30d' : '1h';
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET || 'SECRET_KEY',
      { expiresIn }
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      user: { id: user._id, email: user.email, name: user.name, phone: user.phone }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error during login' });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);

    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User deleted' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting user' });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching user data' });
  }
};