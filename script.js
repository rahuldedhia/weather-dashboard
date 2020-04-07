var searchedCity;

$(document).ready(function () {


  for (var i = 0; i < 5; i++) {
    var navCity = $("<li>");
    navCity.addClass("nav-item navbox");
    navCity.append('<a class="nav-link" href="#">City Placeholder</a>');
    $("#cityList").append(navCity);
  }


  $("#cityWeatherSummary").append();

  $("#cityWeather5Day").append();


  //localStorage.setItem("key", value);
  //localStorage.getItem("key");
  //localStorage.removeItem("key");

});
