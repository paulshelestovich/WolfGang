var platform = new H.service.Platform({
	app_id: 'nRryj6dzGjPNRne29dha',
	app_code: '7ei4V5fHiZmXVF1JT27xaA',
	useCIT: true,
	useHTTPS: true});
var defaultLayers = platform.createDefaultLayers();
var map = new H.Map(document.getElementById('map'),
	defaultLayers.normal.map,{
		center: {lat:-41.78895, lng:172.06354},
		zoom: 6
	});
new H.mapevents.Behavior(new H.mapevents.MapEvents(map));
H.ui.UI.createDefault(map, defaultLayers);


//function addLocationsToMap(locations){
//	var group = new  H.map.Group(),
//		position,
//		i;
//
//	for (i = 0;  i < locations.length; i += 1) {
//		position = {
//			lat: locations[i].location.displayPosition.latitude,
//			lng: locations[i].location.displayPosition.longitude
//		};
//		marker = new H.map.Marker(position);
//		marker.label = locations[i].location.address.label;
//		group.addObject(marker);
//	}
//
//	group.addEventListener('tap', function (evt) {
//		map.setCenter(evt.target.getPosition());
//	}, false);
//
//	// Add the locations group to the map
//	map.addObject(group);
//	map.setViewBounds(group.getBounds());
//}

$.ajax({
	type: "GET",
	url: "data.csv",
	dataType: "text",
	success: function(data) {
		var heatmapArray = CSVToArray(data).map(function(item) {
			return {lat: item[8], lng: item[9], value: item[3] * 100};
		})
		heatmapArray.shift();
		var heatmapProvider = new H.data.heatmap.Provider({
			max: 15,
			coarseness: 20,
			type: "value",
			assumeValues: true
		});
		var heatmapLayer = new H.map.layer.TileLayer(heatmapProvider, {
			opacity: 0.8
		});
		map.addLayer(heatmapLayer);
		heatmapProvider.addData(heatmapArray);
	}
});
