//Event Listener
document.getElementById("openregisterform").addEventListener("click", openRegisterForm);
document.getElementById("openrecoveryform").addEventListener("click", openRecoveryForm);
document.getElementById("openloginform").addEventListener("click", openLoginForm);
document.getElementById("openloginformrecovery").addEventListener("click", openLoginFormRecovery);
document.getElementById("loginform").addEventListener("submit", login);
document.getElementById("registerform").addEventListener("submit", register);
document.getElementById("recoveryform").addEventListener("submit", recover);
function updateAuthFactor(){
	var signaturefile = document.getElementById("sp_signature_base64").value;
	showLoading();
    var dataTopost = "api=1&auth_token=" + authUser.login_token + "&updatedoctorsignature="+signaturefile;
    var accounts_verification = new XMLHttpRequest();
    accounts_verification.open("POST", serverUrl, true);
    accounts_verification.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    accounts_verification.onload = function() {
        if (accounts_verification.status == 200) {
            var json = accounts_verification.responseText;
            var response = JSON.parse(json);
            loadingResponse(response.message);
			location.reload();
        } else if (accounts_verification.status == 404) {
            alert("Fail to connect to our server");
        } else {
            alert("Fail to connect to our server");
        }
    }
    accounts_verification.send(dataTopost);
}
function backtoregtypeSelection(){
	hide("register_identification");
	show("register_selection");
}
function regasDoctor(){
	document.getElementById("register_type").value = 6;
	document.getElementById("hcprovidercard").style.border = "4px solid #e91e63";
	document.getElementById("hcprovidercard").style.borderRadius = "15px";
	document.getElementById("ridercard").style.border = "";
	document.getElementById("ridercard").style.borderRadius = "";
	document.getElementById("patientcard").style.border = "";
	document.getElementById("patientcard").style.borderRadius = "";
	document.getElementById("registerashelper").innerHTML = "Registering as health service provider. Press the next button to continue";
	
}
function regasRider(){
	document.getElementById("register_type").value = 2;
	document.getElementById("ridercard").style.border = "4px solid #e91e63";
	document.getElementById("ridercard").style.borderRadius = "15px";
	document.getElementById("hcprovidercard").style.border = "";
	document.getElementById("hcprovidercard").style.borderRadius = "";
	document.getElementById("patientcard").style.border = "";
	document.getElementById("patientcard").style.borderRadius = "";
	document.getElementById("registerashelper").innerHTML = "Registering as logistic partner";
	
}
function regasPatient(){
	document.getElementById("register_type").value = 0;
	document.getElementById("patientcard").style.border = "4px solid #e91e63";
	document.getElementById("patientcard").style.borderRadius = "15px";
	document.getElementById("hcprovidercard").style.border = "";
	document.getElementById("hcprovidercard").style.borderRadius = "";
	document.getElementById("ridercard").style.border = "";
	document.getElementById("ridercard").style.borderRadius = "";
	document.getElementById("registerashelper").innerHTML = "Registering as patient. Press the next button to continue";
	
}
function openRegformfinal(){
	var baseimgreg = document.getElementById("register_ic_image").value;
	if(baseimgreg == "empty"){
		instaResponse("Please select an image of you holding your identification card or passport");
	}else{
		hide("register_identification");
		show("registerformbox");
	}
}
function nextToIc(){
	var regtype = document.getElementById("register_type").value; 
	if(regtype == 10){
		instaResponse("Please select registeration type");
	}else{
		
		hide("register_selection");
		show("register_identification");
	}
	
}
function checkToken(){
	return true;
}

//UI/UX management start
function openLoginFormRecovery(){
	hide("recovery");
	hide("register");
	show("login");
}
function openLoginForm(){
	//show("register_selection");
	hide("recovery");
	hide("register");
	hide("register_identification");
	hide("registerform");
	document.getElementById("register_ic_image").value = "Empty";
	document.getElementById("register_type").value = "10";
	document.getElementById("register_type").value = 6;
	document.getElementById("docregimg").style.border = "";
	document.getElementById("docregimg").style.borderRadius = "";
	document.getElementById("patregimg").style.border = "";
	document.getElementById("patregimg").style.borderRadius = "";
	document.getElementById("verificationcamera").src = "img/verifysample.jpg";
	show("login");
}
function openRecoveryForm(){
	hide("login");
	show("recovery");
}
function openRegisterForm(){
	hide("login");
	show("register");
}


//Authentication function start
//Login function
function login(){
	showLoading();
	event.preventDefault();
	var dataTopost = getFormData("loginform", "login");
	var login = new XMLHttpRequest();
	login.open("POST", serverUrl, true);
	login.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
	login.onload = function() {
		if (login.status == 200) {
			var json = login.responseText;
			var response = JSON.parse(json);
			if(response.status == "success"){
				authUser = response;
				if(authUser.type == 0 || authUser.type == 6 || authUser.type == 2 || authUser.type == 1){
					localStorage.setItem(app.name+"_login_token", response.login_token);
					location.reload();
					loadingResponse(response.message);
				}else{
					showLoading();
					loadingResponse("This app is for customer only");
				}
			}else{
				loadingResponse(response.message);
			}
		}else if (login.status == 404) {
			instaResponse("Fail to connect to our server. Try again later");
		} else {
			instaResponse("Fail to connect to our server. Try again later");
		}
	}
	login.send(dataTopost);
}

var pinactivationlink = '';
function initExistingVerification(uid){
	var dataTopost = "api=1&auth_token=" + authUser.login_token + "&initExistingVerification=true";
    var accounts_verification = new XMLHttpRequest();
    accounts_verification.open("POST", serverUrl, true);
    accounts_verification.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    accounts_verification.onload = function() {
        if (accounts_verification.status == 200) {
            var json = accounts_verification.responseText;
            var response = JSON.parse(json);

			if(response.status != "Fail"){
				if(response.request_status == ""){
					hide("accountverificationrequested");
				}else{
					show("accountverificationrequested");
				}
				if(response.trustgate_link == null || response.trustgate_link == ""){
					if(response.request_status == ""){
						hide("accountverificationrequested");
					}else{
						show("accountverificationrequested");
					}
					
					hide("trustgatelink");
				
				}else{
					show("trustgatelink");
					hide("urdocpromis");
					document.getElementById("opentrustgatepinlink").setAttribute('href', response.trustgate_link);
				}
				if(response.ic_font != null || response.ic_font != ""){
					document.getElementById("nurse_ic_front_placeholder").src = response.ic_font;
					document.getElementById("nurse_ic_front_base64").value = response.ic_font;
				}
				if(response.ic_back != null || response.ic_back != ""){
					document.getElementById("nurse_ic_back_placeholder").src = response.ic_back;
					document.getElementById("nurse_ic_back_base64").value = response.ic_back;
				}
				
				if(response.education_certification != null || response.education_certification != ""){
					if(response.education_certification.includes("pdf")){
						document.getElementById("nursedegreepdf").src = 'img/certok.png';
						document.getElementById("degreeinput").value = response.education_certification;
					}else{
						document.getElementById("nursedegreepicture").src = response.education_certification;
						document.getElementById("nursedegreeinput").value = response.education_certification;
					}
					
				}
				if(response.apc_file != null || response.apc_file != ""){
					if(response.education_certification.includes("pdf")){
						document.getElementById("nursenbrcpdf").src = 'img/certok.png';
						document.getElementById("nursenbrcinputbase").value = response.education_certification;
					}else{
						document.getElementById("nursenbrc").src = response.education_certification;
						document.getElementById("nursenbrcinput").value = response.education_certification;
					}
				}

				
			}else{
				
			}
			
        } else if (accounts_verification.status == 404) {
            alert("Fail to connect to our server");
        } else {
            alert("Fail to connect to our server");
        }
    }
    accounts_verification.send(dataTopost);
}

function setType(elements){
	document.getElementById("register_type").value = elements.value;
}
//Register account
function register(){
	showLoading();
	event.preventDefault();
	var dataTopost = getFormData("registerform", "register");
	var register = new XMLHttpRequest();
	register.open("POST", serverUrl, true);
	register.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
	register.onload = function() {
		if (register.status == 200) {
			var json = register.responseText;
			var response = JSON.parse(json);
			if(response.status == "success"){
				authUser = response;
				var pubToken = authUser.public_token;
				var secToken = authUser.secret_token;
				localStorage.setItem(app.name+"_login_token", response.login_token);
ConnectyCube.createSession()
	.then((session) => {
				const userProfile = {
				  login: pubToken,
				  password: secToken,
				};
				ConnectyCube.users
				.signup(userProfile)
				.then((user) => {
				location.reload();
						


				
					
					
					
				}).catch((error) => {});	

})
	.catch((error) => {
		console.log(error);
	});
					
			}else{
				loadingResponse(response.message);
			}
		
			
		}else if (register.status == 404) {
			instaResponse("Fail to connect to our server. Try again later");
		} else {
			instaResponse("Fail to connect to our server. Try again later");
		}
	}
	register.send(dataTopost);
}
//Recover password
function recover(){
	showLoading();
	event.preventDefault();
	var recoveryEmail = document.getElementById("recovery_email").value;
	if(recoveryEmail != ""){
		var dataTopost = getFormData("recoveryform", "recover_account");
		var recovery = new XMLHttpRequest();
		recovery.open("POST", serverUrl, true);
		recovery.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
		recovery.onload = function(){
			if (recovery.status == 200){
				
				var json = recovery.responseText;
				var response = JSON.parse(json);
				if(response.status == "success"){
					authUser = response;
				}
				
				loadingResponse(response.message);
			
			}else if(recovery.status == 404) {
				instaResponse("Fail to connect to our server. Try again later");
			}else{
				instaResponse("Fail to connect to our server. Try again later");
			}
		}
		recovery.send(dataTopost);
	}else{
		loadingResponse("Please fill all the form");
	}
}
function cancelPrepareverif(){
	document.getElementById("croppermainreg").style.display = "none";
document.getElementById("auth").style.display = "block";
}
function verificationPrepare(img, targetid, input){
targetinput = input;
target = targetid;
document.getElementById("croppermainreg").style.display = "block";
document.getElementById("auth").style.display = "none";
	var newb = nW - 50;
	var newH = nW - 50;
var el = document.getElementById('vanilla-demo-verify');
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

function prepareVerification(element){
	if(isondevice == false){
		var file1 = element.files[0];
		var reader = new FileReader();
		reader.onloadend = function() {
			verificationPrepare(reader.result, "profileimagecontainer", "profileimagecontainer");
		}
		reader.readAsDataURL(file1);
	}
}

function getImagereg(){
	vanilla.result('base64').then(function(base64) {
		document.getElementById("verificationcamera").src = base64;
		document.getElementById("register_ic_image").value = base64;
		document.getElementById("croppermainreg").style.display = "none";
		document.getElementById("auth").style.display = "block";
		vanilla.destroy();
	});
}

function initRiderSetting(){
	
}
function setOptions(srcType) {
    var options = {
        quality: 100,
        destinationType: Camera.DestinationType.FILE_URI,       
        sourceType: srcType,
        encodingType: Camera.EncodingType.JPEG,
        mediaType: Camera.MediaType.PICTURE,
        allowEdit: true,
        correctOrientation: true
    }
    return options;
}

function openVerificationCamera(){
	if(isondevice == true){
		  var options = {
		  limit: 1
	   };
	   navigator.device.capture.captureImage(onSuccess, onError, options);

	   function onSuccess(mediaFiles) {
		  var i, path, len;
		  for (i = 0, len = mediaFiles.length; i < len; i += 1) {
			 path = mediaFiles[i].fullPath;
			 console.log(mediaFiles);
			 console.log(path);
			 getFileContentAsBase64(path, function(base64Image){
				 verificationPrepare(base64Image, "register_ic_image", "verificationcamera");
			 });
		  }
	   }

	   function onError(error) {
		  navigator.notification.alert('Error code: ' + error.code, null, 'Capture Error');
	   }
	}else{
		document.getElementById("register_ic_image").value = 'test';
	}
}

function getFileContentAsBase64(path,callback){
    window.resolveLocalFileSystemURL(path, gotFile, fail);     
    function fail(e) {
          alert('Cannot found requested file');
    }

    function gotFile(fileEntry) {
           fileEntry.file(function(file) {
              var reader = new FileReader();
              reader.onloadend = function(e) {
                   var content = this.result;
                   callback(content);
              };
              // The most important point, use the readAsDatURL Method from the file plugin
              reader.readAsDataURL(file);
           });
    }
}
function openVerificationCameraOlder(){
	if(isondevice == true){
		navigator.camera.getPicture(onSuccess, onFail, {  
		  quality: 50, 
		  destinationType: Camera.DestinationType.DATA_URL 
	   });  
	   
	    function onSuccess(imageData) { 
			var imgdatax = "data:image/jpeg;base64," + imageData; 
			verificationPrepare(imgdatax, "register_ic_image", "verificationcamera");
	    }  
	   
	    function onFail(message) { 
		  alert('Failed because: ' + message); 
	    } 
	}else{
		document.getElementById("register_ic_image").value = 'test';
	}
}

function openVerificationCameraOld(){
	var options = {
      limit: 1
   };
   navigator.device.capture.captureImage(onSuccess, onError, options);
   function onSuccess(mediaFiles) {
      var i, path, len;
      for (i = 0, len = mediaFiles.length; i < len; i += 1) {
			path = mediaFiles[i].localURL;
			
			fileReader = new FileReader(); 
			var file = new window.File(mediaFiles[i].name, mediaFiles[i].localURL, 
								   mediaFiles[i].type, mediaFiles[i].lastModifiedDate, mediaFiles[i].size);
			fileReader.onload = function (readerEvt) {
				var base64 = readerEvt.target.result;
				document.getElementById("verificationcamera").src = base64;
				console.log(mediaFiles);
			};
			fileReader.readAsDataURL(file); 
				
			console.log("Ended");
      }
   }

   function onError(error) {
      navigator.notification.alert('Error code: ' + error.code, null, 'Capture Error');
   }
}

function initSetAddress(elements){
  var searchQuery = elements.value;
  document.getElementById('addresslist').innerHTML = '';
  var displaySuggestions = function(predictions, status) {
    if (status != google.maps.places.PlacesServiceStatus.OK) {
      document.getElementById('addresslist').innerHTML = '<p class="collection-item">Can\'t find that address</p>';
      return;
    }
    predictions.forEach(function(prediction) {
      var lol = '<p style="border: 1px solid #cacaca; padding: 10px; border-radius: 5px;" onclick="setNoLoclat(\'' + prediction.description + '\')" ><i class="material-icons v-icons pink-text" style="vertical-align: bottom">location_on</i>' + prediction.description + '</p>';
      document.getElementById("addresslist").innerHTML += lol;
    });
  };

	var service = new google.maps.places.AutocompleteService();
	service.getQueryPredictions({
		input: searchQuery
	}, displaySuggestions);
}

function reverification(){
	showLoading();
	var reverifyimagebase64 = document.getElementById("reverifyimagebase64").value;
	if(reverifyimagebase64 != ""){
		var dataTopost = "api=1&auth_token=" + authUser.login_token + "&reverifyimagebase64="+reverifyimagebase64;
		var users = new XMLHttpRequest();
		users.open("POST", serverUrl, true);
		users.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
		users.onload = function() {
			if (users.status == 200) {
				var json = users.responseText;
				var response = JSON.parse(json);
				document.getElementById("reverificationNotes").innerHTML = response.message;
			} else if (users.status == 404) {
				alert("Fail to connect to our server");
			} else {
				alert("Fail to connect to our server");
			}
		}
		users.send(dataTopost);
	}else{
		instaResponse("Please take a photo of you holding your IC/Passport before submmiting");
	}
}
function reopenVerificationCamera(){
	if(isondevice == true){
		navigator.camera.getPicture(onSuccess, onFail, {  
		  	quality: 50,
		  	destinationType: Camera.DestinationType.DATA_URL,
			sourceType: Camera.PictureSourceType.CAMERA,
	   });  
	   

	}else{
		document.getElementById("register_ic_image").value = 'test';
	}

	function onSuccess(imageData) {
		var img = "data:image/jpeg;base64," + imageData;
		document.getElementById("reverifyimagebase64").value = img;
		document.getElementById("reverificationcameraimg").src = img;
	}

	function onFail(message) {
		alert('Failed because: ' + message);
	}
}



function newopenVerificationCamera(){
	if(isondevice == true){
		navigator.camera.getPicture(onSuccess, onFail, {
			quality: 50,
			destinationType: Camera.DestinationType.DATA_URL,
			sourceType: Camera.PictureSourceType.CAMERA,
		});


	}else{
		document.getElementById("register_ic_image").value = 'test';
	}
	function onSuccess(imageData) {
		var img = "data:image/jpeg;base64," + imageData;
		verificationPrepare(img, "register_ic_image", "verificationcamera");
		document.getElementById("verificationcamera").src = img;
	}

	function onFail(message) {
		alert('Failed because: ' + message);
	}
}
document.addEventListener("deviceready", onDeviceReady, false);
function onDeviceReady() {
	console.log(navigator.camera);
	document.getElementById('verificationcamera').addEventListener('click', openVerificationCamera);
}
