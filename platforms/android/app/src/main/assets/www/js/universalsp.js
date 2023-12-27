function universalServiceprovider() {
  hide("serviceproviderselection");
  var dataTopost =
    "api=1&auth_token=" + authUser.login_token + "&universalviewallcare=true";
  var care = new XMLHttpRequest();
  care.open("POST", serverUrl, true);
  care.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  care.onload = function () {
    if (care.status == 200) {
      var json = care.responseText;
      var response = JSON.parse(json);
      var i;
      var available = response.available;
      var inprogress = response.inprogress;
      document.getElementById("listofcarequestuniversal").innerHTML = "";
      if (available != "Empty") {
        document.getElementById("listofcarequestuniversal").innerHTML = "";
        for (i = 0; i < available.length; i++) {
          if (available[i].caretype == "Custom Consultation") {
            document.getElementById("listofcarequestuniversal").innerHTML +=
              '<div class="card pink lighten-1 white-text" onclick="openTeleRequest(' +
              available[i].id +
              ')"><div class="card-header white-text pink"><span class="strong"> <i class="material-icons left">camera_front</i> Tele Consultation</span> <span class="right">' +
              cleanOutput(available[i].timer) +
              ' </span></div><div class="card-content"><p style="margin-bottom: 15px"><i class="material-icons v-icon">person</i> Private & Confidential</p><p><i class="material-icons v-icon">location_on</i> Tele consultation services</p></div><div class="card-action">(' +
              parseInt(available[i].hours) +
              ' Hour) <span class="right strong">RM ' +
              Math.round(available[i].price) +
              "</span></div></div>";
          } else {
            document.getElementById("listofcarequestuniversal").innerHTML +=
              '<div class="card pink lighten-1 white-text" onclick="openpage(\'careviewbydoc\', ' +
              available[i].id +
              ')"><div class="card-header white-text pink"><span class="strong">' +
              available[i].patientproblem +
              '</span> <span class="right">' +
              cleanOutput(available[i].timer) +
              ' </span></div><div class="card-content"><p style="margin-bottom: 15px"><i class="material-icons v-icon">person</i> ' +
              cleanOutput(available[i].fullname) +
              '</p><p><i class="material-icons v-icon">location_on</i> ' +
              cleanOutput(available[i].patientaddress) +
              '</p></div><div class="card-action">(' +
              parseInt(available[i].hours) +
              ' Hour) <span class="right strong">RM ' +
              Math.round(available[i].price) +
              "</span></div></div>";
          }
        }
      } else {
        document.getElementById("listofcarequestuniversal").innerHTML =
          '<center><br/><br/><i class="large material-icons pink-text">assignment_late</i><p class="pink-text strong">No care request</p><p class="grey-text">Currently there is no care requested</p></center>';
      }
      if (inprogress != "Empty") {
        document.getElementById("listofcarequestuniversalaccepted").innerHTML =
          "";
        for (i = 0; i < inprogress.length; i++) {
          document.getElementById(
            "listofcarequestuniversalaccepted"
          ).innerHTML +=
            '<div class="card green lighten-1 white-text" onclick="openpage(\'careviewbydoc\', ' +
            inprogress[i].id +
            ')"><div class="card-header green"><span class="strong white-text">' +
            inprogress[i].patientproblem +
            '</span> <span class="right">' +
            cleanOutput(inprogress[i].timer) +
            '</span></div><div class="card-content"><p style="margin-bottom: 15px"><i class="material-icons v-icon">person</i> ' +
            cleanOutput(inprogress[i].fullname) +
            '</p><p><i class="material-icons v-icon">location_on</i> ' +
            cleanOutput(inprogress[i].patientaddress) +
            '</p></div><div class="card-action">(' +
            parseInt(inprogress[i].hours) +
            ' Hour) <span class="right strong">RM ' +
            Math.round(inprogress[i].price) +
            "</span></div></div>";
        }
      } else {
        document.getElementById("listofcarequestuniversalaccepted").innerHTML =
          '<center><br/><br/><i class="large material-icons pink-text">assignment_late</i><p  class="pink-text strong">No in-progress task</p><p class="grey-text">You have no in progress task</p></center>';
      }
      setTimeout(function () {
        updateuniversalServiceprovider();
      }, refreshRate);
    } else if (care.status == 404) {
      alert("Fail to connect to our server");
    } else {
      alert("Fail to connect to our server");
    }
  };
  care.send(dataTopost);
}
function updateuniversalServiceprovider() {
  var isDisplaying = document.getElementById("universalserviceprovider").style
    .display;
  if (isDisplaying == "block") {
    hide("serviceproviderselection");
    var dataTopost =
      "api=1&auth_token=" + authUser.login_token + "&universalviewallcare=true";
    var care = new XMLHttpRequest();
    care.open("POST", serverUrl, true);
    care.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    care.onload = function () {
      if (care.status == 200) {
        var json = care.responseText;
        var response = JSON.parse(json);
        var i;
        var available = response.available;
        var inprogress = response.inprogress;
        document.getElementById("listofcarequestuniversal").innerHTML = "";
        if (available != "Empty") {
          document.getElementById("listofcarequestuniversal").innerHTML = "";
          for (i = 0; i < available.length; i++) {
            if (available[i].caretype == "Custom Consultation") {
              document.getElementById("listofcarequestuniversal").innerHTML +=
                '<div class="card pink lighten-1 white-text" onclick="openTeleRequest(' +
                available[i].id +
                ')"><div class="card-header white-text pink"><span class="strong"> <i class="material-icons left">camera_front</i> Tele Consultation</span> <span class="right">' +
                cleanOutput(available[i].timer) +
                ' </span></div><div class="card-content"><p style="margin-bottom: 15px"><i class="material-icons v-icon">person</i> Private & Confidential</p><p><i class="material-icons v-icon">location_on</i> Tele consultation services</p></div><div class="card-action">(' +
                parseInt(available[i].hours) +
                ' Hour) <span class="right strong">RM ' +
                Math.round(available[i].price) +
                "</span></div></div>";
            } else {
              document.getElementById("listofcarequestuniversal").innerHTML +=
                '<div class="card pink lighten-1 white-text" onclick="openpage(\'careviewbydoc\', ' +
                available[i].id +
                ')"><div class="card-header white-text pink"><span class="strong">' +
                available[i].patientproblem +
                '</span> <span class="right">' +
                cleanOutput(available[i].timer) +
                ' </span></div><div class="card-content"><p style="margin-bottom: 15px"><i class="material-icons v-icon">person</i> ' +
                cleanOutput(available[i].fullname) +
                '</p><p><i class="material-icons v-icon">location_on</i> ' +
                cleanOutput(available[i].patientaddress) +
                '</p></div><div class="card-action">(' +
                parseInt(available[i].hours) +
                ' Hour) <span class="right strong">RM ' +
                Math.round(available[i].price) +
                "</span></div></div>";
            }
          }
        } else {
          document.getElementById("listofcarequestuniversal").innerHTML =
            '<center><br/><br/><i class="large material-icons pink-text">assignment_late</i><p class="pink-text strong">No care request</p><p class="grey-text">Currently there is no care requested</p></center>';
        }
        if (inprogress != "Empty") {
          document.getElementById(
            "listofcarequestuniversalaccepted"
          ).innerHTML = "";
          for (i = 0; i < inprogress.length; i++) {
            document.getElementById(
              "listofcarequestuniversalaccepted"
            ).innerHTML +=
              '<div class="card green lighten-1 white-text" onclick="openpage(\'careviewbydoc\', ' +
              inprogress[i].id +
              ')"><div class="card-header green"><span class="strong white-text">' +
              inprogress[i].patientproblem +
              '</span> <span class="right">' +
              cleanOutput(inprogress[i].timer) +
              '</span></div><div class="card-content"><p style="margin-bottom: 15px"><i class="material-icons v-icon">person</i> ' +
              cleanOutput(inprogress[i].fullname) +
              '</p><p><i class="material-icons v-icon">location_on</i> ' +
              cleanOutput(inprogress[i].patientaddress) +
              '</p></div><div class="card-action">(' +
              parseInt(inprogress[i].hours) +
              ' Hour) <span class="right strong">RM ' +
              Math.round(inprogress[i].price) +
              "</span></div></div>";
          }
        } else {
          document.getElementById(
            "listofcarequestuniversalaccepted"
          ).innerHTML =
            '<center><br/><br/><i class="large material-icons pink-text">assignment_late</i><p  class="pink-text strong">No in-progress task</p><p class="grey-text">You have no in progress task</p></center>';
        }
        setTimeout(function () {
          updateuniversalServiceprovider();
        }, refreshRate);
      } else if (care.status == 404) {
        alert("Fail to connect to our server");
      } else {
        alert("Fail to connect to our server");
      }
    };
    care.send(dataTopost);
  }
}
