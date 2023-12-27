//Response
function renderTo(target, content){
	 document.getElementById(target).innerHTML = content;
}
function splashMessage(message){
	 document.getElementById("splashmessage").innerHTML = message;
}
function getValue(id){
	var val = document.getElementById(id).value;
	var val = val.trimLeft();
	var val = val.trimRight();
	var value = encodeURI(val);
	var value = encodeURIComponent(value);
	return value;
}
function getInnerValue(id){
	var val = document.getElementById(id).innerHTML;
	var value = encodeURI(val);
	var value = encodeURIComponent(value);
	return value;
}

function cleanOutput(val){
	var value = decodeURI(val);
	var value = decodeURIComponent(value);
	return value;
}
//Hide an element shorthand
function hide(elementid) {
    document.getElementById(elementid).style.display = "none";
}
//Insta response shortcut
function instaResponse(message){
	showLoading();
	loadingResponse(message);
}
//Show an element shorthand
function show(elementid){
    document.getElementById(elementid).style.display = "block";
}
//Switch visibility shorthand
function swithvisiblity(elementid){
	var el = document.getElementById(elementid).style.display;
	if(el == "block"){
		el = "none";
	}else{
		el = "block";
	}
}
//Add a preloader to a div when requesting data
function addPreloader(target){
	document.getElementById(target).innerHTML ='<br><center><div class="preloader-wrapper small active"><div class="spinner-layer spinner-green-only"><div class="circle-clipper left"><div class="circle"></div></div><div class="gap-patch"><div class="circle"></div></div><div class="circle-clipper right"><div class="circle"></div></div></div></div></center><br/>';
}
//Form processor
function getFormData(formId, type, auth){
    var form = document.getElementById(formId).elements;
    var target = document.getElementById(formId).getAttribute("entry-point");
    var data = '';
	var postdata = '';
    for (i = 0; i < form.length; i++) {
        var key = form[i].getAttribute("name");
        var identifer = form[i].getAttribute("id");
        var type = form[i].getAttribute("type");
        var value = document.getElementById(identifer).value;
        if (i == 0) {
            data += '{"api":"'+app.apiVersion+'",';
			if(auth == null){
				postdata += 'api='+app.apiVersion+'&'+target+'=true';
			}else{
				postdata += 'api='+app.apiVersion+'&auth_token='+authUser.login_token+'&'+target+'=true';
			}
			
        }
        if (type == "submit") {
        } else {
            data += '"' + key + '":"' + value + '"';
			postdata += '&' + key + '=' + value + '';

        }
        var buildLength = form.length - 1;
        if (buildLength > i) {
            data += ',';
        }
        if (buildLength == i) {
            data += '}';
        }
    }
	if(type == "json"){
		return data;
	}else{
		console.log(postdata);
		return postdata;
		
	}
}
//Compress an image
function compressImg(imageid){
	var source_img = document.getElementById(imageid);
	var size = source_img.src.length * 0.75;
	var	imgsize	= size / Math.pow(1024,2)
	var quality;
	if(imgsize > 4){
		var quality =  5;
	}else if(imgsize > 1){
		var quality =  25;
	}else if(imgsize < 1){
		var quality =  80;
	}
	output_format = 'jpg'; 
	var data = jic.compress(source_img,quality,output_format).src;
	return data;
}
var pdfTarget;
function pdfToBase(element, target, tochange, dptarget){
	var file1 = element.files[0];
	var reader = new FileReader();
	reader.onloadend = function(){
		
		let results = reader.result;
		if(results.includes("application/pdf")){
			showLoading();
			var dataTopost = "api=1&auth_token=" + authUser.login_token + "&serverTarget="+dptarget+"&uploadSelective="+reader.result;
			var accounts_verification = new XMLHttpRequest();
			accounts_verification.open("POST", serverUrl, true);
			accounts_verification.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
			accounts_verification.onload = function() {
				if (accounts_verification.status == 200) {
					var json = accounts_verification.responseText;
					var response = JSON.parse(json);
						document.getElementById(target).value = response.file;
						document.getElementById(tochange).src = 'img/certok.png';
						loadingResponse(response.status_message);
				} else if (accounts_verification.status == 404) {
					alert("Fail to connect to our server");
				} else {
					alert("Fail to connect to our server");
				}
			}
			accounts_verification.send(dataTopost);
		}else{
			instaResponse("PDF File only");
		}
		
	}
	reader.readAsDataURL(file1);
}