var docwillcallid = 0;
var doccurrentchatid = 0;
var prescribedMed = [];
var docDiognosage;
var spToreview = 0;
var jobTypetoreview = "Not Set";
var jobIdtoreview = 0;
var reviewStar = 0;
function setPreferedtimeNew(selectedtime){
	if(selectedtime == '9AM -10 AM'){
		cTime = '09:00:00';
		document.getElementById("9to10AmNew").classList.remove("white");
		document.getElementById("9to10AmNew").classList.remove("pink-text");
		document.getElementById("9to10AmNew").classList.add("pink");
		document.getElementById("9to10AmNew").classList.add("white-text");
		document.getElementById("10to11AmNew").classList.add("white");
		document.getElementById("10to11AmNew").classList.add("pink-text");
		document.getElementById("10to11AmNew").classList.remove("pink");
		document.getElementById("10to11AmNew").classList.remove("white-text");
		document.getElementById("11to12pmNew").classList.add("white");
		document.getElementById("11to12pmNew").classList.add("pink-text");
		document.getElementById("11to12pmNew").classList.remove("pink");
		document.getElementById("11to12pmNew").classList.remove("white-text");
		document.getElementById("12to01pmNew").classList.add("white");
		document.getElementById("12to01pmNew").classList.add("pink-text");
		document.getElementById("12to01pmNew").classList.remove("pink");
		document.getElementById("12to01pmNew").classList.remove("white-text");
		document.getElementById("01pmto02pmNew").classList.add("white");
		document.getElementById("01pmto02pmNew").classList.add("pink-text");
		document.getElementById("01pmto02pmNew").classList.remove("pink");
		document.getElementById("01pmto02pmNew").classList.remove("white-text");		
		document.getElementById("02pmto03pmNew").classList.add("white");
		document.getElementById("02pmto03pmNew").classList.add("pink-text");
		document.getElementById("02pmto03pmNew").classList.remove("pink");
		document.getElementById("02pmto03pmNew").classList.remove("white-text");
		document.getElementById("03pmto04pmNew").classList.add("white");
		document.getElementById("03pmto04pmNew").classList.add("pink-text");
		document.getElementById("03pmto04pmNew").classList.remove("pink");
		document.getElementById("03pmto04pmNew").classList.remove("white-text");
		document.getElementById("04pmto05pmNew").classList.add("white");
		document.getElementById("04pmto05pmNew").classList.add("pink-text");
		document.getElementById("04pmto05pmNew").classList.remove("pink");
		document.getElementById("04pmto05pmNew").classList.remove("white-text");
		document.getElementById("05pmto06pmNew").classList.add("white");
		document.getElementById("05pmto06pmNew").classList.add("pink-text");
		document.getElementById("05pmto06pmNew").classList.remove("pink");
		document.getElementById("05pmto06pmNew").classList.remove("white-text");
	}else if(selectedtime == '10AM - 11AM'){
		cTime = '11:00:00';
		document.getElementById("9to10AmNew").classList.add("white");
		document.getElementById("9to10AmNew").classList.add("pink-text");
		document.getElementById("9to10AmNew").classList.remove("pink");
		document.getElementById("9to10AmNew").classList.remove("white-text");
		
		document.getElementById("10to11AmNew").classList.remove("white");
		document.getElementById("10to11AmNew").classList.remove("pink-text");
		document.getElementById("10to11AmNew").classList.add("pink");
		document.getElementById("10to11AmNew").classList.add("white-text");
		
		document.getElementById("11to12pmNew").classList.add("white");
		document.getElementById("11to12pmNew").classList.add("pink-text");
		document.getElementById("11to12pmNew").classList.remove("pink");
		document.getElementById("11to12pmNew").classList.remove("white-text");
		
		document.getElementById("12to01pmNew").classList.add("white");
		document.getElementById("12to01pmNew").classList.add("pink-text");
		document.getElementById("12to01pmNew").classList.remove("pink");
		document.getElementById("12to01pmNew").classList.remove("white-text");
		
		document.getElementById("01pmto02pmNew").classList.add("white");
		document.getElementById("01pmto02pmNew").classList.add("pink-text");
		document.getElementById("01pmto02pmNew").classList.remove("pink");
		document.getElementById("01pmto02pmNew").classList.remove("white-text");		
		
		document.getElementById("02pmto03pmNew").classList.add("white");
		document.getElementById("02pmto03pmNew").classList.add("pink-text");
		document.getElementById("02pmto03pmNew").classList.remove("pink");
		document.getElementById("02pmto03pmNew").classList.remove("white-text");
		
		document.getElementById("03pmto04pmNew").classList.add("white");
		document.getElementById("03pmto04pmNew").classList.add("pink-text");
		document.getElementById("03pmto04pmNew").classList.remove("pink");
		document.getElementById("03pmto04pmNew").classList.remove("white-text");
		
		document.getElementById("04pmto05pmNew").classList.add("white");
		document.getElementById("04pmto05pmNew").classList.add("pink-text");
		document.getElementById("04pmto05pmNew").classList.remove("pink");
		document.getElementById("04pmto05pmNew").classList.remove("white-text");
		
		document.getElementById("05pmto06pmNew").classList.add("white");
		document.getElementById("05pmto06pmNew").classList.add("pink-text");
		document.getElementById("05pmto06pmNew").classList.remove("pink");
		document.getElementById("05pmto06pmNew").classList.remove("white-text");
	}else if(selectedtime == '11AM - 12PM'){
		cTime = '11:00:00';
		document.getElementById("9to10AmNew").classList.add("white");
		document.getElementById("9to10AmNew").classList.add("pink-text");
		document.getElementById("9to10AmNew").classList.remove("pink");
		document.getElementById("9to10AmNew").classList.remove("white-text");
		
		document.getElementById("10to11AmNew").classList.add("white");
		document.getElementById("10to11AmNew").classList.add("pink-text");
		document.getElementById("10to11AmNew").classList.remove("pink");
		document.getElementById("10to11AmNew").classList.remove("white-text");
		
		document.getElementById("11to12pmNew").classList.remove("white");
		document.getElementById("11to12pmNew").classList.remove("pink-text");
		document.getElementById("11to12pmNew").classList.add("pink");
		document.getElementById("11to12pmNew").classList.add("white-text");
		
		document.getElementById("12to01pmNew").classList.remove("white");
		document.getElementById("12to01pmNew").classList.add("pink-text");
		document.getElementById("12to01pmNew").classList.remove("pink");
		document.getElementById("12to01pmNew").classList.remove("white-text");
		
		document.getElementById("01pmto02pmNew").classList.add("white");
		document.getElementById("01pmto02pmNew").classList.add("pink-text");
		document.getElementById("01pmto02pmNew").classList.remove("pink");
		document.getElementById("01pmto02pmNew").classList.remove("white-text");		
		
		document.getElementById("02pmto03pmNew").classList.add("white");
		document.getElementById("02pmto03pmNew").classList.add("pink-text");
		document.getElementById("02pmto03pmNew").classList.remove("pink");
		document.getElementById("02pmto03pmNew").classList.remove("white-text");
		
		document.getElementById("03pmto04pmNew").classList.add("white");
		document.getElementById("03pmto04pmNew").classList.add("pink-text");
		document.getElementById("03pmto04pmNew").classList.remove("pink");
		document.getElementById("03pmto04pmNew").classList.remove("white-text");
		
		document.getElementById("04pmto05pmNew").classList.add("white");
		document.getElementById("04pmto05pmNew").classList.add("pink-text");
		document.getElementById("04pmto05pmNew").classList.remove("pink");
		document.getElementById("04pmto05pmNew").classList.remove("white-text");
		
		document.getElementById("05pmto06pmNew").classList.add("white");
		document.getElementById("05pmto06pmNew").classList.add("pink-text");
		document.getElementById("05pmto06pmNew").classList.remove("pink");
		document.getElementById("05pmto06pmNew").classList.remove("white-text");
	}else if(selectedtime == '12PM - 01PM'){
		cTime = '12:00:00';
		document.getElementById("9to10AmNew").classList.add("white");
		document.getElementById("9to10AmNew").classList.add("pink-text");
		document.getElementById("9to10AmNew").classList.remove("pink");
		document.getElementById("9to10AmNew").classList.remove("white-text");
		
		document.getElementById("10to11AmNew").classList.add("white");
		document.getElementById("10to11AmNew").classList.add("pink-text");
		document.getElementById("10to11AmNew").classList.remove("pink");
		document.getElementById("10to11AmNew").classList.remove("white-text");
		
		document.getElementById("11to12pmNew").classList.add("white");
		document.getElementById("11to12pmNew").classList.add("pink-text");
		document.getElementById("11to12pmNew").classList.remove("pink");
		document.getElementById("11to12pmNew").classList.remove("white-text");
		
		document.getElementById("12to01pmNew").classList.remove("white");
		document.getElementById("12to01pmNew").classList.remove("pink-text");
		document.getElementById("12to01pmNew").classList.add("pink");
		document.getElementById("12to01pmNew").classList.add("white-text");
		
		document.getElementById("01pmto02pmNew").classList.add("white");
		document.getElementById("01pmto02pmNew").classList.add("pink-text");
		document.getElementById("01pmto02pmNew").classList.remove("pink");
		document.getElementById("01pmto02pmNew").classList.remove("white-text");		
		
		document.getElementById("02pmto03pmNew").classList.add("white");
		document.getElementById("02pmto03pmNew").classList.add("pink-text");
		document.getElementById("02pmto03pmNew").classList.remove("pink");
		document.getElementById("02pmto03pmNew").classList.remove("white-text");
		
		document.getElementById("03pmto04pmNew").classList.add("white");
		document.getElementById("03pmto04pmNew").classList.add("pink-text");
		document.getElementById("03pmto04pmNew").classList.remove("pink");
		document.getElementById("03pmto04pmNew").classList.remove("white-text");
		
		document.getElementById("04pmto05pmNew").classList.add("white");
		document.getElementById("04pmto05pmNew").classList.add("pink-text");
		document.getElementById("04pmto05pmNew").classList.remove("pink");
		document.getElementById("04pmto05pmNew").classList.remove("white-text");
		
		document.getElementById("05pmto06pmNew").classList.add("white");
		document.getElementById("05pmto06pmNew").classList.add("pink-text");
		document.getElementById("05pmto06pmNew").classList.remove("pink");
		document.getElementById("05pmto06pmNew").classList.remove("white-text");
	}else if(selectedtime == '01PM - 02PM'){
		cTime = '13:00:00';
		document.getElementById("9to10AmNew").classList.add("white");
		document.getElementById("9to10AmNew").classList.add("pink-text");
		document.getElementById("9to10AmNew").classList.remove("pink");
		document.getElementById("9to10AmNew").classList.remove("white-text");
		
		document.getElementById("10to11AmNew").classList.add("white");
		document.getElementById("10to11AmNew").classList.add("pink-text");
		document.getElementById("10to11AmNew").classList.remove("pink");
		document.getElementById("10to11AmNew").classList.remove("white-text");
		
		document.getElementById("11to12pmNew").classList.add("white");
		document.getElementById("11to12pmNew").classList.add("pink-text");
		document.getElementById("11to12pmNew").classList.remove("pink");
		document.getElementById("11to12pmNew").classList.remove("white-text");
		
		document.getElementById("12to01pmNew").classList.add("white");
		document.getElementById("12to01pmNew").classList.add("pink-text");
		document.getElementById("12to01pmNew").classList.remove("pink");
		document.getElementById("12to01pmNew").classList.remove("white-text");
		
		document.getElementById("01pmto02pmNew").classList.remove("white");
		document.getElementById("01pmto02pmNew").classList.remove("pink-text");
		document.getElementById("01pmto02pmNew").classList.add("pink");
		document.getElementById("01pmto02pmNew").classList.add("white-text");		
		
		document.getElementById("02pmto03pmNew").classList.add("white");
		document.getElementById("02pmto03pmNew").classList.add("pink-text");
		document.getElementById("02pmto03pmNew").classList.remove("pink");
		document.getElementById("02pmto03pmNew").classList.remove("white-text");
		
		document.getElementById("03pmto04pmNew").classList.add("white");
		document.getElementById("03pmto04pmNew").classList.add("pink-text");
		document.getElementById("03pmto04pmNew").classList.remove("pink");
		document.getElementById("03pmto04pmNew").classList.remove("white-text");
		
		document.getElementById("04pmto05pmNew").classList.add("white");
		document.getElementById("04pmto05pmNew").classList.add("pink-text");
		document.getElementById("04pmto05pmNew").classList.remove("pink");
		document.getElementById("04pmto05pmNew").classList.remove("white-text");
		
		document.getElementById("05pmto06pmNew").classList.add("white");
		document.getElementById("05pmto06pmNew").classList.add("pink-text");
		document.getElementById("05pmto06pmNew").classList.remove("pink");
		document.getElementById("05pmto06pmNew").classList.remove("white-text");
	}else if(selectedtime == '02PM - 03PM'){
		cTime = '14:00:00';
		document.getElementById("9to10AmNew").classList.add("white");
		document.getElementById("9to10AmNew").classList.add("pink-text");
		document.getElementById("9to10AmNew").classList.remove("pink");
		document.getElementById("9to10AmNew").classList.remove("white-text");
		
		document.getElementById("10to11AmNew").classList.add("white");
		document.getElementById("10to11AmNew").classList.add("pink-text");
		document.getElementById("10to11AmNew").classList.remove("pink");
		document.getElementById("10to11AmNew").classList.remove("white-text");
		
		document.getElementById("11to12pmNew").classList.add("white");
		document.getElementById("11to12pmNew").classList.add("pink-text");
		document.getElementById("11to12pmNew").classList.remove("pink");
		document.getElementById("11to12pmNew").classList.remove("white-text");
		
		document.getElementById("12to01pmNew").classList.add("white");
		document.getElementById("12to01pmNew").classList.add("pink-text");
		document.getElementById("12to01pmNew").classList.remove("pink");
		document.getElementById("12to01pmNew").classList.remove("white-text");
		
		document.getElementById("01pmto02pmNew").classList.add("white");
		document.getElementById("01pmto02pmNew").classList.add("pink-text");
		document.getElementById("01pmto02pmNew").classList.remove("pink");
		document.getElementById("01pmto02pmNew").classList.remove("white-text");		
		
		document.getElementById("02pmto03pmNew").classList.remove("white");
		document.getElementById("02pmto03pmNew").classList.remove("pink-text");
		document.getElementById("02pmto03pmNew").classList.add("pink");
		document.getElementById("02pmto03pmNew").classList.add("white-text");
		
		document.getElementById("03pmto04pmNew").classList.add("white");
		document.getElementById("03pmto04pmNew").classList.add("pink-text");
		document.getElementById("03pmto04pmNew").classList.remove("pink");
		document.getElementById("03pmto04pmNew").classList.remove("white-text");
		
		document.getElementById("04pmto05pmNew").classList.add("white");
		document.getElementById("04pmto05pmNew").classList.add("pink-text");
		document.getElementById("04pmto05pmNew").classList.remove("pink");
		document.getElementById("04pmto05pmNew").classList.remove("white-text");
		
		document.getElementById("05pmto06pmNew").classList.add("white");
		document.getElementById("05pmto06pmNew").classList.add("pink-text");
		document.getElementById("05pmto06pmNew").classList.remove("pink");
		document.getElementById("05pmto06pmNew").classList.remove("white-text");
	}else if(selectedtime == '03PM - 04PM'){
		cTime = '15:00:00';
		document.getElementById("9to10AmNew").classList.add("white");
		document.getElementById("9to10AmNew").classList.add("pink-text");
		document.getElementById("9to10AmNew").classList.remove("pink");
		document.getElementById("9to10AmNew").classList.remove("white-text");
		
		document.getElementById("10to11AmNew").classList.add("white");
		document.getElementById("10to11AmNew").classList.add("pink-text");
		document.getElementById("10to11AmNew").classList.remove("pink");
		document.getElementById("10to11AmNew").classList.remove("white-text");
		
		document.getElementById("11to12pmNew").classList.add("white");
		document.getElementById("11to12pmNew").classList.add("pink-text");
		document.getElementById("11to12pmNew").classList.remove("pink");
		document.getElementById("11to12pmNew").classList.remove("white-text");
		
		document.getElementById("12to01pmNew").classList.add("white");
		document.getElementById("12to01pmNew").classList.add("pink-text");
		document.getElementById("12to01pmNew").classList.remove("pink");
		document.getElementById("12to01pmNew").classList.remove("white-text");
		
		document.getElementById("01pmto02pmNew").classList.add("white");
		document.getElementById("01pmto02pmNew").classList.add("pink-text");
		document.getElementById("01pmto02pmNew").classList.remove("pink");
		document.getElementById("01pmto02pmNew").classList.remove("white-text");		
		
		document.getElementById("02pmto03pmNew").classList.add("white");
		document.getElementById("02pmto03pmNew").classList.add("pink-text");
		document.getElementById("02pmto03pmNew").classList.remove("pink");
		document.getElementById("02pmto03pmNew").classList.remove("white-text");
		
		document.getElementById("03pmto04pmNew").classList.remove("white");
		document.getElementById("03pmto04pmNew").classList.remove("pink-text");
		document.getElementById("03pmto04pmNew").classList.add("pink");
		document.getElementById("03pmto04pmNew").classList.add("white-text");
		
		document.getElementById("04pmto05pmNew").classList.add("white");
		document.getElementById("04pmto05pmNew").classList.add("pink-text");
		document.getElementById("04pmto05pmNew").classList.remove("pink");
		document.getElementById("04pmto05pmNew").classList.remove("white-text");
		
		document.getElementById("05pmto06pmNew").classList.add("white");
		document.getElementById("05pmto06pmNew").classList.add("pink-text");
		document.getElementById("05pmto06pmNew").classList.remove("pink");
		document.getElementById("05pmto06pmNew").classList.remove("white-text");
	}else if(selectedtime == '04PM - 05PM'){
		cTime = '16:00:00';
		document.getElementById("9to10AmNew").classList.add("white");
		document.getElementById("9to10AmNew").classList.add("pink-text");
		document.getElementById("9to10AmNew").classList.remove("pink");
		document.getElementById("9to10AmNew").classList.remove("white-text");
		
		document.getElementById("10to11AmNew").classList.add("white");
		document.getElementById("10to11AmNew").classList.add("pink-text");
		document.getElementById("10to11AmNew").classList.remove("pink");
		document.getElementById("10to11AmNew").classList.remove("white-text");
		
		document.getElementById("11to12pmNew").classList.add("white");
		document.getElementById("11to12pmNew").classList.add("pink-text");
		document.getElementById("11to12pmNew").classList.remove("pink");
		document.getElementById("11to12pmNew").classList.remove("white-text");
		
		document.getElementById("12to01pmNew").classList.add("white");
		document.getElementById("12to01pmNew").classList.add("pink-text");
		document.getElementById("12to01pmNew").classList.remove("pink");
		document.getElementById("12to01pmNew").classList.remove("white-text");
		
		document.getElementById("01pmto02pmNew").classList.add("white");
		document.getElementById("01pmto02pmNew").classList.add("pink-text");
		document.getElementById("01pmto02pmNew").classList.remove("pink");
		document.getElementById("01pmto02pmNew").classList.remove("white-text");		
		
		document.getElementById("02pmto03pmNew").classList.add("white");
		document.getElementById("02pmto03pmNew").classList.add("pink-text");
		document.getElementById("02pmto03pmNew").classList.remove("pink");
		document.getElementById("02pmto03pmNew").classList.remove("white-text");
		
		document.getElementById("03pmto04pmNew").classList.add("white");
		document.getElementById("03pmto04pmNew").classList.add("pink-text");
		document.getElementById("03pmto04pmNew").classList.remove("pink");
		document.getElementById("03pmto04pmNew").classList.remove("white-text");
		
		document.getElementById("04pmto05pmNew").classList.remove("white");
		document.getElementById("04pmto05pmNew").classList.remove("pink-text");
		document.getElementById("04pmto05pmNew").classList.add("pink");
		document.getElementById("04pmto05pmNew").classList.add("white-text");
		
		document.getElementById("05pmto06pmNew").classList.add("white");
		document.getElementById("05pmto06pmNew").classList.add("pink-text");
		document.getElementById("05pmto06pmNew").classList.remove("pink");
		document.getElementById("05pmto06pmNew").classList.remove("white-text");
	}else if(selectedtime == '05PM - 06PM'){
		cTime = '17:00:00';
		document.getElementById("9to10AmNew").classList.add("white");
		document.getElementById("9to10AmNew").classList.add("pink-text");
		document.getElementById("9to10AmNew").classList.remove("pink");
		document.getElementById("9to10AmNew").classList.remove("white-text");
		
		document.getElementById("10to11AmNew").classList.add("white");
		document.getElementById("10to11AmNew").classList.add("pink-text");
		document.getElementById("10to11AmNew").classList.remove("pink");
		document.getElementById("10to11AmNew").classList.remove("white-text");
		
		document.getElementById("11to12pmNew").classList.add("white");
		document.getElementById("11to12pmNew").classList.add("pink-text");
		document.getElementById("11to12pmNew").classList.remove("pink");
		document.getElementById("11to12pmNew").classList.remove("white-text");
		
		document.getElementById("12to01pmNew").classList.add("white");
		document.getElementById("12to01pmNew").classList.add("pink-text");
		document.getElementById("12to01pmNew").classList.remove("pink");
		document.getElementById("12to01pmNew").classList.remove("white-text");
		
		document.getElementById("01pmto02pmNew").classList.add("white");
		document.getElementById("01pmto02pmNew").classList.add("pink-text");
		document.getElementById("01pmto02pmNew").classList.remove("pink");
		document.getElementById("01pmto02pmNew").classList.remove("white-text");		
		
		document.getElementById("02pmto03pmNew").classList.add("white");
		document.getElementById("02pmto03pmNew").classList.add("pink-text");
		document.getElementById("02pmto03pmNew").classList.remove("pink");
		document.getElementById("02pmto03pmNew").classList.remove("white-text");
		
		document.getElementById("03pmto04pmNew").classList.add("white");
		document.getElementById("03pmto04pmNew").classList.add("pink-text");
		document.getElementById("03pmto04pmNew").classList.remove("pink");
		document.getElementById("03pmto04pmNew").classList.remove("white-text");
		
		document.getElementById("04pmto05pmNew").classList.add("white");
		document.getElementById("04pmto05pmNew").classList.add("pink-text");
		document.getElementById("04pmto05pmNew").classList.remove("pink");
		document.getElementById("04pmto05pmNew").classList.remove("white-text");
		
		document.getElementById("05pmto06pmNew").classList.remove("white");
		document.getElementById("05pmto06pmNew").classList.remove("pink-text");
		document.getElementById("05pmto06pmNew").classList.add("pink");
		document.getElementById("05pmto06pmNew").classList.add("white-text");
	}
	document.getElementById("bookinginfo_time").value = cTime;
}

function setStar(star){
	reviewStar = star;
	if(reviewStar == 1){
		document.getElementById("stars").innerHTML = '<i class="material-icons amber-text" onclick="setStar(1)">star</i><i class="material-icons grey-text" onclick="setStar(2)">star</i><i class="material-icons grey-text" onclick="setStar(3)">star</i><i class="material-icons grey-text" onclick="setStar(4)">star</i><i class="material-icons grey-text" onclick="setStar(5)">star</i>';
	}else if(reviewStar == 2){
		document.getElementById("stars").innerHTML = '<i class="material-icons amber-text" onclick="setStar(1)">star</i><i class="material-icons amber-text" onclick="setStar(2)">star</i><i class="material-icons grey-text" onclick="setStar(3)">star</i><i class="material-icons grey-text" onclick="setStar(4)">star</i><i class="material-icons grey-text" onclick="setStar(5)">star</i>';
	}else if(reviewStar == 3){
		document.getElementById("stars").innerHTML = '<i class="material-icons amber-text" onclick="setStar(1)">star</i><i class="material-icons amber-text" onclick="setStar(2)">star</i><i class="material-icons amber-text" onclick="setStar(3)">star</i><i class="material-icons grey-text" onclick="setStar(4)">star</i><i class="material-icons grey-text" onclick="setStar(5)">star</i>';
	}else if(reviewStar == 4){
		document.getElementById("stars").innerHTML = '<i class="material-icons amber-text" onclick="setStar(1)">star</i><i class="material-icons amber-text" onclick="setStar(2)">star</i><i class="material-icons amber-text" onclick="setStar(3)">star</i><i class="material-icons amber-text" onclick="setStar(4)">star</i><i class="material-icons grey-text" onclick="setStar(5)">star</i>';
	}else if(reviewStar == 5){
		document.getElementById("stars").innerHTML = '<i class="material-icons amber-text" onclick="setStar(1)">star</i><i class="material-icons amber-text" onclick="setStar(2)">star</i><i class="material-icons amber-text" onclick="setStar(3)">star</i><i class="material-icons amber-text" onclick="setStar(4)">star</i><i class="material-icons amber-text" onclick="setStar(5)">star</i>';
	}
		
}
function sendReview(){
	showLoading();
    var to_id = spToreview;
    var rating = reviewStar;
    var review = document.getElementById("givereview").value;
    var job_type = jobTypetoreview;
    var job_id = jobIdtoreview;

    var dataTopost = "api=1&auth_token=" + authUser.login_token + "&inserttoreviews=true&to_id="+to_id+"&rating="+rating+"&review="+review+"&job_type="+job_type+"&job_id="+job_id;
    var reviews = new XMLHttpRequest();
    reviews.open("POST", serverUrl, true);
    reviews.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    reviews.onload = function() {
        if (reviews.status == 200) {
            var json = reviews.responseText;
            var response = JSON.parse(json);
            loadingResponse(response.message);
			setStar(0);
			document.getElementById("givereview").value="";
			openpage("chatlists");
        } else if (reviews.status == 404) {
            alert("Fail to connect to our server");
        } else {
            alert("Fail to connect to our server");
        }
    }
    reviews.send(dataTopost);
}
function endsessionNotDoc(){
	showLoading();
	var clinicalNote = document.getElementById("patientdiaogcn").value;
	var refertonotdoctor = document.getElementById("refertonotdoctor").value;
	clinicalNotedata.subjective = cleanAll(document.getElementById("ndcn_subjective").value);
	clinicalNotedata.objective = cleanAll(document.getElementById("ndcn_objective").value);
	clinicalNotedata.assessment = cleanAll(document.getElementById("ndcn_assessment").value);
	clinicalNotedata.plan = cleanAll(document.getElementById("ndcn_plan").value);
	var sendclinicalNote = JSON.stringify(clinicalNotedata);
	var dataTopost = "api=1&auth_token=" + authUser.login_token + "&ensessionnotdoctor="+doccurrentlyViewingthissession+"&clinicalNote="+sendclinicalNote+"&refertonotdoctor="+refertonotdoctor;
    var chats = new XMLHttpRequest();
    chats.open("POST", serverUrl, true);
    chats.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    chats.onload = function() {
        if (chats.status == 200) {
            var json = chats.responseText;
            var response = JSON.parse(json);
            loadingResponse(response.message);
			openpage("docsession");
        } else if (chats.status == 404) {
            alert("Fail to connect to our server");
        } else {
            alert("Fail to connect to our server");
        }
    }
    chats.send(dataTopost);
}
function submitVerification(){
	showLoading();
	var verify_IDType = document.getElementById("verify_IDType").value;
	if(verify_IDType == "N"){
		
	}else if(verify_IDType == "P"){
		
	}
	var verify_FullName = document.getElementById("verify_FullName").value;
	var verify_EmailAddress = document.getElementById("verify_EmailAddress").value;
	var verify_MobileNo = document.getElementById("verify_MobileNo").value;
	var verify_MembershipNo = document.getElementById("verify_MembershipNo").value;
	var verify_CertValidity = document.getElementById("verify_CertValidity").value;
	var verify_UserID = document.getElementById("verify_UserID").value;
	var verify_NRICFront = document.getElementById("verify_NRICFront").value;
	var verify_NRICBack = document.getElementById("verify_NRICBack").value;
	var verify_PassportImage = document.getElementById("verify_PassportImage").value;
	//Org information
	var verify_orgName = document.getElementById("verify_orgName").value;
	var verify_orgUserDesignation = document.getElementById("verify_orgUserDesignation").value;
	var verify_orgAddress = document.getElementById("verify_orgAddress").value;
	var verify_orgAddressCity = document.getElementById("verify_orgAddressCity").value;
	var verify_orgAddressPostcode = document.getElementById("verify_orgAddressPostcode").value;
	var verify_orgAddressCountry = document.getElementById("verify_orgAddressCountry").value;
	var verify_orgRegistationNo = document.getElementById("verify_orgRegistationNo").value;
	var verify_orgPhoneNo = document.getElementById("verify_orgPhoneNo").value;
	var verify_orgFaxNo = document.getElementById("verify_orgFaxNo").value;
	var dataTopost = "api=1&auth_token=" + authUser.login_token + "&verifytrustgate=true&editverify_MembershipNo="+verify_MembershipNo+"&editverify_CertValidity="+verify_CertValidity+"&editverify_NRICFront="+verify_NRICFront+"&editverify_NRICBack="+verify_NRICBack+"&editverify_PassportImage="+verify_PassportImage+"&editverify_orgUserDesignation="+verify_orgUserDesignation+"&editverify_orgAddress="+verify_orgAddress+"&editverify_orgAddressCity="+verify_orgAddressCity+"&editverify_orgAddressPostcode="+verify_orgAddressPostcode+"&editverify_orgAddressCountry="+verify_orgAddressCountry+"&editverify_orgRegistationNo="+verify_orgRegistationNo+"&editverify_orgPhoneNo="+verify_orgPhoneNo+"&editverify_orgFaxNo="+verify_orgFaxNo+"&editverify_UserID="+verify_UserID;
    var users = new XMLHttpRequest();
    users.open("POST", serverUrl, true);
    users.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    users.onload = function() {
        if (users.status == 200) {
            var json = users.responseText;
            var response = JSON.parse(json);
            //location.reload();
            console.log(response.message);
			closeLoading();
        } else if (users.status == 404) {
            alert("Fail to connect to our server");
        } else {
            alert("Fail to connect to our server");
        }
    }
	users.send(dataTopost);
}
var docClinicalnote = "";
function docDiognosagewrite(element){
	docDiognosage = element.value;
}
function docwriteClinicalnote(element){
	docClinicalnote = element.value;
}
var persontoCall;
function endCall(){
	hide("videocall");
	show("docsessionview");
	
}

function checkIncomingcall(){
	if(authUser.login_token != "undefined"){
		var dataTopost = "api=1&auth_token=" + authUser.login_token + "&viewlatestcall=true";
		var calls = new XMLHttpRequest();
		calls.open("POST", serverUrl, true);
		calls.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
		calls.onload = function() {
			if (calls.status == 200) {
				var json = calls.responseText;
				var response = JSON.parse(json);
				
			} else if (calls.status == 404) {
				alert("Fail to connect to our server");
			} else {
				alert("Fail to connect to our server");
			}
		}
		
		calls.send(dataTopost);
	}
	//setTimeout(function(){ checkIncomingcall();}, 3000);
}

function requestVideocall(){
	showLoading();
	setTimeout(function(){ loadingResponse('Error: 033: This API Does not work in debug build'), 2000});
	session.call(extension, (error) => {});
/* 	var tocall = persontoCall;
	console.log("Person to call "+tocall+" calling from id "+authUser.id);
	var dataTopost = "api=1&auth_token=" + authUser.login_token + "&viewThiscalls="+persontoCall;
    var calls = new XMLHttpRequest();
    calls.open("POST", serverUrl, true);
    calls.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    calls.onload = function() {
        if (calls.status == 200) {
            var json = calls.responseText;
            var response = JSON.parse(json);
			show("videocall");
			hide("docsessionview");
        } else if (calls.status == 404) {
            alert("Fail to connect to our server");
        } else {
            alert("Fail to connect to our server");
        }
    }
    calls.send(dataTopost); */
}
function dosageSelect(selectedOptions){
	if(selectedOptions == "tablet"){
		
		document.getElementById("picktablet").classList.remove("white");
		document.getElementById("picktablet").classList.remove("pink-text");
		document.getElementById("picktablet").classList.add("white-text");
		document.getElementById("picktablet").classList.add("pink");
		
		document.getElementById("pickmL").classList.add("white");
		document.getElementById("pickmL").classList.add("pink-text");
		document.getElementById("pickmL").classList.remove("white-text");
		document.getElementById("pickmL").classList.remove("pink");
		
		document.getElementById("pickmg").classList.add("white");
		document.getElementById("pickmg").classList.add("pink-text");
		document.getElementById("pickmg").classList.remove("white-text");
		document.getElementById("pickmg").classList.remove("pink");
		
		document.getElementById("pickPessary").classList.add("white");
		document.getElementById("pickPessary").classList.add("pink-text");
		document.getElementById("pickPessary").classList.remove("white-text");
		document.getElementById("pickPessary").classList.remove("pink");
		
		
		document.getElementById("pickSuppository").classList.add("white");
		document.getElementById("pickSuppository").classList.add("pink-text");
		document.getElementById("pickSuppository").classList.remove("white-text");
		document.getElementById("pickSuppository").classList.remove("pink");
		
		document.getElementById("pickInjection").classList.add("white");
		document.getElementById("pickInjection").classList.add("pink-text");
		document.getElementById("pickInjection").classList.remove("white-text");
		document.getElementById("pickInjection").classList.remove("pink");
		
		document.getElementById("pickDrops").classList.add("white");
		document.getElementById("pickDrops").classList.add("pink-text");
		document.getElementById("pickDrops").classList.remove("white-text");
		document.getElementById("pickDrops").classList.remove("pink");
		
		document.getElementById("pickCapsule").classList.add("white");
		document.getElementById("pickCapsule").classList.add("pink-text");
		document.getElementById("pickCapsule").classList.remove("white-text");
		document.getElementById("pickCapsule").classList.remove("pink");
		
		document.getElementById("pickPuff").classList.add("white");
		document.getElementById("pickPuff").classList.add("pink-text");
		document.getElementById("pickPuff").classList.remove("white-text");
		document.getElementById("pickPuff").classList.remove("pink");
		
	}else if(selectedOptions == "mL"){
		document.getElementById("picktablet").classList.add("white");
		document.getElementById("picktablet").classList.add("pink-text");
		document.getElementById("picktablet").classList.remove("white-text");
		document.getElementById("picktablet").classList.remove("pink");
		
		document.getElementById("pickmL").classList.remove("white");
		document.getElementById("pickmL").classList.remove("pink-text");
		document.getElementById("pickmL").classList.add("white-text");
		document.getElementById("pickmL").classList.add("pink");
		
		document.getElementById("pickmg").classList.add("white");
		document.getElementById("pickmg").classList.add("pink-text");
		document.getElementById("pickmg").classList.remove("white-text");
		document.getElementById("pickmg").classList.remove("pink");
		
		document.getElementById("pickPessary").classList.add("white");
		document.getElementById("pickPessary").classList.add("pink-text");
		document.getElementById("pickPessary").classList.remove("white-text");
		document.getElementById("pickPessary").classList.remove("pink");
		
		
		document.getElementById("pickSuppository").classList.add("white");
		document.getElementById("pickSuppository").classList.add("pink-text");
		document.getElementById("pickSuppository").classList.remove("white-text");
		document.getElementById("pickSuppository").classList.remove("pink");
		
		document.getElementById("pickInjection").classList.add("white");
		document.getElementById("pickInjection").classList.add("pink-text");
		document.getElementById("pickInjection").classList.remove("white-text");
		document.getElementById("pickInjection").classList.remove("pink");
		
		document.getElementById("pickDrops").classList.add("white");
		document.getElementById("pickDrops").classList.add("pink-text");
		document.getElementById("pickDrops").classList.remove("white-text");
		document.getElementById("pickDrops").classList.remove("pink");
		
		document.getElementById("pickCapsule").classList.add("white");
		document.getElementById("pickCapsule").classList.add("pink-text");
		document.getElementById("pickCapsule").classList.remove("white-text");
		document.getElementById("pickCapsule").classList.remove("pink");
		
		document.getElementById("pickPuff").classList.add("white");
		document.getElementById("pickPuff").classList.add("pink-text");
		document.getElementById("pickPuff").classList.remove("white-text");
		document.getElementById("pickPuff").classList.remove("pink");
		
	}else if(selectedOptions == "mg"){
		
		document.getElementById("picktablet").classList.add("white");
		document.getElementById("picktablet").classList.add("pink-text");
		document.getElementById("picktablet").classList.remove("white-text");
		document.getElementById("picktablet").classList.remove("pink");
		
		document.getElementById("pickmL").classList.add("white");
		document.getElementById("pickmL").classList.add("pink-text");
		document.getElementById("pickmL").classList.remove("white-text");
		document.getElementById("pickmL").classList.remove("pink");
		
		document.getElementById("pickmg").classList.remove("white");
		document.getElementById("pickmg").classList.remove("pink-text");
		document.getElementById("pickmg").classList.add("white-text");
		document.getElementById("pickmg").classList.add("pink");
		
		document.getElementById("pickPessary").classList.add("white");
		document.getElementById("pickPessary").classList.add("pink-text");
		document.getElementById("pickPessary").classList.remove("white-text");
		document.getElementById("pickPessary").classList.remove("pink");
		
		
		document.getElementById("pickSuppository").classList.add("white");
		document.getElementById("pickSuppository").classList.add("pink-text");
		document.getElementById("pickSuppository").classList.remove("white-text");
		document.getElementById("pickSuppository").classList.remove("pink");
		
		document.getElementById("pickInjection").classList.add("white");
		document.getElementById("pickInjection").classList.add("pink-text");
		document.getElementById("pickInjection").classList.remove("white-text");
		document.getElementById("pickInjection").classList.remove("pink");
		
		document.getElementById("pickDrops").classList.add("white");
		document.getElementById("pickDrops").classList.add("pink-text");
		document.getElementById("pickDrops").classList.remove("white-text");
		document.getElementById("pickDrops").classList.remove("pink");
		
		document.getElementById("pickCapsule").classList.add("white");
		document.getElementById("pickCapsule").classList.add("pink-text");
		document.getElementById("pickCapsule").classList.remove("white-text");
		document.getElementById("pickCapsule").classList.remove("pink");
		
		document.getElementById("pickPuff").classList.add("white");
		document.getElementById("pickPuff").classList.add("pink-text");
		document.getElementById("pickPuff").classList.remove("white-text");
		document.getElementById("pickPuff").classList.remove("pink");
		
	}else if(selectedOptions == "Pessary"){
		document.getElementById("picktablet").classList.add("white");
		document.getElementById("picktablet").classList.add("pink-text");
		document.getElementById("picktablet").classList.remove("white-text");
		document.getElementById("picktablet").classList.remove("pink");
		
		document.getElementById("pickmL").classList.add("white");
		document.getElementById("pickmL").classList.add("pink-text");
		document.getElementById("pickmL").classList.remove("white-text");
		document.getElementById("pickmL").classList.remove("pink");
		
		document.getElementById("pickmg").classList.add("white");
		document.getElementById("pickmg").classList.add("pink-text");
		document.getElementById("pickmg").classList.remove("white-text");
		document.getElementById("pickmg").classList.remove("pink");
		
		document.getElementById("pickPessary").classList.remove("white");
		document.getElementById("pickPessary").classList.remove("pink-text");
		document.getElementById("pickPessary").classList.add("white-text");
		document.getElementById("pickPessary").classList.add("pink");
		
		
		document.getElementById("pickSuppository").classList.add("white");
		document.getElementById("pickSuppository").classList.add("pink-text");
		document.getElementById("pickSuppository").classList.remove("white-text");
		document.getElementById("pickSuppository").classList.remove("pink");
		
		document.getElementById("pickInjection").classList.add("white");
		document.getElementById("pickInjection").classList.add("pink-text");
		document.getElementById("pickInjection").classList.remove("white-text");
		document.getElementById("pickInjection").classList.remove("pink");
		
		document.getElementById("pickDrops").classList.add("white");
		document.getElementById("pickDrops").classList.add("pink-text");
		document.getElementById("pickDrops").classList.remove("white-text");
		document.getElementById("pickDrops").classList.remove("pink");
		
		document.getElementById("pickCapsule").classList.add("white");
		document.getElementById("pickCapsule").classList.add("pink-text");
		document.getElementById("pickCapsule").classList.remove("white-text");
		document.getElementById("pickCapsule").classList.remove("pink");
		
		document.getElementById("pickPuff").classList.add("white");
		document.getElementById("pickPuff").classList.add("pink-text");
		document.getElementById("pickPuff").classList.remove("white-text");
		document.getElementById("pickPuff").classList.remove("pink");
	}else if(selectedOptions == "Suppository"){
		document.getElementById("picktablet").classList.add("white");
		document.getElementById("picktablet").classList.add("pink-text");
		document.getElementById("picktablet").classList.remove("white-text");
		document.getElementById("picktablet").classList.remove("pink");
		
		document.getElementById("pickmL").classList.add("white");
		document.getElementById("pickmL").classList.add("pink-text");
		document.getElementById("pickmL").classList.remove("white-text");
		document.getElementById("pickmL").classList.remove("pink");
		
		document.getElementById("pickmg").classList.add("white");
		document.getElementById("pickmg").classList.add("pink-text");
		document.getElementById("pickmg").classList.remove("white-text");
		document.getElementById("pickmg").classList.remove("pink");
		
		document.getElementById("pickPessary").classList.add("white");
		document.getElementById("pickPessary").classList.add("pink-text");
		document.getElementById("pickPessary").classList.remove("white-text");
		document.getElementById("pickPessary").classList.remove("pink");
		
		
		document.getElementById("pickSuppository").classList.remove("white");
		document.getElementById("pickSuppository").classList.remove("pink-text");
		document.getElementById("pickSuppository").classList.add("white-text");
		document.getElementById("pickSuppository").classList.add("pink");
		
		document.getElementById("pickInjection").classList.add("white");
		document.getElementById("pickInjection").classList.add("pink-text");
		document.getElementById("pickInjection").classList.remove("white-text");
		document.getElementById("pickInjection").classList.remove("pink");
		
		document.getElementById("pickDrops").classList.add("white");
		document.getElementById("pickDrops").classList.add("pink-text");
		document.getElementById("pickDrops").classList.remove("white-text");
		document.getElementById("pickDrops").classList.remove("pink");
		
		document.getElementById("pickCapsule").classList.add("white");
		document.getElementById("pickCapsule").classList.add("pink-text");
		document.getElementById("pickCapsule").classList.remove("white-text");
		document.getElementById("pickCapsule").classList.remove("pink");
		
		document.getElementById("pickPuff").classList.add("white");
		document.getElementById("pickPuff").classList.add("pink-text");
		document.getElementById("pickPuff").classList.remove("white-text");
		document.getElementById("pickPuff").classList.remove("pink");
		
	}else if(selectedOptions == "Injection"){

		document.getElementById("picktablet").classList.add("white");
		document.getElementById("picktablet").classList.add("pink-text");
		document.getElementById("picktablet").classList.remove("white-text");
		document.getElementById("picktablet").classList.remove("pink");
		
		document.getElementById("pickmL").classList.add("white");
		document.getElementById("pickmL").classList.add("pink-text");
		document.getElementById("pickmL").classList.remove("white-text");
		document.getElementById("pickmL").classList.remove("pink");
		
		document.getElementById("pickmg").classList.add("white");
		document.getElementById("pickmg").classList.add("pink-text");
		document.getElementById("pickmg").classList.remove("white-text");
		document.getElementById("pickmg").classList.remove("pink");
		
		document.getElementById("pickPessary").classList.add("white");
		document.getElementById("pickPessary").classList.add("pink-text");
		document.getElementById("pickPessary").classList.remove("white-text");
		document.getElementById("pickPessary").classList.remove("pink");
		
		
		document.getElementById("pickSuppository").classList.add("white");
		document.getElementById("pickSuppository").classList.add("pink-text");
		document.getElementById("pickSuppository").classList.remove("white-text");
		document.getElementById("pickSuppository").classList.remove("pink");
		
		document.getElementById("pickInjection").classList.remove("white");
		document.getElementById("pickInjection").classList.remove("pink-text");
		document.getElementById("pickInjection").classList.add("white-text");
		document.getElementById("pickInjection").classList.add("pink");
		
		document.getElementById("pickDrops").classList.add("white");
		document.getElementById("pickDrops").classList.add("pink-text");
		document.getElementById("pickDrops").classList.remove("white-text");
		document.getElementById("pickDrops").classList.remove("pink");
		
		document.getElementById("pickCapsule").classList.add("white");
		document.getElementById("pickCapsule").classList.add("pink-text");
		document.getElementById("pickCapsule").classList.remove("white-text");
		document.getElementById("pickCapsule").classList.remove("pink");
		
		document.getElementById("pickPuff").classList.add("white");
		document.getElementById("pickPuff").classList.add("pink-text");
		document.getElementById("pickPuff").classList.remove("white-text");
		document.getElementById("pickPuff").classList.remove("pink");
		
	}else if(selectedOptions == "Drops"){
		
		document.getElementById("picktablet").classList.add("white");
		document.getElementById("picktablet").classList.add("pink-text");
		document.getElementById("picktablet").classList.remove("white-text");
		document.getElementById("picktablet").classList.remove("pink");
		
		document.getElementById("pickmL").classList.add("white");
		document.getElementById("pickmL").classList.add("pink-text");
		document.getElementById("pickmL").classList.remove("white-text");
		document.getElementById("pickmL").classList.remove("pink");
		
		document.getElementById("pickmg").classList.add("white");
		document.getElementById("pickmg").classList.add("pink-text");
		document.getElementById("pickmg").classList.remove("white-text");
		document.getElementById("pickmg").classList.remove("pink");
		
		document.getElementById("pickPessary").classList.add("white");
		document.getElementById("pickPessary").classList.add("pink-text");
		document.getElementById("pickPessary").classList.remove("white-text");
		document.getElementById("pickPessary").classList.remove("pink");
		
		
		document.getElementById("pickSuppository").classList.add("white");
		document.getElementById("pickSuppository").classList.add("pink-text");
		document.getElementById("pickSuppository").classList.remove("white-text");
		document.getElementById("pickSuppository").classList.remove("pink");
		
		document.getElementById("pickInjection").classList.add("white");
		document.getElementById("pickInjection").classList.add("pink-text");
		document.getElementById("pickInjection").classList.remove("white-text");
		document.getElementById("pickInjection").classList.remove("pink");
		
		document.getElementById("pickDrops").classList.remove("white");
		document.getElementById("pickDrops").classList.remove("pink-text");
		document.getElementById("pickDrops").classList.add("white-text");
		document.getElementById("pickDrops").classList.add("pink");
		
		document.getElementById("pickCapsule").classList.add("white");
		document.getElementById("pickCapsule").classList.add("pink-text");
		document.getElementById("pickCapsule").classList.remove("white-text");
		document.getElementById("pickCapsule").classList.remove("pink");
		
		document.getElementById("pickPuff").classList.add("white");
		document.getElementById("pickPuff").classList.add("pink-text");
		document.getElementById("pickPuff").classList.remove("white-text");
		document.getElementById("pickPuff").classList.remove("pink");
		
	}else if(selectedOptions == "Capsule"){
		
		document.getElementById("picktablet").classList.add("white");
		document.getElementById("picktablet").classList.add("pink-text");
		document.getElementById("picktablet").classList.remove("white-text");
		document.getElementById("picktablet").classList.remove("pink");
		
		document.getElementById("pickmL").classList.add("white");
		document.getElementById("pickmL").classList.add("pink-text");
		document.getElementById("pickmL").classList.remove("white-text");
		document.getElementById("pickmL").classList.remove("pink");
		
		document.getElementById("pickmg").classList.add("white");
		document.getElementById("pickmg").classList.add("pink-text");
		document.getElementById("pickmg").classList.remove("white-text");
		document.getElementById("pickmg").classList.remove("pink");
		
		document.getElementById("pickPessary").classList.add("white");
		document.getElementById("pickPessary").classList.add("pink-text");
		document.getElementById("pickPessary").classList.remove("white-text");
		document.getElementById("pickPessary").classList.remove("pink");
		
		
		document.getElementById("pickSuppository").classList.add("white");
		document.getElementById("pickSuppository").classList.add("pink-text");
		document.getElementById("pickSuppository").classList.remove("white-text");
		document.getElementById("pickSuppository").classList.remove("pink");
		
		document.getElementById("pickInjection").classList.add("white");
		document.getElementById("pickInjection").classList.add("pink-text");
		document.getElementById("pickInjection").classList.remove("white-text");
		document.getElementById("pickInjection").classList.remove("pink");
		
		document.getElementById("pickDrops").classList.add("white");
		document.getElementById("pickDrops").classList.add("pink-text");
		document.getElementById("pickDrops").classList.remove("white-text");
		document.getElementById("pickDrops").classList.remove("pink");
		
		document.getElementById("pickCapsule").classList.remove("white");
		document.getElementById("pickCapsule").classList.remove("pink-text");
		document.getElementById("pickCapsule").classList.add("white-text");
		document.getElementById("pickCapsule").classList.add("pink");
		
		document.getElementById("pickPuff").classList.add("white");
		document.getElementById("pickPuff").classList.add("pink-text");
		document.getElementById("pickPuff").classList.remove("white-text");
		document.getElementById("pickPuff").classList.remove("pink");
		
	}else if(selectedOptions == "Puff"){
		document.getElementById("picktablet").classList.add("white");
		document.getElementById("picktablet").classList.add("pink-text");
		document.getElementById("picktablet").classList.remove("white-text");
		document.getElementById("picktablet").classList.remove("pink");
		
		document.getElementById("pickmL").classList.add("white");
		document.getElementById("pickmL").classList.add("pink-text");
		document.getElementById("pickmL").classList.remove("white-text");
		document.getElementById("pickmL").classList.remove("pink");
		
		document.getElementById("pickmg").classList.add("white");
		document.getElementById("pickmg").classList.add("pink-text");
		document.getElementById("pickmg").classList.remove("white-text");
		document.getElementById("pickmg").classList.remove("pink");
		
		document.getElementById("pickPessary").classList.add("white");
		document.getElementById("pickPessary").classList.add("pink-text");
		document.getElementById("pickPessary").classList.remove("white-text");
		document.getElementById("pickPessary").classList.remove("pink");
		
		
		document.getElementById("pickSuppository").classList.add("white");
		document.getElementById("pickSuppository").classList.add("pink-text");
		document.getElementById("pickSuppository").classList.remove("white-text");
		document.getElementById("pickSuppository").classList.remove("pink");
		
		document.getElementById("pickInjection").classList.add("white");
		document.getElementById("pickInjection").classList.add("pink-text");
		document.getElementById("pickInjection").classList.remove("white-text");
		document.getElementById("pickInjection").classList.remove("pink");
		
		document.getElementById("pickDrops").classList.add("white");
		document.getElementById("pickDrops").classList.add("pink-text");
		document.getElementById("pickDrops").classList.remove("white-text");
		document.getElementById("pickDrops").classList.remove("pink");
		
		document.getElementById("pickCapsule").classList.add("white");
		document.getElementById("pickCapsule").classList.add("pink-text");
		document.getElementById("pickCapsule").classList.remove("white-text");
		document.getElementById("pickCapsule").classList.remove("pink");
		
		document.getElementById("pickPuff").classList.remove("white");
		document.getElementById("pickPuff").classList.remove("pink-text");
		document.getElementById("pickPuff").classList.add("white-text");
		document.getElementById("pickPuff").classList.add("pink");
		
	}
	dosageType = selectedOptions;

}
var mcdata = "None";
var referdata = "None";
function attachRefer(){
	var referfacility = document.getElementById("referfacility").value;
	var refername = document.getElementById("refername").value;
	var refernotes = document.getElementById("refernotes").value;
	var referdiaog = document.getElementById("referdiaog").value;
	var refferreason = document.getElementById("refferreason").value;
	if(referfacility != "" && refername != "" && refernotes != "" && referdiaog != "" && refferreason != ""){
		referdata = {"referfacility":referfacility, "refername":refername, "refernotes":refernotes, "referdiaog":referdiaog, "refferreason":refferreason}
		var content = 'Referring to '+refername+' from '+referfacility;
		renderTo("refernote", content);
		hide("referto");
	}else{
		instaResponse("Please fill all the form");
	}
}
function attachMc(){
	var user = document.getElementById("mcfor").value;
	var fromdate = document.getElementById("mcfrom").value;
	var todate = document.getElementById("mcto").value;
	var mcdiog = document.getElementById("mcdiog").value;
	if(user != "" && fromdate != "" && todate != "" && mcdiog != ""){
		mcdata = '{"user":"'+user+'", "mcfrom":"'+fromdate+'", "todate":"'+todate+'", "diagnosed_with":"'+mcdiog+'"}';
		document.getElementById("mcnote").innerHTML = 'MC from '+fromdate+' to '+todate+'';
		hide("writemc");
	}else{
		instaResponse("Please fill all the form");
	}
	
}

function endSession(){
	showLoading();
	var diagnose = docDiognosage;
	var clincalnote =JSON.stringify(clinicalNotedata);
	var pininput = document.getElementById("pininput").value;
	var prescription = JSON.stringify(prescribedMed);
	if(referdata == "None"){
		var sendreferdata = referdata;
	}else{
		var sendreferdata = JSON.stringify(referdata);
	}
	
	var dataTopost = "api=1&auth_token=" + authUser.login_token + "&endsession="+doccurrentlyViewingthissession+"&editdiagnose="+diagnose+"&editprescription="+prescription+"&mcdata="+mcdata+"&referdata="+sendreferdata+"&clincalNote="+clincalnote+"&storeowner="+sesmedstoreOwner+"&pin="+pininput;
		var chats = new XMLHttpRequest();
		chats.open("POST", serverUrl, true);
		chats.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
		chats.onload = function() {
			console.log(123)
			if (chats.status == 200) {
				var json = chats.responseText;
				var response = JSON.parse(json);
				console.log(response);
				
				if(response.status == "success"){
					//openpage("docsession");
					loadingResponse("Session ended successfully");
					openpage('docsessionview', doccurrentlyViewingthissession, response.owner_two)
				}else{
					loadingResponse("Session ended successfully");
					openpage('docsessionview', doccurrentlyViewingthissession, response.owner_two)
				}
				
			} else if (chats.status == 404) {
				console.log("error 404")
				alert("Fail to connect to our server");
			} else {
				console.log("unknown error")
				alert("Fail to connect to our server");
			}
		}
		chats.send(dataTopost);
}
function renderPrescribedmed(){
		var i;
		document.getElementById("prescribedmed").innerHTML ="";
				
		for (i = 0; i < prescribedMed.length; i++) {
				document.getElementById("prescribedmed").innerHTML += '<li class="collection-item avatar"><img src="'+prescribedMed[i].picture+'" alt="" class="circle"> <span="title">'+prescribedMed[i].name+'</span><p>Stock: '+prescribedMed[i].stock+'</p><a href="#!" class="secondary-content" onclick="removeprescribedMed('+i+')"><i class="material-icons pink-text">close</i></a></li>';
		}
}
function removeprescribedMed(id){
	prescribedMed.splice(id, 1);
	renderPrescribedmed();
}

var arridon = 0;
function docaddToPrescriptionAmount(arrayid, name, picture, pfrom){
	
	document.getElementById("prescribemedpicture").src = picture;
	document.getElementById("prescribemedname").innerHTML = name;
	document.getElementById("prescribemedform").innerHTML = pfrom;
	document.getElementById("presciptiondosage").value = "";
	document.getElementById("consumeroute").value = "";
	document.getElementById("intakeperday").value = "";
	
	document.getElementById("pmealafter").classList.add("white");
	document.getElementById("pmealafter").classList.add("pink-text");
	document.getElementById("pmealafter").classList.remove("white-text");
	document.getElementById("pmealafter").classList.remove("pink");	
	
	document.getElementById("pmealbefore").classList.add("white");
	document.getElementById("pmealbefore").classList.add("pink-text");
	document.getElementById("pmealbefore").classList.remove("white-text");
	document.getElementById("pmealbefore").classList.remove("pink");
	intakeTiming = {Morning:null, Afternoon:null, Evening:null, Night:null};
	document.getElementById("intaketimeAfternoon").classList.remove("pink");
	document.getElementById("intaketimeAfternoon").classList.remove("white-text");
	document.getElementById("intaketimeAfternoon").classList.add("white");
	document.getElementById("intaketimeAfternoon").classList.add("pink-text");

	document.getElementById("intaketimeMorning").classList.remove("pink");
	document.getElementById("intaketimeMorning").classList.remove("white-text");
	document.getElementById("intaketimeMorning").classList.add("white");
	document.getElementById("intaketimeMorning").classList.add("pink-text");

	document.getElementById("intaketimeEvening").classList.remove("pink");
	document.getElementById("intaketimeEvening").classList.remove("white-text");
	document.getElementById("intaketimeEvening").classList.add("white");
	document.getElementById("intaketimeEvening").classList.add("pink-text");

	document.getElementById("intaketimeNight").classList.remove("pink");
	document.getElementById("intaketimeNight").classList.remove("white-text");
	document.getElementById("intaketimeNight").classList.add("white");
	document.getElementById("intaketimeNight").classList.add("pink-text");
	arridon = arrayid;
	hide("searchmed");
	hide("docsessionview");
	show("dialydosage");
	document.getElementById('medclosebutton').scrollIntoView();

}
var curAftermeal = "";
function mealPick(picked){
	if(picked == "Before"){
		curAftermeal = picked;
		document.getElementById("pmealbefore").classList.remove("white");
		document.getElementById("pmealbefore").classList.remove("pink-text");
		document.getElementById("pmealbefore").classList.add("white-text");
		document.getElementById("pmealbefore").classList.add("pink");
		
		document.getElementById("pmealafter").classList.add("white");
		document.getElementById("pmealafter").classList.add("pink-text");
		document.getElementById("pmealafter").classList.remove("white-text");
		document.getElementById("pmealafter").classList.remove("pink");
		
	
	}else if(picked == "After"){
		curAftermeal = picked;
		document.getElementById("pmealafter").classList.remove("white");
		document.getElementById("pmealafter").classList.remove("pink-text");
		document.getElementById("pmealafter").classList.add("white-text");
		document.getElementById("pmealafter").classList.add("pink");
		
		document.getElementById("pmealbefore").classList.add("white");
		document.getElementById("pmealbefore").classList.add("pink-text");
		document.getElementById("pmealbefore").classList.remove("white-text");
		document.getElementById("pmealbefore").classList.remove("pink");
		
		
		
	}else{
		curAftermeal = picked;
		document.getElementById("pmealafter").classList.add("white");
		document.getElementById("pmealafter").classList.add("pink-text");
		document.getElementById("pmealbefore").classList.remove("white-text");
		document.getElementById("pmealbefore").classList.remove("pink");
		
		document.getElementById("pmealbefore").classList.add("white");
		document.getElementById("pmealbefore").classList.add("pink-text");
		document.getElementById("pmealbefore").classList.remove("white-text");
		document.getElementById("pmealbefore").classList.remove("pink");
		
		
	}
	
}

var searchedMed;
var dosageType = "";
function docaddToPrescription(){
	document.body.scrollTop = 0; 
	document.documentElement.scrollTop = 0; 
	var id = arridon;
	var consumeroute = document.getElementById("consumeroute").value;
	if(consumeroute == ""){
		consumeroute = "Not set";
	}
	var prescriptionremarks = document.getElementById("prescriptionremarks").value;
	
	var presciptiondosage = document.getElementById("presciptiondosage").value;
	if(presciptiondosage == "" || presciptiondosage === undefined){
		 presciptiondosage = "Dosage was not set for this item";
	}else{
		 presciptiondosage = presciptiondosage+' '+dosageType;
	}
	var intakeperday = document.getElementById("intakeperday").value;
	if(intakeperday == ""){
		intakeperday = "Not set";
	}
	var aftermeal = curAftermeal;
	var itemalreadyexist = false;
	for (i = 0; i < prescribedMed.length; i++) {
		if(searchedMed[id].name == prescribedMed[i].name){
			itemalreadyexist = true;
		}
	}
	if(itemalreadyexist == false){
		searchedMed[id].route = consumeroute;
		searchedMed[id].remark = prescriptionremarks;
		searchedMed[id].dosage = presciptiondosage;
		searchedMed[id].beforeafter = curAftermeal;
		searchedMed[id].intake = intakeperday;
		searchedMed[id].intaketiming = intakeTiming;
		prescribedMed.push(searchedMed[id]);
		renderPrescribedmed();
		console.log(prescribedMed);
		hide('searchmed');
		hide('dialydosage');
		show("docsessionview");
		document.getElementById("consumeroute").value = "";
		document.getElementById("prescriptionremarks").value = "";
		document.getElementById("presciptiondosage").value = "";
	}else{
		instaResponse("You already add this item to the patient prescription");
	}
}
var intakeTiming = {Morning:null, Afternoon:null, Evening:null, Night:null};
function pickintakeTiming(which){
	if(which == "Morning"){
		if(intakeTiming.Morning == true){
			intakeTiming.Morning = null;
			document.getElementById("intaketimeMorning").classList.remove("pink");
			document.getElementById("intaketimeMorning").classList.remove("white-text");
			document.getElementById("intaketimeMorning").classList.add("white");
			document.getElementById("intaketimeMorning").classList.add("pink-text");
			
			
		}else{
			intakeTiming.Morning = true;
			document.getElementById("intaketimeMorning").classList.add("pink");
			document.getElementById("intaketimeMorning").classList.add("white-text");
			document.getElementById("intaketimeMorning").classList.remove("white");
			document.getElementById("intaketimeMorning").classList.remove("pink-text");
			
		}
	}
	
	if(which == "Afternoon"){
		if(intakeTiming.Afternoon == true){
			intakeTiming.Afternoon = null;
			document.getElementById("intaketimeAfternoon").classList.remove("pink");
			document.getElementById("intaketimeAfternoon").classList.remove("white-text");
			document.getElementById("intaketimeAfternoon").classList.add("white");
			document.getElementById("intaketimeAfternoon").classList.add("pink-text");
		}else{
			intakeTiming.Afternoon = true;
			document.getElementById("intaketimeAfternoon").classList.add("pink");
			document.getElementById("intaketimeAfternoon").classList.add("white-text");
			document.getElementById("intaketimeAfternoon").classList.remove("white");
			document.getElementById("intaketimeAfternoon").classList.remove("pink-text");
		}
	}
	
	if(which == "Evening"){
		if(intakeTiming.Evening == true){
			intakeTiming.Evening = null;
			document.getElementById("intaketimeEvening").classList.remove("pink");
			document.getElementById("intaketimeEvening").classList.remove("white-text");
			document.getElementById("intaketimeEvening").classList.add("white");
			document.getElementById("intaketimeEvening").classList.add("pink-text");
		}else{
			intakeTiming.Evening = true;
			document.getElementById("intaketimeEvening").classList.add("pink");
			document.getElementById("intaketimeEvening").classList.add("white-text");
			document.getElementById("intaketimeEvening").classList.remove("white");
			document.getElementById("intaketimeEvening").classList.remove("pink-text");
		}
	}
	
	if(which == "Night"){
		if(intakeTiming.Night == true){
			intakeTiming.Night = null;
			document.getElementById("intaketimeNight").classList.remove("pink");
			document.getElementById("intaketimeNight").classList.remove("white-text");
			document.getElementById("intaketimeNight").classList.add("white");
			document.getElementById("intaketimeNight").classList.add("pink-text");
		}else{
			intakeTiming.Night = true;
			document.getElementById("intaketimeNight").classList.add("pink");
			document.getElementById("intaketimeNight").classList.add("white-text");
			document.getElementById("intaketimeNight").classList.remove("white");
			document.getElementById("intaketimeNight").classList.remove("pink-text");
		}
	}
	console.log(intakeTiming);
}

var sesmedstoreOwner = 0;
function initSearchMed(element){
	if(selectedpharma == 0){
		instaResponse("Please select a pharmacy first");
	}else{
		var searchfor = element.value;
		if(searchfor.length > 3){
			document.getElementById("docproductresult").innerHTML ='<li class="collection-item">Searching for "'+searchfor+'"</li>';
			var dataTopost = "api=1&auth_token=" + authUser.login_token + "&viewallproducts="+searchfor+"&pharmaid="+selectedpharma;
			var products = new XMLHttpRequest();
			products.open("POST", serverUrl, true);
			products.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
			products.onload = function() {
				if (products.status == 200) {
					var json = products.responseText;
					var response = JSON.parse(json);
					if(response.status == null){
						var i;
						document.getElementById("docproductresult").innerHTML ='';
						searchedMed = response;
						console.log(response);
						for (i = 0; i < response.length; i++) {
							var productdetail = JSON.stringify(response[i]);
							document.getElementById("docproductresult").innerHTML += '<li class="collection-item avatar" onclick="docaddToPrescriptionAmount('+i+', \''+response[i].name+'\', \''+response[i].picture+'\', \''+response[i].product_form+'\')"><img src="'+response[i].picture+'" alt="" class="circle"> <span="title">'+response[i].name+'</span><p>Stock: '+response[i].stock+' <span class="right">'+response[i].product_form+'</span></p></li>';
							sesmedstoreOwner = response[i].owner;
						}
					}else{
						document.getElementById("docproductresult").innerHTML ='<li class="collection-item">Cant find anything with the search term "'+searchfor+'"</li>';
					}
				   
				} else if (products.status == 404) {
					alert("Fail to connect to our server");
				} else {
					alert("Fail to connect to our server");
				}
			}
			products.send(dataTopost);
		}
	}
}

function backtoDiaog(){
	hide("sessionprescribemed");
	show("sessiondiagnose");
	hide("sessiondetail");
}
var clinicalNotedata = {"subjective":"", "objective":"", "assessment":"", "plan":""};
function cleanAll(content){
	var cleanedcontent = content;
	cleanedcontent = cleanedcontent.replace("&", "and");
	cleanedcontent = cleanedcontent.replace("=", "equal");
	cleanedcontent = cleanedcontent.replace("@", "at");
	cleanedcontent = cleanedcontent.replace("'", "");
	cleanedcontent = cleanedcontent.replace('"', '');
	return cleanedcontent;
	
}
function gotoprescribe(){
	clinicalNotedata.subjective = cleanAll(document.getElementById("cn_subjective").value);
	clinicalNotedata.objective = cleanAll(document.getElementById("cn_objective").value);
	clinicalNotedata.assessment = cleanAll(document.getElementById("cn_assessment").value);
	clinicalNotedata.plan = cleanAll(document.getElementById("cn_plan").value);
	console.log(clinicalNotedata);
	if(clinicalNotedata.subjective != "" && clinicalNotedata.objective != "" && clinicalNotedata.assessment != "" && clinicalNotedata.plan != ""){
		show("sessionprescribemed");
		hide("sessiondiagnose");
		hide("sessiondetail");
	}else{
		instaResponse("Please complete this form");
	}
}
function initDoctorActivation(){
	openpage("doctoractivation");
}

function showverifyOranizationform(){
	hide("varifyuserinformation");
	show("varifyuserorg");
}

function hideverifyOranizationform(){
	show("varifyuserinformation");
	hide("varifyuserorg");
}
function showVerificationformtype(element){
	var type = element.value;
	if(type == "N"){
		show("docismalaysian");
		hide("docisforeigner");
	}else{
		show("docisforeigner");
		hide("docismalaysian");
	}
}

function initDocdashboard(){
	var dataTopost = "api=1&auth_token=" + authUser.login_token + "&docdashboard=true";
    var users = new XMLHttpRequest();
    users.open("POST", serverUrl, true);
    users.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    users.onload = function(){
        if (users.status == 200){
            var json = users.responseText;
            var response = JSON.parse(json);
			var sessioncount = response.session_count
			var trustgate = authUser.approved_by_trustgate;
			if(authUser.doctor == "false"){
				if(authUser.verified_service_provider == "Approved"){
					openpage("universalserviceprovider");
				}else{
					openpage("serviceproviderselection");
				}
			}else if(authUser.doctor == "true"){
				var sessions = response.sessions;
				if(trustgate == "true"){
					openpage("universalserviceprovider");
					
				}else{
					initDoctorActivation();
				}
			}
            loadingResponse(response.message);
        } else if (users.status == 404) {
            alert("Fail to connect to our server");
        } else {
            alert("Fail to connect to our server");
        }
    }
    users.send(dataTopost);
}
function docinitChat(){
	openpage("chatcontent", doccurrentchatid, docwillcallid);
	
}
var doccurrentlyViewingthissession;
function rejectCall(){
	ConnectyCube.videochat.onRejectCallListener = function (session, userId, extension) {};
	hide("hascall");
}
function resetEndForm(){
	show("docsessionviewnav")
	document.getElementById("intaketimeAfternoon").classList.remove("pink");
	document.getElementById("intaketimeAfternoon").classList.remove("white-text");
	document.getElementById("intaketimeAfternoon").classList.add("white");
	document.getElementById("intaketimeAfternoon").classList.add("pink-text");

	document.getElementById("intaketimeMorning").classList.remove("pink");
	document.getElementById("intaketimeMorning").classList.remove("white-text");
	document.getElementById("intaketimeMorning").classList.add("white");
	document.getElementById("intaketimeMorning").classList.add("pink-text");

	document.getElementById("intaketimeEvening").classList.remove("pink");
	document.getElementById("intaketimeEvening").classList.remove("white-text");
	document.getElementById("intaketimeEvening").classList.add("white");
	document.getElementById("intaketimeEvening").classList.add("pink-text");

	document.getElementById("intaketimeNight").classList.remove("pink");
	document.getElementById("intaketimeNight").classList.remove("white-text");
	document.getElementById("intaketimeNight").classList.add("white");
	document.getElementById("intaketimeNight").classList.add("pink-text");
	clinicalNotedata = {"subjective":"", "objective":"", "assessment":"", "plan":""};
	intakeTiming = {Morning:null, Afternoon:null, Evening:null, Night:null};
	curAftermeal = "";
	dosageType = "";
	document.getElementById("cn_subjective").value = "";
	document.getElementById("cn_objective").value = "";
	document.getElementById("cn_assessment").value = "";
	document.getElementById("cn_plan").value = "";
	document.getElementById("presciptiondosage").value = "";
	prescribedMed = [];
}
function readyEnd(){
	if(authUser.verifying_for == "Doctor"){
		hide("clincalactionnondoctor");
		show("doctorsonlyclinicalnote");
	}else{
		show("clincalactionnondoctor");
		hide("doctorsonlyclinicalnote");
	}
	hide("sessiondetail");
	hide("docsessionviewnav");
	show("sessiondiagnose");
}


function docsessioncontroller(id){
	resetEndForm();
	if(authUser.provider_type == "Doctor"){
		show("clincalaction");
		hide("clincalactionnondoctor")
	}else{
		hide("clincalaction");
		show("clincalactionnondoctor")
	}
	hide("docvideocallbuttonpink");
	show("docvideocallbuttongrey");
	document.getElementById("videocallbutton").disabled = true;
	hide("sessionprescribemed");
	show("sessiondiagnose");
	show("sessiondetail");
	doccurrentlyViewingthissession = id;

	var dataTopost = "api=1&auth_token=" + authUser.login_token + "&docviewThischats="+id;
    var chats = new XMLHttpRequest();
    chats.open("POST", serverUrl, true);
    chats.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    chats.onload = function() {
        if (chats.status == 200) {
			console.log(authUser);
            var json = chats.responseText;
            var response = JSON.parse(json);
			console.log(response)
			
			doccurrentchatid = response.id;
			document.getElementById("doc_session_date").innerHTML = response.session_date;
			document.getElementById("doc_session_reason").innerHTML = response.session_reason;
			if(response.joborderid != 0){
				selectedpharma = response.storeid;
				console.log(selectedpharma);
			}
	
			
			
			if(authUser.id != response.owner_one){
				
				docwillcallid = response.owner_one;
				persontoCall = docwillcallid;
				var userinfo = response.owner_one_info;
				var tocall = userinfo.id_token;
				var userinfoone = response.owner_two_info;
				console.log(response.owner_one_info);
				var myid = userinfo.id_token;
				var opponentid = userinfoone.id_token;
				document.getElementById("doc_session_patient_detail").innerHTML = userinfo.full_name+' <br><span class="small grey-text">'+userinfo.age+' Year old '+userinfo.gender+'</span> ';
				document.getElementById("doc_session_patient_physical").innerHTML = 'Height: '+userinfo.height+' <span class="right">Weight: '+userinfo.weight+'</span>';
				document.getElementById("doc_session_patient_bp").innerHTML = userinfo.blood_group;
				document.getElementById("doc_session_patient_heartrate").innerHTML = userinfo.heart_rate;
				document.getElementById("mcfor").value = userinfo.full_name;
				document.getElementById("doc_session_profile_image").src = userinfo.profile_img;
				document.getElementById("vcindicatorname").innerHTML = userinfo.full_name;
				
			}else if(authUser.id != response.owner_two){
				docwillcallid = response.owner_two;
				var userinfo = response.owner_two_info;
				var tocall = userinfo.id_token;
				var userinfoone = response.owner_one_info;
				persontoCall = docwillcallid;
				var myid = userinfo.id_token;
				var opponentid = userinfoone.id_token;
				document.getElementById("doc_session_patient_detail").innerHTML = userinfo.full_name;
				document.getElementById("doc_session_profile_image").src = userinfo.profile_img;
			}
			var cb = { login: authUser.public_token, password: authUser.secret_token, opponentid: tocall };
			var cblogin =  JSON.stringify(cb);
			localStorage.setItem("cblogin", cblogin);					
            loadingResponse(response.message);
			show("docvideocallbuttonpink");
			hide("docvideocallbuttongrey");
			
			if(response.session_status == "Ended"){
				if(response.doctor == "true"){
					hide("sessionprescribemed");
					hide("sessiondiagnose");
					hide("sesaction");
					show("sessionsummary");
					hide("sessionsummarynotdoc");
					document.getElementById("docdiagnosecontent").innerHTML = response.diagnose;
					document.getElementById("docclinicalcontent").innerHTML = '<a href="#!" onclick="openPdfFile(\''+response.signedclinicalnote+'\')">View</a>';
					document.getElementById("docprescribedmedcert").innerHTML = '<a href="#!" onclick="openPdfFile(\''+response.signedpres+'\')">View</a>';
					var i;
					
					document.getElementById("endprescripion").innerHTML ="";
					if(response.prescription == "None"){
						hide("toprescribeornot");
					}else{
						var ppe = JSON.parse(response.prescription);
						console.log(ppe);
						console.log(ppe.length);
						for (i = 0; i < ppe.length; i++) {
								document.getElementById("endprescripion").innerHTML += '<li class="collection-item avatar"><img src="'+ppe[i].picture+'" alt="" class="circle"> <span="title">'+ppe[i].name+'</span><p>Stock: '+ppe[i].stock+'</p></li>';
						}
						show("toprescribeornot");
					}
					
					
					
					if(response.mcdata == "None"){
						document.getElementById("docmc").innerHTML = "Not set";
					}else{
						document.getElementById("docmc").innerHTML = '<a onclick="openPdfFile(\''+response.signedmc+'\')" href="#!" class="strong">View</a>';
					}
					if(response.referto == "None"){
						document.getElementById("docrefer").innerHTML = "Not set";
					}else{
						
						document.getElementById("docrefer").innerHTML = '<a href="#!" class="strong" onclick="openPdfFile(\''+response.signedrefer+'\')">View</a>';
					}
					if(response.sppaid == "true"){
						document.getElementById("docpaid").innerHTML = "This session has been paid by user. Please check your wallet for confirmation";
						
					}else{
						document.getElementById("docpaid").innerHTML = "Waiting for the patient to make payment";
					}
				}else{
					hide("toprescribeornot");
					document.getElementById("notdocdiagnosecontent").innerHTML = response.diagnose;
					document.getElementById("notdocclinicalcontent").innerHTML = response.signedclinicalnote;
					var clinicalNotetorender = JSON.parse(response.clincalNote);
					var customerAssesment = '<div class="card" style="border-radius: 8px"><div class="card-content" style="padding:15px"><p class="strong pink-text">Assessment </p><p >'+clinicalNotetorender.assessment+'</p></div></div>';
					
					var customerObjective = '<div class="card" style="border-radius: 8px"><div class="card-content" style="padding:15px"><p class="strong pink-text">Objective</p><p class="small" style="margin-top: 0px;">General, vital signs, clinical findings, fluid balance, investigations</p><p >'+clinicalNotetorender.objective+'</p></div></div>';
					var customerSubjective = '<div class="card" style="border-radius: 8px"><div class="card-content" style="padding:15px"><p class="strong pink-text">Subjective</p><p class="small" style="margin-top: 0px;">Underlying diseases, chief complaints</p><p >'+clinicalNotetorender.subjective+'</p></div></div>';
					
					var customerPlan = '<div class="card" style="border-radius: 8px"><div class="card-content" style="padding:15px"><p class="strong pink-text">Plan</p><p class="small" style="margin-top: 0px;">Futher treatment, investigation</p><p>'+clinicalNotetorender.plan+'</p></div></div>';
					document.getElementById("notdocclinicalcontent").innerHTML = customerSubjective;
					document.getElementById("notdocclinicalcontent").innerHTML += customerObjective;
					document.getElementById("notdocclinicalcontent").innerHTML += customerAssesment;
					document.getElementById("notdocclinicalcontent").innerHTML += customerPlan;
					
					if(response.referto == ""){
						document.getElementById("notdocreferdata").innerHTML = "You didnt refer this customer to anyone";
					}else{
						document.getElementById("notdocreferdata").innerHTML = response.referto;
					}
					
					hide("sessionprescribemed");
					hide("sessiondiagnose");
					hide("sesaction");
					hide("sessionsummary");
					show("sessionsummarynotdoc");
				}
			}else{
				hide("sessionsummary");
				hide("sessiondiagnose");
				hide("sessionsummarynotdoc");
				show("sesaction");
			}
        } else if (chats.status == 404) {
            alert("Fail to connect to our server");
        } else {
            alert("Fail to connect to our server");
        }
    }
    chats.send(dataTopost);
}


function initDocsession(){
		clearTimeout(chatCheck);
		chatisActive = false;
		addPreloader("docsessionlistingcontent");
		var dataTopost = "api=1&auth_token="+authUser.login_token+"&chatlist=true";
		var xhr = new XMLHttpRequest();
		xhr.open("POST", serverUrl, true);
		xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
		xhr.onload = function() {
			if (xhr.status == 200) {
				var json = xhr.responseText;
				var response = JSON.parse(json);
				if(response.status == null){
					document.getElementById("docsessionlistingcontent").innerHTML = "";
					var i;
					for (i = 0; i < response.length; i++) {
						if(response[i].owner_one == authUser.id){
							var profileId = response[i].owner_two; 
						}else{
							var profileId = response[i].owner_one; 
						}
						
						if(response[i].archive != "true"){
								
								document.getElementById("docsessionlistingcontent").innerHTML += '<li class="collection-item avatar pink-session" ><a href="#!" onclick="openpage(\'docsessionview\', '+response[i].id+', '+profileId+')"><img src="'+response[i].profile_picture+'" alt="" class="circle" ></a><a href="#!" onclick="openpage(\'docsessionview\', '+response[i].id+', '+profileId+')"><span class="title black-text" onclick="openpage(\'docsessionview\', '+response[i].id+', '+profileId+')"><b>'+response[i].fullname+'</b></span></a><a href="#!" onclick="openpage(\'docsessionview\', '+response[i].id+', '+profileId+')"><p class="grey-text xs" onclick="openpage(\'docsessionview\', '+response[i].id+', '+profileId+')">'+response[i].latest_message+' '+response[i].archive+'</p></a><a href="#!" class="secondary-content" onclick="deleteChat('+response[i].id+')"><i class="material-icons pink-text">delete</i></a></li>';
						}
					}
				}else{
					document.getElementById("docsessionlistingcontent").innerHTML = '<li class="collection-item" style="border: 0px"><center><br/><i class="large material-icons pink-text">assignment_late</i><p class="pink-text strong">No session</p><p class="grey-text">You have no session with any patient</p></center></li>';
				}
				
			} else if (xhr.status == 404) {
				alert("Fail to connect to our server");
			} else {
				alert("Fail to connect to our server");
			}
		}
		xhr.send(dataTopost);
}

function initDashboard(){
	
}

function turnOnDoc(){
		showLoading();
		if(authUser.availability == "Off"){
			var com = "On";
		}else if(authUser.availability == "On"){
			var com = "Off";
		}else{
			var com = "On";
		}
		var dataTopost = 'api=1&auth_token='+authUser.login_token+"&turnOnDoctor="+com;
		var xhr = new XMLHttpRequest();
		xhr.open("POST", serverUrl, true);
		xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
		xhr.onload = function() {
			if (xhr.status == 200) {
				var json = xhr.responseText;
				var response = JSON.parse(json);
				loadingResponse(response.message);
				authUser.availability = response.availability;
				if(response.availability == "On"){
					document.getElementById("buttonOn").classList.remove("pink-text");
					document.getElementById("buttonOn").classList.add("green-text");
				}else{
					document.getElementById("buttonOn").classList.remove("green-text");
					document.getElementById("buttonOn").classList.add("pink-text");
				}
				
				
			} else if (xhr.status == 404) {
				alert("Fail to connect to our server");
			} else {
				alert("Fail to connect to our server");
			}
		}
		xhr.send(dataTopost);
}

function checkRequest(){


}

function checkTextArea(elem){
	var textareaheight = elem.style.height;
	console.log(textareaheight);
	textareaheight = '180px';
	elem.style.height = "200px";
	console.log(elem.id);
	if(elem.id == "cn_subjective"){
		document.getElementById("cn_objective").style.height = "45px";
		document.getElementById("cn_assessment").style.height = "45px";
		document.getElementById("cn_plan").style.height = "45px";
	}else if(elem.id == "cn_objective"){
		document.getElementById("cn_subjective").style.height = "45px";
		document.getElementById("cn_assessment").style.height = "45px";
		document.getElementById("cn_plan").style.height = "45px";
	}else if(elem.id == "cn_assessment"){
		document.getElementById("cn_objective").style.height = "45px";
		document.getElementById("cn_subjective").style.height = "45px";
		document.getElementById("cn_plan").style.height = "45px";
	}else if(elem.id == "cn_plan"){
		document.getElementById("cn_objective").style.height = "45px";
		document.getElementById("cn_assessment").style.height = "45px";
		document.getElementById("cn_subjective").style.height = "45px";
	}
}