var piApi       = require('pi');
var data        = require('data');
var loading     = require('loadingWindow');
var cachedImage = require('cachedImage');
var eventList   = null;

var screenWidth 	= Ti.Platform.displayCaps.platformWidth; 
var screenHeight	= Ti.Platform.displayCaps.platformHeight;

if (Titanium.Platform.osname == 'android') {
    screenWidth 	= pxToDP(screenWidth);
    screenHeight 	= pxToDP(screenHeight);
}

$.index.open();

loading.open();

piApi.loadEvents(function (events) {
    
    if (events === false) {
        return generateErrorMessage();
    }
    
    eventList = events;
    
    if (! events.length) {
        
        var emptyLabel = Ti.UI.createLabel({
            text: 'No se encontraron eventos.',
            top: '5dp',
            font: {
                fontSize: '12dp'
            },
            color: 'white',
            textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
            width: '100%'
        });
        
        $.eventsView.add(emptyLabel);
        
        return;
    }
    
    var  buttonOptions  = null,
         relativeHeight = null,
         relativeWidth  = null,
         buttonData     = null,
         image          = null,
         imageInfo      = null;
         
    if (events.length == 1) {
        $.index.remove($.logoContainer);
        $.index.remove($.congressTitle);
        $.index.remove($.eventsScrollView);
        
        image       = events[0].image_full;
        imageInfo   = events[0].image_full_info;
        
        if (Titanium.Platform.osname == 'android') {
            relativeHeight = Math.round(Ti.Platform.displayCaps.platformWidth * imageInfo.height / imageInfo.width) + 'px';
        } else {
            relativeHeight = Math.round(Ti.Platform.displayCaps.platformWidth * imageInfo.height / imageInfo.width);        
        }
        
        buttonData = {
            height: relativeHeight,
            event: events[0]
        }
        
        cachedImage.load(image, function (imagePath, data) {
            loading.close();
            
            addButton(data.event, {
                backgroundImage: imagePath,
                top: 0,
                left: 0,
                width: '100%',
                height: data.height,
                style: Titanium.UI.iPhone.SystemButtonStyle.PLAIN,        
            }, $.index);
            
        }, $.index, buttonData);
    }
    else if (events.length == 2) {
        $.index.remove($.logoContainer);
        $.index.remove($.congressTitle);
        $.index.remove($.eventsScrollView);
        
        for (var i = 0; i < events.length; i++) {
            image       = events[i].image_half;
            imageInfo   = events[i].image_half_info;;
            
            relativeHeight 	= Math.round(screenHeight / 2);
			relativeWidth	= Math.round(relativeHeight * pxToDP(imageInfo.width) / pxToDP(imageInfo.height));
			
			if (relativeWidth > screenWidth) {
				relativeWidth 	= screenWidth;
				relativeHeight	= Math.round(relativeWidth * pxToDP(imageInfo.height) / pxToDP(imageInfo.width));
			}        
            
            buttonData = {
                height: relativeHeight,
                width: relativeWidth,
                event: events[i]
            }
            
            cachedImage.load(image, function (imagePath, data) {
                
                loading.close();
                
                addButton(data.event, {
                    backgroundImage: imagePath,
                    width: data.width,
                    height: data.height,
                    style: Titanium.UI.iPhone.SystemButtonStyle.PLAIN,        
                }, $.index);
                    
            }, $.index, buttonData);
            
        }
        
    }
    else {
    	
    	loading.close();
        
        for (var i = 0; i < events.length; i++) {
            
            if (Titanium.Platform.osname == 'android') {
                relativeHeight = Math.round(Ti.Platform.displayCaps.platformWidth * events[i].image_info.height / events[i].image_info.width) + 'px';
            } else {
                relativeHeight = Math.round(Ti.Platform.displayCaps.platformWidth * events[i].image_info.height / events[i].image_info.width);        
            }
            
            console.log(events[i].image);
            
            buttonOptions = {
                backgroundImage: events[i].image,
                borderRadius: 15,
                top: 10,
                left: '5%',
                width: '90%',
                height: relativeHeight,
                style: Titanium.UI.iPhone.SystemButtonStyle.PLAIN,        
            };
            
            addButton(events[i], buttonOptions);
        }
    }
});

function addButton(event, buttonOptions, appendTo) {
    
    var button = null;
    
    buttonOptions.idEvent = event.id; 
    
    button = Ti.UI.createButton(buttonOptions);
    
    button.addEventListener('click', function (e) {
        var selectedEvent = null;
        
        //this.idEvent
        for (var i in eventList) {
            if (eventList[i].id == this.idEvent) {
                selectedEvent = eventList[i];
                break; 
            }
        }
        
        data.set('event', selectedEvent);
        
        if (eventDetailLoaded == false) {
    		loading.open();
    	}
        
        piApi.getEventDetail(selectedEvent.id, function (eventData) {
        	if (eventDetailLoaded == false) {
        		loading.close();
        	}
            
            eventDetailLoaded = true;
            
            data.set('eventData', eventData);
            
            var win = Alloy.createController('event').getView();
            
            win.open({
                animated: true
            });                
        });
    });
    
    var containerView = Ti.UI.createView({
        width: '100%',
        height: Ti.UI.SIZE,
        backgroundColor: 'white',
        top: 0,
        left: 0
    });
    
    containerView.add(button);
    
    if (typeof appendTo != 'undefined') {
        appendTo.add(containerView);
    } else {
        $.eventsView.add(containerView);
    }
}

function generateErrorMessage() {
	var errorTitle,
		errorMessage,
		lang = Titanium.Locale.currentLanguage.toLowerCase();
		
	$.congressTitle.hide();
	
	if (lang.indexOf('es') >= 0) {
		errorTitle   = 'Error de datos';
		errorMessage = 'No podemos contactar nuestros servidores. Por favor verifique su conexión a Internet e inténtelo nuevamente más tarde.';
	} else {
		errorTitle   = 'Network error';
		errorMessage = 'We can\'t reach our servers. Please verify your Internet connection and try again later.';
	}
	
	loading.close();
	
	$.index.setTitle(errorTitle);
	
	var label = Ti.UI.createLabel({
        text: errorMessage,
        textAlign: 'center'
    });
	
	$.eventsView.add(label);
}

var eventDetailLoaded = false;

function pxToDP(px) {
    return (px / (Titanium.Platform.displayCaps.dpi / 160));
}