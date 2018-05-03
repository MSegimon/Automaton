function updateStatsDOM(){
	
	var infodiv = document.getElementById("infodiv");
	infodiv.innerHTML = "";
	
	for(var i = 0; i < colonies.length; i++){
			
		if(colonies[i] != null){
		
		infodiv.innerHTML += "<h4>Colony "+i+":</h4>Population: <span id='pop"+i+"'></span><br>Strength: <span id='str"+i+"'></span><br>Diseased: <span id='dis"+i+"'></span><br>Plagued: <span id='pla"+i+"'></span><br>Level: <span id='lev"+i+"'></span><br><br>";
		
		}
	
	}
}

function updateStats(colony){
	
	
	
		
	if(colonies[colony] != null){
		document.getElementById("pop"+colony).innerHTML = colonies[colony].pop;
		document.getElementById("str"+colony).innerHTML = colonies[colony].str;
		document.getElementById("dis"+colony).innerHTML = colonies[colony].dis;
		document.getElementById("pla"+colony).innerHTML = colonies[colony].pla;
		document.getElementById("lev"+colony).innerHTML = colonies[colony].level;
	}
	
		
	
	
	
}