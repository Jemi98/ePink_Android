var carenewLat = 0;
var carenewLng = 0;
var currentlyviewingnewcare = 0;
var globalpackagedata;
var sessionEnded;
var activeCareChatid;
var carechatname;
function opencarechat() {
  var id = currentlyviewingnewcare;
  sessionEnded = false;
  addPreloader("care_chat_all_content");
  document.getElementById("chatlistingcontent").innerHTML = "";
  var dataTopost =
    "api=1&auth_token=" + authUser.login_token + "&getcarechatcontent=" + id;
  var xhr = new XMLHttpRequest();
  xhr.open("POST", serverUrl, true);
  xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhr.onload = function () {
    if (xhr.status == 200) {
      var json = xhr.responseText;
      var response = JSON.parse(json);
      document.getElementById("care_chat_all_content").innerHTML = "";
      if (response.status == null) {
        var sesend = 0;
        document.getElementById("chatlistingcontent").innerHTML = "";
        var i;
        for (i = 0; i < response.length; i++) {
          if (response[i].owner == authUser.id) {
            document.getElementById("care_chat_all_content").innerHTML +=
              '<div class="row "><div class="col s2"></div><div class="col s8 grey lighten-4 right"><span class=""><p class="" style="font-size: initial">' +
              response[i].chat_content +
              '</p><p class="chatdate">' +
              response[i].chat_date +
              "</p></span></div></div>";
          } else if (response[i].owner == 0) {
            document.getElementById("care_chat_all_content").innerHTML +=
              '<div class="row"<div class="col s2"></div><div class="col s8 orange lighten-2 white-text" style="padding: 10px"><p style="font-size: initial">' +
              response[i].chat_content +
              '</p><p class="chatdate">' +
              response[i].chat_date +
              '</p></div><div class="col s2"></div></div><br>';
            sesend++;
          } else {
            document.getElementById("care_chat_all_content").innerHTML +=
              '<div class="row"><div class="col s8 blue lighten-2 white-text"><p style="font-size: initial">' +
              response[i].chat_content +
              '</p><p class="chatdate">' +
              response[i].chat_date +
              '</p></div><div class="col s2"></div></div>';
          }

          carelastChatid = response[i].id;
        }
        if (sesend == 2) {
          sessionEnded = true;
        }
        console.log(sesend);
        chatisActive = true;
        setTimeout(updateChat, 3000);
      } else {
        //document.getElementById("chat_all_content").innerHTML = 'You havent started any chat';
      }
      window.scrollTo(0, document.body.scrollHeight);
    } else if (xhr.status == 404) {
      alert("Fail to connect to our server");
    } else {
      alert("Fail to connect to our server");
    }
  };
  xhr.send(dataTopost);
}

function postcareChat() {
  clearTimeout(chatCheck);
  var chatMessage = encodeURIComponent(
    document.getElementById("care_chatinput").value
  );
  if (chatMessage != "") {
    var dataTopost =
      "api=1&auth_token=" +
      authUser.login_token +
      "&carepostchat=true&conversationid=" +
      currentlyviewingnewcare +
      "&message=" +
      chatMessage;
    var xhr = new XMLHttpRequest();
    xhr.open("POST", serverUrl, true);
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.onload = function () {
      if (xhr.status == 200) {
        var json = xhr.responseText;
        var response = JSON.parse(json);
        chatCheck = setTimeout(function () {
          careupdateChat();
        }, 1000);
        document.getElementById("care_chatinput").value = "";
      } else if (xhr.status == 404) {
        alert("Fail to connect to our server");
      } else {
        alert("Fail to connect to our server");
      }
    };
    xhr.send(dataTopost);
  }
}

var carepreviouschatupdate = [];
function careupdateChat() {
  var chatWindowactive =
    document.getElementById("carechatcontent").style.display;
  if (chatWindowactive == "block") {
    var dataTopost =
      "api=1&auth_token=" +
      authUser.login_token +
      "&updateactivechatcare=" +
      currentlyviewingnewcare +
      "&lastid=" +
      lastChatid;
    var xhr = new XMLHttpRequest();
    xhr.open("POST", serverUrl, true);
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.onload = function () {
      if (xhr.status == 200) {
        var json = xhr.responseText;
        var response = JSON.parse(json);
        if (response.status == null) {
          rendered = false;
          console.log(previouschatupdate);
          if (previouschatupdate != []) {
            var j;
            for (j = 0; j < previouschatupdate.length; j++) {
              var idtocheck = previouschatupdate[j].id;
              var k;
              for (k = 0; k < response.length; k++) {
                if (response[k].id == idtocheck) {
                  var rendered = true;
                }
              }
            }
          }
          var sesend = 0;
          if (rendered == false) {
            var i;
            for (i = 0; i < response.length; i++) {
              if (response[i].owner == authUser.id) {
                document.getElementById("care_chat_all_content").innerHTML +=
                  '<div class="row "><div class="col s2"></div><div class="col s8 grey lighten-4 right"><span class=""><p class="">' +
                  response[i].chat_content +
                  '</p><p class="chatdate">' +
                  response[i].chat_date +
                  "</p></span></div></div>";
              } else if (response[i].owner == 0) {
                document.getElementById("care_chat_all_content").innerHTML +=
                  '<div class="row"<div class="col s2"></div><div class="col s8 orange lighten-2 white-text" style="padding: 10px"><p>' +
                  response[i].chat_content +
                  '</p><p class="chatdate">' +
                  response[i].chat_date +
                  '</p></div><div class="col s2"></div></div>';
                sesend++;
              } else {
                document.getElementById("care_chat_all_content").innerHTML +=
                  '<div class="row"><div class="col s8 blue lighten-2 white-text"><p>' +
                  response[i].chat_content +
                  '</p><p class="chatdate">' +
                  response[i].chat_date +
                  '</p></div><div class="col s2"></div></div>';
              }
              lastChatid = response[i].id;
            }
          }
          if (sesend == 2) {
            sessionEnded = true;
          }
          window.scrollTo(0, document.body.scrollHeight);
          previouschatupdate = response;
          chatCheck = setTimeout(careupdateChat, 1000);
        } else {
          chatCheck = setTimeout(careupdateChat, 1000);
        }
      } else if (xhr.status == 404) {
        alert("Fail to connect to our server");
      } else {
        alert("Fail to connect to our server");
      }
    };
    xhr.send(dataTopost);
  } else {
    clearTimeout(chatCheck);
  }
}

function openMap() {
  window.open(publicmaptoopen);
}

var publicmaptoopen = "";
function doctorviewcareRequest(id) {
  carechatname = "";
  showLoading();
  var dataTopost =
    "api=1&auth_token=" +
    authUser.login_token +
    "&customerviewcarerequest=" +
    id;
  var care = new XMLHttpRequest();
  care.open("POST", serverUrl, true);
  care.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  care.onload = function () {
    if (care.status == 200) {
      var json = care.responseText;
      var response = JSON.parse(json);
      console.log(response);
      currentlyviewingnewcare = response.id;
      if (response.status != "Fail") {
        document.getElementById("caredocpackagelister").innerHTML = "";
        if (
          response.caretypeori == "House Call" &&
          response.packages_data == "None"
        ) {
          var carecategory = "House Call Without Package";
          show("doclocationtarget");
          document.getElementById("doccareviewnavname").innerHTML =
            "House Call";
          hide("docsssionhaspackage");
        } else if (
          response.caretypeori == "House Call" &&
          response.packages_data != "None"
        ) {
          show("doclocationtarget");
          var carecategory = "House Call With Package";
          document.getElementById("doccareviewnavname").innerHTML =
            "House Call";
        } else if (
          response.caretypeori == "Walk In" &&
          response.packages_data == "None"
        ) {
          hide("doclocationtarget");
          var carecategory = "Walk In Without Package";
          document.getElementById("doccareviewnavname").innerHTML = "Walk In";
        } else if (
          response.caretypeori == "Walk In" &&
          response.packages_data != "None"
        ) {
          hide("doclocationtarget");
          var carecategory = "Walk In With Package";
          document.getElementById("doccareviewnavname").innerHTML = "Walk In";
        }
        careHasAttachment = response.require_attachment;
        let service_data = response.servicedata;
        let packages_data;
        if (response.packages_data != "None") {
          packages_data = JSON.parse(response.packages_data);
        } else {
          packages_data = response.packages_data;
        }

        let patient_data = response.patient;

        document.getElementById("caredocviewicon").src = service_data.icon;
        document.getElementById("caredocview_servicename").innerHTML =
          service_data.name;
        document.getElementById("caredocview_servicedescription").innerHTML =
          service_data.description;
        document.getElementById("caredocview_serviceprice").innerHTML =
          Math.round(response.careprice * 0.7);
        var deli =
          "geo:" +
          response.lat +
          "," +
          response.lng +
          "?q=" +
          response.patientaddress;
        publicmaptoopen = deli;
        document.getElementById("careviewbydocaddress").innerHTML =
          response.patientaddress;
        document.getElementById("caredocviewaddresslandmark").innerHTML =
          response.addresslandmark;

        document.getElementById("docpackagesessionmagericon").src =
          service_data.icon;
        document.getElementById("docpackagesessionmagerservicename").innerHTML =
          service_data.name;
        document.getElementById("docpackagesessionmagerdescription").innerHTML =
          service_data.description;
        document.getElementById("docpackagesessionmagerprice").innerHTML =
          response.careprice;

        document.getElementById("caredocview_patientpicture").src =
          patient_data.profile_img;
        let patientfullname =
          patient_data.firstname + " " + patient_data.lastname;
        console.log(patient_data);
        carechatname = patientfullname;
        if (patientfullname == response.patientname) {
          document.getElementById("caredocview_patientname").innerHTML =
            patientfullname;
        } else {
          document.getElementById("caredocview_patientname").innerHTML =
            response.patientname + "<br>Requested by ".patientfullname;
        }
        document.getElementById("caredocview_patientphonenumber").innerHTML =
          patient_data.phonenumber;
        document.getElementById("caredocview_appointmentdate").innerHTML =
          response.timer;
        //Action
        //console.log(packages_data);

        if (response.request_status == "New") {
          hide("docsssionhaspackage");
          hide("caredocviewsms");
          document.getElementById("caredocviewactionpanel").innerHTML =
            '<button class="btn ebutton pink white-text" onclick="docacceptThiscarejob(' +
            response.id +
            ')">Accept Request</button>';
          document.getElementById("caredocview_patientphonenumber").innerHTML =
            "Accept to view phone nummber";
        }

        if (response.request_status == "Accepted") {
          document.getElementById("carebackchat").innerHTML =
            '<a href="#!" class="pink-text strong nav-text" onclick="openpage(\'careviewbydoc\', ' +
            currentlyviewingnewcare +
            ')"><i class="material-icons left">arrow_back</i><span id="care_read_chat_partner_name" class="pink-text truncate">' +
            patientfullname +
            "</span></a>";
          show("caredocviewsms");
          console.log(carecategory);
          if (carecategory == "House Call Without Package") {
            document.getElementById("caredocviewactionpanel").innerHTML =
              '<button class="btn ebutton pink white-text" onclick="docstartedThiscarejob(' +
              response.id +
              ')">Start</button><p class="center">Start this request as soon as you heading to customer location</p>';
          } else if (carecategory == "House Call With Package") {
            renderPackageSession(packages_data);
            hide("appintmentdatenormal");
            show("docsssionhaspackage");
          } else if (carecategory == "Walk In With Package") {
            renderPackageSession(packages_data);
            hide("appintmentdatenormal");

            show("docsssionhaspackage");
          } else if (carecategory == "Walk In Without Package") {
            hide("docsssionhaspackage");
            document.getElementById("caredocviewactionpanel").innerHTML =
              '<button class="btn ebutton pink white-text" onclick="docstartedThiscarejob(' +
              response.id +
              ')">Start</button><p class="center">Start this request as soon as the customer arrived to your establishment</p>';
            show("appintmentdatenormal");
            hide("docsssionhaspackage");
          }
        }
        if (response.request_status == "Started") {
          document.getElementById("carebackchat").innerHTML =
            '<a href="#!" class="pink-text strong nav-text" onclick="openpage(\'careviewbydoc\', ' +
            currentlyviewingnewcare +
            ')"><i class="material-icons left">arrow_back</i><span id="care_read_chat_partner_name" class="pink-text truncate">' +
            patientfullname +
            "</span></a>";
          show("caredocviewsms");
          document.getElementById("caredocviewactionpanel").innerHTML =
            '<button class="btn ebutton pink white-text" onclick="doccompleteThisCarejob(' +
            response.id +
            ",`" +
            response.patientproblem +
            "`,`" +
            response.teleid +
            '`)">End Session</button><p class="center">End this session as you complete to receive your payment.</p>';
        }
        if (response.request_status == "End") {
          hide("caredocviewsms");
          document.getElementById("caredocviewactionpanel").innerHTML =
            "This request has been completed. RM" +
            response.careprice +
            " has been sent to your wallet";
        }
        if (response.request_status == "Completed") {
          hide("caredocviewsms");
          document.getElementById("caredocviewactionpanel").innerHTML =
            "This request has been completed. RM" +
            response.careprice +
            " has been sent to your wallet";
        }
      } else {
        openpage("universalserviceprovider");
      }
    } else if (care.status == 404) {
      alert("Fail to connect to our server");
    } else {
      alert("Fail to connect to our server");
    }
  };
  care.send(dataTopost);
}

function renderPackageSession(data) {
  document.getElementById("caredocpackagelister").innerHTML = "";
  packages_data = data;
  globalpackagedata = packages_data;
  var incompletesession = packages_data.length;
  var numbering = 1;
  for (let i = 0; i < packages_data.length; i++) {
    if (packages_data[i].status == "Completed") {
      incompletesession--;
    }
    if (
      packages_data[i].status == "New" &&
      packages_data[i].appointment_date != "Not Set"
    ) {
      var actionbuttonforinprogress =
        '<button class="pink white-text ebutton btn btn-sm" style="height: 35px" onclick="opensessionUpdater(' +
        i +
        ')">Update</button>';
    } else {
      var actionbuttonforinprogress = "";
    }

    document.getElementById("caredocpackagelister").innerHTML +=
      '<li class="collection-item" style="padding: 0px; border-bottom: 0px"><div class="card white z-depth-2" style="border-radius: 20px"><div class="card-content" style="padding: 18px"><p class="pink-text strong">Session ' +
      numbering +
      ' <span class="right">' +
      packages_data[i].status +
      "</span></p><p>Appointment: " +
      packages_data[i].appointment_date +
      "</p>" +
      actionbuttonforinprogress +
      "</div></div></li>";

    numbering++;
  }

  if (incompletesession == 0) {
    document.getElementById("caredocviewactionpanel").innerHTML =
      '<button class="btn ebutton pink white-text" onclick="doccompleteThisCarejob(' +
      currentlyviewingnewcare +
      ')">Complete Request</button><p>All session has been completed. You may complete this request now.</p>';
  } else {
    document.getElementById("caredocviewactionpanel").innerHTML =
      '<button class="btn ebutton pink white-text" onclick="" disabled>Complete Request</button><p>Unable to complete this request because there is a few session is incomplete.</p>';
  }
}
var currentlyviewingsession = 0;
function opensessionUpdater(id) {
  currentlyviewingsession = id;
  var numbering = id + 1;
  show("docpackagesessionmager");
  show("docpackagesessionmagersetcomplete");
  hide("docpackagesessionmagersetcompleteconfirm");
  document.getElementById("docpackagesessionmager_sid").innerHTML =
    "Session " + numbering;
  document.getElementById("docpackagesessionmager_date").innerHTML =
    globalpackagedata[id].appointment_date;
}
function preparesetComplete() {
  show("docpackagesessionmagersetcompleteconfirm");
  hide("docpackagesessionmagersetcomplete");
  hide("packageinfomanagersession");
}

function confirmSetCompleteSession() {
  var nextsession = parseInt(currentlyviewingsession) + 1;
  var totalSession = globalpackagedata.length;
  if (nextsession == totalSession) {
    console.log(globalpackagedata[currentlyviewingsession]);
    var clinicalnote = document.getElementById("nextsessionclinicalnote").value;
    globalpackagedata[currentlyviewingsession].status = "Completed";
    globalpackagedata[currentlyviewingsession].clincal_note = clinicalnote;
    updateSessiondatarealtime();
  } else {
    console.log(globalpackagedata[currentlyviewingsession]);
    var clinicalnote = document.getElementById("nextsessionclinicalnote").value;
    globalpackagedata[currentlyviewingsession].status = "Completed";
    globalpackagedata[currentlyviewingsession].clincal_note = clinicalnote;
    var nextsessiondate = document.getElementById("nextsessiondate").value;
    var nextsessiontime = document.getElementById("nextsessiontime").value;
    var nextsessionfulldate = nextsessiondate + " " + nextsessiontime;
    globalpackagedata[nextsession].appointment_date = nextsessionfulldate;
    updateSessiondatarealtime();
  }
  document.getElementById("nextsessionclinicalnote").value = "";
  document.getElementById("nextsessiondate").value = "";
  document.getElementById("nextsessiontime").value = "";
}

function updateSessiondatarealtime() {
  hide("docpackagesessionmager");
  showLoading();
  var packagedatatosave = JSON.stringify(globalpackagedata);
  var dataTopost =
    "api=1&auth_token=" +
    authUser.login_token +
    "&editcarepackage=" +
    currentlyviewingnewcare +
    "&carepackageupdatedata=" +
    packagedatatosave;
  var care = new XMLHttpRequest();
  care.open("POST", serverUrl, true);
  care.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  care.onload = function () {
    if (care.status == 200) {
      var json = care.responseText;
      var response = JSON.parse(json);
      openpage("careviewbydoc", currentlyviewingnewcare);
    } else if (care.status == 404) {
      alert("Fail to connect to our server");
    } else {
      alert("Fail to connect to our server");
    }
  };
  care.send(dataTopost);
}
function docstartedThiscarejob(id) {
  showLoading();
  var dataTopost =
    "api=1&auth_token=" + authUser.login_token + "&startedThiscarejob=" + id;
  var care = new XMLHttpRequest();
  care.open("POST", serverUrl, true);
  care.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  care.onload = function () {
    if (care.status == 200) {
      var json = care.responseText;
      var response = JSON.parse(json);
      openpage("careviewbydoc", id);
    } else if (care.status == 404) {
      alert("Fail to connect to our server");
    } else {
      alert("Fail to connect to our server");
    }
  };
  care.send(dataTopost);
}
function docacceptThiscarejob(id) {
  showLoading();
  var dataTopost =
    "api=1&auth_token=" + authUser.login_token + "&spacceptjob=" + id;
  var care = new XMLHttpRequest();
  care.open("POST", serverUrl, true);
  care.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  care.onload = function () {
    if (care.status == 200) {
      var json = care.responseText;
      var response = JSON.parse(json);
      openpage("careviewbydoc", id);
    } else if (care.status == 404) {
      alert("Fail to connect to our server");
    } else {
      alert("Fail to connect to our server");
    }
  };
  care.send(dataTopost);
}

function doccompleteThisCarejob(id, problem, teleid) {
  if (careHasAttachment == false || careHasAttachment == "false") {
    var dataTopost =
      "api=1&auth_token=" + authUser.login_token + "&completecarejob=" + id;
    var care = new XMLHttpRequest();
    care.open("POST", serverUrl, true);
    care.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    care.onload = function () {
      if (care.status == 200) {
        var json = care.responseText;
        var response = JSON.parse(json);
        openpage("careviewbydoc", id);
      } else if (care.status == 404) {
        alert("Fail to connect to our server");
      } else {
        alert("Fail to connect to our server");
      }
    };
    care.send(dataTopost);
  } else {
    if (problem === "Typhoid Vaccination" || problem === "Vaccination") {
      show("vaccineinformation");
    } else {
      openpage("docsessionview", teleid);
      setTimeout(function () {
        hide("sessiondetail");
        hide("docsessionviewnav");
        show("sessiondiagnose");
        if (authUser.verifying_for == "Doctor") {
          hide("clincalactionnondoctor");
          show("doctorsonlyclinicalnote");
        } else {
          show("clincalactionnondoctor");
          hide("doctorsonlyclinicalnote");
        }
      }, 300);
    }
  }
}

function docattachandcompleteThisCarejob(id) {
  hide("vaccineinformation");
  showLoading();
  var certinfo = {
    vaccine_name: "",
    vaccine_serial: "",
    vaccine_batch: "",
    expiry_date: "",
    dose_interval: "",
    vms: "",
    time: "",
    date: "",
    place: "",
  };
  certinfo.vaccine_name = encodeURIComponent(
    document.getElementById("vaccinename").value
  );
  certinfo.vaccine_serial = encodeURIComponent(
    document.getElementById("vaccineserial").value
  );
  certinfo.vaccine_batch = encodeURIComponent(
    document.getElementById("vaccinebatch").value
  );
  certinfo.expiry_date = encodeURIComponent(
    document.getElementById("vaccineexprirydate").value
  );
  certinfo.dose_interval = encodeURIComponent(
    document.getElementById("vaccinedosageinterval").value
  );
  certinfo.vms = encodeURIComponent(
    document.getElementById("vaccinevms").value
  );
  certinfo.time = encodeURIComponent(
    document.getElementById("vaccinetimeslot").value
  );
  certinfo.date = encodeURIComponent(
    document.getElementById("vaccinedate").value
  );
  certinfo.place = encodeURIComponent(
    document.getElementById("vaccineplace").value
  );

  if (
    certinfo.vaccine_name != "" &&
    certinfo.vaccine_batch != "" &&
    certinfo.expiry_date != "" &&
    certinfo.dose_interval != "" &&
    certinfo.time != "" &&
    certinfo.date != "" &&
    certinfo.place != ""
  ) {
    console.log(certinfo);
    var certificatedata = JSON.stringify(certinfo);
    var dataTopost =
      "api=1&auth_token=" +
      authUser.login_token +
      "&completecarejobcert=" +
      currentlyviewingnewcare +
      "&certificatedata=" +
      certificatedata;
    var care = new XMLHttpRequest();
    care.open("POST", serverUrl, true);
    care.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    care.onload = function () {
      if (care.status == 200) {
        var json = care.responseText;
        var response = JSON.parse(json);
        closeLoading();
        openpage("careviewbydoc", id);
      } else if (care.status == 404) {
        alert("Fail to connect to our server");
      } else {
        alert("Fail to connect to our server");
      }
    };
    care.send(dataTopost);
  } else {
    instaResponse("Please complete the form");
  }
}

function acceptthisteleConsultationrequest() {
  showLoading();
  hide("openTeleRequest");
  var id = currentlyviewingnewcare;
  var dataTopost =
    "api=1&auth_token=" + authUser.login_token + "&acceptthistelecare=" + id;
  var care = new XMLHttpRequest();
  care.open("POST", serverUrl, true);
  care.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  care.onload = function () {
    if (care.status == 200) {
      var json = care.responseText;
      var response = JSON.parse(json);
      if (response.status == "Successfull") {
        openpage("docsessionview", response.chat_id, 0);
      } else {
        loadingResponse(response.message);
      }
    } else if (care.status == 404) {
      alert("Fail to connect to our server");
    } else {
      alert("Fail to connect to our server");
    }
  };
  care.send(dataTopost);
}
function completeThisCarejob(id) {
  if (careHasAttachment == false || careHasAttachment == "false") {
    var dataTopost =
      "api=1&auth_token=" + authUser.login_token + "&completecarejob=" + id;
    var care = new XMLHttpRequest();
    care.open("POST", serverUrl, true);
    care.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    care.onload = function () {
      if (care.status == 200) {
        var json = care.responseText;
        var response = JSON.parse(json);
        openpage("carenewstatus", id, "Doctor");
      } else if (care.status == 404) {
        alert("Fail to connect to our server");
      } else {
        alert("Fail to connect to our server");
      }
    };
    care.send(dataTopost);
  } else {
    show("vaccineinformation");
  }
}

function isEmptyObject(o) {
  return Object.keys(o).every(function (x) {
    return o[x] === "" || o[x] === null; // or just "return o[x];" for falsy values
  });
}
function attachandcompleteThisCarejob(id) {
  hide("vaccineinformation");
  showLoading();
  var certinfo = {
    vaccine_name: "",
    vaccine_serial: "",
    vaccine_batch: "",
    expiry_date: "",
    dose_interval: "",
    vms: "",
    time: "",
    expiry_date: "",
    date: "",
    place: "",
  };
  certinfo.vaccine_name = encodeURIComponent(
    document.getElementById("vaccinename").value
  );
  certinfo.vaccine_serial = encodeURIComponent(
    document.getElementById("vaccineserial").value
  );
  certinfo.vaccine_batch = encodeURIComponent(
    document.getElementById("vaccinebatch").value
  );
  certinfo.expiry_date = encodeURIComponent(
    document.getElementById("vaccineexprirydate").value
  );
  certinfo.dose_interval = encodeURIComponent(
    document.getElementById("vaccinedosageinterval").value
  );
  certinfo.vms = encodeURIComponent(
    document.getElementById("vaccinevms").value
  );
  certinfo.time = encodeURIComponent(
    document.getElementById("vaccinetimeslot").value
  );
  certinfo.date = encodeURIComponent(
    document.getElementById("vaccinedate").value
  );
  certinfo.place = encodeURIComponent(
    document.getElementById("vaccineplace").value
  );

  if (
    certinfo.vaccine_name != "" &&
    certinfo.vaccine_batch != "" &&
    certinfo.expiry_date != "" &&
    certinfo.dose_interval != "" &&
    certinfo.time != "" &&
    certinfo.date != "" &&
    certinfo.place != ""
  ) {
    console.log(certinfo);
    var certificatedata = JSON.stringify(certinfo);
    var dataTopost =
      "api=1&auth_token=" +
      authUser.login_token +
      "&completecarejobcert=" +
      currentlyviewingnewcare +
      "&certificatedata=" +
      certificatedata;
    var care = new XMLHttpRequest();
    care.open("POST", serverUrl, true);
    care.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    care.onload = function () {
      if (care.status == 200) {
        var json = care.responseText;
        var response = JSON.parse(json);
        closeLoading();
        openpage("carenewstatus", currentlyviewingnewcare, "Doctor");
      } else if (care.status == 404) {
        alert("Fail to connect to our server");
      } else {
        alert("Fail to connect to our server");
      }
    };
    care.send(dataTopost);
  } else {
    instaResponse("Please complete the form");
  }
}

function acceptThiscarejob(id) {
  var dataTopost =
    "api=1&auth_token=" + authUser.login_token + "&spacceptjob=" + id;
  var care = new XMLHttpRequest();
  care.open("POST", serverUrl, true);
  care.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  care.onload = function () {
    if (care.status == 200) {
      var json = care.responseText;
      var response = JSON.parse(json);
      openpage("carenewstatus", id, "Doctor");
    } else if (care.status == 404) {
      alert("Fail to connect to our server");
    } else {
      alert("Fail to connect to our server");
    }
  };
  care.send(dataTopost);
}
function startedThiscarejob(id) {
  var dataTopost =
    "api=1&auth_token=" + authUser.login_token + "&startedThiscarejob=" + id;
  var care = new XMLHttpRequest();
  care.open("POST", serverUrl, true);
  care.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  care.onload = function () {
    if (care.status == 200) {
      var json = care.responseText;
      var response = JSON.parse(json);
      openpage("carenewstatus", id, "Doctor");
    } else if (care.status == 404) {
      alert("Fail to connect to our server");
    } else {
      alert("Fail to connect to our server");
    }
  };
  care.send(dataTopost);
}
function cancelThisCareRequest() {
  showLoading();
  var dataTopost =
    "api=1&auth_token=" +
    authUser.login_token +
    "&cancelcare=" +
    currentlyviewingnewcare;
  var care = new XMLHttpRequest();
  care.open("POST", serverUrl, true);
  care.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  care.onload = function () {
    if (care.status == 200) {
      var json = care.responseText;
      var response = JSON.parse(json);
      loadingResponse(response.message);
      openpage("carerequestlist");
    } else if (care.status == 404) {
      alert("Fail to connect to our server");
    } else {
      alert("Fail to connect to our server");
    }
  };
  care.send(dataTopost);
}
var userViewingCarestatus;
var viewingglobalpackagedata;
function openCarePackageSession(id) {
  var sesid = id + 1;
  show("packagemanager");
  var curresntcaresessionpackage = viewingglobalpackagedata[id];
  console.log(curresntcaresessionpackage);
  document.getElementById("sessionviewerwalkingcenter").innerHTML =
    "Session " + sesid;
  document.getElementById("sessionviewerapointmentdate").innerHTML =
    curresntcaresessionpackage.appointment_date;
  document.getElementById("sessionviewerclinicalnote").innerHTML =
    curresntcaresessionpackage.clincal_note;
}
function initcustomerCareview(id, typer) {
  currentlyviewingnewcare = id;
  var dataTopost =
    "api=1&auth_token=" +
    authUser.login_token +
    "&customerviewcarerequest=" +
    currentlyviewingnewcare;
  var care = new XMLHttpRequest();
  care.open("POST", serverUrl, true);
  care.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  care.onload = function () {
    if (care.status == 200) {
      var json = care.responseText;
      console.log(userViewingCarestatus);
      var response = JSON.parse(json);
      careHasAttachment = response.require_attachment;
      var deli =
        "geo:" +
        response.lat +
        "," +
        response.lng +
        "?q=" +
        response.patientaddress;
      publicmaptoopen = deli;
      if (userViewingCarestatus == "Doctor") {
        renderDocCare(response);
      } else {
        //View by customer

        if (response.caretypeori == "House Call") {
          document.getElementById("apointmenttime").innerHTML = response.timer;
          var backbuttonname = "House call";
          //document.getElementById("view_care_request_description").innerHTML = servicedata.description;
          if (response.packages_data != "None") {
            show("housecallviewpackage");
            show("customernewcareaction");
            hide("customerwalkin");
            document.getElementById("packagelisthousecall").innerHTML = "";
            var packagedata = JSON.parse(response.packages_data);
            viewingglobalpackagedata = packagedata;
            var packagename = 1;
            document.getElementById("sessioncounthousecall").innerHTML =
              packagedata.length;
            for (let i = 0; i < packagedata.length; i++) {
              document.getElementById("packagelisthousecall").innerHTML +=
                '<li class="collection-item" onclick="openCarePackageSession(' +
                i +
                ')">Sessions ' +
                packagename +
                '<span class="right">' +
                packagedata[i].appointment_date +
                "</span></li>";
              packagename++;
            }
            hide("carepackages");
            hide("nopackage");
            hide("nopackagedescription");
            hide("walkinview");
            hide("spnewcareaction");
            hide("hasapointmenttime");
            show("housecallpackages");
          } else {
            hide("housecallpackages");
            hide("walkinview");
            hide("customerwalkin");
            hide("carepackages");
            show("housecallview");
            show("customernewcareaction");
            hide("spnewcareaction");
            hide("customerwalkin");
            show("hasapointmenttime");
          }
        } else {
          hide("housecallpackages");
          var backbuttonname = "Walk in";
          var viewservicedata = response.servicedata;
          document.getElementById("subbedpagesname").innerHTML =
            viewservicedata.name;
          document.getElementById("subbedpagesdescription").innerHTML =
            viewservicedata.description;
          document.getElementById("subbedpagesnamenopackage").innerHTML =
            viewservicedata.name;
          document.getElementById("subbedpagesdescriptionnopackage").innerHTML =
            viewservicedata.description;
          if (response.packages_data != "None") {
            document.getElementById("packagelist").innerHTML = "";
            var packagedata = JSON.parse(response.packages_data);
            viewingglobalpackagedata = packagedata;
            var packagename = 1;
            document.getElementById("sessioncount").innerHTML =
              packagedata.length;
            for (let i = 0; i < packagedata.length; i++) {
              document.getElementById("packagelist").innerHTML +=
                '<li class="collection-item" onclick="openCarePackageSession(' +
                i +
                ')">Sessions ' +
                packagename +
                '<span class="right">' +
                packagedata[i].appointment_date +
                "</span></li>";
              packagename++;
            }
            show("carepackages");
            hide("nopackage");
            hide("nopackagedescription");
          } else {
            show("nopackage");
            show("nopackagedescription");
            hide("carepackages");
          }
          show("walkinview");
          hide("housecallview");
          show("customerwalkin");
          hide("customernewcareaction");
          hide("spnewcareaction");
          document.getElementById("careselectedwalkingcenter").innerHTML =
            response.patientaddress;
          document.getElementById("careselectedwalkingcenterdate").innerHTML =
            response.caredate;
          document.getElementById("careselectedwalkingcentertime").innerHTML =
            response.caretime;
          var deli = "geo:?q=" + response.patientaddress;
          document.getElementById("caremapbutton").innerHTML =
            '<a href="#!" id="" class="pink-text nav-text strong" onclick="openMap()"><i class="material-icons left">location_on</i></a>';
        }
        document.getElementById("backcare").innerHTML =
          '<a href="#!" id="lang_navigation_view_my_order_list" class="pink-text nav-text strong" onclick="openpage(\'carerequestlist\')"><i class="material-icons left">arrow_back</i>' +
          backbuttonname +
          "</a>";
        //if patient viewing this

        if (response.request_status == "New") {
          document.getElementById("care_new_cancel_button").disabled = false;
          document.getElementById("care_new_contact_button").disabled = true;
          document.getElementById(
            "care_new_walkin_cancel_button"
          ).disabled = false;
          setTimeout(function () {
            initcustomerCareview(id, typer);
          }, 3000);
          hide("carenewmap");
        } else if (response.request_status == "Canceled") {
          document.getElementById("care_new_cancel_button").disabled = true;
          document.getElementById("care_new_contact_button").disabled = true;
          document.getElementById(
            "care_new_walkin_cancel_button"
          ).disabled = true;
          hide("carenewmap");
        } else if (response.request_status == "Started") {
          var pro = response.sp;
          var fullnamesp =
            pro.designation + " " + pro.firstname + " " + pro.lastname;
          document.getElementById("carebackchat").innerHTML =
            '<a href="#!" class="pink-text strong nav-text" onclick="openpage(\'carenewstatus\', ' +
            currentlyviewingnewcare +
            ')"><i class="material-icons left">arrow_back</i><span id="care_read_chat_partner_name" class="pink-text truncate">' +
            fullnamesp +
            "</span></a>";
          document.getElementById("care_new_contact_button").disabled = false;
          if (response.caretypeori == "House Call") {
            document.getElementById("care_new_cancel_button").disabled = true;

            document.getElementById(
              "care_new_walkin_cancel_button"
            ).disabled = true;
            var markerss = "img/marker.png";
            const myLatLng = {
              lat: parseFloat(response.sp.lat),
              lng: parseFloat(response.sp.lng),
            };
            const map = new google.maps.Map(
              document.getElementById("carenewmap"),
              {
                zoom: 14,
                center: myLatLng,
                disableDefaultUI: true,
              }
            );
            new google.maps.Marker({
              position: myLatLng,
              map,
              title: "Service Provider Location",
              icon: markerss,
            });
            show("carenewmap");
          } else {
            hide("carenewmap");
          }
        } else if (response.request_status == "Accepted") {
          var pro = response.sp;
          var fullnamesp =
            pro.designation + " " + pro.firstname + " " + pro.lastname;
          document.getElementById("carebackchat").innerHTML =
            '<a href="#!" class="pink-text strong nav-text" 	onclick="openpage(\'carenewstatus\', ' +
            currentlyviewingnewcare +
            ')"><i class="material-icons left">arrow_back</i><span id="care_read_chat_partner_name" class="pink-text truncate">' +
            fullnamesp +
            "</span></a>";
          document.getElementById("care_new_contact_button").disabled = false;
          if (response.caretypeori == "House Call") {
            document.getElementById("care_new_cancel_button").disabled = true;
            document.getElementById(
              "care_new_walkin_cancel_button"
            ).disabled = true;
            var markerss = "img/marker.png";
            const myLatLng = {
              lat: parseFloat(response.sp.lat),
              lng: parseFloat(response.sp.lng),
            };
            const map = new google.maps.Map(
              document.getElementById("carenewmap"),
              {
                zoom: 14,
                center: myLatLng,
                disableDefaultUI: true,
              }
            );
            new google.maps.Marker({
              position: myLatLng,
              map,
              title: "Service Provider Location",
              icon: markerss,
            });
            show("carenewmap");
          } else {
            document.getElementById("carewalkingserviceprovider").innerHTML =
              "<p>You will be attended by " +
              response.sp.designation +
              ". " +
              response.sp.firstname +
              " " +
              response.sp.lastname +
              ".</p>";
            document.getElementById(
              "care_new_walkin_cancel_button"
            ).disabled = true;
            hide("carenewmap");
          }
        } else if (response.request_status == "Completed") {
          document.getElementById("care_new_cancel_button").disabled = true;
          document.getElementById("care_new_contact_button").disabled = true;
          document.getElementById(
            "care_new_walkin_cancel_button"
          ).disabled = true;
          hide("carenewmap");
        }
      }

      document.getElementById("viewcareimageicon").src =
        response.servicedata.icon;
      document.getElementById("view_care_request_value").innerHTML =
        response.patientproblem;
      document.getElementById("view_care_request_patient").innerHTML =
        response.patientname;
      document.getElementById(
        "view_care_request_patient_phone_number"
      ).innerHTML = response.patient.phonenumber;
      document.getElementById("view_care_request_patient_phone_number").href =
        "tel:" + response.patient.phonenumber;

      document.getElementById(
        "view_care_request_patient_phone_number"
      ).innerHTML = response.patient.phonenumber;
      document.getElementById(
        "view_care_request_patient_phone_number"
      ).innerHTML = response.patient.phonenumber;

      if (response.addresslandmark == "") {
        document.getElementById("carelocationaddresslandmark").innerHTML =
          "Not set";
      } else {
        document.getElementById("carelocationaddresslandmark").innerHTML =
          response.addresslandmark;
      }
      document.getElementById("carelocationaddress").innerHTML =
        response.patientaddress;

      document.getElementById("care_service_provider_status").innerHTML =
        response.request_status;
      if (response.sp == null) {
        if (response.request_status == "Canceled") {
          document.getElementById("care_service_provider_name").innerHTML =
            "None";
        } else {
          document.getElementById("care_service_provider_name").innerHTML =
            "Searching";
        }
      } else {
        var sp_firstname = response.sp.firstname;
        var sp_lastname = response.sp.lastname;
        var sp_designation = response.sp.designation;
        document.getElementById("care_service_provider_name").innerHTML =
          sp_designation + sp_firstname + " " + sp_lastname;
      }
      //setTimeout(function(){ var isview = document.getElementById("carenewstatus").style.display; if(isview == "block"){customerUpdatecare(currentlyviewingnewcare);}}, 30000);
    } else if (care.status == 404) {
      alert("Fail to connect to our server");
    } else {
      alert("Fail to connect to our server");
    }
  };
  care.send(dataTopost);
}

function renderDocCare(data) {
  var response = data;
  var servicedata = response.servicedata;
  if (response.caretypeori == "House Call") {
  } else if (response.caretypeori == "Walk In") {
  }
}
function renderDocCareold(data) {
  var response = data;
  console.log(response);
  if (response.caretypeori == "House Call") {
    var backbuttonname = "House call";
    //document.getElementById("view_care_request_description").innerHTML = servicedata.description;
    if (response.packages_data != "None") {
      show("housecallviewpackage");
      show("customernewcareaction");
    } else {
      hide("walkinview");
      hide("carepackages");
      show("housecallview");
      show("customernewcareaction");
      hide("spnewcareaction");
      hide("customerwalkin");
    }
  } else {
    var backbuttonname = "Walk in";
    var viewservicedata = response.servicedata;
    document.getElementById("subbedpagesname").innerHTML = viewservicedata.name;
    document.getElementById("subbedpagesdescription").innerHTML =
      viewservicedata.description;
    document.getElementById("subbedpagesnamenopackage").innerHTML =
      viewservicedata.name;
    document.getElementById("subbedpagesdescriptionnopackage").innerHTML =
      viewservicedata.description;

    if (response.packages_data != "None") {
      var allcompleted = 0;
      var allcompleted = 0;
      document.getElementById("packagelist").innerHTML = "";
      var packagedata = JSON.parse(response.packages_data);
      viewingglobalpackagedata = packagedata;
      var packagename = 1;
      document.getElementById("sessioncount").innerHTML = packagedata.length;
      for (let i = 0; i < packagedata.length; i++) {
        document.getElementById("packagelist").innerHTML +=
          '<li class="collection-item" onclick="openCarePackageSession(' +
          i +
          ')">Sessions ' +
          packagename +
          '<span class="right">' +
          packagedata[i].appointment_date +
          "</span></li>";
        packagename++;
      }
      show("carepackages");
      hide("nopackage");
      hide("nopackagedescription");
    } else {
      show("nopackage");
      show("nopackagedescription");
      hide("carepackages");
    }
    show("walkinview");
    hide("housecallview");
    hide("customerwalkin");
    hide("customernewcareaction");
    hide("spnewcareaction");
    document.getElementById("careselectedwalkingcenter").innerHTML =
      response.patientaddress;
    document.getElementById("careselectedwalkingcenterdate").innerHTML =
      response.caredate;
    document.getElementById("careselectedwalkingcentertime").innerHTML =
      response.caretime;
    var deli = "geo:?q=" + response.patientaddress;
    document.getElementById("caremapbutton").innerHTML =
      '<a href="' +
      deli +
      '" id="" class="pink-text nav-text strong"><i class="material-icons left">location_on</i></a>';
  }

  var servicedata = response.servicedata;
  if (response.caretypeori == "House Call") {
    var housecall = true;
    var backbuttonname = "House call";
  } else {
    var housecall = false;
    var backbuttonname = "Walk in";
  }
  document.getElementById("backcare").innerHTML =
    '<a href="#!" id="lang_navigation_view_my_order_list" class="pink-text nav-text strong" onclick="openpage(\'universalserviceprovider\')"><i class="material-icons left">arrow_back</i>' +
    backbuttonname +
    "</a>";
  if (response.packages_data != "None") {
    show("carepackages");
    hide("nopackagedescription");
  } else {
    show("nopackagedescription");
    hide("carepackages");
  }
  document.getElementById("apointmenttime").innerHTML = response.timer;
  if (housecall == true) {
    show("housecallview");
    hide("carepackages");
    hide("walkinview");
    document.getElementById("view_care_request_description").innerHTML =
      servicedata.description;
  } else {
    hide("housecallview");
    ("carepackages");
    show("walkinview");
  }

  //If doctor viewing this
  hide("customernewcareaction");
  show("spnewcareaction");
  document.getElementById("care_service_provider_status_sp").innerHTML =
    response.request_status;
  if (response.request_status == "New") {
    hide("carenewmap");
    document.getElementById("sp_care_action_button").innerHTML =
      '<button id="care_new_sp_action" class="btn btn-block pink" onclick="acceptThiscarejob(' +
      response.id +
      ')">Accept</button>';
    hide("carenewmap");
  } else if (response.request_status == "Accepted") {
    if (backbuttonname == "Walk in") {
      hide("carenewmap");
      hide("spdoctarget");
      document.getElementById("sp_care_action_button").innerHTML =
        '<button id="care_new_sp_action" class="btn btn-block pink" onclick="startedThiscarejob(' +
        response.id +
        ')">Customer Arrived</button><p>Please start this job as soon as the customer arrived</p>';
    } else {
      var deli = "geo:?q=" + response.patientaddress;
      document.getElementById("caremapbutton").innerHTML =
        '<a href="' +
        deli +
        '" id="" class="pink-text nav-text strong"><i class="material-icons left">location_on</i></a>';
      var markersz = "img/patientmarker.png";
      const myLatLng = {
        lat: parseFloat(response.lat),
        lng: parseFloat(response.lng),
      };
      const map = new google.maps.Map(document.getElementById("carenewmap"), {
        zoom: 14,
        center: myLatLng,
        disableDefaultUI: true,
      });
      new google.maps.Marker({
        position: myLatLng,
        map,
        title: "Patient Marker",
        icon: markersz,
      });
      document.getElementById("sp_care_action_button").innerHTML =
        '<button id="care_new_sp_action" class="btn btn-block pink" onclick="startedThiscarejob(' +
        response.id +
        ')">Start</button><p>Start this job to indicate that you are on your way to the patient permisses</p>';
      show("carenewmap");
    }
  } else if (response.request_status == "Canceled") {
    document.getElementById("care_new_cancel_button").disabled = true;
    document.getElementById("care_new_contact_button").disabled = true;
    hide("carenewmap");
  } else if (response.request_status == "Started") {
    if (backbuttonname == "Walk in") {
      hide("carenewmap");
      document.getElementById("sp_care_action_button").innerHTML =
        '<button id="care_new_sp_action" class="btn btn-block pink" onclick="completeThisCarejob(' +
        response.id +
        ')">Complete</button><p>Press the complete button upon completion. Payment will be added to your wallet</p>';
    } else {
      var deli = "geo:?q=" + response.patientaddress;
      document.getElementById("caremapbutton").innerHTML =
        '<a href="' +
        deli +
        '" id="" class="pink-text nav-text strong"><i class="material-icons left">location_on</i></a>';
      document.getElementById("care_new_cancel_button").disabled = true;

      var markersz = "img/patientmarker.png";
      const myLatLng = {
        lat: parseFloat(response.lat),
        lng: parseFloat(response.lng),
      };
      const map = new google.maps.Map(document.getElementById("carenewmap"), {
        zoom: 14,
        center: myLatLng,
        disableDefaultUI: true,
      });
      new google.maps.Marker({
        position: myLatLng,
        map,
        title: "Patient Marker",
        icon: markersz,
      });

      document.getElementById("sp_care_action_button").innerHTML =
        '<button id="care_new_sp_action" class="btn btn-block pink" onclick="completeThisCarejob(' +
        response.id +
        ')">Complete</button><p>Press the complete button upon completion. Payment will be added to your wallet</p>';
      show("carenewmap");
    }
  } else if (response.request_status == "Completed") {
    document.getElementById("care_new_cancel_button").disabled = true;
    document.getElementById("care_new_contact_button").disabled = true;
    document.getElementById("care_new_sp_action").disabled = true;
    hide("carenewmap");
  }
}
function renderCustomer(data) {
  var response = data;
}
function customerUpdatecare(id) {
  /* 	currentlyviewingnewcare = id;
	var dataTopost = "api=1&auth_token=" + authUser.login_token + "&customerviewcarerequest="+id;
    var care = new XMLHttpRequest();
    care.open("POST", serverUrl, true);
    care.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    care.onload = function() {
        if (care.status == 200) {
            var json = care.responseText;
            var response = JSON.parse(json);
			careHasAttachment = response.require_attachment;
			if(userViewingCarestatus == "Doctor"){
				//If doctor viewing this
				hide("customernewcareaction");
				show("spnewcareaction");
				document.getElementById("care_service_provider_status_sp").innerHTML = response.request_status;
			
				if(response.request_status == "New"){
					hide("carenewmap");
					document.getElementById("sp_care_action_button").innerHTML = '<button id="care_new_sp_action" class="btn btn-block pink" onclick="acceptThiscarejob('+response.id+')">Accept</button>';
					hide("carenewmap");
				}else if(response.request_status == "Accepted"){
					var deli = 'geo:?q='+response.patientaddress;
					document.getElementById("caremapbutton").innerHTML = '<a href="'+deli+'" id="" class="pink-text nav-text strong"><i class="material-icons left">location_on</i></a>';
					var markersz = 'img/patientmarker.png';
						const myLatLng = { lat: parseFloat(response.lat), lng: parseFloat(response.lng) };
						const map = new google.maps.Map(document.getElementById("carenewmap"), {
						zoom: 14,
						center: myLatLng,
						disableDefaultUI: true,
					});
					new google.maps.Marker({
						position: myLatLng,
						map,
						title: "Patient Marker",
						icon: markersz,
					});
					document.getElementById("sp_care_action_button").innerHTML = '<button id="care_new_sp_action" class="btn btn-block pink" onclick="startedThiscarejob('+response.id+')">Start</button><p>Start this job to indicate that you are on your way to the patient permisses</p>';
					show("carenewmap");
				}else if(response.request_status == "Canceled"){
					document.getElementById("care_new_cancel_button").disabled = true;
					document.getElementById("care_new_contact_button").disabled = true;
					hide("carenewmap");
				}else if(response.request_status == "Started"){
					var deli = 'geo:?q='+response.patientaddress;
					document.getElementById("caremapbutton").innerHTML = '<a href="'+deli+'" id="" class="pink-text nav-text strong"><i class="material-icons left">location_on</i></a>';
					document.getElementById("care_new_cancel_button").disabled = true;
					
					var markersz = 'img/patientmarker.png';
						const myLatLng = { lat: parseFloat(response.lat), lng: parseFloat(response.lng) };
						const map = new google.maps.Map(document.getElementById("carenewmap"), {
						zoom: 14,
						center: myLatLng,
						disableDefaultUI: true,
					});
					new google.maps.Marker({
						position: myLatLng,
						map,
						title: "Patient Marker",
						icon: markersz,
					});
					
					document.getElementById("sp_care_action_button").innerHTML = '<button id="care_new_sp_action" class="btn btn-block pink" onclick="completeThisCarejob('+response.id+')">Complete</button><p>Press the complete button upon completion. Payment will be added to your wallet</p>';
					show("carenewmap");
				}else if(response.request_status == "Completed"){
					document.getElementById("care_new_cancel_button").disabled = true;
					document.getElementById("care_new_contact_button").disabled = true;
					hide("carenewmap");
				}
			}else{
				
				if(response.caretypeori == "House Call"){
					hide("walkinview");
					show("housecallview");
					show("customernewcareaction");
					hide("spnewcareaction");
					hide("customerwalkin");
				}else{
					show("walkinview");
					hide("housecallview");
					show("customerwalkin");
					hide("customernewcareaction");
					hide("spnewcareaction");
				}
				
			
				if(response.request_status == "New"){
					document.getElementById("care_new_cancel_button").disabled = false;
					document.getElementById("care_new_contact_button").disabled = false;
					hide("carenewmap");
				}else if(response.request_status == "Canceled"){
					document.getElementById("care_new_cancel_button").disabled = true;
					document.getElementById("care_new_contact_button").disabled = true;
					hide("carenewmap");
				}else if(response.request_status == "Started"){
					document.getElementById("care_new_cancel_button").disabled = true;
					document.getElementById("care_new_contact_button").disabled = true;
					var markerss = 'img/marker.png';
						const myLatLng = { lat: parseFloat(response.sp.lat), lng: parseFloat(response.sp.lng) };
						const map = new google.maps.Map(document.getElementById("carenewmap"), {
						zoom: 14,
						center: myLatLng,
						disableDefaultUI: true,
					});
					new google.maps.Marker({
						position: myLatLng,
						map,
						title: "Service Provider Location",
						icon: markerss,
					});
					show("carenewmap");
				}else if(response.request_status == "Completed"){
					document.getElementById("care_new_cancel_button").disabled = true;
					document.getElementById("care_new_contact_button").disabled = true;
					hide("carenewmap");
				}
			}
            

			document.getElementById("view_care_request_value").innerHTML = response.patientproblem+'';
			document.getElementById("apointmenttime").innerHTML = response.timer;
			document.getElementById("view_care_request_patient").innerHTML = response.patientname;
			if(response.addresslandmark == ""){
				document.getElementById("carelocationaddresslandmark").innerHTML = "Not set";
			}else{
				document.getElementById("carelocationaddresslandmark").innerHTML = response.addresslandmark;
			}
			document.getElementById("carelocationaddress").innerHTML = response.patientaddress;
			
			document.getElementById("care_service_provider_status").innerHTML = response.request_status;
			if(response.sp == null){
				if(response.request_status == "Canceled"){
					document.getElementById("care_service_provider_name").innerHTML = "None";
				}else{
					document.getElementById("care_service_provider_name").innerHTML = "Searching";
				}
			}else{
				var sp_firstname = response.sp.firstname;
				var sp_lastname = response.sp.lastname;
				var sp_designation = response.sp.designation;
				document.getElementById("care_service_provider_name").innerHTML = sp_designation+sp_firstname+' '+sp_lastname;
			}
			setTimeout(function(){ var isview = document.getElementById("carenewstatus").style.display; if(isview == "block"){customerUpdatecare(id);} }, 30000);
        } else if (care.status == 404) {
            alert("Fail to connect to our server");
        } else {
            alert("Fail to connect to our server");
        }
    }
    care.send(dataTopost); */
}
function initSearchnewCare(element) {
  var searchterm = element.value;
  var dataTopost =
    "api=1&auth_token=" +
    authUser.login_token +
    "&searchcareterm=" +
    searchterm;
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
      document.getElementById("searchcareresultview").innerHTML = "";
      if (response.status == null) {
        var i;
        document.getElementById("docproductresult").innerHTML = "";
        searchedMed = response;

        for (i = 0; i < response.length; i++) {
          var productdetail = JSON.stringify(response[i]);
          document.getElementById("searchcareresultview").innerHTML +=
            "<li class=\"collection-item avatar\" onclick=\"openpage('carerequestdetail', 11, '" +
            response[i].name +
            '\')"><img src="' +
            response[i].icon +
            '" alt="" class="circle"> <span="title">' +
            response[i].name +
            "</span><p>Price: " +
            response[i].price +
            "</p></li>";
        }
      } else {
        document.getElementById("searchcareresultview").innerHTML =
          '<li class="collection-item">Cant find anything with the search term "' +
          searchterm +
          '"</li>';
      }
    } else if (ecare_services.status == 404) {
      alert("Fail to connect to our server");
    } else {
      alert("Fail to connect to our server");
    }
  };
  ecare_services.send(dataTopost);
}
function searchFornewcareservice() {
  show("searchcareresult");
  hide("carenewpage");
}
function hidesearchFornewcareservice() {
  hide("searchcareresult");
  show("carenewpage");
}
function careNewtoPatientdetail() {
  var carenewdate = document.getElementById("carenewdate").value;
  var carenewtime = document.getElementById("carenewtime").value;
  if (carenewdate != "" && carenewtime != "") {
    hide("carenewstepone");
    show("carenewsteptwo");
  } else {
    instaResponse("Please set your appointment date");
  }
}

function selectWalkinCenter(element, address) {
  var selected = element.id;
  for (let i = 0; i < walkingcentercount; i++) {
    var toCheck = "address" + i;
    if (selected == toCheck) {
      if (
        document.getElementById(selected).classList.contains("oposelected") ==
        true
      ) {
        document.getElementById(selected).classList.remove("oposelected");
        document.getElementById(selected).classList.add("opo");
        document.getElementById("carenewaddress").value = "";
      } else {
        document.getElementById("carenewaddress").value = address;
        document.getElementById(selected).classList.add("oposelected");
        document.getElementById(selected).classList.remove("opo");
      }
    } else {
      document.getElementById(selected).classList.remove("oposelected");
      document.getElementById(selected).classList.add("opo");
    }
  }
}

var walkingcentercount = 0;
var carerequesttype;
function selectWalkincare() {
  showLoading();
  document.getElementById("walkincenter").innerHTML = "";
  var dataTopost =
    "api=1&auth_token=" + authUser.login_token + "&viewWalkincenter=true";
  var settings = new XMLHttpRequest();
  settings.open("POST", serverUrl, true);
  settings.setRequestHeader(
    "Content-type",
    "application/x-www-form-urlencoded"
  );
  settings.onload = function () {
    if (settings.status == 200) {
      var json = settings.responseText;
      var response = JSON.parse(json);
      show("careorderconfirmation");
      hide("carenewsteppickthree");
      hide("carenewsteptwo");
      carerequesttype = "Walk In";
      console.log(response);
      var wa = JSON.parse(response);
      walkingcentercount = wa.length;
      for (let i = 0; i < wa.length; i++) {
        document.getElementById("walkincenter").innerHTML +=
          '<div id="address' +
          [i] +
          '" class="opo"  onclick="selectWalkinCenter(this, \'' +
          wa[i].address +
          "')\"><p>" +
          wa[i].name +
          "</p><p>" +
          wa[i].address +
          "</p></div>";
      }
      closeLoading();
    } else if (settings.status == 404) {
      alert("Fail to connect to our server");
    } else {
      alert("Fail to connect to our server");
    }
  };
  settings.send(dataTopost);
}
function selectHousecallcare() {
  show("carenewstepthree");
  hide("carenewsteppickthree");
  carerequesttype = "House Call";
}
function careNewtoAddressdetail() {
  var knownillness = encodeURIComponent(
    document.getElementById("knownillness").value
  );

  if (knownillness != "") {
    if (carehashousecall == true && carehaswalkin == true) {
      show("carenewsteppickthree");
      hide("carenewsteptwo");
    } else if (carehashousecall == true && carehaswalkin == false) {
      hide("carenewsteptwo");
      hide("carenewsteppickthree");
      show("carenewstepthree");
      carerequesttype = "House Call";
    } else if (carehashousecall == false && carehaswalkin == true) {
      selectWalkincare();
      carerequesttype = "Walk In";
    }
  } else {
    instaResponse("Please fill up the form");
  }
}
function openTeleRequest(id) {
  show("openTeleRequest");
  currentlyviewingnewcare = id;
  var dataTopost =
    "api=1&auth_token=" + authUser.login_token + "&teleCareRequest=" + id;
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
      document.getElementById("telerequestproblem").innerHTML =
        response.patientproblem;
      document.getElementById("teledate").innerHTML = response.caredate;
      document.getElementById("teletime").innerHTML = response.caretime;
      loadingResponse(response.message);
    } else if (ecare_services.status == 404) {
      alert("Fail to connect to our server");
    } else {
      alert("Fail to connect to our server");
    }
  };
  ecare_services.send(dataTopost);
}

function initCarewait(id) {
  var dataTopost =
    "api=1&auth_token=" + authUser.login_token + "&viewThiscare=" + id;
  var care = new XMLHttpRequest();
  care.open("POST", serverUrl, true);
  care.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  care.onload = function () {
    if (care.status == 200) {
      var json = care.responseText;
      var response = JSON.parse(json);
      console.log(response);
      if (response.request_status == "Completed") {
        show("teleacompleted");
        hide("teleaccepted");
        hide("teleiswaiting");
        hide("teleacancel");
      } else if (response.request_status == "New") {
        hide("teleacompleted");
        hide("teleaccepted");
        show("teleiswaiting");
        hide("teleacancel");
        setTimeout(function () {
          initCarewait(id);
        }, 3000);
      } else if (response.request_status == "Canceled") {
        hide("teleacompleted");
        hide("teleaccepted");
        hide("teleiswaiting");
        show("teleacancel");
      }
    } else if (care.status == 404) {
      alert("Fail to connect to our server");
    } else {
      alert("Fail to connect to our server");
    }
  };
  care.send(dataTopost);
}

function sendNewcarerequest(custom) {
  showLoading();
  var careid = customercurrentlyviewingcareserviceid;
  console.log(careid);
  if (custom == "Consultation") {
    var caredate = getValue("condate");
    var caretime = cTime;
    var patientname = authUser.firstname + " " + authUser.lastname;
    var patientproblem = getValue("cProblem");
    var patientaddress = "Server Side";
    var addresslandmark = false;
    var requesterid = authUser.id;
    var lat = authUser.lat;
    var lng = authUser.lng;
    var caretype = "Custom Consultation";
    var fullname = authUser.firstname + " " + authUser.lastname;
    var noic = authUser.ic;
    var knownillness = "";
    var careprice = "server side";
    var mincareprice = 20.0;
    var careid;
    if (authUser.wallet >= parseFloat(mincareprice)) {
      if (patientproblem != "" && caredate != "" && caretime != "") {
        var dataTopost =
          "api=1&auth_token=" +
          authUser.login_token +
          "&inserttocare=true&caredate=" +
          caredate +
          "&caretime=" +
          caretime +
          "&patientname=" +
          patientname +
          "&patientproblem=" +
          patientproblem +
          "&patientaddress=" +
          patientaddress +
          "&requesterid=" +
          requesterid +
          "&lat=" +
          lat +
          "&lng=" +
          lng +
          "&caretype=" +
          caretype +
          "&fullname=" +
          fullname +
          "&noic=" +
          noic +
          "&knownillness=" +
          knownillness +
          "&addresslandmark=" +
          addresslandmark +
          "&careprice=" +
          careprice +
          "&careid=" +
          careid;
        var care = new XMLHttpRequest();
        care.open("POST", serverUrl, true);
        care.setRequestHeader(
          "Content-type",
          "application/x-www-form-urlencoded"
        );
        care.onload = function () {
          if (care.status == 200) {
            var json = care.responseText;
            var response = JSON.parse(json);
            document.getElementById("cProblem").value = "";
            document.getElementById("condate").value = "";
            cTime = "";
            openpage("cusoultationtelewait", response.last_id, "customer");
          } else if (care.status == 404) {
            alert("Fail to connect to our server");
          } else {
            alert("Fail to connect to our server");
          }
        };
        // console.log(dataTopost)
        care.send(dataTopost);
      } else {
        loadingResponse("Please complete the form");
      }
    } else {
      loadingResponse("Please top up your wallet");
    }
  } else if (custom == "original") {
    var caredate = getValue("carenewdate");
    var caredate = getValue("carenewdate");
    var caretime = getValue("carenewtime");
    var patientname = getValue("carenewfullname");
    var patientproblem = careservicenameReqeust;
    var patientaddress = getValue("carenewaddress");
    var addresslandmark = getValue("carenewlandmark");
    var requesterid = authUser.id;
    var lat = carenewLat;
    var lng = carenewLng;
    var caretype = getValue("caretype");
    var fullname = getValue("carenewfullname");
    var noic = getValue("carenewic");
    var knownillness = getValue("knownillness");
    var careprice = document.getElementById("careprice").innerHTML;
    if (patientaddress != "") {
      if (authUser.wallet >= parseFloat(careprice)) {
        if (careHaspackage == false) {
          var jstring = "None";
        } else {
          var jstring = JSON.stringify(careHaspackage);
        }
        var dataTopost =
          "api=1&auth_token=" +
          authUser.login_token +
          "&inserttocare=true&caredate=" +
          caredate +
          "&caretime=" +
          caretime +
          "&patientname=" +
          patientname +
          "&patientproblem=" +
          patientproblem +
          "&patientaddress=" +
          patientaddress +
          "&requesterid=" +
          requesterid +
          "&lat=" +
          lat +
          "&lng=" +
          lng +
          "&caretype=" +
          caretype +
          "&fullname=" +
          fullname +
          "&noic=" +
          noic +
          "&knownillness=" +
          knownillness +
          "&addresslandmark=" +
          addresslandmark +
          "&careprice=" +
          careprice +
          "&caretypeori=" +
          carerequesttype +
          "&require_attachment=" +
          careHasAttachment +
          "&packagedata=" +
          jstring +
          "&careid=" +
          careid;

        var care = new XMLHttpRequest();
        care.open("POST", serverUrl, true);
        care.setRequestHeader(
          "Content-type",
          "application/x-www-form-urlencoded"
        );
        care.onload = function () {
          if (care.status == 200) {
            var json = care.responseText;
            var response = JSON.parse(json);
            openpage("carenewstatus", response.last_id, "customer");
          } else if (care.status == 404) {
            alert("Fail to connect to our server");
          } else {
            alert("Fail to connect to our server");
          }
        };
        care.send(dataTopost);
      } else {
        loadingResponse("Please top up your wallet");
      }
    } else {
      loadingResponse("Please complete the form");
    }
  }
}
function openCarecategory() {
  show("categorywindow");
  activePage = "categorywindow";
}
function setEcarefilter() {
  show("categorywindow");
}
var backcarecategory = "";
function backfromviewcareservice() {
  openpage("carenewpage", backcarecategory);
}
function initCarenew(category) {
  activePage = "carenewpage";
  console.log(category);
  backcarecategory = category;
  document.getElementById("selectCategorycare").innerHTML =
    '<a href="#!" class="pink-text strong" onclick="openpage(\'carenewpage\' \'' +
    category +
    "')\">" +
    category +
    '</a> <span onclick="" class="right"><i class="material-icons pink-text strong" onclick="openpage(\'categorywindow\')">filter_list</i></span>';
  var dataTopost =
    "api=1&auth_token=" +
    authUser.login_token +
    "&viewallecare_services=" +
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
      initecareSub(category);
      var i;
      document.getElementById("viewallecare_services").innerHTML = "";
      for (i = 0; i < response.length; i++) {
        document.getElementById("viewallecare_services").innerHTML +=
          '<div class="col s6 l2"><div class="card" style="border-radius: 10px"> <div class="card-image "><img class="lazy" id="res0" src="' +
          response[i].icon +
          '" alt="Menu Img" style="border-top-left-radius: 10px; border-top-right-radius: 10px;" onclick="openpage(\'carerequestdetail\', ' +
          response[i].id +
          ", '" +
          response[i].name +
          '\')"" loading="lazy"></div> <div class="card-content" style="padding: 10px"> <p><span class="strong">' +
          response[i].name +
          '</span></p> <p class="small"></p> <span class="right"></span> <p></p> </div> </div></div>';
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

var carehaswalkin = false;
var carehashousecall = false;
var careHaspackage = false;
var careHasAttachment = false;
var customercurrentlyviewingcareserviceid = 0;
function initcareRequestdetail(id) {
  customercurrentlyviewingcareserviceid = id;
  hide("carenewsteppickthree");
  addPreloader("caredetailedview");
  var dataTopost =
    "api=1&auth_token=" + authUser.login_token + "&viewspeccare=" + id;
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

      if (response.requireattachment == "true") {
        careHasAttachment = true;
      } else {
        careHasAttachment = false;
      }
      if (response.packages == "0") {
        careHaspackage = false;
      } else {
        var packageCount = parseInt(response.packages);
        var packageData = [];
        for (let i = 0; i < packageCount; i++) {
          var newdata = JSON.parse(
            '{"appointment_date":"Not Set", "status":"New", "completion_date":"Not Set", "clincal_note":"Not Set"}'
          );
          packageData.push(newdata);
        }
        console.log(packageData);
        careHaspackage = packageData;
      }
      console.log(response);
      backcarecategory = response["category"];
      document.getElementById("caredetailedview").innerHTML =
        '<center><br/><img src="' +
        response.icon +
        '" class="circle" width="50%"><h3 class="strong pink-text flow-text">' +
        response.name +
        '</h3><p class="small grey-text">' +
        response.description +
        "</p></center>";
      show("carenewstepone");
      hide("carenewsteptwo");
      hide("carenewstepthree");
      hide("careorderconfirmation");
      document.getElementById("carenewfullname").value =
        authUser.firstname + " " + authUser.lastname;
      document.getElementById("carenewic").value = authUser.ic_number;
      document.getElementById("carenewheight").value = authUser.height;
      document.getElementById("carenewweight").value = authUser.weight;
      document.getElementById("careprice").innerHTML = response.price;
      document.getElementById("carepriceopenview").innerHTML =
        "RM" + response.price;

      if (response.walkinprice != "0.00") {
        carehaswalkin = true;
      } else {
        carehaswalkin = false;
      }
      if (response.price != "0.00") {
        carehashousecall = true;
      } else {
        carehashousecall = false;
      }

      hide("careNewpatientinfo");
    } else if (ecare_services.status == 404) {
      alert("Fail to connect to our server");
    } else {
      alert("Fail to connect to our server");
    }
  };
  ecare_services.send(dataTopost);
}

function setnewCareaddress(fors) {
  show("searchwindowcarePickup");
  document.getElementById("pickupcarenewsearch").focus();
}

function setCareAddress(address) {
  document.getElementById("carenewaddress").value = address;
  codeAddressmultiedit(address);
  hide("searchwindowcarePickup");
}

function codeAddressmultiedit(value) {
  var address = value;
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
      carenewLat = cleanedLat;
      carenewLng = cleanedLng;
    } else {
      instaResponse("Please check your internet connection and try again");
    }
  });
}
function initServiceCareAddress(elements) {
  var searchQuery = elements.value;
  document.getElementById("carepickupresults").innerHTML = "";
  var displaySuggestions = function (predictions, status) {
    if (status != google.maps.places.PlacesServiceStatus.OK) {
      document.getElementById("carepickupresults").innerHTML =
        '<li class="collection-item">Can\'t find that address</li>';
      return;
    }
    predictions.forEach(function (prediction) {
      var lol =
        '<li class="collection-item" onclick="setCareAddress(\'' +
        prediction.description +
        "')\">" +
        prediction.description +
        "</li>";
      document.getElementById("carepickupresults").innerHTML += lol;
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

function changeCarepatient(element) {
  if (element.value == "Others") {
    document.getElementById("carenewfullname").readOnly = false;
    document.getElementById("carenewic").readOnly = false;
    document.getElementById("carenewheight").readOnly = false;
    document.getElementById("carenewweight").readOnly = false;
    document.getElementById("carenewfullname").value = "";
    document.getElementById("carenewic").value = "";
    document.getElementById("carenewheight").value = "";
    document.getElementById("carenewweight").value = "";
    show("careNewpatientinfo");
  } else {
    hide("careNewpatientinfo");
    document.getElementById("carenewfullname").readOnly = true;
    document.getElementById("carenewic").readOnly = true;
    document.getElementById("carenewheight").readOnly = true;
    document.getElementById("carenewweight").readOnly = true;
    document.getElementById("carenewfullname").value =
      authUser.firstname + " " + authUser.lastname;
    document.getElementById("carenewic").value = authUser.ic_number;
    document.getElementById("carenewheight").value = authUser.height;
    document.getElementById("carenewweight").value = authUser.weight;
  }
}
function insertTocareRequest(id) {
  var dataTopost =
    "api=1&auth_token=" +
    authUser.login_token +
    "&viewThisecare_services=" +
    id;
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
      console.log(
        "<p>'+response.category+'</p><p>'+response.name+'</p><p>'+response.description+'</p><p>'+response.forusertype+'</p><p>'+response.icon+'</p><p>'+response.price+'</p>"
      );
      loadingResponse(response.message);
    } else if (ecare_services.status == 404) {
      alert("Fail to connect to our server");
    } else {
      alert("Fail to connect to our server");
    }
  };
  ecare_services.send(dataTopost);
}
