const User = require("../model/userModel");
const bcrypt = require("bcryptjs");
const errorHandler = require("../utils/error");
const jwt = require("jsonwebtoken");

// signup

async function signup(req, res, next) {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return next(errorHandler(400, "all fields are required"));
  }

  const hashedPassword = bcrypt.hashSync(password, 10);

  try {
    const validUser = await User.findOne({ email });

    if (validUser) {
      return next(errorHandler(400, "email is not unique"));
    }

    const newUser = new User({
      username,
      password: hashedPassword,
      email,
    });
    await newUser.save();
    res
      .status(201)
      .json({ message: "user successfully created proceed to signin" });
  } catch (error) {
    next(error);
  }
}

//sign in

async function signin(req, res, next) {
  const { email, password } = req.body;

  if (!email || !password) {
    next(errorHandler(400, "All fields are required"));
  }

  try {
    const validUser = await User.findOne({ email });

    if (!validUser) {
      next(errorHandler(400, "user not found"));
    }
    const validPassword = bcrypt.compareSync(password, validUser.password);

    if (!validPassword) {
      return next(errorHandler(400, "invalid credentials"));
    }

    const token = jwt.sign(
      { id: validUser._id, isAdmin: validUser.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    const { password: pass, isAdmin, ...rest } = validUser._doc;

    res
      .status(200)
      .cookie("access_token", token, {
        httpOnly: true,
      })
      .json({ rest, token });
  } catch (error) {
    next(error);
  }
}

//sign in with google

async function signinWithGoogle(req, res, next) {
  const { name, email, googlePhotoUrl } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user) {
      const token = jwt.sign(
        { id: user._id, isAdmin: user.isAdmin },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      const { password, isAdmin, ...rest } = user._doc;

      res
        .status(200)
        .cookie("access_token", token, {
          httpOnly: true,
        })
        .json({ rest, token });
    } else {
      const generatePassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);

      const hashedPassword = bcrypt.hashSync(generatePassword, 10);

      const newUser = new User({
        username:
          name.toLowerCase().split(" ").join("") +
          Math.random().toString(9).slice(-4),
        email,
        password: hashedPassword,
        profilePicture: googlePhotoUrl,
      });
      await newUser.save();

      const token = jwt.sign(
        { id: newUser._id, isAdmin: newUser.isAdmin },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      const { password, isAdmin, ...rest } = newUser._doc;

      res
        .status(200)
        .cookie("access_token", token, {
          httpOnly: true,
        })
        .json({ rest, token });
    }
  } catch (error) {
    next(error);
  }
}

async function updateUser(req, res, next) {
  let { username, password, email, profilePicture } = req.body;

  let userPass = password;
  if (req.user.id !== req.params.userId) {
    return next(errorHandler(403, "you are not allowed to update resource"));
  }

  if (userPass && userPass.length < 6) {
    return next(errorHandler(400, "password must be at least 6 characters"));
  }
  if (userPass) {
    userPass = bcrypt.hashSync(userPass, 10);
  }

  if ((username && username.length < 7) || (username && username.length > 20)) {
    return next(
      errorHandler(
        400,
        "username cannot contain be less than 7 or grater than 20 "
      )
    );
  }

  if (username && username.includes(" ")) {
    return next(errorHandler(400, "username cannot contain spaces"));
  }

  if (username && username.match(/[^a-zA-Z0-9]/g)) {
    return next(
      errorHandler(400, "username cannot contain special characters ")
    );
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      {
        $set: {
          username,
          password: userPass,
          email,
          profilePicture,
        },
      },
      { new: true }
    );

    const { password, isAdmin, ...rest } = updatedUser._doc;

    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
}

async function deleteUser(req, res, next) {
  if (!req.user.isAdmin && req.user.id !== req.params.userId) {
    return next(errorHandler(403, "you are not allowed to delete this user"));
  }
  try {
    await User.findByIdAndDelete(req.params.userId);

    res.status(200).json({ message: "user has been deleted" });
  } catch (error) {
    next(error);
  }
}

async function signOutUser(req, res, next) {
  try {
    res.clearCookie("access_token").status(200).json({
      message: "user has been signed out",
    });
  } catch (error) {
    next(error);
  }
}

async function getUsers(req, res, next) {
  if (!req.user.isAdmin) {
    return next(errorHandler(401, "you are not allowed to view resources"));
  }

  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.sort === "asc" ? 1 : -1;

    const users = await User.find()
      .sort({ createdAt: sortDirection })
      .skip(startIndex)
      .limit(limit)
      .select("-password");

    const totalUsers = await User.countDocuments();
    const now = new Date();

    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );
    const lastMonthUsers = await User.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });

    res.status(200).json({
      users,
      totalUsers,
      lastMonthUsers,
    });
  } catch (error) {
    next(error);
  }
}

async function getIndividualUser(req, res, next) {
  try {
    const user = await User.findById(req.params.userId).select("-password");
    if (!user) {
      return next(errorHandler(404, "user not found"));
    }

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  signup,
  signin,
  signinWithGoogle,
  updateUser,
  deleteUser,
  signOutUser,
  getUsers,
  getIndividualUser,
};
