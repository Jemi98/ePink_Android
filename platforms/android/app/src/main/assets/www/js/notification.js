function initNotification(){
		addPreloader("notificationlistingcontent");
		var dataTopost = "api=1&auth_token="+authUser.login_token+"&notification=true";
		var xhr = new XMLHttpRequest();
		xhr.open("POST", serverUrl, true);
		xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
		xhr.onload = function() {
			if (xhr.status == 200) {
				var json = xhr.responseText;
				var response = JSON.parse(json);
				if(response.status == null){
					document.getElementById("notificationlistingcontent").innerHTML = "";
					var i;
					for (i = 0; i < response.length; i++) {
						if(app.language == "MY"){
							document.getElementById("notificationlistingcontent").innerHTML += '<li class="collection-item black-text" onclick="openpage(\'notificationview\', '+response[i].id+')"><p><b>'+response[i].title_my+'</b><p>'+response[i].description_my+'</p></li>';
						}else{
							document.getElementById("notificationlistingcontent").innerHTML += '<li class="collection-item black-text" onclick="openpage(\'notificationview\', '+response[i].id+')"><p><b>'+response[i].title+'</b><p>'+response[i].description+'</p></li>';
						}
					}
				}else{
					document.getElementById("notificationlistingcontent").innerHTML = '<li class="collection-item"></li>';
				}
				
			} else if (xhr.status == 404) {
				alert("Fail to connect to our server");
			} else {
				alert("Fail to connect to our server");
			}
		}
		xhr.send(dataTopost);
}

	function openNotification(id){
		addPreloader("notificationreadcontent"); 
		var dataTopost = "api=1&auth_token="+authUser.login_token+"&readnotification="+id;
		var xhr = new XMLHttpRequest();
		xhr.open("POST", serverUrl, true);
		xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
		xhr.onload = function() {
			if (xhr.status == 200) {
				var json = xhr.responseText;
				var response = JSON.parse(json);
				if(app.language == "MY"){
						document.getElementById("notificationreadcontent").innerHTML = '<p><b>'+response.title_my+'</b></p> '+response.description_my+'';
							
					}else{
						document.getElementById("notificationreadcontent").innerHTML = '<p><b>'+response.title+'</b></p> '+response.description+'';
				}
				
			} else if (xhr.status == 404) {
				alert("Fail to connect to our server");
			} else {
				alert("Fail to connect to our server");
			}
		}
		xhr.send(dataTopost);
	}

	