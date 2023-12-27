    // Defaults to sessionStorage for storing the Facebook token
    //openFB.init({appId: '170522167615507'});

    //  Uncomment the line below to store the Facebook token in localStorage instead of sessionStorage
    openFB.init({appId: '170522167615507', tokenStore: window.localStorage});
	var accessToken;
    function fblogin() {
        openFB.login(
                function(response) {
                    if(response.status === 'connected') {
						accessToken = response.authResponse.accessToken;
						getInfo();
                    } else {
                        alert('Facebook login failed: ' + response.error);
                    }
                }, {scope: 'email'});
    }
	var fbloginpostdata;
    function getInfo() {
       openFB.api({
            path: '/v2.8/me',
			params: { "access_token": accessToken, "fields":"id,name,email,first_name,last_name" },
            success: function(data) {
				//showLoading();
				var userfbdata = JSON.stringify(data);
				var profilepicture = 'http://graph.facebook.com/' + data.id + '/picture?type=small';
				var fbfullname = data.name;
				var fbuseremail = data.email;
				var fbfirstname = data.first_name;
				var fblastname = data.last_name;

				logindata = "?fblogin=true&email=" + fbuseremail + "&firstname=" + fbfirstname + "&lastname=" + fblastname + "&profilepicture=" + profilepicture;
				loginViaGetFb(logindata);              
            },
            error: errorHandler});
    }
	function loginViaGetFb(logindata) {
		showLoading();
		var requestUrl = serverUrl + logindata;
		var xhr = new XMLHttpRequest();
		xhr.open("GET", requestUrl, false);
		xhr.onload = function() {
			if (xhr.status == 200) {
				var dataJson = xhr.responseText;
				var response = JSON.parse(dataJson);
				localStorage.setItem(app.name+"_login_token", response.login_token);
				initApp();
			} else if (xhr.status == 404) {
				alert("Web Service Doesn't Exist", "Error");
			} else {
				alert("Unknown error occured while connecting to server", "Error");
			}
		}
		xhr.send();
	}
    function share() {
        openFB.api({
            method: 'POST',
            path: '/me/feed',
            params: {
                message: document.getElementById('Message').value || 'Testing Facebook APIs'
            },
            success: function() {
                alert('the item was posted on Facebook');
            },
            error: errorHandler});
    }

    function readPermissions() {
        openFB.api({
            method: 'GET',
            path: '/me/permissions',
            success: function(result) {
                alert(JSON.stringify(result.data));
            },
            error: errorHandler
        });
    }

    function revoke() {
        openFB.revokePermissions(
                function() {
                    alert('Permissions revoked');
                },
                errorHandler);
    }

    function logout() {
        openFB.logout(
                function() {
                    alert('Logout successful');
                },
                errorHandler);
    }

    function errorHandler(error) {
        alert(error.message);
    }
