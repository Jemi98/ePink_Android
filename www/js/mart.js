function initMart(category){
		var cat = localStorage.getItem("filter_sp");
		
		
		//show("martpreloader");
		show("martproducts");
		hide("martcategoryselection");
		
	  	//document.getElementById("martpreloader").innerHTML = '<div class="navbar-fixed white black-text"><nav><div class="nav-wrapper white black-text"><form onsubmit="event.preventDefault()"><div class="input-field"><input id="search" type="search" requipink placeholder="Search for doctor" onkeyup="searchForMart(this)"><label class="label-icon" for="search"><i class="material-icons black-text">search</i></label><i class="material-icons" onclick="openpage(\'homepage\')">close</i></div></form></div></nav></div> <div class="container"><p class="strong pink-text">Active doctors <span class="right"><a href="#" onclick="openFilter(\'doctors\')"><i class="material-icons strong pink-text">filter_list</i></a></span></p></div>';
		
		//document.getElementById("martproducts").innerHTML = '<br><center><div class="preloader-wrapper small active"><div class="spinner-layer spinner-pink-only"><div class="circle-clipper left"><div class="circle"></div></div><div class="gap-patch"><div class="circle"></div></div><div class="circle-clipper right"><div class="circle"></div></div></div></div></center>';	
		if(cat == "Doctor"){
			var specialistcat = localStorage.getItem("filter_sp_specialist");
			var dataTopost = "api="+app.apiVersion+"&auth_token="+authUser.login_token+"&getmart="+cat+"&speciality="+specialistcat+"&lat="+appLat+"&lng="+appLng;
		}else{
			var dataTopost = "api="+app.apiVersion+"&auth_token="+authUser.login_token+"&getmart="+cat+"&lat="+appLat+"&lng="+appLng;
		}
		
		var xhr = new XMLHttpRequest();
		xhr.open("POST", serverUrl, true);
		xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
		xhr.onload = function() {
			if (xhr.status == 200) {
				var json = xhr.responseText;
				var response = JSON.parse(json);
				show("martproducts");
				if(response.status != "fail"){
					
					//show("martpreloader");
					show("martproducts");
					document.getElementById("martproducts").innerHTML = "";
				
					var i;
					for (i = 0; i < response.length; i++) {
						
						if(response[i].has_session == "true"){
							var initC = 'onclick="openpage(\'chatcontent\', '+response[i].session_id+', '+response[i].id+')"';
							var initString = 'CONTINUE SESSION';
							
							var initiateAction = 'onclick="openpage(\'sessioncontroller\', '+response[i].session_id+', '+response[i].id+')"';
							
							
							
							
						}else if(response[i].has_session = "false"){
							var initC = 'onclick="initdocInfo('+response[i].id+')"';
							var initiateAction = 'onclick="initdocInfo('+response[i].id+')"';
							var initString = 'VIEW';
						}
						
						
						if(response[i].availability == "On"){
							var isOnline = 'Online';
							var colores = "green-text";
						}else{
							var isOnline = 'Offline';
							var colores = "grey-text";
						}
						document.getElementById("martproducts").innerHTML += '<div class="card horizontal" style="border-radius: 10px"> <div class="card-image"style="max-width: 30%; "> <img src="'+response[i].profile_img+'" style="border-bottom-left-radius: 10px; border-top-left-radius: 10px;"> </div> <div class="card-stacked"> <div class="card-content" style="padding: 15px"> <span class="strong">'+response[i].fullname+' <span class="'+colores+' right" >'+isOnline+'</span></span> <p class="grey-text">'+response[i].provider_type+'</p><button class="btn btn-small pink white-text pbutton" '+initiateAction+' style="border-radius: 10px">'+initString+'</button></div></div></div>';
						
					}					
				}else{
					document.getElementById("martpreloader").innerHTML = '<div class="navbar-fixed white black-text"><nav><div class="nav-wrapper white black-text"><form onsubmit="event.preventDefault()"><div class="input-field"><input id="search" type="search" requipink placeholder="Search for doctor" onkeyup="searchForMart(this)"><label class="label-icon" for="search"><i class="material-icons black-text">search</i></label><i class="material-icons" onclick="openpage(\'homepage\')">close</i></div></form></div></nav></div> <div class="container"><p class="strong pink-text">Active doctors <span class="right"><a href="#" onclick="openFilter(\'doctors\')"><i class="material-icons strong pink-text">filter_list</i></a></span></p></div>';
					document.getElementById("martproducts").innerHTML = '<nav><div class="nav-wrapper white"><form><div class="input-field"><input id="search" type="search" requipink><label class="label-icon" for="search"><i class="material-icons pink-text">search</i></label><i class="material-icons  pink-text">close</i></div></form></div></nav> <div class="container"><p class="strong pink-text">Active doctors <span class="right"><a href="#" onclick="openFilter(\'doctors\')"><i class="material-icons strong pink-text">filter_list</i></a></span></p></div>';
					document.getElementById("martproducts").innerHTML = '<br/><center class="grey-text"><i class="large material-icons pink-text ">report</i><br/><p class="">Sorry we couldnt find any active '+cat+' at the moment</p></center>';
					hide("martpreloader");
				}
				closeLoading();
			} else if (xhr.status == 404) {
				alert("Fail to connect to our server");
			} else {
				alert("Fail to connect to our server");
			}
		}
		xhr.send(dataTopost);
   
}
function searchForMart(element){
		var cat = localStorage.getItem("filter_sp");
		var searchterm = element.value
		show("martproducts");
		hide("martcategoryselection");
		
		var dataTopost = 'api='+app.apiVersion+'&auth_token='+authUser.login_token+'&searchhp='+searchterm+'&category='+cat+"&lat="+appLat+"&lng="+appLng;
		var xhr = new XMLHttpRequest();
		xhr.open("POST", serverUrl, true);
		xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
		xhr.onload = function() {
			if (xhr.status == 200) {
				var json = xhr.responseText;
				var response = JSON.parse(json);
				show("martproducts");
				if(response.status != "fail"){
					
					//show("martpreloader");
					show("martproducts");
					document.getElementById("martproducts").innerHTML = "";
				
					var i;
					for (i = 0; i < response.length; i++) {
						
						if(response[i].has_session == "true"){
							var initC = 'onclick="openpage(\'chatcontent\', '+response[i].session_id+', '+response[i].id+')"';
							var initString = 'CONTINUE SESSION';
							
							var initiateAction = 'onclick="openpage(\'sessioncontroller\', '+response[i].session_id+', '+response[i].id+')"';
							
							
							
							
						}else if(response[i].has_session = "false"){
							var initC = 'onclick="initdocInfo('+response[i].id+')"';
							var initiateAction = 'onclick="initdocInfo('+response[i].id+')"';
							var initString = 'VIEW';
						}
						
						
						if(response[i].availability == "On"){
							var isOnline = 'Online';
							var colores = "green-text";
						}else{
							var isOnline = 'Offline';
							var colores = "grey-text";
						}
						document.getElementById("martproducts").innerHTML += '<div class="card horizontal" style="border-radius: 10px"> <div class="card-image"style="max-width: 30%; "> <img src="'+response[i].profile_img+'" style="border-bottom-left-radius: 10px; border-top-left-radius: 10px;"> </div> <div class="card-stacked"> <div class="card-content" style="padding: 15px"> <span class="strong">'+response[i].fullname+' <span class="'+colores+' right" >'+isOnline+'</span></span> <p class="grey-text">'+response[i].provider_type+'</p><button class="btn btn-small pink white-text pbutton" '+initiateAction+' style="border-radius: 10px">'+initString+'</button></div></div></div>';
						
					}					
				}else{
					document.getElementById("martpreloader").innerHTML = '<div class="navbar-fixed white black-text"><nav><div class="nav-wrapper white black-text"><form onsubmit="event.preventDefault()"><div class="input-field"><input id="search" type="search" requipink placeholder="Search for doctor" onkeyup="searchForMart(this)"><label class="label-icon" for="search"><i class="material-icons black-text">search</i></label><i class="material-icons" onclick="openpage(\'homepage\')">close</i></div></form></div></nav></div> <div class="container"><p class="strong pink-text">Active doctors <span class="right"><a href="#" onclick="openFilter(\'doctors\')"><i class="material-icons strong pink-text">filter_list</i></a></span></p></div>';
					document.getElementById("martproducts").innerHTML = '<nav><div class="nav-wrapper white"><form><div class="input-field"><input id="search" type="search" requipink><label class="label-icon" for="search"><i class="material-icons pink-text">search</i></label><i class="material-icons  pink-text">close</i></div></form></div></nav> <div class="container"><p class="strong pink-text">Active doctors <span class="right"><a href="#" onclick="openFilter(\'doctors\')"><i class="material-icons strong pink-text">filter_list</i></a></span></p></div>';
					document.getElementById("martproducts").innerHTML = '<br/><center class="grey-text"><i class="large material-icons pink-text ">report</i><br/><p class="">Sorry we couldnt find any active '+cat+' at the moment</p></center>';
					hide("martpreloader");
				}
				closeLoading();
			} else if (xhr.status == 404) {
				alert("Fail to connect to our server");
			} else {
				alert("Fail to connect to our server");
			}
		}
		xhr.send(dataTopost);
}
function seeDoctorReview(){
	var dataTopost = "api=1&auth_token=" + authUser.login_token + "&viewreviews="+currentlyviewingdoctid;
    var reviews = new XMLHttpRequest();
    reviews.open("POST", serverUrl, true);
    reviews.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    reviews.onload = function() {
        if (reviews.status == 200) {
            var json = reviews.responseText;
            var response = JSON.parse(json);
			var i;
			document.getElementById("viewallreviews").innerHTML ="";
			
				for (i = 0; i < response.length; i++) {
					
					var frominfo = JSON.parse(response[i].frominfo);
					document.getElementById("viewallreviews").innerHTML += '<li class="collection-item"><b>'+frominfo.firstname+' '+frominfo.lastname+'</b> <br>'+response[i].review+'</li>';
				}
			if(response.status != null){
				document.getElementById("viewallreviews").innerHTML = '<li class="collection-item">No review</li>';
			}
            show('allreviews');
        } else if (reviews.status == 404) {
            alert("Fail to connect to our server");
        } else {
            alert("Fail to connect to our server");
        }
    }
    reviews.send(dataTopost);
}
var customerViewingisdoctor = false;
function initdocInfo(id){
	showLoading();
	show("docinfo");
		document.getElementById("doctorinfo_picture").src = "img/default_profile_picture.jpg";
		var dataTopost = 'api=1&auth_token='+authUser.login_token+"&doctorinfo="+id;
		var xhr = new XMLHttpRequest();
		xhr.open("POST", serverUrl, true);
		xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
		xhr.onload = function() {
			if (xhr.status == 200) {
				var json = xhr.responseText;
				var response = JSON.parse(json);
				document.getElementById("doctorinfo_picture").src = response.profile_img;
				
				document.getElementById("doctorinfo_category").innerHTML = response.provider_type;
				document.getElementById("doctorinfo_residency").innerHTML = response.organization_name;
				document.getElementById("doctorinfo_eduction").innerHTML = response.education;
				document.getElementById("practice_country").innerHTML = response.organization_country;
				document.getElementById("doc_language").innerHTML = response.language;
				document.getElementById("doc_about_me").innerHTML = response.about_me;
				document.getElementById("doc_reviews_count").innerHTML = response.review_count;
				if(response.specialist != "" || response.specialist == null){
					document.getElementById("doctorinfo_specialist").innerHTML = "";
					var speci = JSON.parse(response.specialist);
					for (let i = 0; i < speci.length; i++) {
						document.getElementById("doctorinfo_specialist").innerHTML += '-'+speci[i].specialties+'<br>';
					}
				}else{
					document.getElementById("doctorinfo_specialist").innerHTML = "";
				}
				document.getElementById("attendedpatientcount").innerHTML = response.patient_attended;
				document.getElementById("view_sp_rate").innerHTML = "RM"+response.rate;
				currentviewingrate = parseFloat(response.rate);
				currentlyviewingdoctid = response.id;
				currentlyviewingdoctorprice = response.rate;
				currentviewingrate = response.rate;
				if(response.provider_type == "Doctor"){
					customerViewingisdoctor = true;
					document.getElementById("doctorinfo_name").innerHTML = 'Dr.'+response.firstname+' '+response.lastname;
				}else{
					customerViewingisdoctor = false;
					if(response.gender == "Male"){
						document.getElementById("doctorinfo_name").innerHTML = 'Mr.'+response.firstname+' '+response.lastname;
					}else{
						document.getElementById("doctorinfo_name").innerHTML = 'Ms.'+response.firstname+' '+response.lastname;
					}
				}
				closeLoading();
				
				
			} else if (xhr.status == 404) {
				alert("Fail to connect to our server");
			} else {
				alert("Fail to connect to our server");
			}
		}
		xhr.send(dataTopost);
}