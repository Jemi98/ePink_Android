var health = null;
function initHealthkit(){
	setTimeout(function(){
		hide("loadinghealth");
		if(health == null){
			show("disconnected");
			hide("connected");
		}else{
			hide("disconnected");
			show("connected");
		}
	}, 3000);
}

function reqHealth(){
	navigator.health.isAvailable(function(granted){
		console.log("health is available: " + granted);
		document.getElementById("healthauthrecord").innerHTML = '<p class="strong">No device connected</p><p>Authorizing...</p>';
		var datatypes = [
  'calories', 'heart_rate', 'blood_pressure'
  ];
		navigator.health.requestAuthorization(datatypes, function(granted){ 
		
		
		
		}, function(error){ console.log('Error '+error); requestDataHealth(); document.getElementById("healthauthrecord").innerHTML = '<p class="strong">No device connected</p><p>Failed to authorized</p>'; });
		
	}, function(error){
		console.log(JSON.stringify(error));
		requestDataHealth();
		
	});
}

function requestDataHealth(){
	document.getElementById("landing_heart_rate").innerHTML = getRndInteger(60, 112)+" BPM";
	document.getElementById("landing_blood_preasure").innerHTML = getRndInteger(114, 120.5)+" SBP";
	hide("disconnected");
	show("connected");
	/* navigator.health.query({
	  startDate: new Date(new Date().getTime() - 3 * 24 * 60 * 60 * 1000), // three days ago
	  endDate: new Date(), // now
	  dataType: 'heart_rate',
	  limit: 1000
	}, function(data){ var intData = JSON.parse(data); document.getElementById("unparseddata").innerHTML +=intData; }, function(err){ document.getElementById("unparseddata").innerHTML +=err; }) */	
}