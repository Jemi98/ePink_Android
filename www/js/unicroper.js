var vanillaUni;
var vanilaUniinput;
var vanilaPlaceholderimage;

var selectiveUploadCroper;
var selectiveUploadinput;
var selectiveUploadimage;

function rotateSelectiveCroppie(degree){
	selectiveUploadCroper.rotate(degree);
}
var serverTarget;
function selectiveUploadProcessor(element, targetinput, targetimage, target){
  serverTarget = target;
  var file1 = element.files[0];
  var reader = new FileReader();
  reader.onloadend = function(){
		selectiveCroper(reader.result, targetinput, targetimage);
  }
  reader.readAsDataURL(file1);
}

function selectiveCroper(readedimage, targetinput, targetplaceholder){
	selectiveUploadinput = targetinput;
	selectiveUploadimage = targetplaceholder;
	document.getElementById("selectiveCroper").style.display = "block";
	var newb = nW - 70;
	var newH = nW - 200;
	var el = document.getElementById('selectiveCroperCanvas');
	selectiveUploadCroper = new Croppie(el, {
		viewport: { width: newb, height: newH },
		boundary: { width: nW, height: nW },
		showZoomer: true,
		enableOrientation: true
	}); 
	selectiveUploadCroper.bind({
		url: readedimage,
		orientation:1 
	});
}

function uploadSeletiveimage(){
	showLoading();
	//selectiveUploadCroper.result('base64', 'original').then(function(base64) {
	selectiveUploadCroper.result({type: 'base64', size: 'original', format:'png', quality: 1}).then(function(base64) {
		
		selectiveUploadCroper.destroy();
		hide("selectiveCroper");	
		var dataTopost = "api=1&auth_token=" + authUser.login_token + "&serverTarget="+serverTarget+"&uploadSelective="+base64;
		var accounts_verification = new XMLHttpRequest();
		accounts_verification.open("POST", serverUrl, true);
		accounts_verification.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
		accounts_verification.onload = function() {
			if (accounts_verification.status == 200) {
				var json = accounts_verification.responseText;
				var response = JSON.parse(json);
				loadingResponse(response.status_message);
				document.getElementById(selectiveUploadinput).value = response.file;
				document.getElementById(selectiveUploadimage).src = response.file;
			} else if (accounts_verification.status == 404) {
				alert("Fail to connect to our server");
			} else {
				alert("Fail to connect to our server");
			}
		}
		accounts_verification.send(dataTopost);
	});
}
function uploadSelective(file){
    var dataTopost = "api=1&auth_token=" + authUser.login_token + "&uploadSelective="+file;
    var accounts_verification = new XMLHttpRequest();
    accounts_verification.open("POST", serverUrl, true);
    accounts_verification.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    accounts_verification.onload = function() {
        if (accounts_verification.status == 200) {
            var json = accounts_verification.responseText;
            var response = JSON.parse(json);
			var i;
            loadingResponse(response.message);
        } else if (accounts_verification.status == 404) {
            alert("Fail to connect to our server");
        } else {
            alert("Fail to connect to our server");
        }
    }
    accounts_verification.send(dataTopost);
}

function unimageCropper(element, targetinput, targetimage){
  var file1 = element.files[0];
  var reader = new FileReader();
  reader.onloadend = function(){
		console.log(reader.result);
		uniProcessor(reader.result, targetinput, targetimage);
		console.log(targetinput)
		console.log(targetimage)
  }
  reader.readAsDataURL(file1);
}

function uniProcessor(readedimage, targetinput, targetplaceholder){
	vanilaUniinput = targetinput;
	vanilaPlaceholderimage = targetplaceholder;
	document.getElementById("universalimagecropper").style.display = "block";
	var newb = nW - 50;
	var newH = nW - 50;
	var el = document.getElementById('universalimagecompressorcanvas');
	 vanillaUni = new Croppie(el, {
		viewport: { width: newb, height: newH },
		boundary: { width: nW, height: nW },
		showZoomer: true,
		enableOrientation: true
	}); 
	vanillaUni.bind({
		url: readedimage,
		orientation:1 
	});
}

function getUniimage(){
	
	vanillaUni.result('base64').then(function(base64) {
		console.log(base64)
		console.log(vanilaUniinput)
		console.log(vanilaPlaceholderimage)
		document.getElementById(vanilaUniinput).value = base64;
		document.getElementById(vanilaPlaceholderimage).src = base64;
		vanillaUni.destroy();
		hide("universalimagecropper");	
	});
}

function rotateUniCroppie(degree){
	vanillaUni.rotate(degree);
}

function cancelUniversalcropper(){
	vanillaUni.destroy();
	hide("universalimagecropper");
}