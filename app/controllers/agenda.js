var args = arguments[0] || {};

var data            = require('data'),
    eventData       = data.get('eventData'),
    windowReference = data.get('windowReference'),
    listSearch      = require('listSearch');
        
var agendaOnclick = function (id, title) {
    var item = eventData.agenda_details[id];
    
    if ((! item) || (! item.items)) {
        return;
    }
    
    data.set('agendaItem', item);
    
    var detailWindow = Alloy.createController('agendaDetail').getView();
    
    if (Titanium.Platform.osname == 'android') {
        detailWindow.open({
            modal: true
        });
    } else {
        windowReference.openWindow(detailWindow, { animated:true });
    }
};

$.searchContainer.setBackgroundColor(eventData.agenda_background || eventData.styles.button_background);
$.agendaContainer.setBackgroundColor(eventData.agenda_background || eventData.styles.button_background);
$.searchResultsContainer.setBackgroundColor(eventData.agenda_background || eventData.styles.button_background);

var isSearchVisible = false;

$.searchField.addEventListener('change', function () {
	if ($.searchField.getValue()) {
		
		if (! isSearchVisible) {
			$.agendaContainer.hide();
			$.searchResultsContainer.show();
			
			isSearchVisible = true;
		}
		
		
		listSearch.filter($.searchField.getValue());
	} else {
		$.agendaContainer.show();
		$.searchResultsContainer.hide();
		
		isSearchVisible = false;
	}
	
});

/* Initialize search */
$.searchResultsContainer.hide();

var heightAdjustment = IOS ? 45 : 0;

$.agendaContainer.addEventListener('postlayout', function () {
	if (! $.searchResultsContainer.getHeight()) {
		$.searchResultsContainer.setHeight($.agendaContainer.getSize().height - heightAdjustment);
		$.agendaContainer.setHeight($.agendaContainer.getSize().height - heightAdjustment);
	}
});

listSearch.setBackgroundColor(eventData.agenda_background || eventData.styles.button_background);
listSearch.setColor(eventData.agenda_color || eventData.styles.button_foreground);

listSearch.setListView($.searchResults);
listSearch.setClickHandler(agendaOnclick);
listSearch.setData(eventData.agenda_details);

/* Initialize list */
var listNavigation = require('listNavigation');

listNavigation.add(
    eventData.agenda_label,
    eventData.agenda,
    agendaOnclick,
    windowReference,
    eventData.styles.button_background,
    $.agendaContainer,
    'agenda'
);