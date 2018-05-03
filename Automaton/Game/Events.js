

canvas.addEventListener("contextmenu",function(evt){
	
	evt.preventDefault();
	
	if(editing){
	
		pixelMatrix[parseInt(evt.offsetX/pixelSize)][parseInt(evt.offsetY/pixelSize)] = null;
		
		ctx.clearRect(parseInt(evt.offsetX/pixelSize),parseInt(evt.offsetY/pixelSize),pixelSize,pixelSize);
		
		console.log(parseInt(evt.offsetX/pixelSize));
		console.log(parseInt(evt.offsetY/pixelSize));
		
	}
	
});
		
document.body.addEventListener("mousemove",function(evt){
	
	mouseX = evt.clientX;
	mouseY = evt.clientY;
	
});

document.body.addEventListener("mousedown",function(evt){
	
	mouseDown = true;
	
});



document.body.addEventListener("mouseup",function(evt){
	
	mouseDown = false;
	
});

document.body.addEventListener("keydown",function(evt){
	
	console.log(evt.key);
	
	
});

window.addEventListener("beforeunload",function(evt){
	$.post("../ajax.php",{cmd: "deleteMatch"},function(res){
	});
});

document.body.addEventListener("keyup",function(evt){
	
	//console.log(evt.key);
	
	if(stopped){
	
		if(evt.key == " "){
			
			if(getIterFrame() >= gameFrames.length-1){
				
				setIterFrame(0);
				
			}
			
			togglePlay();
			
		}
		
		if(evt.key == "ArrowRight"){
			
			if(iterFrame < gameFrames.length-1){
			
				if(autoplay){
					
					setIterFrame(getIterFrame()+5);
					
				}else{
					
					setIterFrame(getIterFrame()+1);
					
				}
				
			}
			
		}
		
		if(evt.key == "ArrowLeft"){
			
			if(iterFrame > 0){
			
				setIterFrame(getIterFrame()-1);
				autoplay = false;
				
			}
			
		}
	
	}else{
		
		if(evt.key == "r" && shouldStream){
		
			shouldRender = !shouldRender;
			
		}
		
		if(evt.keyCode == 79){
			
			optimizeMode = !optimizeMode;
			
		}
		
	}
	
	if(evt.key == "Enter" || evt.key == "d"){
		
		var toolsDiv = document.getElementById("tools");
		
		if(toolsDiv.style.marginTop == "-100px"){
			
			toolsDiv.style.marginTop = "0px";
			
		}else{
			
			toolsDiv.style.marginTop = "-100px";
			
		}
		
		console.log(toolsDiv.style.display);
		
	}
	
	if(evt.key == "i"){
		
		var infoDiv = document.getElementById("info");
		
		if(infoDiv.style.width == "300px"){
			
			infoDiv.style.width = "0px";
			infoDiv.style.display = "none";
			
			
		}else{
			
			infoDiv.style.display = "block";
			infoDiv.style.width = "300px";
			
		}
		
		console.log(infoDiv.style.display);
		
	}
	
	if(firstStage){
		
		if(evt.key == "ArrowUp"){
			
			if(sizeMod < 10) sizeMod++;
			
		}
		
		if(evt.key == "ArrowDown"){
			
			if(sizeMod > 1) sizeMod--;
			
		}
		
	}
	
	
	
});

function clicked(evt){
	
	if(!editing && !stopped){
	
		var cx = evt.clientX;
		var cy = evt.clientY;
	   
		var sx = parseInt(cx/pixelSize)-4;
		var sy = parseInt(cy/pixelSize)-4;
		
		placeX = sx;
		placeY = sy;
	   
	   
	   
		var runningAverage = -1;
		var count = 0;
	   
		for(bx = sx; bx < sx+9; bx++){
	   
			for(by = sy; by < sy+9; by++){
			   
				if(pixelMatrix[bx][by] != null){
			   
					if(runningAverage == -1){
				   
						runningAverage = pixelMatrix[bx][by].strength;
					   
					}else{
				   
						runningAverage = (runningAverage * count + pixelMatrix[bx][by].strength)/(count+1);
				   
					}
				   
					count++;
			   
				}
		   
			}
	   
		}
	   
		console.log(runningAverage);
	
	}
 
}