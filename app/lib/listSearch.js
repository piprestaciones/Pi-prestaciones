var data          = require('data'),
    eventData     = data.get('eventData'),
    ui            = require('ui'),
    listItemWidth = ui.screenWidth() - 20,
    listView      = null,
    listData      = [],
    backgroundColor = eventData.styles.button_background,
    color         = eventData.styles.button_foreground,
    listTemplate  = null;

function getTemplate() {
	return {
	    childTemplates: [
	        {
	            type: 'Ti.UI.Label',
	            bindId: 'info',
	            properties: {
	                borderWidth: 0,
	                backgroundColor: backgroundColor,
	                color: color,
	                left: 10,
	                font: { fontSize: 18 },
	                height: Ti.UI.FILL,
	                width: listItemWidth
	            }
	        }
	    ]
	};
}

listTemplate = getTemplate();

exports.setBackgroundColor = function (newColor) {
	backgroundColor = newColor;
	
	listTemplate = getTemplate();
};

exports.setColor = function (newColor) {
	color = newColor;
	
	listTemplate = getTemplate();
};

exports.setData = function (data) {
	listData = data;
};

exports.setListView = function (newListView) {
	listView = newListView;
	
	listView.setBackgroundColor(backgroundColor);
	
	if (listView.setTemplates) {
		listView.setTemplates({ 'template': listTemplate });
	}
	
	listView.setDefaultItemTemplate('template');
};

exports.setClickHandler = function (callback) {
	listView.addEventListener('itemclick', function (e) {
        var item = e.section.getItemAt(e.itemIndex);

        var id      = item.properties.id;
        var title   = item.properties.title;

        callback(id, title);
    });
};

exports.displayResults = displayResults;

exports.filter = function (query) {
	var results = [];
	
	for (var i in listData) {
		if ( matchesCriteria(listData[i], query) ) {
			results.push(listData[i]);
		}
	}
	
	displayResults(results);
};

function matchesCriteria(subject, search) {
	search = search.toLowerCase();
	
	if (subject.title.toLowerCase().indexOf(search) >= 0) {
		return true;
	}
	
	if (! subject.items) {
		return false;
	}
	
	for (var i = 0; i < subject.items.length; i++) {
		if ((subject.items[i].type != 'paragraph') && (subject.items[i].type != 'paragraph')) {
			continue;
		}
		
		if (subject.items[i].value.toLowerCase().indexOf(search) >= 0) {
			return true;
		}
	}
	
	return false;
}

function noResults() {
	var section = Ti.UI.createListSection({ headerTitle: 'No se encontraron resultados' });
	
	listView.setSections([ section ]);
}

function displayResults(results) {
	if (! results.length) {
		noResults();
		
		return;
	}
	
	var sections = [],
		section  = null,
		dataSet  = [],
		currentDay = null;

    results.forEach(function (result) {
    	if (currentDay != result.date) {
    		if (section) {
    			section.setItems(dataSet);
    			sections.push(section);
    			
    			dataSet = [];
    			
    			section = null;
    		}
    		
    		sections.push(createSection(result.date));
    		
    		currentDay = result.date;
    	}
    	
    	if ((! section) || (section.getHeaderTitle() != result.startTime)) {
    		if (section) {
    			section.setItems(dataSet);
    			sections.push(section);
    			
    			dataSet = [];
    		}
    		
    		section = createSection(result.startTime + ' - ' + result.endTime);
    	}
    	
    	dataSet.push({
            info: {
                text: result.title
            },
            properties: {
                id: result.id,
                title: result.title,
                backgroundColor: backgroundColor,
                color: color,
                font: {
                	fontSize: 20
                }
            }
        });
    });
    
    if (dataSet.length) {
    	section.setItems(dataSet);
    }

    sections.push(section);

    listView.setSections(sections);
}

function createSection(title) {
	var props = title ? { headerTitle: title } : {};
	
	return Ti.UI.createListSection();
}
