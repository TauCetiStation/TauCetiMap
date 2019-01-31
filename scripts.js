var defaultMap = "2017";
var leafletMap;

window.onload = function(){
	
	//check hash for map name
	//todo: layer parameter
	var initMap = window.location.hash ? window.location.hash.split('#')[1] : defaultMap;
	mapInit(initMap);
	
	window.addEventListener("hashchange", function () {
		mapInit(window.location.hash.split('#')[1]);
	});
	
};

var mapLayers = [
	{
		"Name": "2017",//folder in tiles-layers/
		"Base": {
			"Station map": "full",//title: subfolder
			"Schematic": "schematic"
		},
		"Overlay": {
			"Disposal": "disposal",
			"Pipes": "pipes",
			"Power net": "power",
			"Titles": "titles"
		}
	},
	{
		"Name": "2016",//folder in tiles-layers/
		"Base": {
			"Station map": "full",//title: subfolder
			"Schematic": "schematic"
		},
		"Overlay": {
			"Disposal": "disposal",
			"Pipes": "pipes",
			"Power net": "power",
			"Titles": "titles"
		}
	},
	{
		"Name": "2015",
		"Base": {
			"Station map": "full",
			"Schematic": "schematic"
		},
		"Overlay": {
			"Disposal": "disposal",
			"Pipes": "pipes",
			"Power net": "power",
			"Titles": "titles"
		}
	},
	{
		"Name": "2014",
		"Base": {
			"Station map": "full",
			"Schematic": "schematic"
		},
		"Overlay": {
			"Disposal": "disposal",
			"Pipes": "pipes",
			"Power net": "power",
			"Titles": "titles"
		}
	},
	{
		"Name": "Marines",
		"Base": {
			"Station map": "marines",
			"NMV SULACO": "sulaco"
		}
	},
];

var mapLayersLookup = {};
for (var i = 0; i < mapLayers.length; i++) {
	mapLayersLookup[mapLayers[i].Name] = mapLayers[i];
}

function mapInit(mapName) {
	if(!mapName || !mapLayersLookup[mapName]) {
		mapName = defaultMap;
	}
	
	var layers = mapLayersLookup[mapName];
	
	if(leafletMap) {
		leafletMap.off();
		leafletMap.remove();
	}
	
	leafletMap = L.map('map', {zoomAnimation: true, minZoom: 3, maxZoom: 5, crs: L.CRS.Simple}).setView([-125, 0], 3);
	
	var path;
	//base layers
	var baseMaps = {};
	for (layer in layers["Base"]) {
		path = 'tiles-layers/'+mapName+'/'+layers["Base"][layer]+'/{z}/{x}/{y}.png';
		baseMaps[layer] = new L.tileLayer(path, {
			attribution: '&copy; <a href="http://tauceti.ru/">TauCeti.ru</a>',
			errorTileUrl: 'images/space.png'
		});
	};
	
	//overlays (optional)
	var overlayMaps;
	if(layers["Overlay"]) {
		 overlayMaps = {};
		for (layer in layers["Overlay"]) {
			path = 'tiles-layers/'+mapName+'/'+layers["Overlay"][layer]+'/{z}/{x}/{y}.png';
			
			if(layer=="Titles"){
				overlayMaps[layer] = new L.tileLayer(path, {opacity: 0.75});
			} else {
				overlayMaps[layer] = new L.tileLayer(path);
			};
			
		};
	};
	
	//custom control - map switch
	var mapSwitch = L.control({position: 'topright'});
	mapSwitch.onAdd = function(){
		
		var container = L.DomUtil.create('select', 'leaflet-bar leaflet-control leaflet-map-switch');
		var options = "";
		for (var i = 0; i < mapLayers.length; i++) {
			if(mapLayers[i].Name==mapName) {
				options += '<option value="'+mapLayers[i].Name+'" selected>'+mapLayers[i].Name+'</option>';
			} else {
				options += '<option value="'+mapLayers[i].Name+'">'+mapLayers[i].Name+'</option>';
			};
		};
		
		container.innerHTML = options;

		container.onchange = function(){
			mapInit(this.value);
		};
		
		return container;
	}
	
	
	leafletMap.addLayer(baseMaps["Station map"]);
	window.location.hash = mapName;
	
	var lcontrol;
	if(overlayMaps) {
		lcontrol = L.control.layers(baseMaps, overlayMaps);
	} else {
		lcontrol = L.control.layers(baseMaps);
	}
	
	var southWest = leafletMap.unproject([0, 8160], leafletMap.getMaxZoom());
	var northEast = leafletMap.unproject([8160, 0], leafletMap.getMaxZoom());
	leafletMap.setMaxBounds(new L.LatLngBounds(northEast, southWest));
	leafletMap.addControl(mapSwitch);
	leafletMap.addControl(lcontrol);
};
