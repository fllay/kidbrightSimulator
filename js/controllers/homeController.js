function saveWorkspaceLocal(){
	var xml = Blockly.Xml.domToText(Blockly.Xml.workspaceToDom(Blockly.mainWorkspace));
	localStorage.setItem('KidBrightLastWorkspace', xml);
}

function HomeController() {
	var that = this;
	var deletingBoardId = null;
	var standalone = false;
	var simulator = new Simulator();
	
	/////// Ning Edit
	var _ip;
	$(function() {
    	$.getJSON("https://api.ipify.org?format=jsonp&callback=?",
      		function(json) {
        		//document.write("My public IP address is: ", json.ip);
        		_ip = json.ip;
        		
        		$.ajax({
					type: 'POST',
					url: '/ip_client',
					data: {ipname: json.ip},
					dataType: 'json',
					error: function(e) {
					//
					},
					success: function(msg) {
					//req = _ip;
					}
				});
        		//simulator.sendIP(_ip);
      		}
    	);
  	});
	/////////


	// check standalone flag
	$.ajax({
		url: '/standalone',
		type: 'POST',
		error: function(e) {
			//
		},
		success: function(reply) {
			standalone = reply.standalone;
		}
	});

	// get kidbrightide version
	$.ajax({
		type: 'POST',
		url: '/version',
		error: function(e) {
			//
		},
		success: function(res) {
			$('#version-text').html('ver. ' + res.version);
		}
	});
/*
	// =========================================================================
	// save file browser modal form
	// =========================================================================
	$('.modal-save-file-browser').on('shown.bs.modal', function() {
		$(this).find('[autofocus]').focus();
	});
	$('.modal-save-file-browser #btn-ok').click(function() {
		var fn = $('.modal-save-file-browser #save-file-text').val();
		// if (fn == '') return;
		if (fn == '') {
			fn = "untitle.txt"
		}
		document.getElementById("save-file-text").value = '';
		saveFile(fn);

	});

	$('.modal-save-overwrite-confirm #btn-ok').click(function() {
		saveFile($('.modal-save-file-browser #save-file-text').val());
		$('.modal-save-overwrite-confirm').modal('hide');
	});

	// =========================================================================
	// open file browser modal form
	// =========================================================================
	$('.modal-open-file-browser #btn-ok').click(function() {
		// if not insert mode
		if (!($('.modal-open-file-browser #insert-checkbox').is(":checked"))) {
			// clear old workspace
			Blockly.mainWorkspace.clear();
		}

		// load with new file
		$('.modal-open-file-browser').modal('hide');
		var xml = Blockly.Xml.textToDom(b64DecodeUnicode(workspaceData));
		Blockly.Xml.domToWorkspace(xml, Blockly.mainWorkspace);
		filename = files[0].name;
		$('input').val("");

	});
	$('.modal-open-file-browser #btn-cancel').click(function () {
		$('input').val("");
	});
	// =========================================================================
	// delete file browser modal form
	// =========================================================================
	$('.modal-delete-file-browser').on('shown.bs.modal', function() {
		$(this).find('[autofocus]').focus();
	});

	$('.modal-delete-file-browser #btn-ok').click(function() {
		var fn = $('.modal-delete-file-browser #file-text').val();
		if (fn == '') return;

		$('.modal-delete-confirm .modal-header h4').text(LANG_FILE_DELETE_CONFIRM);
		$('.modal-delete-confirm').modal({
			show: true,
			keyboard: false,
			backdrop: 'static'
		});
	});

	$('.modal-delete-confirm #btn-ok').click(function() {
		deleteFile($('.modal-delete-file-browser #file-text').val());
	});

	function alertError(e) {
		if (parseInt(e.responseText) < LANG_ERROR_CODE.length) {
			alert(LANG_ERROR_CODE[parseInt(e.responseText)]);
		} else {
			alert(LANG_ERROR_CODE_DEFAULT);
		}
	}

	// helper for modal autofocus (jade autofocus works only on first time opens)
	$('.modal').on('shown.bs.modal', function() {
		$(this).find('[autofocus]').focus();
	});

	function saveFile(fn) {
		let download = document.querySelector("a#btn-ok[download]");
		download.setAttribute("download", fn);
		var dom = Blockly.Xml.domToText(Blockly.Xml.workspaceToDom(Blockly.mainWorkspace));
		var data = b64EncodeUnicode(dom);
		download.setAttribute(
			"href",
			("data:text/plain;charset=utf-8," + encodeURIComponent(data))
		);

		$('.modal-save-file-browser').modal('hide');

	}
	function saveFile2(fn) {
		let download = document.querySelector("a#btn-save[download]");
		download.setAttribute("download", fn);
		var dom = Blockly.Xml.domToText(Blockly.Xml.workspaceToDom(Blockly.mainWorkspace));
		var data = b64EncodeUnicode(dom);
		download.setAttribute(
			"href",
			("data:text/plain;charset=utf-8," + encodeURIComponent(data))
		);

		$('.modal-save-file-browser').modal('hide');

	}

	function deleteFile(fn) {
		$.ajax({
			type: 'POST',
			url: '/deletefile',
			data: {
				filename: fn
			},
			dataType: 'json',
			error: function(e) {
				if (e.status != 200) {
					alertError(e);
				}
			},
			success: function() {
				$('.modal-delete-confirm').modal('hide');
				$('.modal-delete-file-browser').modal('hide');
			}
		});
	}

	$('#btn-save').click(function() {
		// save file browser modal form
		$('.modal-save-file-browser .modal-header h4').text(LANG_SAVE_FILE);
		$('.modal-save-file-browser .modal-footer #btn-ok').text(LANG_OK);
		$('.modal-save-file-browser .modal-footer #btn-cancel').text(LANG_CANCEL);

		$('.modal-save-file-browser #file-list').empty();
		$('.modal-save-file-browser #file-text').text('');

		$.ajax({
			type: 'POST',
			url: '/listfile',
			error: function(e) {
				if (e.status != 200) {
					alertError(e);
				}
			},
			success: function(file_list) {
				// render file list
				for (var i in file_list) {
					var item = file_list[i];
					$('.modal-save-file-browser #file-list').append('<a class="list-group-item">' + item.filename + '</a>');
				}

				$('.modal-save-file-browser .modal-body .list-group .list-group-item').click(function(e) {
					$('.modal-save-file-browser #file-text').val($(e.target).text());
				});

				$('.modal-save-file-browser').modal({
					show: true,
					keyboard: false,
					backdrop: 'static'
				});
			}
		});
	});

	function updateOpenFileButtons() {
		var open_flag = false;
		var items = $('.modal-open-file-browser .modal-body .list-group .list-group-item');

		for (var i = 0; i < items.length; i++) {
			if ($(items[i]).hasClass('active')) {
				open_flag = true;
			}
		}
		$('.modal-open-file-browser #btn-ok').prop('disabled', !open_flag);
	}

	$('#btn-new').click(function() {
		Blockly.mainWorkspace.clear();
	});
	function handleFileSelect(evt) {
		files = evt.target.files; // FileList object
		// use the 1st file from the list
		f = files[0];
		if (f == null) {
			// disable ok button
			$('.modal-open-file-browser #btn-ok').prop('disabled', true);
		} else {
			// enable ok button
			$('.modal-open-file-browser #btn-ok').prop('disabled', false);
		}
		var reader = new FileReader();
		// Closure to capture the file information.
		reader.onload = (function (theFile) {
			return function (e) {
				//console.log(e.target.result);
				workspaceData = e.target.result;
			};
		})(f);

		// Read in the image file as a data URL.
		reader.readAsText(f);
	}
	$('#btn-open').click(function() {
		// open file browser modal form
		$('.modal-open-file-browser .modal-header h4').text(LANG_OPEN_FILE);
		$('.modal-open-file-browser .modal-footer #btn-ok').text(LANG_OK);
		$('.modal-open-file-browser .modal-footer #btn-cancel').text(LANG_CANCEL);
		$('.modal-open-file-browser #insert-text').text(LANG_INSERT_MODE);
		$('.modal-open-file-browser #insert-checkbox').prop('checked', false);
		$('.modal-open-file-browser .modal-footer #btn-ok').prop('disabled', true);

		document.getElementById('customFile').addEventListener('change', handleFileSelect, false);
		//path_file = document.getElementById('customFile').value;
		$('.modal-open-file-browser').modal({
			show: true,
			keyboard: false,
			backdrop: 'static'
		});
	});

	$('#btn-delete').click(function() {
		$('.modal-delete-file-browser .modal-header h4').text(LANG_DELETE_FILE);
		$('.modal-delete-file-browser .modal-footer #btn-ok').text(LANG_OK);
		$('.modal-delete-file-browser .modal-footer #btn-cancel').text(LANG_CANCEL);

		$('.modal-delete-file-browser #file-list').empty();
		$('.modal-delete-file-browser #file-text').text('');

		$.ajax({
			type: 'POST',
			url: '/listfile',
			error: function(e) {
				if (e.status != 200) {
					alertError(e);
				}
			},
			success: function(file_list) {
				// render file list
				for (var i in file_list) {
					var item = file_list[i];
					$('.modal-delete-file-browser #file-list').append('<a class="list-group-item">' + item.filename + '</a>');
				}

				$('.modal-delete-file-browser .modal-body .list-group .list-group-item').click(function(e) {
					$('.modal-delete-file-browser #file-text').val($(e.target).text());
				});

				// show modal
				$('.modal-delete-file-browser').modal({
					show: true,
					keyboard: false,
					backdrop: 'static'
				});
			}
		});
	});
*/
/*
	$('#btn-build').click(function() {
        
		simulator.sendIP(_ip);///Ning edit

		$('.modal-build .modal-header h4').text(LANG_BUILD);
		$('#build-ok').text(LANG_OK);
		$('.modal-build .modal-body ul').text('');
		$('.modal-build .modal-body ul').append('<li id="port_checking_li">' + LANG_PORT_CHECKING + '...</li>');

		// reset function number in current project
		Blockly.JavaScript.resetTaskNumber();
		var code_str = Blockly.JavaScript.workspaceToCode(Blockly.mainWorkspace);

// =============================================================================
// simulator run
// =============================================================================
//console.log(code_str);
simulator.run(code_str);
return;
// =============================================================================

		//$('.modal-build.modal').modal('show'); // $('.modal-build.modal').modal('hide');
		$('.modal-build.modal').modal({
			backdrop: 'static', // protect background click
			keyboard: false,
			show: true
		});
		$('#build-ok').prop('disabled', true);

		//testbug
		//console.log(code_str);
		//return;
		
		$.ajax({
			url: '/port_list',
			type: 'POST',
			error: function(e) {
				$('#port_checking_li').text(LANG_PORT_CHECKING + '... ' + LANG_FAILED);
				$('#build-ok').prop('disabled', false);
			},
			success: function(reply) {
				// check port list
				if (reply.result.length <= 0) {
					$('#port_checking_li').text(LANG_PORT_CHECKING + '... ' + LANG_FAILED);
					$('#build-ok').prop('disabled', false);
				}
				else {
					var port_name = reply.result[0];
					$('#port_checking_li').text(LANG_PORT_CHECKING + '... ' + LANG_PASSED + ' (' + port_name + ')');
					$('.modal-build .modal-body ul').append('<li id="board_checking_li">' + LANG_BOARD_CHECKING + '...</li>');

					var wifi_ssid = sessionStorage.getItem('wifi-ssid');
					var wifi_password = sessionStorage.getItem('wifi-password');
					var enable_iot = sessionStorage.getItem('enable-iot');

					$('.modal-wifi-config input#sta-ssid').val(wifi_ssid);
					$('.modal-wifi-config input#sta-password').val(wifi_password);
					$('.modal-wifi-config #wifi-iot-checkbox').val(enable_iot);
					$.ajax({
						url: '/read_mac',
						type: 'POST',
						data: {
							port_name: port_name
						},
						error: function(e) {
							$('#board_checking_li').text(LANG_BOARD_CHECKING + '... ' + LANG_FAILED);
							$('#build-ok').prop('disabled', false);
						},
						success: function(reply) {
							var board_id = reply.board_id;
							var mac_addr = reply.mac_addr;
							$('#board_checking_li').text(LANG_BOARD_CHECKING + '... ' + LANG_PASSED + ' (' + mac_addr + ')');
							$('.modal-build .modal-body ul').append('<li id="build_li">' + LANG_BUILD + '...</li>');
							$.ajax({
								url: '/build',
								type: 'POST',
								data: {
									board_id: board_id,
									mac_addr: mac_addr,
									code: b64EncodeUnicode(code_str),
									// NETPIE Config Data
									sta_ssid: wifi_ssid,
									sta_password: wifi_password,
									enable_iot: enable_iot,
								},
								dataType: 'json',
								error: function(e) {
									$('#build_li').text(LANG_BUILD + '... ' + LANG_FAILED);
									$('#build-ok').prop('disabled', false);
								},
								success: function(reply) {
									$('#build_li').text(LANG_BUILD + '... ' + LANG_PASSED);
									$('.modal-build .modal-body ul').append('<li id="program_li">' + LANG_BOARD_FLASHING + '...</li>');

									$.ajax({
										url: '/program',
										type: 'POST',
										data: {
											board_id: board_id,
											mac_addr: mac_addr,
											port_name: port_name
										},
										dataType: 'json',
										error: function(e) {
											$('#program_li').text(LANG_BOARD_FLASHING + '... ' + LANG_FAILED);
											$('#build-ok').prop('disabled', false);
										},
										success: function(reply) {
											$('#program_li').text(LANG_BOARD_FLASHING + '... ' + LANG_PASSED);
											$('#build-ok').prop('disabled', false);

										}
									});

								}
							});

						}
					});
				}

			}
		});
	});
	//////////////////////////////////// ning edit
	$('#btn-ex1').click(function() {
		workspaceData = 'PHhtbCB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94aHRtbCI+PHZhcmlhYmxlcz48dmFyaWFibGUgdHlwZT0iIiBpZD0iRV5ncDZbTyxbal81V2MudzZ9eTUiPng8L3ZhcmlhYmxlPjwvdmFyaWFibGVzPjxibG9jayB0eXBlPSJiYXNpY19mb3JldmVyIiBpZD0iaWRBZkdGWFtEQ143NlNjcyR1amAiIHg9IjEzOCIgeT0iMzciPjxzdGF0ZW1lbnQgbmFtZT0iSEFORExFUiI+PGJsb2NrIHR5cGU9ImJhc2ljX2xlZDE2eDhfMmNoYXJzIiBpZD0iaV1+MU5dWCQkUDYqd35uKjpUU3AiPjx2YWx1ZSBuYW1lPSJWQUxVRSI+PGJsb2NrIHR5cGU9InNlbnNvcl9sZHIiIGlkPSJsVlU/b2J3azt5MVNXeFYrP1pMNyI+PC9ibG9jaz48L3ZhbHVlPjxuZXh0PjxibG9jayB0eXBlPSJjb250cm9sc19pZiIgaWQ9IipRUCsuJFNnO3ReQFphTDhdM2NtIj48dmFsdWUgbmFtZT0iSUYwIj48YmxvY2sgdHlwZT0ibG9naWNfc3cxX3ByZXNzZWQiIGlkPSJmMHxKKmFDNm4/SGF7MHEhMFpNOyI+PC9ibG9jaz48L3ZhbHVlPjxzdGF0ZW1lbnQgbmFtZT0iRE8wIj48YmxvY2sgdHlwZT0ibWF0aF92YXJpYWJsZXNfc2V0IiBpZD0ifWgwZGNXTSg5JV47SiFXWGJpbFMiPjxmaWVsZCBuYW1lPSJWQVIiIGlkPSJFXmdwNltPLFtqXzVXYy53Nn15NSIgdmFyaWFibGV0eXBlPSIiPng8L2ZpZWxkPjx2YWx1ZSBuYW1lPSJWQUxVRSI+PGJsb2NrIHR5cGU9Im1hdGhfbnVtYmVyIiBpZD0ibFNKZmQyZV1FWVdKKFEzXnQpSUYiPjxmaWVsZCBuYW1lPSJWQUxVRSI+MDwvZmllbGQ+PC9ibG9jaz48L3ZhbHVlPjwvYmxvY2s+PC9zdGF0ZW1lbnQ+PG5leHQ+PGJsb2NrIHR5cGU9ImNvbnRyb2xzX2lmIiBpZD0iSypraClubTNYLEEuYFtUS2peaEwiPjx2YWx1ZSBuYW1lPSJJRjAiPjxibG9jayB0eXBlPSJsb2dpY19jb21wYXJlIiBpZD0iMjd9b3YrbGB9Xk5tdGIudXI0eX4iPjxmaWVsZCBuYW1lPSJPUCI+RVE8L2ZpZWxkPjx2YWx1ZSBuYW1lPSJBIj48YmxvY2sgdHlwZT0ibWF0aF92YXJpYWJsZXNfZ2V0IiBpZD0ibUFFNkt4Yz1sWF1bOE4zbi8hYSUiPjxmaWVsZCBuYW1lPSJWQVIiIGlkPSJFXmdwNltPLFtqXzVXYy53Nn15NSIgdmFyaWFibGV0eXBlPSIiPng8L2ZpZWxkPjwvYmxvY2s+PC92YWx1ZT48dmFsdWUgbmFtZT0iQiI+PGJsb2NrIHR5cGU9Im1hdGhfbnVtYmVyIiBpZD0iYGRwZGwya3NLQTNiZytZKUhgWTEiPjxmaWVsZCBuYW1lPSJWQUxVRSI+MDwvZmllbGQ+PC9ibG9jaz48L3ZhbHVlPjwvYmxvY2s+PC92YWx1ZT48c3RhdGVtZW50IG5hbWU9IkRPMCI+PGJsb2NrIHR5cGU9ImNvbnRyb2xzX2lmIiBpZD0iL2VHRFo7RSQjenZHWy9EN3J6WD0iPjxtdXRhdGlvbiBlbHNlPSIxIj48L211dGF0aW9uPjx2YWx1ZSBuYW1lPSJJRjAiPjxibG9jayB0eXBlPSJsb2dpY19jb21wYXJlIiBpZD0iWF9YRjEtVGksVUQ5KHtfV1M9SSQiPjxmaWVsZCBuYW1lPSJPUCI+TFQ8L2ZpZWxkPjx2YWx1ZSBuYW1lPSJBIj48YmxvY2sgdHlwZT0ic2Vuc29yX2xkciIgaWQ9IkZoOmxjR2UqTGsvYyMvLV01eT8yIj48L2Jsb2NrPjwvdmFsdWU+PHZhbHVlIG5hbWU9IkIiPjxibG9jayB0eXBlPSJtYXRoX251bWJlciIgaWQ9IjI7ZUwsWmY0UEA/SCQ9SFZAaFQ9Ij48ZmllbGQgbmFtZT0iVkFMVUUiPjMwPC9maWVsZD48L2Jsb2NrPjwvdmFsdWU+PC9ibG9jaz48L3ZhbHVlPjxzdGF0ZW1lbnQgbmFtZT0iRE8wIj48YmxvY2sgdHlwZT0idXNic3dfd3JpdGUiIGlkPSJVZTVndjkyWHVIQDhFemdWNkl0bSI+PGZpZWxkIG5hbWU9IlNUQVRVUyI+MTwvZmllbGQ+PG5leHQ+PGJsb2NrIHR5cGU9Im1hdGhfdmFyaWFibGVzX3NldCIgaWQ9IigoYippRkNDUH43WlozOTJNUnFiIj48ZmllbGQgbmFtZT0iVkFSIiBpZD0iRV5ncDZbTyxbal81V2MudzZ9eTUiIHZhcmlhYmxldHlwZT0iIj54PC9maWVsZD48dmFsdWUgbmFtZT0iVkFMVUUiPjxibG9jayB0eXBlPSJtYXRoX251bWJlciIgaWQ9ImY0ZHdoOj1kVTp8OkotZSQpZ2VNIj48ZmllbGQgbmFtZT0iVkFMVUUiPjE8L2ZpZWxkPjwvYmxvY2s+PC92YWx1ZT48L2Jsb2NrPjwvbmV4dD48L2Jsb2NrPjwvc3RhdGVtZW50PjxzdGF0ZW1lbnQgbmFtZT0iRUxTRSI+PGJsb2NrIHR5cGU9InVzYnN3X3dyaXRlIiBpZD0iSXlHXSQ7O1lJMVl4WS1RSHtERl8iPjxmaWVsZCBuYW1lPSJTVEFUVVMiPjA8L2ZpZWxkPjwvYmxvY2s+PC9zdGF0ZW1lbnQ+PC9ibG9jaz48L3N0YXRlbWVudD48L2Jsb2NrPjwvbmV4dD48L2Jsb2NrPjwvbmV4dD48L2Jsb2NrPjwvc3RhdGVtZW50PjwvYmxvY2s+PC94bWw+';
		Blockly.mainWorkspace.clear();
		// load with new file
		var xml = Blockly.Xml.textToDom(b64DecodeUnicode(workspaceData));
		Blockly.Xml.domToWorkspace(xml, Blockly.mainWorkspace);
	});
	$('#btn-ex2').click(function() {
		workspaceData = 'PHhtbCB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94aHRtbCI+PHZhcmlhYmxlcz48L3ZhcmlhYmxlcz48YmxvY2sgdHlwZT0iYmFzaWNfZm9yZXZlciIgaWQ9IjJbaU97ZFclPztxKW8kdWFhRHkpIiB4PSIzMTMiIHk9IjExMiI+PHN0YXRlbWVudCBuYW1lPSJIQU5ETEVSIj48YmxvY2sgdHlwZT0iY29udHJvbHNfaWYiIGlkPSI5Ly1EbG43RmRRKispO2lPfVMvMiI+PG11dGF0aW9uIGVsc2VpZj0iMSIgZWxzZT0iMSI+PC9tdXRhdGlvbj48dmFsdWUgbmFtZT0iSUYwIj48YmxvY2sgdHlwZT0ibG9naWNfc3cxX3ByZXNzZWQiIGlkPSJEezI1UVpxT2gtME1kMCtXKTZ2SSI+PC9ibG9jaz48L3ZhbHVlPjxzdGF0ZW1lbnQgbmFtZT0iRE8wIj48YmxvY2sgdHlwZT0iYmFzaWNfbGVkMTZ4OCIgaWQ9Inl3eEZqQ3Z7aF5+JXtpWXElYShAIj48ZmllbGQgbmFtZT0iUE9TX1gwX1k3Ij5GQUxTRTwvZmllbGQ+PGZpZWxkIG5hbWU9IlBPU19YMV9ZNyI+RkFMU0U8L2ZpZWxkPjxmaWVsZCBuYW1lPSJQT1NfWDJfWTciPkZBTFNFPC9maWVsZD48ZmllbGQgbmFtZT0iUE9TX1gzX1k3Ij5GQUxTRTwvZmllbGQ+PGZpZWxkIG5hbWU9IlBPU19YNF9ZNyI+RkFMU0U8L2ZpZWxkPjxmaWVsZCBuYW1lPSJQT1NfWDVfWTciPkZBTFNFPC9maWVsZD48ZmllbGQgbmFtZT0iUE9TX1g2X1k3Ij5UUlVFPC9maWVsZD48ZmllbGQgbmFtZT0iUE9TX1g3X1k3Ij5GQUxTRTwvZmllbGQ+PGZpZWxkIG5hbWU9IlBPU19YOF9ZNyI+RkFMU0U8L2ZpZWxkPjxmaWVsZCBuYW1lPSJQT1NfWDlfWTciPkZBTFNFPC9maWVsZD48ZmllbGQgbmFtZT0iUE9TX1gxMF9ZNyI+VFJVRTwvZmllbGQ+PGZpZWxkIG5hbWU9IlBPU19YMTFfWTciPkZBTFNFPC9maWVsZD48ZmllbGQgbmFtZT0iUE9TX1gxMl9ZNyI+RkFMU0U8L2ZpZWxkPjxmaWVsZCBuYW1lPSJQT1NfWDEzX1k3Ij5GQUxTRTwvZmllbGQ+PGZpZWxkIG5hbWU9IlBPU19YMTRfWTciPkZBTFNFPC9maWVsZD48ZmllbGQgbmFtZT0iUE9TX1gxNV9ZNyI+RkFMU0U8L2ZpZWxkPjxmaWVsZCBuYW1lPSJQT1NfWDBfWTYiPkZBTFNFPC9maWVsZD48ZmllbGQgbmFtZT0iUE9TX1gxX1k2Ij5GQUxTRTwvZmllbGQ+PGZpZWxkIG5hbWU9IlBPU19YMl9ZNiI+RkFMU0U8L2ZpZWxkPjxmaWVsZCBuYW1lPSJQT1NfWDNfWTYiPkZBTFNFPC9maWVsZD48ZmllbGQgbmFtZT0iUE9TX1g0X1k2Ij5GQUxTRTwvZmllbGQ+PGZpZWxkIG5hbWU9IlBPU19YNV9ZNiI+RkFMU0U8L2ZpZWxkPjxmaWVsZCBuYW1lPSJQT1NfWDZfWTYiPlRSVUU8L2ZpZWxkPjxmaWVsZCBuYW1lPSJQT1NfWDdfWTYiPlRSVUU8L2ZpZWxkPjxmaWVsZCBuYW1lPSJQT1NfWDhfWTYiPkZBTFNFPC9maWVsZD48ZmllbGQgbmFtZT0iUE9TX1g5X1k2Ij5UUlVFPC9maWVsZD48ZmllbGQgbmFtZT0iUE9TX1gxMF9ZNiI+VFJVRTwvZmllbGQ+PGZpZWxkIG5hbWU9IlBPU19YMTFfWTYiPkZBTFNFPC9maWVsZD48ZmllbGQgbmFtZT0iUE9TX1gxMl9ZNiI+RkFMU0U8L2ZpZWxkPjxmaWVsZCBuYW1lPSJQT1NfWDEzX1k2Ij5GQUxTRTwvZmllbGQ+PGZpZWxkIG5hbWU9IlBPU19YMTRfWTYiPkZBTFNFPC9maWVsZD48ZmllbGQgbmFtZT0iUE9TX1gxNV9ZNiI+RkFMU0U8L2ZpZWxkPjxmaWVsZCBuYW1lPSJQT1NfWDBfWTUiPkZBTFNFPC9maWVsZD48ZmllbGQgbmFtZT0iUE9TX1gxX1k1Ij5GQUxTRTwvZmllbGQ+PGZpZWxkIG5hbWU9IlBPU19YMl9ZNSI+RkFMU0U8L2ZpZWxkPjxmaWVsZCBuYW1lPSJQT1NfWDNfWTUiPkZBTFNFPC9maWVsZD48ZmllbGQgbmFtZT0iUE9TX1g0X1k1Ij5GQUxTRTwvZmllbGQ+PGZpZWxkIG5hbWU9IlBPU19YNV9ZNSI+RkFMU0U8L2ZpZWxkPjxmaWVsZCBuYW1lPSJQT1NfWDZfWTUiPlRSVUU8L2ZpZWxkPjxmaWVsZCBuYW1lPSJQT1NfWDdfWTUiPlRSVUU8L2ZpZWxkPjxmaWVsZCBuYW1lPSJQT1NfWDhfWTUiPlRSVUU8L2ZpZWxkPjxmaWVsZCBuYW1lPSJQT1NfWDlfWTUiPlRSVUU8L2ZpZWxkPjxmaWVsZCBuYW1lPSJQT1NfWDEwX1k1Ij5UUlVFPC9maWVsZD48ZmllbGQgbmFtZT0iUE9TX1gxMV9ZNSI+RkFMU0U8L2ZpZWxkPjxmaWVsZCBuYW1lPSJQT1NfWDEyX1k1Ij5GQUxTRTwvZmllbGQ+PGZpZWxkIG5hbWU9IlBPU19YMTNfWTUiPkZBTFNFPC9maWVsZD48ZmllbGQgbmFtZT0iUE9TX1gxNF9ZNSI+RkFMU0U8L2ZpZWxkPjxmaWVsZCBuYW1lPSJQT1NfWDE1X1k1Ij5GQUxTRTwvZmllbGQ+PGZpZWxkIG5hbWU9IlBPU19YMF9ZNCI+RkFMU0U8L2ZpZWxkPjxmaWVsZCBuYW1lPSJQT1NfWDFfWTQiPkZBTFNFPC9maWVsZD48ZmllbGQgbmFtZT0iUE9TX1gyX1k0Ij5GQUxTRTwvZmllbGQ+PGZpZWxkIG5hbWU9IlBPU19YM19ZNCI+RkFMU0U8L2ZpZWxkPjxmaWVsZCBuYW1lPSJQT1NfWDRfWTQiPkZBTFNFPC9maWVsZD48ZmllbGQgbmFtZT0iUE9TX1g1X1k0Ij5GQUxTRTwvZmllbGQ+PGZpZWxkIG5hbWU9IlBPU19YNl9ZNCI+RkFMU0U8L2ZpZWxkPjxmaWVsZCBuYW1lPSJQT1NfWDdfWTQiPlRSVUU8L2ZpZWxkPjxmaWVsZCBuYW1lPSJQT1NfWDhfWTQiPlRSVUU8L2ZpZWxkPjxmaWVsZCBuYW1lPSJQT1NfWDlfWTQiPlRSVUU8L2ZpZWxkPjxmaWVsZCBuYW1lPSJQT1NfWDEwX1k0Ij5GQUxTRTwvZmllbGQ+PGZpZWxkIG5hbWU9IlBPU19YMTFfWTQiPkZBTFNFPC9maWVsZD48ZmllbGQgbmFtZT0iUE9TX1gxMl9ZNCI+RkFMU0U8L2ZpZWxkPjxmaWVsZCBuYW1lPSJQT1NfWDEzX1k0Ij5GQUxTRTwvZmllbGQ+PGZpZWxkIG5hbWU9IlBPU19YMTRfWTQiPkZBTFNFPC9maWVsZD48ZmllbGQgbmFtZT0iUE9TX1gxNV9ZNCI+RkFMU0U8L2ZpZWxkPjxmaWVsZCBuYW1lPSJQT1NfWDBfWTMiPkZBTFNFPC9maWVsZD48ZmllbGQgbmFtZT0iUE9TX1gxX1kzIj5GQUxTRTwvZmllbGQ+PGZpZWxkIG5hbWU9IlBPU19YMl9ZMyI+RkFMU0U8L2ZpZWxkPjxmaWVsZCBuYW1lPSJQT1NfWDNfWTMiPkZBTFNFPC9maWVsZD48ZmllbGQgbmFtZT0iUE9TX1g0X1kzIj5GQUxTRTwvZmllbGQ+PGZpZWxkIG5hbWU9IlBPU19YNV9ZMyI+RkFMU0U8L2ZpZWxkPjxmaWVsZCBuYW1lPSJQT1NfWDZfWTMiPkZBTFNFPC9maWVsZD48ZmllbGQgbmFtZT0iUE9TX1g3X1kzIj5GQUxTRTwvZmllbGQ+PGZpZWxkIG5hbWU9IlBPU19YOF9ZMyI+VFJVRTwvZmllbGQ+PGZpZWxkIG5hbWU9IlBPU19YOV9ZMyI+RkFMU0U8L2ZpZWxkPjxmaWVsZCBuYW1lPSJQT1NfWDEwX1kzIj5GQUxTRTwvZmllbGQ+PGZpZWxkIG5hbWU9IlBPU19YMTFfWTMiPkZBTFNFPC9maWVsZD48ZmllbGQgbmFtZT0iUE9TX1gxMl9ZMyI+RkFMU0U8L2ZpZWxkPjxmaWVsZCBuYW1lPSJQT1NfWDEzX1kzIj5GQUxTRTwvZmllbGQ+PGZpZWxkIG5hbWU9IlBPU19YMTRfWTMiPkZBTFNFPC9maWVsZD48ZmllbGQgbmFtZT0iUE9TX1gxNV9ZMyI+RkFMU0U8L2ZpZWxkPjxmaWVsZCBuYW1lPSJQT1NfWDBfWTIiPkZBTFNFPC9maWVsZD48ZmllbGQgbmFtZT0iUE9TX1gxX1kyIj5GQUxTRTwvZmllbGQ+PGZpZWxkIG5hbWU9IlBPU19YMl9ZMiI+RkFMU0U8L2ZpZWxkPjxmaWVsZCBuYW1lPSJQT1NfWDNfWTIiPkZBTFNFPC9maWVsZD48ZmllbGQgbmFtZT0iUE9TX1g0X1kyIj5GQUxTRTwvZmllbGQ+PGZpZWxkIG5hbWU9IlBPU19YNV9ZMiI+RkFMU0U8L2ZpZWxkPjxmaWVsZCBuYW1lPSJQT1NfWDZfWTIiPkZBTFNFPC9maWVsZD48ZmllbGQgbmFtZT0iUE9TX1g3X1kyIj5GQUxTRTwvZmllbGQ+PGZpZWxkIG5hbWU9IlBPU19YOF9ZMiI+VFJVRTwvZmllbGQ+PGZpZWxkIG5hbWU9IlBPU19YOV9ZMiI+RkFMU0U8L2ZpZWxkPjxmaWVsZCBuYW1lPSJQT1NfWDEwX1kyIj5UUlVFPC9maWVsZD48ZmllbGQgbmFtZT0iUE9TX1gxMV9ZMiI+RkFMU0U8L2ZpZWxkPjxmaWVsZCBuYW1lPSJQT1NfWDEyX1kyIj5GQUxTRTwvZmllbGQ+PGZpZWxkIG5hbWU9IlBPU19YMTNfWTIiPkZBTFNFPC9maWVsZD48ZmllbGQgbmFtZT0iUE9TX1gxNF9ZMiI+RkFMU0U8L2ZpZWxkPjxmaWVsZCBuYW1lPSJQT1NfWDE1X1kyIj5GQUxTRTwvZmllbGQ+PGZpZWxkIG5hbWU9IlBPU19YMF9ZMSI+RkFMU0U8L2ZpZWxkPjxmaWVsZCBuYW1lPSJQT1NfWDFfWTEiPkZBTFNFPC9maWVsZD48ZmllbGQgbmFtZT0iUE9TX1gyX1kxIj5GQUxTRTwvZmllbGQ+PGZpZWxkIG5hbWU9IlBPU19YM19ZMSI+RkFMU0U8L2ZpZWxkPjxmaWVsZCBuYW1lPSJQT1NfWDRfWTEiPkZBTFNFPC9maWVsZD48ZmllbGQgbmFtZT0iUE9TX1g1X1kxIj5GQUxTRTwvZmllbGQ+PGZpZWxkIG5hbWU9IlBPU19YNl9ZMSI+RkFMU0U8L2ZpZWxkPjxmaWVsZCBuYW1lPSJQT1NfWDdfWTEiPkZBTFNFPC9maWVsZD48ZmllbGQgbmFtZT0iUE9TX1g4X1kxIj5UUlVFPC9maWVsZD48ZmllbGQgbmFtZT0iUE9TX1g5X1kxIj5UUlVFPC9maWVsZD48ZmllbGQgbmFtZT0iUE9TX1gxMF9ZMSI+VFJVRTwvZmllbGQ+PGZpZWxkIG5hbWU9IlBPU19YMTFfWTEiPkZBTFNFPC9maWVsZD48ZmllbGQgbmFtZT0iUE9TX1gxMl9ZMSI+RkFMU0U8L2ZpZWxkPjxmaWVsZCBuYW1lPSJQT1NfWDEzX1kxIj5GQUxTRTwvZmllbGQ+PGZpZWxkIG5hbWU9IlBPU19YMTRfWTEiPkZBTFNFPC9maWVsZD48ZmllbGQgbmFtZT0iUE9TX1gxNV9ZMSI+RkFMU0U8L2ZpZWxkPjxmaWVsZCBuYW1lPSJQT1NfWDBfWTAiPkZBTFNFPC9maWVsZD48ZmllbGQgbmFtZT0iUE9TX1gxX1kwIj5GQUxTRTwvZmllbGQ+PGZpZWxkIG5hbWU9IlBPU19YMl9ZMCI+RkFMU0U8L2ZpZWxkPjxmaWVsZCBuYW1lPSJQT1NfWDNfWTAiPkZBTFNFPC9maWVsZD48ZmllbGQgbmFtZT0iUE9TX1g0X1kwIj5GQUxTRTwvZmllbGQ+PGZpZWxkIG5hbWU9IlBPU19YNV9ZMCI+RkFMU0U8L2ZpZWxkPjxmaWVsZCBuYW1lPSJQT1NfWDZfWTAiPkZBTFNFPC9maWVsZD48ZmllbGQgbmFtZT0iUE9TX1g3X1kwIj5GQUxTRTwvZmllbGQ+PGZpZWxkIG5hbWU9IlBPU19YOF9ZMCI+VFJVRTwvZmllbGQ+PGZpZWxkIG5hbWU9IlBPU19YOV9ZMCI+RkFMU0U8L2ZpZWxkPjxmaWVsZCBuYW1lPSJQT1NfWDEwX1kwIj5GQUxTRTwvZmllbGQ+PGZpZWxkIG5hbWU9IlBPU19YMTFfWTAiPkZBTFNFPC9maWVsZD48ZmllbGQgbmFtZT0iUE9TX1gxMl9ZMCI+RkFMU0U8L2ZpZWxkPjxmaWVsZCBuYW1lPSJQT1NfWDEzX1kwIj5GQUxTRTwvZmllbGQ+PGZpZWxkIG5hbWU9IlBPU19YMTRfWTAiPkZBTFNFPC9maWVsZD48ZmllbGQgbmFtZT0iUE9TX1gxNV9ZMCI+RkFMU0U8L2ZpZWxkPjwvYmxvY2s+PC9zdGF0ZW1lbnQ+PHZhbHVlIG5hbWU9IklGMSI+PGJsb2NrIHR5cGU9ImxvZ2ljX3N3Ml9wcmVzc2VkIiBpZD0ibi5uflhHazVlQGIuR2FwQW04dG8iPjwvYmxvY2s+PC92YWx1ZT48c3RhdGVtZW50IG5hbWU9IkRPMSI+PGJsb2NrIHR5cGU9ImJhc2ljX2xlZDE2eDgiIGlkPSJLNERWVlVMeltCaUoyKU1CK2N0RSI+PGZpZWxkIG5hbWU9IlBPU19YMF9ZNyI+RkFMU0U8L2ZpZWxkPjxmaWVsZCBuYW1lPSJQT1NfWDFfWTciPkZBTFNFPC9maWVsZD48ZmllbGQgbmFtZT0iUE9TX1gyX1k3Ij5GQUxTRTwvZmllbGQ+PGZpZWxkIG5hbWU9IlBPU19YM19ZNyI+RkFMU0U8L2ZpZWxkPjxmaWVsZCBuYW1lPSJQT1NfWDRfWTciPkZBTFNFPC9maWVsZD48ZmllbGQgbmFtZT0iUE9TX1g1X1k3Ij5GQUxTRTwvZmllbGQ+PGZpZWxkIG5hbWU9IlBPU19YNl9ZNyI+VFJVRTwvZmllbGQ+PGZpZWxkIG5hbWU9IlBPU19YN19ZNyI+RkFMU0U8L2ZpZWxkPjxmaWVsZCBuYW1lPSJQT1NfWDhfWTciPkZBTFNFPC9maWVsZD48ZmllbGQgbmFtZT0iUE9TX1g5X1k3Ij5GQUxTRTwvZmllbGQ+PGZpZWxkIG5hbWU9IlBPU19YMTBfWTciPlRSVUU8L2ZpZWxkPjxmaWVsZCBuYW1lPSJQT1NfWDExX1k3Ij5GQUxTRTwvZmllbGQ+PGZpZWxkIG5hbWU9IlBPU19YMTJfWTciPkZBTFNFPC9maWVsZD48ZmllbGQgbmFtZT0iUE9TX1gxM19ZNyI+RkFMU0U8L2ZpZWxkPjxmaWVsZCBuYW1lPSJQT1NfWDE0X1k3Ij5GQUxTRTwvZmllbGQ+PGZpZWxkIG5hbWU9IlBPU19YMTVfWTciPkZBTFNFPC9maWVsZD48ZmllbGQgbmFtZT0iUE9TX1gwX1k2Ij5GQUxTRTwvZmllbGQ+PGZpZWxkIG5hbWU9IlBPU19YMV9ZNiI+RkFMU0U8L2ZpZWxkPjxmaWVsZCBuYW1lPSJQT1NfWDJfWTYiPkZBTFNFPC9maWVsZD48ZmllbGQgbmFtZT0iUE9TX1gzX1k2Ij5GQUxTRTwvZmllbGQ+PGZpZWxkIG5hbWU9IlBPU19YNF9ZNiI+RkFMU0U8L2ZpZWxkPjxmaWVsZCBuYW1lPSJQT1NfWDVfWTYiPlRSVUU8L2ZpZWxkPjxmaWVsZCBuYW1lPSJQT1NfWDZfWTYiPlRSVUU8L2ZpZWxkPjxmaWVsZCBuYW1lPSJQT1NfWDdfWTYiPlRSVUU8L2ZpZWxkPjxmaWVsZCBuYW1lPSJQT1NfWDhfWTYiPkZBTFNFPC9maWVsZD48ZmllbGQgbmFtZT0iUE9TX1g5X1k2Ij5UUlVFPC9maWVsZD48ZmllbGQgbmFtZT0iUE9TX1gxMF9ZNiI+VFJVRTwvZmllbGQ+PGZpZWxkIG5hbWU9IlBPU19YMTFfWTYiPlRSVUU8L2ZpZWxkPjxmaWVsZCBuYW1lPSJQT1NfWDEyX1k2Ij5GQUxTRTwvZmllbGQ+PGZpZWxkIG5hbWU9IlBPU19YMTNfWTYiPkZBTFNFPC9maWVsZD48ZmllbGQgbmFtZT0iUE9TX1gxNF9ZNiI+RkFMU0U8L2ZpZWxkPjxmaWVsZCBuYW1lPSJQT1NfWDE1X1k2Ij5GQUxTRTwvZmllbGQ+PGZpZWxkIG5hbWU9IlBPU19YMF9ZNSI+RkFMU0U8L2ZpZWxkPjxmaWVsZCBuYW1lPSJQT1NfWDFfWTUiPkZBTFNFPC9maWVsZD48ZmllbGQgbmFtZT0iUE9TX1gyX1k1Ij5GQUxTRTwvZmllbGQ+PGZpZWxkIG5hbWU9IlBPU19YM19ZNSI+RkFMU0U8L2ZpZWxkPjxmaWVsZCBuYW1lPSJQT1NfWDRfWTUiPkZBTFNFPC9maWVsZD48ZmllbGQgbmFtZT0iUE9TX1g1X1k1Ij5UUlVFPC9maWVsZD48ZmllbGQgbmFtZT0iUE9TX1g2X1k1Ij5UUlVFPC9maWVsZD48ZmllbGQgbmFtZT0iUE9TX1g3X1k1Ij5UUlVFPC9maWVsZD48ZmllbGQgbmFtZT0iUE9TX1g4X1k1Ij5UUlVFPC9maWVsZD48ZmllbGQgbmFtZT0iUE9TX1g5X1k1Ij5UUlVFPC9maWVsZD48ZmllbGQgbmFtZT0iUE9TX1gxMF9ZNSI+VFJVRTwvZmllbGQ+PGZpZWxkIG5hbWU9IlBPU19YMTFfWTUiPlRSVUU8L2ZpZWxkPjxmaWVsZCBuYW1lPSJQT1NfWDEyX1k1Ij5GQUxTRTwvZmllbGQ+PGZpZWxkIG5hbWU9IlBPU19YMTNfWTUiPkZBTFNFPC9maWVsZD48ZmllbGQgbmFtZT0iUE9TX1gxNF9ZNSI+RkFMU0U8L2ZpZWxkPjxmaWVsZCBuYW1lPSJQT1NfWDE1X1k1Ij5GQUxTRTwvZmllbGQ+PGZpZWxkIG5hbWU9IlBPU19YMF9ZNCI+RkFMU0U8L2ZpZWxkPjxmaWVsZCBuYW1lPSJQT1NfWDFfWTQiPkZBTFNFPC9maWVsZD48ZmllbGQgbmFtZT0iUE9TX1gyX1k0Ij5GQUxTRTwvZmllbGQ+PGZpZWxkIG5hbWU9IlBPU19YM19ZNCI+RkFMU0U8L2ZpZWxkPjxmaWVsZCBuYW1lPSJQT1NfWDRfWTQiPkZBTFNFPC9maWVsZD48ZmllbGQgbmFtZT0iUE9TX1g1X1k0Ij5UUlVFPC9maWVsZD48ZmllbGQgbmFtZT0iUE9TX1g2X1k0Ij5UUlVFPC9maWVsZD48ZmllbGQgbmFtZT0iUE9TX1g3X1k0Ij5UUlVFPC9maWVsZD48ZmllbGQgbmFtZT0iUE9TX1g4X1k0Ij5UUlVFPC9maWVsZD48ZmllbGQgbmFtZT0iUE9TX1g5X1k0Ij5UUlVFPC9maWVsZD48ZmllbGQgbmFtZT0iUE9TX1gxMF9ZNCI+VFJVRTwvZmllbGQ+PGZpZWxkIG5hbWU9IlBPU19YMTFfWTQiPlRSVUU8L2ZpZWxkPjxmaWVsZCBuYW1lPSJQT1NfWDEyX1k0Ij5GQUxTRTwvZmllbGQ+PGZpZWxkIG5hbWU9IlBPU19YMTNfWTQiPkZBTFNFPC9maWVsZD48ZmllbGQgbmFtZT0iUE9TX1gxNF9ZNCI+RkFMU0U8L2ZpZWxkPjxmaWVsZCBuYW1lPSJQT1NfWDE1X1k0Ij5GQUxTRTwvZmllbGQ+PGZpZWxkIG5hbWU9IlBPU19YMF9ZMyI+RkFMU0U8L2ZpZWxkPjxmaWVsZCBuYW1lPSJQT1NfWDFfWTMiPkZBTFNFPC9maWVsZD48ZmllbGQgbmFtZT0iUE9TX1gyX1kzIj5GQUxTRTwvZmllbGQ+PGZpZWxkIG5hbWU9IlBPU19YM19ZMyI+RkFMU0U8L2ZpZWxkPjxmaWVsZCBuYW1lPSJQT1NfWDRfWTMiPkZBTFNFPC9maWVsZD48ZmllbGQgbmFtZT0iUE9TX1g1X1kzIj5GQUxTRTwvZmllbGQ+PGZpZWxkIG5hbWU9IlBPU19YNl9ZMyI+VFJVRTwvZmllbGQ+PGZpZWxkIG5hbWU9IlBPU19YN19ZMyI+VFJVRTwvZmllbGQ+PGZpZWxkIG5hbWU9IlBPU19YOF9ZMyI+VFJVRTwvZmllbGQ+PGZpZWxkIG5hbWU9IlBPU19YOV9ZMyI+VFJVRTwvZmllbGQ+PGZpZWxkIG5hbWU9IlBPU19YMTBfWTMiPlRSVUU8L2ZpZWxkPjxmaWVsZCBuYW1lPSJQT1NfWDExX1kzIj5GQUxTRTwvZmllbGQ+PGZpZWxkIG5hbWU9IlBPU19YMTJfWTMiPkZBTFNFPC9maWVsZD48ZmllbGQgbmFtZT0iUE9TX1gxM19ZMyI+RkFMU0U8L2ZpZWxkPjxmaWVsZCBuYW1lPSJQT1NfWDE0X1kzIj5GQUxTRTwvZmllbGQ+PGZpZWxkIG5hbWU9IlBPU19YMTVfWTMiPkZBTFNFPC9maWVsZD48ZmllbGQgbmFtZT0iUE9TX1gwX1kyIj5GQUxTRTwvZmllbGQ+PGZpZWxkIG5hbWU9IlBPU19YMV9ZMiI+RkFMU0U8L2ZpZWxkPjxmaWVsZCBuYW1lPSJQT1NfWDJfWTIiPkZBTFNFPC9maWVsZD48ZmllbGQgbmFtZT0iUE9TX1gzX1kyIj5GQUxTRTwvZmllbGQ+PGZpZWxkIG5hbWU9IlBPU19YNF9ZMiI+RkFMU0U8L2ZpZWxkPjxmaWVsZCBuYW1lPSJQT1NfWDVfWTIiPkZBTFNFPC9maWVsZD48ZmllbGQgbmFtZT0iUE9TX1g2X1kyIj5GQUxTRTwvZmllbGQ+PGZpZWxkIG5hbWU9IlBPU19YN19ZMiI+VFJVRTwvZmllbGQ+PGZpZWxkIG5hbWU9IlBPU19YOF9ZMiI+VFJVRTwvZmllbGQ+PGZpZWxkIG5hbWU9IlBPU19YOV9ZMiI+VFJVRTwvZmllbGQ+PGZpZWxkIG5hbWU9IlBPU19YMTBfWTIiPkZBTFNFPC9maWVsZD48ZmllbGQgbmFtZT0iUE9TX1gxMV9ZMiI+RkFMU0U8L2ZpZWxkPjxmaWVsZCBuYW1lPSJQT1NfWDEyX1kyIj5GQUxTRTwvZmllbGQ+PGZpZWxkIG5hbWU9IlBPU19YMTNfWTIiPkZBTFNFPC9maWVsZD48ZmllbGQgbmFtZT0iUE9TX1gxNF9ZMiI+RkFMU0U8L2ZpZWxkPjxmaWVsZCBuYW1lPSJQT1NfWDE1X1kyIj5GQUxTRTwvZmllbGQ+PGZpZWxkIG5hbWU9IlBPU19YMF9ZMSI+RkFMU0U8L2ZpZWxkPjxmaWVsZCBuYW1lPSJQT1NfWDFfWTEiPkZBTFNFPC9maWVsZD48ZmllbGQgbmFtZT0iUE9TX1gyX1kxIj5GQUxTRTwvZmllbGQ+PGZpZWxkIG5hbWU9IlBPU19YM19ZMSI+RkFMU0U8L2ZpZWxkPjxmaWVsZCBuYW1lPSJQT1NfWDRfWTEiPkZBTFNFPC9maWVsZD48ZmllbGQgbmFtZT0iUE9TX1g1X1kxIj5GQUxTRTwvZmllbGQ+PGZpZWxkIG5hbWU9IlBPU19YNl9ZMSI+RkFMU0U8L2ZpZWxkPjxmaWVsZCBuYW1lPSJQT1NfWDdfWTEiPkZBTFNFPC9maWVsZD48ZmllbGQgbmFtZT0iUE9TX1g4X1kxIj5UUlVFPC9maWVsZD48ZmllbGQgbmFtZT0iUE9TX1g5X1kxIj5GQUxTRTwvZmllbGQ+PGZpZWxkIG5hbWU9IlBPU19YMTBfWTEiPkZBTFNFPC9maWVsZD48ZmllbGQgbmFtZT0iUE9TX1gxMV9ZMSI+RkFMU0U8L2ZpZWxkPjxmaWVsZCBuYW1lPSJQT1NfWDEyX1kxIj5GQUxTRTwvZmllbGQ+PGZpZWxkIG5hbWU9IlBPU19YMTNfWTEiPkZBTFNFPC9maWVsZD48ZmllbGQgbmFtZT0iUE9TX1gxNF9ZMSI+RkFMU0U8L2ZpZWxkPjxmaWVsZCBuYW1lPSJQT1NfWDE1X1kxIj5GQUxTRTwvZmllbGQ+PGZpZWxkIG5hbWU9IlBPU19YMF9ZMCI+RkFMU0U8L2ZpZWxkPjxmaWVsZCBuYW1lPSJQT1NfWDFfWTAiPkZBTFNFPC9maWVsZD48ZmllbGQgbmFtZT0iUE9TX1gyX1kwIj5GQUxTRTwvZmllbGQ+PGZpZWxkIG5hbWU9IlBPU19YM19ZMCI+RkFMU0U8L2ZpZWxkPjxmaWVsZCBuYW1lPSJQT1NfWDRfWTAiPkZBTFNFPC9maWVsZD48ZmllbGQgbmFtZT0iUE9TX1g1X1kwIj5GQUxTRTwvZmllbGQ+PGZpZWxkIG5hbWU9IlBPU19YNl9ZMCI+RkFMU0U8L2ZpZWxkPjxmaWVsZCBuYW1lPSJQT1NfWDdfWTAiPkZBTFNFPC9maWVsZD48ZmllbGQgbmFtZT0iUE9TX1g4X1kwIj5GQUxTRTwvZmllbGQ+PGZpZWxkIG5hbWU9IlBPU19YOV9ZMCI+RkFMU0U8L2ZpZWxkPjxmaWVsZCBuYW1lPSJQT1NfWDEwX1kwIj5GQUxTRTwvZmllbGQ+PGZpZWxkIG5hbWU9IlBPU19YMTFfWTAiPkZBTFNFPC9maWVsZD48ZmllbGQgbmFtZT0iUE9TX1gxMl9ZMCI+RkFMU0U8L2ZpZWxkPjxmaWVsZCBuYW1lPSJQT1NfWDEzX1kwIj5GQUxTRTwvZmllbGQ+PGZpZWxkIG5hbWU9IlBPU19YMTRfWTAiPkZBTFNFPC9maWVsZD48ZmllbGQgbmFtZT0iUE9TX1gxNV9ZMCI+RkFMU0U8L2ZpZWxkPjwvYmxvY2s+PC9zdGF0ZW1lbnQ+PHN0YXRlbWVudCBuYW1lPSJFTFNFIj48YmxvY2sgdHlwZT0iYmFzaWNfbGVkMTZ4OCIgaWQ9InxdNCUyeyo6USN5U05JTDJhSCk/Ij48ZmllbGQgbmFtZT0iUE9TX1gwX1k3Ij5GQUxTRTwvZmllbGQ+PGZpZWxkIG5hbWU9IlBPU19YMV9ZNyI+RkFMU0U8L2ZpZWxkPjxmaWVsZCBuYW1lPSJQT1NfWDJfWTciPkZBTFNFPC9maWVsZD48ZmllbGQgbmFtZT0iUE9TX1gzX1k3Ij5GQUxTRTwvZmllbGQ+PGZpZWxkIG5hbWU9IlBPU19YNF9ZNyI+RkFMU0U8L2ZpZWxkPjxmaWVsZCBuYW1lPSJQT1NfWDVfWTciPkZBTFNFPC9maWVsZD48ZmllbGQgbmFtZT0iUE9TX1g2X1k3Ij5GQUxTRTwvZmllbGQ+PGZpZWxkIG5hbWU9IlBPU19YN19ZNyI+VFJVRTwvZmllbGQ+PGZpZWxkIG5hbWU9IlBPU19YOF9ZNyI+RkFMU0U8L2ZpZWxkPjxmaWVsZCBuYW1lPSJQT1NfWDlfWTciPkZBTFNFPC9maWVsZD48ZmllbGQgbmFtZT0iUE9TX1gxMF9ZNyI+RkFMU0U8L2ZpZWxkPjxmaWVsZCBuYW1lPSJQT1NfWDExX1k3Ij5GQUxTRTwvZmllbGQ+PGZpZWxkIG5hbWU9IlBPU19YMTJfWTciPkZBTFNFPC9maWVsZD48ZmllbGQgbmFtZT0iUE9TX1gxM19ZNyI+RkFMU0U8L2ZpZWxkPjxmaWVsZCBuYW1lPSJQT1NfWDE0X1k3Ij5GQUxTRTwvZmllbGQ+PGZpZWxkIG5hbWU9IlBPU19YMTVfWTciPkZBTFNFPC9maWVsZD48ZmllbGQgbmFtZT0iUE9TX1gwX1k2Ij5GQUxTRTwvZmllbGQ+PGZpZWxkIG5hbWU9IlBPU19YMV9ZNiI+VFJVRTwvZmllbGQ+PGZpZWxkIG5hbWU9IlBPU19YMl9ZNiI+VFJVRTwvZmllbGQ+PGZpZWxkIG5hbWU9IlBPU19YM19ZNiI+VFJVRTwvZmllbGQ+PGZpZWxkIG5hbWU9IlBPU19YNF9ZNiI+VFJVRTwvZmllbGQ+PGZpZWxkIG5hbWU9IlBPU19YNV9ZNiI+VFJVRTwvZmllbGQ+PGZpZWxkIG5hbWU9IlBPU19YNl9ZNiI+RkFMU0U8L2ZpZWxkPjxmaWVsZCBuYW1lPSJQT1NfWDdfWTYiPlRSVUU8L2ZpZWxkPjxmaWVsZCBuYW1lPSJQT1NfWDhfWTYiPkZBTFNFPC9maWVsZD48ZmllbGQgbmFtZT0iUE9TX1g5X1k2Ij5UUlVFPC9maWVsZD48ZmllbGQgbmFtZT0iUE9TX1gxMF9ZNiI+RkFMU0U8L2ZpZWxkPjxmaWVsZCBuYW1lPSJQT1NfWDExX1k2Ij5GQUxTRTwvZmllbGQ+PGZpZWxkIG5hbWU9IlBPU19YMTJfWTYiPkZBTFNFPC9maWVsZD48ZmllbGQgbmFtZT0iUE9TX1gxM19ZNiI+VFJVRTwvZmllbGQ+PGZpZWxkIG5hbWU9IlBPU19YMTRfWTYiPkZBTFNFPC9maWVsZD48ZmllbGQgbmFtZT0iUE9TX1gxNV9ZNiI+RkFMU0U8L2ZpZWxkPjxmaWVsZCBuYW1lPSJQT1NfWDBfWTUiPkZBTFNFPC9maWVsZD48ZmllbGQgbmFtZT0iUE9TX1gxX1k1Ij5UUlVFPC9maWVsZD48ZmllbGQgbmFtZT0iUE9TX1gyX1k1Ij5GQUxTRTwvZmllbGQ+PGZpZWxkIG5hbWU9IlBPU19YM19ZNSI+RkFMU0U8L2ZpZWxkPjxmaWVsZCBuYW1lPSJQT1NfWDRfWTUiPkZBTFNFPC9maWVsZD48ZmllbGQgbmFtZT0iUE9TX1g1X1k1Ij5GQUxTRTwvZmllbGQ+PGZpZWxkIG5hbWU9IlBPU19YNl9ZNSI+RkFMU0U8L2ZpZWxkPjxmaWVsZCBuYW1lPSJQT1NfWDdfWTUiPlRSVUU8L2ZpZWxkPjxmaWVsZCBuYW1lPSJQT1NfWDhfWTUiPkZBTFNFPC9maWVsZD48ZmllbGQgbmFtZT0iUE9TX1g5X1k1Ij5UUlVFPC9maWVsZD48ZmllbGQgbmFtZT0iUE9TX1gxMF9ZNSI+RkFMU0U8L2ZpZWxkPjxmaWVsZCBuYW1lPSJQT1NfWDExX1k1Ij5GQUxTRTwvZmllbGQ+PGZpZWxkIG5hbWU9IlBPU19YMTJfWTUiPkZBTFNFPC9maWVsZD48ZmllbGQgbmFtZT0iUE9TX1gxM19ZNSI+VFJVRTwvZmllbGQ+PGZpZWxkIG5hbWU9IlBPU19YMTRfWTUiPkZBTFNFPC9maWVsZD48ZmllbGQgbmFtZT0iUE9TX1gxNV9ZNSI+RkFMU0U8L2ZpZWxkPjxmaWVsZCBuYW1lPSJQT1NfWDBfWTQiPkZBTFNFPC9maWVsZD48ZmllbGQgbmFtZT0iUE9TX1gxX1k0Ij5UUlVFPC9maWVsZD48ZmllbGQgbmFtZT0iUE9TX1gyX1k0Ij5GQUxTRTwvZmllbGQ+PGZpZWxkIG5hbWU9IlBPU19YM19ZNCI+RkFMU0U8L2ZpZWxkPjxmaWVsZCBuYW1lPSJQT1NfWDRfWTQiPkZBTFNFPC9maWVsZD48ZmllbGQgbmFtZT0iUE9TX1g1X1k0Ij5GQUxTRTwvZmllbGQ+PGZpZWxkIG5hbWU9IlBPU19YNl9ZNCI+RkFMU0U8L2ZpZWxkPjxmaWVsZCBuYW1lPSJQT1NfWDdfWTQiPlRSVUU8L2ZpZWxkPjxmaWVsZCBuYW1lPSJQT1NfWDhfWTQiPkZBTFNFPC9maWVsZD48ZmllbGQgbmFtZT0iUE9TX1g5X1k0Ij5UUlVFPC9maWVsZD48ZmllbGQgbmFtZT0iUE9TX1gxMF9ZNCI+VFJVRTwvZmllbGQ+PGZpZWxkIG5hbWU9IlBPU19YMTFfWTQiPlRSVUU8L2ZpZWxkPjxmaWVsZCBuYW1lPSJQT1NfWDEyX1k0Ij5UUlVFPC9maWVsZD48ZmllbGQgbmFtZT0iUE9TX1gxM19ZNCI+VFJVRTwvZmllbGQ+PGZpZWxkIG5hbWU9IlBPU19YMTRfWTQiPkZBTFNFPC9maWVsZD48ZmllbGQgbmFtZT0iUE9TX1gxNV9ZNCI+RkFMU0U8L2ZpZWxkPjxmaWVsZCBuYW1lPSJQT1NfWDBfWTMiPkZBTFNFPC9maWVsZD48ZmllbGQgbmFtZT0iUE9TX1gxX1kzIj5UUlVFPC9maWVsZD48ZmllbGQgbmFtZT0iUE9TX1gyX1kzIj5UUlVFPC9maWVsZD48ZmllbGQgbmFtZT0iUE9TX1gzX1kzIj5UUlVFPC9maWVsZD48ZmllbGQgbmFtZT0iUE9TX1g0X1kzIj5UUlVFPC9maWVsZD48ZmllbGQgbmFtZT0iUE9TX1g1X1kzIj5GQUxTRTwvZmllbGQ+PGZpZWxkIG5hbWU9IlBPU19YNl9ZMyI+RkFMU0U8L2ZpZWxkPjxmaWVsZCBuYW1lPSJQT1NfWDdfWTMiPlRSVUU8L2ZpZWxkPjxmaWVsZCBuYW1lPSJQT1NfWDhfWTMiPkZBTFNFPC9maWVsZD48ZmllbGQgbmFtZT0iUE9TX1g5X1kzIj5UUlVFPC9maWVsZD48ZmllbGQgbmFtZT0iUE9TX1gxMF9ZMyI+RkFMU0U8L2ZpZWxkPjxmaWVsZCBuYW1lPSJQT1NfWDExX1kzIj5GQUxTRTwvZmllbGQ+PGZpZWxkIG5hbWU9IlBPU19YMTJfWTMiPkZBTFNFPC9maWVsZD48ZmllbGQgbmFtZT0iUE9TX1gxM19ZMyI+VFJVRTwvZmllbGQ+PGZpZWxkIG5hbWU9IlBPU19YMTRfWTMiPkZBTFNFPC9maWVsZD48ZmllbGQgbmFtZT0iUE9TX1gxNV9ZMyI+RkFMU0U8L2ZpZWxkPjxmaWVsZCBuYW1lPSJQT1NfWDBfWTIiPkZBTFNFPC9maWVsZD48ZmllbGQgbmFtZT0iUE9TX1gxX1kyIj5UUlVFPC9maWVsZD48ZmllbGQgbmFtZT0iUE9TX1gyX1kyIj5GQUxTRTwvZmllbGQ+PGZpZWxkIG5hbWU9IlBPU19YM19ZMiI+RkFMU0U8L2ZpZWxkPjxmaWVsZCBuYW1lPSJQT1NfWDRfWTIiPkZBTFNFPC9maWVsZD48ZmllbGQgbmFtZT0iUE9TX1g1X1kyIj5GQUxTRTwvZmllbGQ+PGZpZWxkIG5hbWU9IlBPU19YNl9ZMiI+RkFMU0U8L2ZpZWxkPjxmaWVsZCBuYW1lPSJQT1NfWDdfWTIiPlRSVUU8L2ZpZWxkPjxmaWVsZCBuYW1lPSJQT1NfWDhfWTIiPkZBTFNFPC9maWVsZD48ZmllbGQgbmFtZT0iUE9TX1g5X1kyIj5UUlVFPC9maWVsZD48ZmllbGQgbmFtZT0iUE9TX1gxMF9ZMiI+RkFMU0U8L2ZpZWxkPjxmaWVsZCBuYW1lPSJQT1NfWDExX1kyIj5GQUxTRTwvZmllbGQ+PGZpZWxkIG5hbWU9IlBPU19YMTJfWTIiPkZBTFNFPC9maWVsZD48ZmllbGQgbmFtZT0iUE9TX1gxM19ZMiI+VFJVRTwvZmllbGQ+PGZpZWxkIG5hbWU9IlBPU19YMTRfWTIiPkZBTFNFPC9maWVsZD48ZmllbGQgbmFtZT0iUE9TX1gxNV9ZMiI+RkFMU0U8L2ZpZWxkPjxmaWVsZCBuYW1lPSJQT1NfWDBfWTEiPkZBTFNFPC9maWVsZD48ZmllbGQgbmFtZT0iUE9TX1gxX1kxIj5UUlVFPC9maWVsZD48ZmllbGQgbmFtZT0iUE9TX1gyX1kxIj5GQUxTRTwvZmllbGQ+PGZpZWxkIG5hbWU9IlBPU19YM19ZMSI+RkFMU0U8L2ZpZWxkPjxmaWVsZCBuYW1lPSJQT1NfWDRfWTEiPkZBTFNFPC9maWVsZD48ZmllbGQgbmFtZT0iUE9TX1g1X1kxIj5GQUxTRTwvZmllbGQ+PGZpZWxkIG5hbWU9IlBPU19YNl9ZMSI+RkFMU0U8L2ZpZWxkPjxmaWVsZCBuYW1lPSJQT1NfWDdfWTEiPlRSVUU8L2ZpZWxkPjxmaWVsZCBuYW1lPSJQT1NfWDhfWTEiPkZBTFNFPC9maWVsZD48ZmllbGQgbmFtZT0iUE9TX1g5X1kxIj5UUlVFPC9maWVsZD48ZmllbGQgbmFtZT0iUE9TX1gxMF9ZMSI+RkFMU0U8L2ZpZWxkPjxmaWVsZCBuYW1lPSJQT1NfWDExX1kxIj5GQUxTRTwvZmllbGQ+PGZpZWxkIG5hbWU9IlBPU19YMTJfWTEiPkZBTFNFPC9maWVsZD48ZmllbGQgbmFtZT0iUE9TX1gxM19ZMSI+VFJVRTwvZmllbGQ+PGZpZWxkIG5hbWU9IlBPU19YMTRfWTEiPkZBTFNFPC9maWVsZD48ZmllbGQgbmFtZT0iUE9TX1gxNV9ZMSI+RkFMU0U8L2ZpZWxkPjxmaWVsZCBuYW1lPSJQT1NfWDBfWTAiPkZBTFNFPC9maWVsZD48ZmllbGQgbmFtZT0iUE9TX1gxX1kwIj5GQUxTRTwvZmllbGQ+PGZpZWxkIG5hbWU9IlBPU19YMl9ZMCI+RkFMU0U8L2ZpZWxkPjxmaWVsZCBuYW1lPSJQT1NfWDNfWTAiPkZBTFNFPC9maWVsZD48ZmllbGQgbmFtZT0iUE9TX1g0X1kwIj5GQUxTRTwvZmllbGQ+PGZpZWxkIG5hbWU9IlBPU19YNV9ZMCI+RkFMU0U8L2ZpZWxkPjxmaWVsZCBuYW1lPSJQT1NfWDZfWTAiPkZBTFNFPC9maWVsZD48ZmllbGQgbmFtZT0iUE9TX1g3X1kwIj5UUlVFPC9maWVsZD48ZmllbGQgbmFtZT0iUE9TX1g4X1kwIj5GQUxTRTwvZmllbGQ+PGZpZWxkIG5hbWU9IlBPU19YOV9ZMCI+RkFMU0U8L2ZpZWxkPjxmaWVsZCBuYW1lPSJQT1NfWDEwX1kwIj5GQUxTRTwvZmllbGQ+PGZpZWxkIG5hbWU9IlBPU19YMTFfWTAiPkZBTFNFPC9maWVsZD48ZmllbGQgbmFtZT0iUE9TX1gxMl9ZMCI+RkFMU0U8L2ZpZWxkPjxmaWVsZCBuYW1lPSJQT1NfWDEzX1kwIj5GQUxTRTwvZmllbGQ+PGZpZWxkIG5hbWU9IlBPU19YMTRfWTAiPkZBTFNFPC9maWVsZD48ZmllbGQgbmFtZT0iUE9TX1gxNV9ZMCI+RkFMU0U8L2ZpZWxkPjwvYmxvY2s+PC9zdGF0ZW1lbnQ+PC9ibG9jaz48L3N0YXRlbWVudD48L2Jsb2NrPjwveG1sPg==';
		Blockly.mainWorkspace.clear();
		// load with new file
		var xml = Blockly.Xml.textToDom(b64DecodeUnicode(workspaceData));
		Blockly.Xml.domToWorkspace(xml, Blockly.mainWorkspace);
	});
	$('#btn-ex3').click(function() {
		Blockly.mainWorkspace.clear();
	});
*/
	///////////////////////////////////

	

}

HomeController.prototype.onUpdateSuccess = function() {
	$('.modal-alert').modal({
		show: false,
		keyboard: true,
		backdrop: true
	});
	$('.modal-alert .modal-header h4').text('Success!');
	$('.modal-alert .modal-body p').html('Your account has been updated.');
	$('.modal-alert').modal('show');
	$('.modal-alert button').off('click');
}

function homeSetLanguage(lang) {
	$.ajax({
		type: 'GET',
		url: '/lang?set=' + lang,
		error: function(e) {
			window.location.href = '/home';
		},
		success: function() {
			window.location.href = '/home';
		},
	});
}

// https://stackoverflow.com/questions/30106476/using-javascripts-atob-to-decode-base64-doesnt-properly-decode-utf-8-strings#answer-30106551
function b64EncodeUnicode(str) {
	return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function(match, p1) {
		return String.fromCharCode(parseInt(p1, 16))
	}))
}

function b64DecodeUnicode(str) {
	return decodeURIComponent(Array.prototype.map.call(atob(str), function(c) {
		return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
	}).join(''))
}
