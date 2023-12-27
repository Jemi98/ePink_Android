var currentOrder;
function cancelorder(){
	clearTimeout(orderStatusupdate);
	showLoading();
	var dataTopost = 'api=1&auth_token='+authUser.login_token+"&cancelorder="+currentOrder;
		var xhr = new XMLHttpRequest();
		xhr.open("POST", serverUrl, true);
		xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
		xhr.onload = function() {
			if (xhr.status == 200) {
				var json = xhr.responseText;
				var response = JSON.parse(json);
				loadingResponse(response.message);
				openpage("viewmyorder");
			} else if (xhr.status == 404) {
				alert("Fail to connect to our server");
			} else {
				alert("Fail to connect to our server");
			}
		}
		xhr.send(dataTopost);
}
function retriveOrders(){
	showPurchase('new');
	document.getElementById("listcompleted").innerHTML ="";
	document.getElementById("listinprogress").innerHTML = "";
	document.getElementById("listinprogress").innerHTML ='<br><center><div class="preloader-wrapper small active"><div class="spinner-layer spinner-green-only"><div class="circle-clipper left"><div class="circle"></div></div><div class="gap-patch"><div class="circle"></div></div><div class="circle-clipper right"><div class="circle"></div></div></div></div><br><br></center>';
	document.getElementById("listcompleted").innerHTML ='<br><center><div class="preloader-wrapper small active"><div class="spinner-layer spinner-green-only"><div class="circle-clipper left"><div class="circle"></div></div><div class="gap-patch"><div class="circle"></div></div><div class="circle-clipper right"><div class="circle"></div></div></div></div><br><br></center>';
	
    var dataTopost = "api=1&auth_token=" + authUser.login_token + "&viewallorders=true";
    var orders = new XMLHttpRequest();
    orders.open("POST", serverUrl, true);
    orders.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    orders.onload = function() {
        if (orders.status == 200) {
            var json = orders.responseText;
            var response = JSON.parse(json);
			var i;
			var inprogressCount = 0;
			var completedCount = 0;
			var inprogress = 0;
			if(response.status == null){
				document.getElementById("listinprogress").innerHTML = "";
				document.getElementById("listcompleted").innerHTML = "";
			for (i = 0; i < response.length; i++) {
				if(response[i].order_status == "Completed" || response[i].order_status == "Canceled"){
					completedCount++;
					document.getElementById("listcompleted").innerHTML += '<li class="collection-item borderless" style="border: 0px" onclick="openOrder('+response[i].id+')"><div class="card card-rounded"><div class="card-content"><p ><span class="strong">PURCHASE ID: '+response[i].id+'</span> <span class="right ">Status: '+response[i].order_status+'</span></p>'+response[i].order_date+'</div></div></li>';
				}else{
					inprogress++;
					document.getElementById("listinprogress").innerHTML += '<li class="collection-item borderless" style="border: 0px" onclick="openOrder('+response[i].id+')"><div class="card card-rounded"><div class="card-content"><p ><span class="strong">PURCHASE ID: '+response[i].id+'</span> <span class="right ">Status: '+response[i].order_status+'</span></p>'+response[i].order_date+'</div></div></li>';
				}
				
				
			}
			if(completedCount == 0){
				document.getElementById("listcompleted").innerHTML = '<li class="collection-item borderless"><div class="card card-rounded"><div class="card-content center"><i class="material-icon pink-text">assignment_late</i><p class="pink-text strong">You have no order history</p></div><div></li>';
			}
			if(inprogress == 0){
				document.getElementById("listinprogress").innerHTML = '<li class="collection-item borderless"><div class="card card-rounded"><div class="card-content center"><i class="material-icon pink-text">assignment_late</i><p class="pink-text strong">You have no order history</p></div><div></li>';
			}
			}else{

				document.getElementById("listcompleted").innerHTML = '<li class="collection-item"><p class="strong black-text">You havent made any purchases</p></li>';

			}
			if(inprogress == 0){
				document.getElementById("listinprogress").innerHTML = '<li class="collection-item"><p class="strong black-text">You have no new order</p></li>';
			}
        } else if (orders.status == 404) {
            alert("Fail to connect to our server");
        } else {
            alert("Fail to connect to our server");
        }
    }
    orders.send(dataTopost);
}

function openOrder(id){
	currentOrder = id;
	activePage = "viewingorderinfo";
	console.log(activePage);
	document.getElementById("loading-response").style.display = "none";
	showLoading();
	show("orderdetail");
	hide("viewmyorder");
	hide("usercart");
	var dataTopost = "api=1&auth_token=" + authUser.login_token + "&vieworder="+id;
	var xhr = new XMLHttpRequest();
	xhr.open("POST", serverUrl, true);
	xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
	xhr.onload = function() {
		if (xhr.status == 200) {
			var json = xhr.responseText;
			var response = JSON.parse(json);
			var orderdata = JSON.parse(response.data);
			console.log(orderdata);
			console.log(orderdata.job_type);
			console.log(response.deliverytype);
			if(orderdata.job_type == "Goods Delivery"){
			if(response.order_status == "New"){
					document.getElementById("orderstatus").innerHTML = '<center><h4 class="strong">Order received</h4><p>Your order has been recieved.</p><br/></center>';
					document.getElementById("cancelorder").disabled = false;
					orderStatusupdate = updateOrderstatus(response.id);
			}else if(response.order_status == "Accepted"){
					document.getElementById("orderstatus").innerHTML = '<center><h4 class="strong">Accepted </h4><p>Your request accepted by ePink delivery partner.</p><br/></center>';
					document.getElementById("cancelorder").disabled = true;
					orderStatusupdate = updateOrderstatus(response.id);
			}else if(response.order_status == "Preparing"){
					document.getElementById("orderstatus").innerHTML = '<center><h4 class="strong">Preparation</h4><p>Our pharmacist is preparing your order.</p><br/></center>';
					document.getElementById("cancelorder").disabled = true;
					orderStatusupdate = updateOrderstatus(response.id);
			}else if(response.order_status == "Delivering"){
					document.getElementById("orderstatus").innerHTML = '<img src="img/status_delivery.jpg" class="responsive-img"><center><h4 class="strong">Delivery</h4><p>Runner on the way to deliver your order.</p><br/></center>';
					document.getElementById("cancelorder").disabled = true;
					orderStatusupdate = updateOrderstatus(response.id);
			}else if(response.order_status == "Completed"){
					document.getElementById("orderstatus").innerHTML = '<img src="img/status_delivery.jpg" class="responsive-img"><center><h4 class="strong">Order Completed</h4><p>This order has been completed.</p><br/></center>';
					document.getElementById("cancelorder").disabled = true;
					orderStatusupdate = updateOrderstatus(response.id);
			}else if(response.order_status == "Ready for pickup"){
					if(response.deliverytype == "pickup"){
						document.getElementById("orderstatus").innerHTML = '<center><h4 class="strong">Ready For Pickup </h4><p>Your medication has been prepared by the pharmacy. Please pick it up</p><br/></center>';
						document.getElementById("cancelorder").disabled = true;
						orderStatusupdate = updateOrderstatus(response.id);
					}else{
						document.getElementById("orderstatus").innerHTML = '<center><h4 class="strong">Ready For Pickup </h4><p>Waiting for rider to pick up your order</p><br/></center>';
						document.getElementById("cancelorder").disabled = true;
						orderStatusupdate = updateOrderstatus(response.id);
					}
					
			}else if(response.order_status == "3rd Party"){
					document.getElementById("orderstatus").innerHTML = '<center><h4 class="strong">Ready For Pickup </h4><p>Waiting for rider to pick up your order</p><br/></center>';
					document.getElementById("cancelorder").disabled = true;
					orderStatusupdate = updateOrderstatus(response.id);
			}else{
					document.getElementById("orderstatus").innerHTML = '<img src="img/status_delivery.jpg" class="responsive-img"><center><h4 class="strong">Order Canceled</h4><p>This order has been canceled</p><br/></center>';
			}
			var cartItem = orderdata.cartitem;
			document.getElementById("ordercartitem").innerHTML = "";
			var totalPricecur = 0.00;
			var i;
			for (i = 0; i < cartItem.length; i++) {
				
				var curQuan = parseInt(cartItem[i].quantity);
				
				if(cartItem[i].addon == null || cartItem[i].addon == undefined || cartItem[i].addon == "undefined"){
					addonlist = 'No addon';
				}else{
					var addonlist = '';
					var addondata = JSON.parse(cartItem[i].addon);
					var x;
					for (x = 0; x < addondata.length; x++){
						if(addondata[x].checked == true){
						addonlist += '<p>-'+addondata[x].name+'</p>';
						}
					}
				}
				
				var quantityPrice = curQuan * cartItem[i].product_price;
				quantityPrice = quantityPrice.toFixed(2);
				totalPricecur = parseFloat(totalPricecur) + parseFloat(quantityPrice);
				document.getElementById("ordercartitem").innerHTML += '<li class="collection-item"><b>'+cartItem[i].product_name+'</b> <span class="right">'+curQuan+' Set</span><p class="strong">Addon</p> '+addonlist+'</li>';
			}
			var promoAmount = parseFloat(response.promo) * parseFloat(response.delivery_price) / 100;
			var priceAfterPromo = response.delivery_price - promoAmount; 
			var totalPricer = parseFloat(response.cart_price) + parseFloat(priceAfterPromo) 
			document.getElementById("orderdetailprice").innerHTML = response.cart_price;
			document.getElementById("orderdetaildelicost").innerHTML = priceAfterPromo.toFixed(2);
			document.getElementById("orderdetaildelipromo").innerHTML = response.promo+'%';
			document.getElementById("orderdetailtotalpriceview").innerHTML = totalPricer.toFixed(2);
				show("gooddeliverypricing");
				show("gooddeliveryinfo");
				show("ordercartitem");
				hide("parceldeliveryinfo");
				console.log(response.deliverytype);
				if(response.deliverytype == "pickup"){
					show("customerpickupaddress");
					var vendorinfo = orderdata.vendorInformation;
					document.getElementById("customerpickupaddress").innerHTML = '<p class="">Pick up your item</p><p class="strong">'+vendorinfo.vendor_name+'</p><p>Address: '+vendorinfo.vendor_address+'</p>'
				}else{
					hide("customerpickupaddress");
				}
			}else{
				show("parceldeliveryinfo");
				hide("gooddeliverypricing");
				hide("gooddeliveryinfo");
				hide("ordercartitem");
				console.log(response.data);
				var parceldata = JSON.parse(response.data);
				document.getElementById("parceldeliveryinfo").innerHTML = '<p class="strong">Pick Up & delivery request  <span class="right">Status: <span>'+response.order_status+'</span></span></p>';
				document.getElementById("parceldeliveryinfo").innerHTML += '<p class="strong">Pick Up</p>';
				document.getElementById("parceldeliveryinfo").innerHTML += parceldata.pickup_location;
				document.getElementById("parceldeliveryinfo").innerHTML += '<p class="strong">Drop Off</p>';
				document.getElementById("parceldeliveryinfo").innerHTML += parceldata.drop_location;
				document.getElementById("parceldeliveryinfo").innerHTML += '<p class="strong">Message to rider</p>';
				document.getElementById("parceldeliveryinfo").innerHTML += parceldata.user_message;
				document.getElementById("parceldeliveryinfo").innerHTML += '<p class="strong">Price: RM '+parceldata.delivery_price.toFixed(2)+'</p>';
				
				
				document.getElementById("cancelorder").disabled = false;
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
var orderStatusupdate;
var waitTime = 1000;
function updateOrderstatus(id){
	var odis = document.getElementById("orderdetail").style.display;
	console.log(odis);
	if(odis == "block"){
	var dataTopost = "api=1&auth_token=" + authUser.login_token + "&orderstatus="+id;
	var xhr = new XMLHttpRequest();
	xhr.open("POST", serverUrl, true);
	xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
	xhr.onload = function() {
		if (xhr.status == 200) {
			var json = xhr.responseText;
			var response = JSON.parse(json);
			var orderdata = JSON.parse(response.data);
				if(response.order_status == "New"){
					
					var view = document.getElementById("orderstatus").innerHTML;
					
					if(view != '<img src="img/status_preparing.jpg" class="responsive-img"><center><h4 class="strong">Order received</h4><p>Your order has been recieved.</p><br/></center>'){
						
						view = '<img src="img/status_preparing.jpg" class="responsive-img"><center><h4 class="strong">Order received</h4><p>Your order has been recieved.</p><br/></center>';
						document.getElementById("cancelorder").disabled = false;
					}
					
					setTimeout(function(){ updateOrderstatus(id); }, waitTime);
				}else if(response.order_status == "Preparing"){
					var view = document.getElementById("orderstatus").innerHTML;
					
					if(view != '<img src="img/status_preparing.jpg" class="responsive-img"><center><h4 class="strong">Preparation</h4><p>Preparing your order.</p><br/></center>'){
						
						view = '<img src="img/status_preparing.jpg" class="responsive-img"><center><h4 class="strong">Preparation</h4><p>Preparing your order.</p><br/></center>';
						document.getElementById("cancelorder").disabled = true;
					}
					
					setTimeout(function(){ updateOrderstatus(id); }, waitTime);
				}else if(response.order_status == "Delivering"){
					var view = document.getElementById("orderstatus").innerHTML;
					
					if(view != '<img src="img/status_delivery.jpg" class="responsive-img"><center><h4 class="strong">Delivery</h4><p>Runner on the way to deliver your order.</p><br/></center>'){
						
						view = '<img src="img/status_delivery.jpg" class="responsive-img"><center><h4 class="strong">Delivery</h4><p>Runner on the way to deliver your order.</p><br/></center>';
						
					}
					document.getElementById("cancelorder").disabled = true;
					setTimeout(function(){ updateOrderstatus(id); }, waitTime);
				}else if(response.order_status == "Accepted"){
					var view = document.getElementById("orderstatus").innerHTML;
					
					if(view != '<img src="img/status_delivery.jpg" class="responsive-img"><center><h4 class="strong">Delivery</h4><p>Runner on the way to deliver your order.</p><br/></center>'){
						
						view = '<img src="img/status_delivery.jpg" class="responsive-img"><center><h4 class="strong">Delivery</h4><p>Runner on the way to deliver your order.</p><br/></center>';
						
					}
					document.getElementById("cancelorder").disabled = true;
					setTimeout(function(){ updateOrderstatus(id); }, waitTime);
				}else if(response.order_status == "Ready for pickup"){
					var view = document.getElementById("orderstatus").innerHTML;
					
					if(view != '<center><h4 class="strong">Ready For Pickup </h4><p>Waiting for rider to pick up your order</p><br/></center>'){
						
						view = '<center><h4 class="strong">Ready For Pickup </h4><p>Waiting for rider to pick up your order</p><br/></center>';
						
					}
					document.getElementById("cancelorder").disabled = true;
					setTimeout(function(){ updateOrderstatus(id); }, waitTime);
				}else if(response.order_status == "3rd Party"){
					var view = document.getElementById("orderstatus").innerHTML;
					
					if(view != '<center><h4 class="strong">Ready For Pickup </h4><p>Waiting for rider to pick up your order</p><br/></center>'){
						
						view = '<center><h4 class="strong">Ready For Pickup </h4><p>Waiting for rider to pick up your order</p><br/></center>';
						
					}
					document.getElementById("cancelorder").disabled = true;
					setTimeout(function(){ updateOrderstatus(id); }, waitTime);
				}else if(response.order_status == "3rd Party"){
					var view = document.getElementById("canceled").innerHTML;
					
					if(view != '<center><h4 class="strong">Ready For Pickup </h4><p>Waiting for rider to pick up your order</p><br/></center>'){
						
						view = '<center><h4 class="strong">Ready For Pickup </h4><p>Waiting for rider to pick up your order</p><br/></center>';
						
					}
					document.getElementById("cancelorder").disabled = true;
					setTimeout(function(){ updateOrderstatus(id); }, waitTime);
				}else{
					document.getElementById("cancelorder").disabled = true;
					document.getElementById("orderstatus").innerHTML = '<img src="img/status_delivery.jpg" class="responsive-img"><center><h4 class="strong">Order Completed</h4><p>This order has been completed</p><br/></center>';
					clearTimeout(orderStatusupdate);
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