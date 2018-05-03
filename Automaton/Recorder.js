var gameFrames = [];

var imgType = "";

var recordIter = 0;

var autoplay = true;

var iterFrame = 0;

var videoPassed = false;

var actualEncoder = new Whammy.Video();

var beforePlayingVideo = "";

var downloading = false;

function startRecording(){
	recording = true;
}

function stopRecording(){
	recording = false;
}

function recordLoop(){
	
	recordIter++;
	
	var base64 = canvas.toDataURL("image/png");
	if(shouldStream){//recordIter is to only send each 3 iterations an image
		$.post("../ajax.php",{cmd: "updateImage", base64: base64},function(res){
		
		});
	}
	gameFrames.push(base64);
}

function finishedLoop(){ //will be called when stop = true
		
	autoplay = false;
	videoPassed = false;
	iterFrame = 0;
	
	console.log("end");
		
	var toolsDiv = document.getElementById("tools");
	var canvas = document.getElementById("c");
	var content = document.getElementById("content");
	
	toolsDiv.innerHTML = 
	"<input orient='vertical' type='range' id='fpsskip' class='range' value=1 min=1 max=50></input> "+
	"  <input orient='vertical' type='range' id='fps' class='range' value=20 min=1 max=1000></input>"+
	"  FPS MULTIPLIER: <span id='fpsskipspan'></span> "+
	"  FPS <span id='fpsspan'></span> "+
	"  <div class='bar'><div class='progress' id='progress'></div></div>";
	//<button id='playstopbutton' onclick='autoplay = !autoplay;'>Stop</button>
	
	
	var buttonContinue = document.createElement("BUTTON");
	buttonContinue.innerHTML = "Back";
	buttonContinue.onclick = continueToVideo;
	toolsDiv.appendChild(buttonContinue);
	
	var buttonContinue = document.createElement("BUTTON");
	buttonContinue.innerHTML = "Download";
	buttonContinue.onclick = function(){downloadVideo();};
	toolsDiv.appendChild(buttonContinue);
	
	var videotime = document.getElementById("videotime");
	
	videotime.max = (gameFrames.length-1);
	
	var videoControls = document.getElementById("videocontrols");
	
	videoControls.style.display = "block";
	
	"<input type='range' id='videotime' class='range videoControl' value=1 min=0 max="+(gameFrames.length-1)+"></input>";
	
	iterateThroughVideo();
	
	canvas.style.display = "none";
	content.style.display = "block";
		
}

function togglePlay(){
	
	var elm = document.getElementById("pauseplaybutton");
	
	autoplay = !autoplay;
	
	if(autoplay){
		
		elm.src = "./images/pause.png";
		
	}else{
		
		elm.src = "./images/play.png";
		
	}
	
}

function playVideo(){
	
	//beforePlayingVideo = document.body.innerHTML;
	
	stopped = true;
	
	//document.body.innerHTML = "<center><h1>Loading video...</h1></center>";
	setTimeout(function(){
		
		
		
		/*setTimeout(function(){
			
			
			
			document.body.innerHTML = 
			"<link rel='stylesheet' href='style.css'></link>"+
			"<span id='fpsskipspan'>Fps to skip</span> <input orient='vertical' type='range' id='fpsskip' class='range' value=1 min=1 max=50></input> "+
			"  <span id='fpsspan'>Fps</span>: <input orient='vertical' type='range' id='fps' class='range' value=1 min=1 max=100></input>"+
			"  <span id='videotimespan'>Time control: </span>: <input type='range' id='videotime' class='range' value=1 min=0 max="+(gameFrames.length-1)+"></input>"+
			"  <button id='playstopbutton' onclick='autoplay = !autoplay;' style='margin-left:5px;margin-right:5px;'>Stop</button>"+
			"<div id='content'></div>";
			iterateThroughVideo();
		},2000);*/
	},100);
	
}

function setIterFrame(f){
	
	var elm = document.getElementById("videotime");
	
	elm.value = f;
	
	iterFrame = f;
	
}

function getIterFrame(){
	
	var elm = document.getElementById("videotime");
	
	return parseInt(elm.value);
	
}

function iterateThroughVideo(){

	var content = document.getElementById("content");

	if(iterFrame >= gameFrames.length){
		
		iterFrame = gameFrames.length;
		
		togglePlay();
		
		if(!videoPassed){
			videoPassed = true;
		}
		
	}
	var fpsElm = document.getElementById("fps");
	var fpsSpanElm = document.getElementById("fpsspan");
	var fpsskipElm = document.getElementById("fpsskip");
	var fpsskipSpanElm = document.getElementById("fpsskipspan");
	var videotimeElm = document.getElementById("videotime");
	var videotimeSpanElm = document.getElementById("videotimespan");
	var playstopbuttonElm = document.getElementById("playstopbutton");
	var wait_time;
	if(autoplay){
		wait_time = 1000/parseInt(fpsElm.value);
	}else{
		wait_time = 1000/60;
	}
	
	content.innerHTML = "<img src='"+gameFrames[iterFrame]+"' id='video' style='width:100%;height:100%;' />";
	
	fpsskipSpanElm.innerHTML = parseInt(fpsskipElm.value);
	fpsSpanElm.innerHTML = parseInt(fpsElm.value);
	videotimeSpanElm.innerHTML = iterFrame+"/"+(gameFrames.length-1);
	
	if(imgType == "webp" && !videoPassed){
		actualEncoder.add(gameFrames[iterFrame],wait_time | 50);
	}
	
	if(autoplay){
		videotimeElm.value = iterFrame;
		iterFrame += parseInt(fpsskipElm.value);
		//playstopbuttonElm.innerHTML = "Stop";
		
		
	}else{
		iterFrame = parseInt(videotimeElm.value);
		wait_time = 1000/60;
		//playstopbuttonElm.innerHTML = "Play";
	}
	
	if(stopped && !downloading){
	
		setTimeout(iterateThroughVideo, wait_time);
	
	}
}

function continueToVideo(){
	
	gobackToSimul();
}

var wait;
var renderedVideoLink;
var bar;

function downloadVideo(){
	
	downloading = true;
	
	renderedVideoLink = document.getElementById("renderedVideo");
	
	if(renderedVideoLink != null){	
		renderedVideoLink.parentNode.removeChild(renderedVideoLink);
	}
	
	bar = document.getElementById("progress").parentNode;
	bar.style.display = "inline-block";
	
	actualEncoder = new Whammy.Video();

	var speed = prompt("Frames Per Second");
	
	if(speed == ""){
		
		speed = 20;
		 
	}
	
	wait = 1000/parseInt(speed);
	
	setTimeout(function(){iterateThroughPhotosToCreateVideo(0)},100);
	
}

function iterateThroughPhotosToCreateVideo(actualIndex){
	
	if(actualIndex == gameFrames.length-1){//if we have reached the end of the frames
		
		actualEncoder.compile(false,function(output){//compile the video
			var url = (window.webkitURL || window.URL).createObjectURL(output);
			bar.style.display = "none";
			
			var toolsDiv = document.getElementById("tools");
			
			toolsDiv.innerHTML = toolsDiv.innerHTML + "<a id='renderedVideo' href='"+url+"' download>Download</a>";
			
			downloading = false;
		});
		
		
		iterateThroughVideo();
		
		return;
		
	}
	
	var tempCanvas = document.createElement("canvas");
		
	tempCanvas.style.backgroundColor = "white";

	tempCanvas.width = canvas.width;
	tempCanvas.height = canvas.height;	
	
	var tempCtx = tempCanvas.getContext("2d");
						
	var img = new Image();
									
	img.onload = function(){	//wait for the image to load
		tempCtx.drawImage(img,0,0,tempCanvas.width,tempCanvas.height);
		
		var webphoto = tempCanvas.toDataURL("image/webp");
		content.innerHTML = "<img src='"+webphoto+"' id='video' style='width:100%;height:100%;' />";
		actualEncoder.add(webphoto,50);
		
		actualIndex++;
		
		iterateThroughPhotosToCreateVideo(actualIndex);
	};

	img.src = gameFrames[actualIndex];
}

function gobackToSimul(){
	
	stopped = false;

	canvas.style.display = "block";
	content.style.display = "none";
	
	var toolsDiv = document.getElementById("tools");
	
	toolsDiv.innerHTML = "";
	
	toolsDiv.style.marginTop = "-100px";
	
	var vidButton = document.createElement("BUTTON");
	//vidButton.style.position = "absolute";
	vidButton.style.marginLeft = "0px";
	vidButton.innerHTML = "View history";
	
	vidButton.setAttribute("onclick","playVideo();");
	toolsDiv.appendChild(vidButton);
	
	var videoControls = document.getElementById("videocontrols");
	
	videoControls.style.display = "none";
	
	loop();
	
}