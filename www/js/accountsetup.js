var registeration_bodies = '';
function finalApproval(){
	showLoading();
	var pinnummber = document.getElementById("signinpinnumber").value;
	var signature = document.getElementById("sp_signature_base64_final").value;
	var len = document.getElementById("signinpinnumber").value.length;
	if(len == 8){
		
		var dataTopost = "api=1&auth_token=" + authUser.login_token + "&docfinalsetup="+pinnummber+"&signature="+signature;
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
	}else{
		loadingResponse("Your Pin number must be in 8 character");
	}
	
}

function closeDecline(){
	hide("verificationdeclined");
}
function initServiceprovidercheck(){
	console.log(authUser.verified_service_provider);
	if(authUser.verified_service_provider == "Approved"){
		hide("accountverificationrequested");
		hide("verificationdeclined");
		hide("newaccountsetup");
		openpage("universalserviceprovider");
	}else if(authUser.verified_service_provider == "Requested"){
		document.getElementById("serviceprovidernameverification").innerHTML = authUser.firstname+' '+authUser.lastname;
		if(authUser.verifying_for == "Doctor" || authUser.verifying_for == "Pharmacist"){
			document.getElementById("signinpinnumber").value = authUser.trustgatepin;
			document.getElementById("sp_signature_final").src = authUser.signaturefile;
			
			show("accountverificationrequested");
			hide("setupdoctorfinal");
		}else{
			hide("setupdoctorfinal");
			show("accountverificationrequested");
		}
		hide("newaccountsetup");
		
		if(authUser.trustgate_pin_activation_link != null){
			hide("urdocpromis");
			
		}else{
			
		}
	}else if(authUser.verified_service_provider == "Declined"){
		
		document.getElementById("decline_reason").innerHTML = authUser.decline_reason;
		show("verificationdeclined");
		show("newaccountsetup");
		hide("accountverificationrequested");
		hide("setupdoctorfinal");
		hide("urdocpromis");
		
	}else{
		hide("verificationdeclined");
		hide("accountverificationrequested");
		show("newaccountsetup");
	}
}
function accountsetupCheck(element){
	registeration_bodies = '';
	var selected = element.value;
	document.getElementById("sp_verify_organization_designation").value = selected;
	document.getElementById("sp_verify_organization_designation").readOnly = true;
	if(selected == "Doctor"){
		
		verifying_for = selected;
		registeration_bodies = "Malaysian Medical Council";
		document.getElementById("apc-bodies-cert").innerHTML = registeration_bodies;
		document.getElementById("apc-bodies-number").innerHTML = registeration_bodies;
		document.getElementById("apc-bodies-cert-helper").innerHTML = registeration_bodies;
		document.getElementById("apc-bodies-cert-helper-photo").innerHTML = registeration_bodies;
		document.getElementById("apc-bodies-cert-helper-pdf").innerHTML = registeration_bodies;
		document.getElementById("apc-bodies-cert-helper-number").innerHTML = registeration_bodies;
		hide("hspt-doctor");
		show("hspt-universal");
		show("certpdf");
		hide("certimage");
		hide("apcimg");
		show("apcpdf");
		show("apcmcmcnumber");
	}else if(selected == "Pharmacist"){
		
		verifying_for = selected;
		registeration_bodies = "Pharmacy Board Malaysia";
		document.getElementById("apc-bodies-cert").innerHTML = registeration_bodies;
		document.getElementById("apc-bodies-number").innerHTML = registeration_bodies
		document.getElementById("apc-bodies-cert-helper").innerHTML = registeration_bodies;
		document.getElementById("apc-bodies-cert-helper-photo").innerHTML = registeration_bodies;
		document.getElementById("apc-bodies-cert-helper-pdf").innerHTML = registeration_bodies;
		document.getElementById("apc-bodies-cert-helper-number").innerHTML = registeration_bodies;
		
		hide("hspt-doctor");
		show("hspt-universal");
		show("certpdf");
		hide("certimage");
		hide("apcimg");
		show("apcpdf");
		show("apcmcmcnumber");
	}else if(selected == "Nurse"){
		verifying_for = selected;
		document.getElementById("apc-bodies-cert").innerHTML = "National Nursing Board Registeration";
		document.getElementById("apc-bodies-number").innerHTML = "National Nursing Board Registeration";
		document.getElementById("apc-bodies-cert-helper").innerHTML = "National Nursing Board Registeration";
		document.getElementById("apc-bodies-cert-helper-photo").innerHTML = "National Nursing Board Registeration";
		document.getElementById("apc-bodies-cert-helper-number").innerHTML = "National Nursing Board Registeration";
		registeration_bodies = "National Nursing Board Registeration";
		hide("hspt-doctor");
		show("hspt-universal");
		hide("certpdf");
		show("certimage");
		show("apcimg");
		hide("apcpdf");
	}else if(selected == "Dentist"){
		verifying_for = selected;
		document.getElementById("apc-bodies-cert").innerHTML = "Malaysian Dental Council (MDC)";
		document.getElementById("apc-bodies-number").innerHTML = "Malaysian Dental Council (MDC)";
		document.getElementById("apc-bodies-cert-helper").innerHTML = "Malaysian Dental Council (MDC)";
		document.getElementById("apc-bodies-cert-helper-photo").innerHTML = "Malaysian Dental Council (MDC)";
		document.getElementById("apc-bodies-cert-helper-number").innerHTML = "Malaysian Dental Council (MDC)";
		registeration_bodies = "Malaysian Dental Council (MDC)";
		hide("hspt-doctor");
		show("hspt-universal");
		
		show("apcmcmcnumber");
		show("certimage");
		show("apcimg");
		hide("apcpdf");
		hide("certpdf");
	}else if(selected == "Psychologist"){
		verifying_for = selected;
		registeration_bodies = "Malaysian Councellor Board";
		document.getElementById("apc-bodies-cert").innerHTML = registeration_bodies;
		document.getElementById("apc-bodies-number").innerHTML = registeration_bodies;
		document.getElementById("apc-bodies-cert-helper").innerHTML = registeration_bodies;
		document.getElementById("apc-bodies-cert-helper-photo").innerHTML = registeration_bodies;
		document.getElementById("apc-bodies-cert-helper-number").innerHTML =registeration_bodies;
		hide("hspt-doctor");
		show("hspt-universal");
		show("apcmcmcnumber");
		show("certimage");
		show("apcimg");
		hide("apcpdf");
		hide("certpdf");
	}else if(selected == "Dietician"){
		verifying_for = selected;
		registeration_bodies = "Malaysian Allied Health Professions Council";
		document.getElementById("apc-bodies-cert").innerHTML = registeration_bodies;
		document.getElementById("apc-bodies-number").innerHTML = registeration_bodies;
		document.getElementById("apc-bodies-cert-helper").innerHTML = registeration_bodies;
		document.getElementById("apc-bodies-cert-helper-photo").innerHTML = registeration_bodies;
		document.getElementById("apc-bodies-cert-helper-number").innerHTML =registeration_bodies;
		hide("hspt-doctor");
		show("hspt-universal");
		show("apcmcmcnumber");
		show("certimage");
		show("apcimg");
		hide("apcpdf");
		hide("certpdf");
	}else if(selected == "Optimetricst"){
		verifying_for = selected;
		registeration_bodies = "Malaysian Allied Health Professions Council";
		document.getElementById("apc-bodies-cert").innerHTML = registeration_bodies;
		document.getElementById("apc-bodies-number").innerHTML = registeration_bodies;
		document.getElementById("apc-bodies-cert-helper").innerHTML = registeration_bodies;
		document.getElementById("apc-bodies-cert-helper-photo").innerHTML = registeration_bodies;
		document.getElementById("apc-bodies-cert-helper-number").innerHTML =registeration_bodies;
		hide("hspt-doctor");
		show("hspt-universal");
		show("apcmcmcnumber");
		show("certimage");
		show("apcimg");
		hide("apcpdf");
		hide("certpdf");
	}else if(selected == "Genetician"){
		verifying_for = selected;
		registeration_bodies = "Malaysian Allied Health Professions Council";
		document.getElementById("apc-bodies-cert").innerHTML = registeration_bodies;
		document.getElementById("apc-bodies-number").innerHTML = registeration_bodies;
		document.getElementById("apc-bodies-cert-helper").innerHTML = registeration_bodies;
		document.getElementById("apc-bodies-cert-helper-photo").innerHTML = registeration_bodies;
		document.getElementById("apc-bodies-cert-helper-number").innerHTML =registeration_bodies;
		hide("hspt-doctor");
		show("hspt-universal");
		show("apcmcmcnumber");
		show("certimage");
		show("apcimg");
		hide("apcpdf");
		hide("certpdf");
	}else if(selected == "Physiotherapist"){
		verifying_for = selected;
		registeration_bodies = "Malaysian Allied Health Professions Council";
		document.getElementById("apc-bodies-cert").innerHTML = registeration_bodies;
		document.getElementById("apc-bodies-number").innerHTML = registeration_bodies;
		document.getElementById("apc-bodies-cert-helper").innerHTML = registeration_bodies;
		document.getElementById("apc-bodies-cert-helper-photo").innerHTML = registeration_bodies;
		document.getElementById("apc-bodies-cert-helper-number").innerHTML =registeration_bodies;
		hide("hspt-doctor");
		show("hspt-universal");
		show("apcmcmcnumber");
		show("certimage");
		show("apcimg");
		hide("apcpdf");
		hide("certpdf");
	}else if(selected == "Medical Attendant"){
		verifying_for = selected;
		registeration_bodies = "Malaysian Allied Health Professions Council";
		document.getElementById("apc-bodies-cert").innerHTML = registeration_bodies;
		document.getElementById("apc-bodies-number").innerHTML = registeration_bodies;
		document.getElementById("apc-bodies-cert-helper").innerHTML = registeration_bodies;
		document.getElementById("apc-bodies-cert-helper-photo").innerHTML = registeration_bodies;
		document.getElementById("apc-bodies-cert-helper-number").innerHTML =registeration_bodies;
		hide("hspt-doctor");
		show("hspt-universal");
		show("apcmcmcnumber");
		show("certimage");
		show("apcimg");
		hide("apcpdf");
		hide("certpdf");
	}else if(selected == "Assistant Medical Officer"){
		verifying_for = selected;
		registeration_bodies = "Medical Assistant Board";
		document.getElementById("apc-bodies-cert").innerHTML = registeration_bodies;
		document.getElementById("apc-bodies-number").innerHTML = registeration_bodies;
		document.getElementById("apc-bodies-cert-helper").innerHTML = registeration_bodies;
		document.getElementById("apc-bodies-cert-helper-photo").innerHTML = registeration_bodies;
		document.getElementById("apc-bodies-cert-helper-number").innerHTML =registeration_bodies;
		hide("hspt-doctor");
		show("hspt-universal");
		show("apcmcmcnumber");
		show("certimage");
		show("apcimg");
		hide("apcpdf");
		hide("certpdf");
	}else if(selected == "Nutrionist"){
		verifying_for = selected;
		registeration_bodies = "Malaysian Allied Health Professions Council";
		document.getElementById("apc-bodies-cert").innerHTML = registeration_bodies;
		document.getElementById("apc-bodies-number").innerHTML = registeration_bodies;
		document.getElementById("apc-bodies-cert-helper").innerHTML = registeration_bodies;
		document.getElementById("apc-bodies-cert-helper-photo").innerHTML = registeration_bodies;
		document.getElementById("apc-bodies-cert-helper-number").innerHTML =registeration_bodies;
		hide("hspt-doctor");
		show("hspt-universal");
		show("apcmcmcnumber");
		show("certimage");
		show("apcimg");
		hide("apcpdf");
		hide("certpdf");
	}else if(selected == "Medical Lab Technologist"){
		verifying_for = selected;
		registeration_bodies = "MLT / MLS ";
		document.getElementById("apc-bodies-cert").innerHTML = registeration_bodies;
		document.getElementById("customnote").innerHTML = 'Please state N/A if not applicable ';
		document.getElementById("apc-bodies-number").innerHTML = registeration_bodies;
		document.getElementById("apc-bodies-cert-helper").innerHTML = registeration_bodies;
		document.getElementById("apc-bodies-cert-helper-photo").innerHTML = registeration_bodies;
		document.getElementById("apc-bodies-cert-helper-number").innerHTML =registeration_bodies;
		hide("hspt-doctor");
		show("hspt-universal");
		show("apcmcmcnumber");
		show("certimage");
		show("apcimg");
		hide("apcpdf");
		hide("certpdf");
	}else if(selected == "Caregiver"){
		verifying_for = selected;
		registeration_bodies = "None ";
		document.getElementById("apc-bodies-cert").innerHTML = registeration_bodies;
		document.getElementById("customnote").innerHTML = 'Please state N/A if not applicable';
		document.getElementById("apc-bodies-number").innerHTML = registeration_bodies;
		document.getElementById("apc-bodies-cert-helper").innerHTML = registeration_bodies;
		document.getElementById("apc-bodies-cert-helper-photo").innerHTML = registeration_bodies;
		document.getElementById("apc-bodies-cert-helper-number").innerHTML =registeration_bodies;
		hide("hspt-doctor");
		hide("apcmcmcnumber");
		hide("apcimg");
		hide("apcpdf");
		show("hspt-universal");
		hide("certpdf");
		hide("apcpdf");
		show("certimage");
		hide("apcpdf");
	}else if(selected == "Optometrist"){
		verifying_for = selected;
		registeration_bodies = "None ";
		document.getElementById("apc-bodies-cert").innerHTML = registeration_bodies;
		document.getElementById("customnote").innerHTML = 'Please state N/A if not applicable';
		document.getElementById("apc-bodies-number").innerHTML = registeration_bodies;
		document.getElementById("apc-bodies-cert-helper").innerHTML = registeration_bodies;
		document.getElementById("apc-bodies-cert-helper-photo").innerHTML = registeration_bodies;
		document.getElementById("apc-bodies-cert-helper-number").innerHTML =registeration_bodies;
		hide("hspt-doctor");
		hide("apcmcmcnumber");
		hide("apcimg");
		hide("apcpdf");
		show("hspt-universal");
		hide("certpdf");
		hide("apcpdf");
		show("certimage");
		hide("apcpdf");
	}else if(selected == "Occupational Therapist"){
		verifying_for = selected;
		registeration_bodies = "None ";
		document.getElementById("apc-bodies-cert").innerHTML = registeration_bodies;
		document.getElementById("customnote").innerHTML = 'Please state N/A if not applicable';
		document.getElementById("apc-bodies-number").innerHTML = registeration_bodies;
		document.getElementById("apc-bodies-cert-helper").innerHTML = registeration_bodies;
		document.getElementById("apc-bodies-cert-helper-photo").innerHTML = registeration_bodies;
		document.getElementById("apc-bodies-cert-helper-number").innerHTML =registeration_bodies;
		hide("hspt-doctor");
		hide("apcmcmcnumber");
		hide("apcimg");
		hide("apcpdf");
		show("hspt-universal");
		hide("certpdf");
		hide("apcpdf");
		show("certimage");
		hide("apcpdf");
	}else if(selected == "Speech and Language Therapist"){
		verifying_for = selected;
		registeration_bodies = "None ";
		document.getElementById("apc-bodies-cert").innerHTML = registeration_bodies;
		document.getElementById("customnote").innerHTML = 'Please state N/A if not applicable';
		document.getElementById("apc-bodies-number").innerHTML = registeration_bodies;
		document.getElementById("apc-bodies-cert-helper").innerHTML = registeration_bodies;
		document.getElementById("apc-bodies-cert-helper-photo").innerHTML = registeration_bodies;
		document.getElementById("apc-bodies-cert-helper-number").innerHTML =registeration_bodies;
		hide("hspt-doctor");
		hide("apcmcmcnumber");
		hide("apcimg");
		hide("apcpdf");
		show("hspt-universal");
		hide("certpdf");
		hide("apcpdf");
		show("certimage");
		hide("apcpdf");
	}else if(selected == "Others"){
		verifying_for = selected;
		registeration_bodies = "None ";
		document.getElementById("apc-bodies-cert").innerHTML = registeration_bodies;
		document.getElementById("customnote").innerHTML = 'Please state N/A if not applicable';
		document.getElementById("apc-bodies-number").innerHTML = registeration_bodies;
		document.getElementById("apc-bodies-cert-helper").innerHTML = registeration_bodies;
		document.getElementById("apc-bodies-cert-helper-photo").innerHTML = registeration_bodies;
		document.getElementById("apc-bodies-cert-helper-number").innerHTML =registeration_bodies;
		hide("hspt-doctor");
		hide("apcmcmcnumber");
		hide("apcimg");
		hide("apcpdf");
		show("hspt-universal");
		hide("certpdf");
		hide("apcpdf");
		show("certimage");
		hide("apcpdf");
	}else{
		hide("hspt-doctor");
		hide("hspt-universal");
	}
}
var verifying_for;
function submitNurseDocumentation(){
    showLoading();
    var ic_font = document.getElementById("nurse_ic_front_base64").value;
    var ic_back = document.getElementById("nurse_ic_back_base64").value;
    var educations_place = document.getElementById("nurse_uni").value;
    var apc_number = document.getElementById("nursenursingboardregisterationnumber").value;
	if(verifying_for == "Doctor" || verifying_for == "Pharmacist"){
		var apc_name = document.getElementById("nursenbrcinputbase").value;
		var education_certification = document.getElementById("degreeinput").value;
	}else{
		var apc_name = document.getElementById("nursenbrcinput").value;
		var education_certification = document.getElementById("nursedegreeinput").value;
	}
	var organization_name = getValue("sp_verify_organization_name");
	var organization_designation = getValue("sp_verify_organization_designation");
	var organization_address = getValue("sp_verify_organization_address");
	var organization_city = getValue("sp_verify_organization_city");
	var organization_state = getValue("sp_verify_organization_state");
	var organization_postcode = getValue("sp_verify_organization_postcode");
	var organization_country = getValue("sp_verify_organization_country");
	var organization_phone_number = getValue("sp_verify_organization_phone_number");
	var organization_fax_number = getValue("sp_verify_organization_fax_number");
	var organization_registeration_number = getValue("sp_verify_organization_number");
    var dataTopost = "api=1&auth_token=" + authUser.login_token + "&submitaccounts_verification_nurse=true&verifying_for="+verifying_for+"&ic_font="+ic_font+"&ic_back="+ic_back+"&educations_place="+educations_place+"&education_certification="+education_certification+"&apc_number="+apc_number+"&apc_file="+apc_name+"&registeration-bodies="+registeration_bodies+"&editorganization_name="+organization_name+"&editorganization_designation="+organization_designation+"&editorganization_address="+organization_address+"&editorganization_city="+organization_city+"&editorganization_state="+organization_state+"&editorganization_postcode="+organization_postcode+"&editorganization_country="+organization_country+"&editorganization_phone_number="+organization_phone_number+"&editorganization_fax_number="+organization_fax_number+"&editorganization_registeration_number="+organization_registeration_number;
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