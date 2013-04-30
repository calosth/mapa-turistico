function onDocumentReady() {
	var socket = io.connect(window.location.href);

    var map = L.map('mimapa', {
    	center: [0, -28],
    	zoom: 3
    });

    var markerLocal; // marker del usuario local

	var tiles = L.tileLayer('http://a.tiles.mapbox.com/v3/calosth.map-v5t9aoe3/{z}/{x}/{y}.png');

	map.addLayer(tiles);

	// Plugin GeoSearch.
	// Nos permite ubicarnos en el mapa dando una direccion.
	// Asi como lo hace Google Maps, de echo usa como proveedor Google Maps.
	var geosearch = new L.Control.GeoSearch({
            provider: new L.GeoSearch.Provider.Google(),
            zoomLevel: 18
    }).addTo(map);

	map.locate({
		enableHighAccuracy: true
	});

	map.on('locationfound', onLocationFound);

	socket.on('coords:user', onReceiveData);

	function onLocationFound(position) {
		var mycoords = position.latlng;
		markerLocal = L.marker([mycoords.lat, mycoords.lng]);

		map.addLayer(markerLocal);
		markerLocal.bindPopup('<b>Estás aquí</b>');

		socket.emit('coords:me', {latlng: mycoords});
	}

	function onReceiveData(data) {
		var coordsUser = data.latlng;
		var marker = L.marker([coordsUser.lat, coordsUser.lng]);

		map.addLayer(marker);
		marker.bindPopup('Estás aquí');
	}

	// Efectos para mostrar/ocultar formulario.
	var $form = $('#formulario');
	var $place = $('#place');
	//Efecto para que se pueda mover el formulario.
	$form.draggable();

	// Mostrar formualrio al iniciar.
	$form.fadeIn();


	$('#cerrar').on('click', cerrarFormulario); // Ocultar formaulario.
	$('#guardar').on('click', guardarInformacion); // Guardar datos del lugar.
	$('#radio-elegir-ubicacion').on('click', handlerClickMarker); //Elegir ubicacion en el mapa

	function cerrarFormulario(e){
		e.preventDefault();
		$form.fadeOut();
		$place.fadeOut();
	}

	function guardarInformacion(e){
		e.preventDefault();
		geosearch.geosearch($('#ubicacion').val());
		$form.fadeOut();
	}
	
	function handlerClickMarker (e) {
		$form.fadeOut();
		map.on('click', function(e){
			map.removeLayer(markerLocal);
			var coordenadas = e.latlng;
			markerLocal = L.marker([coordenadas.lat, coordenadas.lng]);
			map.addLayer(markerLocal);
			$('#ubicacion').val(coordenadas.lat+''+coordenadas.lng);
			$form.fadeIn();
		});			
	}	

	//Efecto para que se pueda mover el formulario.
	$form.draggable();
}

$(document).on('ready', onDocumentReady);




