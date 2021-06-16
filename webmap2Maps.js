// adding layer definition
const mAttr1 =  'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye,' +
    'Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
      mAttr2 = 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, ' +
			'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',

      mUrl1 = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      mUrl2 = 'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWljaGFlbGd0YWRlc3NlIiwiYSI6ImNrcGI5ZnBwNjA0OHYydnIzcTk0N3c0em0ifQ.jbKBBNxF3jk2KFDQ1GSq3A'; 

const satellite = L.tileLayer(mUrl1, {attribution: mAttr1}),
      streets = L.tileLayer(mUrl2, 
          {id: 'mapbox/streets-v11', 
           attribution: mAttr2, 
           tileSize: 512,
           zoomOffset: -1}),
      dark = L.tileLayer(mUrl2, 
          {id: 'mapbox/dark-v10', 
           attribution: mAttr2, 
           tileSize: 512,
           zoomOffset: -1})



  // initialize the map
  // in the setView the first two values are lat and lon
  // the last number is the level of zoom
  var map = L.map('map', {
    zoomDelta: 0.5,
    zoomControl: false,
    //maxBounds: bounds,
    //maxBoundsViscosity: 0.0
    layers: [satellite]
  }).setView([15, 0], 2);


  const baseLayers = {
    "Satellite": satellite,
    "Streets": streets,
    "Dark": dark
};

L.control.layers(baseLayers).addTo(map);

// full screen option
map.addControl(new L.Control.Fullscreen());

map.isFullscreen() // Is the map fullscreen?
map.toggleFullscreen() // Either go fullscreen, or cancel the existing fullscreen.

// `fullscreenchange` Event that's fired when entering or exiting fullscreen.
map.on('fullscreenchange', function () {
    if (map.isFullscreen()) {
        console.log('entered fullscreen');
    } else {
        console.log('exited fullscreen');
    }
});



  // custom zoom bar control that includes a Zoom Home function
L.Control.zoomHome = L.Control.extend({
    options: {
        position: 'topright',
        zoomInText: '+',
        zoomInTitle: 'Zoom in',
        zoomOutText: '-',
        zoomOutTitle: 'Zoom out',
        zoomHomeText: '<i class="fas fa-home" style="line-height:1.65;"></i>',
        zoomHomeTitle: 'Zoom home'
    },

    onAdd: function (map) {
        var controlName = 'gin-control-zoom',
            container = L.DomUtil.create('div', controlName + ' leaflet-bar'),
            options = this.options;

        this._zoomInButton = this._createButton(options.zoomInText, options.zoomInTitle,
        controlName + '-in', container, this._zoomIn);
        this._zoomHomeButton = this._createButton(options.zoomHomeText, options.zoomHomeTitle,
        controlName + '-home', container, this._zoomHome);
        this._zoomOutButton = this._createButton(options.zoomOutText, options.zoomOutTitle,
        controlName + '-out', container, this._zoomOut);

        this._updateDisabled();
        map.on('zoomend zoomlevelschange', this._updateDisabled, this);

        return container;
    },

    onRemove: function (map) {
        map.off('zoomend zoomlevelschange', this._updateDisabled, this);
    },

    _zoomIn: function (e) {
        this._map.zoomIn(e.shiftKey ? 3 : 1);
    },

    _zoomOut: function (e) {
        this._map.zoomOut(e.shiftKey ? 3 : 1);
    },

    _zoomHome: function (e) {
        map.setView([20, 0], 2);
    },

    _createButton: function (html, title, className, container, fn) {
        var link = L.DomUtil.create('a', className, container);
        link.innerHTML = html;
        link.href = '#';
        link.title = title;

        L.DomEvent.on(link, 'mousedown dblclick', L.DomEvent.stopPropagation)
            .on(link, 'click', L.DomEvent.stop)
            .on(link, 'click', fn, this)
            .on(link, 'click', this._refocusOnMap, this);

        return link;
    },

    _updateDisabled: function () {
        var map = this._map,
            className = 'leaflet-disabled';

        L.DomUtil.removeClass(this._zoomInButton, className);
        L.DomUtil.removeClass(this._zoomOutButton, className);

        if (map._zoom === map.getMinZoom()) {
            L.DomUtil.addClass(this._zoomOutButton, className);
        }
        if (map._zoom === map.getMaxZoom()) {
            L.DomUtil.addClass(this._zoomInButton, className);
        }
    }
});

// add the new control to the map
var zoomHome = new L.Control.zoomHome();
zoomHome.addTo(map);


// load GeoJSON from an external file
$.getJSON("./metadata/allMetadataV6.geojson",function(data){
  var surgeIcon = L.icon({
    iconUrl: 'circle-48.png',
    iconSize: [13, 13], // size of the icon
  });
  
  // add GeoJSON layer to the map once the file is loaded
  L.geoJson(data, {
    pointToLayer: function(feature,latlng){
      var marker = L.marker(latlng,{icon: surgeIcon});

      var popupText = "<h2 style = 'color: black;'>Station Metadata</h2>" + '<hr style = "width: 100%;">' +  
                      "<h4 style = 'color: black;'>Station Name:</h4>  "  
                      +feature.properties.tg + '<br/>' + "<h4 style = 'color: black;'>Lon/Lat:</h4>  "+ 
                      '[' +feature.geometry.coordinates[0] + ', ' + 
                      feature.geometry.coordinates[1] +  ']' +'<hr/>';

      // ereaint text
      popupText += (!feature.properties.eraintPath == "") ? 
      `<strong><a href= ${feature.properties.eraintPath} <h4>Surge: ERA-Interim ${feature.properties.eraintBest}</h4></a></strong>` : '';

      // era20c text
      popupText += (!feature.properties.era20cPath == "") ? 
      `<strong><a href= ${feature.properties.era20cPath} ><h4>Surge: ERA20C ${feature.properties.era20cBest}</h4></a></strong>` : '';

      // 20-CR text
      popupText += (!feature.properties.twcrPath == "") ?
      `<strong><a href= ${feature.properties.twcrPath} ><h4>Surge: 20-CR ${feature.properties.twcrBest}</h4></a></strong>` : '';

      // MERRA
      popupText += (!feature.properties.merraPath == "") ?
      `<strong><a href= ${feature.properties.merraPath} ><h4>Surge: MERRA ${feature.properties.merraBest}</h4></a></strong>` : '';

      // ERA5 text
      popupText += (!feature.properties.erafivePath == "") ?
      `<strong><a href= ${feature.properties.erafivePath} ><h4>Surge: ERA5 ${feature.properties.erafiveBest}</h4></a></strong>` : '';

      marker.bindPopup(popupText);

      return marker;
    }
  }).addTo(map);
});


  // // add search 
  // map.addControl( new L.Control.Search({
  //   url: 'https://nominatim.openstreetmap.org/search?format=json&accept-language=en-DE&q={s}',
  //   jsonpParam: 'json_callback',
  //   propertyName: 'display_name',
  //   propertyLoc: ['lat','lon'],
  //   markerLocation: true,
  //   autoType: true,
  //   autoCollapse: false,
  //   minLength: 2,
  //   zoom:10,
  //   text: 'Searching...',
  //   textCancel: 'Cancel',
  //   textErr: 'No Tide Gauge Found'
  // }) );

//   update page year
var d = new Date();
$("span.currentYear").text(d.getFullYear());
$("span").css("text-align", "center");