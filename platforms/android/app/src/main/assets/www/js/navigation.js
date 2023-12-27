var activePage ='';
var careservicenameReqeust = '';
var backFromreferallx;
function backFromRefferal(){
	if(backFromreferallx == 'doc'){
		openpage("docsetting");
	}else if(backFromreferallx == 'pharma'){
		openpage("pharmamenus");
	}else{
		openpage("setting");
	}
}
function openpage(page, identifier, id){
	document.getElementById(page).style.width = "100%";
	showLoading();
	var pageToOpen = page;
	var pages = ["homepage", "profile", "auth", "logout","transactiondetails", "setting","topupdetails", "profilemanagement", "languagesettingwindow", "privacypage", "termandconditionpage", "notificationlist", "notificationview", "chatlists", "chatcontent", "postproduct", "viewproduct", "viewmyorder", "mysales", "splash", "myshoproduct", "usercart", "runner", "runnerprofile", "restaurantorders", "landing", "rider", "mart", "walletpage", "cardpage", "appmap", "doctorintro", "prescriptions", "docdashboard",  "healthtracker", "carerequestlist", "sessioncontroller", "docsession", "docsessionview", "docsetting", "docwallet", "updateapp", "medjourney", "elabservice", "elabresults", "viewlabreport", "carenewpage", "doctoractivation", "serviceproviderselection", "universalserviceprovider", "carerequestdetail", "carenewstatus", "spprofilemanagement", "spwalletpage", "spwalletsetting", "riderdashboard", "vendorordermanager", "pharmaorderview", "viewproductrestaurant", "deliveryinfo", "riderprofilemanagement", "spreferral", "nolocation", "pharmamenus", "instaswab", "canvascam", "reverify", "linkcompany", "organizationinfo", "categorymanager", "EditPharmaorganization", "consultation", "telemedconsent", "cusoultationtelewait", "viewproductpc", "specialistverification", "sendspecialistverification", "vaccinecertificatelist", "categorywindow", "careviewbydoc", "carechatcontent", "pharmacynearby", "rideractivation", "pharmacyaddressfinalizer", "searchwindow", "currierselector", "emergency"];
	hide("vendor");
	hide("viewproduct");
	document.getElementById("productorderamounts").value = "";
	var pagecounter;
	for (pagecounter = 0; pagecounter < pages.length; pagecounter++) { 
		if(pageToOpen == pages[pagecounter]){
			activePage = pageToOpen;
			if(!authUser && pageToOpen!="landing" && pageToOpen!="auth"){
				location.reload()
				return;

			}
			if(pageToOpen == "categorymanager"){
				initCategorylist();
			}
			if(pageToOpen == "rideractivation"){
				initRideractivation();
			}
			if(pageToOpen == "emergency"){
				initEmergency();
			}
			if(pageToOpen == "careviewbydoc"){
				doctorviewcareRequest(identifier);
			}
			if(pageToOpen == "cusoultationtelewait"){
				
				currentlyviewingnewcare = identifier;
				initCarewait(identifier);
			}
			if(pageToOpen == "EditPharmaorganization"){
				initEditPharmaorganization();
			}	
			if(pageToOpen == "pharmacyaddressfinalizer"){
				initPharamcyDeliveryaddressFinalizaer();
			}				
			
			if(pageToOpen == "viewproductpc"){
				openProductPc(identifier);
			}			
			if(pageToOpen == "specialistverification"){
				initSpecialistVerificationRequest();
			}
			if(pageToOpen == "riderprofilemanagement"){
				initRiderSetting();
			}
			
			if(pageToOpen == "organizationinfo"){
				initOrganizationinfo();
			}			
			if(pageToOpen == "consultation"){
				if(identifier != null){
					document.getElementById("cProblem").value = identifier;
				}
				initConsult();
			}
			
			if(pageToOpen == "canvascam"){
				startCanvascam();
			}			
			
			if(pageToOpen == "linkcompany"){
				initLinkcompany();
			}
			
			if(pageToOpen == "instaswab"){
				initeSwabtest();
			}
			if(pageToOpen == "spwalletsetting"){
				inispWalletSetting();
			}			
			if(pageToOpen == "spreferral"){
				initReferall();
				backFromreferallx = identifier;
			}
			
			if(pageToOpen == "deliveryinfo"){
				initDeliveryInfo(identifier, id);
			}
			if(pageToOpen == "vendorordermanager"){
				initVendorOrder();
			}
			if(pageToOpen == "viewproductrestaurant"){
				openeditProduct(identifier);
			}
			if(pageToOpen == "pharmaorderview"){
				initOrderView(identifier, id);
			}
			if(pageToOpen == "carenewstatus"){
				userViewingCarestatus = id;
				if(id == "Doctor"){
					document.getElementById("backcare").innerHTML = '<a href="#!" id="lang_navigation_view_my_order_list" class="pink-text nav-text strong" onclick="openpage(\'universalserviceprovider\')"><i class="material-icons left">arrow_back</i>Request Detail</a>';
					
				}else{
					document.getElementById("backcare").innerHTML = '<a href="#!" id="lang_navigation_view_my_order_list" class="pink-text nav-text strong" onclick="openpage(\'carerequestlist\')"><i class="material-icons left">arrow_back</i>Request Detail</a>';
				}
				currentlyviewingnewcare = identifier;
				initcustomerCareview(identifier, id);
			}
			if(pageToOpen == "landing"){
				document.getElementById("selectedpickuplocationrunner").innerHTML = "Pick up location not set";
				document.getElementById("selecteddropofflocationrunner").innerHTML = "Drop off location not set";
				if(authUser){
					updateGlobalwallet();
				}
				initHealthkit();
				localStorage.setItem("filter", "undefined");
			}
			if(pageToOpen == "serviceproviderselection"){
				initServiceprovidercheck();
			}
			if(pageToOpen == "carerequestdetail"){
				currentlyviewingnewcare = identifier;
				initcareRequestdetail(identifier);
				careservicenameReqeust = id;
				backcarecategory = id;
				hide("searchcareresult");
			}		
			
			if(pageToOpen == "riderdashboard"){
				initRiderJob();
			}
			if(pageToOpen == "universalserviceprovider"){
				show("listofcarequestuniversal");
				hide("listofcarequestuniversalaccepted");
				universalServiceprovider();
			}
			if(pageToOpen == "elabresults"){
				initElabResult();
			}
			if(pageToOpen == "doctoractivation"){
				//initDoctorActivation();
			}
			
			if(pageToOpen == "viewlabreport"){
				viewLabResult(identifier);
			}
			
			
			if(pageToOpen == "elabservice"){
				initElab();
			}
			if(pageToOpen == "carenewpage"){
				initCarenew(identifier)
				backcarecategory = id
			}
		
			if(pageToOpen == "carerequestlist"){
				initCarerequest();
			}
			if(pageToOpen == "medjourney"){
				initMedjourney();
			}					

			if(pageToOpen == "sessioncontroller"){
				selectCurrierFrom = "telconsultant";
				viewUsersession(identifier);
				document.getElementById("sessionaddress").innerHTML = "Click to set";
			}				
			if(pageToOpen == "docsession"){
				prescribedMed = [];
				docDiognosage = "";
				document.getElementById("patientdiaog").value = "";
				document.getElementById("prescribedmed").innerHTML = '<li class="collection-item">No selected medicine</li>';
				
				initDocsession();
			}				
			if(pageToOpen == "docsessionview"){
				docsessioncontroller(identifier);
			}		
			if(pageToOpen == "healthtracker"){
				initHealthtracker();
			}			
			if(pageToOpen == "prescriptions"){
				initPrescription();
			}
			if(pageToOpen == "appmap"){
				initMap(appLat, appLng);
			}
			if(pageToOpen == "mart"){
				initMart();
			}
			if(pageToOpen == "walletpage"){
				initWallet();
			}
			if(pageToOpen == "spwalletpage"){
				spinitWallet();
			}
			if(pageToOpen == "runnerprofile"){
				initRunnerProfile();
			}
			if(pageToOpen == "mysales"){
				hide("myshoporders");
				show("myproductlist");
				
				initshopProduct();
				
			}
			if(pageToOpen == "usercart"){
				selectCurrierFrom = "cart";
				document.getElementById("totalpriceincart").innerHTML = "0.00";
				updateGlobalwallet();
				initCart();
			}
			if(pageToOpen == "rider"){
				initRider();
			}
			if(pageToOpen == "myshoproduct"){
				
			}
			if(pageToOpen == "viewmyorder"){
				clearTimeout(orderStatusupdate);
				hide("orderdetail");
				retriveOrders();
			}
			
			if(pageToOpen == "cardpage"){
				initCardpage();
			}
			
			if(pageToOpen == "logout"){
				localStorage.removeItem(app.name+"_login_token");
				localStorage.removeItem("todaycordinate");
				location.reload();
			} 
			if(pageToOpen == "viewproduct"){
				
				document.getElementById("productpicture").src = "";
				initviewProduct(identifier);
			}
			if(pageToOpen == "pharmacynearby"){
				initPharmacynearby()
			}
			if(pageToOpen == "homepage"){
				if(identifier == "clear"){
					clearCatergory();
				}
				document.getElementById("productpicture").innerHTML = '<img id="" src="img/default_product_picture.png" width="100%">';
				initHomepage();
				hide("viewingcart");
			}
			if(pageToOpen == "postproduct"){
				initFormpose();
			}
			if(pageToOpen == "vaccinecertificatelist"){
				initiateVaccinelist();
			}
			if(pageToOpen == "telemedconsent"){
				initTeleconsent();
			}
			if(pageToOpen == "privacypage"){
				initPrivacyPolicypage();
			}
			if(pageToOpen == "termandconditionpage"){
				initTnCpage();
			}
			if(pageToOpen == "profile"){
				if(identifier == null){
					initProfile();
					document.getElementById("profilesettingbutton").style.display = "block";
				}else{
					document.getElementById("profilesettingbutton").style.display = "none";
					inituserProfile(identifier);
				}
			}
			if(pageToOpen == "setting"){
				initSetting();
			}
			if(pageToOpen == "profilemanagement"){
				initSetting();
			}
			if(pageToOpen == "notificationview"){
				openNotification(identifier);
			}
			if(pageToOpen == "notificationlist"){
				initNotification();
			}
			if(pageToOpen == "chatlists"){
				hide("chatlistcompleted");
				show("chatlistingcontent");
				initChatlist();
				chatisActive = false;
				lastChatid = 0;
				clearTimeout(chatCheck);
			}			
			if(pageToOpen == "docsession"){
				initDocsession();
				chatisActive = false;
				lastChatid = 0;
				clearTimeout(chatCheck);
			}
			
			if(pageToOpen == "chatcontent"){
				getChat(identifier);
				getChatpartner(id);
				activeChatid = identifier;
			}
			if(pageToOpen == "carechatcontent"){
				opencarechat();
				activeCareChatid = identifier;
			}
			if(pageToOpen == "restaurantorders"){
				initRestaurantOrders();
			}			
			if(pageToOpen == "docdashboard"){
				initDocdashboard();
			}			
			
			if(pageToOpen == "spprofilemanagement"){
				initSpProfilemanager();
			}
			if (pageToOpen=="topupdetails"){
				initTopUpDetails(identifier);
				console.log(identifier);
			}

			if (pageToOpen=="transactiondetails"){
				initTransactionDetails(identifier);

			}
			//Show pages equal to the page user try to open
			document.getElementById(pages[pagecounter]).style.display = "block";
		}else{
			//Hide pages not equal to the page user try to open
			document.getElementById(pages[pagecounter]).style.display = "none";
		}
		closeLoading();
		
	}
	console.log(activePage);
	document.getElementById("totalpricepreview").innerHTML = "0.00";
	document.getElementById("productorderamounts").value = "";
    setTimeout(function (){ document.getElementById(page).style.width = "100%";}, 100 );
	window.scrollTo(0,0);
	
}

function initReferall(){
	
}
function changeLanguage(lang){
	localStorage.setItem(app.name+"_language", lang);
	location.reload();
}
function translateApps(){
	if(app.language == "MY"){
		//document.getElementById("").innerHTML = '';
		//Login Page
		document.getElementById("lang_login_button_string").innerHTML = 'Daftar Masuk';
		document.getElementById("lang_login_button_string").innerHTML = 'Daftar Masuk';
		document.getElementById("lang_login_new_here").innerHTML = 'Baru disini?';
		document.getElementById("lang_login_go_to_register").innerHTML = 'Daftar akaun di sini';
		document.getElementById("lang_login_forgot_password").innerHTML = 'Lupa kata laluan?';
		document.getElementById("lang_login_password").innerHTML = 'Kata Laluan';
		document.getElementById("login_notes").innerHTML = 'Daftar masuk ke akaun anda';
		//Register
		
		//Recovery page
		document.getElementById("recover_notes").innerHTML = 'Peringatan kata laluan';
		document.getElementById("recoversubmit").innerHTML = 'Hantar';
		document.getElementById("openloginformrecovery").innerHTML = 'Kembali ke laman log masuk';
		
		//Side Navigation
		document.getElementById("lang_nav_homepage").innerHTML = 'Laman Utama';
		document.getElementById("lang_nav_notfication").innerHTML = 'Notifikasi';
		document.getElementById("lang_nav_profile").innerHTML = 'Profile';
		document.getElementById("lang_nav_setting").innerHTML = 'Penetapan';
		document.getElementById("lang_nav_logout").innerHTML = 'Daftar Keluar';
		//Setting page
		document.getElementById("lang_navigation_setting").innerHTML = 'Tetapan Aplikasi';
		document.getElementById("lang_setting_profile_management").innerHTML = 'Pengurusan Profil';
		document.getElementById("lang_setting_languaqge").innerHTML = 'Bahasa';
		document.getElementById("lang_setting_privacy_policy").innerHTML = 'Polisi privasi';
		document.getElementById("lang_setting_term_condition").innerHTML = 'Terma dan syarat';
		//Profile Management Page
		document.getElementById("lang_setting_profile_setting").innerHTML = 'Pengurusan Profil';
		document.getElementById("lang_profile_setting_firstname").innerHTML = 'Nama Pertama';
		document.getElementById("lang_profile_setting_lastname").innerHTML = 'Nama Terakhir';
		document.getElementById("submitupdateprofile").innerHTML = 'Kemas kini';
		//Language setting page
		document.getElementById("lang_setting_language_setting_nav").innerHTML = 'Tukar Bahasa';
		document.getElementById("lang_language_setting_pick_english").innerHTML = 'Bahasa Inggeris';
		document.getElementById("lang_language_setting_pick_malay").innerHTML = 'Bahasa Melayu';
		//Privacy Policy page
		document.getElementById("lang_setting_privacy_policy_nav").innerHTML = 'Polisi Privasi';
		//Term & Condition page
		document.getElementById("lang_setting_term_conditon_nav").innerHTML = 'Terma & Syarat';
		//Notification page
		document.getElementById("lang_navigation_notification").innerHTML = 'Notifikasi';
		//Notification read page
		document.getElementById("lang_navigation_read_notification").innerHTML = 'Baca Notifikasi';
		
	}else{
		
	}
}
var loadingNewContent = false;
window.onscroll = function(ev) {
    if ((window.innerHeight + window.pageYOffset) >= document.body.offsetHeight) {
      
		if(activePage == "homepage"){
			if(loadingNewContent == false){
				loadMoreHomepagecontent()
			}
			
		}
    }
};

function loadMoreHomepagecontent(){
	loadingNewContent = true;
	var category = localStorage.getItem("filter");
	var filter = localStorage.getItem("filter");
	var sub = localStorage.getItem("filter_sub");
	console.log(category);
	console.log(homepageLastid);
    if(category != null || category !== undefined || category === "undefined"){	
		console.log(category);
		var dataTopost = "api="+app.apiVersion+"&auth_token="+authUser.login_token+"&loadmorehomepagecontent="+category+"&lat="+appLat+"&lng="+appLng+"&pharmaid="+gpaid+"&sub="+sub+"&last="+homepageLastid;
		var xhr = new XMLHttpRequest();
		xhr.open("POST", serverUrl, true);
		xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
		xhr.onload = function() {
			if (xhr.status == 200) {
				var json = xhr.responseText;
				var response = JSON.parse(json);
				if(response.status != "fail"){
					show("homepagepreloader");
					show("homepageproducts");
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
					loadingNewContent = false;
					
					//resSrc(i);	
					
				}
				
			} else if (xhr.status == 404) {
				alert("Fail to connect to our server");
			} else {
				alert("Fail to connect to our server");
			}
		}
		xhr.send(dataTopost);
	}else{
		console.log("No category");
	}
}
document.addEventListener("backbutton", onBackKeyDown, false);

function onBackKeyDown() {
    if(activePage == "vendoritemlist"){
		openpage("homepage");
	}else if(activePage == "privacypage"){
		openpage("setting");
	}else if(activePage == "viewingorderinfo"){
		openpage("viewmyorder");
	}
}

function initCardpage(){
	var dataTopost = "api=1&auth_token=" + authUser.login_token + "&viewallmycard=true";
    var cardtoken = new XMLHttpRequest();
    cardtoken.open("POST", serverUrl, true);
    cardtoken.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    cardtoken.onload = function() {
        if (cardtoken.status == 200) {
            var json = cardtoken.responseText;
            var response = JSON.parse(json);
			if(response.status != 'fail'){
				var i;
				document.getElementById("cardlisting").innerHTML ="";
					for (i = 0; i < response.length; i++) {
						if(response[i].primarycard == "true"){
							var primarycard = '<a href="#">Primary Card</a> <a href="#" onclick="deleteCard('+response[i].id+')">Delete</a>';
						}else{
							var primarycard = '<a href="#" onclick="setcardPrimary('+response[i].id+')">Set as Primary Card</a> <a href="#" onclick="deleteCard('+response[i].id+')">Delete</a>';
						}
						document.getElementById("cardlisting").innerHTML +='<div class="card blue-grey darken-1"> <div class="card-content white-text"> <span class="card-title flow-text">'+response[i].cardview+'</span> <p>Expire date: '+response[i].expire+'</p> </div> <div class="card-action">'+primarycard+'</div> </div>';
						
					}
			}else{
				document.getElementById("cardlisting").innerHTML = 'You haven\'t add any card with us.';
			}
           
        } else if (cardtoken.status == 404) {
            alert("Fail to connect to our server");
        } else {
            alert("Fail to connect to our server");
        }
    }
    cardtoken.send(dataTopost);
}

function deleteCard(id){
	showLoading(); 
	var dataTopost = "api=1&auth_token=" + authUser.login_token + "&deleteFromcardtoken="+id;
    var cardtoken = new XMLHttpRequest();
    cardtoken.open("POST", serverUrl, true);
    cardtoken.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    cardtoken.onload = function() {
        if (cardtoken.status == 200) {
            var json = cardtoken.responseText;
            var response = JSON.parse(json);
            loadingResponse(response.message);
			initCardpage();
        } else if (cardtoken.status == 404) {
            alert("Fail to connect to our server");
        } else {
            alert("Fail to connect to our server");
        }
    }
    cardtoken.send(dataTopost);
}

function setcardPrimary(id){ 
showLoading();
var recordId = id;
var dataTopost = "api=1&auth_token=" + authUser.login_token + "&setcardprimary="+recordId;
    var cardtoken = new XMLHttpRequest();
    cardtoken.open("POST", serverUrl, true);
    cardtoken.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    cardtoken.onload = function() {
        if (cardtoken.status == 200) {
            var json = cardtoken.responseText;
            var response = JSON.parse(json);
			initCardpage();
            loadingResponse(response.message);
        } else if (cardtoken.status == 404) {
            alert("Fail to connect to our server");
        } else {
            alert("Fail to connect to our server");
        }
    }
    cardtoken.send(dataTopost);
}

function openAddcard(){
	hide("usercard");
	show("addcard");
	initCardpage();
}
function closeAddcard(){
	show("usercard");
	hide("addcard");
}

function addToCard(){
	showLoading();
	var cardnumber = document.getElementById("cardnumber").value;
	var nameoncard = document.getElementById("nameoncard").value;
	var expiredate = document.getElementById("expiredate").value;
	var cvvnumber = document.getElementById("cvvnumber").value;
	var dataTopost = "api=1&auth_token=" + authUser.login_token + "&inserttocard=true&cardnumber="+cardnumber+"&nameoncard="+nameoncard+"&expiredate="+expiredate+"&cvvnumber="+cvvnumber;
    var cardtoken = new XMLHttpRequest();
    cardtoken.open("POST", serverUrl, true);
    cardtoken.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    cardtoken.onload = function() {
        if (cardtoken.status == 200) {
            var json = cardtoken.responseText;
            var response = JSON.parse(json);
            loadingResponse(response.message);
			closeAddcard();
        } else if (cardtoken.status == 404) {
            alert("Fail to connect to our server");
        } else {
            alert("Fail to connect to our server");
        }
    }
    cardtoken.send(dataTopost);
}

function showPurchase(type){
	if(type == "new"){
		show("listinprogress");
		hide("listcompleted");
	}else{
		hide("listinprogress");
		show("listcompleted");
	}
}

function updateWalletsetting(){
	showLoading();
	let executeThis = true;
	let eusersBank_account_number = document.getElementById("sp_bank_number").value;
	let eusersBank_name = document.getElementById("sp_bank_name").value;
	let dataTopost = "api=1&auth_token=" + authUser.login_token + "&execeuserswallet="+executeThis+"&eusersBank_account_number="+eusersBank_account_number+"&eusersBank_name="+eusersBank_name;
	let reqEusers = new XMLHttpRequest();
	reqEusers.open("POST", serverUrl, true);
	reqEusers.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
	reqEusers.onload = function() {
		  if(reqEusers.status == 200) {
		 	let json = reqEusers.responseText;
		 	let response = JSON.parse(json);
		 	loadingResponse(response.status_message);
		  }else if(reqEusers.status == 404) {
		 	alert("Fail to connect to our server");
		  }else{
			 alert("Fail to connect to our server"); 
		  } 
 	}
	reqEusers.send(dataTopost);
}

