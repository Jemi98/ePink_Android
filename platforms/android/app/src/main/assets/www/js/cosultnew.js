function initConsult(){
	window.scrollTo({ top: 0, behavior: 'smooth' });
}

var timeIDs=[
	"9to10Am",
	"10to11Am",
	"11to12pm",
	"12to01pm",
	"01pmto02pm",
	"02pmto03pm",
	"03pmto04pm",
	"04pmto05pm",
	"05pmto06pm",
	"06pmto07pm",
	"07pmto08pm",
	"08pmto09pm",
	"09pmto10pm",
	"10pmto11pm",
	"11pmto12am",
];

var time=[
	"09:00:00",
	"10:00:00",
	'11:00:00',
	"12:00:00",
	'13:00:00',
	"14:00:00",
	'15:00:00',
	"16:00:00",
	'17:00:00',
	"18:00:00",
	"19:00:00",
	"20:00:00",
	"21:00:00",
	"22:00:00",
	"23:00:00",
]

var hours=[
	9,
	10,
	11,
	12,
	13,
	14,
	15,
	16,
	17,
	18,
	19,
	20,
	21,
	22,
	23
]


var dtToday = new Date();

var month = dtToday.getMonth() + 1;
var day = dtToday.getDate();
var year = dtToday.getFullYear();
if(month < 10)
	month = '0' + month.toString();
if(day < 10)
	day = '0' + day.toString();

var minDate = year + '-' + month + '-' + day;

document.getElementById("condate").setAttribute("min",minDate);

function checkTime(){
	console.log("test");
	resetButtons();
if(event.target.value === minDate){
	var hour =dtToday.getHours();
	if(hour>8){
		for (var i=0;i<hours.length;i++){
			if(hour>=hours[i]){
				document.getElementById(timeIDs[i]).classList.add("white");
				document.getElementById(timeIDs[i]).classList.add("grey-text");
				document.getElementById(timeIDs[i]).classList.remove("pink-text");
				document.getElementById(timeIDs[i]).classList.remove("pink");
				document.getElementById(timeIDs[i]).classList.remove("white-text");
				document.getElementById(timeIDs[i]).removeAttribute("onclick");
			}else {
				break;
			}
		}
	}
}

}

var cTime = '';
function setPreferedtime(selectedtime){
	for(var i=0;i<timeIDs.length;i++){
		if(selectedtime === timeIDs[i]){
			cTime=time[i];
			document.getElementById(selectedtime).classList.remove("white");
			document.getElementById(selectedtime).classList.remove("pink-text");
			document.getElementById(selectedtime).classList.add("pink");
			document.getElementById(selectedtime).classList.add("white-text");
		}else{
			document.getElementById(timeIDs[i]).classList.add("white");
			document.getElementById(timeIDs[i]).classList.add("pink-text");
			document.getElementById(timeIDs[i]).classList.remove("pink");
			document.getElementById(timeIDs[i]).classList.remove("white-text");
		}
	}

}

function reQuestConsult(){
	var cDate = document.getElementById("condate").value;
	var cProblem = document.getElementById("cProblem").value;
	var cTime = cTime;
	alert(cDate, cProblem, cTime);
}

function resetButtons(){
	for (var i=0;i<timeIDs.length;i++){
		document.getElementById(timeIDs[i]).classList.add("white");
		document.getElementById(timeIDs[i]).classList.remove("grey-text");
		document.getElementById(timeIDs[i]).classList.add("pink-text");
		document.getElementById(timeIDs[i]).classList.remove("pink");
		document.getElementById(timeIDs[i]).classList.remove("white-text");
		document.getElementById(timeIDs[i]).setAttribute("onclick",`setPreferedtime('${timeIDs[i]}')`);
	}
}