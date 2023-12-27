function checkCategoryPoster(element){
	document.getElementById("product_category_final").value = element.value;
	var selectedCategory = element.value;
	var categories = JSON.parse(authUser.pharma_categories);
	for (let i = 0; i < categories.length; i++) {
		if(categories[i].name == selectedCategory){
			var subcategory = categories[i].sub;
			if(subcategory === undefined){
				document.getElementById("product_sub_category").innerHTML = '<option value="">No sub category set</option>';
			}else{
				document.getElementById("product_sub_category").innerHTML = '<option value="">Please select a sub category</option>';
				document.getElementById("product_sub_category").innerHTML = '';
				for (let j = 0; j < subcategory.length; j++) {
					document.getElementById("product_sub_category").innerHTML += '<option value="'+subcategory[j].name+'">'+subcategory[j].name+'</option>';
				}
			}
		}
	}
	
}

function initFormpose(){
	document.getElementById("product_category_final").value = firstcategory;
}
function initshopProduct(){
	if(authUser.pharma_categories == ""){
		document.getElementById("productcategorysorter").innerHTML = "Please go to category manager to add category"
		
	}else{
		var dataTopost = 'api=1&auth_token='+authUser.login_token+"&myproduct=true";
		var getprofile = new XMLHttpRequest();
		
		getprofile.open("POST", serverUrl, true);
		getprofile.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
			getprofile.onload = function() {
				if (getprofile.status == 200) {
					var json = getprofile.responseText;
					var response = JSON.parse(json);
					console.log(response);
					hide("myproductlist");
					for (let i = 0; i < response.length; i++) {
						var cate = response[i].name;
						var cate = cate.replace(/\s+/g, '-').toLowerCase();
						var targetId = "cat"+cate;
						var catitem = response[i].items;
						document.getElementById(targetId).innerHTML = '';
						if(catitem != null){
							for (let j = 0; j < catitem.length; j++) {
								document.getElementById(targetId).innerHTML += '<li class="collection-item" onclick="openpage(\'viewproductrestaurant\', '+catitem[j].id+', \'profile\')"><span class="strong">'+catitem[j].name+'</span><p>Stock: '+catitem[j].stock+'</p></li>';
							}
						}else{
							document.getElementById(targetId).innerHTML = '<li class="collection-item">No product in this category</li>';
						}
					}
				
				}else if (getprofile.status == 404) {
					alert("Fail to connect to our server");
				} else {
					alert("Fail to connect to our server");
				}
		}
		getprofile.send(dataTopost);
	}
}

function deleteFromproducts(){
	showLoading();
	var productid = document.getElementById("update_product_id").value;
	var dataTopost = "api=1&auth_token=" + authUser.login_token + "&deleteFromproducts=" + productid;
	var products = new XMLHttpRequest();
	products.open("POST", serverUrl, true);
	products.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
	products.onload = function() {
		if (products.status == 200) {
			var json = products.responseText;
			var response = JSON.parse(json);
			loadingResponse(response.message);
			hide("viewproductrestaurant");
			openpage("mysales");
		} else if (products.status == 404) {
			location.reload();
		} else {
			location.reload();
		}
	}
	products.send(dataTopost);
}

function updatePricechange(element){
	var initialPrice = parseFloat(element.value);
	var initialPrice = initialPrice.toFixed(2);
	var initialPrice = parseFloat(initialPrice);
	var margin = authUser.productmargin * initialPrice / 100; 
	margin = parseFloat(margin);
	var totalprice = initialPrice + margin;
	if(isNaN(totalprice)== false){
		 document.getElementById("updatepricerui2").innerHTML = totalprice.toFixed(2);
		 document.getElementById("update_product_price").value = margin.toFixed(2);
		 document.getElementById("totalclientprice").innerHTML = initialPrice.toFixed(2);
	}
}
function updateProductinfo() {
	showLoading();
	var product_id = document.getElementById("update_product_id").value;
	var quan = document.getElementById("update_product_quantity_ui").value;
	var product_name = document.getElementById("update_product_name").value;
	var product_description = document.getElementById("update_product_description").value;
	var originalprice = document.getElementById("update_product_price_ui").value;
	var vappyprice =  document.getElementById("updatepricerui2").innerHTML;
	var dataTopost = 'api=1&auth_token=' + authUser.login_token + "&updatemenu=" + product_id + "&product_name=" + product_name + "&product_description=" + product_description + "&originalprice=" + originalprice + '&quanitity='+quan+'&vappyprice='+vappyprice;
	var xhr = new XMLHttpRequest();
	xhr.open("POST", serverUrl, true);
	xhr.timeout = 2000;
	xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
	xhr.onload = function() {
		if (xhr.status == 200) {
			var json = xhr.responseText;
			var response = JSON.parse(json);
			loadingResponse(response.message);
		} else if (xhr.status == 404) {
			location.reload();
		} else {
			location.reload();
		}
	}
	xhr.send(dataTopost);
}
function closeEditProduct(){
	hide("viewproductrestaurant");
	openpage('mysales');
}
function openeditProduct(id){
	//document.getElementById("edit_product_category").innerHTML = "";
	//initiateEditProductPoster();
	showLoading();
	show("viewproductrestaurant");
	var dataTopost = "api=1&auth_token=" + authUser.login_token + "&viewThisproducts=" + id;
	var products = new XMLHttpRequest();
	products.open("POST", serverUrl, true);
	products.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
	products.onload = function() {
		if (products.status == 200) {
			var json = products.responseText;
			var response = JSON.parse(json);
			document.getElementById("update_product_id").value = response.id;
			document.getElementById("update_product_name").value = response.name;
			document.getElementById("update_product_quantity_ui").value = response.stock;
			document.getElementById("update_product_description").value = response.description;
			document.getElementById("update_product_price").value = response.price;
			document.getElementById("update_product_price_ui").value = response.originalprice;
			document.getElementById("update_product_addon").value = response.addondata;
			document.getElementById("updatepricerui2").innerHTML = response.price;
			closeLoading();
		} else if (products.status == 404) {
			location.reload();
		} else {
			location.reload();
		}
	}
	products.send(dataTopost);
}
function initMysales(){
	document.getElementById("mysaleslistingcontent").innerHTML ="";
	addPreloader("mysaleslistingcontent");
    var dataTopost = "api=1&auth_token=" + authUser.login_token + "&mysales=true";
    var orders = new XMLHttpRequest();
    orders.open("POST", serverUrl, true);
    orders.setRequestHeader('Content-type', 'application/x-www-form-urlencoded'); 
    orders.onload = function() {
        if (orders.status == 200) {
            var json = orders.responseText;
            var response = JSON.parse(json);
			if(response.status == null){
				var i;
				for (i = 0; i < response.length; i++) {
					if(response[i].order_status == "New"){
						document.getElementById("mysaleslistingcontent").innerHTML += '<li class="collection-item"><div class="row colrow"><div class="col s2"><img src="'+response[i].product_picture+'" class="responsive-img"></div><div class="col s10"><span class="strong">'+response[i].product_name+' - '+response[i].amounts+'KG</span><span class="right"> <a href="#" onclick="completeOrder('+response[i].id+')"><i class="material-icons green-text small">border_color</i></span></a> <br>RM'+response[i].total_price+' <span>In Progress</span></div></div></li>';
					}else{
						document.getElementById("mysaleslistingcontent").innerHTML += '<li class="collection-item"><div class="row colrow"><div class="col s2"><img src="'+response[i].product_picture+'" class="responsive-img"></div><div class="col s10"><span class="strong">'+response[i].product_name+' - '+response[i].amounts+'KG</span><span class="right">'+response[i].order_date+'</span> <br>RM'+response[i].total_price+' - <span>Completed</span></div></div></li>';
					}
				}
			}else{
					document.getElementById("mysaleslistingcontent").innerHTML = '<li class="collection-item">You have no new order</li>';
			}
        } else if (orders.status == 404) {
            alert("Fail to connect to our server");
        } else {
            alert("Fail to connect to our server");
        }
    }
    orders.send(dataTopost);
}
function completeOrder(id){
showLoading();
	var dataTopost = "api=1&auth_token=" + authUser.login_token + "&completeorder="+id;
    var orders = new XMLHttpRequest();
    orders.open("POST", serverUrl, true);
    orders.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    orders.onload = function() {
        if (orders.status == 200) {
            var json = orders.responseText;
            var response = JSON.parse(json);
            loadingResponse(response.message);
            initMysales();
        } else if (orders.status == 404) {
            alert("Fail to connect to our server");
        } else {
            alert("Fail to connect to our server");
        }
    }
	orders.send(dataTopost);
}

function initviewProduct(id, backto) {
    showLoading();
	addPreloader("viewproductcontent");
	//addPreloader("productpicture");
    if (backto == "homepage") {
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
			
            document.getElementById("view_product_owner").innerHTML = response.owner;
            document.getElementById("view_product_id").innerHTML = response.id;
            document.getElementById("product_lat").innerHTML = response.lat;
            document.getElementById("product_lng").innerHTML = response.lng;
            document.getElementById("viewproductcontent").innerHTML = "";
			 document.getElementById("productpicture").innerHTML = '<img id="" src="'+response.picture+'" width="100%">';
            document.getElementById("viewproductcontent").innerHTML += '<h5 class="strong">' + response.name + '</h5>';
            document.getElementById("viewproductcontent").innerHTML += '<p class="strong">Description</p><p>' + response.description + '</p>';
            document.getElementById("viewproductcontent").innerHTML += '<p class="strong">Price</p><p>RM<span id="viewproductprice">' + response.price + '</span></p>';
            //document.getElementById("viewproductcontent").innerHTML = '<p>'+response.owner+'</p><p>'+response.name+'</p><p>'+response.description+'</p><p>'+response.delivery+'</p><p></p>';
            //closeLoading();
			show("viewingcart");
        } else if (products.status == 404) {
            alert("Fail to connect to our server");
        } else {
            alert("Fail to connect to our server");
        }
    }
    products.send(dataTopost);
}

function updateSalePrice(elements) {
    var initialPrice = parseInt(elements.value);
    var totalprice = authUser.productmargin * initialPrice / 100;
    console.log(totalprice);
    document.getElementById("totalpricetosell").innerHTML = initialPrice + totalprice;
	
}

function checkPrice() {
    var productPrice = document.getElementById("viewproductprice").innerHTML;
    var amounttoorder = document.getElementById("productorderamount").value;
    var deliprice = parseInt(document.getElementById("deliverycostview").innerHTML);
if(deliprice != 0.00){
	var orderprice = productPrice * amounttoorder
    document.getElementById("orderpriceview").innerHTML = orderprice.toFixed(2);
    console.log(productPrice * amounttoorder + deliprice);
    var totalprice = productPrice * amounttoorder + deliprice;
    document.getElementById("totalpriceview").innerHTML = totalprice.toFixed(2);
	document.getElementById("ordernow").disabled = false;
}else{
	document.getElementById("ordernow").disabled = true;
	showLoading();
	loadingResponse("Please set your delivery address properly");
}
    
}
var placeSearch, autocomplete;

function initAutocomplete() {
    // Create the autocomplete object, restricting the search predictions to
    // geographical location types.
    autocomplete = new google.maps.places.Autocomplete(
        document.getElementById('productorderaddress'), {
            types: ['geocode']
        });

    // Avoid paying for data that you don't need by restricting the set of
    // place fields that are returned to just the address components.
    //autocomplete.setFields(['address_component']);

    // When the user selects an address from the drop-down, populate the
    // address fields in the form.
    //autocomplete.addListener('place_changed', fillInAddress);
}

function deliverypriceUpdate(){
    var destination = document.getElementById("productorderaddress").value;
    var glat = document.getElementById("product_lat").innerHTML;
    var glng = document.getElementById("product_lng").innerHTML;
    var proorigins = new google.maps.LatLng(glat, glng);
    var service = new google.maps.DistanceMatrixService();
    service.getDistanceMatrix({
        origins: [proorigins],
        destinations: [destination],
        travelMode: 'DRIVING',
    }, callback);

    function callback(response, status) {
        if (status == 'OK') {
            var origins = response.originAddresses;
            var destinations = response.destinationAddresses;

            for (var i = 0; i < origins.length; i++) {
                var results = response.rows[i].elements;
                for (var j = 0; j < results.length; j++) {
                    var element = results[j];
					if(element.distance.value === 'undefined'){
						document.getElementById("ordernow").disabled = true;
					}else{
						var distance = element.distance.value;
						document.getElementById("ordernow").disabled = false;
					}
                }
            }
            if (distance != null) {
                var km = distance / 1000;
                var kmf = km.toFixed(2);
                var price = km * 0.20;
                var displayPrice = price.toFixed(2);
                document.getElementById("deliverycostview").innerHTML = displayPrice;
                document.getElementById("totalviewdistance").innerHTML = kmf; 

            } else {
                showLoading();
                loadingResponse("Please select an address properly");
            }
        }
    }

}
function uploadImage1(element) {
  var file1 = element.files[0];
  var reader = new FileReader();
  reader.onloadend = function() {
		start(reader.result, "postproductplaceholder", "picture");
  }
  reader.readAsDataURL(file1);
}

function uploadImage2(element) {
  var file1 = element.files[0];
  var reader = new FileReader();
  reader.onloadend = function() {
		start(reader.result, "postproductplaceholder2", "picture_two");
  }
  reader.readAsDataURL(file1);
}

function uploadImage3(element) {
	hide("profilemanagement");
  var file1 = element.files[0];
  var reader = new FileReader();
  reader.onloadend = function() {
		start(reader.result, "profileimagecontainer", "profileimagecontainer");
  }
  reader.readAsDataURL(file1);
}

function uploadImage4(element) {
  var file1 = element.files[0];
  var reader = new FileReader();
  reader.onloadend = function() {
		start(reader.result, "postproductplaceholder4", "picture_four");
  }
  reader.readAsDataURL(file1);
}

var nW = window.innerWidth;
var nH = window.innerHeight;

var vanilla;
var target;
var targetinput

function start(img, targetid, input){
targetinput = input;
target = targetid;
document.getElementById("croppermain").style.display = "block";
document.getElementById("postproduct").style.display = "none";
	var newb = nW - 50;
	var newH = nW - 50;
var el = document.getElementById('vanilla-demo');
 vanilla = new Croppie(el, {
    viewport: { width: newb, height: newH },
    boundary: { width: nW, height: nW },
    showZoomer: true,
    enableOrientation: true
}); 

vanilla.bind({
    url: img,
    orientation:1 
});
}
function cancelCroper(){
	hide("croppermain");
	show("profilemanagement");
}
function rotateCroppie(degree){
	vanilla.rotate(degree);
}
function getImage2(){
	vanilla.result('base64').then(function(base64) {
		document.getElementById(target).src = base64;
		document.getElementById(targetinput).value = base64;
		document.getElementById("croppermain").style.display = "none";
		document.getElementById("profilemanagement").style.display = "block";
		vanilla.destroy();
	});
}
function getImage(){
	vanilla.result('base64').then(function(base64) {
		document.getElementById(target).src = base64;
		document.getElementById(targetinput).value = base64;
		document.getElementById("croppermain").style.display = "none";
		document.getElementById("profilemanagement").style.display = "block";
		vanilla.destroy();
		showLoading();
		setTimeout(function(){ postImg(base64); }, 2000);
		
	});
}



function prepareProductImage(element) {
    var file1 = element.files[0];
    var reader = new FileReader();
    reader.onloadend = function() {
        document.getElementById("postproductplaceholder").src = reader.result;
        document.getElementById("picture").value = reader.result;
    }
    reader.readAsDataURL(file1);
}

document.getElementById("inserttoproducts").addEventListener("submit", insertToproducts);

function insertToproducts(){
    event.preventDefault();
    showLoading();
    var name = document.getElementById("name").value;
    var description = document.getElementById("description").value;
    var price = document.getElementById("totalpricetosell").innerHTML;
    var originalprice = document.getElementById("price").value;
    var delivery = true;
    var about = document.getElementById("about").value;
    var precaution = document.getElementById("precaution").value;
    var sideeffect = document.getElementById("sideeffect").value;
    var tip = document.getElementById("tip").value;
    var overview = document.getElementById("overview").value;
    var forgot = document.getElementById("forgot").value;
    var faq = document.getElementById("faq").value;
    var picture = document.getElementById("picture").value;
    var categoryxd = document.getElementById("product_category_final").value;
    var stockx = document.getElementById("stockx").value;
    var rpress = document.getElementById("require_prescription").value;
    var subcategory = document.getElementById("product_sub_category").value;
    var category = document.getElementById("product_category_final").value;
    var dataTopost = "api=1&auth_token=" + authUser.login_token + "&inserttoproducts=true&name=" + name + "&description=" + description + "&price=" + price + "&delivery=" + delivery + "&picture=" + picture + "&lat=" + appLat + "&lng=" + appLng + "&stock=" +stockx+"&about="+about+"&precaution="+precaution+"&sideeffect="+sideeffect+"&tip="+tip+"&overview="+overview+"&forgot="+forgot+"&faq="+faq+"&category="+categoryxd+"&reqpress="+rpress+"&originalprice="+originalprice+"&category="+category+"&subcategory="+subcategory;
    var products = new XMLHttpRequest();
    products.open("POST", serverUrl, true);
    products.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    products.onload = function(){
        if (products.status == 200) {
            var json = products.responseText;
            var response = JSON.parse(json);
            loadingResponse(response.message);
            resetPostform();
        } else if (products.status == 404) {
            alert("Fail to connect to our server");
        } else {
            alert("Fail to connect to our server");
        }
    }
    products.send(dataTopost);
}

function resetPostform() {
    document.getElementById("postproductplaceholder").src = "img/product-placeholder.jpg";

    document.getElementById("name").value = "";
    document.getElementById("description").value = "";
    document.getElementById("price").value = "";
    document.getElementById("delivery").value = "";
    document.getElementById("picture").value = "";
}

function insertToorders() {
    event.preventDefault();
    showLoading();
    var amounts = document.getElementById("productorderamount").value;
    var product_id = document.getElementById("view_product_id").innerHTML;
    var product_owner = parseInt(document.getElementById("view_product_owner").innerHTML);
    var total_price = document.getElementById("totalpriceview").innerHTML;
    var order_owner = authUser.id;
    var order_date = new Date().toISOString().slice(0, 19).replace('T', ' ');;
    var delivery_address = document.getElementById("productorderaddress").value;
    var dataTopost = "api=1&auth_token=" + authUser.login_token + "&inserttoorders=true&amounts=" + amounts + "&product_id=" + product_id + "&product_owner=" + product_owner + "&total_price=" + total_price + "&order_owner=" + order_owner + "&order_date=" + order_date + "&delivery_address=" + delivery_address;
    var orders = new XMLHttpRequest();
    orders.open("POST", serverUrl, true);
    orders.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    orders.onload = function() {
        if (orders.status == 200) {
            var json = orders.responseText;
            var response = JSON.parse(json);
            loadingResponse(response.message);
            openpage("viewmyorder");
        } else if (orders.status == 404) {
            alert("Fail to connect to our server");
        } else {
            alert("Fail to connect to our server");
        }
    }
    orders.send(dataTopost);
}