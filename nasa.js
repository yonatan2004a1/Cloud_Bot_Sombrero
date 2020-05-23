const fetch = require('node-fetch');
const today = new Date()
const key = "xsFA5Wdj7lfctSyTwrmxomkPXzbqDvdMiEBzGcEj" //pls fix the env i wrote for this later
/**
 * 
 * @param {string} [date]
 */
async function GetDailyPic(date)
{
    return await new Promise((resolve, reject) => {
    if(!date)
    {
        let dd = String(today.getDate());
        let mm = String(today.getMonth()+1);
        let yyyy = String(today.getFullYear());
        date = yyyy+"-"+mm+"-"+dd;
    }
    fetch(`https://api.nasa.gov/planetary/apod?api_key=${key}&date=${date}`)
    .then(res => {
        if(!res.ok)
            throw "Error: "+res.statusText;
        return res.json();
    })
    .then(data => {
        resolve([data.title, data.explanation, data.url, data.date]);
    })
    .catch(err => {
        reject(err);
    })
});
}
module.exports = {
    GetDailyPic
}
