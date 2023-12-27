var app = { name: "epink", apiVersion: "1", language: "MY" };
// var serverUrl = "http://192.168.1.5:8888/api/index.php";
var serverUrl = "https://epink.health/api/index.php";
var delyvaConsumerId = 0;
var apiVersion = app.apiVersion;
var authUser;
var appVersion = 1;
var viewAppVersion = "1.4.4 (1.4.3)";
var blockTouch = 0;
var appLat = "3.0738";
var appLng = "101.5183";
var landing = "ON";
var userMenu = "";
var userDetectedAddress;
var userDetectedLat;
var userDetectedLng;
var deliveryDiscount = 0;
var mainDeliveryCordinate = { lat: "", lng: "", address: "" };
var whatsappUrl = "";
var session;
var refreshRate = 10000;
var isPc = false;

if (screen.width < 500) {
  isPc = false;
}

function checkLanding() {
  if (landing == "ON") {
    userMenu =
      '<div class="row" style="margin-bottom: 0px"><div class="col s3 waves-effect waves-light" onclick="openpage(\'landing\', \'clear\')"><a href="#"><i class="material-icons pink-text">home</i><p class="bottom-nav-text">Home</p></a></div><div class="col s3" onclick="openpage(\'chatlists\')"><a href="#"><i class="material-icons pink-text">chat_bubble</i><p class="bottom-nav-text">Session</p></a></div><div class="col s3" onclick="openpage(\'usercart\')"><a href="#"><i class="material-icons pink-text">shopping_cart</i><p class="bottom-nav-text">My Cart</p></a></div><div class="col s3" onclick="openpage(\'setting\')"><a href="#"><i class="material-icons pink-text">apps</i><p class="bottom-nav-text">Menu</p></a></div></div>';

    userMenu =
      '<div class="row" style="margin-bottom: 0px"><div class="col s3 waves-effect waves-light" onclick="openpage(\'landing\', \'clear\')"><i data-feather="home" class="pink-text"></i><p class="bottom-nav-text">Home</p></a></div><div class="col s3" onclick="openpage(\'chatlists\')"><a href="#"><i data-feather="message-circle" class="pink-text"></i><p class="bottom-nav-text">Session</p></a></div><div class="col s3" onclick="openpage(\'usercart\')"><a href="#"><i data-feather="shopping-cart" class="pink-text"></i><p class="bottom-nav-text">My Cart</p></a></div><div class="col s3" onclick="openpage(\'setting\')"><a href="#"><i data-feather="settings" class="pink-text"></i><p class="bottom-nav-text">Menu</p></a></div></div>';
  } else {
    userMenu =
      '<div class="row" style="margin-bottom: 0px"><div class="col s3 waves-effect waves-light" onclick="openpage(\'homepage\', \'clear\')"><a href="#"><i class="material-icons pink-text">home</i><p class="bottom-nav-text">Home</p></a></div><div class="col s3" onclick="openpage(\'viewmyorder\', \'clear\')"><a href="#"><i class="material-icons pink-text">notifications</i><p class="bottom-nav-text">Orders</p></a></div><div class="col s3" onclick="openpage(\'usercart\')"><a href="#"><i class="material-icons pink-text">shopping_cart</i><p class="bottom-nav-text">My Cart</p></a></div><div class="col s3" onclick="openpage(\'setting\')"><a href="#"><i class="material-icons pink-text">apps</i><p class="bottom-nav-text">Menu</p></a></div></div>';
  }
}

var docMenu =
  '<div class="row" style="margin-bottom: 0px"><div class="col s3 waves-effect waves-light" onclick="openpage(\'universalserviceprovider\', \'clear\')"><a href="#"><i class="material-icons pink-text">home</i><p class="bottom-nav-text">Dashboard</p></a></div><div class="col s3" onclick="openpage(\'docsession\', \'clear\')"><a href="#"><i class="material-icons pink-text">notifications</i><p class="bottom-nav-text">Sessions</p></a></div><div class="col s3" onclick="openpage(\'spwalletpage\')"><a href="#"><i class="material-icons pink-text">account_balance_wallet</i><p class="bottom-nav-text">Wallet</p></a></div><div class="col s3" onclick="openpage(\'docsetting\')"><a href="#"><i class="material-icons pink-text">apps</i><p class="bottom-nav-text">Menu</p></a></div></div>';

var runnerMenu =
  '<div class="row" style="margin-bottom: 0px"><div class="col s3" onclick="openpage(\'riderdashboard\', \'clear\')"><a href="#"><i class="material-icons pink-text">home</i><p class="bottom-nav-text">Home</p></a></div><div class="col s3" onclick="openpage(\'runnerprofile\')"><a href="#"><i class="material-icons pink-text">person</i><p class="bottom-nav-text">Profile</p></a></div><div class="col s3" onclick="openpage(\'notificationlist\')"><a href="#"><i class="material-icons pink-text">notifications</i><p class="bottom-nav-text">Notification</p></a></div><div class="col s3" onclick="openpage(\'logout\')"><a href="#"><i class="material-icons pink-text">exit_to_app</i><p class="bottom-nav-text">Logout</p></a></div></div>';

var pharmaMenu =
  '<div class="row" style="margin-bottom: 0px"><div class="col s3 waves-effect" onclick="openpage(\'vendorordermanager\', \'clear\')"><a href="#"><i class="material-icons pink-text">assignment</i><p class="bottom-nav-text">Orders</p></a></div><div class="col s3" onclick="openpage(\'mysales\')"><a href="#"><i class="material-icons pink-text">assignment_turned_in</i><p class="bottom-nav-text">Products</p></a></div><div class="col s3" onclick="openpage(\'spwalletpage\')"><a href="#"><i class="material-icons pink-text">account_balance_wallet</i><p class="bottom-nav-text">Wallet</p></a></div><div class="col s3" onclick="openpage(\'pharmamenus\')"><a href="#"><i class="material-icons pink-text">apps</i><p class="bottom-nav-text">Menu</p></a></div></div>';

//Show loading
function showLoading() {
  blockTouch = 1;
  document.getElementById("loading-progress").style.display = "block";
  document.getElementById("loading-in-progress").style.display = "block";
}

//Close any overlay
document
  .getElementById("loading-progress")
  .addEventListener("click", tryCloseoverlay);
function tryCloseoverlay() {
  if (blockTouch === 0) {
    closeLoading();
  }
}
//Display response
function loadingResponse(message) {
  blockTouch = 0;
  var responsMessage = message;
  document.getElementById("loading-in-progress").style.display = "none";
  document.getElementById("loading-response").style.display = "block";
  document.getElementById("response-text").innerHTML = responsMessage;
  setTimeout(function () {
    closeLoading();
  }, 1000);
}
//Close loading
function closeLoading() {
  document.getElementById("loading-progress").style.display = "none";
  document.getElementById("loading-response").style.display = "none";
}
//Logout out
function logOut() {
  //Destroy login token
  //Reload page
  location.reload();
}
var map;
var markers = [];
var googlemapcordinate;
var geocoder;
function initMap(applat, applng) {
  document.getElementById("detectedaddress").innerHTML =
    '<br><center><div class="preloader-wrapper small active"> <div class="spinner-layer spinner-pink-only"> <div class="circle-clipper left"> <div class="circle"></div> </div><div class="gap-patch"> <div class="circle"></div> </div><div class="circle-clipper right"> <div class="circle"></div> </div> </div> </div></center>';
  var markerss = "img/marker.png";
  var uluru = { lat: applat, lng: applng };
  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 18,
    center: uluru,
    disableDefaultUI: true,
  });
  if (map === undefined) {
    location.reload();
  } else {
    var infowindow = new google.maps.InfoWindow();
    geolocate(geocoder, uluru);
    addMarker(uluru);
    map.addListener("click", function (event) {
      var curCORD = event.latLng.toString();
      var corddd = curCORD.split(",", 2);
      corddd[0].replace("(", "");
      corddd[1].replace(")", "");
      var latCleaner = corddd[0].replace("(", "");
      var cleanedLat = parseFloat(latCleaner).toFixed(6);
      var lngCleaner = corddd[1].replace(")", "");
      var cleanedLng = parseFloat(lngCleaner).toFixed(6);
      document.getElementById("detectedlat").innerHTML = cleanedLat;
      document.getElementById("detectedlng").innerHTML = cleanedLng;
      userDetectedLat = cleanedLat;
      userDetectedLng = cleanedLng;
      document.getElementById("detectedaddress").innerHTML =
        '<center><br><div class="preloader-wrapper small active"> <div class="spinner-layer spinner-pink-only"> <div class="circle-clipper left"> <div class="circle"></div> </div><div class="gap-patch"> <div class="circle"></div> </div><div class="circle-clipper right"> <div class="circle"></div> </div> </div> </div><br></center>';
      deleteMarkers();
      addMarker(event.latLng);
      myLatlang = event.latLng;
      geolocate(geocoder, myLatlang);
    });
  }
}
function addMarker(location) {
  deleteMarkers();
  var markerss = "img/marker.png";
  var marker = new google.maps.Marker({
    position: location,
    icon: markerss,
    map: map,
  });
  markers.push(marker);
  map.setCenter(location);
}

function setMapOnAll(map) {
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(map);
  }
}

function clearMarkers() {
  setMapOnAll(null);
}
function deleteMarkers() {
  clearMarkers();
  markers = [];
}
function geolocate(geocoder, cord) {
  geocoder.geocode({ location: cord }, function (results, status) {
    if (status === "OK") {
      if (results[0]) {
        document.getElementById("detectedaddress").innerHTML =
          results[0].formatted_address + "";
        userDetectedAddress = results[0].formatted_address;
      } else {
        window.alert("No results found");
      }
    } else {
      window.alert("Geocoder failed due to: " + status);
    }
  });
}
function showMapsearch() {
  show("mapsearch");
  hide("appmap");
}
function setPickUpaddress(addresso, lat, lng) {
  hide("mapsearch");
  document.getElementById("detectedaddress").innerHTML = addresso;
  document.getElementById("detectedlat").innerHTML = lat;
  document.getElementById("detectedlng").innerHTML = lng;
  userDetectedLat = lat;
  userDetectedLng = lng;
  userDetectedAddress = addresso;
  show("appmap");
}
function codeAddress(pickedaddress) {
  var address = pickedaddress;
  geocoder.geocode({ address: address }, function (results, status) {
    if (status == "OK") {
      var curCORD = results[0].geometry.location.toString();
      var corddd = curCORD.split(",", 2);
      corddd[0].replace("(", "");
      corddd[1].replace(")", "");
      var latCleaner = corddd[0].replace("(", "");
      var cleanedLat = parseFloat(latCleaner).toFixed(6);
      var lngCleaner = corddd[1].replace(")", "");
      var cleanedLng = parseFloat(lngCleaner).toFixed(6);
      addMarker(results[0].geometry.location);
      setPickUpaddress(pickedaddress, cleanedLat, cleanedLng);
      mainDeliveryCordinate.lat = cleanedLat;
      mainDeliveryCordinate.lng = cleanedLng;
      mainDeliveryCordinate.address = address;
    } else {
      showLoading();
      loadingResponse(
        "Geocode was not successful for the following reason: " + status
      );
    }
  });
}
function initServicesmap(elements) {
  var searchQuery = elements.value;
  document.getElementById("resultsmap").innerHTML = "";
  var displaySuggestions = function (ppinkictions, status) {
    if (status != google.maps.places.PlacesServiceStatus.OK) {
      document.getElementById("resultsmap").innerHTML =
        '<li class="collection-item">Can\'t find that address</li>';
      return;
    }

    ppinkictions.forEach(function (ppinkiction) {
      var lol =
        '<li class="collection-item" onclick="codeAddress(\'' +
        ppinkiction.description +
        "')\">" +
        ppinkiction.description +
        "</li>";
      document.getElementById("resultsmap").innerHTML += lol;
    });
  };

  var service = new google.maps.places.AutocompleteService();
  service.getQueryPredictions(
    {
      input: searchQuery,
    },
    displaySuggestions
  );
}
function useAddress(address, dlat, dlng) {
  openpage("landing");
  userDetectedAddress = document.getElementById("detectedaddress").innerHTML;
  userDetectedLat = parseFloat(
    document.getElementById("detectedlat").innerHTML
  );
  userDetectedLng = parseFloat(
    document.getElementById("detectedlng").innerHTML
  );
  mainDeliveryCordinate.lat = parseFloat(
    document.getElementById("detectedlat").innerHTML
  );
  mainDeliveryCordinate.lng = parseFloat(
    document.getElementById("detectedlng").innerHTML
  );
  mainDeliveryCordinate.address =
    document.getElementById("detectedaddress").innerHTML;
}
function geocodeLatLng(geocoder, map) {
  var input = document.getElementById("latlng").value;
  var latlngStr = input.split(",", 2);
  var latlng = { lat: parseFloat(latlngStr[0]), lng: parseFloat(latlngStr[1]) };
  geocoder.geocode({ location: latlng }, function (results, status) {
    if (status === "OK") {
      if (results[0]) {
        map.setZoom(11);
        alert(results[0].formatted_address);
      } else {
        window.alert("No results found");
      }
    } else {
      window.alert("Geocoder failed due to: " + status);
    }
  });
}
var allcarecategory;
var carecurrentlyviewingcat;
function addSub(category) {
  document.getElementById("selectCategorycare").innerHTML =
    '<a href="#!" class="pink-text strong" onclick="openpage(\'carenewpage\', \'' +
    carecurrentlyviewingcat +
    "')\">" +
    carecurrentlyviewingcat +
    '</a><span onclick="openpage(\'categorywindow\')" class="right"><i class="material-icons pink-text strong" >filter_list</i></span>';
  var dataTopost =
    "api=1&auth_token=" +
    authUser.login_token +
    "&viewallecare_serviceswithsub=" +
    carecurrentlyviewingcat +
    "&subcate=" +
    category;
  var ecare_services = new XMLHttpRequest();
  ecare_services.open("POST", serverUrl, true);
  ecare_services.setRequestHeader(
    "Content-type",
    "application/x-www-form-urlencoded"
  );
  ecare_services.onload = function () {
    if (ecare_services.status == 200) {
      var json = ecare_services.responseText;
      var response = JSON.parse(json);
      initecareSub(carecurrentlyviewingcat);
      var i;
      hide("categorywindow");
      document.getElementById("viewallecare_services").innerHTML = "";
      for (i = 0; i < response.length; i++) {
        document.getElementById("viewallecare_services").innerHTML +=
          '<div class="col s6 l3 "><div class="card" style="border-radius: 10px"> <div class="card-image "><img class="lazy" id="res0" src="' +
          response[i].icon +
          '" alt="Menu Img" style="border-top-left-radius: 10px; border-top-right-radius: 10px;" onclick="openpage(\'carerequestdetail\', ' +
          response[i].id +
          ", '" +
          response[i].name +
          '\')"" loading="lazy"></div> <div class="card-content" style="padding: 10px"> <p><span class="strong">' +
          response[i].name +
          '</span></p> <p class="small"></p> <span class="right"></span> </div> </div></div>';
      }
      loadingResponse(response.message);
    } else if (ecare_services.status == 404) {
      alert("Fail to connect to our server");
    } else {
      alert("Fail to connect to our server");
    }
  };
  ecare_services.send(dataTopost);
}
function initecareSub(parents) {
  carecurrentlyviewingcat = parents;
  document.getElementById("selectecareSub").innerHTML = "";
  for (let i = 0; i < allcarecategory.length; i++) {
    if (allcarecategory[i].name == parents) {
      var sub = allcarecategory[i].sub;
      for (let j = 0; j < sub.length; j++) {
        document.getElementById("selectecareSub").innerHTML +=
          '<a href="#!" onclick="addSub(\'' +
          sub[j].name +
          '\')" class="pink white-text ebadge">' +
          sub[j].name +
          "</a> ";
      }
    }
  }
}
var publicPriceperKM = 0;
function executeApp(ulat, ulng) {
  var loginToken = localStorage.getItem(app.name + "_login_token");
  if (loginToken != null) {
    var dataTopost =
      "api=1&login_token=" +
      loginToken +
      "&lat=" +
      ulat +
      "&lng=" +
      ulng +
      "&appversion=1";
    var login = new XMLHttpRequest();
    login.open("POST", serverUrl, true);
    login.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    login.onload = function () {
      if (login.status == 200) {
        var json = login.responseText;
        var response = JSON.parse(json);
        authUser = response;
        publicPriceperKM = response.priceperkm;
        delyvaConsumerId = response.delyvaConsumerId;
        if (response.status == "success") {
          console.log(response.cardon);
          console.log(currentplatform);
          if (currentplatform == "Android") {
            if (response.cardon == true) {
              show("homepagecardon");
              show("isandroidhealth");
              show("googlesigninbutton");
              hide("iossigninbutton");
              hide("isioshealth");
            } else {
              hide("homepagecardon");
            }
          } else if (currentplatform == "web") {
            if (response.cardon == true) {
              show("homepagecardon");
              show("isandroidhealth");
              show("googlesigninbutton");
              hide("iossigninbutton");
              hide("isioshealth");
            } else {
              hide("homepagecardon");
            }
          } else {
            if (response.cardon == true) {
              show("homepagecardon");
              hide("isandroidhealth");
              hide("googlesigninbutton");
              show("iossigninbutton");
              show("isioshealth");
            } else {
              hide("homepagecardon");
            }
          }
          document.getElementById("profile_content_fullname").innerHTML =
            authUser.firstname + " " + authUser.lastname;
          document.getElementById("homepagefullname").innerHTML =
            authUser.firstname + " " + authUser.lastname;
          document.getElementById("landing_patient_name").innerHTML =
            cleanOutput(authUser.firstname + " " + authUser.lastname);
          if (authUser.weight == null) {
            document.getElementById("landing_weight").innerHTML = "Not Set";
          } else {
            document.getElementById("landing_weight").innerHTML =
              authUser.weight;
          }
          if (authUser.height == null) {
            document.getElementById("landing_height").innerHTML = "Not Set";
          } else {
            document.getElementById("landing_height").innerHTML =
              authUser.height;
          }
          document.getElementById("landingbalance").innerHTML = authUser.wallet;
          document.getElementById("view_user_wallet").innerHTML =
            "RM" + authUser.wallet;
          document.getElementById("update_phonenumber").value =
            authUser.phonenumber;
          document.getElementById("profile_content_email").innerHTML =
            authUser.email;
          document.getElementById("profile_content_phonenumber").innerHTML =
            authUser.phonenumber;
          document.getElementById("profile_content_profile_image").src =
            authUser.profile_img;
          //document.getElementById("settingpageprofileimg").src = authUser.profile_img;
          document.getElementById("sp_signature").src = authUser.signaturefile;
          document.getElementById("update_firstname").value =
            authUser.firstname;
          document.getElementById("update_lastname").value = cleanOutput(
            authUser.lastname
          );
          document.getElementById("spreferalcode").innerHTML =
            authUser.my_referral_code;
          document.getElementById("update_dob").value = cleanOutput(
            authUser.date_of_birth
          );
          document.getElementById("update_weight").value = cleanOutput(
            authUser.weight
          );
          document.getElementById("update_height").value = cleanOutput(
            authUser.height
          );
          document.getElementById("update_ic_no").value = cleanOutput(
            authUser.ic_number
          );
          document.getElementById("profileimagecontainer").src =
            authUser.profile_img;
          document.getElementById("menuprofilepic").src = authUser.profile_img;
          document.getElementById("menuname").innerHTML = authUser.fullname;
          document.getElementById("mainpageprofilepicture").src =
            authUser.profile_img;
          document.getElementById("homepageuserprofilepicture").src =
            authUser.profile_img;
          document.getElementById("update_residential_address").value =
            cleanOutput(authUser.address);
          deliveryDiscount = parseInt(authUser.delivery_discount);

          if (authUser.type == "0") {
            if (isPc == true) {
              //show("pccustomermenu");
              //hide("pcvendormenu");
              //show("downloadtheapp");
            } else {
              //hide("pccustomermenu");
              //hide("pcvendormenu");
            }
            document.getElementById("chatbottomnav").innerHTML = userMenu;
            document.getElementById("homepagebottomnav").innerHTML = userMenu;
            document.getElementById("notificationbottomnav").innerHTML =
              userMenu;
            document.getElementById("settingbottomnav").innerHTML = userMenu;
            document.getElementById("orderbottomnav").innerHTML = userMenu;
            document.getElementById("usercartbottomnav").innerHTML = userMenu;
            document.getElementById("ordernav").innerHTML = userMenu;
            //document.getElementById("viewproductnave").innerHTML = userMenu;
            document.getElementById("landingnav").innerHTML = userMenu;
            document.getElementById("carenewnav").innerHTML = userMenu;
            document.getElementById("elabnav").innerHTML = userMenu;
            document.getElementById("ridernav").innerHTML = userMenu;
            document.getElementById("martbottomnav").innerHTML = userMenu;
            var today = new Date();
            var dd = String(today.getDate()).padStart(2, "0");
            var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
            var yyyy = today.getFullYear();
            today = dd + "/" + mm + "/" + yyyy;
            document.getElementById("todaydate").innerHTML = today;
            var parentCategory = JSON.parse(response.ecarecategory);
            var elabparentCategory = JSON.parse(response.elabcategory);
            allcarecategory = parentCategory;
            alllabcategory = elabparentCategory;
            for (let i = 0; i < parentCategory.length; i++) {
              document.getElementById("systemparentcategory").innerHTML +=
                "<button class=\"btn btn-block pink white-text ebutton\" onclick=\"openpage('carenewpage', '" +
                parentCategory[i].name +
                "')\">" +
                parentCategory[i].name +
                "</button><br>";
            }
            for (let i = 0; i < alllabcategory.length; i++) {
              document.getElementById("elabsystemparentcategory").innerHTML +=
                '<button class="btn btn-block pink white-text ebutton" onclick="setElabcate(\'' +
                alllabcategory[i].name +
                "')\">" +
                alllabcategory[i].name +
                "</button><br>";
            }
            if (landing == "ON") {
              //openpage("viewmyorder");
              openpage("landing");
              //openpage("usercart");
              if (authUser.customer_approved == "true") {
                openpage("landing");
              } else {
                openpage("reverify");
              }
            } else {
              openpage("homepage");
            }

            var nearbyvendor = response.nearby_vendor;
            if (nearbyvendor != null) {
              var i;
              for (i = 0; i < nearbyvendor.length; i++) {
                var kmg = nearbyvendor[i].distance;
                var kms = parseFloat(kmg).toFixed(0);

                document.getElementById("nearby").innerHTML +=
                  '<div class="col s6"><div class="card" style="border-radius: 10px"><div class="card-image" ><img id="pid' +
                  nearbyvendor[i].id +
                  '" src="' +
                  nearbyvendor[i].profile_img +
                  '" style="border-top-left-radius: 10px; border-top-right-radius: 10px;" onclick="openlandingVendor(' +
                  nearbyvendor[i].id +
                  ", '" +
                  nearbyvendor[i].vendor_name +
                  "', '" +
                  nearbyvendor[i].profile_img +
                  '\', \'restaurant\')"></div><div class="card-content" style="padding: 10px"><p><span class="" onclick="openlandingVendor(' +
                  nearbyvendor[i].id +
                  ", '" +
                  nearbyvendor[i].vendor_name +
                  "', '" +
                  nearbyvendor[i].profile_img +
                  "', 'restaurant')\">" +
                  nearbyvendor[i].vendor_name +
                  "</span></p><p></p></div></div></div>";
              }
            } else {
            }

            var nearbymart = response.nearby_mart;
            if (nearbymart != null) {
              var f;
              for (f = 0; f < nearbymart.length; f++) {
                var kmg = nearbymart[f].distance;
                var kms = parseFloat(kmg).toFixed(0);
                document.getElementById("grocernearby").innerHTML +=
                  '<div class="col s6"><div class="card" style="border-radius: 10px"><div class="card-image" ><img id="pid' +
                  nearbymart[f].id +
                  '" src="' +
                  nearbymart[f].profile_img +
                  '" style="border-top-left-radius: 10px; border-top-right-radius: 10px;" onclick="openlandingVendor(' +
                  nearbymart[f].id +
                  ", '" +
                  nearbymart[f].vendor_name +
                  "', '" +
                  nearbymart[f].profile_img +
                  '\', \'restaurant\')"></div><div class="card-content" style="padding: 10px"><p><span class="" onclick="openlandingVendor(' +
                  nearbymart[f].id +
                  ", '" +
                  nearbymart[f].vendor_name +
                  "', '" +
                  nearbymart[f].profile_img +
                  "', 'restaurant')\">" +
                  nearbymart[f].vendor_name +
                  "</span></p><p></p></div></div></div>";
              }
            } else {
            }
            var blogs = response.blog;
            if (blogs == "Empty") {
              document.getElementById("homepagenews").innerHTML =
                '<div class="row"><div class="col s12">No article posted yet</div>';
            } else {
              for (let i = 0; i < blogs.length; i++) {
                document.getElementById("homepagenews").innerHTML +=
                  '<div class="row" onclick="viewArticle(' +
                  blogs[i].id +
                  ')"><div class="col s2" style="background-image: url(' +
                  blogs[i].thumbnail +
                  '); border-radius: 10px; padding-left: 5px; padding-top: 60px; background-position: center"></div><div class="col s10"><span class="strong">' +
                  blogs[i].title +
                  '</span><br><span class="xs" style="font-size: 10px">' +
                  blogs[i].content +
                  "</span></div></div>";
              }
            }
            feather.replace();
          } else if (authUser.type == "6") {
            if (response.availability == "On") {
              document.getElementById("buttonOn").classList.remove("pink-text");
              document.getElementById("buttonOn").classList.add("green-text");
            } else {
              document
                .getElementById("buttonOn")
                .classList.remove("green-text");
              document.getElementById("buttonOn").classList.add("pink-text");
            }

            if (response.verified_service_provider == "Approved") {
              if (response.provider_type == "Pharmacist") {
                if (isPc == true) {
                  hide("pccustomermenu");
                  show("pcvendormenu");
                } else {
                  hide("pccustomermenu");
                  hide("pcvendormenu");
                }

                document.title = "EPINK - Vendor";
                if (authUser.categories != "") {
                  initiateProductPoster();
                }
                openpage("vendorordermanager");
                document.getElementById("docdashboardbottomnav").innerHTML =
                  pharmaMenu;
                document.getElementById("spwalletbottomnav").innerHTML =
                  pharmaMenu;
                document.getElementById("docsessionmenu").innerHTML =
                  pharmaMenu;
                document.getElementById("notificationbottomnav").innerHTML =
                  pharmaMenu;
                document.getElementById("docsettingbottomnav").innerHTML =
                  pharmaMenu;
                document.getElementById(
                  "universalserviceproviderbottomnav"
                ).innerHTML = pharmaMenu;
                document.getElementById("vendororderbottonm").innerHTML =
                  pharmaMenu;
                document.getElementById("pharmasettingbottomnav").innerHTML =
                  pharmaMenu;
                document.getElementById("myshopnav").innerHTML = pharmaMenu;
              } else {
                document.title = "EPINK - Provider";
                openpage("universalserviceprovider");
                document.getElementById("docdashboardbottomnav").innerHTML =
                  docMenu;
                document.getElementById("spwalletbottomnav").innerHTML =
                  docMenu;
                document.getElementById("docsessionmenu").innerHTML = docMenu;
                document.getElementById("notificationbottomnav").innerHTML =
                  docMenu;
                document.getElementById("docsettingbottomnav").innerHTML =
                  docMenu;
                document.getElementById(
                  "universalserviceproviderbottomnav"
                ).innerHTML = docMenu;
                if (authUser.provider_type == "Doctor") {
                  show("specialistbutton");
                } else {
                  hide("specialistbutton");
                }
              }
            } else {
              openpage("serviceproviderselection");
              initExistingVerification(authUser.id);
            }
            username = response.public_token;
            userpassword = response.secret_token;
          } else if (authUser.type == "1") {
            openpage("vendorordermanager");
            document.title = "EPINK - Vendor";
            document.getElementById("vendororderbottonm").innerHTML =
              pharmaMenu;
            document.getElementById("myshopnav").innerHTML = pharmaMenu;
            document.getElementById("spwalletbottomnav").innerHTML = pharmaMenu;
            document.getElementById("pharmasettingbottomnav").innerHTML =
              pharmaMenu;
            initiateProductPoster();
          } else if (authUser.type == "2") {
            document.title = "EPINK - Rider";
            document.getElementById(
              "runner_profile_content_fullname"
            ).innerHTML =
              authUser.firstname + " " + cleanOutput(authUser.lastname);
            document.getElementById("runner_profile_content_email").innerHTML =
              cleanOutput(authUser.email);

            document.getElementById("riderdashboardbottomnav").innerHTML =
              runnerMenu;
            document.getElementById("notificationbottomnav").innerHTML =
              runnerMenu;
            document.getElementById("runnerprofilenav").innerHTML = runnerMenu;
            document.getElementById("rider_update_phonenumber").value =
              authUser.phonenumber;
            document.getElementById("rider_update_lastname").value =
              authUser.lastname;
            document.getElementById("rider_update_firstname").value =
              authUser.firstname;
            document.getElementById("riderprofileimagecontainer").src =
              authUser.profile_img;
            if (authUser.rider_approved == null) {
              openpage("rideractivation");
            } else {
              openpage("riderdashboard");
            }
          } else {
            showLoading();
            loadingResponse("This app is for customer only");
            localStorage.clear();
          }
          document.getElementById("prodmarg").innerHTML =
            authUser.productmargin + "% Fees";

          ConnectyCube.createSession()
            .then((session) => {
              var tocall = 0;
              console.log(0);
              const userCredentials = {
                login: authUser.public_token,
                password: authUser.secret_token,
              };
              var cb = {
                login: authUser.public_token,
                password: authUser.secret_token,
                opponentid: tocall,
              };

              var cblogin = JSON.stringify(cb);
              localStorage.setItem("cblogin", cblogin);
              ConnectyCube.login(userCredentials)
                .then((user) => {
                  console.log(authUser.id_token);
                  console.log(user.id);
                  if (user.id != authUser.id_token) {
                    instaResponse("Finishing account setup");
                    showLoading();
                    var connetycubeid = user.id;
                    console.log(connetycubeid);
                    var dataTopost =
                      "api=1&auth_token=" +
                      authUser.login_token +
                      "&updateuserconid=" +
                      connetycubeid;
                    var users = new XMLHttpRequest();
                    users.open("POST", serverUrl, true);
                    users.setRequestHeader(
                      "Content-type",
                      "application/x-www-form-urlencoded"
                    );
                    users.onload = function () {
                      if (users.status == 200) {
                        var json = users.responseText;
                        var response = JSON.parse(json);
                        loadingResponse("Account set up complete");
                      } else if (users.status == 404) {
                        alert("Fail to connect to our server");
                      } else {
                        alert("Fail to connect to our server");
                      }
                    };

                    users.send(dataTopost);
                  }
                  const userCredentials = {
                    userId: user.id,
                    password: authUser.secret_token,
                  };
                  ConnectyCube.chat
                    .connect(userCredentials)
                    .then(() => {
                      console.log("userisconnected");
                      const isConnected = ConnectyCube.chat.isConnected;
                      document.getElementById(
                        "videocallbutton"
                      ).disabled = false;
                      show("videocallbutton");
                      hide("videocallbuttongrey");
                    })
                    .catch((error) => {
                      console.log(error);
                    });
                })
                .catch((error) => {
                  console.log(error);
                });
            })
            .catch((error) => {
              console.log(error);
            });
        } else if (response.status == "fail") {
          openpage("auth");
          show("login");
        } else if (response.status == "update") {
          openpage("updateapp");
        }
      } else if (login.status == 404) {
        alert("Fail to connect to our server");
      } else {
        alert("Fail to connect to our server");
      }
    };
    login.send(dataTopost);
  } else {
    console.log("user not logged in");
    openpage("auth");
    show("login");
  }
}

var userios;
var cardoff = false;
function initApp() {
  document.getElementById("settingversion").innerHTML = viewAppVersion;
  document.getElementById("csettingversion").innerHTML = viewAppVersion;
  geocoder = new google.maps.Geocoder();
  checkLanding();
  M.AutoInit();
  //StatusBar.hide();
  var language = localStorage.getItem(app.name + "_language");
  if (language == null) {
    localStorage.setItem(app.name + "_language", "EN");
    app.language = "EN";
  } else {
    app.language = language;
  }
  //translateApps();
  var options = {
    enableHighAccuracy: true,
    maximumAge: 3600000,
  };
  var watchID = navigator.geolocation.getCurrentPosition(
    onSuccess,
    onError,
    options
  );
  function onSuccess(position) {
    appLat = position.coords.latitude;
    appLng = position.coords.longitude;
    executeApp(appLat, appLng);
  }
  function onError(error) {
    var todaycordinate = localStorage.getItem("todaycordinate");
    if (todaycordinate != null) {
      var todaycordinate = JSON.parse(todaycordinate);
      executeApp(todaycordinate.lat, todaycordinate.lng);
      appLat = todaycordinate.lat;
      appLng = todaycordinate.lng;
    } else {
      if (error.code == 2) {
        hide("splash");
        show("nolocation");
        document.getElementById("splashmessage").innerHTML =
          '<p>Please allow this app to access your location.</p> <button class="red white-text btn btn-small" onclick="rqPost()" style="border-radius: 10px">Request</button>';
      } else {
        hide("splash");
        show("nolocation");
        document.getElementById("splashmessage").innerHTML =
          '<p>Please allow this app to access your location.</p> <button class="red white-text btn btn-small" onclick="rqPost()" style="border-radius: 10px">Request</button>';
      }
    }
  }
}

function ringIng() {
  if (isondevice == true) {
    navigator.notification.beep;
    setTimeout(function () {
      var hascallis = document.getElementById("hascall").style.display;
      if (hascallis == "block") {
        ringIng();
      }
    }, 3000);
  }
}
ConnectyCube.videochat.onCallListener = function (session, extension) {
  console.log(session);
  show("hascall");
  getCallerProfile(session.initiatorID);
};
function getCallerProfile(id) {
  var dataTopost =
    "api=1&auth_token=" + authUser.login_token + "&getcallerprofile=" + id;
  var xhr = new XMLHttpRequest();
  xhr.open("POST", serverUrl, true);
  xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhr.onload = function () {
    if (xhr.status == 200) {
      var json = xhr.responseText;
      var response = JSON.parse(json);
      document.getElementById("vcindicatorpicture").src = response.profile_img;
      document.getElementById("vcindicatorname").innerHTML = response.full_name;
      document.getElementById("vcindicatorstats").innerHTML =
        response.full_name + " is calling you";
      ringIng();
    } else if (xhr.status == 404) {
    } else {
    }
  };
  xhr.send(dataTopost);
}
function initPrivacyPolicypage() {
  addPreloader("privacypcontent");
  var dataTopost = "api=1&privacy_policy=true";
  var xhr = new XMLHttpRequest();
  xhr.open("POST", serverUrl, true);
  xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhr.onload = function () {
    if (xhr.status == 200) {
      var json = xhr.responseText;
      var response = JSON.parse(json);
      document.getElementById("privacypcontent").innerHTML =
        response.setting_value;
    } else if (xhr.status == 404) {
      alert("Fail to connect to our server");
    } else {
      alert("Fail to connect to our server");
    }
  };
  xhr.send(dataTopost);
}
function initTeleconsent() {
  addPreloader("telemedconsentcontent");
  var dataTopost = "api=1&teleconsent=true";
  var xhr = new XMLHttpRequest();
  xhr.open("POST", serverUrl, true);
  xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhr.onload = function () {
    if (xhr.status == 200) {
      var json = xhr.responseText;
      var response = JSON.parse(json);
      document.getElementById("telemedconsentcontent").innerHTML =
        response.setting_value;
    } else if (xhr.status == 404) {
      alert("Fail to connect to our server");
    } else {
      alert("Fail to connect to our server");
    }
  };
  xhr.send(dataTopost);
}
function initTnCpage() {
  addPreloader("tnccontent");
  var dataTopost = "api=1&tnc=true";
  var xhr = new XMLHttpRequest();
  xhr.open("POST", serverUrl, true);
  xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhr.onload = function () {
    if (xhr.status == 200) {
      var json = xhr.responseText;
      var response = JSON.parse(json);

      document.getElementById("tnccontent").innerHTML = response.setting_value;
    } else if (xhr.status == 404) {
      alert("Fail to connect to our server");
    } else {
      alert("Fail to connect to our server");
    }
  };
  xhr.send(dataTopost);
}

var isondevice = true;
function checkDevice() {
  document.getElementById("maincopyright").innerHTML =
    "ePink Health V" + viewAppVersion + "";
  var debug = window.cordova === undefined;
  if (debug == true) {
    isondevice = false;
    ltoken = localStorage.getItem("epink_login_token");
    if (ltoken == null) {
      initApp();
    } else {
      initApp();
    }
  }
  var options = "{twelveHour: true }";
  var elems = document.querySelectorAll(".timepicker");
  var instances = M.Timepicker.init(elems, options);
}

window.addEventListener("DOMContentLoaded", checkDevice, false);
document.addEventListener("deviceready", onDeviceReady, false);
function rqPost() {
  location.reload();
}
var currentplatform = "web";
function onDeviceReady() {
  checkLanding();
  splashMessage("Checking device...");
  StatusBar.overlaysWebView(false);
  StatusBar.backgroundColorByHexString("#33000000");
  //currentplatform = device.platform;
  currentplatform = "IOS";
  if (currentplatform === "Android") {
    splashMessage("Android detected...");
    splashMessage("Checking GPS...");
    cordova.plugins.diagnostic.isGpsLocationEnabled(
      function (enabled) {
        if (enabled === true) {
          splashMessage(
            "Requesting permission to access available health data..."
          );
          var datatypes =
            "['calories', 'distance', 'blood_pressure', {read : ['steps'],write : ['height', 'weight'] }]";
          navigator.health.requestAuthorization(
            datatypes,
            function () {
              /* Success */
              splashMessage("Success.. Initiating app");
              initApp();
            },
            function () {
              /* Fail */ splashMessage("GPS is enabled");
              initApp();
            }
          );
        } else {
          var todaycordinate = localStorage.getItem("todaycordinate");
          if (todaycordinate != null) {
            var todaycordinate = JSON.parse(todaycordinate);
            executeApp(todaycordinate.lat, todaycordinate.lng);
            appLat = todaycordinate.lat;
            appLng = todaycordinate.lng;
          } else {
            geocoder = new google.maps.Geocoder();
            hide("splash");
            show("nolocation");
          }
          // document.getElementById("splashmessage").innerHTML = '<p>Please allow this app to access your location.</p> <button class="red white-text btn btn-small" onclick="rqPost()" style="border-radius: 10px">Retry</button>';
        }
      },
      function (error) {
        console.error("The following error occurred: " + error);
      }
    );
  } else {
    currentplatform = "IOS";
    initApp();
  }
}
function authHealth() {
  console.log("health available");
}
function failauthHealth() {
  console.log("fail health");
  navigator.health.requestAuthorization(
    datatypes,
    successCallback,
    errorCallback
  );
}

function healthdataAvailable() {
  health = true;
  var datatypes =
    "['calories', 'distance', 'blood_pressure', {read : ['steps'],write : ['height', 'weight'] }]";
  console.log(datatypes);
  navigator.health.isAuthorized(datatypes, authHealth, failauthHealth);
}
function healthdataNotavailable() {
  health = null;
  alert("fail");
}

function locationPermissionSuccess() {
  initApp();
}
function locationPermissionError() {}
document.addEventListener("keydown", checkKeypressed);
function openCMN() {
  activePage = "cm";
  show("cm");
}
function checkKeypressed(e) {
  if (e.code == "Backspace") {
    console.log(activePage);
    onBackKeyDown();
  } else if (e.code == "F12") {
    //window.location.replace('https://epink.health');
    if (isPc == true) {
      document.body.innerHTML = "";
    }
  }
}
document.addEventListener("backbutton", onBackKeyDown, false);
function openElabcategory() {
  if (authUser) {
    activePage = "elabcategory";
    show("elabcategory");
  } else {
    location.reload();
  }
}

function onBackKeyDown() {
  console.log(isondevice);
  if (activePage == "setting") {
    if (isondevice == true) {
      navigator.app.exitApp();
    }
  }

  if (activePage == "filterwindow") {
    hide("filterwindow");
  }
  if (activePage == "specialityfilter") {
    hide("specialityfilter");
    show("filterwindow");
    activePage = "filterwindow";
  }
  if (activePage == "usercart") {
    if (isondevice == true) {
      navigator.app.exitApp();
    }
  }
  if (activePage == "chatlists") {
    if (isondevice == true) {
      navigator.app.exitApp();
    }
  }
  if (activePage == "landing") {
    if (isondevice == true) {
      navigator.app.exitApp();
    }
  }
  if (activePage == "carerequestlist") {
    openpage("setting");
  }
  if (activePage == "carerequestlist") {
    openpage("landing");
  }

  if (activePage == "consultation") {
    openpage("landing");
  }
  if (activePage == "viewinglabservice") {
    hide("viewelabservice");
    setTimeout(function () {
      activePage = "elabservice";
    }, 1000);
  }
  if (activePage == "elabservice") {
    openpage("landing");
  }
  if (activePage == "categorywindow") {
    hide("categorywindow");
    openpage("landing");
  }
  if (activePage == "elabcategory") {
    hide("elabcategory");
    openpage("landing");
  }

  if (activePage == "cm") {
    hide("cm");
    //openpage("landing");
  }

  if (activePage == "carerequestdetail") {
    openpage("carenewpage");
  }
  if (activePage == "carenewpage") {
    openpage("landing");
  }

  if (activePage == "sessioncontroller") {
    openpage("chatlists");
  }
  if (activePage == "elabresults") {
    openpage("setting");
  }

  if (activePage == "notificationlist") {
    openpage("setting");
  }

  if (activePage == "notificationview") {
    openpage("notificationlist");
  }

  if (activePage == "viewlabreport") {
    openpage("elabresults");
  }
  if (activePage == "viewmyorder") {
    openpage("setting");
  }
  if (activePage == "homepage") {
    openpage("landing");
  }
  if (activePage == "viewrestaurant") {
    closeVendor();
  }
  if (activePage == "viewmart") {
    closeVendor();
  }
  if (activePage == "mart") {
    openpage("landing");
  }
  if (activePage == "viewingorderinfo") {
    openpage("viewmyorder");
  }

  if (activePage == "viewingproduct") {
    closeProduct();
    activePage = "viewrestaurant";
  }

  if (activePage == "profilemanagement") {
    openpage("setting");
  }

  if (activePage == "walletpage") {
    openpage("setting");
  }

  if (activePage == "notificationlist") {
    openpage("setting");
  }

  if (activePage == "notificationview") {
    openpage("notificationlist");
  }
  if (activePage == "privacypage") {
    openpage("setting");
  }
  if (activePage == "termandconditionpage") {
    openpage("setting");
  }
  if (activePage == "vendoritemlist") {
    openpage("homepage");
  }
  if (activePage == "privacypage") {
    openpage("setting");
  }
  if (activePage == "viewingorderinfo") {
    openpage("viewmyorder");
  }
}

function serviceInProgress() {
  showLoading();
  loadingResponse("This service is under development");
}

function openDacsee() {
  window.open(
    encodeURI("https://invite.dacsee.com/?referrer=XZ-8513770/"),
    "_system"
  );
  //window.open('https://invite.dacsee.com/?referrer=XZ-8513770/', '_blank');

  /*    var url = 'https://invite.dacsee.com/?referrer=XZ-8513770/';
   var target = '_blank';
   var options = "location = no"
   var ref = cordova.InAppBrowser.open(url, target, options);
   
   ref.addEventListener('loadstart', loadstartCallback);
   ref.addEventListener('loadstop', loadstopCallback);
   ref.addEventListener('loaderror', loaderrorCallback);
   ref.addEventListener('exit', exitCallback);

   function loadstartCallback(event) {
      console.log('Loading started: '  + event.url)
   }

   function loadstopCallback(event) {
      console.log('Loading finished: ' + event.url)
   }

   function loaderrorCallback(error) {
      console.log('Loading error: ' + error.message)
   }

   function exitCallback() {
      console.log('Browser is closed...')
   } */
}

function openBrowser(url) {
  var url = url;
  var target = "_blank";
  var options = "location = yes, hardwareback= no";
  var ref = cordova.InAppBrowser.open(url, target, options);

  ref.addEventListener("loadstart", loadstartCallback);
  ref.addEventListener("loadstop", loadstopCallback);
  ref.addEventListener("loaderror", loaderrorCallback);
  ref.addEventListener("exit", exitCallback);

  function loadstartCallback(event) {
    console.log("Loading started: " + event.url);
  }

  function loadstopCallback(event) {
    console.log("Loading finished: " + event.url);
  }

  function loaderrorCallback(error) {
    console.log("Loading error: " + error.message);
  }

  function exitCallback() {
    console.log("Browser is closed...");
  }
}

window.onscroll = function (ev) {
  /*  if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
        if(activePage == "homepage"){
			window.scrollTo(0,0);
		}
		if(activePage == "mart"){
			window.scrollTo(0,0);
		}
    } */
};

//MEDICAL JOURNEY
function initMedjourney() {
  var dataTopost =
    "api=1&auth_token=" + authUser.login_token + "&chatlist=true";
  var xhr = new XMLHttpRequest();
  xhr.open("POST", serverUrl, true);
  xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhr.onload = function () {
    if (xhr.status == 200) {
      var json = xhr.responseText;
      var response = JSON.parse(json);
      if (response.status == null) {
        document.getElementById("medjouneycollection").innerHTML = "";
        var i;
        for (i = 0; i < response.length; i++) {
          document.getElementById("medjouneycollection").innerHTML +=
            '<li class="collection-item " onclick="openpage(\'sessioncontroller\', ' +
            response[i].id +
            ", " +
            response[i].owner_two +
            ')">Tele consultation with DR.' +
            response[i].fullname +
            "<br>" +
            response[i].human_session_date +
            " </li>";
        }
      } else {
        document.getElementById("medjouneycollection").innerHTML =
          '<li class="collection-item borderless"><center><i class="material-icons pink-text large">assignment_late</i><p>You havent use any of our services</p></center></li>';
      }
    } else if (xhr.status == 404) {
      alert("Fail to connect to our server");
    } else {
      alert("Fail to connect to our server");
    }
  };
  xhr.send(dataTopost);
}

//WEB APP SECURE
/*
	
	document.addEventListener('contextmenu', event => event.preventDefault());
	document.onkeydown = function (e) {
 
        
        if(e.keyCode == 123) {
          window.location.href = "https://epink.health/";
        }
 
       
        if(e.ctrlKey && e.shiftKey && e.keyCode == 73){
            window.location.href = "https://epink.health/";
        }
 
        
        if(e.ctrlKey && e.shiftKey && e.keyCode == 74) {
            window.location.href = "https://epink.health/";
        }
 
      
        if(e.ctrlKey && e.keyCode == 85) {
            window.location.href = "https://epink.health/";
        }
    } */

function setDocinfo() {
  document.getElementById("login_email").value = "doctor@epink.health";
  document.getElementById("login_password").value = "password";
}

function setRiderLogin() {
  document.getElementById("login_email").value = "rider@epink.health";
  document.getElementById("login_password").value = "password";
}
function setVendorLogin() {
  document.getElementById("login_email").value = "store@epink.health";
  document.getElementById("login_password").value = "password";
}

function setUserinfo() {
  document.getElementById("login_email").value = "patient@epink.health";
  document.getElementById("login_password").value = "password";
}

function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}
function setPhyscologistinfo() {
  document.getElementById("login_email").value = "physcologist@epink.health";
  document.getElementById("login_password").value = "password";
}

// Artile
function viewArticle(id) {
  showLoading();
  var dataTopost =
    "api=1&auth_token=" + authUser.login_token + "&viewarticle=" + id;
  var elab_service = new XMLHttpRequest();
  elab_service.open("POST", serverUrl, true);
  elab_service.setRequestHeader(
    "Content-type",
    "application/x-www-form-urlencoded"
  );
  elab_service.onload = function () {
    if (elab_service.status == 200) {
      var json = elab_service.responseText;
      var response = JSON.parse(json);
      document.getElementById("articlethumbnail").src = response.thumbnail;
      document.getElementById("articletitle").innerHTML = response.title;
      document.getElementById("articledate").innerHTML =
        response.publishing_date;
      document.getElementById("articlecontent").innerHTML = response.content;
      closeLoading();
      show("viewarticle");
      activePage = "viewingarticle";
    } else if (elab_service.status == 404) {
      alert("Fail to connect to our server");
    } else {
      alert("Fail to connect to our server");
    }
  };
  elab_service.send(dataTopost);
}
function requestPermission() {
  if (isondevice == true) {
    if (currentplatform == "Anroid") {
      var permissions = cordova.plugins.permissions;
      permissions.requestPermission(permissions.CAMERA, success, error);
      function error() {
        console.log("Camera permission is not turned on");
      }
      function success(status) {
        console.log("Camera permission is turned on");
      }
      permissions.requestPermission(
        permissions.MICROPHONE,
        successMic,
        errorMic
      );
      function errorMic() {
        console.log("Mirophone permission is not turned on");
      }

      function successMic(status) {
        console.log("Mirophone permission is turned on");
      }
    } else {
      window.location.replace("acceptcall.html");
    }
  } else {
    window.location.replace("acceptcall.html");
  }
}

function setNoLoclat(address) {
  var address = address;
  geocoder.geocode({ address: address }, function (results, status) {
    if (status == "OK") {
      var curCORD = results[0].geometry.location.toString();
      var corddd = curCORD.split(",", 2);
      corddd[0].replace("(", "");
      corddd[1].replace(")", "");
      var latCleaner = corddd[0].replace("(", "");
      var cleanedLat = parseFloat(latCleaner).toFixed(6);
      var lngCleaner = corddd[1].replace(")", "");
      var cleanedLng = parseFloat(lngCleaner).toFixed(6);
      mainDeliveryCordinate.lat = cleanedLat;
      mainDeliveryCordinate.lng = cleanedLng;
      mainDeliveryCordinate.address = address;
      localStorage.setItem(
        "todaycordinate",
        '{"lat":"' + cleanedLat + '", "lng":"' + cleanedLng + '"}'
      );
      executeApp(cleanedLat, cleanedLng);
    } else {
      showLoading();
      loadingResponse(
        "Geocode was not successful for the following reason: " + status
      );
    }
  });
}

function initLinkcompany() {
  var dataTopost = "api=1&auth_token=" + authUser.login_token + "&inithr=true";
  var users = new XMLHttpRequest();
  users.open("POST", serverUrl, true);
  users.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  users.onload = function () {
    if (users.status == 200) {
      var json = users.responseText;
      var response = JSON.parse(json);
      if (response.company_name == "") {
        hide("linked");
        show("unlinked");
      } else {
        document.getElementById("companyname").innerHTML =
          response.company_name;
        show("linked");
        hide("unlinked");
      }
      loadingResponse(response.message);
    } else if (users.status == 404) {
      alert("Fail to connect to our server");
    } else {
      alert("Fail to connect to our server");
    }
  };
  users.send(dataTopost);
}

function unlinkhr() {
  var dataTopost =
    "api=1&auth_token=" + authUser.login_token + "&unlinkhr=true";
  var users = new XMLHttpRequest();
  users.open("POST", serverUrl, true);
  users.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  users.onload = function () {
    if (users.status == 200) {
      var json = users.responseText;
      var response = JSON.parse(json);

      loadingResponse(response.message);
      initLinkcompany();
    } else if (users.status == 404) {
      alert("Fail to connect to our server");
    } else {
      alert("Fail to connect to our server");
    }
  };
  users.send(dataTopost);
}

function linkhr() {
  showLoading();
  var companycode = document.getElementById("company_code").value;
  var dataTopost =
    "api=1&auth_token=" + authUser.login_token + "&linkhr=" + companycode;
  var users = new XMLHttpRequest();
  users.open("POST", serverUrl, true);
  users.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  users.onload = function () {
    if (users.status == 200) {
      var json = users.responseText;
      var response = JSON.parse(json);
      loadingResponse(
        "Your account has been linked to " + response.company_name
      );
      initLinkcompany();
    } else if (users.status == 404) {
      alert("Fail to connect to our server");
    } else {
      alert("Fail to connect to our server");
    }
  };
  users.send(dataTopost);
}
function openCertificate(certurl) {
  if (isondevice == true) {
    var url = certurl;
    var target = "_blank";
    var options = "location = yes";
    var ref = cordova.InAppBrowser.open(url, target, options);

    ref.addEventListener("loadstart", loadstartCallback);
    ref.addEventListener("loadstop", loadstopCallback);
    ref.addEventListener("loaderror", loaderrorCallback);
    ref.addEventListener("exit", exitCallback);

    function loadstartCallback(event) {
      console.log("Loading started: " + event.url);
    }

    function loadstopCallback(event) {
      console.log("Loading finished: " + event.url);
    }

    function loaderrorCallback(error) {
      console.log("Loading error: " + error.message);
    }

    function exitCallback() {
      console.log("Browser is closed...");
    }
  } else {
    window.open(certurl);
  }
}
function openCM(test) {
  if (test == "COVID-19-TESTING") {
    var url =
      "https://epink.health/booking/?form=home-covid-19-test&public=" +
      authUser.login_token;
    var target = "_blank";
    var options = "location = yes";
    var ref = cordova.InAppBrowser.open(url, target, options);

    ref.addEventListener("loadstart", loadstartCallback);
    ref.addEventListener("loadstop", loadstopCallback);
    ref.addEventListener("loaderror", loaderrorCallback);
    ref.addEventListener("exit", exitCallback);

    function loadstartCallback(event) {
      console.log("Loading started: " + event.url);
    }

    function loadstopCallback(event) {
      console.log("Loading finished: " + event.url);
    }

    function loaderrorCallback(error) {
      console.log("Loading error: " + error.message);
    }

    function exitCallback() {
      console.log("Browser is closed...");
    }
  }
  if (test == "COVID-19-VACCINATION") {
    var url =
      "https://epink.health/booking/?form=covid-19-vaccination&public=" +
      authUser.login_token;
    var target = "_blank";
    var options = "location = yes";
    var ref = cordova.InAppBrowser.open(url, target, options);

    ref.addEventListener("loadstart", loadstartCallback);
    ref.addEventListener("loadstop", loadstopCallback);
    ref.addEventListener("loaderror", loaderrorCallback);
    ref.addEventListener("exit", exitCallback);

    function loadstartCallback(event) {
      console.log("Loading started: " + event.url);
    }

    function loadstopCallback(event) {
      console.log("Loading finished: " + event.url);
    }

    function loaderrorCallback(error) {
      console.log("Loading error: " + error.message);
    }

    function exitCallback() {
      console.log("Browser is closed...");
    }
  }
  if (test == "COVID-19-ANTIBODY") {
    var url =
      "https://epink.health/booking/?form=vaccination-antibody-test&public=" +
      authUser.login_token;
    var target = "_blank";
    var options = "location = yes";
    var ref = cordova.InAppBrowser.open(url, target, options);

    ref.addEventListener("loadstart", loadstartCallback);
    ref.addEventListener("loadstop", loadstopCallback);
    ref.addEventListener("loaderror", loaderrorCallback);
    ref.addEventListener("exit", exitCallback);

    function loadstartCallback(event) {
      console.log("Loading started: " + event.url);
    }

    function loadstopCallback(event) {
      console.log("Loading finished: " + event.url);
    }

    function loaderrorCallback(error) {
      console.log("Loading error: " + error.message);
    }

    function exitCallback() {
      console.log("Browser is closed...");
    }
  }
  if (test == "COVID-19-ANTIBODY") {
    var url =
      "https://epink.health/booking/?form=quarantine-services&public=" +
      authUser.login_token;
    var target = "_blank";
    var options = "location = yes";
    var ref = cordova.InAppBrowser.open(url, target, options);

    ref.addEventListener("loadstart", loadstartCallback);
    ref.addEventListener("loadstop", loadstopCallback);
    ref.addEventListener("loaderror", loaderrorCallback);
    ref.addEventListener("exit", exitCallback);

    function loadstartCallback(event) {
      console.log("Loading started: " + event.url);
    }

    function loadstopCallback(event) {
      console.log("Loading finished: " + event.url);
    }

    function loaderrorCallback(error) {
      console.log("Loading error: " + error.message);
    }

    function exitCallback() {
      console.log("Browser is closed...");
    }
  }
  if (test == "COVID-19-ANTIBODY") {
    var url =
      "https://epink.health/booking/?form=post-covid-screening-and-rehabilitation&public=" +
      authUser.login_token;
    var target = "_blank";
    var options = "location = yes";
    var ref = cordova.InAppBrowser.open(url, target, options);

    ref.addEventListener("loadstart", loadstartCallback);
    ref.addEventListener("loadstop", loadstopCallback);
    ref.addEventListener("loaderror", loaderrorCallback);
    ref.addEventListener("exit", exitCallback);

    function loadstartCallback(event) {
      console.log("Loading started: " + event.url);
    }

    function loadstopCallback(event) {
      console.log("Loading finished: " + event.url);
    }

    function loaderrorCallback(error) {
      console.log("Loading error: " + error.message);
    }

    function exitCallback() {
      console.log("Browser is closed...");
    }
  }
}
function setFullname(element) {
  var firstname = document.getElementById("register_firstname").value;
  var lastname = document.getElementById("register_lastname").value;
  document.getElementById("register_fullname").value =
    firstname + " " + lastname;
}
function initiateVaccinelist() {
  document.getElementById("vaccinelister").innerHTML = "";
  var dataTopost =
    "api=1&auth_token=" + authUser.login_token + "&getmyvaccinecert=true";
  var users = new XMLHttpRequest();
  users.open("POST", serverUrl, true);
  users.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  users.onload = function () {
    if (users.status == 200) {
      var json = users.responseText;
      var response = JSON.parse(json);
      for (let i = 0; i < response.length; i++) {
        var certdetail = JSON.parse(response[i].attachments);
        console.log(certdetail);
        console.log();
        document.getElementById("vaccinelister").innerHTML +=
          '<li class="collection-item" onclick="openVaccineCert(\'https://epink.health/certs/' +
          response[i].id +
          '\')"><a href="#" class="black-text">' +
          certdetail.vaccine_name +
          "<br>Expire Date: " +
          certdetail.expiry_date +
          "<a></li>";
      }
    } else if (users.status == 404) {
      alert("Fail to connect to our server");
    } else {
      alert("Fail to connect to our server");
    }
  };
  users.send(dataTopost);
}
function openVaccineCert(urls) {
  openBrowserNew(urls);
}
function closeVaccinelist() {
  document.getElementById("vaccinelister").innerHTML = "";
  openpage("setting");
}
function prepareHomepagetoopen(pid, pharmaname) {
  gpaid = pid;
  openpage("homepage");
  localStorage.setItem("filter_sub", null);
}
function initPharmacynearby() {
  var dataTopost =
    "api=1&auth_token=" +
    authUser.login_token +
    "&getnearbypharmacist=true&lat=" +
    appLat +
    "&lng=" +
    appLng;
  var users = new XMLHttpRequest();
  users.open("POST", serverUrl, true);
  users.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  users.onload = function () {
    if (users.status == 200) {
      var json = users.responseText;
      var response = JSON.parse(json);
      var i;
      document.getElementById("listofpharmacy").innerHTML = "";
      for (i = 0; i < response.length; i++) {
        document.getElementById("listofpharmacy").innerHTML +=
          '<div class="card" style="border-radius: 10px" onclick="prepareHomepagetoopen(' +
          response[i].id +
          ')"><div class="card-content" style="padding: 0px; padding-top: 10px"><div class="row"><div class="col s4"><img src="' +
          response[i].vendor_logo +
          '" width="100%"></div><div class="col s8"><p class="pink-text strong">' +
          response[i].vendor_name +
          '</p><span class="small" >' +
          parseInt(response[i].distance) +
          'KM<br></span><span class="small"><i class="material-icons tiny" style="vertical-align: middle;">location_on</i>' +
          response[i].vendor_address +
          "</span></div></div></div></div>";
        //document.getElementById("listofpharmacy").innerHTML += '<li> <p>id : '+response[i].id+'</p> <p>type : '+response[i].type+'</p> <p>doctor : '+response[i].doctor+'</p> <p>doctor_apc : '+response[i].doctor_apc+'</p> <p>verified_service_provider : '+response[i].verified_service_provider+'</p> <p>provider_type : '+response[i].provider_type+'</p> <p>email : '+response[i].email+'</p> <p>password : '+response[i].password+'</p> <p>firstname : '+response[i].firstname+'</p> <p>lastname : '+response[i].lastname+'</p> <p>fullname : '+response[i].fullname+'</p> <p>country : '+response[i].country+'</p> <p>date_of_birth : '+response[i].date_of_birth+'</p> <p>ic_number : '+response[i].ic_number+'</p> <p>address : '+response[i].address+'</p> <p>weight : '+response[i].weight+'</p> <p>height : '+response[i].height+'</p> <p>gender : '+response[i].gender+'</p> <p>blood_group : '+response[i].blood_group+'</p> <p>bmi : '+response[i].bmi+'</p> <p>heart_rate : '+response[i].heart_rate+'</p> <p>respiratory_rate : '+response[i].respiratory_rate+'</p> <p>blood_glucose : '+response[i].blood_glucose+'</p> <p>blood_fasting_glucose : '+response[i].blood_fasting_glucose+'</p> <p>blood_none_fasting_glucose : '+response[i].blood_none_fasting_glucose+'</p> <p>alergy : '+response[i].alergy+'</p> <p>medications : '+response[i].medications+'</p> <p>profile_img : '+response[i].profile_img+'</p> <p>hash : '+response[i].hash+'</p> <p>phonenumber : '+response[i].phonenumber+'</p> <p>login_token : '+response[i].login_token+'</p> <p>visitors : '+response[i].visitors+'</p> <p>vendor_name : '+response[i].vendor_name+'</p> <p>vendor_address : '+response[i].vendor_address+'</p> <p>vendor_open_time : '+response[i].vendor_open_time+'</p> <p>vendor_close_time : '+response[i].vendor_close_time+'</p> <p>vendor_type : '+response[i].vendor_type+'</p> <p>vendor_halal : '+response[i].vendor_halal+'</p> <p>lat : '+response[i].lat+'</p> <p>lng : '+response[i].lng+'</p> <p>availability : '+response[i].availability+'</p> <p>cod_activated : '+response[i].cod_activated+'</p> <p>wallet : '+response[i].wallet+'</p> <p>bank_name : '+response[i].bank_name+'</p> <p>bank_account_number : '+response[i].bank_account_number+'</p> <p>card_id : '+response[i].card_id+'</p> <p>rider_type : '+response[i].rider_type+'</p> <p>rider_credit : '+response[i].rider_credit+'</p> <p>rate : '+response[i].rate+'</p> <p>video_rate : '+response[i].video_rate+'</p> <p>category : '+response[i].category+'</p> <p>language : '+response[i].language+'</p> <p>residency : '+response[i].residency+'</p> <p>education : '+response[i].education+'</p> <p>education_certificate : '+response[i].education_certificate+'</p> <p>practice_country : '+response[i].practice_country+'</p> <p>ic : '+response[i].ic+'</p> <p>patient_attended : '+response[i].patient_attended+'</p> <p>about_me : '+response[i].about_me+'</p> <p>approved_by_trustgate : '+response[i].approved_by_trustgate+'</p> <p>reset_code : '+response[i].reset_code+'</p> <p>request_reset_date : '+response[i].request_reset_date+'</p> <p>categories : '+response[i].categories+'</p> <p>organization_name : '+response[i].organization_name+'</p> <p>organization_designation : '+response[i].organization_designation+'</p> <p>organization_address : '+response[i].organization_address+'</p> <p>organization_city : '+response[i].organization_city+'</p> <p>organization_state : '+response[i].organization_state+'</p> <p>organization_postcode : '+response[i].organization_postcode+'</p> <p>organization_country : '+response[i].organization_country+'</p> <p>organization_phone_number : '+response[i].organization_phone_number+'</p> <p>organization_fax_number : '+response[i].organization_fax_number+'</p> <p>organization_registeration_number : '+response[i].organization_registeration_number+'</p> <p>public_token : '+response[i].public_token+'</p> <p>secret_token : '+response[i].secret_token+'</p> <p>id_token : '+response[i].id_token+'</p> <p>trustgateid : '+response[i].trustgateid+'</p> <p>signaturefile : '+response[i].signaturefile+'</p> <p>trustgatepin : '+response[i].trustgatepin+'</p> <p>trustgate_pin_activation_link : '+response[i].trustgate_pin_activation_link+'</p> <p>my_referral_code : '+response[i].my_referral_code+'</p> <p>my_referrer : '+response[i].my_referrer+'</p> <p>decline_reason : '+response[i].decline_reason+'</p> <p>company_name : '+response[i].company_name+'</p> <p>company_code : '+response[i].company_code+'</p> <p>company_manager : '+response[i].company_manager+'</p> <p>customer_approved : '+response[i].customer_approved+'</p> <p>specialist : '+response[i].specialist+'</p> <p>pharma_categories : '+response[i].pharma_categories+'</p> <p>internal : '+response[i].internal+'</p> <p>manage_pharma : '+response[i].manage_pharma+'</p> <p>activation_link : '+response[i].activation_link+'</p> <p>inhouse : '+response[i].inhouse+'</p></li>';
      }
      loadingResponse(response.message);
    } else if (users.status == 404) {
      alert("Fail to connect to our server");
    } else {
      alert("Fail to connect to our server");
    }
  };
  users.send(dataTopost);
}
function openPdfFile(targeturl) {
  window.open(targeturl, "_blank");
}
function openBrowserNew(targeturl) {
  if (isondevice == false) {
    //window.location.href = targeturl;
    //window.open(targeturl, '_blank');
    window.open(encodeURI("targeturl", "_system", "location=yes"));
  } else {
    var url = targeturl;
    var target = "_system";
    var options =
      "location=yes,hardwareback=yes,lefttoright=yes,zoom=no,hideurlbar=yes,toolbarcolor=#ffffff,hidenavigationbuttons=yes,closebuttoncolor=#000000";
    var ref = cordova.InAppBrowser.open(url, target, options);

    ref.addEventListener("loadstart", loadstartCallback);
    ref.addEventListener("loadstop", loadstopCallback);
    ref.addEventListener("loaderror", loaderrorCallback);
    ref.addEventListener("exit", exitCallback);

    function loadstartCallback(event) {
      console.log("Loading started: " + event.url);
    }

    function loadstopCallback(event) {
      console.log("Loading finished: " + event.url);
    }

    function loaderrorCallback(error) {
      console.log("Loading error: " + error.message);
    }

    function exitCallback() {
      openpage("walletpage");
    }
  }
}

function checkPermission() {
  var permissions = cordova.plugins.permissions;
  permissions.requestPermission(
    permissions.RECORD_AUDIO,
    function () {},
    function () {}
  );
  permissions.requestPermission(
    permissions.CAMERA,
    function () {},
    function () {}
  );
}

function initAvailableDevice() {
  show("availabledeviceto");
}

function initEmergencyss() {
  var markerss = "img/marker.png";
  const myLatLng = { lat: appLat, lng: appLng };
  const map = new google.maps.Map(document.getElementById("emergencymap"), {
    zoom: 18,
    center: myLatLng,
    disableDefaultUI: true,
  });
  new google.maps.Marker({
    position: myLatLng,
    map,
    title: "My Location",
    icon: markerss,
  });
  document.getElementById("emergencymap").style.height = "100vh";
}
var emergencymap;
var emergencyservuce;
function initEmergency() {
  var pyrmont = new google.maps.LatLng(parseFloat(appLat), parseFloat(appLng));

  emergencymap = new google.maps.Map(document.getElementById("emergencymap"), {
    center: pyrmont,
    zoom: 18,
  });

  var request = {
    location: pyrmont,
    radius: "100000",
    type: ["hospital"],
  };

  emergencyservuce = new google.maps.places.PlacesService(emergencymap);
  emergencyservuce.nearbySearch(request, callback);
  //document.getElementById("emergencymap").style.height = "100vh";
}

function callback(results, status) {
  if (status == google.maps.places.PlacesServiceStatus.OK) {
    for (var i = 0; i < results.length; i++) {
      var name = results[i].name;
      if (
        name.includes("Klinik") ||
        name.includes("Hospital") ||
        name.includes("Clinics")
      ) {
        console.log(name);
        var cordinates = JSON.parse(
          JSON.stringify(results[i].geometry.location)
        );
        console.log(cordinates);
        console.log(results[i]);
      }
    }
  }
}

function distance(lat1, lon1, lat2, lon2) {
  let unit = "K";
  if (lat1 == lat2 && lon1 == lon2) {
    return 0;
  } else {
    var radlat1 = (Math.PI * lat1) / 180;
    var radlat2 = (Math.PI * lat2) / 180;
    var theta = lon1 - lon2;
    var radtheta = (Math.PI * theta) / 180;
    var dist =
      Math.sin(radlat1) * Math.sin(radlat2) +
      Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    if (dist > 1) {
      dist = 1;
    }
    dist = Math.acos(dist);
    dist = (dist * 180) / Math.PI;
    dist = dist * 60 * 1.1515;
    if (unit == "K") {
      dist = dist * 1.609344;
    }
    if (unit == "N") {
      dist = dist * 0.8684;
    }
    return dist;
  }
}
