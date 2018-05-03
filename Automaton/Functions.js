function getPixel(x,y){
 
    if(x > 0 && x < width && y > 0 && y < height){
	
		var pixel = pixelMatrix[x][y];
		return pixel
    }
   
    return null;
 
}

var storedRandomNums = [];

function renderSection(sx,sy,width,height){
	
	for(var rrx = sx; rrx < sx+width; rrx++){
				
		for(var rry = sy; rry < sy+height; rry++){
			
			if(getPixel(rrx,rry) != null){
				
				if(!(getPixel(rrx,rry) instanceof Wall)){
					
					getPixel(rrx,rry).render();
				
				}else{
					
					ctx.fillStyle = "#40a4df";
					ctx.fillRect(getX(rrx),getY(rry),pixelSize,pixelSize);
					
				}
				
			}else{
				
				ctx.clearRect(getX(rrx),getY(rry),pixelSize,pixelSize);
				
			}					
			
		}
		
	}
	
}

function randomNum(){
	
	if(storedRandomNums.length == 0){
		
		console.log("Restoring random numbers");
		
		var storedRandomNums = [];

		for(var i = 0; i < 100000000; i++){

			storedRandomNums.push(Math.random());

		}
		
	}
	
	return storedRandomNums.pop();
	
}

function shadeColor2(color, percent) {   
    var f=parseInt(color.slice(1),16),t=percent<0?0:255,p=percent<0?percent*-1:percent,R=f>>16,G=f>>8&0x00FF,B=f&0x0000FF;
    return "#"+(0x1000000+(Math.round((t-R)*p)+R)*0x10000+(Math.round((t-G)*p)+G)*0x100+(Math.round((t-B)*p)+B)).toString(16).slice(1);
}


function getX(x){
 
    return x * pixelSize;
 
}
 
function getY(y){
 
    return y * pixelSize;
 
}

 
function walkable(x,y){
 
	//if the pixel is not wall

	
	
	return !(getPixel(x,y) instanceof Wall);
 
} 


function getAvailableColor(){
	
	var actualColors = colonyColors.slice();
	
	for(x = 0; x < width; x++){

		for(y = 0; y < height; y++){
	   
			var pixel = pixelMatrix[x][y];
			
			if(pixel != null && !(pixel instanceof Wall)){
				
				var i = actualColors.indexOf(colonyColors[pixel.colony]);
				
				if(i!=-1){
					actualColors.splice(i,1);
				}
			}
			
		}
	}
	
	var returnColor = null;
	if(actualColors.length > 0){
		returnColor = actualColors[0];
	}
	if(returnColor == 0) returnColor = null;
	return returnColor;
}

function getParam(name){
   if(name=(new RegExp('[?&]'+encodeURIComponent(name)+'=([^&]*)')).exec(location.search))
      return decodeURIComponent(name[1]);
}