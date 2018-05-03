var stopped = false; 

function loop(){
	
	if(!optimizeMode){
	
		var date = new Date();
		var dateStartTime = date.getTime();
   
	}
   
	// ctx.fillStyle = "#ffffff";
    // ctx.fillRect(0,0,canvas.width,canvas.height);
    
	// ctx.clearRect(0,0,canvas.width,canvas.height);
	
   
   	//ctx.drawImage(bgimg,0,0,canvas.width,canvas.height);

	
	
   
    for(x = 0; x < width; x++){
   
        for(y = 0; y < height; y++){
       
            var pixel = pixelMatrix[x][y];
           
            if(pixel != null && !(pixel instanceof Wall)){
           
                pixel.moved = false;
               
            }else{
               
            }
       
        }
   
    }
	
	for(var i = 0; i < colonies.length; i++){
		if(colonies[i] != null){
			colonies[i].pop = 0;
			colonies[i].count = 0;
			colonies[i].dis = 0;
			colonies[i].pla = 0;
			colonies[i].level = 0;
			colonies[i].pixels = [];
		}
	}
	
	
	
	for(x = 0; x < width; x++){
   
        for(y = 0; y < height; y++){
       
            var pixel = pixelMatrix[x][y];
           
            if(pixel != null){
           
				if(pixel instanceof Wall){
									
				}else{
		   
					if(!pixel.moved){
			   
						pixel.update();
						
						if(colonies[pixel.colony] != null){
							
							
							
							if(colonies[pixel.colony].pixels != null) colonies[pixel.colony].pixels.push(pixel);
							
							colonies[pixel.colony].pop++;
							
							colonies[pixel.colony].level = Math.max(colonies[pixel.colony].level,pixel.level);
							
							colonies[pixel.colony].str = (colonies[pixel.colony].str * colonies[pixel.colony].count + pixel.strength)/(colonies[pixel.colony].count + 1);
							
							colonies[pixel.colony].count++;
							
							if(pixel.diseased){
								
								colonies[pixel.colony].dis++;
								
							}
							
							// if(pixel.plagued > pagueSize){
								
								// colonies[pixel.colony].pla++;
								
							// }
							
							if(pixel.spreadables["plague"].hasSpreadable){
								
								colonies[pixel.colony].pla++;
								
							}
						}
				   
					}
				
				}
               
            }
       
        }
   
    }
	
	for(var cii = 0; cii < colonies.length; cii++){
		if(colonies[cii] != null){
			
			var weaponChance = 0.0000002;
			
			var adjustedWeaponChance = weaponChance * colonies[cii].pop;
			
			var shouldWeapon = Math.random() < adjustedWeaponChance;
			
			if(shouldWeapon) colonies[cii].pixels[Math.floor(Math.random() * colonies[cii].pixels.length)].developWeapon();
			
			
			var airRaidChance = 0.0000000057;
			var adjustedAirRaidChance = airRaidChance * colonies[cii].pop;
			
			var shouldAirRaid = Math.random() < adjustedAirRaidChance;
			
			if(shouldAirRaid){
				
				var airRaidSize = Math.floor(Math.random() * 16 + 6);
				
				for(var mis = 0; mis < airRaidSize; mis++){
					
					colonies[cii].pixels[Math.floor(Math.random() * colonies[cii].pixels.length)].developWeapon();
					
				}
				
			}
			
			
			var evolveChance = 0.0000001;
			
			var adjustedEvolveChance = evolveChance * colonies[cii].pop;
			
			var shouldEvolve = Math.random() < adjustedEvolveChance;
						
			if(shouldEvolve) colonies[cii].pixels[Math.floor(Math.random() * colonies[cii].pixels.length)].forceEvolve();
			
			
			var buffChance = 0.000000003;
			
			var adjustedBuffChance = buffChance * colonies[cii].pop;
			
			var shouldBuff = Math.random() < adjustedBuffChance;
						
			if(shouldBuff) colonies[cii].pixels[Math.floor(Math.random() * colonies[cii].pixels.length)].spreadables["buff"].startSpreadable();
							 
			var plagueChance = 0.0000001;
			
			var adjustedPlagueChance = plagueChance * colonies[cii].pop;
			
			var shouldPlague = Math.random() < adjustedPlagueChance;
						
			if(shouldPlague) colonies[cii].pixels[Math.floor(Math.random() * colonies[cii].pixels.length)].spreadables["plague"].startSpreadable();
			
			var rebelChance = 0.00000001;
			
			var adjustedRebelChance = rebelChance * colonies[cii].pop;
			
			var shouldRebel = Math.random() < adjustedRebelChance;
						
			if(shouldRebel) colonies[cii].pixels[Math.floor(Math.random() * colonies[cii].pixels.length)].attemptRebel();
			
		}
	}
	
	for(x = 0; x < width; x++){
   
        for(y = 0; y < height; y++){
       
            var pixel = pixelMatrix[x][y];
           
            if(pixel != null){
           
				if(pixel instanceof Wall){
					ctx.fillStyle = "#40a4df";
					ctx.fillRect(getX(x),getY(y),pixelSize,pixelSize);
				
				}else{
		   
					// pixel.render();
				
				}
               
            }
       
        }
   
    }
	
	for(var i = 0; i < missils.length; i++){
		
		var missil = missils[i];
		
		missil.render();
		
		missil.move();
		
		missil.destroy();
		
	}
	
	
	if(!optimizeMode){
	
		/*ctx.beginPath();
		ctx.fillStyle = "#000000";
		ctx.strokeRect(getX(placeX),getY(placeY),getX(8),getY(8));
		ctx.closePath();*/ //El cuadrado aparece en el video...
	
	}
	
	if(imgType == "webp" || true){
		recordLoop();
	}
    
	if(!optimizeMode){
	
		for(var i = 0; i < colonies.length; i++){
			updateStats(i);
		}
	
	}
	
	
	if(!optimizeMode){
	
		date = new Date();
		var timeElapsed = date.getTime() - dateStartTime;
		
		loopDelay = timeElapsed;
		
		var fps_count = 1000/timeElapsed;	
		
		renderSection(1,1,25,25);
		
		ctx.beginPath();
		ctx.fillStyle = "#000000";
		ctx.font = "20px Verdana";
		ctx.fillText(Math.round(fps_count)+"fps",0,50);
		ctx.fillText(timeElapsed+" ms",0,100);
		ctx.closePath();
	
		if(!stopped){
			// setTimeout(loop,calcIterTime()-timeElapsed);
			setTimeout(loop,0);
		}else{
			
			finishedLoop();
			
		}
	
	}else{
		
		if(!stopped){
			
			setTimeout(loop,0);
		
		}else{
			
			finishedLoop();
			
		}
	
	}
   
   
   
   
}

 
function calcIterTime(){
 
    return 1000/fps;
 
}