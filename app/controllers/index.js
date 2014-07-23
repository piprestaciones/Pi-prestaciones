$.index.open();

var piApi = require('pi');

piApi.loadEvents(function (events) {
    if (events === false) {
        alert('Error de conexión');
    }
    
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
    
    var relativeHeight = Math.round(Ti.Platform.displayCaps.platformWidth * 200 / 800);
    
    var quantity = 0, top = 0, button = null;
    for (var i in events) {
        
        button = Ti.UI.createButton({
            image: events[i].image,
            top: 10,
            width: '100%',
            height: relativeHeight,
            style: Titanium.UI.iPhone.SystemButtonStyle.PLAIN,
            idEvent: events[i].id       
        });
        
        button.addEventListener('click', function (e) {
            //this.idEvent
            $.index.hide();
            
            var win = Alloy.createController('event').getView();
            win.open();
        });
        
        $.eventsView.add(button);
        
        quantity++;
    }
    
    $.eventsView.setHeight((events.length * relativeHeight) + (events.length * 10));
});
