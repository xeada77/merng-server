const { UserInputError } = require("apollo-server");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../../models/User");
const { SECRET_KEY } = require("../../config");
const {
  registerInputValidator,
  loginInputValidator,
} = require("../../utils/validators");

const getToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      username: user.username,
    },
    SECRET_KEY,
    { expiresIn: "1h" }
  );
};

module.exports = {
  Mutation: {
    async login(parent, { username, password }, context, info) {
      const { valid, errors } = loginInputValidator(username, password);

      if (!valid) {
        throw new UserInputError("Error de validacion", { errors });
      }

      const user = await User.findOne({ username });
      if (!user) {
        errors.username = "No se encuentra el nombre de usuario";
        throw new UserInputError("Usuario no encontrado", { errors });
      }

      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        errors.password = "Credenciales equivocadas";
        throw new UserInputError("Credenciales equivocadas", { errors });
      }

      const token = getToken(user);

      return {
        ...user._doc,
        id: user._id,
        token,
      };
    },
    async register(parent, args, context, info) {
      let { username, password, email, confirmPassword } = args.registerInput;
      // Validate user data
      const { valid, errors } = registerInputValidator(
        email,
        username,
        password,
        confirmPassword
      );
      if (!valid) {
        throw new UserInputError("Error de validacion", {
          errors,
        });
      }
      // Make sure user doesnt already exists
      const user = await User.findOne({ username });
      if (user) {
        throw new UserInputError("El nombre de usuario ya existe", {
          errors: {
            username: "El nombre de usuario ya existe.",
          },
        });
      }
      // Hash password and create auth token

      password = await bcrypt.hash(password, 12);

      const newUser = new User({
        username,
        email,
        password,
        createdAt: new Date().toISOString(),
      });
      const res = await newUser.save();

      const token = getToken(res);

      return {
        ...res._doc,
        id: res._id,
        token,
      };
    },
  },
};
