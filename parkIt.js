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
 * This function has to be manually called. 
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