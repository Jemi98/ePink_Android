function initWallet(){
	showLoading();
    var dataTopost = "api=" + apiVersion + "&auth_token=" + authUser.login_token + "&walletusers=true";
    var users = new XMLHttpRequest();
    users.open("POST", serverUrl, true);
    users.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    users.onload = function() {
        if (users.status == 200) {
            var json = users.responseText;
            var response = JSON.parse(json);
			if(response.status == "success"){
				document.getElementById("userwalletbalance").innerHTML = response.wallet;
				closeLoading();
			}else{
				loadingResponse(response.message);
				openpage("setting");
			}
           
        } else if (users.status == 404) {
            alert("Fail to connect to our server");
        }
    }
    users.send(dataTopost);
	dataTopost = "api=" + apiVersion + "&auth_token=" + authUser.login_token + "&topUpHistory=true";
	users1 = new XMLHttpRequest();
	users1.open("POST", serverUrl, true);
	users1.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
	users1.onload = function() {
		if (users1.status == 200) {
			var json = users1.responseText;
			var response = JSON.parse(json);
			console.log(response);
			if(response.status == "success"){
				response.data.forEach(function (row){
					var node=document.createElement("tr");
					node.innerHTML="<td>"+row.amount+"</td>" +
						"<td>"+row.senang_date+"</td>" +
						"<td>"+row.order_status+"</td>";
					node.addEventListener("click",function (){openpage("topupdetails",row.id)});
					document.getElementById("topUpHistory").appendChild(node);
				});
			}

		} else if (users1.status == 404) {
			alert("Fail to connect to our server");
		} else {
			alert("Fail to connect to our server");
		}
	}
	users1.send(dataTopost);


}

function spinitWallet(){
	showLoading();
	var today = new Date();
	if(authUser.type == 2){
		document.getElementById("spwalletsettingheader").innerHTML = '<li onclick="openpage(\'runnerprofile\')"><a href="#!" id="lang_navigation_view_my_order_list" class="pink-text nav-text strong"><i class="material-icons left">arrow_back</i>My Wallet</a></li>';
		hide("spwalletbottomnav");
	}else{
		document.getElementById("spwalletsettingheader").innerHTML = '<li><a href="#!" id="lang_navigation_view_my_order_list" class="pink-text nav-text strong"><i class="material-icons left">account_balance_wallet</i>My Wallet</a></li>';
	}
	var lastDayOfMonth = new Date(today.getFullYear(), today.getMonth()+1, 0);
	document.getElementById("lastdayofthemonth").innerHTML = lastDayOfMonth;
    var dataTopost = "api=" + apiVersion + "&auth_token=" + authUser.login_token + "&walletusers=true";
    var users = new XMLHttpRequest();
    users.open("POST", serverUrl, true);
    users.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    users.onload = function() {
        if (users.status == 200) {
            var json = users.responseText;
            var response = JSON.parse(json);
			if(response.status == "success"){
				document.getElementById("spwalletbalance").innerHTML = response.wallet;
				if(response.transaction_history != "Empty"){
					var tr = response.transaction_history
					document.getElementById("sptransactionhistory").innerHTML = '';
					for (let i = 0; i < tr.length; i++) {
						if(tr[i].to_user == authUser.id){
							var operation = '+';
							var transactioncolor = "green-text";
						}else{
							var operation = '-';
							var transactioncolor = "red-text";
						}
					  	document.getElementById("sptransactionhistory").innerHTML += '<div class="card" onclick="openpage(`transactiondetails`,'+tr[i].id+')" style="border-radius: 8px"><div class="card-content" style="padding:15px"><p><span class="'+transactioncolor+'">'+operation+'RM'+tr[i].amount+'</span> <span class="right">'+tr[i].transaction_date+'</span></p></div></div>';
					}
				}else{
					document.getElementById("sptransactionhistory").innerHTML = '<div class="card"  style="border-radius: 8px"><div class="card-content" style="padding:15px"><p><span class="'+transactioncolor+'">No Recent Transaction</span></p></div></div>';
				}
				closeLoading();
			}else{
				loadingResponse(response.message);
				openpage("setting");
			}
           
        } else if (users.status == 404) {
            alert("Fail to connect to our server");
        } else {
            alert("Fail to connect to our server");
        }
    }
    users.send(dataTopost);
}

function inispWalletSetting(){
	showLoading();
	var dataTopost = "api=" + apiVersion + "&auth_token=" + authUser.login_token + "&spwalletsetting=true";
    var users = new XMLHttpRequest();
    users.open("POST", serverUrl, true);
    users.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    users.onload = function() {
        if (users.status == 200) {
            var json = users.responseText;
            var response = JSON.parse(json);			
				document.getElementById("sp_bank_name").value = response.bank_name;
				document.getElementById("sp_bank_number").value = response.bank_account_number;
				closeLoading();
        } else if (users.status == 404) {
            alert("Fail to connect to our server");
        } else {
            alert("Fail to connect to our server");
        }
    }
    users.send(dataTopost);
}
function updateGlobalwallet(){
    var dataTopost = "api=" + apiVersion + "&auth_token=" + authUser.login_token + "&walletusers=true";
    var users = new XMLHttpRequest();
    users.open("POST", serverUrl, true);
    users.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    users.onload = function() {
        if (users.status == 200) {
            var json = users.responseText;
            var response = JSON.parse(json);
			if(response.status == "success"){
				document.getElementById("userwalletbalance").innerHTML = response.wallet;
				document.getElementById("landingbalance").innerHTML = response.wallet;
				document.getElementById("homepageuserwalletbalance").innerHTML = 'RM'+response.wallet;
				authUser.wallet = parseFloat(response.wallet);
			}else{
				
			}
           
        } else if (users.status == 404) {
            alert("Fail to connect to our server");
        } else {
            alert("Fail to connect to our server");
        }
    }
    users.send(dataTopost);
}
function requestTopupsession(amount){
	showLoading();
	if(authUser.phonenumber != "" || authUser.phonenumber != null){
		var toupamount = document.getElementById("topupamount").value;
		if(toupamount >= 10){
			
			var dataTopost = "api=" + apiVersion + "&auth_token=" + authUser.login_token + "&requesttopupsession="+toupamount+"&topuptype=wallet";
			var xhr = new XMLHttpRequest();
			xhr.open("POST", serverUrl, true);
			xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
			xhr.onload = function() {
				if (xhr.status == 200) {
					var json = xhr.responseText;
					var response = JSON.parse(json);
					if(response.status == "success"){
						//openTopupbrowser(response.orderid);
						//var senangpayUrl = 'https://epink.health/senangpay/index.php?sessionid='+response.orderid
						var senangpayUrl = 'https://epink.health/senangpay/index.php?sessionid='+response.orderid;
						openBrowserNew(senangpayUrl);
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
		}else{
			loadingResponse("Minimum top up amount is RM10");
		}
	}else{
		alert("Please configure your number phone");
	}
}

function requestTopupsessionIOUPAY(amount){
	
	if(authUser.phonenumber != "" || authUser.phonenumber != null){
		var toupamount = parseFloat(document.getElementById("topupamount").value);
		if(toupamount >= 10){
			
			var dataTopost = "api=" + apiVersion + "&auth_token=" + authUser.login_token + "&requesttopupsessioniou="+toupamount+"&topuptype=wallet";
			var xhr = new XMLHttpRequest();
			xhr.open("POST", serverUrl, true);
			xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
			xhr.onload = function() {
				if (xhr.status == 200) {
					var json = xhr.responseText;
					var response = JSON.parse(json);
					if(response.status == "success"){
						//openTopupbrowser(response.orderid);
						//var senangpayUrl = 'https://epink.health/senangpay/index.php?sessionid='+response.orderid
						var ioupay = 'https://epink.health/ioupay/'+response.orderid+'/';
						openBrowserNew(ioupay);
						
					}else{
						instaResponse(response.message);
					}
				} else if (xhr.status == 404) {
					alert("Fail to connect to our server");
				} else {
					alert("Fail to connect to our server");
				}
			}
			xhr.send(dataTopost);
		}else{
			instaResponse("Minimum top up amount is RM10");
		}
	}else{
		instaResponse("Please configure your number phone");
	}
}