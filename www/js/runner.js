var curJobrunning;
function openMap(latLng){
	window.open("https://www.google.com/maps/search/?api=1&query="+latLng+"&mode=d" , '_system');
}

function runnerSetCompleted(orderid){
	showLoading();
	var dataTopost = 'api=1&auth_token='+authUser.login_token+"&runnersetcompleted="+orderid;
		var xhr = new XMLHttpRequest();
		xhr.open("POST", serverUrl, true);
		xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
		xhr.onload = function() {
			if (xhr.status == 200) {
				var json = xhr.responseText;
				var response = JSON.parse(json);
				loadingResponse(response.message);
				hide("turnon");
				hide("ontask");
				show("turnoff");
				document.getElementById("runnertask").innerHTML = '<img src="img/jobsearch.gif" class="responsive-img"><center><h5 class="strong"><span class="green-text">You Are Online</span></h5>You are currently online and looking for customer order.</center>';
				checkForjob();
				
			} else if (xhr.status == 404) {
				alert("Fail to connect to our server");
			} else {
				alert("Fail to connect to our server");
			}
		}
		xhr.send(dataTopost);
}
function runnerSetPickedup(orderid){
	showLoading();
	var dataTopost = 'api=1&auth_token='+authUser.login_token+"&runnersetpickup="+orderid;
		var xhr = new XMLHttpRequest();
		xhr.open("POST", serverUrl, true);
		xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
		xhr.onload = function() {
			if (xhr.status == 200) {
				var json = xhr.responseText;
				var response = JSON.parse(json);
				loadingResponse(response.message);
				
				var jobData = JSON.parse(response.data);
				var cartitem = jobData.cartitem;
				var customerDetail = jobData.customer_detail;
				var deliveryAddressUri = encodeURI(jobData.delivery_address);
				var deli = 'geo:?q='+deliveryAddressUri;
				var jobid = response.job_id
				document.getElementById("runnertask").innerHTML = '<br><h5 class="strong">Customer Detail</h5><img src="'+customerDetail.profile_img+'" class="responsive-img circle" width="120px" height="120px"><p class="strong">'+customerDetail.contact_name+'</p><p>Contact Number: '+customerDetail.phonenumber+'</p><p>Deliver to <a href="'+deli+'"><span class="strong">'+jobData.delivery_address+'</span></a></p>';
				document.getElementById("runnertask").innerHTML += '<br><button class="btn red white-text btn-block" onclick="runnerSetCompleted('+response.id+')">Set Completed</button>'; 
			} else if (xhr.status == 404) {
				alert("Fail to connect to our server");
			} else {
				alert("Fail to connect to our server");
			}
		}
		xhr.send(dataTopost);
}

function reinitJob(){
	//document.getElementById("runnertask")
}
function currentJob(id){
	var dataTopost = 'api=1&auth_token='+authUser.login_token+"&currentjob=id";
	var xhr = new XMLHttpRequest();
	xhr.open("POST", serverUrl, true);
	xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
	xhr.onload = function(){
		if (xhr.status == 200){
			var json = xhr.responseText;
			var response = JSON.parse(json);
			curJobrunning = setTimeout(function(){ currentJob(id); }, 3000);
		} else if (xhr.status == 404) {
				alert("Fail to connect to our server");
		} else {
				alert("Fail to connect to our server");
		}
	}
	xhr.send(dataTopost);
}
function turnOnrunner(){
	showLoading();
	show("turnoff");
	hide("turnon");
	var lat = appLat;
	var lng = appLng;
	var dataTopost = "api=1&auth_token="+authUser.login_token+"&availability=On&lat="+lat+"&lng="+lng;
    var users = new XMLHttpRequest();
    users.open("POST", serverUrl, true);
    users.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    users.onload = function() {
        if (users.status == 200) {
            var json = users.responseText;
            var response = JSON.parse(json);
			checkForjob();
			loadingResponse(response.message);
			document.getElementById("runnertask").innerHTML = '<img src="img/jobsearch.gif" class="responsive-img"><center><h5 class="strong"><span class="green-text">You Are Online</span></h5>You are currently online and looking for customer order.</center>';
			
        } else if (users.status == 404) {
            alert("Fail to connect to our server");
        } else {
            alert("Fail to connect to our server");
        }
    }
    users.send(dataTopost);
}
function runnerCancelOrder(id){
	clearTimeout(orderStatusupdate);
	showLoading();
	var dataTopost = 'api=1&auth_token='+authUser.login_token+"&runnercancelorder="+id;
		var xhr = new XMLHttpRequest();
		xhr.open("POST", serverUrl, true);
		xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
		xhr.onload = function() {
			if (xhr.status == 200) {
				var json = xhr.responseText;
				var response = JSON.parse(json);
				loadingResponse(response.message);
				location.reload();
			} else if (xhr.status == 404) {
				alert("Fail to connect to our server");
			} else {
				alert("Fail to connect to our server");
			}
		}
		xhr.send(dataTopost);
}

function turnOffrunner(){
	showLoading();
	clearTimeout(runneron);
	
	var lat = appLat;
	var lng = appLng;
	var dataTopost = "api=1&auth_token="+authUser.login_token+"&availability=Off&lat="+lat+"&lng="+lng;
    var users = new XMLHttpRequest();
    users.open("POST", serverUrl, true);
    users.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    users.onload = function() {
        if (users.status == 200) {
            var json = users.responseText;
            var response = JSON.parse(json);
			loadingResponse(response.message);
			document.getElementById("runnertask").innerHTML = '<img src="img/offline.png" class="responsive-img"><center><h5 class="strong"><span class="red-text">You Are Offline</span></h5>You are currently offline and unable to receive any order </center>';
			show("turnon");
			hide("turnoff");
			
        } else if (users.status == 404) {
            alert("Fail to connect to our server");
        } else {
            alert("Fail to connect to our server");
        }
    }
    users.send(dataTopost);
}
var runneron;
var checkcancel;
var ordernew;
function checkForjob(){
			var dataTopost = 'api=1&login_token='+authUser.login_token;
			var login = new XMLHttpRequest();
			login.open("POST", serverUrl, true);
			login.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
			login.onload = function() {
				if(login.status == 200){
					var json = login.responseText;
					var response = JSON.parse(json);
					authUser = response;
					if(response.status == "success"){
						if(response.availability == "On"){
							hide("turnon");
							hide("ontask");
							var runview = document.getElementById("runnertask").innerHTML;
							if(runview == ""){
								document.getElementById("runnertask").innerHTML = '<img src="img/jobsearch.gif" class="responsive-img"><center><h5 class="strong"><span class="green-text">You Are Online</span></h5>You are currently online and looking for customer order.</center>';
							}
							runneron = setTimeout(function(){ console.log("Checking for job"); checkForjob(); }, 1000);
						}else if(response.availability == "Completing Task"){
							clearTimeout(runneron);
							hide("turnon");
							hide("turnoff");
							show("ontask");
							var runnerCurrentJob = response.job_info;							
							var jobData = JSON.parse(runnerCurrentJob.data);
							var cartitem = jobData.cartitem;
							var customerDetail = jobData.customer_detail;
							var deliveryAddressUri = encodeURI(jobData.delivery_address);
							var deli = 'geo:?q='+deliveryAddressUri;
							var jobid = response.job_id;
							
							document.getElementById("runnertask").innerHTML = '<br><h5 class="strong">Customer Detail</h5><img src="'+customerDetail.profile_img+'" class="responsive-img circle" width="120px" height="120px"><p class="strong">'+customerDetail.contact_name+'</p><p>Contact Number: '+customerDetail.phonenumber+'</p><p>Deliver to <a href="'+deli+'"><span class="strong">'+jobData.delivery_address+'</span></a></p>';
								
								document.getElementById("runnertask").innerHTML += '<h5 class="strong">Order Detail</h5>';
								var i;
								for (i = 0; i < cartitem.length; i++) {
									var quantity = parseInt(cartitem[i].quantity);
									var uriAddress = encodeURI(cartitem[i].vendor_address);
									var latLng = cartitem[i].vendor_lat+','+cartitem[i].vendor_lng;
									var maplocater = 'geo:'+latLng+'?q='+uriAddress;
									var productPrice = quantity * parseFloat(cartitem[i].product_price);
									productPrice = productPrice.toFixed(2);
									document.getElementById("runnertask").innerHTML += '<div class="card"><div class="card-content" style="padding: 10px; padding-top: 1px;"><h5 class="strong">'+quantity+' '+cartitem[i].product_name+' - RM'+productPrice+'</h5><br><p class="strong">Pick up:-<br> <span class="strong">'+cartitem[i].vendor_name+'</span> </p>'+cartitem[i].vendor_address+' <br><br><p class="strong">Order Message:</p><p>'+cartitem[i].message+'</p></div><div class="card-action"><a href="'+maplocater+'">Location</a></div></div>';
								}
								
								document.getElementById("runnertask").innerHTML += '<br><div class="row"><div class="col s6" style="padding-left: 0px;"><button class="btn white red-text btn-block" onclick="runnerCancelOrder('+runnerCurrentJob.id+')">Cancel</button></div><div class="col s6" style="padding-right: 0px;"><button class="btn red white-text btn-block" onclick="runnerSetPickedup('+runnerCurrentJob.id+')">Pick Up</button></div></div><p class="center">Set customer order as picked after you picked up all the order.</p>'; 
								
							if(runnerCurrentJob.order_status == "New"){
								checkcancel = setTimeout(function(){ console.log("Check for canceld job"); checkforCancel(jobid); }, 1000);
							}
						}

					}
				}else if(login.status == 404) {
					alert("Fail to connect to our server");
				}else{
					alert("Fail to connect to our server");
				}
			}
			login.send(dataTopost);
	
}
function checkforCancel(id){
	var dataTopost = 'api=1&auth_token='+authUser.login_token+"&checkcancel="+id;
	var xhr = new XMLHttpRequest();
	xhr.open("POST", serverUrl, true);
	xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
	xhr.onload = function() {
		if (xhr.status == 200) {
			var json = xhr.responseText;
			var response = JSON.parse(json);
			if(response.order_status == "New"){
				checkcancel = setTimeout(function(){ console.log("Check for canceld job"); checkforCancel(id); }, 1000);	
			}else if(response.order_status == "Canceled"){
				clearTimeout(checkcancel);
					document.getElementById("runnertask").innerHTML = '<img src="img/offline.png" class="responsive-img"><center><h5 class="strong"><span class="red-text">Order Canceled</span></h5>The previous job has been canceled by the customer.';
				show("turnon");
				hide("turnoff");
				hide("ontask");
			}
		} else if (xhr.status == 404) {
			alert("Fail to connect to our server");
		} else {
			alert("Fail to connect to our server");
		}
	}
	xhr.send(dataTopost);
}

function initRunnerProfile(){
	var dataTopost = 'api=1&auth_token='+authUser.login_token+"&runnerprofile=true";
	document.getElementById("runner_history").innerHTML = '<br><center><div class="preloader-wrapper small active"><div class="spinner-layer spinner-green-only"><div class="circle-clipper left"><div class="circle"></div></div><div class="gap-patch"><div class="circle"></div></div><div class="circle-clipper right"><div class="circle"></div></div></div></div></center>';
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
					
					if(response.job != "empty"){
						document.getElementById("runner_history").innerHTML = "";
						var job = response.job;
						var i;
						for(i = 0; i < job.length; i++){
							console.log(job[i].name);
							document.getElementById("runner_history").innerHTML += '<li class="collection-item">'+job[i].name+'<span class="right"> '+job[i].order_status+'</span><p>'+job[i].delivery_price+'</p></li>';
						}
					}else{
							document.getElementById("runner_history").innerHTML = '<li class="collection-item"><p class="strong">No history</p><p>You havent completed any order yet.</p></li>';
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