const bcrypt = require("bcrypt");
const saltRounds = 10;

const hasThePass = async (passwordHere) => {
    const salt = await bcrypt.genSalt(saltRounds)
    const myBcryptPass = await bcrypt.hash(passwordHere, salt)
    return myBcryptPass
}
const compareTheHass = async (hashPassword, storedPassword) => {
    console.log('hashPassword', hashPassword);
    console.log('storedPassword', storedPassword);
    const check =  bcrypt.compareSync(hashPassword, storedPassword);
    return check
}

module.exports = { hasThePass, compareTheHass };
