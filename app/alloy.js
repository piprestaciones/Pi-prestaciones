var IOS = (Ti.Platform.osname === 'iphone' || Ti.Platform.osname === 'ipad');
var ANDROID = (Ti.Platform.osname === 'android');

if (ANDROID) {
    setupAndroidPushNotifications();
} else {
    setupIosPushNotifications();
}

var deviceToken = null;

function setupAndroidPushNotifications() {
    // Require the module
    var CloudPush = require('ti.cloudpush');
     
    // Initialize the module
    CloudPush.retrieveDeviceToken({
        success: deviceTokenSuccess,
        error: deviceTokenError
    });
    
    // Enable push notifications for this device
    // Save the device token for subsequent API calls
    function deviceTokenSuccess(e) {
        deviceToken = e.deviceToken;
        
        subscribleToChannels();
    }
    function deviceTokenError(e) {
    	console.log('------------------------------------------------------------------------');
        console.log('Failed to register for push notifications! ' + e.error);
        console.log('------------------------------------------------------------------------');
    }
     
    // Process incoming push notifications
    CloudPush.addEventListener('callback', function (evt) {
        //alert("Notification received: " + evt.payload);
        processAndroidNotification(evt.payload);
    });
}

function setupIosPushNotifications() {
    // Check if the device is running iOS 8 or later
    if (Ti.Platform.name == "iPhone OS" && parseInt(Ti.Platform.version.split(".")[0]) >= 8) {
     
        // Wait for user settings to be registered before registering for push notifications
	    Ti.App.iOS.addEventListener('usernotificationsettings', function registerForPush() {
	 
	        // Remove event listener once registered for push notifications
	        Ti.App.iOS.removeEventListener('usernotificationsettings', registerForPush); 
	 
	        Ti.Network.registerForPushNotifications({
	            success: deviceTokenSuccess,
	            error: deviceTokenError,
	            callback: receivePush
	        });
	    });
         
        // Register notification types to use
        Ti.App.iOS.registerUserNotificationSettings({
            types: [
                Ti.App.iOS.USER_NOTIFICATION_TYPE_ALERT,
                Ti.App.iOS.USER_NOTIFICATION_TYPE_SOUND,
                Ti.App.iOS.USER_NOTIFICATION_TYPE_BADGE
            ]
        });
    } else {
        Ti.Network.registerForPushNotifications({
     // Specifies which notifications to receive
            types: [
                Ti.Network.NOTIFICATION_TYPE_BADGE,
                Ti.Network.NOTIFICATION_TYPE_ALERT,
                Ti.Network.NOTIFICATION_TYPE_SOUND
            ],
            success: deviceTokenSuccess,
            error: deviceTokenError,
            callback: receivePush
        });
    }
    // Process incoming push notifications
    function receivePush(e) {
        processIosNotification(e);
    }
    // Save the device token for subsequent API calls
    function deviceTokenSuccess(e) {
    	deviceToken = e.deviceToken;
        
        subscribleToChannels();
    }
    function deviceTokenError(e) {
    	console.log('------------------------------------------------------------------------');
        console.log('Failed to register for push notifications! ' + e.error);
        console.log('------------------------------------------------------------------------');
    }
}

function subscribleToChannels() {
    var Cloud = require("ti.cloud");
    
    // Subscribes the device to the 'news_alerts' channel
    // Specify the push type as either 'android' for Android or 'ios' for iOS
    Cloud.PushNotifications.subscribeToken({
        device_token: deviceToken,
        channel: 'pi',
        type: Ti.Platform.name == 'android' ? 'android' : 'ios'
    }, function (e) {
        if (e.success) {
        	console.log('------------------------------------------------------------------------');
            console.log('Subscribed');
            console.log('------------------------------------------------------------------------');
        } else {
        	console.log('------------------------------------------------------------------------');
            console.log('Error:\n' + ((e.error && e.message) || JSON.stringify(e)));
            console.log('------------------------------------------------------------------------');
        }
    });
}

//var piApi = require('pi');

function processAndroidNotification(payload) {
	//console.log('------------------------------------------------------------------------');
    //console.log(payload);
    //console.log('------------------------------------------------------------------------');
    
    //piApi.refresh();
}

function processIosNotification(payload) {
	//console.log('------------------------------------------------------------------------');
    //console.log(payload);
    //console.log('------------------------------------------------------------------------');
    
    //piApi.refresh();
}
