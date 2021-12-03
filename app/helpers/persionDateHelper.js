const persianDate = require("persian-date");

exports.hour = () => {
  const h = new persianDate().hour();
  const m = new persianDate().minute();
  return h + ":" + m;
}

exports.now_hour = () => {
  const h = new persianDate().hour();
  return h;
}

exports.now_minute = () => {
  const m = new persianDate().minute();
  return m;
}

exports.date = () => {
  const date = new persianDate().toLeapYearMode("algorithmic");
  const year = date.year();
  const month = date.month();
  const day = date.date();
  return year + "/" + month + "/" + day
}

exports.date_chasb = () => {
  const date = new persianDate().toLeapYearMode("algorithmic");
  const year = date.year();
  const month = date.month();
  const day = date.date();
  return year + "" + month + "" + day
}