var jwt = require("jsonwebtoken");
const privateKey = "-4'[]v,k[]\2647ff8965=-3[//?(*";

const getToken = async ({ id, branchId }) => {
  try {
    const token = await jwt.sign({ id, branchId }, privateKey);
    return token
  } catch (e) {
    console.log(e);
  }
};
const getTokenWithExp = async (id, expTime) => {
  try {
    const token = await jwt.sign({ id, "exp": expTime }, privateKey);
    return token
  } catch (e) {
    console.log('expiredError', e);
  }
};

const verifyToken = async (token) => {
  try {
    const tokenVerification = await jwt.verify(token, privateKey);
    const sec = await jwt.decode(token);
    console.log('tokenVerification', tokenVerification)
    return tokenVerification
  } catch (e) {
    console.log(e);
  }
}

module.exports = { getToken, verifyToken, getTokenWithExp };
