var backFromproduct = "";
var pharmastoreid;
var currentPharmacategory;
function initPharmainfo(id){
	var dataTopost = "api=1&auth_token=" + authUser.login_token + "&pharmainformation="+id;
    var users = new XMLHttpRequest();
    users.open("POST", serverUrl, true);
    users.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    users.onload = function() {
        if (users.status == 200) {
            var json = users.responseText;
            var response = JSON.parse(json);
			document.getElementById("storehelper").innerHTML = 'Viewing product from '+response.vendor_name;
			var pharmaCategory = JSON.parse(response.vendor_category);
			currentPharmacategory = pharmaCategory;
			document.getElementById("productfilters").innerHTML = '';
			for (let i = 0; i < pharmaCategory.length; i++) {
				document.getElementById("productfilters").innerHTML += '<button class="btn btn-block pink white-text ebutton" onclick="applyFilter(\''+pharmaCategory[i].name+'\')">'+pharmaCategory[i].name+'</button><br/>';
			}
        } else if (users.status == 404) {
            alert("Fail to connect to our server");
        } else {
            alert("Fail to connect to our server");
        }
    }
    users.send(dataTopost);
}
function addtocartPublic(id){
	
}

function pharmaaddSub(sub){
	showLoading();
	localStorage.setItem("filter_sub", sub);
	initHomepage();
	setTimeout(function(){ closeLoading(); }, 2000);
	
}
function openFilter(types){
	activePage = "filterwindow";
	if(types == "doctors"){
		show("doctorsfilter");
		hide("productfilters");
		document.getElementById("filtercategory").innerHTML = 'Filter';
	}else{
		show("productfilters");
		hide("doctorsfilter");
		document.getElementById("filtercategory").innerHTML = 'Select Category';
	}
	show("filterwindow");
}

function applyFilter(item){
	localStorage.setItem("filter", item);
	initHomepage();
	console.log(currentPharmacategory);
	for (let i = 0; i < currentPharmacategory.length; i++) {
		if(currentPharmacategory[i].name == item){
			var pharmaSubcategory = currentPharmacategory[i].sub;
			document.getElementById("pharmasubcategory").innerHTML = '';
			var plength = pharmaSubcategory.length;
			if(plength > 0){
				show("showsub");
			}else if(plength == 0){
				hide("showsub");
			}
			
			if(plength > 5){
				plength = 5;
			}
			
			for (let j = 0; j < plength; j++) {
				document.getElementById("pharmasubcategory").innerHTML += '<span href="#!" onclick="pharmaaddSub(\''+pharmaSubcategory[j].name+'\')" class="pink-text" style="margin-right: 10px" >'+pharmaSubcategory[j].name+'</span>';
			}
		}
	}
	console.log(currentPharmacategory);
	hide("filterwindow");
}
function applyFiltermart(item){
	hide("filterwindow");
	localStorage.setItem("filter_mart", item);
	initHomepage();
}
function setSpeciality(itemtwo){
	
	localStorage.setItem("filter_sp_specialist", itemtwo);
	hide("specialitstfilter");
	openpage("mart");
}
function applyFiltersp(item, itemtwo){
	activePage = "filterwindow";
	if(item == "Doctor"){
		document.getElementById("consultationwith").innerHTML = item;
		document.getElementById("hchelper").innerHTML = 'Viewing '+item+' on ePink platform';
		localStorage.setItem("filter_sp", item);
		hide("filterwindow");
		show("specialitstfilter");
		activePage = "specialitstfilter";
	}else{
		document.getElementById("consultationwith").innerHTML = item;
		document.getElementById("hchelper").innerHTML = 'Viewing '+item+' on ePink platform';
		localStorage.setItem("filter_sp", item);
		localStorage.setItem("filter_sp_specialist", itemtwo);
		openpage("mart");
		hide("filterwindow");
	}
	
}


function searchFor(element){
	var searchTerm = element.value;
	if(searchTerm.length > 2){	
		show("homepagepreloader");
		show("homepageproducts");
		var filter = localStorage.getItem("filter");
		if(filter == null){
			filter == "All";
		}
		
		
		var category = localStorage.getItem("filter");
		if(category != null || category !== undefined){	
			hide("homepagecategoryselection");
			M.AutoInit();
			var dataTopost = "api="+app.apiVersion+"&auth_token="+authUser.login_token+"&gethomepage="+category+"&lat="+appLat+"&lng="+appLng+"&pharmaid="+gpaid+"&search="+searchTerm;
			var xhr = new XMLHttpRequest();
			xhr.open("POST", serverUrl, true);
			xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
			xhr.onload = function() {
				if (xhr.status == 200) {
					var json = xhr.responseText;
					var response = JSON.parse(json);
					document.getElementById("homepagepreloader").innerHTML = '';
			
					document.getElementById("homepageproducts").innerHTML = '<br><center><div class="preloader-wrapper small active"><div class="spinner-layer spinner-pink-only"><div class="circle-clipper left"><div class="circle"></div></div><div class="gap-patch"><div class="circle"></div></div><div class="circle-clipper right"><div class="circle"></div></div></div></div></center>';
					show("homepageproducts");
					if(response.status != "fail"){
						
						show("homepagepreloader");
						show("homepageproducts");
						document.getElementById("homepageproducts").innerHTML = "";
					
						var i;
						var paid;
						for (i = 0; i < response.length; i++) {
							var kmg = response[i].distance;
							var kms = parseFloat(kmg).toFixed(0);
							if(response[i].vendor_halal == "Halal"){
								var halal = '<span class="new badge pink halal" data-badge-caption="Halal"></span>';
							}else if(response[i].vendor_halal == "Non-Halal"){
								var halal = '<span class="new badge pink halal" data-badge-caption="Non Halal"></span>';
							}else{
								var halal = '';
							}
							if(response[i].stock > 0){
								if(isPc == true){
									var clicked = 'onclick="openProductPc('+response[i].id+')"';
								}else{
									var clicked = 'onclick="openProduct('+response[i].id+')"';
								}
							}else{
								var clicked = 'onclick="vendorClosed()"';
							}
							if(response[i].require_prescription == "true"){
								var rp = '<i class="material-icons">assignment</i>';
							}else{
								var rp = '';
							}
							
							document.getElementById("homepageproducts").innerHTML += '<div class="col s6 l3" style="padding-left: 0px; min-height: 100% !important;"><div class="card" style="border-radius: 10px"><div class="card-image " ><img class="lazy" id="res'+i+'" src="'+response[i].picture+'" data-src="" alt="Menu Img" style="border-top-left-radius: 10px; border-top-right-radius: 10px;" '+clicked+' loading="lazy">'+halal+'</div><div class="card-content" style="padding: 10px"><p><span class="strong" '+clicked+'>'+response[i].name+'</span><span class="right">'+rp+'</span></p><p><span style="font-size: 12px">Price: RM'+response[i].price+'</span></p></div></div></div>';
							document.getElementById("storehelper").innerHTML = 'Viewing product from '+response[i].pharmaname;
							pharmastoreid = response[i].owner;
							paid = response[i].owner;
							
							gpaid = paid;
						}
						
						//resSrc(i);					
					}else{

							document.getElementById("homepageproducts").innerHTML = '<br/><center class="grey-text"><i class="large material-icons pink-text ">report</i><br/><p class="">Sorry we couldnt find product in this pharmacy.</p></center>';
					}
					closeLoading();
					
				} else if (xhr.status == 404) {
					alert("Fail to connect to our server");
				} else {
					alert("Fail to connect to our server");
				}
			}
			xhr.send(dataTopost);
		}else{
			//hide("homepagepreloader");
			//hide("homepageproducts");
			//show("homepagecategoryselection");
			//document.getElementById("homepagecategoryselection").innerHTML = 'sasa';
		}
	}
}
var gpaid = 0;
var homepageLastid = 0;
function initHomepage(category){
	document.getElementById("homepageproducts").innerHTML = "";
	show("homepagepreloader");
	show("homepageproducts");
	var filter = localStorage.getItem("filter");
	var sub = localStorage.getItem("filter_sub");
	if(filter == null){
		filter == "All";
	}
	initPharmainfo(gpaid);
    var category = localStorage.getItem("filter");
    if(category != null || category !== undefined){	
		hide("homepagecategoryselection");
		M.AutoInit();
		
		
		document.getElementById("homepagepreloader").innerHTML = '<br><center><div class="preloader-wrapper small active"><div class="spinner-layer spinner-pink-only"><div class="circle-clipper left"><div class="circle"></div></div><div class="gap-patch"><div class="circle"></div></div><div class="circle-clipper right"><div class="circle"></div></div></div></div></center>';
		var dataTopost = "api="+app.apiVersion+"&auth_token="+authUser.login_token+"&gethomepage="+category+"&lat="+appLat+"&lng="+appLng+"&pharmaid="+gpaid+"&sub="+sub;
		var xhr = new XMLHttpRequest();
		xhr.open("POST", serverUrl, true);
		xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
		xhr.onload = function() {
			if (xhr.status == 200) {
				var json = xhr.responseText;
				var response = JSON.parse(json);
				
				show("homepageproducts");
				if(response.status != "fail"){
					show("homepagepreloader");
					show("homepageproducts");
					document.getElementById("homepagepreloader").innerHTML = '';
					document.getElementById("homepageproducts").innerHTML = "";
				
					var i;
					var paid;
					for (i = 0; i < response.length; i++) {
						var kmg = response[i].distance;
						var kms = parseFloat(kmg).toFixed(0);
						if(response[i].vendor_halal == "Halal"){
							var halal = '<span class="new badge pink halal" data-badge-caption="Halal"></span>';
						}else if(response[i].vendor_halal == "Non-Halal"){
							var halal = '<span class="new badge pink halal" data-badge-caption="Non Halal"></span>';
						}else{
							var halal = '';
						}
						
						if(response[i].stock > 0){
							if(isPc == true){
								var clicked = 'onclick="openpage(\'viewproductpc\', '+response[i].id+')"';
							}else{
								var clicked = 'onclick="openProduct('+response[i].id+')"';
							}
						
						}else{
							var clicked = 'onclick="vendorClosed()"';
						}
						if(response[i].require_prescription == "true"){
							var rp = '<i class="material-icons">assignment</i>';
						}else{
							var rp = '';
						}
					
						document.getElementById("homepageproducts").innerHTML += '<div class="col s6 l3" style="padding-left: 0px; margin-bottom: 15px;"><div class="card" style="border-radius: 10px; min-height: 100% !important; margin-bottom: 10px"><div class="card-image " ><img class="lazy" id="res'+i+'" src="'+response[i].picture+'" data-src="'+response[i].picture+'" alt="Menu Img" style="border-top-left-radius: 10px; border-top-right-radius: 10px;" '+clicked+' loading="lazy">'+halal+'</div><div class="card-content" style="padding: 10px"><p><span class="strong" '+clicked+'>'+response[i].name+'</span><span class="right">'+rp+'</span></p><p><span style="font-size: 12px">Price: RM'+response[i].price+'</span></p></div></div></div>';
						document.getElementById("storehelper").innerHTML = 'Viewing product from '+response[i].pharmaname;
						pharmastoreid = response[i].owner;
						paid = response[i].owner;
					
						gpaid = paid;
						homepageLastid = response[i].id;
					}
					
					//resSrc(i);	
					
				}else{

						document.getElementById("homepagepreloader").innerHTML = '<br/><center class="grey-text"><i class="large material-icons pink-text ">report</i><br/><p class="">No product</p></center>';
				}
				closeLoading();
				
			} else if (xhr.status == 404) {
				alert("Fail to connect to our server");
			} else {
				alert("Fail to connect to our server");
			}
		}
		xhr.send(dataTopost);
    }else{
		//hide("homepagepreloader");
		//hide("homepageproducts");
		//show("homepagecategoryselection");
		//document.getElementById("homepagecategoryselection").innerHTML = 'sasa';
    }
}
function vendorClosed(){
	showLoading();
	loadingResponse("No stock");
}
function clearCatergory(){
	localStorage.removeItem("category");
	initHomepage();

}
function setCategory(pick){
	localStorage.setItem("category", pick);
	initHomepage(pick);
}
function previewPrice(){
	console.log(customeraddon);
	if(customeraddon == undefined || customeraddon == null){
		var amounttoorder = document.getElementById("productorderamounts").value;
		var productPrice = document.getElementById("viewproductprice").innerHTML;
		var initia = amounttoorder * productPrice;
		var i;
		document.getElementById("totalpricepreview").innerHTML = initia.toFixed(2);
	}else{
		var amounttoorder = parseFloat(document.getElementById("productorderamounts").value);
		var productPrice = parseFloat(document.getElementById("viewproductprice").innerHTML);
		var initia = amounttoorder * productPrice;

		var addonprice = 0.00;
		var i;
		for (i = 0; i < customeraddon.length; i++) {
		  var lol = document.getElementById(i).getAttribute("checked");
		  if(lol == "true"){
			  customeraddon[i].checked = true;
			  var addonpricesss = parseFloat(customeraddon[i].price);
			  var addonpricesss = addonpricesss * amounttoorder;
			  initia = parseFloat(initia) + parseFloat(addonpricesss);

		  }else{
			  customeraddon[i].checked = false;
			  
		  }
		}
		
		var finalprice = parseFloat(initia).toFixed(2);
		document.getElementById("totalpricepreview").innerHTML = finalprice;
	}

}
function openlandingVendor(id, vname, vlogo, type){
	fromHomepage = true;
	//activePage = "viewvendor";
	if(type == "restaurant"){
		openpage("homepage");
		activePage = "viewrestaurant";
		document.getElementById("martidentifier").innerHTML = "Menus";
		document.getElementById("martidentifierhelper").innerHTML = "Available Menus";
		var noprods = 'This restaurant havent add any product';
	}else{
		openpage("mart");
		activePage = "viewmart";
		document.getElementById("martidentifier").innerHTML = "Products";
		document.getElementById("martidentifierhelper").innerHTML = "Available Products";
		var noprods = 'This mart havent add any product';
	}
	document.getElementById("vendor_name").innerHTML = vname;
	document.getElementById("vendor_logo").src = vlogo;
	var dataTopost = "api=1&auth_token=" + authUser.login_token + "&viewvendorproduct="+id;
    var products = new XMLHttpRequest();
    products.open("POST", serverUrl, true);
    products.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    products.onload = function() {
        if (products.status == 200) {
            var json = products.responseText;
            var response = JSON.parse(json);
			if(response.status == null){
				var i;
				document.getElementById("vendor_product").innerHTML ="";
				for (i = 0; i < response.length; i++) {
					document.getElementById("vendor_product").innerHTML += '<li class="collection-item" style="padding: 0px" onclick="openProduct('+response[i].id+')"><div class="row" style="margin-bottom: 0px; margin-top: 5px;"><div class="col s4" style="margin-left: -5px; margin-top: 5px; padding-bottom: 5px;"><img id="menuimg'+i+'"data-src="'+response[i].picture+'" src="'+response[i].picture+'" style="border-radius: 5%;" class="responsive-img" loading="lazy"></div><div class="col s8" style="    margin-top: 5px;"><p class="flow-text" style="margin-top: 0px;"><b>'+response[i].name+'</b></p><p style="">RM'+response[i].price+'</p></div></div></li>';
				}
			}else{
				document.getElementById("vendor_product").innerHTML = '<li class="collection-item"><p>'+noprods+'</p></li>';
			}
			//allSrc(response.length);
            closeLoading();
			
        } else if (products.status == 404) {
            alert("Fail to connect to our server");
        } else {
            alert("Fail to connect to our server");
        }
    }
    products.send(dataTopost);
	show("vendor");
	console.log(fromHomepage);
}
function openVendor(id, vname, vlogo, type){
	document.getElementById("vendor_product").innerHTML = "";
	fromHomepage = false;
	//activePage = "viewvendor";
	if(type == "restaurant"){
		activePage = "viewrestaurant";
		document.getElementById("martidentifier").innerHTML = "Menus";
		document.getElementById("martidentifierhelper").innerHTML = "Available Menus";
		var noprods = 'This restaurant havent add any product';
	}else{
		activePage = "viewmart";
		document.getElementById("martidentifier").innerHTML = "Products";
		document.getElementById("martidentifierhelper").innerHTML = "Available Products";
		var noprods = 'This mart havent add any product';
	}
	document.getElementById("vendor_name").innerHTML = vname;
	document.getElementById("vendor_logo").src = vlogo;
	var dataTopost = "api=1&auth_token=" + authUser.login_token + "&viewvendorproduct="+id;
    var products = new XMLHttpRequest();
    products.open("POST", serverUrl, true);
    products.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    products.onload = function() {
        if (products.status == 200) {
            var json = products.responseText;
            var response = JSON.parse(json);
			if(response.status == null){
				var i;
				document.getElementById("vendor_product").innerHTML ="";
				for (i = 0; i < response.length; i++) {
					document.getElementById("vendor_product").innerHTML += '<li class="collection-item" style="padding: 0px" onclick="openProduct('+response[i].id+')"><div class="row" style="margin-bottom: 0px; margin-top: 5px;"><div class="col s4" style="margin-left: -5px; margin-top: 5px; padding-bottom: 5px;"><img id="menuimg'+i+'"data-src="'+response[i].picture+'" src="'+response[i].picture+'" style="border-radius: 5%;" class="responsive-img" loading="lazy"></div><div class="col s8" style="    margin-top: 5px;"><p class="flow-text" style="margin-top: 0px;"><b>'+response[i].name+'</b></p><p style="">RM'+response[i].price+'</p></div></div></li>';
				}
			}else{
				document.getElementById("vendor_product").innerHTML = '<li class="collection-item"><p>'+noprods+'</p></li>';
			}
			//allSrc(response.length);
            closeLoading();
			
        } else if (products.status == 404) {
            alert("Fail to connect to our server");
        } else {
            alert("Fail to connect to our server");
        }
    }
    products.send(dataTopost);
	show("vendor");
}
function resSrc(imglength) {
	var i;
	for (i = 0; i < imglength; i++){
		var idname = "res"+i;
		var originalimage = document.getElementById("res"+i).getAttribute('data-src');
		changeImage(idname, originalimage);
	}
}
function allSrc(imglength) {
	var i;
	for (i = 0; i < imglength; i++){
		var idname = "menuimg"+i;
		var originalimage = document.getElementById(idname).getAttribute('data-src');
		changeImage(idname, originalimage);
	}
}

function changeImage(id, imgfile){
	setTimeout(function(){ document.getElementById(id).src = imgfile; }, 500);
}
function closeVendor(){
	console.log(fromHomepage);
	if(activePage == "viewrestaurant"){
		hide("vendor");
		hide("mart");
		activePage = "homepage";
		if(fromHomepage == true){
			show("homepage");
		}else{
			show("homepage");
		}
	}else{
		hide("homepage");
		hide("vendor");
		show("mart");
		activePage = "mart";
		if(fromHomepage == true){
			show("mart");
		}else{
			show("mart");
		}
	}
	
}
function quantityController(operation){
	if(operation == "+"){
		var currentQuanity = parseInt(document.getElementById("productorderamounts").value);
		currentQuanity = currentQuanity + 1;
		document.getElementById("uiquantity").innerHTML = currentQuanity;
		document.getElementById("productorderamounts").value = currentQuanity;
		previewPrice();
	}else{
		var currentQuanity = parseInt(document.getElementById("productorderamounts").value);
		if(currentQuanity > 0){
			var currentQuanity = currentQuanity - 1;
			document.getElementById("uiquantity").innerHTML = currentQuanity;
			document.getElementById("productorderamounts").value = currentQuanity;
			previewPrice();
		}		
	}
}
function closeProduct(){
	if(backFromproduct == "viewrestaurant"){
		activePage = "viewrestaurant";
	}else{
		activePage = "viewmart";
	}
	show("homepage");
	hide("viewproduct");
}

function closeeditProduct(){
	if(backFromproduct == "viewrestaurant"){
		activePage = "viewrestaurant";
	}else{
		activePage = "viewmart";
	}
	show("homepage");
	hide("viewproduct");
}
var openedItemrequirepres;
function closeModal(){
	var elem = document.getElementById("cameramodal");
    var instance = M.Modal.getInstance(elem);
    instance.close();
}

function pcviewProductDescription(){
	show("pc-view-description");
	hide("pc-view-about");
	hide("pc-view-overview");
	hide("pc-view-side-effect");
	hide("pc-view-faq");
	hide("pc-view-precaution");
	hide("pc-view-quick-tips");
}
function pcviewProductAbout(){
	hide("pc-view-description");
	show("pc-view-about");
	hide("pc-view-overview");
	hide("pc-view-side-effect");
	hide("pc-view-faq");
	hide("pc-view-precaution");
	hide("pc-view-quick-tips");
}

function pcviewProductOverview(){
	hide("pc-view-description");
	hide("pc-view-about");
	show("pc-view-overview");
	hide("pc-view-side-effect");
	hide("pc-view-faq");
	hide("pc-view-precaution");
	hide("pc-view-quick-tips");
}

function pcviewProductSideEffect(){
	hide("pc-view-description");
	hide("pc-view-about");
	hide("pc-view-overview");
	show("pc-view-side-effect");
	hide("pc-view-faq");
	hide("pc-view-precaution");
	hide("pc-view-quick-tips");
}

function pcviewProductFaq(){
	hide("pc-view-description");
	hide("pc-view-about");
	hide("pc-view-overview");
	hide("pc-view-side-effect");
	show("pc-view-faq");
	hide("pc-view-precaution");
	hide("pc-view-quick-tips");
}

function pcviewProductFaq(){
	hide("pc-view-description");
	hide("pc-view-about");
	hide("pc-view-overview");
	hide("pc-view-side-effect");
	show("pc-view-faq");
	hide("pc-view-precaution");
	hide("pc-view-quick-tips");
}

function pcviewProductPrecaution(){
	hide("pc-view-description");
	hide("pc-view-about");
	hide("pc-view-overview");
	hide("pc-view-side-effect");
	hide("pc-view-faq");
	show("pc-view-precaution");
	hide("pc-view-quick-tips");
}

function pcviewProductTip(){
	hide("pc-view-description");
	hide("pc-view-about");
	hide("pc-view-overview");
	hide("pc-view-side-effect");
	hide("pc-view-faq");
	hide("pc-view-precaution");
	show("pc-view-quick-tips");
}

function viewProductDescription(){
	show("view-description");
	hide("view-about");
	hide("view-overview");
	hide("view-side-effect");
	hide("view-faq");
	hide("view-precaution");
	hide("view-quick-tips");
}
function viewProductAbout(){
	hide("view-description");
	show("view-about");
	hide("view-overview");
	hide("view-side-effect");
	hide("view-faq");
	hide("view-precaution");
	hide("view-quick-tips");
}

function viewProductOverview(){
	hide("view-description");
	hide("view-about");
	show("view-overview");
	hide("view-side-effect");
	hide("view-faq");
	hide("view-precaution");
	hide("view-quick-tips");
}

function viewProductSideEffect(){
	hide("view-description");
	hide("view-about");
	hide("view-overview");
	show("view-side-effect");
	hide("view-faq");
	hide("view-precaution");
	hide("view-quick-tips");
}

function viewProductFaq(){
	hide("view-description");
	hide("view-about");
	hide("view-overview");
	hide("view-side-effect");
	show("view-faq");
	hide("view-precaution");
	hide("view-quick-tips");
}

function viewProductFaq(){
	hide("view-description");
	hide("view-about");
	hide("view-overview");
	hide("view-side-effect");
	show("view-faq");
	hide("view-precaution");
	hide("view-quick-tips");
}

function viewProductPrecaution(){
	hide("view-description");
	hide("view-about");
	hide("view-overview");
	hide("view-side-effect");
	hide("view-faq");
	show("view-precaution");
	hide("view-quick-tips");
}

function viewProductTip(){
	hide("view-description");
	hide("view-about");
	hide("view-overview");
	hide("view-side-effect");
	hide("view-faq");
	hide("view-precaution");
	show("view-quick-tips");
}
function pcproductQuantityController(ops){
	if(ops == '+'){
		newProductQuantity++;
		var newPrice = newProductQuantity * parseFloat(newProductprice);
		document.getElementById("newProductprice").innerHTML = newPrice.toFixed(2);
		document.getElementById("pcnewProductQuantity").innerHTML = newProductQuantity;
	}else{
		
		if(newProductQuantity > 1){
			newProductQuantity--;
			var newPrice = newProductQuantity * parseFloat(newProductprice);
			document.getElementById("newProductprice").innerHTML = newPrice.toFixed(2);
			document.getElementById("pcnewProductQuantity").innerHTML = newProductQuantity;
		}else{
			newProductQuantity = 1;
			var newPrice = newProductQuantity * parseFloat(newProductprice);
			document.getElementById("newProductQuantity").innerHTML = newProductQuantity;
			document.getElementById("pcnewProductQuantity").innerHTML = newPrice.toFixed(2);
		}
		
	}
}
function productQuantityController(ops){
	if(ops == '+'){
		newProductQuantity++;
		var newPrice = newProductQuantity * parseFloat(newProductprice);
		document.getElementById("newProductprice").innerHTML = newPrice.toFixed(2);
		document.getElementById("newProductQuantity").innerHTML = newProductQuantity;
	}else{
		
		if(newProductQuantity > 1){
			newProductQuantity--;
			var newPrice = newProductQuantity * parseFloat(newProductprice);
			document.getElementById("newProductprice").innerHTML = newPrice.toFixed(2);
			document.getElementById("newProductQuantity").innerHTML = newProductQuantity;
		}else{
			newProductQuantity = 1;
			var newPrice = newProductQuantity * parseFloat(newProductprice);
			document.getElementById("newProductQuantity").innerHTML = newProductQuantity;
			document.getElementById("newProductprice").innerHTML = newPrice.toFixed(2);
		}
		
	}
}
var newProductprice = '0.00';
var newProductQuantity = 1;
var newProductId = 0;
var newProductOwner = 0;
var newRequirepress;
function openProductPc(id){
	
	showLoading();
	newProductQuantity = 1;
	document.getElementById("pcnewProductQuantity").innerHTML = 1;
	var dataTopost = "api=1&auth_token=" + authUser.login_token + "&viewThisproducts="+id;
    var products = new XMLHttpRequest();
    products.open("POST", serverUrl, true);
    products.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    products.onload = function() {
        if (products.status == 200) {
            var json = products.responseText;
            var response = JSON.parse(json);
			if(response.status == "Fail"){
				loadingResponse(response.message);
				hide("viewproductnew");
			}else{
				if(response.require_prescription == "true"){
					document.getElementById("pcproductreq").innerHTML = 'This product require prescription';
					newRequirepress = true;
				}else{
					document.getElementById("pcproductreq").innerHTML = 'This product does not require prescription';
					newRequirepress = false;
				}
				newProductId = response.id;
				newProductOwner = response.owner;
				newProductprice = response.price;
				//PC
				document.getElementById("pcproductname").innerHTML = response.name;
				document.getElementById("pccategoryproduct").innerHTML = response.category;
				document.getElementById("pcproductpic").src = response.picture;
				document.getElementById("pcprodprice").innerHTML = newProductprice;
				//PC end
				
				
				document.getElementById("newProductprice").innerHTML = newProductprice;
				
				document.getElementById("newProductname").innerHTML = response.name;
				
				document.getElementById("newproductimg").src = response.picture;
				
				document.getElementById("pc-view-description").innerHTML = response.description;
				document.getElementById("pc-view-about").innerHTML = response.about;
				document.getElementById("pc-view-overview").innerHTML = response.overview;
				document.getElementById("pc-view-side-effect").innerHTML = response.sideeffect;
				document.getElementById("pc-view-faq").innerHTML = response.faq;
				document.getElementById("pc-view-precaution").innerHTML = response.precaution;
				document.getElementById("pc-view-quick-tips").innerHTML = response.tip;
				viewProductDescription();
				//show("viewproductnew");
				//show("viewproductpc");
				closeLoading();
			}
        } else if (products.status == 404) {
            alert("Fail to connect to our server");
        } else {
            alert("Fail to connect to our server");
        }
    }
    products.send(dataTopost);
}
function openProduct(id){
	showLoading();
	newProductQuantity = 1;
	document.getElementById("newProductQuantity").innerHTML = 1;
	var dataTopost = "api=1&auth_token=" + authUser.login_token + "&viewThisproducts="+id;
    var products = new XMLHttpRequest();
    products.open("POST", serverUrl, true);
    products.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    products.onload = function() {
        if (products.status == 200) {
            var json = products.responseText;
            var response = JSON.parse(json);
			if(response.status == "Fail"){
				loadingResponse(response.message);
				hide("viewproductnew");
			}else{
				if(response.require_prescription == "true"){
					document.getElementById("product-require-press").innerHTML = 'This product require prescription';
					newRequirepress = true;
				}else{
					document.getElementById("product-require-press").innerHTML = 'This product does not require prescription';
					newRequirepress = false;
				}
				newProductId = response.id;
				newProductOwner = response.owner;
				newProductprice = response.price;
				document.getElementById("newProductprice").innerHTML = newProductprice;
				
				document.getElementById("newProductname").innerHTML = response.name;
				document.getElementById("newProductname").innerHTML = response.name;
				document.getElementById("newproductimg").src = response.picture;
				document.getElementById("view-description").innerHTML = response.description;
				document.getElementById("view-about").innerHTML = response.about;
				document.getElementById("view-overview").innerHTML = response.overview;
				document.getElementById("view-side-effect").innerHTML = response.sideeffect;
				document.getElementById("view-faq").innerHTML = response.faq;
				document.getElementById("view-precaution").innerHTML = response.precaution;
				document.getElementById("view-quick-tips").innerHTML = response.tip;
				document.getElementById("newProductname").innerHTML = response.name;
				
				if(response.description == "" || response.description == null){
					hide("mobileDescription");
					
				}else{
				
					document.getElementById("mobileDescription").style.display = "inline-block";
				}
				
				if(response.about == "" || response.description == null){
					hide("mobileAbout");
				}else{
					
					document.getElementById("mobileAbout").style.display = "inline-block";
				}
				if(response.overview == "" || response.overview == null){
					hide("mobileOverview");
				}else{
					
					document.getElementById("mobileOverview").style.display = "inline-block";
				}
				if(response.sideeffect == "" || response.sideeffect == null){
					hide("mobileSideEffect");
				}else{
		
					document.getElementById("mobileSideEffect").style.display = "inline-block";
				}
				if(response.precaution == "" || response.precaution == null){
					hide("mobilePrecau");
				}else{
					
					document.getElementById("mobilePrecau").style.display = "inline-block";
				}
				if(response.faq == "" || response.faq == null){
					hide("mobileFaq");
				}else{
				
					document.getElementById("mobileFaq").style.display = "inline-block";
				}
				if(response.tip == "" || response.tip == null){
					hide("mobileTip");
				}else{
			
					document.getElementById("mobileTip").style.display = "inline-block";
				}
				viewProductDescription();
				show("viewproductnew");
				closeLoading();
				window.scrollTo(0, document.body.scrollHeight);
			}
        } else if (products.status == 404) {
            alert("Fail to connect to our server");
        } else {
            alert("Fail to connect to our server");
        }
    }
    products.send(dataTopost);
}
function openProductOld(id ) {
	console.log("test product page");
	customeraddon = "";
	document.getElementById("uiquantity").innerHTML = "1";
	document.getElementById("productorderamounts").value = 1;
	showLoading();
	show("viewproduct");
	activePage = "viewingproduct";
	console.log(activePage);
	addPreloader("viewproductcontent");
	var backto = "Homepage";
    if(backto == "homepage"){
        document.getElementById("viewproductreturn").innerHTML = '<a id="navmenu" href="#" data-target="mobile-sa" class="sidenav-trigger white-text" onclick="openpage(\'homepage\')"><i class="material-icons">arrow_back</i></a><span id="lang_navigation_view_product" class="white-text" style="font-size: 20px">View Product</span>';
    } else if (backto == "myproducts") {
        document.getElementById("viewproductreturn").innerHTML = '<a id="navmenu" href="#" data-target="mobile-sa" class="sidenav-trigger white-text" onclick="openpage(\'homepage\')"><i class="material-icons">arrow_back</i></a><span id="lang_navigation_view_product" class="white-text" style="font-size: 20px">View Product</span>';
    }
    var dataTopost = "api=1&auth_token=" + authUser.login_token + "&viewThisproducts=" + id;
    var products = new XMLHttpRequest();
    products.open("POST", serverUrl, true);
    products.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    products.onload = function() {
        if (products.status == 200) {
            var json = products.responseText;
            var response = JSON.parse(json);
			if(response.sellerprofile.type == 1){
				backFromproduct = "viewrestaurant";
			}else{
				backFromproduct = "viewmart";
			}
			openedItemrequirepres = response.require_prescription;
            document.getElementById("view_product_owner").innerHTML = response.owner;
            document.getElementById("view_product_id").innerHTML = response.id;
            document.getElementById("product_lat").innerHTML = response.lat;
            document.getElementById("product_lng").innerHTML = response.lng;
            document.getElementById("viewproductcontent").innerHTML = "";
			
			 document.getElementById("productpicture").innerHTML = '<img id="" loading="lazy" src="'+response.picture+'" width="100%">';
			 document.getElementById("viewproductcontent").innerHTML = '<p id="resId" style="display: none">'+response.owner+'</p>';
			 if(response.require_prescription == "true"){
				 var prescriptionreq = "This Product Require Prescription<br>";
			 }else{
				 var prescriptionreq = "";
			 }
            document.getElementById("viewproductcontent").innerHTML += '<br><span class="pink-text strong">'+prescriptionreq+'</span><h5 class="strong pink-text" style="margin-top: 	2px">' + response.name + '</h5>';
            document.getElementById("viewproductcontent").innerHTML += '<p class="strong">Description </p><p>' + response.description + '</p>';
            document.getElementById("viewproductcontent").innerHTML += '<p class="strong">Price</p><p>RM<span id="viewproductprice">' + response.price + '</span></p>';
			previewPrice();
			console.log(response.addondata);
			if(response.addondata === null || response.addondata === undefined || response.addondata == ""){
				document.getElementById("productaddon").innerHTML = 'This product has no addon';
			}else{
				document.getElementById("productaddon").innerHTML = '<p class="strong">Add on</p>';
				var responseadondata = JSON.parse(response.addondata);
				customeraddon = responseadondata;
				var x 
				for (x = 0; x < responseadondata.length; x++) {
					document.getElementById("productaddon").innerHTML += '<p><label><input type="checkbox" id="'+x+'" class="filled-in" onclick="checkClicked(this)"/><span>'+responseadondata[x].price+' - '+responseadondata[x].name+'</span></label></p>';
				}
			}
            //document.getElementById("viewproductcontent").innerHTML = '<p>'+response.owner+'</p><p>'+response.name+'</p><p>'+response.description+'</p><p>'+response.delivery+'</p><p></p>';
            closeLoading();
			show("viewingcart");
			M.AutoInit();
        } else if (products.status == 404) {
            alert("Fail to connect to our server");
        } else {
            alert("Fail to connect to our server");
        }
    }
    products.send(dataTopost);
}


