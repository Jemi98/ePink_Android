//Specialist
function getPDF(element){
	instaResponse("Processing file");
	var file1 = element.files[0];
	var reader = new FileReader();
	reader.onloadend = function(){
		let results = reader.result;
		if(results.includes("application/pdf")){
			document.getElementById("nsrfile").value = results;
		}else{
			instaResponse("PDF File only");
		}
		
	}
	reader.readAsDataURL(file1);
}
function initSpecialistVerificationRequest(){
    var dataTopost = "api=1&auth_token=" + authUser.login_token + "&viewallspecialist_verification="+authUser.id;
    var specialist_verification = new XMLHttpRequest();
    specialist_verification.open("POST", serverUrl, true);
    specialist_verification.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    specialist_verification.onload = function() {
        if (specialist_verification.status == 200) {
            var json = specialist_verification.responseText;
            var response = JSON.parse(json);
			var i;
			document.getElementById("viewallspecialist_verification").innerHTML ="";
			if(response.status == null){
				for (i = 0; i < response.length; i++) {
					if(response[i].status != "Declined"){
						document.getElementById("viewallspecialist_verification").innerHTML += '<li class="collection-item"><p class="pink-text strong"> '+response[i].specialties+' verification </p><p class="small">Status : '+response[i].status+'</p></li>';
					}else{
						document.getElementById("viewallspecialist_verification").innerHTML += '<li class="collection-item"><p class="pink-text strong"> '+response[i].specialties+' verification </p><p class="small">Declined for: '+response[i].decline_reason+'</p></li>';
					}
					
				}
			}else{
				document.getElementById("viewallspecialist_verification").innerHTML = '<li class="collection-item">You haven\'t sent any verification request</li>';
			}
        } else if (specialist_verification.status == 404) {
            alert("Fail to connect to our server");
        } else {
            alert("Fail to connect to our server");
        }
    }
    specialist_verification.send(dataTopost);
}
function insertTospecialist_verification(){
    showLoading();
		var specialties = document.getElementById("nsrspeciality").value;
		var nsrid = document.getElementById("nsrnumber").value;
		var nsrfile = document.getElementById("nsrfile").value;
		var dataTopost = "api=1&auth_token=" + authUser.login_token + "&submitspecialist_verification=true&specialties="+specialties+"&nsrid="+nsrid+"&nsrfile="+nsrfile;
		var specialist_verification = new XMLHttpRequest();
		specialist_verification.open("POST", serverUrl, true);
		specialist_verification.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
		specialist_verification.onload = function() {
			if (specialist_verification.status == 200) {
				var json = specialist_verification.responseText;
				var response = JSON.parse(json);
				loadingResponse(response.message);
			} else if (specialist_verification.status == 404) {
				alert("Fail to connect to our server");
			} else {
				alert("Fail to connect to our server");
			}
		}
		specialist_verification.send(dataTopost);
}
//Specialist


function initSetting(){
	//Profile management
	document.getElementById("menuname").innerHTML = '<i class="material-icons tiny pink-text" style="vertical-align: middle;">person_outline</i> '+authUser.firstname+' '+authUser.lastname;
	document.getElementById("menuphonenumber").innerHTML = '<i class="material-icons tiny pink-text" style="vertical-align: middle;">phone</i> '+authUser.phonenumber;
	document.getElementById("update_firstname").value = authUser.firstname;
	document.getElementById("update_lastname").value = authUser.lastname;
	document.getElementById("profileimagecontainer").src = authUser.profile_img;
}
document.getElementById("updateaccountform").addEventListener("submit", updateProfile);
document.getElementById("updateaccountformrunner").addEventListener("submit", updateRunnerProfile);
function updateProfile(){
	showLoading();
	event.preventDefault();
	var dataTopost = getFormData("updateaccountform", "update_account", true);
	var updateaccount = new XMLHttpRequest();
	updateaccount.open("POST", serverUrl, true);
	updateaccount.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
	updateaccount.onload = function() {
		if (updateaccount.status == 200) {
			var json = updateaccount.responseText;
			var response = JSON.parse(json);
			if(response.status == "success"){
					document.getElementById("rider_profile_picture_update").value = '';
			}
			loadingResponse(response.message);
			
		}else if (updateaccount.status == 404) {
			alert("Fail to connect to our server");
		} else {
			alert("Fail to connect to our server");
		}
	}
	updateaccount.send(dataTopost);
}
function updateRunnerProfile(){
	showLoading();
	event.preventDefault();
	var dataTopost = getFormData("updateaccountformrunner", "update_account_runner", true);
	var updateaccount = new XMLHttpRequest();
	updateaccount.open("POST", serverUrl, true);
	updateaccount.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
	updateaccount.onload = function() {
		if (updateaccount.status == 200) {
			var json = updateaccount.responseText;
			var response = JSON.parse(json);
			if(response.status == "success"){
				authUser.firstname = response.firstname;
				authUser.lastname = response.lastname;
				var newphonenumber = document.getElementById("update_phonenumber").value;
				authUser.phonenumber = newphonenumber;
			}
			loadingResponse(response.message);
			
		}else if (updateaccount.status == 404) {
			alert("Fail to connect to our server");
		} else {
			alert("Fail to connect to our server");
		}
	}
	updateaccount.send(dataTopost);
}
function initSpProfilemanager(){
	hide("personaltabcontent");
	show("personaltabpreloader");
	show("personaltab");
	hide("orgtab");
	hide("orgtabcontent");
	show("orgtabpreloader");
	var dataTopost = "api=1&auth_token=" + authUser.login_token + "&spaccount=true";
    var users = new XMLHttpRequest();
    users.open("POST", serverUrl, true);
    users.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    users.onload = function() {
    if (users.status == 200) {
            var json = users.responseText;
            var response = JSON.parse(json);
			document.getElementById("sp_update_firstname").value = response.firstname;
			document.getElementById("sp_profile_placeholder").src = response.profile_img;
			document.getElementById("sp_update_lastname").value = response.lastname;
			document.getElementById("sp_update_about_me").value = response.about_me;
			document.getElementById("sp_ph_number").value = response.phonenumber;
			document.getElementById("sp_ic_number").value = response.ic_number;
			document.getElementById("sp_update_university").value = response.education;
			hide("personaltabpreloader");
			show("personaltabcontent");
        } else if (users.status == 404) {
            alert("Fail to connect to our server");
        } else {
            alert("Fail to connect to our server");
        }
    }
	users.timeout = 60000;
    users.send(dataTopost);
}

function openOrganizationmanager(){
	hide("orgtabcontent");
	show("orgtabpreloader");
	var dataTopost = "api=1&auth_token=" + authUser.login_token + "&sporganization=true";
    var users = new XMLHttpRequest();
    users.open("POST", serverUrl, true);
    users.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    users.onload = function() {
        if (users.status == 200) {
            var json = users.responseText;
            var response = JSON.parse(json);
			document.getElementById("sp_update_organization_name").value = response.organization_name;
			document.getElementById("sp_update_organization_designation").value = response.organization_designation;
			document.getElementById("sp_update_organization_address").value = response.organization_address;
			document.getElementById("sp_update_organization_city").value = response.organization_city;
			document.getElementById("sp_update_organization_state").value = response.organization_state;
			document.getElementById("sp_update_organization_postcode").value = response.organization_postcode;
			document.getElementById("sp_update_organization_country").value = response.organization_country;
			document.getElementById("sp_update_organization_phone_number").value = response.organization_phone_number;
			document.getElementById("sp_update_organization_fax_number").value = response.organization_fax_number;
			document.getElementById("sp_update_organization_number").value = response.organization_registeration_number;
			hide("orgtabpreloader");
			show("orgtabcontent");
        } else if (users.status == 404) {
            alert("Fail to connect to our server");
        } else {
            alert("Fail to connect to our server");
        }
    }
    users.send(dataTopost);
}

function updateSPorganization(){
	showLoading();
	var organization_name = getValue("sp_update_organization_name");
	var organization_designation = getValue("sp_update_organization_designation");
	var organization_address = getValue("sp_update_organization_address");
	var organization_city = getValue("sp_update_organization_city");
	var organization_state = getValue("sp_update_organization_state");
	var organization_postcode = getValue("sp_update_organization_postcode");
	var organization_country = getValue("sp_update_organization_country");
	var organization_phone_number = getValue("sp_update_organization_phone_number");
	var organization_fax_number = getValue("sp_update_organization_fax_number");
	var organization_registeration_number = getValue("sp_update_organization_number");
	var dataTopost = "api=1&auth_token=" + authUser.login_token + "&editusersorganization=true&editorganization_name="+organization_name+"&editorganization_designation="+organization_designation+"&editorganization_address="+organization_address+"&editorganization_city="+organization_city+"&editorganization_state="+organization_state+"&editorganization_postcode="+organization_postcode+"&editorganization_country="+organization_country+"&editorganization_phone_number="+organization_phone_number+"&editorganization_fax_number="+organization_fax_number+"&editorganization_registeration_number="+organization_registeration_number;
	var users = new XMLHttpRequest();
	users.open("POST", serverUrl, true);
	users.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
	users.onload = function() {
		if (users.status == 200) {
			var json = users.responseText;
			var response = JSON.parse(json);
			loadingResponse(response.message);
		} else if (users.status == 404) {
			alert("Fail to connect to our server");
		} else {
			alert("Fail to connect to our server");
		}
	}
	users.send(dataTopost);
}
function updateSpAccount(){
	event.preventDefault();
	hide("personaltabcontent");
	show("personaltabpreloader");
	var sp_update_firstname = getValue("sp_update_firstname");
	var sp_update_lastname = getValue("sp_update_lastname");
	var sp_update_about_me = getValue("sp_update_about_me");
	var sp_ph_number = getValue("sp_ph_number");
	var sp_ic_number = getValue("sp_ic_number");
	var sp_update_university = getValue("sp_update_university");	
	var sp_profile_base64 = getValue("sp_profile_base64");	
	var dataTopost = "api=1&auth_token=" + authUser.login_token + "&updatespaccount=true&firstname="+sp_update_firstname+"&lastname="+sp_update_lastname+"&aboutme="+sp_update_about_me+"&phonenumber="+sp_ph_number+"&icnumber="+sp_ic_number+"&university="+sp_update_university+"&profileimage="+sp_profile_base64;
	var users = new XMLHttpRequest();
	users.open("POST", serverUrl, true);
	users.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
	users.onload = function() {
		if (users.status == 200) {
			var json = users.responseText;
			var response = JSON.parse(json);
			loadingResponse(response.message);
			hide("personaltabpreloader");
			show("personaltabcontent");
		} else if (users.status == 404) {
			alert("Fail to connect to our server");
		} else {
			alert("Fail to connect to our server");
		}
	}
	users.send(dataTopost);
}