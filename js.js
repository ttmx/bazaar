let priceDiff = [];
let HPX_KEY;
let table = document.getElementsByClassName("table")[0];
function prices(data){
	for(let p in data){
		p = data[p].quick_status;
		priceDiff.push([p.productId,1-(p.sellPrice*1.01)/(p.buyPrice*0.99),p.buyPrice*0.99-p.sellPrice*1.01,p.buyMovingWeek]);
	}
	drawRows(priceDiff,1,true);
}

function sorty(mat,sortBy,dir){
	mat.sort(function(a,b){return a[sortBy] < b[sortBy]});
	if(dir)
		mat.reverse();
	return mat;
}

function drawRows(mat,sortBy,dir){
	mat = sorty(mat,sortBy,dir);
	let titles = ["Item name","Profit percent","Profit per","Purchases/week"];
	let row;
	let header = "<div class='row header'>";
	for(let i = 0; i<titles.length;i++){
		let title = titles[i];
		if(i == sortBy)
			header += '<div class="cell" onclick="drawRows(priceDiff,'+i+','+!dir+')"> '+title+(dir?"&#8595":"&#8593")+' </div>';
		else
			header += '<div class="cell" onclick="drawRows(priceDiff,'+i+',false)"> '+title+' </div>';
	}
	table.innerHTML = header +"</div>";
	for(let a = 0; a<mat.length;a++){
		row = "<div class='row'>";
		for(let b = 0; b<mat[0].length;b++){
			row += "<div class='cell' data-title='"+titles[b]+"'>";
			let elem = mat[a][b].toString();

			if(isNaN(elem))
				row +=elem.replace(/_/g," ");
			else
				row +=elem.substring(0,9);
			row += "</div>";
		}
		row += "</div>";
	table.innerHTML += row;
	}
}
function setHpKey(){
	localStorage.HPX_KEY = document.getElementById("hpxKey").value;
	HPX_KEY = localStorage.HPX_KEY;
	doRequest();
}
function doRequest(){
	fetch("https://api.hypixel.net/skyblock/bazaar?key="+HPX_KEY)
		.then(data=>{return data.json()})
		.then(res=>{prices(res.products)})
}

if(localStorage.HPX_KEY!= null){
	HPX_KEY = localStorage.HPX_KEY
	doRequest();
}else{
	table.innerHTML = '<div class="row header"> <div class="cell"> Api Key </div> <div class="cell"> <input id = "hpxKey" type="text"> </div> <div class="cell"> <button class="login-button" onclick="setHpKey()">Set Key</button> </div> </div>';
}
