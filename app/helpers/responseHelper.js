const HasDataException = require("../core/exceptions/hasDataException");
const RestrictedAreaException = require("../core/exceptions/restrictedAreaException");
const UnAuthorizedException = require("../core/exceptions/unAuthorizedException");
const ValidationException = require("../core/exceptions/validationException");

//making response for successfully situation
exports.success = (res, data) => {
  return res.status(200).send({
    status: true,
    message: "",
    data: data
  });
}

//making response for error by status code (default is 404)
exports.error = function (res, message, statusCode = 404, data = []) {
  return res.status(statusCode).json(
    {
      status: false,
      message: message,
      // type: "error",
      data: data
    }
  );
}

//making Restricted Area exception
exports.accessDenied = function (message = "access Denied") {
  throw new RestrictedAreaException(message)
}
//making UnAuthorized exception
exports.accessDenied = function (message = "unauthorized") {
  throw new UnAuthorizedException(message)
}

// convert Exception error to user error response
exports.exception = function (res, error) {
  let data = [];
  let message = error.message;
  let statusCode = 500
  switch (true) {
    case error instanceof ValidationException:
      data = error.data
      message = error.message
      statusCode = 200
      break;
    case error instanceof HasDataException:
      data = error.data
      message = error.message
      statusCode = 400
      break;
    case error instanceof UnAuthorizedException:
      message = error.message || "unauthorized"
      statusCode = 401
      break;
    case error instanceof RestrictedAreaException:
      message = error.message || "access denied"
      statusCode = 403
      break;
    default:
      break;
  }
  // console.log(error)
  return res.status(statusCode).send({
    status: false,
    message: message,
    data: data
  });
}
