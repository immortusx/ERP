async function getDateInFormate() {
    const date = new Date();
    console.log(date, "date");
    const mysqlDatetime = await date.toISOString().slice(0, 19).replace('T', ' ');
    return mysqlDatetime

}
module.exports = { getDateInFormate };