console.log('client side js loaded')

const weatherForm = document.querySelector('form');
const search = document.querySelector('input');
const messageOne = document.querySelector('#message-1');
const messageTwo = document.querySelector('#message-2');

weatherForm.addEventListener('submit', (event) => {

    messageTwo.textContent = 'loading...'

    getWeather(search.value, (error, {location, forecast} = {}) => {
        if(error) {
            messageOne.textContent = error;
            messageTwo.textContent = '';
        }
        else{
            const {temperature, feelslike, descriptions} = forecast;
            const message = `The weather today is ${descriptions[0]}, the temperature is ${temperature}℃; and it feels like ${feelslike}℃.`
            messageOne.textContent = '';
            messageTwo.textContent = message;
        }
    })
    event.preventDefault();
    console.log(search.value);
});

const getWeather = (location, callback) => {
    fetch('https://localhost:3000/weather?location=' + location)
    .then((response) => {
        response.json().then((data) => {
            if (data.error) {
                callback(data.error, undefined);
            }
            else {
                callback(undefined, data);
            }
        })
    });
}