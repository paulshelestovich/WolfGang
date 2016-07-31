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

var heatmapProvider = new H.data.heatmap.Provider({
	max: 15,
	dataMax: 150,
	coarseness: 20,
	type: "value",
	assumeValues: true
});
var heatmapLayer = new H.map.layer.TileLayer(heatmapProvider, {
	opacity: 0.8
});
map.addLayer(heatmapLayer);

$('body').on('click', '.btn-group button', function () {
	$(this).addClass('active');
	$(this).siblings().removeClass('active');
});

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

var heatmapArray, currentColumn;

function dataLoaded(data) {
	heatmapArray = CSVToArray(data).map(function(item) {
		return {lat: item[8], lng: item[9], value: item[currentColumn] * 10};
	});
	heatmapArray.shift();

	$("#jsGrid").jsGrid({
		width: "100%",
		height: "400px",
		inserting: false,
		sorting: true,
		paging: false,
		data: clients,
		fields: [
			{ name: "Name", type: "text", width: 150, validate: "required" },
			{ name: "Age", type: "number", width: 50 },
			{ name: "Address", type: "text", width: 200 },
			{ name: "Country", type: "select", items: countries, valueField: "Id", textField: "Name" },
			{ name: "Married", type: "checkbox", title: "Is Married", sorting: false }
		]
	});
	heatmapProvider.addData(heatmapArray);
}

function selectYear(year, column) {
	if (year !== 2015) {
		$('#button2015_1').addClass('disabled');
		$('#button2015_2').addClass('disabled');
		$('#button2015_3').addClass('disabled');
	} else {
		$('#button2015_1').removeClass('disabled');
		$('#button2015_2').removeClass('disabled');
		$('#button2015_3').removeClass('disabled');
	}
	$('#button' + year).addClass('active').siblings().removeClass('active');
	if (heatmapArray && heatmapArray.length) {
		heatmapProvider.clear();
	}
	currentColumn = column;
	$.ajax({
		type: "GET",
		url: "data." + year + ".csv",
		dataType: "text",
		success: dataLoaded
	});
}

selectYear(2015, 3);


var clients = [
	{ "Name": "Otto Clay", "Age": 25, "Country": 1, "Address": "Ap #897-1459 Quam Avenue", "Married": false },
	{ "Name": "Connor Johnston", "Age": 45, "Country": 2, "Address": "Ap #370-4647 Dis Av.", "Married": true },
	{ "Name": "Lacey Hess", "Age": 29, "Country": 3, "Address": "Ap #365-8835 Integer St.", "Married": false },
	{ "Name": "Timothy Henson", "Age": 56, "Country": 1, "Address": "911-5143 Luctus Ave", "Married": true },
	{ "Name": "Ramona Benton", "Age": 32, "Country": 3, "Address": "Ap #614-689 Vehicula Street", "Married": false }
];

var countries = [
	{ Name: "", Id: 0 },
	{ Name: "United States", Id: 1 },
	{ Name: "Canada", Id: 2 },
	{ Name: "United Kingdom", Id: 3 }
];

