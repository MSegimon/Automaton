
class Spreadable {
	
	constructor(owner,type,unique,properties){
		
		this.owner = owner; //the pixel that has this spreadable, to know who to spread it from		
		this.type = type; //just to be able to give this specific spreadable to other pixels. will also be stored as {type: spreadable}
		this.unique = unique; //is this able to be spread to countless to pixels or just one?
		
		this.properties = []; //extra properties the spreadable might have that could spread to children
		
		if(properties != null){
			
			this.properties = properties;
		}
		
		this.propertyHandler = function(recieverSpreadable,owner,reciever){}; //how should the properties propagate to the children? Should anything else happen?
		
		
		this.shouldSpreadHandler = function(recieverSpreadable,owner,reciever){return true;};
		
		this.propertyUpdateHandler = function(owner){};
		
		this.initHandler = function(owner){};
		
		this.removeHandler = function(owner){};
		
		this.canSpread = false; //to prevent double spreads. A pixel can pass the spreadable to another pixel, and if that pixel hasn't yet been iterated through it will also spread it, effectively making a spreadable be able to go from one side to the other in one update, which is not intended behaviour
		
		this.hasSpreadable = false; //to see if he has the spreadable
		
		
		
	}
	
	attemptSpread(reciever){
		
		if(this.hasSpreadable && this.shouldSpreadHandler(reciever.spreadables[this.type],this.owner,reciever) && this.canSpread){
			
			// console.log("Spreading...");
			
			this.spread(reciever);
			
		}
		
	}
	
	spread(reciever){
		
		var recieverSpreadable = reciever.spreadables[this.type];
		
		if(!recieverSpreadable.hasSpreadable){
		
			recieverSpreadable.hasSpreadable = true;
			recieverSpreadable.canSpread = false;
			
			if(this.unique){
				
				this.hasSpreadable = false;
				
				
			}
			
			
			this.propertyHandler(recieverSpreadable,this.owner,reciever);
		
			reciever.render();

		}
	
		// console.log(reciever);
		
	}
	
	
	startSpreadable(){
		
		this.hasSpreadable = true;
		this.canSpread = false;
		
		this.initHandler(this,this.owner);
		
		this.owner.render();
		
	}
	
	remove(){
		
		if(this.hasSpreadable){
		
			this.hasSpreadable = false;
			
			this.removeHandler(this,this.owner);
			
			this.owner.render();
		
		}
		
	}
	
	setP(name,value){
		
		this.properties[name] = value;

		return this.properties[name];

	}
	
	getP(name){
		
		return this.properties[name];
		
	}
	
}
