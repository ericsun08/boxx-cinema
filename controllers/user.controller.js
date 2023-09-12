const db = require("../models");
const User = db.Users;
const Op = db.Sequelize.Op;
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv');
dotenv.config();

exports.create = async (req, res) => {
  const { firstName, lastName, address, email, phoneNumber, password, passwordConfirmation } = req.body;

  if (!email) {
      return res.status(400).send({ message: "Email is required" });
  }
  if (!phoneNumber) {
      return res.status(400).send({ message: "Phone Number is required" });
  }
  if (!firstName) {
      return res.status(400).send({ message: "First Name is required" });
  }
  if (!password) {
      return res.status(400).send({ message: "Password is required" });
  }
  if (!passwordConfirmation) {
      return res.status(400).send({ message: "Password Confirmation is required" });
  }

  const emailChecker = { Email: email };
  const isEmailExist = await User.findOne({ where: emailChecker });

  if (isEmailExist) {
      return res.status(400).send({ message: "Email already registered" });
  }

  try {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const newUser = {
          FirstName: firstName,
          LastName: lastName,
          Address: address,
          Email: email,
          PhoneNumber: phoneNumber,
          Password: hashedPassword
      };

      await User.create(newUser);

      res.send({ message: 'Successfully signed up new user' });
  } catch (err) {
      console.error(err);
      res.status(500).send({ message: "Some error occurred while creating the User." });
  }
    
}

exports.userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    if (!password) {
      return res.status(400).json({ message: "Password is required" });
    }

    const user = await User.findOne({ where: { Email: email } });

    if (!user) {
      return res.status(400).json({ message: "User does not exist" });
    }

    const userDetail = {
      UserId: user.UserId,
      Address: user.Address,
      Email: user.Email,
      FirstName: user.FirstName,
      LastName: user.LastName,
      PhoneNumber: user.PhoneNumber,
    }

    const isPasswordValid = await bcrypt.compare(password, user.Password);

    if (isPasswordValid) {
      const token = jwt.sign({ user }, process.env.SECRET, { expiresIn: '1h' });
      const decodedToken = jwt.decode(token);
      const exp = decodedToken.exp
      res.status(200).send({user: userDetail, token: token, tokenExp: exp});
    } else {
      res.status(400).json({ message: "Incorrect password" });
    }
  } catch (error) {
    res.status(500).json({ message: "An error occurred while logging in." });
  }
}

exports.loggedInUser = async (req, res) => {
  jwt.verify(req.token, `${process.env.SECRET}`, (err, data) => {
    if(err){
      res.status(403).send({message: 'Failed'})
    } else {
      res.send({message: 'loggedin', data})
    }
  })
}

exports.updateUser = async (req, res) => {
  const userId = req.params.userId
  const { FirstName, PhoneNumber } = req.body

  if(!FirstName){
    return res.status(400).json({ message: "First name is required" });
  }

  if(!PhoneNumber){
    return res.status(400).json({ message: "Phone number is required" });
  }

  jwt.verify(req.token, `${process.env.SECRET}`, (err, data) => {
    if(err || (data.user.UserId !== userId)){
      return res.status(403).send({message:'Forbidden'})
    } 

    User.update(req.body, {where: {UserId: data.user.UserId}})
    .then(async Data => {
      if(Data.includes(1)){
        const user = await User.findOne({where: {UserId: data.user.UserId}})

        const userDetail = {
          UserId: user.UserId,
          Address: user.Address,
          Email: user.Email,
          FirstName: user.FirstName,
          LastName: user.LastName,
          PhoneNumber: user.PhoneNumber,
        }

        res.send({user: userDetail, message: 'User profile successfuly updated'})
      } else {
        res.send({message: 'Failed to update user profile'})
      }
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Error while updating the user"
      })
    })
    
  })
}

exports.changePassword = async (req, res) => {
  const userId = req.params.userId
  const { currentPassword, newPassword, newPasswordConfirmation } = req.body

  if(!currentPassword){
    return res.status(400).json({ message: "Current password is required" });
  }

  if(!newPassword){
    return res.status(400).json({ message: "New password is required" });
  }

  if(!newPasswordConfirmation){
    return res.status(400).json({ message: "New password confirmation is required" });
  }

  const salt = await bcrypt.genSalt(10)
  const newEncryptedPassword = await bcrypt.hash(req.body.newPassword, salt)

  jwt.verify(req.token, `${process.env.SECRET}`, async (err, data) => {
    if(err || (data.user.UserId !== userId)){
      return res.sendStatus(403)
    }

    const user = await User.findOne({where: {UserId: data.user.UserId}})
    const isCurrentPasswordTrue = await bcrypt.compare(currentPassword, user.Password)

    if(isCurrentPasswordTrue){
      await User.update({Password: newEncryptedPassword}, {where: {UserId: data.user.UserId}})
      res.send({message: 'Password Successfully changed'})
    } else {
      res.status(400).send({message: 'Current Password is Incorrect'})
    }
  })
}

exports.findAll = (req, res) => {
  const firstName = req.body.firstName
  let condition = firstName ? { FirstName: { [Op.like]: `%${firstName}` } } : null

  User.findAll({ where: condition })
    .then(data => {
      res.send(data)
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving users."
      })
    })
}