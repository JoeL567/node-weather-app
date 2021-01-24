const request = require('request');


const geocode = (address, callback) => {
    const url = "https://api.mapbox.com/geocoding/v5/mapbox.places/"+address+".json?access_token=pk.eyJ1Ijoiam9lbDU2NyIsImEiOiJja2s1bno4ZHMwczUxMm9xbnZ1MHdlbndrIn0.4z_bdw2isK7sFns511Z87w"

    request ({url, json:true}, (error, {body, statusCode}) => {
        if(error){
            callback("unable to connect to geocode service", undefined);
        }
        else if (statusCode != 200){
            let message = "";
            if (body.message){
                message += body.message;
            }
            callback("Status code: " + statusCode + "   " + message, undefined);
        }
        else if (body.features.length === 0){
            callback("No location with name:" + address + " found");
        }
        else{
            callback(undefined, {
                latitude: body.features[0].center[1],
                longitude: body.features[0].center[0],
                location: body.features[0].place_name
            })
        }
    })
}

module.exports = geocode;