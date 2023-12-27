function initEditPharmaorganization(id){
	showLoading();
	let dataTopost = "api=1&auth_token=" + authUser.login_token + "&EditPharmaorganization="+id;
	let reqEusers = new XMLHttpRequest();
	reqEusers.open("POST", serverUrl, true);
	reqEusers.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
	reqEusers.onload = function() {
		  if(reqEusers.status == 200) {
		 	let json = reqEusers.responseText;
		 	let response = JSON.parse(json);
		 	document.getElementById("EditPharmaorganizationVendor_name").value = response.vendor_name;
		 	document.getElementById("EditPharmaorganizationVendor_address").value = response.vendor_address;
		 	document.getElementById("EditPharmaorganizationVendor_open_time").value = response.vendor_open_time;
		 	document.getElementById("EditPharmaorganizationVendor_close_time").value = response.vendor_close_time;
		 	document.getElementById("EditPharmaorganizationOrganization_name").value = response.organization_name;
		 	document.getElementById("EditPharmaorganizationOrganization_address").value = response.organization_address;
		 	document.getElementById("EditPharmaorganizationOrganization_city").value = response.organization_city;
		 	document.getElementById("EditPharmaorganizationOrganization_state").value = response.organization_state;
		 	document.getElementById("EditPharmaorganizationOrganization_postcode").value = response.organization_postcode;
		 	document.getElementById("EditPharmaorganizationOrganization_country").value = response.organization_country;
		 	document.getElementById("EditPharmaorganizationOrganization_phone_number").value = response.organization_phone_number;
		 	document.getElementById("EditPharmaorganizationOrganization_fax_number").value = response.organization_fax_number;
		 	document.getElementById("EditPharmaorganizationOrganization_registeration_number").value = response.organization_registeration_number;
		 	closeLoading(); 
		  }else if(reqEusers.status == 404) {
		 	alert("Fail to connect to our server");
		  }else{
			 alert("Fail to connect to our server"); 
		  } 
 	}
	reqEusers.send(dataTopost);
}

function execEditPharmaorganization(event){
	showLoading();
	event.preventDefault();
	let executeThis = true;
	let EditPharmaorganizationVendor_name = document.getElementById("EditPharmaorganizationVendor_name").value;
	let EditPharmaorganizationVendor_address = document.getElementById("EditPharmaorganizationVendor_address").value;
	let EditPharmaorganizationVendor_open_time = document.getElementById("EditPharmaorganizationVendor_open_time").value;
	let EditPharmaorganizationVendor_close_time = document.getElementById("EditPharmaorganizationVendor_close_time").value;
	let EditPharmaorganizationOrganization_name = document.getElementById("EditPharmaorganizationOrganization_name").value;
	let EditPharmaorganizationOrganization_address = document.getElementById("EditPharmaorganizationOrganization_address").value;
	let EditPharmaorganizationOrganization_city = document.getElementById("EditPharmaorganizationOrganization_city").value;
	let EditPharmaorganizationOrganization_state = document.getElementById("EditPharmaorganizationOrganization_state").value;
	let EditPharmaorganizationOrganization_postcode = document.getElementById("EditPharmaorganizationOrganization_postcode").value;
	let EditPharmaorganizationOrganization_country = document.getElementById("EditPharmaorganizationOrganization_country").value;
	let EditPharmaorganizationOrganization_phone_number = document.getElementById("EditPharmaorganizationOrganization_phone_number").value;
	let EditPharmaorganizationOrganization_fax_number = document.getElementById("EditPharmaorganizationOrganization_fax_number").value;
	let EditPharmaorganizationOrganization_registeration_number = document.getElementById("EditPharmaorganizationOrganization_registeration_number").value;
	let dataTopost = "api=1&auth_token=" + authUser.login_token + "&execEditPharmaorganization="+executeThis+"&EditPharmaorganizationVendor_name="+EditPharmaorganizationVendor_name+"&EditPharmaorganizationVendor_address="+EditPharmaorganizationVendor_address+"&EditPharmaorganizationVendor_open_time="+EditPharmaorganizationVendor_open_time+"&EditPharmaorganizationVendor_close_time="+EditPharmaorganizationVendor_close_time+"&EditPharmaorganizationOrganization_name="+EditPharmaorganizationOrganization_name+"&EditPharmaorganizationOrganization_address="+EditPharmaorganizationOrganization_address+"&EditPharmaorganizationOrganization_city="+EditPharmaorganizationOrganization_city+"&EditPharmaorganizationOrganization_state="+EditPharmaorganizationOrganization_state+"&EditPharmaorganizationOrganization_postcode="+EditPharmaorganizationOrganization_postcode+"&EditPharmaorganizationOrganization_country="+EditPharmaorganizationOrganization_country+"&EditPharmaorganizationOrganization_phone_number="+EditPharmaorganizationOrganization_phone_number+"&EditPharmaorganizationOrganization_fax_number="+EditPharmaorganizationOrganization_fax_number+"&EditPharmaorganizationOrganization_registeration_number="+EditPharmaorganizationOrganization_registeration_number;
	let reqEusers = new XMLHttpRequest();
	reqEusers.open("POST", serverUrl, true);
	reqEusers.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
	reqEusers.onload = function() {
		  if(reqEusers.status == 200) {
		 	let json = reqEusers.responseText;
		 	let response = JSON.parse(json);
		 	loadingResponse(response.status_message);
		  }else if(reqEusers.status == 404) {
		 	alert("Fail to connect to our server");
		  }else{
			 alert("Fail to connect to our server"); 
		  } 
 	}
	reqEusers.send(dataTopost);
}







function initOrganizationinfo(){
	
}
function initProfile(){
	var dataTopost = 'api=1&auth_token='+authUser.login_token+"&myprofile=true";
	document.getElementById("profileproductlist").innerHTML = '<br><center><div class="preloader-wrapper small active"><div class="spinner-layer spinner-green-only"><div class="circle-clipper left"><div class="circle"></div></div><div class="gap-patch"><div class="circle"></div></div><div class="circle-clipper right"><div class="circle"></div></div></div></div></center>';
	var getprofile = new XMLHttpRequest();
	getprofile.open("POST", serverUrl, true);
	getprofile.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
		getprofile.onload = function() {
			if (getprofile.status == 200) {
				var json = getprofile.responseText;
				var response = JSON.parse(json);
				if(response.status == "success"){
					document.getElementById("profile_content_fullname").innerHTML = response.firstname+' '+response.lastname;
					document.getElementById("profile_content_email").innerHTML = response.email;
					document.getElementById("profile_content_phonenumber").innerHTML = response.phonenumber;
					document.getElementById("profile_content_profile_image").src = response.profile_img;
					if(response.products != "empty"){
						document.getElementById("profileproductlist").innerHTML = "";
						var products = response.products;
						var i;
						for(i = 0; i < products.length; i++){
							console.log(products[i].name);
							document.getElementById("profileproductlist").innerHTML += '<div class="col s6" onclick="openpage(\'viewproduct\', '+products[i].id+', \'profile\')"><div class="card"><div class="card-image"><img src="'+products[i].picture+'"></div><div class="card-content" style="padding: 10px"><p><span class="strong">'+products[i].name+'</span></p>RM'+products[i].price+'/ KG </div></div></div>';
						}
					}else{
							document.getElementById("profileproductlist").innerHTML = '<div class="col s12 center"><p class="strong">No Product</p><p>You do not have any product yet. Are you a farmer? You can start selling your vegetable too.</p> <button class="green white-text btn" onclick="openpage(\'postproduct\')">Post your product</button></div></center>';
					}
				}else{
					instaResponse(response.message);
				}			
			}else if (getprofile.status == 404) {
				alert("Fail to connect to our server");
			} else {
				alert("Fail to connect to our server");
			}
	}
	getprofile.send(dataTopost);
	/* document.getElementById("profile_content_fullname").innerHTML = authUser.firstname+' '+authUser.lastname;
	document.getElementById("profile_content_email").innerHTML = authUser.email;
	document.getElementById("profile_content_phonenumber").innerHTML = authUser.phonenumber;
	document.getElementById("profile_content_profile_image").src = authUser.profile_img; */
}
function inituserProfile(id){
	var dataTopost = 'api=1&auth_token='+authUser.login_token+"&getprofile="+id;
	document.getElementById("profileproductlist").innerHTML = '<br><center><div class="preloader-wrapper small active"><div class="spinner-layer spinner-green-only"><div class="circle-clipper left"><div class="circle"></div></div><div class="gap-patch"><div class="circle"></div></div><div class="circle-clipper right"><div class="circle"></div></div></div></div></center>';
	var getprofile = new XMLHttpRequest();
	getprofile.open("POST", serverUrl, true);
	getprofile.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
		getprofile.onload = function() {
			if (getprofile.status == 200) {
				var json = getprofile.responseText;
				var response = JSON.parse(json);
				if(response.status == "success"){
					document.getElementById("profile_content_fullname").innerHTML = response.firstname+' '+response.lastname;
					document.getElementById("profile_content_email").innerHTML = response.email;
					document.getElementById("profile_content_phonenumber").innerHTML = response.phonenumber;
					document.getElementById("profile_content_profile_image").src = response.profile_img;
					if(response.products != "empty"){
						var products = response.products;
						var i;
						for(i = 0; i < products.length; i++){
							console.log(products[i].name);
							document.getElementById("profileproductlist").innerHTML += '<div class="col s6"><div class="card"><div class="card-image"><img src="'+products[i].picture+'"></div><div class="card-content" style="padding: 10px"><p><span class="strong">'+products[i].name+'</span> - 2 KM</p>RM'+products[i].price+'/ KG </div></div></div>';
						}
					}else{
							document.getElementById("profileproductlist").innerHTML += '<div class="col s12 center"><p class="strong">No Product</p><p>You do not have any product yet. Are you a farmer? You can start selling your vegetable too.</p> <button class="green white-text btn" onclick="openpage(\'postproduct\')">Post your product</button></div></center>';
					}
				}else{
					instaResponse(response.message);
				}			
			}else if (getprofile.status == 404) {
				alert("Fail to connect to our server");
			} else {
				alert("Fail to connect to our server");
			}
		}
	getprofile.send(dataTopost);
}
function uploadProfileImage(element){
	var file1 = element.files[0];
	var reader = new FileReader();
	reader.onloadend = function() {
		authUser.profile_img = reader.result;
		document.getElementById("profileimagecontainer").src = reader.result;
		document.getElementById("profile_content_profile_image").src = reader.result;
		showLoading();
		setTimeout(function(){ postImg(); }, 2000);
	}
	reader.readAsDataURL(file1);
}

function postImg(imgdata){
	var dataTopost = 'api=1&auth_token='+authUser.login_token+'&uploadprofilepicture=true&img='+imgdata;
	var xhr = new XMLHttpRequest();
	xhr.open("POST", serverUrl, true);
	xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
	xhr.onload = function() {
		if (xhr.status == 200) {
			var json = xhr.responseText;
			var response = JSON.parse(json);
			loadingResponse(response.message);
		} else if (xhr.status == 404) {
			alert("Fail to connect to our server");
		} else {
			alert("Fail to connect to our server");
		}
	}
	xhr.send(dataTopost);
}
