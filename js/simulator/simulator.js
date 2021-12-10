const portTICK_RATE_MS = 1;

function Simulator() {
	var initialised = false;
	var svgDoc = null;
	var simulator_running = false;
	var _image64 = "";
	
	this._constructor = function() {
		// on svg document loaded
		$('#svgDoc')[0].addEventListener('load', function() {
			svgDoc = $("#svgDoc")[0].contentDocument;
		
			////////////////////////////////////////////// Ning Edit
			setInterval(fromUnity,1);
			function fromUnity(){

				$("#Linear", svgDoc).html(0); //-0.15 to 0.15
				$("#Angular", svgDoc).html(0); //-0.4 to 0.4

				_image64 = $("#ImageBase64", svgDoc).text();
			}

		});
	}
	$('.modal-simulator').modal({
			show: true,
			keyboard: false,
			backdrop: 'static'
	});
	
	this._constructor();
}
