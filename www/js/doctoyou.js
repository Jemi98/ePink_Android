function uploadPrescription(element) {
  var file1 = element.files[0];
  var reader = new FileReader();
  reader.onloadend = function() {
		startPress(reader.result, "profileimagecontainer", "profileimagecontainer");
  }
  reader.readAsDataURL(file1);
}

function startPress(img, targetid, input){
targetinput = input;
target = targetid;
document.getElementById("presscroper").style.display = "block";
	var newb = nW - 50;
	var newH = nW - 50;
var el = document.getElementById('vanilla-demo-press');
 vanilla = new Croppie(el, {
    viewport: { width: newb, height: newH },
    boundary: { width: nW, height: nW },
    showZoomer: true,
    enableOrientation: true
}); 

vanilla.bind({
    url: img,
    orientation:1 
});
}
function getPress(){
	vanilla.result('base64').then(function(base64) {
		postPrescription(base64);
		document.getElementById("presscroper").style.display = "none";
		
	});
}
function postPrescription(imgdata){
	showLoading();
	var dataTopost = 'api=1&auth_token='+authUser.login_token+'&postPrescription='+imgdata;
	var xhr = new XMLHttpRequest();
	xhr.open("POST", serverUrl, true);
	xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
	xhr.onload = function() {
		if (xhr.status == 200) {
			var json = xhr.responseText;
			var response = JSON.parse(json);
			loadingResponse(response.message);
			vanilla.destroy();
		} else if (xhr.status == 404) {
			alert("Fail to connect to our server");
		} else {
			alert("Fail to connect to our server");
		}
	}
	xhr.send(dataTopost);
}


function requestDoctors(){
	userDetectedAddress = document.getElementById("detectedaddress").innerHTML;
	userDetectedLat = parseFloat(document.getElementById("detectedlat").innerHTML);
	userDetectedLng = parseFloat(document.getElementById("detectedlng").innerHTML);
	mainDeliveryCordinate.lat = parseFloat(document.getElementById("detectedlat").innerHTML);
	mainDeliveryCordinate.lng = parseFloat(document.getElementById("detectedlng").innerHTML);
	mainDeliveryCordinate.address = document.getElementById("detectedaddress").innerHTML;
	
}

function initPrescription(){
		var dataTopost = 'api=1&auth_token='+authUser.login_token+"&myPrescription=true";
		var xhr = new XMLHttpRequest();
		xhr.open("POST", serverUrl, true);
		xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
		xhr.onload = function() {
			if (xhr.status == 200) {
				var json = xhr.responseText;
				var response = JSON.parse(json);
				if(response.status == null){
					document.getElementById("prescriptionslisting").innerHTML = "";
					var i;
					for (i = 0; i < response.length; i++) {
						if(response[i].signedpres != "" || response[i].signedpres != null){
							document.getElementById("prescriptionslisting").innerHTML += '<li class="collection-item"><a href="#!" class="strong" onclick="window.open(\''+response[i].signedpres+'\', \'_system\');">Issued By: '+response[i].dr+' <br> Date: '+response[i].session_date+'</a></li>';
						}
					}
				}else{
					document.getElementById("prescriptionslisting").innerHTML = '<li class="collection-item">You have no prescriptions. Please book a session with doctor or upload your prescription for validations</li>';
				}
			} else if (xhr.status == 404) {
				alert("Fail to connect to our server");
			} else {
				alert("Fail to connect to our server");
			}
		}
		xhr.send(dataTopost);
}