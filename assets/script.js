var APIKey = "&appid=16dafc35649b305642a346f8f78bbaf3";

var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=";

var forecastURL = "https://api.openweathermap.org/data/2.5/forecast?q="

let searchTerm = document.getElementById("city-input")


const searchButton = document.getElementById('add-city')
searchButton.addEventListener('click', (e) => {
    e.preventDefault()
    const reg = /[^\s*].*[^\s*]/
    let searchLocation = searchTerm.value
    searchWeather(searchLocation)
    getForecast(searchLocation)
})

function searchWeather(location) {
    console.log(queryURL + location + APIKey + '&units=imperial')
    fetch(queryURL + location + APIKey)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            // get relevant data from the response.body
            let icon = data.weather.icon //01d
            let currentTemp = data.main.temp
            let humidity = data.main.humidity
            let name = data.name
            let windSpeed = data.wind.speed
            let date = new Date().toLocaleDateString()

            // select elements on the page to display data from the API
            let currentWeatherEl = document.getElementById('currentWeather')
            let currentTempEl = document.getElementById('temp')
            let currentHumidityEl = document.getElementById('humidity')
            let nameEl = document.getElementById('city')
            let windEl = document.getElementById('wind')
            let iconEl = document.getElementById('temp')
            let uvEl = document.getElementById('uvIndex')
            let dateEl = document.getElementById('date')

            // add content to the elements
            currentTempEl.textContent = `Current Temp: ${currentTemp}`
            currentHumidityEl.textContent = `Current Humidity: ${humidity}`
            nameEl.textContent = name
            dateEl.textContent = date
            windEl.textContent = `Wind: ${windSpeed} mph`
            getUV(data.coord.lat, data.coord.lon)
        })
}

const getUV = (lat, lon) => {
    fetch(`http://api.openweathermap.org/data/2.5/uvi?${APIKey}&lat=${lat}&lon=${lon}`).then(res => res.json()).then(json => {
        const UV = json.value
        const bodyEl = document.createElement('.card-body')
        const uvEl = document.createElement('p')
        uvEl.textContent = `UV Index: `
        const buttonEl = document.createElement('span')
        buttonEl.classList.add('btn', 'btn-sm')
        buttonEl.innerHTML = UV

        bodyEl.appendChild(uvEl)
        uvEl.appendChild(buttonEl)

    })
}

function getForecast(location) {
    fetch(forecastURL + location + APIKey).then(response => response.json()).then(data => {
        console.log(data)
        var forecastEL = document.getElementById('forecast')
        for (let i = 0; i < data.list.length; i++) {
            if (data.list[i].dt_txt.indexOf('15:00:00') !== -1) {

                const day = data.list[i];
                // card data
                const colEl = document.createElement('div')
                colEl.classList.add('col-md-2')
                const cardEl = document.createElement('div')
                cardEl.classList.add('class-card', 'bg-primary')
                const windEl = document.createElement('p')
                windEl.classList.add('card-text')
                windEl.textContent = `Wind Speed: ${day.wind.speed} mph`
                const humidityEl = document.createElement('p')
                humidityEl.classList.add('card-text')
                humidityEl.textContent = `Humidity: ${day.main.humidity}%`
                const bodyEl = document.createElement('div')
                bodyEl.classList.add('card-body', 'p-2')
                const titleEl = document.createElement('h5')
                titleEl.classList.add('card-title')
                // titleEl.textContent = new Date(day.list.dt_txt.toLocaleDateString())
                const imgEl = document.createElement('img')
                imgEl.setAttribute('src', `http://openweathermap.org/img/w/${data.list[i].weather[0].icon}.png`)
                const p1El = document.createElement('p')
                p1El.classList.add('card-text')
                p1El.textContent = `Temp: ${day.main.temp_max}`
                const p2El = document.createElement('p')
                p2El.classList.add('card-text')
                p2El.textContent = `Temp: ${day.main.humidity}`

                // append elements to page
                colEl.appendChild(cardEl)
                bodyEl.appendChild(titleEl)
                bodyEl.appendChild(imgEl)
                bodyEl.appendChild(windEl)
                bodyEl.appendChild(humidityEl)
                bodyEl.appendChild(p1El)
                bodyEl.appendChild(p2El)
                cardEl.appendChild(bodyEl)
                forecastEL.appendChild(colEl)
            }

        }
    })
}
//getForecast("Austin")
