  // initialize the map
  // in the setView the first two values are lat and lon
  // the last number is the level of zoom
  var map = L.map('map', {
    zoomDelta: 0.5,
    zoomControl: false
    //maxBounds: bounds,
    //maxBoundsViscosity: 0.0
  }).setView([20, 0], 2);


  // load a tile layer
  L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    // maxZoom = 18,
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',

  }).addTo(map);

  
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
  $.getJSON("./metadata/allMetadataV2.geojson",function(data){
    var surgeIcon = L.icon({
      iconUrl: 'circle-48.png',
      iconSize: [13, 13], // size of the icon
    });
    
    // add GeoJSON layer to the map once the file is loaded
    L.geoJson(data, {
      pointToLayer: function(feature,latlng){
        var marker = L.marker(latlng,{icon: surgeIcon});
        marker.bindPopup( "<h2>Station Metadata</h2>" + '<hr/>' +  "<h4>Station Name:</h4>  "  
        +feature.properties.tg + '<br/>' + "<h4>Lon/Lat:</h4>  "+ '[' +feature.properties.lon + ', ' + 
        feature.properties.lat +  ']' +'<hr/>' + 
        
          // ERA-Int
         '<a href= ' + feature.properties.eraintPath + '><h4>Surge: ERA-Interim</h4></a>' + 
        //  "<h4>Model Forcing:</h4>  " + "<span id = 'eraint'>ERA-Interim</span>  - " + feature.properties.yrEraint + " years" + '<br/>' + 
        //  '<hr/>' +
         
          // ERA20C
         '<a href= ' + feature.properties.era20cPath + '><h4>Surge: ERA20C</h4></a>' + 
        //  "<h4>Model Forcing:</h4>  " + "<span id = 'era20c'>ERA-20C</span>  - " + feature.properties.yrEra20c + " years" + '<br/>' +
        //  '<hr/>' +
         
        //  20thCR
         '<a href= ' + feature.properties.twcrPath + '><h4>Surge: 20thCR</h4></a>' 
         +
         //  MERRA
         '<a href= ' + feature.properties.merraPath + '><h4>Surge: MERRA</h4></a>' 
        //  "<h4>Model Forcing:</h4>  " + "<span id = 'twcr'>20thCR</span>  - " + feature.properties.yrTwcr + " years" + '<br/>'
         );
        return marker;
      }
    }).addTo(map);
  });
 

//   update page year
var d = new Date();
$("span.currentYear").text(d.getFullYear());
$("span").css("text-align", "center");