function initVendorOrder(){
	var dataTopost = "api=1&auth_token=" + authUser.login_token + "&pharmaorder=true";
    var job_order = new XMLHttpRequest();
    job_order.open("POST", serverUrl, true);
    job_order.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    job_order.onload = function() {
        if (job_order.status == 200) {
				var json = job_order.responseText;
				var response = JSON.parse(json);
				var pharma = response.pharma;
				var store = response.store;
				console.log(pharma);
				console.log(store);
				var i;
				hide("vendororderold");
				show("vendorordernew");
				document.getElementById("vendorordernew").innerHTML ="";
				document.getElementById("vendororderold").innerHTML ="";
				if(pharma != null){
					for (i = 0; i < pharma.length; i++) {
						var patient_profile = pharma[i].patient_profile;
					
						if(pharma[i].storeapprove == null || pharma[i].storeapprove == ""){
							
							document.getElementById("vendorordernew").innerHTML += '<div class="card blue-grey darken-1" onclick="openpage(\'pharmaorderview\', '+pharma[i].id+',  \'pharma\')"> <div class="card-content white-text"> <p class="strong">Doctor Sessions</p><span class="">'+patient_profile.full_name+' <span class="right">Order ID: P'+pharma[i].id+'</span> <p>'+pharma[i].session_date+'</span> </div> </div>';
							
						}else{
							
							document.getElementById("vendororderold").innerHTML += '<div class="card blue-grey darken-1" onclick="openpage(\'pharmaorderview\', '+pharma[i].id+', \'pharma\')"> <div class="card-content white-text"><p class="strong">Doctor Sessions</p> <span class="">'+patient_profile.full_name+' <span class="right">Order ID: P'+pharma[i].id+'</span> <p>'+pharma[i].session_date+'</span> <p>Delivery Status: '+pharma[i].delivery_completed+'</p></div> </div>';
							
						}
					}
				}else{
					
				}
				if(store != null){
					for (i = 0; i < store.length; i++) {
						var patient_profile = store[i].patient_profile;
						console.log(patient_profile);
					
						if(store[i].order_status == "New"){
							document.getElementById("vendorordernew").innerHTML += '<div class="card green" onclick="openpage(\'pharmaorderview\', '+store[i].id+', \'store\')"> <div class="card-content white-text"><p class="strong">Store Purchase</p> <span class="">'+patient_profile.full_name+' <span class="right">Order ID: S'+store[i].id+'</span> <p>'+store[i].order_date+'</span> </div> </div>';
						}else{
							document.getElementById("vendororderold").innerHTML += '<div class="card green" onclick="openpage(\'pharmaorderview\', '+store[i].id+', \'store\')"> <div class="card-content white-text"><p>Store Purchase</p> <span class="">'+patient_profile.full_name+' <span class="right">Order ID: S'+store[i].id+'</span> <p>'+store[i].order_date+'</span> <p>Delivery Status: '+store[i].order_status+'</p></div> </div>';
						}
					}
				}else{
					
				}
        } else if (job_order.status == 404) {
            alert("Fail to connect to our server");
        } else {
            alert("Fail to connect to our server");
        }
    }
    job_order.send(dataTopost);
}
let vendorViewingorder = 0;
var orderviewtype = '';
function setPrepared(){
	showLoading();
	setTimeout(function(){
	var dataTopost = "api=1&auth_token=" + authUser.login_token + "&setPrepared="+vendorViewingorder+"&type="+orderviewtype;
    var chats = new XMLHttpRequest();
    chats.open("POST", serverUrl, true);
    chats.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    chats.onload = function(){
        if (chats.status == 200) {
            var json = chats.responseText;
            var response = JSON.parse(json);
            loadingResponse(response.message);
			openpage("vendorordermanager");
        } else if (chats.status == 404) {
            alert("Fail to connect to our server");
        } else {
            alert("Fail to connect to our server");
        }
    }
    chats.send(dataTopost);
	}, 1000);
}

function setFinish(){
	hide("pharmaorderview");
	showLoading();
	
	var dataTopost = "api=1&auth_token=" + authUser.login_token + "&setselfpickupfinish="+vendorViewingorder;
    var job_order = new XMLHttpRequest();
    job_order.open("POST", serverUrl, true);
    job_order.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    job_order.onload = function() {
        if (job_order.status == 200) {
				var json = job_order.responseText;
				var response = JSON.parse(json);
				openpage('vendorordermanager');
				
        } else if (job_order.status == 404) {
            alert("Fail to connect to our server");
        } else {
            alert("Fail to connect to our server");
        }
    }
    job_order.send(dataTopost);
}
function initOrderView(identifier, type){
	document.getElementById("vendormedviews").innerHTML = "";
	vendorViewingorder = identifier;
	orderviewtype = type;
	var dataTopost = "api=1&auth_token=" + authUser.login_token + "&pharmaorderview="+identifier+"&type="+type;
    var job_order = new XMLHttpRequest();
    job_order.open("POST", serverUrl, true);
    job_order.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    job_order.onload = function() {
        if (job_order.status == 200) {
				var json = job_order.responseText;
				var response = JSON.parse(json);
				console.log(response.type);
				if(response.type == "store"){
					hide("pharmaorder");
					show("storeoder");
					var patient_profile = response.patient_profile;
					var doctor_profile = response.doctor_profile;
					console.log(response.data);
					var orderdata = JSON.parse(response.data);
					console.log(orderdata);
					document.getElementById("storemedviews").innerHTML = "";
					document.getElementById("storepatientpicture").src = patient_profile.profile_img;
					document.getElementById("storepatientname").innerHTML = patient_profile.full_name;
					document.getElementById("storepatientic").innerHTML = patient_profile.ic_number;

					if(response.deliverytype == "pickup"){
						console.log(response);
						show("setcompletepikcupbutton");
						hide("setprespbutton");
						var cartitemdata = orderdata.cartitem;
						console.log(cartitemdata);
						for (let i = 0; i < cartitemdata.length; i++) {
							var quanitity = parseInt(cartitemdata[i].quantity);
							document.getElementById("storemedviews").innerHTML += '<li class="collection-item">'+cartitemdata[i].product_name+' <p>Quantity '+quanitity+'</p></li>';
						}
						document.getElementById("pharmanonote").innerHTML = 'Please complete this order the patient pick up the medication';
						if(response.order_status == "New"){
							document.getElementById("setprespbutton").disabled = false;
						}else if(response.order_status == "Completed"){
							//document.getElementById("setcompletepikcupbutton").disabled = true;
							document.getElementById("pharmanonote").innerHTML = 'Order completed.';
						}
					}else{
							hide("setcompletepikcupbutton");
						show("setprespbutton");
						if(response.order_status == "New"){
							document.getElementById("setprespbutton").disabled = false;
						}else if(response.delivery_completed == "Delivering"){
							document.getElementById("setprespbutton").disabled = true;
						}else if(response.delivery_completed == "Completed"){
							document.getElementById("setprespbutton").disabled = true;
						}else{
							document.getElementById("setprespbutton").disabled = false;
						}
						var cartitemdata = orderdata.cartitem
						console.log(cartitemdata);
						for (let i = 0; i < cartitemdata.length; i++) {
							var quanitity = parseInt(cartitemdata[i].quantity);
							document.getElementById("storemedviews").innerHTML += '<li class="collection-item">'+cartitemdata[i].product_name+' <p>Quantity '+quanitity+'</p></li>';
						}
						if(response.order_status == "Ready for pickup"){
							document.getElementById("setprespbutton").disabled = true;
						}else if(response.order_status == "Completed"){
							document.getElementById("setprespbutton").disabled = true;
						}else{
							document.getElementById("setprespbutton").disabled = false;
						}
					}
				}else{
					show("pharmaorder");
					show("setprespbutton");
					hide("storeoder");
					hide("setcompletepikcupbutton");
					var patient_profile = response.patient_profile;
					var doctor_profile = response.doctor_profile;
					var prescriptions = JSON.parse(response.prescription);
					console.log(prescriptions);
					for (let i = 0; i < prescriptions.length; i++) {
						document.getElementById("vendormedviews").innerHTML += '<li class="collection-item">'+prescriptions[i].name+' <p>Doctor Remarks '+prescriptions[i].remark+'</p></li>';
					}
					document.getElementById("signedprescription").innerHTML = '<a class="pink-text strong" href="'+response.signedpres+'">View signed prescription</a>';
					var doctor_profile = response.doctor_profile;
					document.getElementById("vendorpatientpicture").src = patient_profile.profile_img;
					document.getElementById("vendordocpicture").src = doctor_profile.profile_img;
					document.getElementById("vendorpatientic").innerHTML = patient_profile.ic_number;
					document.getElementById("vendorpatientname").innerHTML = patient_profile.full_name;
					document.getElementById("vendordocname").innerHTML = doctor_profile.full_name;
					if(response.delivery_completed == "Ready for pickup"){
						document.getElementById("setprespbutton").disabled = true;
					}else if(response.delivery_completed == "Delivering"){
						document.getElementById("setprespbutton").disabled = true;
					}else if(response.delivery_completed == "Completed"){
						document.getElementById("setprespbutton").disabled = true;
					}else if(response.delivery_completed == "accepted"){
						document.getElementById("setprespbutton").disabled = true;
					}else if(response.delivery_completed == "new"){
						document.getElementById("setprespbutton").disabled = true;
						document.getElementById("pharmanonote").innerHTML = "Waiting for  payment";
					}else{
						document.getElementById("setprespbutton").disabled = false;
					}
					
					if(response.paid == "false"){
						document.getElementById("setprespbutton").disabled = true;
						document.getElementById("pharmanonote").innerHTML = "Waiting for  payment";
					}
				}
				
				
        } else if (job_order.status == 404) {
            alert("Fail to connect to our server");
        } else {
            alert("Fail to connect to our server");
        }
    }
    job_order.send(dataTopost);
}