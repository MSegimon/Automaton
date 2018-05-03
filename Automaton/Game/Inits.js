 
function init(){	
	document.body.addEventListener("click",clicked);
	
	//bgimg.src = "map.png";
	

	//bgimg.onload = function(e){
		//ctx.drawImage(bgimg,0,0,canvas.width,canvas.height);

		var mapData = ctx.getImageData(0,0,canvas.width,canvas.height).data;
		for(var i = 0; i < canvas.width*canvas.height; i++){
		
			var r = mapData[i*4];
			var g = mapData[i*4+1];
			var b = mapData[i*4+2];
			var a = mapData[i*4+3];

			var y = (parseInt(i / canvas.width, 10));
			var x = (parseInt(i - y*canvas.width));
						
			if(r == 0 && g == 0 && b == 0 && a == 255 && parseInt(x/pixelSize) < width && parseInt(y/pixelSize) < height && x > 0 && y > 0){
				
				// console.log(parseInt(x/pixelSize) + ", " + parseInt(y/pixelSize));
				
				pixelMatrix[parseInt(x/pixelSize)][parseInt(y/pixelSize)] = new Wall();
			}
			
			 
		}
		var vidButton = document.createElement("BUTTON");
		//vidButton.style.position = "absolute";
		vidButton.style.marginLeft = "0px";
		vidButton.innerHTML = "View History";
		
		vidButton.setAttribute("onclick","playVideo();");
		document.getElementById("tools").appendChild(vidButton);
		
		for(x = 0; x < width; x++){
   
			for(y = 0; y < height; y++){
		   
				var pixel = pixelMatrix[x][y];
			   
				if(pixel != null){
			   
					if(pixel instanceof Wall){
						
						ctx.fillStyle = "#40a4df";
						ctx.fillRect(getX(x),getY(y),pixelSize,pixelSize);
							
					}
					
				}
				
			}
		
		}
		
			loop();
	//}
	
}

function initMatrix(){
 
    for(i = 0; i < width; i++){
   
        pixelMatrix[i] = new Array(height);
   
    }  
 
}