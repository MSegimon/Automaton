

var toolsDiv = document.getElementById("tools");
canvas.addEventListener("contextmenu",point);
canvas.addEventListener("mousemove",pointDrag);

////////////////////////////////////////////////////////////////ADD TEMPLATE CHOOSER START/////////////////////////////////////

var imgSelector = document.createElement("SELECT");
imgSelector.onchange = function(evt){
	if(imgSelector.selectedIndex > 0){	
		changeBackground(imgSelector.selectedIndex-1);
	}else{
		ctx.clearRect(0,0,canvas.width,canvas.height);
	}
	
};

var customOption = document.createElement("OPTION");
customOption.innerHTML = "Custom";

imgSelector.appendChild(customOption);

for(var index in allTemplates){
	var fname = allTemplates[index].name;
	var templateOption = document.createElement("OPTION");
	templateOption.innerHTML = fname.split(".")[0];
	
	imgSelector.appendChild(templateOption);
}

toolsDiv.appendChild(imgSelector);


if(allTemplates[allTemplates.length-1].custom){
	
	changeBackground(allTemplates.length-1);
	
}

////////////////////////////////////////////////////////////////ADD TEMPLATE CHOOSER END/////////////////////////////////////



////////////////////////////////////////////////////////////////GET SELECTED IMAGE START///////////////////////////////////


var base64Selected = getParam("base64");
var nameSelected = getParam("name");

if(base64Selected != "" && nameSelected != ""){
	allTemplates.push({base64: base64Selected, name: name});
}

////////////////////////////////////////////////////////////////GET SELECTED IMAGE END///////////////////////////////////
var firstStage = true;

if(shouldStream){
	streamMapMaking();
}

ctx.fillStyle = "#ffffff";
ctx.fillRect(0,0,canvas.width,canvas.height);

var px = -1;
var py = -1;

var imgBg;

var selectedStrength = 20;

var totalAdded = 0;

var editing = true;

var sizeMod = 2;

var drawType = 0;

function pointDrag(evt){
	
	if(mouseDown && firstStage){
		
		if(drawType == 0) ctx.fillStyle = "#000000";
		if(drawType == 1) ctx.fillStyle = "#ffffff";
		
		var size = pixelSize*sizeMod;
		var x = parseInt(evt.clientX/size)*size;
		var y = parseInt(evt.clientY/size)*size;
		
		ctx.fillRect(x,y,size,size);
		
	}
	
}

function point(evt){
	
	evt.preventDefault();
	
	if(firstStage){
	
		if(px == -1 || py == -1){
			px = evt.clientX;
			py = evt.clientY;
			ctx.fillStyle = "#ff0000";
			ctx.fillRect(px-2,py-2,4,4);
		}else{
			ctx.clearRect(px-2,py-2,4,4);
			ctx.fillStyle = "#000000";
			ctx.fillRect(px,py,evt.clientX-px,evt.clientY-py);
			px = -1;
			py = -1;
		}
	
	}
}

function addColony(x,y,colony){
	if(ctx.getImageData(x,y,1,1) != [0,0,0,255]){
		createPixel(new pixel(parseInt(x/pixelSize),parseInt(y/pixelSize),colony,selectedStrength));
		
		for(x = 0; x < width; x++){
   
			for(y = 0; y < height; y++){
				var pixelI = pixelMatrix[x][y];
				if(pixelI!=null){
					
					pixelI.render(true);
				}
			}
		}
		
		totalAdded++;
	}
}

function removeColony(colorId){
		
	var nx = -1;
	var ny = -1;
	var x,y = 0;
	for(x = 0; x < width; x++){

		for(y = 0; y < height; y++){
			var pixelI = pixelMatrix[x][y];
			if(pixelI!=null){
				
				if(pixelI.colony == colorId){
					
					nx = x;
					ny = y;
				}
			}
		}
	}
	if(nx != -1 && ny != -1){
		pixelMatrix[nx][ny] = null;
		ctx.clearRect(0,0,canvas.width,canvas.height);
		ctx.drawImage(imgBg,0,0);
		totalAdded--;
	}
	
	
	for(x = 0; x < width; x++){

		for(y = 0; y < height; y++){
			var pixelI = pixelMatrix[x][y];
			if(pixelI!=null){
				
				pixelI.render(true);
			}
		}
	}
	
}

function addColonies(actualButton,evt){
	
	
	toolsDiv.innerHTML = "";
	
	firstStage = false;
	
	var imgBase64 = canvas.toDataURL("image/png");
	
	imgBg = new Image();
	
	imgBg.onload = function(){ //ONLY PROCCEED IF THE IMAGE(TEMPLATE) IS LOADED
		if(!shouldStream){
		
		//IF OFFLINE MODE
		var startSimulButton = document.createElement("BUTTON");
		startSimulButton.style.marginLeft = "0px";
		startSimulButton.innerHTML = "Start Simulation";
		startSimulButton.onclick = function(evt){
			startSimul();
			evt.stopPropagation();
		};
		toolsDiv.insertBefore(startSimulButton,null);
		
		var backButton = document.createElement("BUTTON");
		backButton.innerHTML = "Back";
		backButton.onclick = function(evt){
			backToWalls();
			evt.stopPropagation();
		};
		toolsDiv.appendChild(backButton);
		
		
		canvas.addEventListener("click",addCell);
		
		for(ccolor = colonyColors.length-1; ccolor > -1; ccolor--){
			
			var currentButton = document.createElement("BUTTON");
			
			currentButton.innerHTML = "Colony " + ccolor;
			
			currentButton.id = ccolor;
			
			currentButton.onclick = function(evt){
				console.log(this.id);
				
				selected = this.id;
				evt.stopPropagation();
			};
			
			toolsDiv.insertBefore(currentButton,backButton.nextSibling);
			
		}
		
		/*var redColony = document.createElement("BUTTON");
		redColony.innerHTML = "Add red cells";
		redColony.onclick = function(evt){
			selected = 0;
			evt.stopPropagation();
		};
		toolsDiv.insertBefore(redColony,startSimulButton.nextSibling);
		
		var greenColony = document.createElement("BUTTON");
		greenColony.innerHTML = "Add green cells";
		greenColony.onclick = function(evt){
			selected = 1;
			evt.stopPropagation();
		};
		

		toolsDiv.insertBefore(greenColony,redColony.nextSibling);
		
		var blueColony = document.createElement("BUTTON");
		blueColony.innerHTML = "Add blue cells";
		blueColony.onclick = function(evt){
			selected = 2;
			evt.stopPropagation();
		};
		toolsDiv.insertBefore(blueColony,greenColony.nextSibling);*/

		var strengthSelector = document.createElement("INPUT");
		strengthSelector.type = "number";
		strengthSelector.placeholder = "Strength of the cell(20 - 100000). Default: 20";
		strengthSelector.onkeyup = function(evt){
			selectedStrength = Math.min(Math.max(this.value, 20), 100000);
			this.value = Math.min(Math.max(this.value, 20), 100000);
			evt.stopPropagation();
		};
		toolsDiv.insertBefore(strengthSelector,backButton.nextSibling);
		
		/*var webpOption = document.createElement("OPTION");
		webpOption.innerHTML = "webp";
		
		imgSelector.appendChild(pngOption);
		imgSelector.appendChild(webpOption);
		*/
		}else{
			//ONLINE MODE: yay!
			console.log("ONLINE MODE");
			
			checkPixelPositions();
			var startSimulButton = document.createElement("BUTTON");
			startSimulButton.style.marginLeft = "0px";
			startSimulButton.innerHTML = "Start Simulation";
			startSimulButton.onclick = function(evt){
				startSimul();
				evt.stopPropagation();
			};
			toolsDiv.insertBefore(startSimulButton,null);
			
		}
	};
	imgBg.src = imgBase64;
	
}


function streamMapMaking(){
	
	var base64 = canvas.toDataURL("image/png");
	
	
	if(shouldStream && firstStage){
		setTimeout(streamMapMaking,100);
	}
}

function checkPixelPositions(){
	
	
	var base64 = canvas.toDataURL("image/png");
	
	if(shouldStream && editing){
		setTimeout(checkPixelPositions,150);
	}
}


function changeBackground(mapIndex){
	var base64 = allTemplates[mapIndex].fileContents;
	
	var bg = new Image();
	
	bg.onload = function(){	
	
		var startingRatio = bg.width/bg.height;
		var startingRatioAlt = bg.height/bg.width;

		if(bg.width >= canvas.width){
			bg.width = canvas.width;
			bg.height = bg.width/startingRatio;
		}else{
			bg.height = canvas.height;
			bg.width = startingRatio*bg.height;
		}
		
		if(bg.height > canvas.height){
			
			bg.height = canvas.height;
			bg.width = bg.height / startingRatioAlt;
			
		}
		
		ctx.clearRect(0,0,canvas.width,canvas.height);
		ctx.drawImage(bg,0,0,bg.width,bg.height);
	};
	
	bg.src = base64;
	
}

function backToWalls(){
	
	var toolsDiv = document.getElementById("tools");
	
	firstStage = true;
	
	toolsDiv.innerHTML = "<button style='margin-left:0;' onclick='addColonies(this,event);event.stopPropagation();'>Next Step</button><button onclick='drawType=1;event.stopPropagation();'>Destroy</button><button onclick='drawType=0;event.stopPropagation();'>Place</button>";
	
}



var selected = -1;

function addCell(evt){
	
	if(selected != -1 && !firstStage){
		addColony(evt.clientX,evt.clientY,selected);
	}
	
}

function addRed(evt){
	addColony(evt.clientX,evt.clientY,0)
}

function addGreen(evt){
	addColony(evt.clientX,evt.clientY,1);
}

function addBlue(evt){
	addColony(evt.clientX,evt.clientY,2);
}

function startSimul(){
	
	
	
	selected = -1;
	
	if(totalAdded > 0){
		
		var toolsDiv = document.getElementById("tools");
		
		toolsDiv.innerHTML = "";
		toolsDiv.style.marginTop = "-100px";
		
		canvas.removeEventListener("click",point);
		
		editing = false;
		
		init();
	}else{
		alert("You need to add at least 1 colony!");
	}
}