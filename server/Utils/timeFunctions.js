async function getDateInFormate(getDate) {
    const date = new Date(getDate);
    const mysqlDatetime = await date.toISOString().slice(0, 19).replace('T', ' ');
    return mysqlDatetime
}
module.export = { getDateInFormate };