var savedCity = [""];
savedCity = JSON.parse(localStorage.getItem("cityNames"));
var searchedCity = savedCity[1];
console.log(savedCity);
var citySearchForm = document.querySelector("#citysearch-form");
var queryURL = "http://api.openweathermap.org/data/2.5/find?q=" + searchedCity + "&units=imperial&appid=53469888c4f263afbeff1527801e0c67";

console.log(queryURL);

$.ajax({
  url: queryURL,
  method: "GET"
}).then(function(response) {
  console.log(response);
  //console.log("response.list[0].main.temp: " + response.list[0].main.temp);
  var cityTitle = $("<h3><strong>").text(response.list[0].name + " (" + moment().format("MM/DD/YYYY") + ")");
  var citySummary = $("<br><p>").text("Temperature: " + Math.round(response.list[0].main.temp) + " °F");
  var humidity = $("<p>").text("Humidity: " + Math.round(response.list[0].main.humidity) + "%");
  var windSpeed = $("<p>").text("Wind Speed: " + Math.round(response.list[0].wind.speed) + " MPH");
  var lat = response.list[0].coord.lat;
  var lon = response.list[0].coord.lon;
  var icon = response.list[0].weather[0].icon;
  //console.log(icon);
  $(cityTitle).append('<img src="http://openweathermap.org/img/wn/' + icon + '.png" />');
  
  load5Day(lat, lon);
  console.log("lat: " + lat + " lon: " + lon);

  $("#cityWeatherSummary").append(cityTitle, citySummary, humidity, windSpeed);
});

function load5Day (lat, lon) {
  var query5dURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&units=imperial&appid=53469888c4f263afbeff1527801e0c67";

  $.ajax({
    url: query5dURL,
    method: "GET"
  }).then(function(response) {
    console.log(response);



    $("#cityWeather5Day").append();
  });
}

$(document).ready(function () {
  loadNav();

  $("#cityWeather5Day").append();
});

citySearchForm.addEventListener("submit", function (event) {
  event.preventDefault();
  searchedCity = $("#citySearch").val().trim();

  if (!savedCity.includes(searchedCity)) {
    savedCity.push(searchedCity);
  }

  localStorage.setItem("cityNames", JSON.stringify(savedCity));
  $("#cityList").empty();
  loadNav();
});

function loadNav() {
  for (var i = 1; i < savedCity.length; i++) {
    var navCity = $("<li>");
    navCity.addClass("navbox");
    navCity.append('<a class="px-3" href="#">' + savedCity[i] + "</a>");
    $("#cityList").append(navCity);
  }
}

function clearLS() {
  localStorage.removeItem("cityNames");
}

//clearLS();



//api.openweathermap.org/data/2.5/forecast/daily?id={city ID}&cnt={cnt}&appid={your api key}

//api key: 53469888c4f263afbeff1527801e0c67

//5 day: http://api.openweathermap.org/data/2.5/forecast?q=Leawood&units=imperial&appid=53469888c4f263afbeff1527801e0c67


//1 day: http://api.openweathermap.org/data/2.5/find?q=Leawood&units=imperial&appid=53469888c4f263afbeff1527801e0c67


// for images: https://openweathermap.org/weather-conditions
// images: "http://openweathermap.org/img/wn/" + icon + "@2x.png"

// current.uvi

// daily[0].dt 		--> Day 1 else [1] for Day 2
// daily[0].weather[0].icon		--> weather[0] always
// daily[0].temp.day
// daily[0].humidity



// dt: 1586451600
// moment.unix(1586451600).format("mm/dd/yyyy");