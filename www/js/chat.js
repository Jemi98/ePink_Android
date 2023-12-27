var activeChatid;
var lastChatid = 0;
var chatisActive = false;
var chatCheck;
var currentlyviewingdoctid = 0;
var currentlyviewingdoctorprice = 0.00;
var selectedpharma = 0;
function selectPharma(id, vendorname){
	document.getElementById("selectedpharma").innerHTML = vendorname;
	selectedpharma = id;
	hide("selectPharmacy");
	show("selectMed");
}
function closeSearchmed(){
	selectedpharma = 0;
	hide("searchmed");
}
function prepareMed(){
	if(selectedpharma == 0 || selectedpharma==null){
		var dataTopost = "api=1&auth_token=" + authUser.login_token + "&viewnearestpharmacy=true";
		var users = new XMLHttpRequest();
		users.open("POST", serverUrl, true);
		users.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
		users.onload = function() {
			if (users.status == 200) {
				var json = users.responseText;
				console.log(json);
				var response = JSON.parse(json);
				document.getElementById("nearestpharmacy").innerHTML = "";
				if(response.status == null){
					for (let i = 0; i < response.length; i++) {
						document.getElementById("nearestpharmacy").innerHTML += '<li id="pharma'+response[i].id+'" class="collection-item" onclick="selectPharma('+response[i].id+', \''+response[i].vendor_name+'\')">'+response[i].vendor_name+'</li>'
					}
				}
				show("searchmed");
			} else if (users.status == 404) {
				alert("Fail to connect to our server");
			} else {
				alert("Fail to connect to our server");
			}
		}
		users.send(dataTopost);
	}else{
		var dataTopost = "api=1&auth_token=" + authUser.login_token + "&viewselectedpharma="+selectedpharma;
		var users = new XMLHttpRequest();
		users.open("POST", serverUrl, true);
		users.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
		users.onload = function() {
			if (users.status == 200) {
				var json = users.responseText;
				var response = JSON.parse(json);
				document.getElementById("nearestpharmacy").innerHTML = "";
				if(response.status == null){
					for (let i = 0; i < response.length; i++) {
						selectPharma(response[i].id, response[i].vendor_name);
					}
				}
				show("searchmed");
			} else if (users.status == 404) {
				alert("Fail to connect to our server");
			} else {
				alert("Fail to connect to our server");
			}
		}
		users.send(dataTopost);
		show("selectMed");
		hide("selectPharmacy");
		show("searchmed");
	}
}
function requestPermission(){
	if(isondevice == true){
	var permissions = cordova.plugins.permissions;
	permissions.requestPermission(permissions.RECORD_AUDIO, function(){ permissions.requestPermission(permissions.CAMERA, function(){ window.location="acceptcall.html"; }, function(){ }); }, function(){ });
	}else{
		window.location="acceptcall.html";
	}
}

function openVideocall(){
	if(isondevice == true){
	var permissions = cordova.plugins.permissions;
	permissions.requestPermission(permissions.RECORD_AUDIO, function(){ permissions.requestPermission(permissions.CAMERA, function(){ window.location="makecall.html"; }, function(){ }); }, function(){ });
	}else{
		window.location.href = 'makecall.html';
	}
}
function setPickUpaddresscart(addresso, lat,lng){
	hide("searchwindow");
	document.getElementById("deliveryAddress").innerHTML = addresso;
	document.getElementById("detectedlat").innerHTML = lat;
	document.getElementById("detectedlng").innerHTML = lng;
	userDetectedLat = lat;
	userDetectedLng = lng;
	userDetectedAddress = addresso;
	getFunctionThree();
	show("usercart");
}
var quoteBy = null;
var sessionvendoraddress = {
			  address1: "",
			  address2: "",
			  city: "",
			  state: "",
			  postcode: "",
			  country: "MY",
			  coord: {
				lat: "",
				lon: ""
			  }
			};
			
var sessionItemWeight;
var sessionItemDimension;
function resultsmapsession(pickedaddress){
	quoteBy = "tele";
	showLoading();
	document.getElementById("deliveryAddress").innerHTML = pickedaddress;
    var address = pickedaddress;
    geocoder.geocode( { 'address': address}, function(results, status) {
		if (status == 'OK') {
			
			var delyvadestination = {
			  address1: "",
			  address2: "",
			  city: "",
			  state: "",
			  postcode: "",
			  country: "MY",
			  coord: {
				lat: "",
				lon: ""
			  }
			};
			delyvadestination.address1 = address;
			var delyvaorigin = {
			  address1: "",
			  address2: "",
			  city: "",
			  state: "",
			  postcode: "",
			  country: "MY",
			  coord: {
				lat: "",
				lon: ""
			  }
			};
			var delyvaweight = {
			  unit: "kg",
			  value: cartWeight
			};
			var delyvadimension = {
			  width: cartWidth,
			  height: cartHeight,
			  length: cartLength,
			  unit: "cm"
			};
			var curCORD = results[0].geometry.location.toString();
			var addressComponent = results[0].address_components;
			for (let i = 0; i < addressComponent.length; i++) {
				components = addressComponent[i];
				
				var componenttype = components.types;
				for (let j = 0; j < componenttype.length; j++){
					console.log(componenttype[j].long_name);
					if(componenttype[j] == "locality"){
						address_city = addressComponent[i].long_name;
						delyvadestination.city = address_city;
					}
					if(componenttype[j] == "postal_code"){
						address_postcode = addressComponent[i].long_name;
						delyvadestination.postcode = address_postcode;
					}
					if(componenttype[j] == "country"){
						address_country = addressComponent[i].long_name;
						
					}
					if(componenttype[j] == "administrative_area_level_1"){
						address_state = addressComponent[i].long_name;
						delyvadestination.state = address_state;
					}		
				}
			}			
			
			var corddd = curCORD.split(',', 2);
			corddd[0].replace("(", "");
			corddd[1].replace(")", "");
			var latCleaner =  corddd[0].replace("(", "");
			var cleanedLat =  parseFloat(latCleaner).toFixed(6);
			var lngCleaner =  corddd[1].replace(")", "");
			var cleanedLng  = parseFloat(lngCleaner).toFixed(6);
			delyvaDeliverylat = cleanedLat;
			delyvaDeliverylng = cleanedLng;
			mainDeliveryCordinate.lat = cleanedLat;
			mainDeliveryCordinate.lng = cleanedLng;
			mainDeliveryCordinate.address = address;

			document.getElementById("selectedaddressdely").innerHTML = address;
			var deliverycoord = {
				lat: cleanedLat,
				lon: cleanedLng
			}
			delyvadestination.coord = deliverycoord;
			delyvaorigin = sessionvendoraddress;
			delyvagetquotedata = {
				origin: delyvaorigin,
				destination: delyvadestination,
				weight: sessionItemWeight,
				dimension: sessionItemDimension
			}
			show("pharmacyaddressfinalizer");
			hide("searchwindow");
			hide("sessionmapsearch");
			hide("sessioncontroller");
			initPharamcyDeliveryaddressFinalizaer();
			closeLoading();
			//openpage("pharmacyaddressfinalizer", address);
      } else {
		  showLoading();
          loadingResponse('Geocode was not successful for the following reason: ' + status);
      }
    });
}
function resultsmapsessionold(pickedaddress) {
	showLoading();
    var address = pickedaddress;
    geocoder.geocode( { 'address': address}, function(results, status) {
      if (status == 'OK') {
		var curCORD = results[0].geometry.location.toString();
		var corddd = curCORD.split(',', 2);
		corddd[0].replace("(", "");
		corddd[1].replace(")", "");
		var latCleaner =  corddd[0].replace("(", "");
		var cleanedLat =  parseFloat(latCleaner).toFixed(6);
		var lngCleaner =  corddd[1].replace(")", "");
		var cleanedLng  = parseFloat(lngCleaner).toFixed(6);
		mainDeliveryCordinate.lat = cleanedLat;
		mainDeliveryCordinate.lng = cleanedLng;
		mainDeliveryCordinate.address = address;
		var fromaddress = vendorToPickup.vendor_address;
		console.log(fromaddress);
		var dataTopost = "api=1&auth_token=" + authUser.login_token + "&getdeliveryprice=true&from="+fromaddress+"&fromlat="+vendorToPickup.lat+"&fromlng="+vendorToPickup.lng+"&to="+pickedaddress+"&tolat="+mainDeliveryCordinate.lat+"&tolng="+mainDeliveryCordinate.lng;
		var users = new XMLHttpRequest();
		users.open("POST", serverUrl, true);
		users.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
		users.onload = function() {
        if (users.status == 200) {
            var json = users.responseText;
            var response = JSON.parse(json);
			var speedy = response.speedy;
			var od = speedy.order;
            var delfee = od.delivery_fee_amount;
			if(speedy.is_successful == true){
				var itemsPrice = parseFloat(document.getElementById("totalpriceincart").innerHTML);
				hide("sessionmapsearch");
				document.getElementById("sessionaddress").innerHTML = pickedaddress;
				document.getElementById("sessiondeliveryfee").innerHTML = 'RM'+delfee;
				var curtotalprice = document.getElementById("medicationfee").innerHTML;
				console.log(curtotalprice);
				var newtotalprice = parseFloat(curtotalprice) + parseFloat(delfee);
				document.getElementById("sessiontotalprice").innerHTML = newtotalprice.toFixed(2);
				document.getElementById("sessiondeliveryfee").innerHTML = delfee;
				userDetectedLat = mainDeliveryCordinate.lat;
				userDetectedLng = mainDeliveryCordinate.lng;
				userDetectedAddress = mainDeliveryCordinate.address;
				closeLoading();
			}else{
				setPickUpaddresscart(mainDeliveryCordinate.address, mainDeliveryCordinate.lat, mainDeliveryCordinate.lng);
			}
        } else if (users.status == 404) {
            alert("Fail to connect to our server");
        } else {
            alert("Fail to connect to our server");
        }
    }
    users.send(dataTopost);		
		
		
      } else {
		  showLoading();
          loadingResponse('Geocode was not successful for the following reason: ' + status);
      }
    });
	
}

function initServicesmapsession(elements){
  var searchQuery = elements.value;
  document.getElementById('resultsmapsession').innerHTML = '';
  var displaySuggestions = function(predictions, status) {
    if (status != google.maps.places.PlacesServiceStatus.OK) {
      document.getElementById('resultsmapsession').innerHTML = '<li class="collection-item">Can\'t find that address</li>';
      return;
    }

    predictions.forEach(function(prediction) {
      var lol = '<li class="collection-item" onclick="resultsmapsession(\'' + prediction.description + '\')">' + prediction.description + '</li>';
      document.getElementById("resultsmapsession").innerHTML += lol;
    });
  };

  var service = new google.maps.places.AutocompleteService();
  service.getQueryPredictions({
    input: searchQuery
  }, displaySuggestions);
}

function searchaddresstodeliverSession(){
	if(sessiondeliverytype == "Delivery"){
		show("sessionmapsearch");
	}else{
		instaResponse("This is a self pick up order");
	}
	
}
function chatBackController(){
	if(authUser.type == 0){
		openpage('chatlists');
	}else{
		openpage('docsession');
	}
	
	
}

function setSessionDelivery(){
	sessiondeliverytype = "Delivery";
	searchaddresstodeliverSession();
}
function mysqlDate(date){
    date = date || new Date();
    return date.toISOString().split('T')[0];
}
function openConfirmation(){
	
	document.getElementById("confirmbooking").innerHTML = "RM"+currentviewingrate;
	hide("bookinginfo");
	show("confirm");
}
function cancelBookig(){
	hide("confirm");
	show("bookinginfo");
}
function confirmBookig(){
	var patientSickness = document.getElementById("bookinginfo_pain").value;
	var patientDate = document.getElementById("bookinginfo_date").value;
	var patientTime = document.getElementById("bookinginfo_time").value;
	var patientdatetime = patientDate+' '+patientTime;
	var bookingtype = typeofsessiontobook;
	if(patientSickness != "" && patientDate != "" && patientTime != "" && bookingtype != "" ){
		initiateChat(currentlyviewingdoctid, currentlyviewingdoctorprice, patientSickness, patientdatetime, bookingtype);
	}else{
		instaResponse("Please complete the booking form");
	}
	
	
}
var currentviewingrate = 0.00;
var typeofsessiontobook;
function startsession(sessiontype){
	console.log(currentviewingrate);
	typeofsessiontobook = sessiontype;
	if(authUser.wallet >= parseFloat(currentviewingrate)){
		if(sessiontype == "both"){
		document.getElementById("bookingtypesession").innerHTML = "Video and chat consultation";
		}else{
			document.getElementById("bookingtypesession").innerHTML = "Chat consultation";
		}
		show("bookinginfo");
		hide("docinfo");
	}else{
		instaResponse("Please top up your wallet balance");
		//authUser.wallet = 3000.00;
	}
	
}
function setSessionPickup(){
	sessiondeliverytype = "Pickup";
	hide("selectdeliverymethod");
	hide("sessionselectedcourrier");
	show("unpaid");
	document.getElementById("sessiontotalprice").innerHTML = document.getElementById("medicationfee").innerHTML
	document.getElementById("sessionaddress").innerHTML = "Self Pick Up Order";
}
var sessiondeliverytype = null;
function makesessionPayment(){
	showLoading();
	var totalPrice = parseFloat(document.getElementById("sessiontotalprice").innerHTML);
	var docprice = parseFloat(document.getElementById("consultationfee").innerHTML);
	var deliveryfee = parseFloat(document.getElementById("sessiondeliveryfee").innerHTML);
	var medprice = parseFloat(document.getElementById("medicationfee").innerHTML);
	var address = document.getElementById("sessionaddress").innerHTML;
	if(sessiondeliverytype == "Pickup"){
		if(parseFloat(authUser.wallet) >= totalPrice){
			var dataTopost = "api=1&auth_token=" + authUser.login_token + "&paysession="+doccurrentchatid+"&sessioncost="+totalPrice+'&docprice='+docprice+"&medprice="+medprice+"&deliveryfee="+deliveryfee+"&deliveryaddress="+address+"&deliverytype="+sessiondeliverytype;
			var chats = new XMLHttpRequest();
			chats.open("POST", serverUrl, true);
			chats.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
			chats.onload = function() {
				if (chats.status == 200) {
					var json = chats.responseText;
					var response = JSON.parse(json);
					loadingResponse(response.message);
					openpage("chatlists");
				} else if (chats.status == 404) {
						alert("Fail to connect to our server");
				} else {
						alert("Fail to connect to our server");
				}
			}
			chats.send(dataTopost);
		}else{
			instaResponse("Insufficient Balance. Please top up your wallet");
		}
	}else{
		if(address != "Click to set"){
			if(parseFloat(authUser.wallet) >= totalPrice){
				var delyvadata = btoa(JSON.stringify(sessiondelyvadata));
				var dataTopost = "api=1&auth_token=" + authUser.login_token + "&paysession="+doccurrentchatid+"&sessioncost="+totalPrice+'&docprice='+docprice+"&medprice="+medprice+"&deliveryfee="+deliveryfee+"&deliveryaddress="+address+"&deliverytype="+sessiondeliverytype+"&delyvadata="+delyvadata;
				var chats = new XMLHttpRequest();
				chats.open("POST", serverUrl, true);
				chats.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
				chats.onload = function() {
					if (chats.status == 200) {
						var json = chats.responseText;
						var response = JSON.parse(json);
						loadingResponse(response.message);
						openpage("chatlists");
					} else if (chats.status == 404) {
						alert("Fail to connect to our server");
					} else {
						alert("Fail to connect to our server");
					}
				}
				chats.send(dataTopost);
			}else{
				instaResponse("Insufficient Balance. Please top up your wallet");
			}
		}else{
				loadingResponse("Please set delivery address");
		}
	}

}
var customercurrentviewingsession;
var vendorToPickup;
var sessiondelyvadata = null
function viewUsersession(id){
	jobTypetoreview = "Consultation";
	jobIdtoreview = id;
	hide("videocallbutton");
	show("videocallbuttongrey");
	var dataTopost = "api=1&auth_token="+authUser.login_token+"&custviewThischats="+id;
    var chats = new XMLHttpRequest();
    chats.open("POST", serverUrl, true);
    chats.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    chats.onload = function() {
        if (chats.status == 200) {
            var json = chats.responseText;
            var response = JSON.parse(json);
			console.log(response);
			doccurrentchatid = response.id;
			customercurrentviewingsession = response.id;
			
			
			
			document.getElementById("cus_session_date").innerHTML = response.session_date;
			document.getElementById("cus_session_reason").innerHTML = response.session_reason;
			var vendorpo = response.vendor_profile
			if(vendorpo != null){
				sessionvendoraddress.address1 = vendorpo.vendor_street_address;
				sessionvendoraddress.address2 = vendorpo.vendor_street_address_2;
				sessionvendoraddress.city = vendorpo.vendor_city;
				sessionvendoraddress.state = vendorpo.vendor_state;
				sessionvendoraddress.postcode = vendorpo.vendor_postcode;
				sessionvendoraddress.coord.lat = vendorpo.lat;
				sessionvendoraddress.coord.lon = vendorpo.lng;
				console.log(sessionvendoraddress);
			}
			if(response.delyvadata != null){
				sessiondelyvadata = response.delyvadata;
			}
			if(authUser.id != response.owner_one){
				docwillcallid = response.owner_one;
				spToreview = response.owner_one;
				persontoCall = docwillcallid;
				var userinfo = response.owner_one_info;
				var tocall = userinfo.id_token;
				console.log(tocall);
				var userinfoone = response.owner_two_info;
				document.getElementById("cus_session_patient_detail").innerHTML = userinfo.full_name;
				document.getElementById("cus_session_provider_type").innerHTML = userinfo.provider_type;
				document.getElementById("cus_session_profile_image").src = userinfo.profile_img;
				document.getElementById("vcindicatorname").innerHTML = userinfo.full_name;
			}else if(authUser.id != response.owner_two){
				spToreview = response.owner_two;
				docwillcallid = response.owner_two;
				persontoCall = docwillcallid;
				var userinfo = response.owner_two_info;
				var tocall = userinfo.id_token;
				document.getElementById("cus_session_patient_detail").innerHTML = userinfo.full_name;
				document.getElementById("cus_session_profile_image").src = userinfo.profile_img;
				document.getElementById("cus_session_provider_type").innerHTML = userinfo.provider_type;
			}
			var cb = { login: authUser.public_token, password: authUser.secret_token, opponentid: tocall };
			var cblogin =  JSON.stringify(cb);
			localStorage.setItem("cblogin", cblogin);
			var now= new Date();
			var session_date= new Date(response.session_date);
			if(now <= session_date){
				hide("videocallbuttongrey");
				show("videocallbutton");
			}
			if(response.session_status === "Ended"){
				if(response.doctor == "true"){
					hide("cussessionaction");
					hide("sessiondiagnose");
					hide("cussessionaction");
					show("cussessionsummary");
					hide("notdoccussessionsummary");
					if(response.paid == "true"){
							document.getElementById("docclinicalnoteforuser").innerHTML = '<a href="#!" class="strong" onclick="openPdfFile(\''+response.signedclinicalnote+'\');">Download Clinical Note</a>';
					}else{
							document.getElementById("docclinicalnoteforuser").innerHTML = '<a href="#!" class="strong" onclick="openPdfFile(\''+response.savedclinicalnote+'\');">Download Clinical Note</a>';
					}
					var i;
					document.getElementById("cusprescripion").innerHTML = "";
					
					if(response.prescription != "None"){
						var ppe = JSON.parse(response.prescription);
						console.log(ppe);
						console.log(ppe.length);
						var totalprice = 0.00;
						var medWeight = 0;
						var medHeight = 0;
						var medWidth = 0;
						var medLength = 0;
						for (i = 0; i < ppe.length; i++) {
								var itemWeight = parseFloat(ppe[i].weight);
								if(ppe[i].weightunit == "kg"){
									itemWeight = itemWeight * 1000;
								}
								
								medWidth = parseFloat(medWidth) + parseFloat(ppe[i].width);
								medHeight = parseFloat(medHeight) + parseFloat(ppe[i].height);
								medLength = parseFloat(medLength) + parseFloat(ppe[i].length);
								
								medWeight = parseFloat(medWeight) + parseFloat(itemWeight);
								document.getElementById("cusprescripion").innerHTML += '<li class="collection-item avatar"><img src="'+ppe[i].picture+'" alt="" class="circle"> <span="title">'+ppe[i].name+'</span><p>Stock: '+ppe[i].stock+'</p></li>';
								console.log(parseFloat(ppe[i].price));
								totalprice = parseFloat(totalprice) + parseFloat(ppe[i].price);
								console.log(totalprice);
						}
						var medWeightKG = medWeight;
						var delyvaweight = {
						  unit: "g",
						  value: medWeightKG
						};
						var delyvadimension = {
						  width: medWidth,
						  height: medHeight,
						  length: medLength,
						  unit: "cm"
						};
						sessionItemWeight = delyvaweight;
						sessionItemDimension = delyvadimension;
						if(response.paid == "true"){
							hide("selectdeliverymethod");
							document.getElementById("presdownload").innerHTML = '<a href="#!" class="strong" onclick="openPdfFile(\''+response.signedpres+'\');">Download Prescription</a>';
						}else{
							document.getElementById("presdownload").innerHTML = '<a href="#!" class="strong" onclick="openPdfFile(\''+response.saved_pres+'\');">Download Prescription</a>';
						}
						var totalallprice = totalprice + 0;
						var renderTotalprice = totalallprice.toFixed(2);
						document.getElementById("consultationfee").innerHTML = userinfo.fee;
						var renderMedprice = totalprice.toFixed(2);
						document.getElementById("medicationfee").innerHTML = renderMedprice;
						document.getElementById("sessiondeliveryfee").innerHTML = 0.00;
						if(response.delivery_type == "Pickup"){
							var dstat = '<p class="strong pink-text">Delivery Status</p><p>Pick up the order from the pharmacy</p>';
						}else{
							if(response.delivery_completed == "waiting"){
								var dstat = '<p class="strong pink-text">Delivery Status</p><p>Waiting for pharmacy to validate the prescription</p>';
							}else if(response.delivery_completed  == "Ready for pickup"){
								 var dstat = '<p class="strong pink-text">Delivery Status</p><p>Prescription has been validated. Waiting for rider to complete the delivery</p>';
								 hide("selectdeliverymethod");
							}else if(response.delivery_completed  == "Accepted"){
								 var dstat = '<p class="strong pink-text">Delivery Status</p><p>Rider is on the way to pick up your medication</p>';
							}else if(response.delivery_completed  == "Delivering"){
								 var dstat = '<p class="strong pink-text">Delivery Status</p><p>Rider is on the way to deliver your medication</p>';
								 hide("selectdeliverymethod");
							}else if(response.delivery_completed  == "Completed"){
								 var dstat = '<p>Delivery completed</p>';
							}else if(response.delivery_completed  == "3rd Party"){
								 var dstat = '<p class="strong pink-text">Delivery Status</p><p>The pharmacy has requested a 3rd Party delivery partner to deliver your medication.</p>';
							}
						}

						if(response.paid == "true"){
							hide("unpaid");
							show("paidmed");
							document.getElementById("custdeliverystatus").innerHTML = dstat;
						}else{
							hide("unpaid");
							
							show("selectdeliverymethod");
							hide("paidmed");
							vendorToPickup = response.store_info;
						}
					}else{
						document.getElementById("cusprescripion").innerHTML = '<li class="collection-item">The doctor didnt prescribe any medication in this session</li>';
						
						document.getElementById("endingmessageend").innerHTML = '<p class="center strong pink-text" style="border: 1px solid; padding: 10px; border-radius: 5px; background-color: pink;" >This session has been ended by the service provider</p>';
						hide("selectdeliverymethod");
						hide("presdownload");
						hide("unpaid");
					}
					if(response.review_data == null){
						show("reviewpanel");
					}else{
						hide("reviewpanel");
					}
					if(response.mcdata == "None"){
						document.getElementById("mcnotecustomer").innerHTML = "The doctor didn't assign any medical leave certificate";
					}else{
						document.getElementById("mcnotecustomer").innerHTML = '<a href="#!" class="strong" onclick="openPdfFile(\''+response.signedmc+'\');">Download Medical Certificate Leave</a>';
					}
					if(response.referto == "None"){
						document.getElementById("refernoteccustomer").innerHTML = "The doctor didn't refer you to any clinic or hospital";
					}else{
						document.getElementById("refernoteccustomer").innerHTML = '<a href="#!" class="strong" onclick="openPdfFile(\''+response.signedrefer+'\');">Download Referral letter</a>';
					}
				}else{
					hide("cussessionaction");
					hide("sessiondiagnose");
					hide("cussessionaction");
					hide("cussessionsummary");
					show("notdoccussessionsummary");
					document.getElementById("notcusdiagnosecontent").innerHTML = response.diagnose;
					if(response.referto == ""){
						document.getElementById("notcustreferdata").innerHTML = "The service provider didnt refer you to anyone";
					}else{
						if(response.doctor == "false"){
							design = response.referto
							document.getElementById("notcustreferdata").innerHTML = design;
						}else{
							document.getElementById("notcustreferdata").innerHTML = response.referto;
							var referdata = JSON.parse(response.referto);
							console.log(referdata);
							var design = '<div class="card"><div class="card-content" style="padding:15px"><p class="strong pink-text">'+referdata.refername+'</p><p><span class="pink-text strong">Facility:</span>  '+referdata.referfacility+'</p><p><span class="pink-text strong">Reason:</span> '+referdata.refferreason+'</p><p><span class="pink-text strong">Diagnosis:</span> '+referdata.referdiaog+'</p><p><span class="pink-text strong">Notes:</span> '+referdata.refernotes+'</p></div></div>';
							document.getElementById("notcustreferdata").innerHTML = design;
						}
						
					}
					document.getElementById("notcustclinicalnote").innerHTML = response.clincalNote;
					
					var clinicalNotetorender = JSON.parse(response.clincalNote);
					var customerAssesment = '<div class="card" style="border-radius: 8px"><div class="card-content" style="padding:15px"><p class="strong pink-text">Assessment </p><p >'+clinicalNotetorender.assessment+'</p></div></div>';
					
					var customerObjective = '<div class="card" style="border-radius: 8px"><div class="card-content" style="padding:15px"><p class="strong pink-text">Objective</p><p class="small" style="margin-top: 0px;">General, vital signs, clinical findings, fluid balance, investigations</p><p >'+clinicalNotetorender.objective+'</p></div></div>';
					var customerSubjective = '<div class="card" style="border-radius: 8px"><div class="card-content" style="padding:15px"><p class="strong pink-text">Subjective</p><p class="small" style="margin-top: 0px;">Underlying diseases, chief complaints</p><p >'+clinicalNotetorender.subjective+'</p></div></div>';
					
					var customerPlan = '<div class="card" style="border-radius: 8px"><div class="card-content" style="padding:15px"><p class="strong pink-text">Plan</p><p class="small" style="margin-top: 0px;">Futher treatment, investigation</p><p>'+clinicalNotetorender.plan+'</p></div></div>';
					document.getElementById("notcustclinicalnote").innerHTML = customerSubjective;
					document.getElementById("notcustclinicalnote").innerHTML += customerObjective;
					document.getElementById("notcustclinicalnote").innerHTML += customerAssesment;
					document.getElementById("notcustclinicalnote").innerHTML += customerPlan;

					
				}
			}else{
				hide("cussessionsummary");
				show("cussessionaction");
				hide("sessiondiagnose");
				hide("reviewpanel");
				hide("notdoccussessionsummary");	
			}
            loadingResponse(response.message);
        } else if (chats.status == 404) {
            alert("Fail to connect to our server");
        } else {
            alert("Fail to connect to our server");
        }
    }
    chats.send(dataTopost);
}
function initiateChatCart(id, price, patientSickness, patientdatetime, bookingtype){
		var sic = "Started a tele - consultation to purchase "+purchaseoff
		var dataTopost = "api=1&auth_token="+authUser.login_token+"&initiateChatwithfromcart="+id+"&price="+price+"&sickness="+sic+"&bookingdate="+patientdatetime+"&type="+bookingtype+"&isdoctor=true";
		var xhr = new XMLHttpRequest();
		xhr.open("POST", serverUrl, true);
		xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
		xhr.onload = function() {
			if (xhr.status == 200) {
				var json = xhr.responseText;
				var response = JSON.parse(json);
				hide("bookinginfo");
				openpage('sessioncontroller', response.chat_id, id);
			} else if (xhr.status == 404) {
				alert("Fail to connect to our server");
			} else {
				alert("Fail to connect to our server");
			}
		}
		xhr.send(dataTopost);
}
function initiateChat(id, price, patientSickness, patientdatetime, bookingtype){
	showLoading();
		var dataTopost = "api=1&auth_token="+authUser.login_token+"&initiateChatwith="+id+"&price="+currentviewingrate+"&sickness="+patientSickness+"&bookingdate="+patientdatetime+"&type="+bookingtype+"&isdoctor="+customerViewingisdoctor;
		var xhr = new XMLHttpRequest();
		xhr.open("POST", serverUrl, true);
		xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
		xhr.onload = function() {
			if (xhr.status == 200) {
				var json = xhr.responseText;
				var response = JSON.parse(json);
				hide("bookinginfo");
				hide("confirm");
				closeLoading();
				openpage('sessioncontroller', response.chat_id, id);
			} else if (xhr.status == 404) {
				alert("Fail to connect to our server");
			} else {
				alert("Fail to connect to our server");
			}
		}
		xhr.send(dataTopost);
}
function initChatlist(){
		clearTimeout(chatCheck);
		chatisActive = false;
		addPreloader("chatlistingcontent");
		var dataTopost = "api=1&auth_token="+authUser.login_token+"&chatlist=true";
		var xhr = new XMLHttpRequest();
		xhr.open("POST", serverUrl, true);
		xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
		xhr.onload = function() {
			if (xhr.status == 200) {
				var json = xhr.responseText;
				var response = JSON.parse(json);
				if(response.status == null){
					document.getElementById("chatlistingcontent").innerHTML = "";
					document.getElementById("chatlistcompleted").innerHTML = "";
					var i;
					for (i = 0; i < response.length; i++) {
						if(response[i].owner_one == authUser.id){
							var profileId = response[i].owner_two; 
						}else{
							var profileId = response[i].owner_one; 
						}
		if(response[i].session_status == "new"){
			var sessionstatus = 'In Progress';
		}else if(response[i].session_status == "Ended"){
			if(response[i].doctor == "false"){
				var sessionstatus = 'Ended';
			}else{
				if(response[i].paid == "" && response[i].signedpres != ""){
					var sessionstatus = 'Waiting for customer to make payment.';
					var sessionstatus = 'Waiting Payment';
				}else if(response[i].paid == "true" && response[i].signedpres != ""){
					if(response[i].delivery_completed == "waiting"){
						var sessionstatus = 'Medication paid by customer, waiting for pharmacy to approve the order.';
						var sessionstatus = 'Waiting Approval';
					}else if(response[i].delivery_completed  == "Ready for pickup"){
						var sessionstatus = 'Pharmacy approved. Waiting for rider to accept delivery request.';
						var sessionstatus = 'Waiting Pickup';
					}else if(response[i].delivery_completed == "Accepted"){
						var sessionstatus = 'Medication delivery request accepted by delivery partner.';
						var sessionstatus = 'Delivery in progress';
					}else if(response[i].delivery_completed == "Delivering"){
						var sessionstatus = 'Delivery partner picked up the medication and on his way to deliver to patient.';
						var sessionstatus = 'Delivery in progress';
					}else if(response[i].delivery_completed == "Completed"){
						var sessionstatus = 'Medication delivered to the customer.';
						var sessionstatus = 'Delivery completed';
					}else{
						var sessionstatus = 'Session Ended';
					}
				}else{
					var sessionstatus = 'Session Ended';
				}		
			}

		}						
						
						
						if(response[i].archive === "true"){
							document.getElementById("chatlistcompleted").innerHTML += '<li class="collection-item borderless" style="padding: 0px;     border-bottom: none;"><div class="card white z-depth-2" style="border-radius: 20px"><div class="card-content" style="padding: 5px"><div class="row" style="margin-bottom: 0px"><div class="col s4 l2" style="padding-left: 0px; padding-bottom: 0px"><img src="'+response[i].profile_picture+'" alt="" class="responsive-img" style="border-radius: 15px" onclick="openpage(\'sessioncontroller\', '+response[i].id+', '+profileId+')"></div><div class="col s8 l10"><span class="title" onclick="openpage(\'sessioncontroller\', '+response[i].id+', '+profileId+')">'+response[i].fullname+'</span><p onclick="openpage(\'sessioncontroller\', '+response[i].id+', '+profileId+')">'+sessionstatus+'</p><a href="#!" class="secondary-content" onclick="deleteChat('+response[i].id+')"><i class="material-icons pink-text">delete</i></a></div></div></div></div></li>';
						}else{
							document.getElementById("chatlistingcontent").innerHTML += '<li class="collection-item borderless" style="padding: 0px;     border-bottom: none;"><div class="card white z-depth-2" style="border-radius: 20px"><div class="card-content" style="padding: 5px"><div class="row" style="margin-bottom: 0px"><div class="col s4 l2" style="padding-left: 0px; padding-bottom: 0px"><img src="'+response[i].profile_picture+'" alt="" class="responsive-img" style="border-radius: 15px" onclick="openpage(\'sessioncontroller\', '+response[i].id+', '+profileId+')"></div><div class="col s8 l10"><span class="title" onclick="openpage(\'sessioncontroller\', '+response[i].id+', '+profileId+')">'+response[i].fullname+'</span><p onclick="openpage(\'sessioncontroller\', '+response[i].id+', '+profileId+')">'+sessionstatus+'</p><a href="#!" class="secondary-content" onclick="deleteChat('+response[i].id+')"><i class="material-icons pink-text">delete</i></a></div></div></div></div></li>';
						}
					}
				}else{
					document.getElementById("chatlistingcontent").innerHTML = '<li class="collection-item"><center><br/><br/><i class="large material-icons pink-text">assignment_late</i><p class="pink-text strong">No session</p><p class="grey-text">You have no session</p></center></li>';
				}
				
			} else if (xhr.status == 404) {
				alert("Fail to connect to our server");
			} else {
				alert("Fail to connect to our server");
			}
		}
		xhr.send(dataTopost);
}
var sessionEnded;
function getChat(id){
		sessionEnded = false;
		addPreloader("chat_all_content");
		document.getElementById("chatlistingcontent").innerHTML = "";
		var dataTopost = "api=1&auth_token="+authUser.login_token+"&chat_content="+id;
		var xhr = new XMLHttpRequest();
		xhr.open("POST", serverUrl, true);
		xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
		xhr.onload = function() {
			if (xhr.status == 200) {
				var json = xhr.responseText;
				var response = JSON.parse(json);
				document.getElementById("chat_all_content").innerHTML ="";
				if(response.status == null){
					var sesend = 0;
					document.getElementById("chatlistingcontent").innerHTML = "";
					var i;
					for (i = 0; i < response.length; i++) {
						if(response[i].owner == authUser.id){
							document.getElementById("chat_all_content").innerHTML += '<div class="row "><div class="col s2"></div><div class="col s8 grey lighten-4 right"><span class=""><p class="" style="font-size: initial">'+response[i].chat_content+'</p><p class="chatdate">'+response[i].chat_date+'</p></span></div></div>';
						}else if(response[i].owner == 0){
							document.getElementById("chat_all_content").innerHTML += '<div class="row"<div class="col s2"></div><div class="col s8 orange lighten-2 white-text" style="padding: 10px"><p style="font-size: initial">'+response[i].chat_content+'</p><p class="chatdate">'+response[i].chat_date+'</p></div><div class="col s2"></div></div><br>';
							sesend++;
						}else{
							document.getElementById("chat_all_content").innerHTML += '<div class="row"><div class="col s8 blue lighten-2 white-text"><p style="font-size: initial">'+response[i].chat_content+'</p><p class="chatdate">'+response[i].chat_date+'</p></div><div class="col s2"></div></div>';
							
						}
						
						lastChatid = response[i].id;
						
					}
					if(sesend == 2){
							sessionEnded = true;
					}
					console.log(sesend);
					chatisActive = true;
					setTimeout(updateChat, 3000);
				}else{
					//document.getElementById("chat_all_content").innerHTML = 'You havent started any chat';
				}
				window.scrollTo(0,document.body.scrollHeight);
			} else if (xhr.status == 404) {
				alert("Fail to connect to our server");
			} else {
				alert("Fail to connect to our server");
			}
		}
		xhr.send(dataTopost);
}
function getUserinfo(){
	show("showuserprofile");
}
function getChatpartner(id){
	
	var dataTopost = "api=1&auth_token="+authUser.login_token+"&getchatPartnerinfo="+id;
	var xhr = new XMLHttpRequest();
	xhr.open("POST", serverUrl, true);
	xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
	xhr.onload = function() {
			if (xhr.status == 200) {
				var json = xhr.responseText;
				var response = JSON.parse(json);
				document.getElementById("read_chat_partner_name").innerHTML = response.fullname;
				document.getElementById("chat_partner_profile").innerHTML = '<li><a href="#" onclick="getUserinfo('+response.id+')"><i class="material-icons pink-text">person</i></a></li>';
			} else if (xhr.status == 404) {
				alert("Fail to connect to our server");
			} else {
				alert("Fail to connect to our server");
			}
		}
	xhr.send(dataTopost);
}

var previouschatupdate = [];
function updateChat(){
		var chatWindowactive = document.getElementById("chatcontent").style.display;
		if(chatWindowactive == "block"){
		var dataTopost = "api=1&auth_token="+authUser.login_token+"&updateactivechat="+activeChatid+"&lastid="+lastChatid;
		var xhr = new XMLHttpRequest();
		xhr.open("POST", serverUrl, true);
		xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
		xhr.onload = function() {
			if (xhr.status == 200) {
				var json = xhr.responseText;
				var response = JSON.parse(json);
				if(response.status == null){
					rendered = false
					console.log(previouschatupdate);
					if(previouschatupdate != []){
						var j;
						for (j = 0; j < previouschatupdate.length; j++) {
							var idtocheck = previouschatupdate[j].id;
							var k;
							for (k = 0; k < response.length; k++) {
								if(response[k].id == idtocheck){
									var rendered = true;
								}
							}
						}
					}
					var sesend = 0;
					if(rendered == false){
						var i;
						for (i = 0; i < response.length; i++) {
							if(response[i].owner == authUser.id){
								document.getElementById("chat_all_content").innerHTML += '<div class="row "><div class="col s2"></div><div class="col s8 grey lighten-4 right"><span class=""><p class="">'+response[i].chat_content+'</p><p class="chatdate">'+response[i].chat_date+'</p></span></div></div>';
							}else if(response[i].owner == 0){
								document.getElementById("chat_all_content").innerHTML += '<div class="row"<div class="col s2"></div><div class="col s8 orange lighten-2 white-text" style="padding: 10px"><p>'+response[i].chat_content+'</p><p class="chatdate">'+response[i].chat_date+'</p></div><div class="col s2"></div></div>';
								sesend++;
							}else{
								document.getElementById("chat_all_content").innerHTML += '<div class="row"><div class="col s8 blue lighten-2 white-text"><p>'+response[i].chat_content+'</p><p class="chatdate">'+response[i].chat_date+'</p></div><div class="col s2"></div></div>';
								
							}
							lastChatid = response[i].id;
						}
					}
					if(sesend == 2){
							sessionEnded = true;
					}
					window.scrollTo(0,document.body.scrollHeight);
					previouschatupdate = response;
					chatCheck = setTimeout(updateChat, 1000);
				}else{
					chatCheck = setTimeout(updateChat, 1000);
				}
				
				
			} else if (xhr.status == 404) {
				alert("Fail to connect to our server");
			} else {
				alert("Fail to connect to our server");
			}
		}
		xhr.send(dataTopost);
		}else{
			clearTimeout(chatCheck);
		}
}

function postChat(){
	if(sessionEnded == true){
		showLoading();
		loadingResponse("Sorry this session has been ended");
	}else{
		clearTimeout(chatCheck);
		var chatMessage = document.getElementById("chatinput").value;
		if(chatMessage != ""){
			var dataTopost = "api=1&auth_token="+authUser.login_token+"&postchat=true&conversationid="+activeChatid+"&message="+chatMessage;
			var xhr = new XMLHttpRequest();
			xhr.open("POST", serverUrl, true);
			xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
			xhr.onload = function() {
				if (xhr.status == 200) {
					var json = xhr.responseText;
					var response = JSON.parse(json);
					chatCheck = setTimeout(function(){ updateChat()}, 1000);
					document.getElementById("chatinput").value = "";
					
				} else if (xhr.status == 404) {
						alert("Fail to connect to our server");
				} else {
					alert("Fail to connect to our server");
				}
			}
			xhr.send(dataTopost);
		}else{
			instaResponse("Can't send empty message");
		}
	}
}

function deleteChat(id){
	showLoading();
	var dataTopost = "api=1&auth_token="+authUser.login_token+"&deletechat="+id
	var xhr = new XMLHttpRequest();
	xhr.open("POST", serverUrl, true);
	xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
	xhr.onload = function() {
		if (xhr.status == 200) {
			var json = xhr.responseText;
			var response = JSON.parse(json);
			initChatlist();
			loadingResponse("This session has been archived");
		} else if (xhr.status == 404) {
				alert("Fail to connect to our server");
		} else {
			alert("Fail to connect to our server");
		}
	}
	xhr.send(dataTopost);
}

