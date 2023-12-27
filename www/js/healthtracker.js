function initHealthtracker(){
	showLoading();
			var dataTopost = 'api=1&login_token='+loginToken+"&lat="+appLat+"&lng="+appLng;
			var login = new XMLHttpRequest();
			login.open("POST", serverUrl, true);
			login.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
			login.onload = function() {
				if(login.status == 200){
					var json = login.responseText;
					var response = JSON.parse(json);
					authUser = response;
					if(response.status == "success"){
						
					}
				}else if(login.status == 404) {
					alert("Fail to connect to our server");
				}else{
					alert("Fail to connect to our server");
				}
			}
			login.send(dataTopost);
			
}

function updateHealthtracker(){
	showLoading();
	event.preventDefault();
	var dataTopost = getFormData("healthtrackerform", "update_health_tracker_account", true);
	var updateaccount = new XMLHttpRequest();
	updateaccount.open("POST", serverUrl, true);
	updateaccount.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
	updateaccount.onload = function() {
		if (updateaccount.status == 200) {
			var json = updateaccount.responseText;
			var response = JSON.parse(json);
			if(response.status == "success"){
				
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