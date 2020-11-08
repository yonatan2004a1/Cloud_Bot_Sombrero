const fetch = require('node-fetch');
async function GetAvailable()
{
    return await new Promise((resolve, reject) => {
        fetch("https://currency-converter5.p.rapidapi.com/currency/list?format=json", {
	"method": "GET",
	"headers": {
		"x-rapidapi-host": "currency-converter5.p.rapidapi.com",
		"x-rapidapi-key": "f7b316f98bmsh4aaf522c88b3ff3p1d31fdjsn50a63e0c8625"
	}
})
.then(res => {
    if(!res.ok)
        throw res.statusText;
    return res.json();
})
.then(data => {
    let result = Object.keys(data.currencies).map(key => [key, data.currencies[key]])
    resolve(result);
})
.catch(err => {
	reject(err);
});
    })
}
async function GetConvertedCurrency(from, to, amount)
{
    return await new Promise((resolve, reject) => {
        fetch(`https://currency-converter5.p.rapidapi.com/currency/convert?format=json&from=${from}&to=${to}&amount=${amount}`, {
	"method": "GET",
	"headers": {
		"x-rapidapi-host": "currency-converter5.p.rapidapi.com",
		"x-rapidapi-key": "f7b316f98bmsh4aaf522c88b3ff3p1d31fdjsn50a63e0c8625"
	}
})
.then(res => {
	if(!res.ok)
		throw res.statusText;
	return res.json();
})
.then(data => {
	console.log(data);
})
.catch(err => {
	console.log(err);
});

    })
}
GetConvertedCurrency("USD", "ILS", 2.5);