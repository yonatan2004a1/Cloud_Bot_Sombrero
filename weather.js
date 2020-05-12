const fetch = require('node-fetch');
async function GetWeather(location)
{
    location = encodeURI(location);
    return await new Promise((resolve, reject) => {
        fetch(`http://api.openweathermap.org/data/2.5/weather?q=${location}&appid=0660f706fe46a29f94444f318b29b720`, {
	        "method": "GET",
        })
        .then(response => {
            if(!response.ok)
            {
                switch(response.status)
                {
                    case 404:
                        reject("Location is not found");
                        break;
                    case 401:
                        reject("Key expired, message <@417385706307059712>");
                        break;
                    default:
                        reject("Unknown");
                        break;
                } 
            }
            return response.json();
        })
        .then(data => {
            let weather = data.main;
            resolve([(weather.temp-273.15).toFixed(2) , weather.humidity , (weather.feels_like-273.15).toFixed(2) , (weather.temp_min-273.15).toFixed(2) , (weather.temp_max-273.15).toFixed(2), (data.wind.speed*3.6).toFixed(2)]);
        })
        .catch(err => {
            reject (err);
        });
    })
}
module.exports = {
    GetWeather
}
