var APIKey = "&appid=16dafc35649b305642a346f8f78bbaf3";

var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=";

var forecastURL = "https://api.openweathermap.org/data/2.5/forecast?q="

let searchTerm = document.getElementById("city-input")



const searchButton = document.getElementById('add-city')
searchButton.addEventListener('click', (e) => {
    e.preventDefault()

    let searchLocation = searchTerm.value
    searchWeather(searchLocation)
    getForecast(searchLocation)
    makeRow(searchLocation)
})

function searchWeather(location) {
    console.log(queryURL + location + APIKey + '&units=imperial')
    fetch(queryURL + location + APIKey + '&units=imperial')
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
            let currentTempEl = document.getElementById('temp')
            let currentHumidityEl = document.getElementById('humidity')
            let nameEl = document.getElementById('city')
            let windEl = document.getElementById('wind')
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
    fetch(`http://api.openweathermap.org/data/2.5/uvi?${APIKey}&lat=${lat}&lon=${lon}`).then(res => res.json()).then(data => {

        const uvEl = document.querySelector('#uvIndex')
        uvEl.textContent = ` `
        const buttonEl = document.createElement('span')
        buttonEl.classList.add('btn', 'btn-sm')
        buttonEl.innerHTML = `UV: ` + data.value

        if (data.value < 3) {
            buttonEl.classList.add('uvYellow')
        } else if (data.value < 7) {
            buttonEl.classList.add('uvOrange')
        } else {
            buttonEl.classList.add('uvRed')
        }
        uvEl.appendChild(buttonEl)

    })
}

const makeRow = (searchValue) => {
    const liEl = document.createElement('li')
    liEl.classList.add('list-group-item', 'list-group-item-action')
    var text = searchValue
    liEl.textContent = text

    var historyEL = document.querySelector('.history')
    historyEL.unclick = function (event) {
        if (event.target.tagName === 'li') {
            searchWeather(event.target.textContent)
        }
    }

    historyEL.appendChild(liEl)
}

function getForecast(location) {
    fetch(forecastURL + location + APIKey + '&units=imperial').then(response => response.json()).then(data => {
        console.log(data)
        var forecastEL = document.getElementById('forecast')
        forecastEL.textContent = ` `

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
                const titleEl = document.createElement('h6')
                titleEl.classList.add('card-title')
                console.log(day.list)

                titleEl.textContent = `${data.city.name}`
                const imgEl = document.createElement('img')
                imgEl.setAttribute('src', `http://openweathermap.org/img/w/${data.list[i].weather[0].icon}.png`)
                const p1El = document.createElement('p')
                p1El.classList.add('card-text')
                p1El.textContent = `Temp: ${day.main.temp_max}`
                // const p2El = document.createElement('p')
                // p2El.classList.add('card-text')
                // p2El.textContent = `Temp: ${day.main.humidity}`

                // append elements to page
                colEl.appendChild(cardEl)
                bodyEl.appendChild(titleEl)
                bodyEl.appendChild(imgEl)
                bodyEl.appendChild(windEl)
                bodyEl.appendChild(humidityEl)
                bodyEl.appendChild(p1El)
                // bodyEl.appendChild(p2El)
                cardEl.appendChild(bodyEl)
                forecastEL.appendChild(colEl)
            }

        }
    })
}
//getForecast("Austin")
