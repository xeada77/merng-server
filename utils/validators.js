module.exports.registerInputValidator = (
  email,
  username,
  password,
  confirmPassword
) => {
  const errors = {};

  if (username.trim() == "") {
    errors.username = "El nombre de usuario no puede estar vacio.";
  }

  if (email.trim() == "") {
    errors.email = "El email no puede estar vacio.";
  } else {
    const regExp = /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/;
    if (!email.match(regExp)) {
      errors.email = "Debe de proporcionar una direccion email valida.";
    }
  }

  if (password === "") {
    errors.password = "La contraseña no puede estar vacía.";
  } else if (password !== confirmPassword) {
    errors.confirmPassword = "Las contraseñas deben de coincidir";
  }

  return {
    errors,
    valid: Object.keys(errors).length < 1,
  };
};

module.exports.loginInputValidator = (username, password) => {
  const errors = {};

  if (username.trim() == "") {
    errors.username = "El nombre de usuario no puede estar vacio.";
  }

  if (password.trim() == "") {
    errors.password = "La contraseña no puede estar vacía.";
  }

  return {
    errors,
    valid: Object.keys(errors).length < 1,
  };
};
