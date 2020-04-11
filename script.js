var citySearchForm = document.querySelector("#citysearch-form");
var citySearchIcon = document.querySelector("#searchicon");
var savedCity = [];
var searchedCity;
var addCity;
var savedCities = JSON.parse(localStorage.getItem("cityNames"));

if (savedCities != null) {
  loadCitySummary(savedCities[savedCities.length - 1]);
}

function loadCitySummary(City) {
  var queryURL = "http://api.openweathermap.org/data/2.5/find?q=" + City + "&units=imperial&appid=53469888c4f263afbeff1527801e0c67";

  $.ajax({
    url: queryURL,
    method: "GET",
  }).then(function (response) {
    var cityTitle = $("<h3><strong>").text(response.list[0].name + " (" + moment().format("MM/DD/YYYY") + ")");
    var citySummary = $("<br><p>").text("Temperature: " + Math.round(response.list[0].main.temp) + " °F");
    var humidity = $("<p>").text("Humidity: " + Math.round(response.list[0].main.humidity) + "%");
    var windSpeed = $("<p>").text("Wind Speed: " + Math.round(response.list[0].wind.speed) + " MPH");
    var lat = response.list[0].coord.lat;
    var lon = response.list[0].coord.lon;
    load5Day(lat, lon);
    $(cityTitle).append('<img src="http://openweathermap.org/img/wn/' + response.list[0].weather[0].icon + '.png" />');

    $("#cityWeatherSummary").empty();
    $("#cityWeatherSummary").append(cityTitle, citySummary, humidity, windSpeed);

    addCity = response.list[0].name;
    loadNav();
  });
}

function load5Day(lat, lon) {
  var query5dURL = 'https://api.openweathermap.org/data/2.5/onecall?lat=' + lat + '&lon=' + lon + '&units=imperial&appid=53469888c4f263afbeff1527801e0c67';
  
  $.ajax({
    url: query5dURL,
    method: "GET",
  }).then(function (response) {
    var uvind = $("<p>").text("UV Index: " + response.current.uvi);
    $("#cityWeatherSummary").append(uvind);
    $("#cityWeather5Day").empty();

    for (i = 1; i < 6; i++) {
      var dateDisp = $('<td class="px-2"><p>').text(moment.unix(response.daily[i].dt).format("MM/DD/YYYY"));
      var iconDisp = $("<p>").append('<img src="http://openweathermap.org/img/wn/' + response.daily[i].weather[0].icon + '.png" />');
      var tempDisp = $("<p>").text('Temp: ' + Math.round(response.daily[i].temp.day) + '°F');
      var humidityDisp = $("<p>").text('Humidity: ' + Math.round(response.daily[i].humidity) + '%');
      $(dateDisp).append("<p>", iconDisp, tempDisp, humidityDisp);
      
      $("#cityWeather5Day").append(dateDisp);
    }
  });
  navClick();
}

citySearchForm.addEventListener("submit", function (event) {
  event.preventDefault();
  searchedCity = $("#citySearch").val().trim();
  loadCitySummary(searchedCity);
});

citySearchForm.addEventListener("click", function () {
  event.preventDefault();
  searchedCity = $("#citySearch").val().trim();
  loadCitySummary(searchedCity);
});

function loadNav() {
  var savedCitytemp = JSON.parse(localStorage.getItem("cityNames"));
  if (savedCitytemp != null) {
    savedCity = JSON.parse(localStorage.getItem("cityNames"));
  }
  savedCity.push(addCity);
  removeDupsAndSave(savedCity);
  savedCity = JSON.parse(localStorage.getItem("cityNames"));
  $("#cityList").empty();

  if (savedCity != null) {
    for (var i = 0; i < savedCity.length; i++) {
      var navCity = $("<li>");
      navCity.addClass("navbox");
      navCity.append('<button class="btn btn-light btn-block text-left p-2" value="' + savedCity[i] + '">' + savedCity[i] + "</button>");
      $("#cityList").append(navCity);
    }
  }
  navClick();
}

function navClick() {
  $("button").on("click", function () {
    loadCitySummary($(this).val());
  });
}

function removeDupsAndSave(array) {
  var newArray = [];
  for (i = 0; i < array.length; i++) {
    if (!newArray.includes(array[i])) {
      newArray.push(array[i]);
    }
  }
  localStorage.setItem("cityNames", JSON.stringify(newArray));
}

function clearLS() {
  localStorage.removeItem("cityNames");
}

//clearLS();