var imageCapture;
let camera_button = document.querySelector("#start-camera");
let video = document.querySelector("#canvasvideo");
let start_button = document.querySelector("#start-record");
let stop_button = document.querySelector("#stop-record");
let take_photo_button = document.querySelector("#take-photo");
let download_link = document.querySelector("#download-video");

let camera_stream = null;
let media_recorder = null;
let blobs_recorded = [];

camera_button.addEventListener('click', async function() {
   	try {
    	camera_stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
    }
    catch(error) {
    	alert(error.message);
    	return;
    }
    video.srcObject = camera_stream;
	const track = camera_stream.getVideoTracks()[0];
    imageCapture = new ImageCapture(track);
    camera_button.style.display = 'none';
    video.style.display = 'block';
    start_button.style.display = 'none';
	stop_button.style.display = 'none';
	download_link.style.display = 'none';
});


function startCamera() {
 

}
start_button.addEventListener('click', function() {
    media_recorder = new MediaRecorder(camera_stream, { mimeType: 'video/webm' });

    media_recorder.addEventListener('dataavailable', function(e) {
    	blobs_recorded.push(e.data);
    });

    media_recorder.addEventListener('stop', function() {
    	let video_local = URL.createObjectURL(new Blob(blobs_recorded, { type: 'video/webm' }));
    	download_link.href = video_local;

        stop_button.style.display = 'none';
        download_link.style.display = 'block';
    });

    media_recorder.start(1000);

    start_button.style.display = 'none';
    stop_button.style.display = 'none';
});

take_photo_button.addEventListener('click', function() {
  imageCapture.takePhoto().then(blob => { 
		var reader = new FileReader();
		reader.readAsDataURL(blob); 
		reader.onloadend = function() {
		  var base64data = reader.result;                
		  console.log(base64data);
		  document.getElementById("video").style.display = "none";
		  document.getElementById("facetracker").style.display = "none";
		  document.getElementById("take-photo").style.display = "none";
		  document.getElementById("takenphoto").src = base64data;
		  document.getElementById("takenphoto").style.display = "block";
		  document.getElementById("retry").style.display = "block";
		  document.getElementById("upload").style.display = "block";
		} } )
});


stop_button.addEventListener('click', function() {
	media_recorder.stop(); 
});
function startCanvascam(){
	if(isondevice == true){
		startCordovamedia();
	}else{
		document.getElementById("start-camera").click();
	}

}

function startCordovamedia(){
	  navigator.mediaDevices.getUserMedia(
		{
		  video: {}
		},
		stream => (video.srcObject = stream),
		err => console.log(err)
	  );
}