function initCarerequest(){
    var dataTopost = "api=1&auth_token=" + authUser.login_token + "&viewallcare=true";
    var care = new XMLHttpRequest();
    care.open("POST", serverUrl, true);
    care.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    care.onload = function() {
        if (care.status == 200) {
            var json = care.responseText;
            var response = JSON.parse(json);
			var i;
			if(authUser.type == 0){
				var currentlyviewing = "Customer";
			}else{
				var currentlyviewing = "Doctor";
			}
			
			
			
			document.getElementById("viewallcare").innerHTML ="";
			if(response.status == null){
				for (i = 0; i < response.length; i++) {
					if(response[i].caretype == "Custom Consultation"){
						
						document.getElementById("viewallcare").innerHTML += '<li class="collection-item" onclick="openpage(\'cusoultationtelewait\', '+response[i].id+')"><div class="row" style="margin-bottom: 0px"><div class="col s3" style="padding: 0px;     margin-left: -13px;"><img src="https://epink.health/img/videocall.jpg" width="100%" style="border-radius: 5px"></div><div class="col s9"><p><span class="strong"></span> <span class="strong">Tele Consultation</span> <span class="right">'+response[i].caredate+' '+response[i].caretime+'</span></p> <p><span class="strong">Status:</span> <span class="">'+response[i].request_status+'</span></p></div></li>';
					}else{
						console.log(sdimg);
						var sd = response[i].servicedata;
						var sdimg = sd.icon;
						document.getElementById("viewallcare").innerHTML += '<li class="collection-item" onclick="openpage(\'carenewstatus\', '+response[i].id+', \''+currentlyviewing+'\')"><div class="row" style="margin-bottom: 0px"><div class="col s3" style="padding: 0px;     margin-left: -13px;"><img src="'+sdimg+'" width="100%" style="border-radius: 5px"></div><div class="col s9"><p><span class="strong"></span> <span class="strong">'+response[i].patientproblem+'</span> </p> <span><span class="strong">Status:</span> <span class="">'+response[i].request_status+'</span></span><br><span><span class="">'+response[i].datetime+'</span></span></div></li>';
					}
					
				}
			}else{
				document.getElementById("viewallcare").innerHTML = '<li class="collection-item">You have made no Care request</li>';
			}
            loadingResponse(response.message);
        } else if (care.status == 404) {
            alert("Fail to connect to our server");
        } else {
            alert("Fail to connect to our server");
        }
    }
    care.send(dataTopost);
}
function opencareRequests(){
	hide("carelooking");
	openpage("carerequestlist");
	
}
function openPatientpicker(opnwhat){
	show("careinput");
	if(opnwhat == "setpatient"){
		document.getElementById("careinputcontent").innerHTML = '<label>Please Select Patient</label><input type="text" id="entersickness"><button class="btn pink white-text btn-block" onclick="setcarePatient()">SET</button>';
	}else{
		document.getElementById("careinputcontent").innerHTML = '<label>Please enter your sickness</label><input type="text" id="entersickness"><button class="btn pink white-text btn-block" onclick="setcareSickness()">SET</button>';
	}
}
var globalRequest = 0;

function viewThiscare(id){
    var dataTopost = "api=1&auth_token=" + authUser.login_token + "&viewThiscare="+globalRequest;
    var care = new XMLHttpRequest();
    care.open("POST", serverUrl, true);
    care.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    care.onload = function() {
        if(care.status == 200){
            var json = care.responseText;
            var response = JSON.parse(json);
			console.log(response);
			if(response.request_status == "New"){
				setTimeout(function(){ viewThiscare(); }, 3000);
			}else if(response.request_status == "Accepted"){
				initdocInfo(response.doc_id);
			}
        } else if (care.status == 404) {
            alert("Fail to connect to our server");
        } else {
            alert("Fail to connect to our server");
        }
    }
    care.send(dataTopost);
}
function initdocInfotwo(id){
	showLoading();
	show("docinfo");
		document.getElementById("doctorinfo_picture").src = "img/default_profile_picture.jpg";
		var dataTopost = 'api=1&auth_token='+authUser.login_token+"&doctorinfotwo="+id;
		var xhr = new XMLHttpRequest();
		xhr.open("POST", serverUrl, true);
		xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
		xhr.onload = function() {
			if (xhr.status == 200) {
				var json = xhr.responseText;
				var response = JSON.parse(json);
				document.getElementById("doctorinfo_picture").src = response.profile_img;
				document.getElementById("doctorinfo_name").innerHTML = 'Dr.'+response.firstname+' '+response.lastname;
				document.getElementById("doctorinfo_category").innerHTML = response.category;
				document.getElementById("doctorinfo_residency").innerHTML = response.residency;
				document.getElementById("doctorinfo_eduction").innerHTML = response.education;
				document.getElementById("doctorinfo_specialist").innerHTML = response.specialist;
				document.getElementById("practice_country").innerHTML = response.practice_country;
				document.getElementById("doc_language").innerHTML = response.language;
			
				closeLoading();
				
			} else if (xhr.status == 404) {
				alert("Fail to connect to our server");
			} else {
				alert("Fail to connect to our server");
			}
		}
		xhr.send(dataTopost);
}
function cancelRequest(){
	var dataTopost = "api=1&auth_token=" + authUser.login_token + "&cancelcarerequest="+globalRequest;
    var care = new XMLHttpRequest();
    care.open("POST", serverUrl, true);
    care.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    care.onload = function() {
        if (care.status == 200) {
            var json = care.responseText;
            var response = JSON.parse(json);
          
			location.reload();
		
        } else if (care.status == 404) {
            alert("Fail to connect to our server");
        } else {
            alert("Fail to connect to our server");
        }
    }
    care.send(dataTopost);
}

function requestDoctor(){
	showLoading();
	userDetectedAddress = document.getElementById("detectedaddress").innerHTML;
	userDetectedLat = parseFloat(document.getElementById("detectedlat").innerHTML);
	userDetectedLng = parseFloat(document.getElementById("detectedlng").innerHTML);
	mainDeliveryCordinate.lat = parseFloat(document.getElementById("detectedlat").innerHTML);
	mainDeliveryCordinate.lng = parseFloat(document.getElementById("detectedlng").innerHTML);
	mainDeliveryCordinate.address = document.getElementById("detectedaddress").innerHTML;
	var patientname  = document.getElementById("patiencecare").innerHTML;
	var pantientproblem =  document.getElementById("patiencesickness").innerHTML;
	var caredate =  document.getElementById("caredate").value;
	var caretime =  document.getElementById("caretime").value;
	var caretype =  document.getElementById("caretype").value;
	var dataTopost = 'api=1&auth_token='+authUser.login_token+"&requestdoctor=true&patientname="+patientname+"&patientsickness="+pantientproblem+"&patientaddress="+mainDeliveryCordinate.address+"&caredate="+caredate+"&caretime="+caretime+"&lat="+mainDeliveryCordinate.lat+"&lng="+mainDeliveryCordinate.lng+"&caretype="+caretype;
		var xhr = new XMLHttpRequest();
		xhr.open("POST", serverUrl, true);
		xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
		xhr.onload = function(){
			if (xhr.status == 200){
				var json = xhr.responseText;
				var response = JSON.parse(json);
				console.log(response);
				closeLoading();
				globalRequest = response.last_id;
				show("carelooking");
				viewThiscare();
			} else if (xhr.status == 404) {
				alert("Fail to connect to our server");
			} else {
				alert("Fail to connect to our server");
			}
	}
	xhr.send(dataTopost);
}
function closePatientPicker(){
	hide("careinput");
	document.getElementById("careinputcontent").innerHTML = "";
}

function setcareSickness(){
	document.getElementById("patiencesickness").innerHTML = document.getElementById("entersickness").value;
	closePatientPicker();
}
function setcarePatient(){
	document.getElementById("patiencecare").innerHTML = document.getElementById("entersickness").value;
	closePatientPicker();
}
function openfirstStep(){
	show("firststepButtons");
	show("firsttep");
	hide("secondstepbuttons");
	hide("secondstep");
}
function opensecondStep(){
	hide("firststepButtons");
	hide("firsttep");
	show("secondstepbuttons");
	show("secondstep");
	hide("thirdstepbuttons");
	hide("thirdstep");
}
function openthirdStep(){
	var caredate = document.getElementById("caredate").value;
	var caretime = document.getElementById("caretime").value;
	if(caredate == "" || caretime == ""){
		instaResponse("Please set date and time");
	}else{
	hide("secondstep");
	hide("secondstepbuttons");
	show("thirdstepbuttons");
	show("thirdstep");
	}
}