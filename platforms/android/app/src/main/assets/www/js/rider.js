var deliveryData = { "pickup_location":"", "drop_location":"", "delivery_price":"", "user_message":"", "payment_method":"", "job_type":"" };
function riderUploadfile(){
	showLoading();
	var rideric = document.getElementById("ridericactivation64").value;
	var riderlisence = document.getElementById("riderlisenceactivation64").value;
	var dataTopost = "api=1&auth_token=" + authUser.login_token + "&riderUploadfile=true&ic="+rideric+"&lisence="+riderlisence;
    var rider_activations = new XMLHttpRequest();
    rider_activations.open("POST", serverUrl, true);
    rider_activations.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    rider_activations.onload = function(){
        if (rider_activations.status == 200) {
            var json = rider_activations.responseText;
            var response = JSON.parse(json);
			if(response.status == "new"){
				show("riderwaitingstatus");
				hide("ridernewstatus");
			}else if(response.status == "updated"){
				show("riderwaitingstatus");
				hide("ridernewstatus");
			}
			console.log("<p>'+response.rider_ic+'</p><p>'+response.rider_lisence+'</p><p>'+response.requester+'</p>");
            loadingResponse(response.message);
			
        } else if (rider_activations.status == 404) {
            alert("Fail to connect to our server");
        } else {
            alert("Fail to connect to our server");
        }
    }
    rider_activations.send(dataTopost);
}
function initRideractivation(){
	var dataTopost = "api=1&auth_token=" + authUser.login_token + "&viewThisrideractivations=true";
    var rider_activations = new XMLHttpRequest();
    rider_activations.open("POST", serverUrl, true);
    rider_activations.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    rider_activations.onload = function(){
        if (rider_activations.status == 200) {
            var json = rider_activations.responseText;
            var response = JSON.parse(json);
			if(response.status == "New"){
				hide("riderwaitingstatus");
				show("ridernewstatus");
			}else if(response.status == "Waiting"){
				show("riderwaitingstatus");
				hide("ridernewstatus");
				hide("riderdeclinestatus");
				hide("riderapprovedstatus");
				document.getElementById("ridericactivation").src = response.rider_ic;
				document.getElementById("ridericactivation64").value = response.rider_ic;
				document.getElementById("riderlisenceactivation").src = response.rider_lisence;
				document.getElementById("riderlisenceactivation64").value = response.rider_lisence;
			}else if(response.status == "true"){
				hide("ridernewstatus");
				hide("riderdeclinestatus");
				hide("riderwaitingstatus");
				hide("rfrom");
				show("riderapprovedstatus");
			}else{
				hide("ridernewstatus");
				hide("riderdeclinestatus");
				hide("riderwaitingstatus");
				hide("riderapprovedstatus");
			}
			console.log("<p>'+response.rider_ic+'</p><p>'+response.rider_lisence+'</p><p>'+response.requester+'</p>");
            loadingResponse(response.message);
        } else if (rider_activations.status == 404) {
            alert("Fail to connect to our server");
        } else {
            alert("Fail to connect to our server");
        }
    }
    rider_activations.send(dataTopost);
}
function setDeliverypayment(element){
	var selectedoption = element.value;
	deliveryData.payment_method = selectedoption;
}
function setRunnerMessage(element){
	var messages = element.value;
	deliveryData.user_message = messages;
}
function requestRider(){
	showLoading();
	var restaurant_id = 0;
	var customerdetail = {"contact_name":authUser.firstname+' '+authUser.lastname, "profile_img":authUser.profile_img, "phonenumber":authUser.phonenumber, "owner":authUser.id};
	deliveryData.job_type = "Parcel Delivery";
	deliveryData.customer_detail = customerdetail;
    var data = JSON.stringify(deliveryData);
	console.log(data);
    var order_date = "Server Side";
    var order_status = "New";
    var runner = "Server Side";
    var payment_type = deliveryData.payment_method;
    var cart_price = deliveryData.delivery_price;

    var dataTopost = "api=1&auth_token=" + authUser.login_token + "&requestDelivery=true&restaurant_id="+restaurant_id+"&data="+data+"&order_date="+order_date+"&order_status="+order_status+"&runner="+runner+"&payment_type="+payment_type+"&cart_price="+cart_price;
    var job_order = new XMLHttpRequest();
    job_order.open("POST", serverUrl, true);
    job_order.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    job_order.onload = function() {
        if (job_order.status == 200) {
            var json = job_order.responseText;
            var response = JSON.parse(json);
            
			if(response.status == "Successful"){
				openOrder(response.order_id);
			}else{
				loadingResponse(response.message);
			}
        } else if (job_order.status == 404) {
            alert("Fail to connect to our server");
        } else {
            alert("Fail to connect to our server");
        }
    }
    job_order.send(dataTopost);
}

function initRider(){
	
}

function runnersetsearchForPickup(){
	show("searchwindowPickup");
}

function initServicePickup(elements) {
  var searchQuery = elements.value;
  document.getElementById('pickupresults').innerHTML = '';
  var displaySuggestions = function(predictions, status) {
    if (status != google.maps.places.PlacesServiceStatus.OK) {
      document.getElementById('pickupresults').innerHTML = '<li class="collection-item">Can\'t find that address</li>';
      return;
    }
    predictions.forEach(function(prediction) {
      var lol = '<li class="collection-item" onclick="setRiderPickup(\'' + prediction.description + '\')">' + prediction.description + '</li>';
      document.getElementById("pickupresults").innerHTML += lol;
    });
  };

	var service = new google.maps.places.AutocompleteService();
	service.getQueryPredictions({
		input: searchQuery
	}, displaySuggestions);
}
function setRiderPickup(content){
	deliveryData.pickup_location = content;
	hide("searchwindowPickup");
	document.getElementById("selectedpickuplocationrunner").innerHTML = content;
	document.getElementById("pickupresults").innerHTML = "";
	document.getElementById("searchwindowPickup").style.display = "none";
	document.getElementById("pickupsearch").value = '';
	getRiderDistance();
}

function getRiderDistance(){
  var pickUp =  document.getElementById("selectedpickuplocationrunner").innerHTML;
  var dropOff = document.getElementById("selecteddropofflocationrunner").innerHTML;
  if (pickUp != 'Pick up location not set' || dropOff != 'Drop off location not set') {
    var service = new google.maps.DistanceMatrixService;
    service.getDistanceMatrix({
      origins: [pickUp],
      destinations: [dropOff],
      travelMode: 'DRIVING',
      unitSystem: google.maps.UnitSystem.METRIC,
      avoidHighways: false,
      avoidTolls: false
    }, function(response, status) {
      if (status !== 'OK') {
        alert('Error was: ' + status);
      } else {
        var test = response.rows[0].elements[0];
        console.log(test.status);
        if (test.status === 'ZERO_RESULTS') {
			showLoading();
			loadingResponse("Please use real address");
			document.getElementById("paycart").disabled = true;
        } else {
			  var distance = test.distance.value;
			  var inKM = distance / 1000;
			  var inKM = inKM.toFixed(0);
			  var pricePerKm = parseFloat(0.80);
			  if(inKM > 5){
					var distanceAfterfiveKM = inKM - 5;
					var priceAfter5KM = distanceAfterfiveKM * pricePerKm;
					var totalDeliveryPrice = 5 + priceAfter5KM;
					document.getElementById("riderdistance").innerHTML = inKM+"KM";
					document.getElementById("riderprice").innerHTML = "RM"+totalDeliveryPrice;
					deliveryData.delivery_price = totalDeliveryPrice;
			  }else{
					var price = pricePerKm * inKM;
					var newPrice = price.toFixed(2);
					document.getElementById("riderdistance").innerHTML = inKM+"KM";
					document.getElementById("riderprice").innerHTML = "RM5.00";
					deliveryData.delivery_price = 5.00;
			  }
        }
      }
    });
  } else {
    alert("Please setup your pick up location properly");
  }
}
function runnersetsearchForDrop(){
	show("searchwindowDropoff");
}
function initServiceDropoff(elements) {
  var searchQuery = elements.value;
  document.getElementById('dropoffresults').innerHTML = '';
  var displaySuggestions = function(predictions, status) {
    if (status != google.maps.places.PlacesServiceStatus.OK) {
      document.getElementById('dropoffresults').innerHTML = '<li class="collection-item">Can\'t find that address</li>';
      return;
    }

    predictions.forEach(function(prediction) {
      var lol = '<li class="collection-item" onclick="setRiderDropoff(\'' + prediction.description + '\')">' + prediction.description + '</li>';
      document.getElementById("dropoffresults").innerHTML += lol;
    });
  };

  var service = new google.maps.places.AutocompleteService();
  service.getQueryPredictions({
    input: searchQuery
  }, displaySuggestions);
}

function setRiderDropoff(content){
	deliveryData.drop_location = content;
    hide("searchwindowDropoff");
    document.getElementById("selecteddropofflocationrunner").innerHTML = content;
    document.getElementById("dropoffresults").innerHTML = "";
    document.getElementById("dropoffsearch").value = '';
    getRiderDistance();
}


