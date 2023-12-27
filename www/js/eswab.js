/* 									*/
/*initeSwabtest 					*/
/*-Initiatlize ordering swab test 	*/
/* testKit						 	*/
var kitLocation = { address: "2nd Floor, Space U8, 1-03-02, mall, Persiaran Pasak Bumi, Bukit Jelutong, 40150 Shah Alam, Selangor", lat: "3.1119", lng: "101.5523"};
function initeSwabtest(){
	show("selecteKit");
	hide("eswabResult");
}
var swabmap;
function initSwabMap(rlat, rlng) {
	var rlat = parseFloat(rlat);
	var rlng = parseFloat(rlng);
  const directionsService = new google.maps.DirectionsService();
  const directionsRenderer = new google.maps.DirectionsRenderer();
   swabmap = new google.maps.Map(document.getElementById("swabmap"), {
    zoom: 15,
    center: { lat: rlat, lng: rlng },
	disableDefaultUI: true,
  });

  directionsRenderer.setMap(swabmap);
	calculateAndDisplayRoute(directionsService, directionsRenderer);
}

var swabPickupAddress = '';
var swabDropoffAddress = '';
function calculateAndDisplayRoute(directionsService, directionsRenderer) {
  directionsService
    .route({
      origin: {
        query: swabPickupAddress,
      },
      destination: {
        query: swabDropoffAddress,
      },
      travelMode: google.maps.TravelMode.DRIVING,
    })
    .then((response) => {
      directionsRenderer.setDirections(response);
    })
    .catch((e) => window.alert("Directions request failed due to " + status));

	geocoder.geocode({'address': swabPickupAddress}, function (results, status) {
	  if (status === google.maps.GeocoderStatus.OK) {
		swabmap.setCenter(results[0].geometry.location);
		var markersz = 'img/patientmarker.png';
		var marker = new google.maps.Marker({
		  map: swabmap,
		  position: results[0].geometry.location,
		  icon: markersz
		});
	  }
	  else {
		alert('Geocode was not successful for the following reason: ' +    status);
	 }
	});
	geocoder.geocode({'address': swabDropoffAddress}, function (results, status) {
	  if (status === google.maps.GeocoderStatus.OK) {
		swabmap.setCenter(results[0].geometry.location);
		var marker = new google.maps.Marker({
		  map: swabmap,
		  position: results[0].geometry.location,
		   icon: markersz
		});
	  }
	  else {
		alert('Geocode was not successful for the following reason: ' +    status);
	 }
	});	
	
}
function viewSwabResult(id){
	
    var dataTopost = "api=1&auth_token=" + authUser.login_token + "&viewThisepinkswab="+id;
    var epinkswab = new XMLHttpRequest();
    epinkswab.open("POST", serverUrl, true);
    epinkswab.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    epinkswab.onload = function() {
        if (epinkswab.status == 200) {
            var json = epinkswab.responseText;
            var response = JSON.parse(json);
			
			if(response.status == "Delivering Kit"){	
				swabPickupAddress = '2nd Floor, Space U8, 1-03-02, mall, Persiaran Pasak Bumi, Bukit Jelutong, 40150 Shah Alam, Selangor';
				swabDropoffAddress = response.address;
				initSwabMap(response.lat, response.lng);
				//document.getElementById("swabcontent").innerHTML = '';
			}
			show("swabaction");
			console.log("<p>'+response.requester_id+'</p><p>'+response.kit_name+'</p><p>'+response.address+'</p><p>'+response.delivery_price+'</p><p>'+response.total_price+'</p><p>'+response.kit_price+'</p><p>'+response.videofile+'</p><p>'+response.status+'</p><p>'+response.doctor_id+'</p><p>'+response.test_result+'</p>");
            loadingResponse(response.message);
        } else if (epinkswab.status == 404) {
            alert("Fail to connect to our server");
        } else {
            alert("Fail to connect to our server");
        }
    }
    epinkswab.send(dataTopost);
}


function initializeGettest(){
	resetEpinkSwabForm();
	show("selecteKit");
	hide("eswabResult");
}
function initializeResult(){
	var dataTopost = "api=1&auth_token=" + authUser.login_token + "&viewallepinkswab=true";
    var epinkswab = new XMLHttpRequest();
    epinkswab.open("POST", serverUrl, true);
    epinkswab.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    epinkswab.onload = function() {
        if (epinkswab.status == 200) {
            var json = epinkswab.responseText;
            var response = JSON.parse(json);
			var i;
			document.getElementById("eswabResult").innerHTML ="";
				for (i = 0; i < response.length; i++) {
					
					document.getElementById("eswabResult").innerHTML += '<div class="card white darken-1" style="margin-top: 20px; border-radius: 15px; padding: 0px !important"> <div class="card-content pink-text" style="padding: 0px; padding-top: 10px; padding-bottom: 0px;"> <div class="row" onclick="viewSwabResult('+response[i].id+')"> <div class="col s4"><img src="https://via.placeholder.com/500x500" class="responsive-img" style="border-radius: 15px; margin-bottom: 4px;"></div><div class="col s6"><span class="pink-text strong">'+response[i].kit_name+'</span><p>Status:'+response[i].status+'</p> <p>Paid: RM'+response[i].total_price+'</p></div></div></div></div>';
				}
            loadingResponse(response.message);
        } else if (epinkswab.status == 404) {
            alert("Fail to connect to our server");
        } else {
            alert("Fail to connect to our server");
        }
    }
    epinkswab.send(dataTopost);
}
function resetEpinkSwabForm(){
	show("kitselection");
	hide("eswabaddressinput");
	hide("confirmTest");
	document.getElementById("eswabaddresspicker").innerHTML = "";
	document.getElementById("swabaddressinput").value = "";
	
}
function insertToepinkswab(){
	showLoading();      
    var kit_name = document.getElementById("selectedkitdescription").innerHTML;
    var address = document.getElementById("deliveryaddresspink").innerHTML;
    var delivery_price = document.getElementById("deliverypricepink").innerHTML;
    var total_price = document.getElementById("deliverypricepinktotal").innerHTML;
    var kit_price = document.getElementById("selectedkitprice").innerHTML;
    var verificationprice = document.getElementById("verificationfee").innerHTML;
   
  
    var dataTopost = "api=1&auth_token=" + authUser.login_token + "&inserttoepinkswab=true&kit_name="+kit_name+"&address="+address+"&delivery_price="+delivery_price+"&total_price="+total_price+"&kit_price="+kit_price+"verification_price="+verificationprice;
    var epinkswab = new XMLHttpRequest();
    epinkswab.open("POST", serverUrl, true);
    epinkswab.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    epinkswab.onload = function() {
        if (epinkswab.status == 200) {
            var json = epinkswab.responseText;
            var response = JSON.parse(json);
            loadingResponse(response.message);
			resetEpinkSwabForm();
			initializeResult();
        } else if (epinkswab.status == 404) {
            alert("Fail to connect to our server");
        } else {
            alert("Fail to connect to our server");
        }
    }
    epinkswab.send(dataTopost);
}

function eSwabPick(selectedkit, price, pic){
	hide("kitselection");
	show("eswabaddressinput");
	document.getElementById("selectedkitpicture").src = pic;
	document.getElementById("selectedkitprice").innerHTML = price;
	document.getElementById("selectedkitdescription").innerHTML = selectedkit;
}

function eswabAddressinput(element){
	var addresstoSearch = element.value;
	document.getElementById('eswabaddresspicker').innerHTML = '';
	  var displaySuggestions = function(predictions, status) {
		if (status != google.maps.places.PlacesServiceStatus.OK) {
		  document.getElementById('eswabaddresspicker').innerHTML = '<p class="eselection">Can\'t find that address</li>';
		  return;
		}
		predictions.forEach(function(prediction) {
		  var lol = '<p class="eselection" onclick="setSwabDeliveryAddress(\'' + prediction.description + '\')"><i class="material-icons pink-text" style="vertical-align: bottom;">location_on</i>' + prediction.description + '</p>';
		  document.getElementById("eswabaddresspicker").innerHTML += lol;
		});
	  };

		var service = new google.maps.places.AutocompleteService();
		service.getQueryPredictions({
			input: addresstoSearch
		}, displaySuggestions);
}

function setSwabDeliveryAddress(pickedaddress){
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
		var dataTopost = "api=1&auth_token=" + authUser.login_token + "&getdeliveryprice=true&from="+kitLocation.address+"&fromlat="+kitLocation.lat+"&fromlng="+kitLocation.lng+"&to="+pickedaddress+"&tolat="+cleanedLat+"&tolng="+cleanedLng;
		var users = new XMLHttpRequest();
		users.open("POST", serverUrl, true);
		users.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
		users.onload = function() {
        if (users.status == 200) {
            var json = users.responseText;
            var response = JSON.parse(json);
			var speedy = response.speedy;
			var od = speedy.order;
            var deliveryfee = od.delivery_fee_amount;
			if(speedy.is_successful == true){
				var kitprice = parseFloat(document.getElementById("selectedkitprice").innerHTML);
				var deliveryprice = parseFloat(deliveryfee);
				var totalprice = kitprice + deliveryprice + 15.00;
				document.getElementById("deliveryaddresspink").innerHTML = pickedaddress;
				document.getElementById("deliverypricepink").innerHTML = deliveryprice.toFixed(2);
				document.getElementById("deliverypricepinktotal").innerHTML = totalprice.toFixed(2);
				hide("eswabaddressinput");
				show("confirmTest");
				
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