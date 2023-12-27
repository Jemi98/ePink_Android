//Listing the list of elab
var selectedElabcategory = "";
var selectedElabSubcategory = "";
function initeLabSub(parents){
	carecurrentlyviewingcat = parents;
	document.getElementById("elabsubcategory").innerHTML = "";
	for (let i = 0; i < alllabcategory.length; i++) {
		if(alllabcategory[i].name == parents){
			var sub = alllabcategory[i].sub;
			for (let j = 0; j < sub.length; j++) {
				document.getElementById("elabsubcategory").innerHTML += '<a href="#!" onclick="setElabSubcate(\''+sub[j].name+'\')" class="ebadge pink white-text">'+sub[j].name+'</a> ';
			}
		}
	}
}

function setElabSubcate(cat){
	selectedElabSubcategory = cat;
	document.getElementById("selectedcateelab").innerHTML = '<p class="strong pink-text">Category: '+cat+' <span class="right" onclick="show(\'elabcategory\')"><i class="material-icons">filter_list</i></span></p>';
	openpage("elabservice");
}
function setElabcate(cat){
	selectedElabcategory = cat;
	initeLabSub(selectedElabcategory);
	document.getElementById("selectedcateelab").innerHTML = '<p class="strong pink-text">Category: '+cat+' <span class="right" onclick="show(\'elabcategory\')"><i class="material-icons">filter_list</i></span></p>';
	openpage("elabservice");
}
function initElab(){
	hide("elabcategory");
	if(selectedElabSubcategory == ""){
		selectedElabSubcategory = "Not Set";
	}
	var dataTopost = "api=1&auth_token=" + authUser.login_token + "&viewallelab_service="+selectedElabcategory+"&sub="+selectedElabSubcategory;
    var elab_service = new XMLHttpRequest();
    elab_service.open("POST", serverUrl, true);
    elab_service.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    elab_service.onload = function() {
        if (elab_service.status == 200) {
            var json = elab_service.responseText;
            var response = JSON.parse(json);
			if(response.status == null){
			var i;
				document.getElementById("listofelabservices").innerHTML ="";
				for (i = 0; i < response.length; i++) {
					document.getElementById("listofelabservices").innerHTML += '<div class="col s6"><div class="card" style="border-radius: 10px"><div class="card-image " ><img class="lazy" id="res'+i+'" src="'+response[i].image+'" data-src="'+response[i].image+'" alt="Menu Img" style="border-top-left-radius: 10px; border-top-right-radius: 10px;" onclick="viewElabservice('+response[i].id+')" loading="lazy"></div><div class="card-content" style="padding: 10px"><p><span class="strong">'+response[i].name+'</span><p class="small">'+response[i].description+'</p><span class="right"></span></p><p><span style="font-size: 12px">Price: RM'+response[i].price+'</span></p></div></div></div>';
				}
			}else{
				
				document.getElementById("listofelabservices").innerHTML ='<center><i class="material-icons pink-text medium">priority_high</i><p>No service available</p></center>';
			}
        } else if (elab_service.status == 404) {
            alert("Fail to connect to our server");
        } else {
            alert("Fail to connect to our server");
        }
    }
    elab_service.send(dataTopost);
}
//View specific service
function viewElabservice(id){
	activePage = 'viewinglabservice';
	showLoading();
	var dataTopost = "api=1&auth_token=" + authUser.login_token + "&viewthisElab="+id;
    var elab_service = new XMLHttpRequest();
    elab_service.open("POST", serverUrl, true);
    elab_service.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    elab_service.onload = function() {
        if (elab_service.status == 200) {
            var json = elab_service.responseText;
            var response = JSON.parse(json);
			document.getElementById("elabviewimg").src = response.image;
			document.getElementById("elabviewname").innerHTML = response.name;
			document.getElementById("elabviewprice").innerHTML = 'RM'+response.price;
			document.getElementById("elabrequestpricehelper").innerHTML = response.price;
			document.getElementById("elabviewdescriptionid").value = response.id;
			document.getElementById("elabviewdescription").innerHTML = response.description;
            closeLoading();
			show("viewelabservice");
        } else if (elab_service.status == 404) {
            alert("Fail to connect to our server");
        } else {
            alert("Fail to connect to our server");
        }
    }
    elab_service.send(dataTopost);
}

//Make Elab REquest
function declineElabRequest(){
	hide("elabconfirmation");
	show("viewelabservice");
}
function elabRequestconfirmation(){
	show("confirmingelab");
	hide("elabstatussss");
	hide("viewelabservice");
	show("elabconfirmation");
	
	
	var elabprice = parseFloat(document.getElementById("elabrequestpricehelper").innerHTML);
	document.getElementById("elabchargeconfirmation").innerHTML = elabprice;
}
function insertToelab_request(){
	hide("closeSuccess");
	hide("closeFail");
    showLoading();
    var service_id = document.getElementById("elabviewdescriptionid").value;
    var service_name = document.getElementById("elabviewname").innerHTML;
    var elabdate = document.getElementById("elabrequestdate").value;
    var elabtime = document.getElementById("elabrequesttime").value;
    var elabaddress = document.getElementById("elabrequestaddress").value;
    var elabprice = parseFloat(document.getElementById("elabrequestpricehelper").innerHTML);
	
	var sample_collection_date = elabdate+' '+elabtime;
	
	if(authUser.wallet >= elabprice){
		var dataTopost = "api=1&auth_token=" + authUser.login_token + "&submitelab_request=true&service_id="+service_id+"&service_name="+service_name+"&sample_collection_date="+sample_collection_date+"&address="+elabaddress+"&price="+elabprice;
		var elab_request = new XMLHttpRequest();
		elab_request.open("POST", serverUrl, true);
		elab_request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
		elab_request.onload = function() {
			if (elab_request.status == 200) {
				var json = elab_request.responseText;
				var response = JSON.parse(json);
				hide("confirmingelab");
				show("elabstatussss");
				document.getElementById("elabconfirmsstatus").innerHTML = response.status;
				document.getElementById("elabconfirmmessage").innerHTML = response.message;
				if(response.status == "fail"){
					hide("closeSuccess");
					show("closeFail");
				}else{
					show("closeSuccess");
					hide("closeFail");
				}
				closeLoading();
			} else if (elab_request.status == 404) {
				alert("Fail to connect to our server");
			} else {
				alert("Fail to connect to our server");
			}
		}
		elab_request.send(dataTopost);
	}else{
		hide("confirmingelab");
		show("elabstatussss");
		hide("closeSuccess");
		show("closeFail");
		document.getElementById("elabconfirmsstatus").innerHTML = response.status;
		document.getElementById("elabconfirmmessage").innerHTML = response.message;
		closeLoaiding();
	}
}

function initElabResult(){
	var dataTopost = "api=1&auth_token=" + authUser.login_token + "&viewallelab_request=true";
    var elab_request = new XMLHttpRequest();
    elab_request.open("POST", serverUrl, true);
    elab_request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    elab_request.onload = function() {
        if (elab_request.status == 200) {
            var json = elab_request.responseText;
            var response = JSON.parse(json);
			var i;
			document.getElementById("elabresultlisting").innerHTML = "";
				for (i = 0; i < response.length; i++) {
					document.getElementById("elabresultlisting").innerHTML += '<li class="collection-item" onclick="openpage(\'viewlabreport\', '+response[i].id+')"><span class="strong">'+response[i].service_name+'</span><p>'+response[i].sample_collection_date+'<span class="right">'+response[i].request_status+'</span></p></li>';
				}
            loadingResponse(response.message);
        } else if (elab_request.status == 404) {
            alert("Fail to connect to our server");
        } else {
            alert("Fail to connect to our server");
        }
    }
    elab_request.send(dataTopost);
}

function viewLabResult(id){
	var dataTopost = "api=1&auth_token=" + authUser.login_token + "&viewThiselab_request="+id;
    var elab_request = new XMLHttpRequest();
    elab_request.open("POST", serverUrl, true);
    elab_request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    elab_request.onload = function() {
        if (elab_request.status == 200) {
            var json = elab_request.responseText;
            var response = JSON.parse(json);
			document.getElementById("result_lab_test_name").innerHTML = response.service_name;
			
			document.getElementById("sample_collection_address").innerHTML = response.request_address;
			document.getElementById("result_lab_test_collection").innerHTML = response.sample_collection_date;
			document.getElementById("result_lab_test_review").innerHTML = response.request_report;
			if(response.attachments == ""){
				document.getElementById("labfile").innerHTML = 'Lab result has not been uploaded';
			}else{
				document.getElementById("labfile").innerHTML = '<a href="'+response.attachments+'">Download</a>';
			}
			
			console.log("<p>'+response.requester+'</p><p>'+response.service_id+'</p><p>'+response.service_name+'</p><p>'+response.sample_collection_date+'</p><p>'+response.request_status+'</p><p>'+response.request_report+'</p><p>'+response.request_address+'</p>");
            loadingResponse(response.message);
        } else if (elab_request.status == 404) {
            alert("Fail to connect to our server");
        } else {
            alert("Fail to connect to our server");
        }
    }
    elab_request.send(dataTopost);
}

