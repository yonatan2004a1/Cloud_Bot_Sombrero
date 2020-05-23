const fetch = require("node-fetch");

/**
 * Input: your name, second name
 * 
 * Output: array - [precent, result]
 * @param {string} name 
 */
async function GetLove(fname, sname)
{
    return await new Promise((resolve, reject) => {
    fetch(`https://love-calculator.p.rapidapi.com/getPercentage?fname=${fname}&sname=${sname}`, {
	"method": "GET",
	"headers": {
		"x-rapidapi-host": "love-calculator.p.rapidapi.com",
		"x-rapidapi-key": "f7b316f98bmsh4aaf522c88b3ff3p1d31fdjsn50a63e0c8625"
	}
})
.then(res => {
    if(!res.ok)
        throw "Error Unkown";
    return res.json();
})
.then(data => {
    resolve([data.percentage, data.result]);
})
.catch(err => {
	reject(err);
});
}
)}

module.exports = {
    GetLove
}