var cartData;
var finalcart = '[';
var firstItemLat;
var firstItemLng;
var cartrestaurantid;
var deliveryType = '';
function setOrderDelivery(){
	show("selectedDeliveryAddress");
	hide("selectedPickUpAddress");
	deliveryType = 'delivery';
	document.getElementById("paycart").disabled = true;
	document.getElementById("deliveryAddress").innerHTML = 'Click here to set up your delivery address';
}
function setOrderPickup(){
	hide("selectedDeliveryAddress");
	show("selectedPickUpAddress");
	document.getElementById("paycart").disabled = false;
	document.getElementById("deliveryprice").innerHTML = 0.00;
	document.getElementById("totaldeliveryprice").innerHTML = document.getElementById("totalpriceincart").innerHTML;
	cartData.totalPrice = parseFloat(document.getElementById("totalpriceincart").innerHTML);
	deliveryType = 'pickup';
}
var ifgotpresscheckprice = 0;
var deliverydata = {
	process: true,
	serviceCode: "LLMB",
origin: {
    scheduledAt: "now",
    inventory: [
      {
        name: "Mee Kari",
        type: "PARCEL",
        price: {
          amount: "10.50",
          currency: "MYR"
        },
        weight: {
          value: 1,
          unit: "g"
        },
        dimension: {
          width: 10,
          height: 11,
          length: 12,
          unit: "cm"
        },
        quantity: 1,
        description: ""
      },
      {
        name: "Ayam Goreng",
        type: "PARCEL",
        price: {
          amount: "8.00",
          currency: "MYR"
        },
        weight: {
          value: 500,
          unit: "g"
        },
        dimension: {
          width: 10,
          height: 11,
          length: 12,
          unit: "cm"
        },
        quantity: 1,
        description: ""
      }
    ],
    contact: {
      name: "Test Sender",
      email: "test@gmail.com",
      phone: "60124433300",
      unitNo: "",
      address1: "Kuala Lumpur, Federal Territory of Kuala Lumpur, Malaysia",
      address2: "",
      city: "",
      state: "",
      postcode: "",
      country: "MY",
      coord: {
        lat: "3.156949",
        lon: "101.712303"
      }
    }
  },
  destination: {
    inventory: [
      {
        name: "Mee Kari",
        type: "PARCEL",
        price: {
          amount: "10.50",
          currency: "MYR"
        },
        weight: {
          value: 1,
          unit: "g"
        },
        dimension: {
          width: 10,
          height: 11,
          length: 12,
          unit: "cm"
        },
        quantity: 1,
        description: ""
      },
      {
        name: "Ayam Goreng",
        type: "PARCEL",
        price: {
          amount: "8.00",
          currency: "MYR"
        },
        weight: {
          value: 500,
          unit: "g"
        },
        dimension: {
          width: 10,
          height: 11,
          length: 12,
          unit: "cm"
        },
        quantity: 1,
        description: ""
      }
    ],
    contact: {
      name: "Mr Receiver",
      email: "test@gmail.com",
      phone: "60124433300",
      mobile: "60124433300",
      unitNo: "6-8",
      address1: "Shah Alam, Selangor, Malaysia",
      address2: "",
      city: "",
      state: "",
      postcode: "",
      country: "MY",
      coord: {
        lat: "3.073838",
        lon: "101.518347"
      }
    }
  }
}	
function initPharamcyDeliveryaddressFinalizaer(){
	console.log(delyvagetquotedata);
	var destination = delyvagetquotedata.destination;
	document.getElementById("address1").value = destination.address1;
	document.getElementById("address2").value = destination.address2;
	document.getElementById("city").value = destination.city;
	document.getElementById("postcode").value = destination.postcode;
	document.getElementById("state").value = destination.state;
}
var delyvagetquotedata = [];
var delyvaDeliverylat;	
var delyvaDeliverylng;
var publicDistance = 0;
function codeAddresscart(pickedaddress){
	showLoading();
	document.getElementById("deliveryAddress").innerHTML = pickedaddress;
    var address = pickedaddress;
    geocoder.geocode( { 'address': address}, function(results, status) {
		if (status == 'OK') {
			
			var delyvadestination = {
			  address1: "",
			  address2: "",
			  city: "",
			  state: "",
			  postcode: "",
			  country: "MY",
			  coord: {
				lat: "",
				lon: ""
			  }
			};
			
			delyvadestination.address1 = address;
			var delyvaorigin = {
			  address1: "",
			  address2: "",
			  city: "",
			  state: "",
			  postcode: "",
			  country: "MY",
			  coord: {
				lat: "",
				lon: ""
			  }
			};
			
			var delyvaweight = {
			  unit: "g",
			  value: cartWeight
			};
			
			var delyvadimension = {
			  width: cartWidth,
			  height: cartHeight,
			  length: cartLength,
			  unit: "cm"
			};
			
			var curCORD = results[0].geometry.location.toString();
			var addressComponent = results[0].address_components;
			for (let i = 0; i < addressComponent.length; i++) {
				components = addressComponent[i];
				var componenttype = components.types;
				for (let j = 0; j < componenttype.length; j++){
					console.log(componenttype[j].long_name);
					if(componenttype[j] == "locality"){
						address_city = addressComponent[i].long_name;
						delyvadestination.city = address_city;
					}
					if(componenttype[j] == "postal_code"){
						address_postcode = addressComponent[i].long_name;
						delyvadestination.postcode = address_postcode;
					}
					if(componenttype[j] == "country"){
						address_country = addressComponent[i].long_name;
						
					}
					if(componenttype[j] == "administrative_area_level_1"){
						address_state = addressComponent[i].long_name;
						delyvadestination.state = address_state;
					}		
				}
			}			
			
			var corddd = curCORD.split(',', 2);
			corddd[0].replace("(", "");
			corddd[1].replace(")", "");
			var latCleaner =  corddd[0].replace("(", "");
			var cleanedLat =  parseFloat(latCleaner).toFixed(6);
			var lngCleaner =  corddd[1].replace(")", "");
			var cleanedLng  = parseFloat(lngCleaner).toFixed(6);
			delyvaDeliverylat = cleanedLat;
			delyvaDeliverylng = cleanedLng;
			mainDeliveryCordinate.lat = cleanedLat;
			mainDeliveryCordinate.lng = cleanedLng;
			publicDistance = distance(cleanedLat, cleanedLng, cartVendor.lat, cartVendor.lng);
			if(publicDistance == 0){
				var deeploy = sessionvendoraddress.coord
				publicDistance = distance(cleanedLat, cleanedLng, deeploy.lat, deeploy.lng);
			}
			mainDeliveryCordinate.address = address;
			var fromaddress = cartVendor.vendor_address;
			document.getElementById("selectedaddressdely").innerHTML = address;
			var deliverycoord = {
				lat: cleanedLat,
				lon: cleanedLng
			}
			delyvadestination.coord = deliverycoord;
			delyvaorigin = cartOriginData;
			delyvagetquotedata = {
				origin: delyvaorigin,
				destination: delyvadestination,
				weight: delyvaweight,
				dimension: delyvadimension
			}
			show("pharmacyaddressfinalizer");
			hide("searchwindow");
			initPharamcyDeliveryaddressFinalizaer();
			closeLoading();
			//openpage("pharmacyaddressfinalizer", address);
      } else {
		  showLoading();
          loadingResponse('Geocode was not successful for the following reason: ' + status);
      }
    });
}
var sessionDestination = null;
var sessionLat;
var sessionLng;

function finalizeDestination(identifier){
	showLoading();
	var finalAddress1 = document.getElementById("address1").value;
	var finalAddress2 =document.getElementById("address2").value;
	var finalCity = document.getElementById("city").value;
	var finalPostCode = document.getElementById("postcode").value;
	var finalState = document.getElementById("state").value;
	if(finalAddress1 != "", finalAddress2 != "", finalCity != "", finalPostCode != "", finalState != ""){
		var tempDest = delyvagetquotedata.destination;
		tempDest.address1 = finalAddress1;
		tempDest.address2 = finalAddress2;
		tempDest.city = finalCity;
		tempDest.postcode = finalPostCode;
		tempDest.state = finalState;
		delyvagetquotedata.destination = tempDest;
		sessionDestination = tempDest;
		var delyvagetquote = btoa(JSON.stringify(delyvagetquotedata));
		
		var gaddress = tempDest.address1+','+tempDest.address2+','+tempDest.postcode+' '+tempDest.city+', '+tempDest.state+', Malaysia';
		document.getElementById("sessionaddress").innerHTML = gaddress
	}else{
		var gaddress = document.getElementById("selectedaddressdely").innerHTML;
		document.getElementById("sessionaddress").innerHTML = gaddress
		var tempDest = delyvagetquotedata.destination;
		console.log(tempDest);
		tempDest.address1 = gaddress;
		tempDest.address2 = "";
		tempDest.city = "";
		tempDest.postcode = "";
		tempDest.state = "";
		sessionDestination = tempDest;
		delyvagetquotedata.destination = tempDest;
		console.log(delyvagetquotedata);
		var delyvagetquote = btoa(JSON.stringify(delyvagetquotedata));
	}
	var dataTopost = 'api=1&auth_token='+authUser.login_token+"&delyvagetquote="+delyvagetquote;
	var xhr = new XMLHttpRequest();
	xhr.open("POST", serverUrl, true);
	xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
	xhr.onload = function(){
		if (xhr.status == 200) {
			var json = xhr.responseText;
			var response = JSON.parse(json);
			hide("pharmacyaddressfinalizer");
			show("currierselector");
			console.log(response);
			if(response.status == "success"){
				var quotations = response.quotations;
				document.getElementById("thirdparydelivery").innerHTML = "";
				document.getElementById("defaultdelivery").innerHTML = "";
				for (let i = 0; i < quotations.length; i++) {
					if(quotations[i].description == "NDD"){
						var description = 'Next day delivery';
					}else if(quotations[i].description == "INSTANT"){
						var description = 'On demand delivery';
					}
					var dprice = 'RM'+parseFloat(quotations[i].Price).toFixed(2);
					if(dprice != "RMNaN"){
						document.getElementById("thirdparydelivery").innerHTML += '<div class="card" onclick="selectCurrier(\''+quotations[i].name+'\', \''+quotations[i].service_code+'\', \''+quotations[i].service_id+'\', \''+quotations[i].Price+'\', \''+description+'\')"><div class="card-content">'+quotations[i].name+' <span class="right">'+dprice+'</span> <p>'+description+'</p></div></div>';
					}
					
					
				}
				console.log(publicDistance);
				if(publicDistance == 0){
					publicDistance = response.distance;
				}
				console.log(publicPriceperKM);
				var epinkdeliveryprice = parseFloat(publicDistance) * parseFloat(publicPriceperKM);
				var epinkdeliveryprice = parseFloat(epinkdeliveryprice).toFixed(2);
				document.getElementById("defaultdelivery").innerHTML += '<div class="card" onclick="selectCurrier(\'EPINK DELIVERY\', \'EPINK\', \'EPINK\', \''+epinkdeliveryprice+'\', \'Instant Delivery\')"><div class="card-content">EPINK DELIVERY <span class="right">RM'+epinkdeliveryprice+'</span> <p>Next Day Delivery</p></div></div>';
			}
			closeLoading();
		} else if (xhr.status == 404) {
			alert("Fail to connect to our server");
		} else {
			alert("Fail to connect to our server");
		}
	}
	xhr.send(dataTopost);
}
var finalizeDelyvacreatedata;
var selectedServicecode = '';
var selectCurrierFrom = null
function selectCurrier(name, code, sid, price, description){
	console.log(selectCurrierFrom);
	showLoading();
	hide("currierselector");
	if(selectCurrierFrom == "cart"){
		show("usercart");
		var curitemprice = totalPriceBeforeDelivery;
		var afterdeliveryprice = parseFloat(totalPriceBeforeDelivery) + parseFloat(price);
		document.getElementById("deliveryprice").innerHTML = parseFloat(price).toFixed(2);
		document.getElementById("totaldeliveryprice").innerHTML = parseFloat(afterdeliveryprice).toFixed(2);
		document.getElementById("paycart").disabled = false;
		closeLoading();
		var originfinal = delyvagetquotedata.origin;
		var destinationfinal = delyvagetquotedata.destination;
		console.log(destinationfinal)
		if(authUser.fullname == ""){
			var fullnametouse = authUser.firstname+' '+authUser.lastname;
		}else{
			var fullnametouse = authUser.fullname;
		}
		selectedServicecode = code
		var constructData = {
			customerId: delyvaConsumerId,
			process: false,
			serviceCode: code,
		origin: {
			scheduledAt: "now",
			inventory: unifiedInventorydata,
			contact: {
			  name: cartVendor.vendor_name,
			  email: cartVendor.email,
			  phone: cartVendor.phonenumber,
			  unitNo: "",
			  address1: originfinal.address1,
			  address2: originfinal.address2,
			  city: originfinal.city,
			  state: originfinal.state,
			  postcode: originfinal.postcode,
			  country: "MY",
			  coord: originfinal.coord
			}
		  },
		  destination: {
			inventory: unifiedInventorydata,
			contact: {
			  name: fullnametouse,
			  email: authUser.email,
			  phone: authUser.phonenumber,
			  mobile: authUser.phonenumber,
			  unitNo: "",
			  address1: destinationfinal.address1,
			  address2: destinationfinal.address2,
			  city: destinationfinal.city,
			  state: destinationfinal.state,
			  postcode: destinationfinal.postcode,
			  country: "MY",
			  coord: destinationfinal.coords
			}
		  }
		}
		console.log(constructData);
		finalizeDelyvacreatedata = constructData;
		document.getElementById("selecteddeliverypartner").innerHTML = '<div class="eaddress" style="padding: 12px; margin-bottom: 15px"><b>Delivery Partner</b><p style="margin-bottom: 0px">'+name+' <span class="right">'+description+'</span></p></div>';
	}
	if(selectCurrierFrom == "telconsultant"){
		hide("selectdeliverymethod");
		show("sessioncontroller");
		show("unpaid");
		closeLoading();
		document.getElementById("sessionselectedcourrier").innerHTML = '<div class="eaddress" style="padding: 12px; margin-bottom: 15px"><b>Delivery Partner</b><p style="margin-bottom: 0px">'+name+' <span class="right">'+description+'</span></p></div>';
		document.getElementById("sessionselectedcourrier").innerHTML = '<div class="eaddress" style="padding: 12px; margin-bottom: 15px"><b>Delivery Partner</b><p style="margin-bottom: 0px">'+name+' <span class="right">'+description+'</span></p></div>';
		document.getElementById("sessiondeliveryfee").innerHTML = parseFloat(price).toFixed(2);
		var medfee = parseFloat(document.getElementById("medicationfee").innerHTML);
		var totalPrice = parseFloat(medfee) + parseFloat(price);
		document.getElementById("sessiontotalprice").innerHTML = parseFloat(totalPrice).toFixed(2);
		selectedServicecode = code
		sessiondelyvadata.serviceCode = code;
		
		console.log(sessiondelyvadata)
		
		sessiondelyvadata.destination.contact.address1 = sessionDestination.address1
		sessiondelyvadata.destination.contact.address2 = sessionDestination.address2
		sessiondelyvadata.destination.contact.city = sessionDestination.city
		sessiondelyvadata.destination.contact.state = sessionDestination.state
		sessiondelyvadata.destination.contact.postcode = sessionDestination.postcode
		sessiondelyvadata.destination.contact.coord = sessionDestination.coord
		console.log(sessiondelyvadata.destination.contact);
		
	}

}
function saveAddress(){
	var saveThis = JSON.stringify(mainDeliveryCordinate);
	localStorage.setItem('saved_address', saveThis);
	instaResponse('Address Saved');
}

function useSaved(){
	var saveAddress = JSON.parse(localStorage.getItem('saved_address'));
	
	mainDeliveryCordinate = saveAddress;
	if(saveAddress.address == ""){
		showLoading();
		loadingResponse("You havent saved any address yet");
	}else{
	document.getElementById("deliveryAddress").innerHTML = saveAddress.address;
	getFunctionThree();
	}
	
}
var cartVendor;
var purchaseoff = '';
var cartOriginData;
var cartHeight = 0
var cartWidth = 0
var cartLength = 0
var cartUnit = "";
var cartWeight = 0
var cartWeightunit = "";
var unifiedInventorydata = [];
var totalPriceBeforeDelivery;
var totalPriceAfterDelivery
function initCart(){
	unifiedInventorydata = [];
	showLoading();
	mainDeliveryCordinate.address = "";
	purchaseoff = '';
	finalcart = '[';
	document.getElementById("arrayofproduct").value = "";
	document.getElementById("deliveryprice").innerHTML = "0.00";
	document.getElementById("totalpriceincart").innerHTML = "0.00";
	document.getElementById("totaldeliveryprice").innerHTML = "0.00";
	document.getElementById("paycart").disabled = true;
	var totalArray = 0;
	var countingArray = 1;
	var dataTopost = "api=1&auth_token=" + authUser.login_token + "&viewmycart=true";
    var carts = new XMLHttpRequest();
	addPreloader("viewallcarts");
    carts.open("POST", serverUrl, true);
    carts.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    carts.onload = function() {
        if (carts.status == 200) {
            var json = carts.responseText;
            var response = JSON.parse(json);
			document.getElementById("viewallcarts").innerHTML ="";
			if(response.status == null){
					cartOriginData = response.delyvapickup;
					cartData = response;
					var cartItem = response.cartitem;
					var distance = response.item_distances;
					var j;
					var totalPrice = 0.00;
					var totalOriginalPrice = 0.00;
					var cartNeedPrescription = false;
					var prescriptionMedcount = 0;
					cartVendor = response.vendorInformation;
					console.log(cartItem);
					for (j = 0; j < cartItem.length; j++) {
						var gotaddon;
						var addonprice = 0.00;
						var originalAddonprice = 0.00;
						var dimensiondata = cartItem[j].dimension;
						var weightdata = cartItem[j].weight;
						if(cartItem[j].weightunit == "kg"){
							weightdata = weightdata * 1000;
						}
						cartHeight = cartHeight + parseInt(dimensiondata.height)
						cartWidth = cartWidth + parseInt(dimensiondata.width)
						cartLength = cartLength + parseInt(dimensiondata.length)
						cartUnit = dimensiondata.unit
						cartWeight = cartWeight + parseInt(weightdata.value)
						cartWeightunit = weightdata.unit;
						var quan = parseInt(cartItem[j].quantity)
						if(cartItem[j].prescription == "true"){
							prescriptionMedcount++;
							purchaseoff += cartItem[j].product_name+' ';
						}
						
						if(cartItem[j].addon === undefined || cartItem[j].addon === null || cartItem[j].addon == "undefined"){
							
						}else{
							var itemaddondata = JSON.parse(cartItem[j].addon);

							var x;
							for (x = 0; x < itemaddondata.length; x++) {
								if(itemaddondata[x].checked == true){
								
									addonprice = addonprice + parseFloat(itemaddondata[x].price);
									
									if(isNaN(itemaddondata[x].original_price)){
										
										itemaddondata[x].original_price = parseInt(itemaddondata[x].original_price);
										
										
									}else{
										
									}
									originalAddonprice = originalAddonprice + parseFloat(itemaddondata[x].original_price);
									gotaddon = true;
									
								}else{
									
								}
							}
						}
						cartrestaurantid = cartItem[0].product_owner;
						firstItemLat = parseFloat(cartItem[0].vendor_lat);
						firstItemLng = parseFloat(cartItem[0].vendor_lng);
						var itemPrice = parseFloat(cartItem[j].product_price);
						var originalitemPrice = parseFloat(cartItem[j].originalprice);
					
						var originalItemPricef = 0.00;
						if(gotaddon == true){
							
							 itemPrice = parseFloat(itemPrice) + parseFloat(addonprice);
							 originalItemPricef = parseFloat(originalitemPrice) + parseFloat(originalAddonprice);
							
						}else{
							originalItemPricef = cartItem[j].originalprice;
							
						}
						var price = cartItem[j].quantity * itemPrice;
						var quantified = parseInt(cartItem[j].quantity);
						var originalItemPricefinal = quantified * originalItemPricef;
						price = price.toFixed(2);
						var itemQuantity = parseInt(cartItem[j].quantity);
						var delyvainventorydata = {
							name: cartItem[j].product_name,
							type: "PARCEL",
							price: {
							  amount: price,
							  currency: "MYR"
							},
							weight: {
							  value: weightdata.value,
							  unit: "g"
							},
							dimension: {
							  width: dimensiondata.width,
							  height: dimensiondata.height,
							  length: dimensiondata.length,
							  unit: "cm"
							},
							quantity: quantified,
							description: ""
						}
						unifiedInventorydata.push(delyvainventorydata);
						
						
						document.getElementById("viewallcarts").innerHTML += '<div class="card white z-depth-2" style="border-radius: 20px;"> <div class="card-image"> <a class="btn-floating btn-small halfway-fab waves-effect waves-light pink roundsmall" style="top: 5px; right: 5px; width: 40px; height: 40px; padding-top: 9px" onclick="removeCartitem('+cartItem[j].id+')"><i class="material-icons" style="line-height: 3px;">close</i></a></div><div class="card-content cart-card" style="padding: 0px; padding-top: 10px;"><div class="row"><div class="col s4" style="margin-bottom: 5px;"><img src="'+cartItem[j].product_picture+'" class="responsive-img" style="margin-left: 10px;"></div><div class="col s8"><span class="strong pink-text">'+cartItem[j].product_name+'</span><p class="small">Quantity :<span class="small"> '+itemQuantity+'</span><p class="small">Price :<span class="small">RM'+price+'</span></p></div></div></div></div>';
						totalPrice = parseFloat(totalPrice) + parseFloat(price);
						totalOriginalPrice = parseFloat(totalOriginalPrice) + parseFloat(originalItemPricefinal);
						document.getElementById("lastcordinate").innerHTML	= firstItemLat+','+firstItemLng;
						document.getElementById("deliverydiscount").innerHTML = deliveryDiscount;
						document.getElementById("pikcupaddress").innerHTML = cartVendor.vendor_address;
					}
					if(prescriptionMedcount > 0){
						show("needPres");
						show("showPresfinalizer");
						hide("showStoreFinalizer");
						document.getElementById("cartdoctorimage").src = response.suggesteddoctor[0].profile_img;
						document.getElementById("cartdoctorname").innerHTML = 'Dr.'+response.suggesteddoctor[0].fullname;
						document.getElementById("cartdoctorate").innerHTML = +response.suggesteddoctor[0].doctor_rate;
						ifgotpresscheckprice = parseFloat(response.suggesteddoctor[0].doctor_rate);
						requireteleconsultation = true;
						cartDocid = response.suggesteddoctor[0].id;
						hide("cartpricing");
						hide("logisticInfo");
					}else{
						hide("needPres");
						hide("showPresfinalizer");
						show("showStoreFinalizer");
						ifgotpresscheckprice = 0;
						requireteleconsultation = false;
						cartDocid = 0;
						show("logisticInfo");
						show("cartpricing");
						
					}
					document.getElementById("totalpriceincart").innerHTML = totalPrice.toFixed(2);
					totalPriceBeforeDelivery = totalPrice.toFixed(2);
					cartData.total_price_entry = totalPrice.toFixed(2);
					cartData.total_price_original = totalOriginalPrice.toFixed(2);
					//document.getElementById("arrayofproduct").value = finalcart;
					//loadingResponse(response.message);
					if(mainDeliveryCordinate.address == ""){
						document.getElementById("deliveryAddress").innerHTML = 'Click here to set up your delivery address';
					}else{
						document.getElementById("deliveryAddress").innerHTML = mainDeliveryCordinate.address;
						getFunctionThree();
					}
					var listprescription = response.prescriptionlist;
					if(listprescription != null){
						var v;
						
						for (v = 0; v < listprescription.length; v++) {
							document.getElementById("pickprescription").innerHTML += '<option value="'+listprescription[v].id+'">By '+listprescription[v].hostpital+' '+listprescription[v].valid+'</option>';
						}		
					}else{
						document.getElementById("pickprescription").innerHTML = '<option value="">No prescription</option>';
					}			
					cartcontent = true;
					
					
				
			}else{
				cartcontent = false;
				document.getElementById("viewallcarts").innerHTML = '<div class="card white darken-1 z-index-2" style="border-radius: 15px"> <div class="card-content pink-text" style="padding: 10px"><center class="strong"><i class="material-icons pink-text large">assignment_late</i><p>There is no item in your cart. Add item from our e-Pharmacy <br/></p></center> </div> </div><br>';
				hide("selectedPickUpAddress");
				hide("selectedDeliveryAddress");
				hide("logisticInfo");
				hide("needPres");
			}
        } else if (carts.status == 404) {
            alert("Fail to connect to our server");
        } else {
            alert("Fail to connect to our server");
        }
    }
    carts.send(dataTopost);
}
var customeraddon;
function checkClicked(element){
	var elements = element;
	var itemchecked = elements.getAttribute("checked");
	if(itemchecked == "true"){
		elements.setAttribute("checked", "false");
	}else{
		elements.setAttribute("checked", "true");
	}
	previewPrice();
	
}


function checked(){
	var i;
	for (i = 0; i < customeraddon.length; i++) {
	  var lol = document.getElementById(i).getAttribute("checked");
	  if(lol == "true"){
		  customeraddon[i].checked = true;
		  var cartPrice = document.getElementById("totalpricepreview").innerHTML;
		  var total = parseFloat(cartPrice) + parseFloat(customeraddon[i].price);
		   document.getElementById("totalpricepreview").innerHTML = total.toFixed(2);
	  }else{
		  customeraddon[i].checked = false;
		  
	  }
	}
}

function inserTocartPc(){
	showLoading();
	var product_id = newProductId;
	var restaurant_id = newProductOwner;
	var quantity = document.getElementById("pcnewProductQuantity").innerHTML;
	var orderMessage =  "";
	var openedItemrequirepres = newRequirepress;
	var addon = JSON.stringify(customeraddon);
	if(quantity != "" || quantity > 0){
    var dataTopost = "api=1&auth_token=" + authUser.login_token + "&inserttocarts=true&product_id="+product_id+"&quantity="+quantity+'&message='+orderMessage+'&restaurant_id='+restaurant_id+'&addon='+addon+"&requireprescription="+openedItemrequirepres;
    var carts = new XMLHttpRequest();
    carts.open("POST", serverUrl, true);
    carts.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    carts.onload = function() {
        if (carts.status == 200) {
            var json = carts.responseText;
            var response = JSON.parse(json);
			if(response.status == "fail"){
				loadingResponse("You already have this item in your cart");
			}else{
				loadingResponse("Item added to cart");
				hide("viewproductnew");
			}
        } else if (carts.status == 404) {
            alert("Fail to connect to our server");
        } else {
            alert("Fail to connect to our server");
        }
    }
    carts.send(dataTopost);
		
	}else{
		loadingResponse("Please set quantity");
	}
	 
}
function inserTocart(){
	showLoading();
	var product_id = newProductId;
	var restaurant_id = newProductOwner;
	var quantity = document.getElementById("newProductQuantity").innerHTML;
	var orderMessage =  "";
	var openedItemrequirepres = newRequirepress;
	var addon = JSON.stringify(customeraddon);
	if(quantity != "" || quantity > 0){
    var dataTopost = "api=1&auth_token=" + authUser.login_token + "&inserttocarts=true&product_id="+product_id+"&quantity="+quantity+'&message='+orderMessage+'&restaurant_id='+restaurant_id+'&addon='+addon+"&requireprescription="+openedItemrequirepres;
    var carts = new XMLHttpRequest();
    carts.open("POST", serverUrl, true);
    carts.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    carts.onload = function(){
        if(carts.status == 200){
            var json = carts.responseText;
            var response = JSON.parse(json);
			if(response.status == "fail"){
				loadingResponse("You already have this item in your cart");
			}else{
				loadingResponse("Item added to cart");
				hide("viewproductnew");
			}
        } else if (carts.status == 404) {
            alert("Fail to connect to our server");
        } else {
            alert("Fail to connect to our server");
        }
    }
    carts.send(dataTopost);
		
	}else{
		loadingResponse("Please set quantity");
	}
	 
}
function removeCartitem(cid){
	showLoading();
	var dataTopost = "api=1&auth_token=" + authUser.login_token + "&deleteFromcarts="+cid;
    var carts = new XMLHttpRequest();
    carts.open("POST", serverUrl, true);
    carts.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    carts.onload = function() {
        if (carts.status == 200) {
            var json = carts.responseText;
            var response = JSON.parse(json);
			initCart();
            loadingResponse(response.message);
        } else if (carts.status == 404) {
            alert("Fail to connect to our server");
        } else {
            alert("Fail to connect to our server");
        }
    }
    carts.send(dataTopost);
	
}
var cartcontent = false;
function setsearchFor(fors) {
	if(authUser.phonenumber == "" || authUser.phonenumber == null){
		showLoading();
		openpage("profilemanagement");
		loadingResponse("Please set up your phone number before proceeding");
	}else{
		if(cartcontent == false){
			showLoading();
			loadingResponse("Your cart is empty");
		}else{
			searchFor = fors;
			document.getElementById("searchwindow").style.display = "block";
			document.getElementById("usercart").style.display = "none";
		}
	}
}

function initServices(elements) {
  var searchQuery = elements.value;
  document.getElementById('results').innerHTML = '';
  var displaySuggestions = function(pgreenictions, status) {
    if (status != google.maps.places.PlacesServiceStatus.OK) {
      document.getElementById('results').innerHTML = '<li class="collection-item">Can\'t find that address</li>';
      return;
    }

    pgreenictions.forEach(function(pgreeniction) {
      var lol = '<li class="collection-item" onclick="codeAddresscart(\'' + pgreeniction.description + '\')">' + pgreeniction.description + '</li>';
      document.getElementById("results").innerHTML += lol;
    });
  };

  var service = new google.maps.places.AutocompleteService();
  service.getQueryPredictions({
    input: searchQuery
  }, displaySuggestions);
}
function enablePlaceorderbutton(){
	var con = document.getElementById("deliveryAddress").innerHTML;
	if(con != "Click here to set up your delivery address"){
		document.getElementById("paycart").disabled = false;
	}else{
		showLoading();
		loadingResponse("Please set your delivery address");
	}
	
}
  
function setPickup(content) {
  document.getElementById("deliveryAddress").innerHTML = content;
  document.getElementById("results").innerHTML = "";
  document.getElementById("searchwindow").style.display = "none";
  document.getElementById("usercart").style.display = "block";
  document.getElementById("search").value = '';
  getFunctionThree();
}
function getFunctionThree(){
  var pickUp =  document.getElementById("lastcordinate").innerHTML;
  var dropOff = document.getElementById("deliveryAddress").innerHTML;
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
        if (test.status === 'ZERO_RESULTS') {
			showLoading();
			loadingResponse("Please use real address");
			document.getElementById("paycart").disabled = true;
        } else {
		
          var distance = test.distance.value;
          var inKM = distance / 1000;
          var inKM = inKM.toFixed(2);
		  var pricePerKm = parseFloat(0.80);
		  if(inKM < 2){
			  price = 3.00;
		  }else{
			  var extraKM = inKM - 2;
			  var extraKMcharge = extraKM * pricePerKm;
			  price = 3.00 + extraKMcharge;
		  }
		 
		  var itemsPrice = parseFloat(document.getElementById("totalpriceincart").innerHTML);
		  document.getElementById("deliveryKM").innerHTML = inKM+'KM';
		  var deliverPrice = document.getElementById("deliveryprice").innerHTML = price.toFixed(2);
		  cartData.delivery_price = deliverPrice;
		  var checkDiscount = parseInt(document.getElementById("deliverydiscount").innerHTML);
		  var dicountedprice = checkDiscount * price / 100;
	
		  price = price - dicountedprice;
		  var iodPrice = itemsPrice + price;
		  iodPrice = iodPrice.toFixed(2);		
          document.getElementById("totaldeliveryprice").innerHTML = iodPrice;
		  cartData.totalPrice = parseFloat(iodPrice);
          document.getElementById("paycart").disabled = false;
	
        }
      }
    });
  } else {
    alert("Please setup your pick up location properly");
  }
}
function getFunction(){
  var pickUp =  document.getElementById("lastcordinate").innerHTML;
  var dropOff = document.getElementById("deliveryAddress").innerHTML;
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
        if (test.status === 'ZERO_RESULTS') {
			showLoading();
			loadingResponse("Please use real address");
			document.getElementById("paycart").disabled = true;
        } else {
          var distance = test.distance.value;
          var inKM = distance / 1000;
          var inKM = inKM.toFixed(2);
		  var pricePerKm = parseFloat(0.80);
		  if(inKM < 2){
			  price = 3.00;
		  }else{
			  var extraKM = inKM - 2;
			  var extraKMcharge = extraKM * pricePerKm;
			  price = 3.00 + extraKMcharge;
		  }
		  var itemsPrice = parseFloat(document.getElementById("totalpriceincart").innerHTML);
		  document.getElementById("deliveryKM").innerHTML = inKM+'KM';
		  var deliverPrice = document.getElementById("deliveryprice").innerHTML = price.toFixed(2);
		  cartData.delivery_price = deliverPrice;
		  var iodPrice = itemsPrice + price;
		  iodPrice = iodPrice.toFixed(2);
          document.getElementById("totaldeliveryprice").innerHTML = iodPrice;
		  cartData.totalPrice = parseFloat(iodPrice);
          //document.getElementById("paycart").disabled = false;
        }
      }
    });
  } else {
    alert("Please setup your pick up location properly");
  }
}
var requireteleconsultation = false;
var cartDocid = 0;
function processCart(typer){
	showLoading();
	var proceed = false;
	var cartPrice = cartData.total_price_entry;
	cartData.job_type = "Goods Delivery";
	var paymentmethod = document.getElementById("paymentMethod").value;
	cartData.delivery_address = document.getElementById("deliveryAddress").innerHTML;
	if(paymentmethod == "Wallet"){
		if(cartData.totalPrice >= authUser.wallet){
			loadingResponse("Insufficient balance. Please top up your wallet");
			proceed = false;
		}else{
			proceed = true;
		}
	}else if(paymentmethod == "Card"){
			proceed = false;
			var orderData = JSON.stringify(cartData);
			var deliverPrice = parseFloat(document.getElementById("deliveryprice").innerHTML);
			var dataTopost = 'api=1&auth_token='+authUser.login_token+"&processordercard="+orderData+"&lat="+firstItemLat+"&lng="+firstItemLng+"&restaurantid="+cartrestaurantid+"&paymentmethod="+paymentmethod+"&cart_price="+cartData.total_price_entry+"&delivery_lat="+userDetectedLat+"&delivery_lng="+userDetectedLng+"&deliveryPrice="+deliverPrice+'&promo='+deliveryDiscount+"&restaurantprofit="+cartData.total_price_original;
			var xhr = new XMLHttpRequest();
			xhr.open("POST", serverUrl, true);
			xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
			xhr.onload = function(){
				if (xhr.status == 200) {
					var json = xhr.responseText;
					var response = JSON.parse(json);
					
					if(response.status == "Successful"){
						openOrder(response.order_id);
						document.getElementById("paycart").disabled = true;
					}else{
						loadingResponse(response.message);
					}
				} else if (xhr.status == 404) {
					alert("Fail to connect to our server");
				} else {
					alert("Fail to connect to our server");
				}
			}
		xhr.send(dataTopost);
	}
	
	if(paymentmethod == "COD"){
		proceed = true;
	}
	
	if(paymentmethod == "Online"){
			proceed = false;
			var orderData = JSON.stringify(cartData);
			var deliverPrice = parseFloat(document.getElementById("deliveryprice").innerHTML);
			var dataTopost = 'api=1&auth_token='+authUser.login_token+"&processorderonline="+orderData+"&lat="+firstItemLat+"&lng="+firstItemLng+"&restaurantid="+cartrestaurantid+"&paymentmethod="+paymentmethod+"&cart_price="+cartData.total_price_entry+"&delivery_lat="+userDetectedLat+"&delivery_lng="+userDetectedLng+"&deliveryPrice="+deliverPrice+'&promo='+deliveryDiscount+"&restaurantprofit="+cartData.total_price_original;
			var xhr = new XMLHttpRequest();
			xhr.open("POST", serverUrl, true);
			xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
			xhr.onload = function(){
				if (xhr.status == 200) {
					var json = xhr.responseText;
					var response = JSON.parse(json);
					loadingResponse(response.message);
					if(response.status == "success"){
						//openTopupbrowser(response.orderid);
						var senangpayUrl = 'https://epink.health/senangpay/index.php?sessionid='+response.orderid;
						//var senangpayUrl = 'https://vappy.my/senangdebug/index.php?sessionid='+response.orderid;
						openpage("landing");
						//openBrowser(senangpayUrl);
						window.open(senangpayUrl);
						document.getElementById("paycart").disabled = true;
						
					}else{
						
					}
				
				} else if (xhr.status == 404) {
					alert("Fail to connect to our server");
				} else {
					alert("Fail to connect to our server");
				}
			}
		xhr.send(dataTopost);
	}
	
	if(proceed == true){
			if(requireteleconsultation == true){
				var patientSickness = "Require tele consultation";
				var patientdatetime = "Server Side";
				initiateChatCart(cartDocid, cartData.total_price_original, purchaseoff, patientdatetime, "both");
			}else{
				console.log(finalizeDelyvacreatedata);
				var delyvaCreatedata = btoa(JSON.stringify(finalizeDelyvacreatedata));
				var orderData = JSON.stringify(cartData);
				var deliverPrice = parseFloat(document.getElementById("deliveryprice").innerHTML);
				var dataTopost = 'api=1&auth_token='+authUser.login_token+"&processorder="+orderData+"&lat="+firstItemLat+"&lng="+firstItemLng+"&restaurantid="+cartrestaurantid+"&paymentmethod="+paymentmethod+"&cart_price="+cartData.total_price_entry+"&delivery_lat="+delyvaDeliverylat+"&delivery_lng="+delyvaDeliverylng+"&deliveryPrice="+deliverPrice+'&promo='+deliveryDiscount+"&restaurantprofit="+cartData.total_price_original+"&requireteleconsultation="+requireteleconsultation+"&docid="+cartDocid+"&docearning="+ifgotpresscheckprice+"&deliverytype="+deliveryType+"&purchaseoff="+selectedServicecode+"&delyvacreatedata="+delyvaCreatedata;
				var xhr = new XMLHttpRequest();
				xhr.open("POST", serverUrl, true);
				xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
				xhr.onload = function(){
					if (xhr.status == 200) {
						var json = xhr.responseText;
						var response = JSON.parse(json);
						loadingResponse(response.message);
						if(response.status == "Successful"){
							if(requireteleconsultation == true){
								closeLoading();
								openpage('sessioncontroller', response.order_id, cartDocid);
							}else{
								openOrder(response.order_id);
								document.getElementById("paycart").disabled = true;
							}
						}else{
							
						}
					} else if (xhr.status == 404) {
						alert("Fail to connect to our server");
					} else {
						alert("Fail to connect to our server");
					}
				}
				xhr.send(dataTopost);
			}
	}
}
