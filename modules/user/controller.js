const userService = require("./service");

exports.userSingUp = async (req, res, next) => {
  try {
    const newUser = await userService.userSingUp(req.body);
    res.status(200).json({
      status: "success",
      message: "User created successfully",
      data: newUser,
    });
  } catch (error) {
    next(error);
  }
};

exports.userLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const token = await userService.userLogin(email, password);
    res.status(200).json({
      status: "success",
      message: "Login successful",
      token,
    });
  } catch (error) {
    next(error);
  }
};
