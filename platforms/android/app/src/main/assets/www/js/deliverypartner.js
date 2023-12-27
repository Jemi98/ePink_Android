function initRiderJob(){
	show("listofdeliveryjob");
	hide("listofaccepteddeliveryjob");
	var dataTopost = "api=1&auth_token=" + authUser.login_token + "&riderjob=true";
    var care = new XMLHttpRequest();
    care.open("POST", serverUrl, true);
    care.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    care.onload = function() {
        if (care.status == 200) {
            var json = care.responseText;
            var response = JSON.parse(json);
			var i;
			var available = response.available;
			var inprogress = response.inprogress;
			document.getElementById("listofdeliveryjob").innerHTML ="";
			document.getElementById("listofaccepteddeliveryjob").innerHTML = "";
			if(available != null){
				for (i = 0; i < available.length; i++) {
					var vendorInfo = available[i].vendor_information;
					console.log(vendorInfo)
					if(available[i].type == "Store Purchase"){
						console.log(available[i].data);
						var orderdata = JSON.parse(available[i].data);
						console.log(orderdata);
						document.getElementById("listofdeliveryjob").innerHTML += '<div class="card pink lighten-1 white-text" onclick="openpage(\'deliveryinfo\', '+available[i].id+', \'store\')"><div class="card-header white-text pink"><span class="strong">Medication Delivery</span> <span class="right">'+cleanOutput(available[i].timer)+' </span></div><div class="card-content"><p style="margin-bottom: 15px"><i class="material-icons v-icon">location_on</i> '+vendorInfo.vendor_address+'</p><p><i class="material-icons v-icon">location_on</i> '+cleanOutput(orderdata.delivery_address)+'</p></div><div class="card-action">RM '+available[i].delivery_price+' <span class="right strong">OID: S'+available[i].id+'</span></div></div>';
					}else{
						document.getElementById("listofdeliveryjob").innerHTML += '<div class="card pink lighten-1 white-text" onclick="openpage(\'deliveryinfo\', '+available[i].id+', \'pharma\')"><div class="card-header white-text pink"><span class="strong">Medication Delivery</span> <span class="right">'+cleanOutput(available[i].timer)+' </span></div><div class="card-content"><p style="margin-bottom: 15px"><i class="material-icons v-icon">location_on</i> '+vendorInfo.vendor_address+'</p><p><i class="material-icons v-icon">location_on</i> '+cleanOutput(available[i].delivery_address)+'</p></div><div class="card-action">RM '+available[i].delivery_fee+' <span class="right strong">OID: P'+available[i].id+'</span></div></div>';
					}
				}
			}else{
					document.getElementById("listofdeliveryjob").innerHTML = '<center><br/><br/><i class="large material-icons pink-text">assignment_late</i><p class="pink-text strong">No delivery request</p><p class="grey-text">Currently there is no delivery requested</p></center>';
			}
			
			if(inprogress != null){
				for (i = 0; i < inprogress.length; i++) {
					var vendorInfo = inprogress[i].vendor_information;
					if(inprogress[i].type == "Store Purchase"){
						console.log(inprogress[i].data);
						
						var orderdata = JSON.parse(inprogress[i].data);
						console.log(orderdata);
						document.getElementById("listofaccepteddeliveryjob").innerHTML += '<div class="card pink lighten-1 white-text" onclick="openpage(\'deliveryinfo\', '+inprogress[i].id+', \'store\')"><div class="card-header white-text pink"><span class="strong">Medication Delivery</span> <span class="right">'+cleanOutput(inprogress[i].timer)+' </span></div><div class="card-content"><p style="margin-bottom: 15px"><i class="material-icons v-icon">location_on</i> '+vendorInfo.vendor_address+'</p><p><i class="material-icons v-icon">location_on</i> '+cleanOutput(orderdata.delivery_address)+'</p></div><div class="card-action">RM '+inprogress[i].delivery_price+' <span class="right strong">OID: S'+inprogress[i].id+'</span></div></div>';
					}else{
						document.getElementById("listofaccepteddeliveryjob").innerHTML += '<div class="card pink lighten-1 white-text" onclick="openpage(\'deliveryinfo\', '+inprogress[i].id+', \'pharma\')"><div class="card-header white-text pink"><span class="strong">Medication Delivery</span> <span class="right">'+cleanOutput(inprogress[i].timer)+' </span></div><div class="card-content"><p style="margin-bottom: 15px"><i class="material-icons v-icon">location_on</i> '+vendorInfo.vendor_address+'</p><p><i class="material-icons v-icon">location_on</i> '+cleanOutput(inprogress[i].delivery_address)+'</p></div><div class="card-action">RM '+inprogress[i].delivery_fee+' <span class="right strong">OID: P'+inprogress[i].id+'</span></div></div>';
					}
				}
			}else{
					document.getElementById("listofaccepteddeliveryjob").innerHTML = '<center><br/><br/><i class="large material-icons pink-text">assignment_late</i><p  class="pink-text strong">No in-progress task</p><p class="grey-text">You have no delivery job in progress</p></center>';
			}
            setTimeout(function(){ updateuniversalServiceprovider(); }, refreshRate);
        } else if (care.status == 404) {
            alert("Fail to connect to our server");
        } else {
            alert("Fail to connect to our server");
        }
    }
    care.send(dataTopost);
	
}
var dlat = 0;
var dlng = 0;
function initDeliveryInfo(id, type){
	if(type == "pharma"){
		show("listofdeliveryjob");
		var dataTopost = "api=1&auth_token=" + authUser.login_token + "&viewriderjob="+id;
		var care = new XMLHttpRequest();
		care.open("POST", serverUrl, true);
		care.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
		care.onload = function() {
			if(care.status == 200){
				var json = care.responseText;
				var response = JSON.parse(json);
				var vendorInfo = response.vendor_information;
				var patientInfo = response.patient_profile;
				
				var vendormapbbutton = 'geo:'+vendorInfo.lat+','+vendorInfo.lng+'?q='+vendorInfo.vendor_address;
				console.log(vendormapbbutton)
				var patienrmapbutton = 'geo:'+patientInfo.lat+','+patientInfo.lng+'?q='+response.delivery_address;
				document.getElementById("deliveryinformation").innerHTML = '<span class="strong">Medication Delivery</span> <span class="right">'+cleanOutput(response.timer)+' </span></div><div class="card-content"><p style="margin-bottom: 15px"><i class="material-icons v-icon">location_on</i> '+vendorInfo.vendor_address+'</p><p><i class="material-icons v-icon">location_on</i> '+cleanOutput(response.delivery_address)+'</p></div><div class="card-action">RM '+response.delivery_fee+' <span class="right strong"></span></div></div>';
					document.getElementById("deliveryinformation").innerHTML = '<p class="pink-text">PICK UP</p><p>'+vendorInfo.vendor_name+' <a class="right pink-text strong" href="tel: '+vendorInfo.phonenumber+'">'+vendorInfo.phonenumber+'</a></p><p style="margin-bottom: 15px"><i class="material-icons v-icon">location_on</i> '+vendorInfo.vendor_address+'</p><a href="'+vendormapbbutton+'" class="btn-block btn pink white-text">Open Map</a><p class="pink-text">DROP OFF</p>'+patientInfo.full_name+'<a class="right pink-text strong" href="tel: '+patientInfo.phonenumber+'">'+patientInfo.phonenumber+'</a><p><i class="material-icons v-icon">location_on</i> '+cleanOutput(response.delivery_address)+'</p><a href="'+patienrmapbutton+'" class="btn-block btn pink white-text">Open Map</a>';
				if(response.delivery_completed == "Ready for pickup"){
					dlat = vendorInfo.lat;
					dlng = vendorInfo.lng;
					document.getElementById("rideraction").innerHTML = '<button  class="btn btn-block pink" onclick="riderAccept('+response.id+', \''+type+'\')">Accept</button><p>Press this button to accept this delivery job</p>';
					var deli = 'geo:'+vendorInfo.lat+','+vendorInfo.lng+'?q='+vendorInfo.vendor_address;
					document.getElementById("caremapbutton").innerHTML = '<a href="'+deli+'" id="" class="pink-text nav-text strong"><i class="material-icons left">location_on</i></a>';
				}else if(response.delivery_completed  == "Accepted"){
					 dlat = vendorInfo.lat;
					 dlng = vendorInfo.lng;
					document.getElementById("rideraction").innerHTML = '<button  class="btn btn-block pink" onclick="riderpickedup('+response.id+', \''+type+'\')">Set Pick Up</button><p>Press this button after you picked up the medications</p>';
					var deli = 'geo:'+vendorInfo.lat+','+vendorInfo.lng+'?q='+vendorInfo.vendor_address;
					document.getElementById("caremapbutton").innerHTML = '<a href="'+deli+'" id="" class="pink-text nav-text strong"><i class="material-icons left">location_on</i></a>';
				}else if(response.delivery_completed  == "Delivering"){
					 dlat = patientInfo.lat;
					 dlng = patientInfo.lng;
					var deli = 'geo:'+patientInfo.lat+','+patientInfo.lng+'?q='+response.delivery_address;
					document.getElementById("caremapbutton").innerHTML = '<a href="'+deli+'" id="" class="pink-text nav-text strong"><i class="material-icons left">location_on</i></a>';
					document.getElementById("rideraction").innerHTML = '<button  class="btn btn-block pink" onclick="riderComplete('+response.id+', \''+type+'\')">Set Completed</button><p>Press this button after you completed the delivery</p>';
				}else if(response.delivery_completed  == "Completed"){
					 dlat = patientInfo.lat;
					 dlng = patientInfo.lng;
					var deli = 'geo:'+patientInfo.lat+','+patientInfo.lng+'?q='+response.delivery_address;
					document.getElementById("caremapbutton").innerHTML = '<a href="'+deli+'" id="" class="pink-text nav-text strong"><i class="material-icons left">location_on</i></a>';
					document.getElementById("rideraction").innerHTML = '<p>This job has been completed</p>';
				}
				
						var markersz = 'img/patientmarker.png';
						const myLatLng = { lat: parseFloat(dlat), lng: parseFloat(dlng) };
						const map = new google.maps.Map(document.getElementById("deliverymap"), {
							zoom: 14,
							center: myLatLng,
							disableDefaultUI: true,
				});
				new google.maps.Marker({
							position: myLatLng,
							map,
							title: "Patient Marker",
							icon: markersz,
				});		
				show("deliverymap");
			} else if (care.status == 404) {
				alert("Fail to connect to our server");
			} else {
				alert("Fail to connect to our server");
			}
		}
		care.send(dataTopost);
	}else{
		show("listofdeliveryjob");
		var dataTopost = "api=1&auth_token=" + authUser.login_token + "&viewriderjobStore="+id;
		var care = new XMLHttpRequest();
		care.open("POST", serverUrl, true);
		care.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
		care.onload = function() {
			if(care.status == 200){
				var json = care.responseText;
				var response = JSON.parse(json);
				var vendorInfo = response.vendor_information;
				var patientInfo = response.patient_profile;
				var orderdata = JSON.parse(response.data);
				console.log(orderdata);
				var vendormapbbutton = 'geo:'+vendorInfo.lat+','+vendorInfo.lng+'?q='+vendorInfo.vendor_address;
				var patienrmapbutton = 'geo:'+response.delivery_lat+','+response.delivery_lng+'?q='+orderdata.delivery_address;
				document.getElementById("deliveryinformation").innerHTML = '<span class="strong">Medication Delivery</span> <span class="right">'+cleanOutput(response.timer)+' </span></div><div class="card-content"><p style="margin-bottom: 15px"><i class="material-icons v-icon">location_on</i> '+vendorInfo.vendor_address+'</p><p><i class="material-icons v-icon">location_on</i> '+cleanOutput(response.delivery_address)+'</p></div><div class="card-action">RM '+response.delivery_fee+' <span class="right strong"></span></div></div>';
				
					document.getElementById("deliveryinformation").innerHTML = '<p class="pink-text">PICK UP</p><p>'+vendorInfo.vendor_name+' <a class="right pink-text strong" href="tel: '+vendorInfo.phonenumber+'">'+vendorInfo.phonenumber+'</a></p><p style="margin-bottom: 15px"><i class="material-icons v-icon">location_on</i> '+vendorInfo.vendor_address+'</p><a href="'+vendormapbbutton+'" class="btn-block btn pink white-text">Open Map</a><p class="pink-text">DROP OFF</p>'+patientInfo.full_name+'<a class="right pink-text strong" href="tel: '+patientInfo.phonenumber+'">'+patientInfo.phonenumber+'</a><p><i class="material-icons v-icon">location_on</i> '+cleanOutput(orderdata.delivery_address)+'</p><a href="'+vendormapbbutton+'" class="btn-block btn pink white-text">Open Map</a>';
				if(response.order_status == "Ready for pickup"){
					dlat = response.delivery_lat;
					dlng = response.delivery_lng;
					document.getElementById("rideraction").innerHTML = '<button  class="btn btn-block pink" onclick="riderAccept('+response.id+', \''+type+'\')">Accept</button><p>Press this button to accept this delivery job</p>';
					var deli = 'geo:'+vendorInfo.lat+','+vendorInfo.lng+'?q='+vendorInfo.vendor_address;
					document.getElementById("caremapbutton").innerHTML = '<a href="'+deli+'" id="" class="pink-text nav-text strong"><i class="material-icons left">location_on</i></a>';
				}else if(response.order_status  == "Accepted"){
					dlat = response.delivery_lat;
					dlng = response.delivery_lng;
			
					document.getElementById("rideraction").innerHTML = '<button  class="btn btn-block pink" onclick="riderpickedup('+response.id+', \''+type+'\')">Set Pick Up</button><p>Press this button after you picked up the medications</p>';
					var deli = 'geo:'+vendorInfo.lat+','+vendorInfo.lng+'?q='+vendorInfo.vendor_address;
					document.getElementById("caremapbutton").innerHTML = '<a href="'+deli+'" id="" class="pink-text nav-text strong"><i class="material-icons left">location_on</i></a>';
				}else if(response.order_status  == "Delivering"){
					 dlat = response.delivery_lat;
					dlng = response.delivery_lng;
					var deli = 'geo:'+patientInfo.lat+','+patientInfo.lng+'?q='+response.delivery_address;
					document.getElementById("caremapbutton").innerHTML = '<a href="'+deli+'" id="" class="pink-text nav-text strong"><i class="material-icons left">location_on</i></a>';
					document.getElementById("rideraction").innerHTML = '<button  class="btn btn-block pink" onclick="riderComplete('+response.id+', \''+type+'\')">Set Completed</button><p>Press this button after you completed the delivery</p>';
				}else if(response.order_status  == "Completed"){
					dlat = response.delivery_lat;
					dlng = response.delivery_lng;
					var deli = 'geo:'+patientInfo.lat+','+patientInfo.lng+'?q='+response.delivery_address;
					document.getElementById("caremapbutton").innerHTML = '<a href="'+deli+'" id="" class="pink-text nav-text strong"><i class="material-icons left">location_on</i></a>';
					document.getElementById("rideraction").innerHTML = '<p>This job has been completed</p>';
				}
				
				var markersz = 'img/patientmarker.png';
						
						const myLatLng = { lat: parseFloat(dlat), lng: parseFloat(dlng) };
						const map = new google.maps.Map(document.getElementById("deliverymap"), {
							zoom: 14,
							center: myLatLng,
							disableDefaultUI: true,
				});
				new google.maps.Marker({
							position: myLatLng,
							map,
							title: "Patient Marker",
							icon: markersz,
				});		
				show("deliverymap");
			} else if (care.status == 404) {
				alert("Fail to connect to our server");
			} else {
				alert("Fail to connect to our server");
			}
		}
		care.send(dataTopost);
	}
	
}
var globalriderAcceptid;
var globalriderAccepttype;
function riderAccept(id, type){
	showLoading();
	var recordId = id;
	globalriderAcceptid = id;
	globalriderAccepttype = type;
	var dataTopost = "api=1&auth_token=" + authUser.login_token + "&acceptriderjob="+recordId+"&type="+type;
		var chats = new XMLHttpRequest();
		chats.open("POST", serverUrl, true);
		chats.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
		chats.onload = function() {
			if (chats.status == 200) {
				var json = chats.responseText;
				var response = JSON.parse(json);
				loadingResponse(response.message);
				openpage('riderdashboard', 'clear');
				hide('listofdeliveryjob'); show('listofaccepteddeliveryjob');
			} else if (chats.status == 404) {
				alert("Fail to connect to our server");
			} else {
				alert("Fail to connect to our server");
		}
	}
	chats.send(dataTopost);
}
function riderpickedup(id, type){
	showLoading();
	var recordId = id;
	var dataTopost = "api=1&auth_token=" + authUser.login_token + "&riderpickedup="+recordId+"&type="+type;
		var chats = new XMLHttpRequest();
		chats.open("POST", serverUrl, true);
		chats.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
		chats.onload = function() {
			if (chats.status == 200) {
				var json = chats.responseText;
				var response = JSON.parse(json);
				openpage('deliveryinfo', globalriderAcceptid, globalriderAccepttype)
				closeLoading();
			} else if (chats.status == 404) {
				alert("Fail to connect to our server");
			} else {
				alert("Fail to connect to our server");
		}
	}
	chats.send(dataTopost);
}
function riderComplete(id, type){
	showLoading();
	var recordId = id;
	var dataTopost = "api=1&auth_token=" + authUser.login_token + "&ridercomplete="+recordId+"&type="+type;
		var chats = new XMLHttpRequest();
		chats.open("POST", serverUrl, true);
		chats.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
		chats.onload = function() {
			if (chats.status == 200) {
				var json = chats.responseText;
				var response = JSON.parse(json);
				loadingResponse(response.message);
					document.getElementById("rideraction").innerHTML = '<p>This job has been completed</p>';
					closeLoading();
			} else if (chats.status == 404) {
				alert("Fail to connect to our server");
			} else {
				alert("Fail to connect to our server");
		}
	}
	chats.send(dataTopost);
}