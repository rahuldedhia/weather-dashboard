var savedCity = [];
var searchedCity;
var addCity;
var lastCity = localStorage.getItem("lastCity");

//retrieves last city that was looked at
if (lastCity != null) {
  loadCitySummary(lastCity);
}

//Main Function which calls the curretnweather API to retrieve summary data
function loadCitySummary(City) {
  var queryURL = "https://api.openweathermap.org/data/2.5/find?q=" + City + "&units=imperial&appid=53469888c4f263afbeff1527801e0c67";

  $.ajax({
    url: queryURL,
    method: "POST",
  }).then(function (response) {
    var lat = response.list[0].coord.lat;
    var lon = response.list[0].coord.lon;
    load5Day(lat, lon);

    var cityTitle = $("<h3><strong>").text(response.list[0].name + " (" + moment().format("MM/DD/YYYY") + ")");
    var citySummary = $("<br><p>").text("Temperature: " + Math.round(response.list[0].main.temp) + " °F");
    var humidity = $("<p>").text("Humidity: " + Math.round(response.list[0].main.humidity) + "%");
    var windSpeed = $("<p>").text("Wind Speed: " + Math.round(response.list[0].wind.speed) + " MPH");
    $(cityTitle).append('<img src="https://openweathermap.org/img/wn/' + response.list[0].weather[0].icon + '.png" />');

    $("#cityWeatherSummary").empty();
    $("#cityWeatherSummary").append(cityTitle, citySummary, humidity, windSpeed);

    addCity = response.list[0].name;
    localStorage.setItem("lastCity", addCity);
    loadNav();
  });
}

//function for 5 day weather details using OneCall API
function load5Day(lat, lon) {
  var query5dURL = 'https://api.openweathermap.org/data/2.5/onecall?lat=' + lat + '&lon=' + lon + '&units=imperial&appid=53469888c4f263afbeff1527801e0c67';
  
  $.ajax({
    url: query5dURL,
    method: "POST",
  }).then(function (response) {
    var uvind = $("<p>").text("UV Index: " + response.current.uvi);
    $("#cityWeatherSummary").append(uvind);
    $("#cityWeather5Day").empty();

    for (i = 1; i < 6; i++) {
      var dateDisp = $('<td class="px-2"><p>').text(moment.unix(response.daily[i].dt).format("MM/DD/YYYY"));
      var iconDisp = $("<p>").append('<img src="https://openweathermap.org/img/wn/' + response.daily[i].weather[0].icon + '.png" />');
      var tempDisp = $("<p>").text('Temp: ' + Math.round(response.daily[i].temp.day) + '°F');
      var humidityDisp = $("<p>").text('Humidity: ' + Math.round(response.daily[i].humidity) + '%');
      $(dateDisp).append("<p>", iconDisp, tempDisp, humidityDisp);
      
      $("#cityWeather5Day").append(dateDisp);
    }
  });
  navClick();
}

//listener looking if any city is searched for using the search button
$("#citysearch-form").on("submit", function (event) {
  event.preventDefault();
  searchedCity = $("#citySearch").val().trim();
  loadCitySummary(searchedCity);
});

//listener looking if any city is searched by hitting the enter button on keyboard
$("#citysearch-form").on("click", function () {  
  event.preventDefault();
  searchedCity = $("#citySearch").val().trim();
  loadCitySummary(searchedCity);
});

//function that loads the previously searched cities
function loadNav() {
  if (JSON.parse(localStorage.getItem("cityNames")) != null) {
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

//function to load the city that is clicked on from the left navigation
function navClick() {
  $("button").on("click", function () {
    loadCitySummary($(this).val());
  });
}

//This function saves only unique cities in the local storage that are searched for using the search box so that they can be loaded when the users returns next time 
function removeDupsAndSave(array) {
  var newArray = [];
  for (i = 0; i < array.length; i++) {
    if (!newArray.includes(array[i])) {
      newArray.push(array[i]);
    }
  }
  localStorage.setItem("cityNames", JSON.stringify(newArray));
}

//This function is used to clear memory items. This function is not being called from anywhere currently and is avialable to use if required
function clearLS() {
  localStorage.removeItem("cityNames");
  localStorage.removeItem("lastCity");
}

//clearLS();