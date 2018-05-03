class Wall {
	constructor(){}
} 
 
class pixel {
 
    constructor(x,y,colony,strength,level){
   
        this.x = x;
        this.y = y;
        this.colony = colony;
		
		this.crowdation = 0;
		
		// this.hasDestructor = false;
		// this.hadDestructor = false;
		// this.hasPassedDestructor = false;
		// this.destructorDir = -1;
		// this.destructorActive = false;
		
        this.moved = false;
		this.currentMove = 0;
		this.movePattern = [
		Math.floor(Math.random()*4+1),Math.floor(Math.random()*4+1),Math.floor(Math.random()*4+1),Math.floor(Math.random()*4+1),
		Math.floor(Math.random()*4+1),Math.floor(Math.random()*4+1),Math.floor(Math.random()*4+1),Math.floor(Math.random()*4+1),
		Math.floor(Math.random()*4+1),Math.floor(Math.random()*4+1),Math.floor(Math.random()*4+1),Math.floor(Math.random()*4+1),
		Math.floor(Math.random()*4+1),Math.floor(Math.random()*4+1),Math.floor(Math.random()*4+1),Math.floor(Math.random()*4+1)
		];
		
		
        this.strength = strength;
        this.ageSpeed = 10;
        this.ageFactor = 0;
        this.diseased = false;
		this.level = level;
		if(level == null) this.level = 0;
		this.recentlyLeveled = 0;
		this.anger = 0;
		this.kills = 0;
       
        this.reproductionValue = parseInt(Math.random() * parseInt(repThresh/2));
       
        // this.plagued = pagueSize;
		
		if(colonies[this.colony] == null){
			colonies[this.colony] = {pop: 0, str: 0, count: 0, pla: 0, dis:0, level: 0};
			updateStatsDOM();
		}
			
			
		this.spreadables = [];
		this.spreadableNames = [];
		
		var plagueSpreadable = new Spreadable(this,"plague",false,{"current": plagueSize});
		
		plagueSpreadable.shouldSpreadHandler = function(recieverSpreadable,owner,reciever){
			
			if(this.getP("current") > 11 && recieverSpreadable.getP("current") == plagueSize && !reciever.spreadables["buff"].hasSpreadable){
               
				return true;

			}
			
			return true;
			
		};
		
		plagueSpreadable.propertyHandler = function(recieverSpreadable,owner,reciever){
			
			var newPlague = this.getP("current")+6;
		   
			if(newPlague > 20){
		   
				newPlague = 20;
		   
			}
			
			recieverSpreadable.setP("current",newPlague);			
			
		}
		
		plagueSpreadable.propertyUpdateHandler = function(owner){
			
			// console.log(this);
			
			 if(this.getP("current") > pagueSize) this.setP("current",this.getP("current")-1);
			 
			 if(this.getP("current") <= pagueSize) this.remove();
			
			
		}
		
		plagueSpreadable.initHandler = function(owner){
			
			 this.setP("current",20);
			
			
		}
		
		plagueSpreadable.removeHandler = function(ownerSpreadable,owner){
			
			 this.setP("current",plagueSize);	
			
		}
		
		this.spreadables.plague = plagueSpreadable;
		
		var buffSpreadable = new Spreadable(this,"buff",false,{"distance": false, "time": 0});
       
		buffSpreadable.shouldSpreadHandler = function(recieverSpreadable,owner,reciever){
			
			return true;
			
		};
		
		buffSpreadable.propertyHandler = function(recieverSpreadable,owner,reciever){
			
			var newDistance = this.getP("distance")-1;
			
			recieverSpreadable.setP("distance",newDistance);	
			recieverSpreadable.setP("time",newDistance);

			reciever.spreadables["plague"].remove();
			
		}
		
		buffSpreadable.propertyUpdateHandler = function(owner){
			
			// console.log(this);
						
			 if(this.getP("time") > 0) this.setP("time",this.getP("time")-1);
			 
			 if(this.getP("time") <= 0) this.remove();
			
			
		}
		
		buffSpreadable.initHandler = function(owner){
			
			 this.setP("distance",100);
			 this.setP("time",100);
			
			
		}
		
		buffSpreadable.removeHandler = function(ownerSpreadable,owner){
			
			 this.setP("time",0);	
			 this.setP("distance",0);	
			
		}
	   
		this.spreadables.buff = buffSpreadable;
	   
	   this.render();
	   
    }
	
	moveTo(nx,ny){
		
		var lastX = this.x;
		var lastY = this.y;
	   
		pixelMatrix[nx][ny] = this;
	   
		this.unrender();
	   
		this.x = nx;
		this.y = ny;
		
		pixelMatrix[lastX][lastY] = null;		
		
		this.render();
		
	}
   
    update(){
		
		
		//updateSpreadables
		
		this.spreadables["plague"].propertyUpdateHandler(this);
		this.spreadables["buff"].propertyUpdateHandler(this);
		
        // if(this.plagued > pagueSize) this.plagued--;
       
			
		this.move();
   
   
		if(this.reproductionValue > repThresh){
	   
			this.reproductionValue = 0;
		   
			this.attemptReproduce();
	   
		}
	
		this.reproductionValue++;
		
		this.attemptDisease();
	
		
        this.moved = true;
       
       
        // this.age();
       
		// this.attemptPlague();
		
		// this.attemptEvolve();
		
		// this.attemptWeapon();
		
		// this.attemptDestructor();
		
		
		//reactivateSpreadables
		
		this.spreadables["plague"].canSpread = true;			
		this.spreadables["buff"].canSpread = true;	

		if(this.recentlyLeveled > 0){
			
			this.render();
			
		}		
		
		// this.giveDestructor();
		
		// this.hasPassedDestructor = false;
	
	}
	
	angerChange(){
		
		if(this.anger >= 20+this.strength){
			
			// console.log(this.anger);
			
			this.attemptRebel();
			
			this.anger = 0;
			
		}
		
		this.render();
		
	}	
	
	unrender(){
		
		ctx.clearRect(getX(this.x),getY(this.y),pixelSize,pixelSize);
		
	}
	
	render(editorOpt){
		
		var editor = editorOpt | false;
		
		if(!editor){
			
			if(shouldRender){
			
				ctx.fillStyle = colonyColors[this.colony];   
				
				
				if(this.diseased) ctx.fillStyle = colonyColors[this.colony].replace("f","d");
				
				if(this.anger > 10) ctx.fillStyle = "#888800";
				
				// if(this.plagued > pagueSize) ctx.fillStyle = "#ffff00";
				
				
				if(this.spreadables["plague"].hasSpreadable) ctx.fillStyle = "#ffff00";
				if(this.spreadables["buff"].hasSpreadable) ctx.fillStyle = colonyColors[this.colony].replace("f","3").replace("c","1");
				
				this.recentlyLeveled--;
				
				if(this.recentlyLeveled > 0){
					
					ctx.fillStyle = "#cccccc";
					
				}
				
				// if(this.spreadables.weapon.hasSpreadable){
					
					// ctx.strokeStyle = "#000000";
					
					// if(this.spreadables.weapon.getP("active")) ctx.strokeStyle = "#990000";
					
					// ctx.lineWidth = 3;
					
					// ctx.strokeRect(getX(this.x-5),getY(this.y-5),pixelSize*10,pixelSize*10);
					
					// ctx.fillStyle = "#777700";
					
				// } 
			   
				ctx.fillRect(getX(this.x),getY(this.y),pixelSize,pixelSize);
			
			
			}
			
		}else{
			
			ctx.fillStyle = colonyColors[this.colony];     
		   
			ctx.fillRect(getX(this.x),getY(this.y),pixelSize,pixelSize);
			
		}
   
    }
	
	attemptWeapon(){
		
		if(Math.random() < 0.00000002){
		
			this.developWeapon();
			
		}
		
	}
	
	developWeapon(){
		
		missils.push(new Missil(this.x,this.y,this.colony,0));
		
	}
	
	transform(newColony){
		
		this.colony = newColony;
		this.level = colonies[newColony].level;
		this.spreadables.plague.remove();
		
	}
	
	giveDestructor(){
		
		if(!this.destructorActive){
			
			// console.log("Attempting spread...");
			
			var nextPixel = this.upCell;
			
			if(this.destructorDir == 2) nextPixel = this.downCell;
			if(this.destructorDir == 3) nextPixel = this.rightCell;
			if(this.destructorDir == 4) nextPixel = this.leftCell;
			
			// console.log("Selected: ");
			// console.log(nextPixel);
			
			if(!nextPixel == null){
				
				if(this.hasDestructor && !this.hasPassedDestructor){
					
					// console.log("Passing...");
					
					// console.log("passed to");
					// console.log(nextPixel);
					
					nextPixel.hasDestructor = true;
					this.hasDestructor = false;
					nextPixel.hadDestructor = true;
					nextPixel.hasPassedDestructor = true;
					nextPixel.destructorDir = this.destructorDir;
					nextPixel.destructorActive = false;
				
				}
			
			}
		
		}
		
	}
	
	attemptRebel(){
		//&& this.diseased
			
		var newColonyIndex = createColony();
			
		var peoplePercentage = 10;
		
		var newColonyCellsAmount = parseInt(Math.sqrt(colonies[this.colony].pop/peoplePercentage)/2);
		
		var originalColony = this.colony;
		
		for(var i = this.x-newColonyCellsAmount; i < this.x+newColonyCellsAmount; i++){
			for(var j = this.y-newColonyCellsAmount; j < this.y+newColonyCellsAmount; j++){
				
				var pixel = getPixel(i,j);
				
				if(pixel != null && !(pixel instanceof Wall)){
				
					if(pixel.colony == originalColony){
						
						colonies[newColonyIndex].pop++;
						pixel.colony = newColonyIndex;
						pixel.strength *= 2;
						pixel.anger = 0;
						
						pixel.render();
						
					}
				
				}
			}
		}
			
	}
	
	attemptEvolve(){
		
		if(Math.random() > 0.9999999){ 
			
			forceEvolve();
			
			//console.log("Evolved to level " + this.level);
			
		}
		
	}
	
	forceEvolve(){
		
		console.log("Level Up!");
		
		this.level++;
			
		this.strength += 40;
		
	}
	
	attemptDestructor(){
		
		// if(Math.random() > 0.99999999 || false){
			
			console.log("DESTROY!");
			
			// this.hasDestructor = true;
			// this.destructorDir = Math.random() * 4 + 1;
			// this.hasPassedDestructor = false;
			// this.hadDestructor = true;
			
		// }
		
	}
	
	move(){
		
		var dir = this.movePattern[this.currentMove++];
       
		if(this.currentMove == this.movePattern.length) this.currentMove = 0;
	   
        var xChange = 0;
        var yChange = 0;
       
        if(dir == 1){
       
            xChange = 1;
       
        }
       
        if(dir == 2){
       
            xChange = -1;
       
        }
       
        if(dir == 3){
       
            yChange = 1;
       
        }
       
        if(dir == 4){
       
            yChange = -1;
       
        }
       
        attemptMovePixel(this,this.x+xChange,this.y+yChange);		
		
	}
	
    age(){
       
	   
	   
        // if(this.diseased){
		
			// if(!pixel.hasDestructor){
		
				// this.strength--;
		   
				// if(this.strength <= 0){
					// removeFromColony(this);
					// pixelMatrix[this.x][this.y] = null;
			   
				// }
       
			// }
	   
        // }else{
		
			// if(!pixel.hasDestructor){
			
				if(this.ageFactor >= this.strength*this.ageSpeed){
				   
					removeFromColony(this);
					pixelMatrix[this.x][this.y] = null;
					
					
				}
				
			
			// }
       
        // }
       
		this.ageFactor++;
   
    }
   
    attemptReproduce(){
       
	   
			
		var rightCell = getPixel(this.x+1,this.y);
		var leftCell = getPixel(this.x-1,this.y);
		var downCell = getPixel(this.x,this.y+1);
		var upCell = getPixel(this.x,this.y-1);
	   
        var x = null;
        var y = null;
       
        if(rightCell == null && walkable(this.x + 1,this.y)){
       
            x = this.x + 1;
            y = this.y;
       
        }
       
        if(leftCell == null && walkable(this.x - 1,this.y)){
       
            x = this.x - 1;
            y = this.y;
       
        }
       
        if(downCell == null && walkable(this.x,this.y + 1)){
       
            x = this.x;
            y = this.y + 1;
       
        }
       
        if(upCell == null && walkable(this.x,this.y - 1)){
       
            x = this.x;
            y = this.y - 1;
       
        }
       
        if(x != null && y != null && x > 0 && y > 0 && x < width && y < height){
       
            var newStrength = this.strength + parseInt(Math.random() * 8 - 4);
           
            if(newStrength < 10){
           
                newStrength = 10;
           
            }
            createPixel(new pixel(x,y,this.colony,newStrength,this.level));
       
        }
   
    }
   
	attemptPlague(){
       
       //if this.diseased....
           
		if(this.spreadables["plague"].getP("current") > 0){
	   
		   
	   
		}else{
	   
			if(Math.random() > 0.9999999){
		   
				this.spreadables["plague"].startSpreadable();
		   
			}
	   
		}
       
   
    }
   
    attemptDisease(){
       
		var rightCell = getPixel(this.x+1,this.y);
		var leftCell = getPixel(this.x-1,this.y);
		var downCell = getPixel(this.x,this.y+1);
		var upCell = getPixel(this.x,this.y-1);
	   
		var overpopulated = true;
	   
		if(rightCell == null || (rightCell != null && !(rightCell instanceof Wall) && rightCell.colony != this.colony)){
	   
			overpopulated = false;
	   
		}
	   
		if(leftCell == null || (leftCell != null && !(leftCell instanceof Wall) && leftCell.colony != this.colony)){
	   
			overpopulated = false;
	   
		}
	   
		if(downCell == null || (downCell != null && !(downCell instanceof Wall) && downCell.colony != this.colony)){
	   
			overpopulated = false;
	   
		}
	   
		if(upCell == null || (upCell != null && !(upCell instanceof Wall) && upCell.colony != this.colony)){
	   
			overpopulated = false;
	   
		}
	   
		if(overpopulated){
	   
			if(Math.random() > 0.99999) this.diseased = true;
			
			this.render();
			
		}
       
   
    }
	
}