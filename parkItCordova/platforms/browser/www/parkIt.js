/* 
 * Main JS script for Park It app
 */
var latitude;
var longitude;
var parkedLatitude;
var parkedLongitude;
var storage;

/**
 * Custom init function
 * This function has to be manually called. It is called on body.onload event
 * @returns {undefined}
 */
function init() {
    // Core javascript
    // Cordova deviceready event: When Cordova is fully loaded & the device is ready
    document.addEventListener("deviceready", onDeviceReady);
    // localStorage: Web storage object for storing data on the client (i.e. Web browser)
    storage = window.localStorage;
}

/**
 * deviceready event listener
 */
function onDeviceReady() {
    var node = document.createElement('link');
    node.setAttribute('rel', 'stylesheet');
    node.setAttribute('type', 'text/css');
    if(cordova.platformId == 'ios'){
        node.setAttribute('href', 'parkItIOS.css');
        // Cordova status bar plugin which provide an object to customise iOS & android status bar
        window.StatusBar.overlaysWebView(false);
        // Style it in a default way - use a default status bar
        window.StatusBar.styleDefault();
    }
    else{
        node.setAttribute('href', 'parkItAndroid.css');
        // Set background colour of status bar for Android devices
        window.StatusBar.backgroundColorByHexString('#1565C0');
    }
    
    // Load the device specific CSS dynamically
    document.getElementsByTagName('head')[0].appendChild(node);
}

/**
 * A function to set styling for an element
 * 
 * @param String elementId ID of the element where styling has to apply
 * @param String property CSS property 
 * @param String value CSS value to apply
 * @returns {undefined}
 */
function setCSS(elementId, property, value) {
    var elementStyle = document.getElementById(elementId).style;
    elementStyle.setProperty(property, value);
}

/**
 * setParkingLocation() function which is called when 'Park' button is clicked
 * @returns {undefined}
 */
function setParkingLocation() {
    // HTML5 Geolocation API is used to locate a user's position
    // Arguments: Success callback function, Error callback function, Configuration data (JSON)
    navigator.geolocation.getCurrentPosition(setParkingLocationSuccess, locationError, {enableHighAccuracy: true});
}

/**
 * Success callback for getCurrentPosition()
 * 
 * @param Position position Succes callback will automatically provide Position object as a parameter
 * @returns {undefined}
 */
function setParkingLocationSuccess(position) {
    // Retrieve latitude & longitude from the position object
    latitude = position.coords.latitude;
    longitude = position.coords.longitude;
    // Store the data in browser local storage
    storage.setItem('parkedLatitude', latitude);
    storage.setItem('parkedLongitude', longitude);
    navigator.notification.alert('The parking location is successfully saved');
    showParkingLocation();
}

/**
 * Error callback function for getCurrentPosition().
 * 
 * This function will be called if there is any error in fetching the current position
 * 
 * @param Error error An error object will be automatically provided as a parameter
 * @returns {undefined}
 */
function locationError(error) {
    // Cordova notification dialogs library
    navigator.notification.alert('Error code: ' + error.code + '\nError message: ' + error.message);
}

/**
 * Function to display the map (with current parking location)
 * 
 * @returns {undefined}
 */
function showParkingLocation() {
    // Before displaying the map, hide unnecessary clutter
    setCSS('instructions', 'display', 'none');
    setCSS('directions', 'visibility', 'hidden');
    
    var latLong = new google.maps.LatLng(latitude, longitude);
    // Create a new Google map inside the speicified <div>
    var map = new google.maps.Map(document.getElementById('map'));
    map.setZoom(16);
    map.setCenter(latLong);
    // Create a new Marker to be displayed in the map
    var marker = new google.maps.Marker({
        position: latLong,
        map: map
    });
    
    setCSS('map', 'visibility', 'visible');
}

/**
 * Get the stored parking location from local storage
 * 
 * @returns {undefined}
 */
function getParkingLocation() {
    navigator.geolocation.getCurrentPosition(getParkingLocationSuccess, locationError, {enableHighAccuracy: true});
}

/**
 * Success callback for getParkingLocation()
 * 
 * Fetches the current location & parking location (from local storage)
 * 
 * @param Position position
 * @returns {undefined}
 */
function getParkingLocationSuccess(position) {
    latitude = position.coords.latitude;
    longitude = position.coords.longitude;
    parkedLatitude = storage.getItem('parkedLatitude');
    parkedLongitude = storage.getItem('parkedLongitude');
    showDirection();
}

function showDirection() {
    // Object drawing directions on a map
    var dRenderer = new google.maps.DirectionsRenderer;
    // Object to calculate route/directions
    var dService = new google.maps.DirectionsService;
    var curLatLong = new google.maps.LatLng(latitude, longitude);
    var parkedLatLong = new google.maps.LatLng(parkedLatitude, parkedLongitude);
    // Create a map on this div
    var map = new google.maps.Map(document.getElementById('map'));
    map.setZoom(16);
    map.setCenter(curLatLong);
    // Calculate the route
    dService.route({
        origin: curLatLong,
        destination: parkedLatLong,
        travelMode: 'DRIVING'
    }, function(response, status) {
        if(status == 'OK') {
            // The drawing object will draw this directions
            dRenderer.setDirections(response);
            document.getElementById('directions').innerHTML = '';
            // Draw on to this panel/div
            dRenderer.setPanel(document.getElementById('directions'));
        }
        else {
            navigator.notification.alert('Directions failed due to: ' + status);
        }
    });
    
    setCSS('instructions', 'display', 'none');
    setCSS('map', 'visibility', 'visible');
    setCSS('directions', 'visibility', 'visible');
}