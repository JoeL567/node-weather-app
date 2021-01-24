const request = require('request');

const forecast = (lat, long, callback) => {
    const url = 'http://api.weatherstack.com/current?access_key=ed688e68e79a3c5399b2aec797932348&query='+lat+','+long;

    request({url, json: true}, (error,{body}) => {
        if(error){
            callback("unable to connect to the weather service", undefined);
        }
        else if (body.error){
            callback(body.error.info, undefined);
        }
        else{
            callback(undefined, {
                temperature: body.current.temperature,
                feelslike: body.current.feelslike,
                descriptions: body.current.weather_descriptions
            });
        }
    })
}

module.exports = forecast;