import fs from 'fs';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import path from 'path';

const dataPath = new URL('../data/users.json', import.meta.url);


if (!fs.existsSync(dataPath)) {
  fs.writeFileSync(dataPath, '[]', 'utf-8'); 
}


const readUsers = () => {
  try {
    const data = fs.readFileSync(dataPath, 'utf-8');
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

const saveUsers = (users) => {
  fs.writeFileSync(dataPath, JSON.stringify(users, null, 2));
};


export const getUsers = (req, res) => {
  try {
    const users = readUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error reading users' });
  }
};


export const getUserById = (req, res) => {
  try {
    const users = readUsers();
    const user = users.find(u => u.id == req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error reading user' });
  }
};


export const addUser = async (req, res) => {
  try {
    const { email, password, confirmPassword } = req.body;

    if (!email || !password || !confirmPassword) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (!email.endsWith('@psgtech.ac.in')) {
      return res.status(400).json({ message: 'Use college email only' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    const users = readUsers();

    if (users.find(u => u.email === email)) {
      return res.status(400).json({ message: 'User already exists' });
    }

    
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      id: Date.now(),
      email,
      password: hashedPassword
    };

    users.push(newUser);
    saveUsers(users);

    res.status(201).json({ message: 'Signup successful' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error during signup' });
  }
};


export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const users = readUsers();
    const user = users.find(u => u.email === email);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Incorrect password' });
    }

    // Generate token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || 'SECRET_KEY',
      { expiresIn: '1h' }
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      user: { id: user.id, email: user.email }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error during login' });
  }
};

export const deleteUser = (req, res) => {
  try {
    const users = readUsers();
    const updatedUsers = users.filter(u => u.id != req.params.id);

    if (users.length === updatedUsers.length) {
      return res.status(404).json({ message: 'User not found' });
    }

    saveUsers(updatedUsers);
    res.json({ message: 'User deleted' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting user' });
  }
};