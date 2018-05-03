
class Missil {
	
	constructor(cx,cy,colony,type){
		
		this.cx = cx;
		this.cy = cy;
		this.dir = parseInt(Math.random() * 4 + 1);
		
		this.possibleDirs = [];
		
		
		
		this.steps = 0;
		
		this.colony = colony;
		
		this.type = type;
		
		this.animating = false;
		this.aniIndex = 0;
		this.timeFrame = 0;
		
		this.startCounting = 0;
		
	}
	
	tryDir(dir){
		
		var current = this.cy;
		var maxCurrent = height;
			
		if(this.dir == 2 || this.dir == 4){
			
			current = this.cx;
			maxCurrent = width;
			
		}
		
		for(var i = current; i < maxCurrent; i++){
			
			
			
		}
		
	}
	
	getImage(){
		
		return missilImages[this.dir-1];
		
	}
	
	move(){
		
		if(!this.animating){
		
			if(this.dir == 1) this.cy--;
			if(this.dir == 2) this.cx++;
			if(this.dir == 3) this.cy++;
			if(this.dir == 4) this.cx--;
			
			this.steps++;
			
			if(this.startCounting > 0) this.startCounting++;
			
			var destroy = false;
			
			if(this.cx >= width) destroy = true;
			if(this.cx < 0) destroy = true;
			if(this.cy >= height) destroy = true;
			if(this.cy < 0) destroy = true;
			
			
			if(destroy){
				
				var index = missils.indexOf(this);
				
				renderSection(this.cx-8,this.cy-8,16,16);
				
				missils.splice(index,1);
				
			}			
			
		}
		
	}
	
	render(){
		
		if(!this.animating){
			
			renderSection(this.cx-8,this.cy-8,16,16);		
			
			var imageToRender = this.getImage();
			
			var height = imageToRender.height;
			var width = imageToRender.width;
			
			var ratio = Math.max(height,width) / Math.min(height,width);
			
			if(this.dir == 1 || this.dir == 3){
			ctx.drawImage(this.getImage(),getX(this.cx)-20,getY(this.cy)-20*ratio,40,40*ratio);
			}else{
			ctx.drawImage(this.getImage(),getX(this.cx)-20*ratio,getY(this.cy)-20,40*ratio,40);
			}
			
			
		}else{
			
			if(ableExplosion){
				
				this.timeFrame += loopDelay;
		
				var passedFrames = Math.floor(this.timeFrame/70);
				
				this.timeFrame = this.timeFrame % 100;
				
				this.aniIndex = this.aniIndex + passedFrames;
				
				renderSection(this.cx-18,this.cy-18,50,50);
				
				if(this.aniIndex > 23){
					
					var index = missils.indexOf(this);
				
					missils.splice(index,1);
					
				}
				
				
				ctx.drawImage(explosionSheet,this.aniIndex*200,0,200,247,getX(this.cx)-getX(20),getY(this.cy)-getY(20),200,247);
				
			}
			
		}
		
	}
	
	nuke(){
		
		for(var rx = this.cx - 35; rx < this.cx + 35; rx++){
				
			for(var ry = this.cy - 35; ry < this.cy + 35; ry++){
			
				var killPixel = getPixel(rx,ry);
		   
				if(killPixel != null){
			   
					if(killPixel instanceof Wall){
					
					}else{
						
						if(killPixel.colony != this.colony){
			   
							pixelMatrix[rx][ry].unrender();
							pixelMatrix[rx][ry] = null;
						
						}
					
					}
				   
				}
			
			}
			
		}
		
		this.aniIndex = 0;
		this.animating = true;
		
	}
	
	destroy(){
		
		if(this.startCounting == 24 && !this.animating){
			
			this.nuke();
			
		}
		
		if(getPixel(this.cx,this.cy) != null && getPixel(this.cx,this.cy).colony != this.colony && this.startCounting == 0){
			
			console.log("Yeah boi!");
			
			this.startCounting = 1;
			
		}
		
		if(this.steps % 35 == 0 && false){
		
			for(var rx = this.cx - 11; rx < this.cx + 11; rx++){
				
				for(var ry = this.cy - 11; ry < this.cy + 11; ry++){
				
					var killPixel = getPixel(rx,ry);
			   
					if(killPixel != null){
				   
						if(killPixel instanceof Wall){
						
						}else{
							
							if(killPixel.colony != this.colony){
				   
								pixelMatrix[rx][ry].strength *= 1.5;
								pixelMatrix[rx][ry].strength = parseInt(pixelMatrix[rx][ry].strength);
								pixelMatrix[rx][ry].transform(this.colony);
							
							}
						
						}
					   
					}
				
				}
				
			}
		
		}
		
	}
	
}
