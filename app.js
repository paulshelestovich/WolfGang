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
	var csvData = CSVToArray(data);
	var headers = csvData.shift();
	heatmapArray = csvData.map(function(item) {
		return {lat: item[8], lng: item[9], value: item[currentColumn] * 10};
	});

	var tableData = csvData.map(function(item) {
		var tableItem = {};
		headers.forEach(function(header, index) {
			tableItem[header] = item[index];
		});
		return tableItem;
	});
	$("#jsGrid").jsGrid({
		width: "100%",
		height: "100%",
		sorting: true,
		selecting: true,
		rowClick: function(args) {
			map.setCenter({lat:args.item.lat, lng:args.item.lng});
			map.setZoom(10);

			if (args.item.Region === "Opotiki District") {
				$("#opotikiImg").show();
			} else {
				$("#opotikiImg").hide();
			}
		},
		paging: false,
		data: tableData,
		fields: [
			{ title: "Region", name: "Region", type: "text", width: 70, validate: "required" },
			{ title: "Registered", name: "Registered", type: "number", width: 30 },
			{ title: "Total ACC", name: "ACC", type: "number", width: 30},
			{ title: "ACC / Registered", name: "Ratio of ACC/Registered", type: "number", width: 30, itemTemplate: percentRenderer },
			{ title: "Total Menacing", name: "1006_classified as menacing", type: "number", width: 30 },
			{ title: "Menacing / Registered", name: "menacing dogs/registered dogs", type: "number", width: 30, itemTemplate: percentRenderer },
			{ title: "Menacing / Total Menacing", name: "menacing/total menacing", type: "number", width: 30, itemTemplate: percentRenderer },
			{ title: "ACC / Total ACC", name: "acc/total acc", type: "number", width: 30, itemTemplate: percentRenderer }
		]
	});
	heatmapProvider.addData(heatmapArray);
}

function percentRenderer(value) {
	return value + " %";
}

function selectYear(year, column) {
	if (year !== 2015) {
		$('#button2015_1').addClass('disabled');
		$('#button2015_2').addClass('disabled');
		$('#button2015_3').addClass('disabled');
		$('#button2015_4').addClass('disabled');
	} else {
		$('#button2015_1').removeClass('disabled');
		$('#button2015_2').removeClass('disabled');
		$('#button2015_3').removeClass('disabled');
		$('#button2015_4').removeClass('disabled');
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

$("#opotikiImg").hide();

selectYear(2015, 3);
