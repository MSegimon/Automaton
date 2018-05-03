function attemptMovePixel(pixel,x,y){
 
    if(x < width-1 && x > 0 && y < height-1 && y > 0 && walkable(x,y)){
   
        var toPixel = pixelMatrix[x][y];
       
        if(toPixel == null){
			
			pixel.moveTo(x,y);
	   
			return true;
       
        }else if(!(toPixel instanceof Wall)){
       
            if(toPixel.colony != pixel.colony){
				
				
				if(pixelFight(pixel,toPixel)){
					
					pixel.kills++;
			
					pixel.anger++;
					pixel.angerChange();
					
					pixel.moveTo(x,y);
			   
					return true;
					
				}
               
				return false;
			   
            }else{
				
				for(var i = 0; i < Object.keys(pixel.spreadables).length; i++){
			
					var currentKey = Object.keys(pixel.spreadables)[i];
					
					pixel.spreadables[currentKey].attemptSpread(toPixel);
					
				}
				
				spreadLevel(pixel,toPixel);
				
				return false;
				
            }
       
        }
   
    }
   
    return false;
 
}

function spreadLevel(pixel,toPixel){
	
	
	if(toPixel.level < pixel.level){
		
		toPixel.strength += 40 * (pixel.level - toPixel.level); //just in case we missed any levels
		toPixel.level = pixel.level;
		toPixel.recentlyLeveled = 5;
		
		toPixel.render();

	}
	
	return false;
	
}

// function spreadPlague(pixel,toPixel){
	
	// if(pixel.plagued > 11 && toPixel.plagued == pagueSize){
               
		// var newPlague = pixel.plagued+6;
	   
		// if(newPlague > 20){
	   
			// newPlague = 20;
	   
		// }

		// toPixel.plagued = newPlague;

	// }
	
	// return false;
	
// }
 
function removeFromColony(pixel){
	colonies[pixel.colony].pop--;
	
	if(pixel.diseased){
		colonies[pixel.colony].dis--;
	}
	
	// if(pixel.plagued > pagueSize){
		// colonies[pixel.colony].pla--;
	// }
	
	if(pixel.spreadables["plague"].hasSpreadable){
		colonies[pixel.colony].pla--;
	}
 }
 
 
function createPixel(pixel){
 
    pixelMatrix[pixel.x][pixel.y] = pixel;
 
}

function pixelFight(pixel, toPixel){
	
	var total = toPixel.strength + pixel.strength;
               
	var toPixelChance = toPixel.strength/total;

	// if(pixel.plagued > pagueSize){

		// toPixelChance = 0.95;

	// }
	
	if(pixel.spreadables["plague"].hasSpreadable){

		toPixelChance = 0.95;

	}
	
	if(toPixel.spreadables["plague"].hasSpreadable){

		toPixelChance = 0.5;

	}
	
	if(pixel.spreadables["buff"].hasSpreadable){
		
		toPixelChance = 0;
		
	}
	
	if(toPixel.spreadables["buff"].hasSpreadable){
		
		toPixelChance = 1;
		
	}

	if(Math.random() < toPixelChance){
	   
	   
	   //pixel.plagued > pagueSize || 
		if(pixel.spreadables["plague"].hasSpreadable){
		   
			for(ccx = pixel.x-8; ccx < pixel.x+8; ccx++){
			   
				for(ccy = pixel.y-5; ccy < pixel.y+5; ccy++){
				   
					if(getPixel(ccx,ccy) != null){
						//pixelMatrix[ccx][ccy].plagued > pagueSize || 
						if(pixelMatrix[ccx][ccy].colony == pixel.colony && pixelMatrix[ccx][ccy].spreadables["plague"].hasSpreadable){
					   
							// pixelMatrix[ccx][ccy].plagued = pagueSize;
							
							pixelMatrix[ccx][ccy].colony = toPixel.colony;
							pixelMatrix[ccx][ccy].anger+=5;
							pixelMatrix[ccx][ccy].angerChange(); //this renders automatically, so doing it again isn't necessary
							
							pixelMatrix[ccx][ccy].spreadables["plague"].remove();
							//pixelMatrix[ccx][ccy] = null;
					   
						}
				   
					}
		   
				}
		   
			}
	   
		}
		removeFromColony(pixel);
		
		pixelMatrix[pixel.x][pixel.y].unrender();
		
		pixelMatrix[pixel.x][pixel.y] = null;
		
		return false;

	}else{
		removeFromColony(toPixel);
		
		pixelMatrix[toPixel.x][toPixel.y] = null;
		
		return true;

	}

	return false;
	
	
}

function createColony(){
		
		var color = getAvailableColor();
		
		var newColonyIndex;
		
		if(color == null){
			color = '#'+Math.floor(Math.random()*16777215).toString(16);
			console.log("Created random coloured rebelion");
			
			colonyColors.push(color);
			newColonyIndex = colonyColors.length-1;
		}else{
			
			console.log("Created chosen coloured rebelion");
			newColonyIndex = colonyColors.indexOf(color);
		}

		colonies[newColonyIndex] = {pop: 0, str: 0, count: 0, pla: 0, dis:0, level: 0, pixels: []};
		updateStatsDOM();
		
		return newColonyIndex;
}
 