function __processArg(obj, key) {
    var arg = null;
    if (obj) {
        arg = obj[key] || null;
        delete obj[key];
    }
    return arg;
}

function Controller() {
    function generateEventWindow(event) {
        if (!event) {
            $.eventNavigationWindow.close();
            return;
        }
        eventData = event;
        var windowReference = null;
        if ("android" == Titanium.Platform.osname) {
            $.eventNavigationWindow.setTitle(event.title);
            $.eventScrollView.setBackgroundColor(event.styles.background);
        } else {
            $.eventWindow.setTitle(event.title);
            $.eventScrollView.setBackgroundColor(event.styles.background);
            windowReference = $.eventNavigationWindow;
        }
        data.set("windowReference", windowReference);
        var image = Ti.UI.createImageView({
            image: event.image,
            width: "100%"
        });
        $.logoContainer.add(image);
        var label = "";
        pageId = 0, j = null;
        for (var item in event.order) {
            if ("page_" == event.order[item].substring(0, 5)) {
                pageId = event.order[item].match("[0-9]+")[0];
                for (j in event.pages) {
                    if (event.pages[j].id != pageId) continue;
                    addEventMenuItem({
                        icon: event.pages[j].icon,
                        label: event.pages[j].title,
                        onClick: function(e) {
                            var page = null, title = e.source.getTitle();
                            for (var i in eventData.pages) if (eventData.pages[i].title == title) {
                                page = eventData.pages[i];
                                break;
                            }
                            data.set("page", page);
                            var window = Alloy.createController("page").getView();
                            "android" == Titanium.Platform.osname ? window.open({
                                modal: true
                            }) : $.eventNavigationWindow.openWindow(window, {
                                animated: true
                            });
                        }
                    });
                }
            }
            switch (event.order[item]) {
              case "home":
                addEventMenuItem({
                    icon: event.home_icon,
                    label: "Inicio",
                    onClick: function() {
                        $.eventNavigationWindow.close();
                    }
                });
                break;

              case "form":
                if (event.form) {
                    label = event.form_label || "Inscripción online";
                    addEventMenuItem({
                        icon: event.form_icon,
                        label: label,
                        controller: "form"
                    });
                }
                break;

              case "certificate":
                if (event.certificate) {
                    label = event.certificate_label || "Certificación web";
                    addEventMenuItem({
                        icon: event.certificate_icon,
                        label: label,
                        controller: "certificate"
                    });
                }
                break;

              case "favorites":
                if (event.agenda_label) {
                    label = event.favorites_label || "Favoritos";
                    addEventMenuItem({
                        icon: event.favorites_icon,
                        label: label,
                        controller: "favorite"
                    });
                }
                break;

              case "link":
                if (event.link_url) {
                    label = event.link_label || "Link";
                    addEventMenuItem({
                        icon: event.link_icon,
                        label: label,
                        controller: "link"
                    });
                }
                break;

              case "accommodations":
                if (event.accommodations_label) {
                    label = event.accommodations_label || "Alojamientos";
                    addEventMenuItem({
                        icon: event.accommodations_icon,
                        label: label,
                        controller: "accommodations"
                    });
                }
                break;

              case "map":
                if (event.map_label) {
                    label = event.map_label || "Ubicación";
                    addEventMenuItem({
                        icon: event.map_icon,
                        label: label,
                        controller: "map"
                    });
                }
                break;

              case "agenda":
                if (event.agenda_label) {
                    label = event.agenda_label || "Agenda";
                    addEventMenuItem({
                        icon: event.agenda_icon,
                        label: label,
                        controller: "agenda"
                    });
                }
            }
        }
        $.eventView.add(Ti.UI.createView({
            height: 10,
            width: "100%",
            left: 0,
            top: 0
        }));
    }
    function addEventMenuItem(item) {
        var button = Titanium.UI.createButton({
            title: item.label,
            width: Ti.UI.FILL,
            height: 40,
            textAlign: "left",
            backgroundColor: "transparent",
            borderColor: "transparent",
            borderWidth: 0,
            color: eventData.styles.button_foreground,
            top: 0,
            left: 0
        });
        var icon = Ti.UI.createImageView({
            image: "/icons" + item.icon,
            width: 30,
            height: 30,
            left: 10,
            top: 5
        });
        var viewWidth = Titanium.Platform.displayCaps.platformWidth - 40, viewLeft = 20;
        "android" == Titanium.Platform.osname && (viewWidth = Titanium.Platform.displayCaps.platformWidth / (Titanium.Platform.displayCaps.dpi / 160) - 40);
        var topPosition = firstButton ? 20 : 10;
        var view = Titanium.UI.createView({
            borderRadius: 5,
            layout: "horizontal",
            top: topPosition,
            left: viewLeft,
            width: viewWidth,
            height: 40,
            backgroundColor: eventData.styles.button_background
        });
        view.add(icon);
        view.add(button);
        item.controller ? button.addEventListener("click", function() {
            var window = Alloy.createController(item.controller).getView();
            "android" == Titanium.Platform.osname ? window.open({
                modal: true
            }) : $.eventNavigationWindow.openWindow(window, {
                animated: true
            });
        }) : item.onClick ? button.addEventListener("click", item.onClick) : item.window && button.addEventListener("click", function() {
            "android" == Titanium.Platform.osname ? item.window.open({
                modal: true
            }) : $.eventNavigationWindow.openWindow(item.window, {
                animated: true
            });
        });
        $.eventView.add(view);
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "event";
    if (arguments[0]) {
        {
            __processArg(arguments[0], "__parentSymbol");
        }
        {
            __processArg(arguments[0], "$model");
        }
        {
            __processArg(arguments[0], "__itemTemplate");
        }
    }
    var $ = this;
    var exports = {};
    $.__views.eventWindow = Ti.UI.createWindow({
        backgroundColor: "white",
        orientationModes: [ Ti.UI.PORTRAIT ],
        layout: "vertical",
        top: 0,
        width: "100%",
        height: Ti.UI.FILL,
        id: "eventWindow"
    });
    $.__views.logoContainer = Ti.UI.createView({
        top: 20,
        left: 0,
        backgroundColor: "white",
        width: "100%",
        height: Ti.UI.SIZE,
        id: "logoContainer"
    });
    $.__views.eventWindow.add($.__views.logoContainer);
    $.__views.eventScrollView = Ti.UI.createScrollView({
        top: 20,
        left: 0,
        height: Ti.UI.FILL,
        layout: "vertical",
        width: "100%",
        id: "eventScrollView"
    });
    $.__views.eventWindow.add($.__views.eventScrollView);
    $.__views.eventView = Ti.UI.createView({
        height: Ti.UI.SIZE,
        layout: "vertical",
        top: 0,
        id: "eventView"
    });
    $.__views.eventScrollView.add($.__views.eventView);
    $.__views.__alloyId0 = Ti.UI.createView({
        height: 15,
        id: "__alloyId0"
    });
    $.__views.eventScrollView.add($.__views.__alloyId0);
    $.__views.eventNavigationWindow = Ti.UI.iOS.createNavigationWindow({
        backgroundColor: "white",
        orientationModes: [ Ti.UI.PORTRAIT ],
        layout: "vertical",
        top: 0,
        width: "100%",
        height: Ti.UI.FILL,
        window: $.__views.eventWindow,
        id: "eventNavigationWindow"
    });
    $.__views.eventNavigationWindow && $.addTopLevelView($.__views.eventNavigationWindow);
    exports.destroy = function() {};
    _.extend($, $.__views);
    arguments[0] || {};
    {
        var data = (require("pi"), require("data"));
        require("ui");
    }
    {
        var eventData = data.get("eventData");
        data.get("event");
    }
    generateEventWindow(eventData);
    var firstButton = false;
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;