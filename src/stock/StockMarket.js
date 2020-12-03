

function StockMarket() {
	console.log("StockMarket");
	var agent = new Agent(100);
	var agentA = new AgentWaitBuyLow(100);



		var wConst = new WaveConstant(2.0);
		var wL = new WaveLine(0.0, 0.10);
		var wR = new WaveRandom(0.10);
		var wLo = new WaveSinusoid(1.0, 1/11.0, Code.radians(20));
		var wHi = new WaveSinusoid(0.40, 1/3.0, Code.radians(50));
		var wLong = new WaveSinusoid(0.10, 1/57.0, Code.radians(270));
		//var wLong = new WaveSinusoid(1.0, 1/23.0, Code.radians(90));
		var wA = new WaveSinusoid(0.50, 1/2.0, Code.radians(40));
		var wB = new WaveSinusoid(0.30, 1/5.0, Code.radians(130));
		var wC = new WaveSinusoid(0.20, 1/4.1, Code.radians(170));
		var wD = new WaveSinusoid(0.10, 1/1.5, Code.radians(240));
		var wN = new WaveSinusoid(4.0, 1/100, Code.radians(180));
		var waves = [wConst,wL,wR,wLo,wHi,wLong,wN, wA,wB,wC,wD];
	var wave = new WaveSum(waves);
	var stock = new Stock(wave);
	var market = new Market([stock],[agent, agentA]);
	console.log(market);

	market.start();


console.log("done");
}


// time is always in units of days
// value is always in units of dollars

function TimeKeeper(){
	this._time = 0;
}

function Agent(cash){
	this._id = Agent._ID++;
	this._startingAssets = cash;
	this._money = cash;
	this._slips = [];
}
Agent._ID = 0;
Agent.prototype.checkStock = function(stock,time){
	// var price = stock.price();
	// while(this.canBuyStock(stock)){
	// 	this.buyStock(stock,time);
	// }
}
Agent.prototype.canBuyStock = function(stock){
	return stock.price()<=this._money;
}
Agent.prototype.checkStockStart = function(stock,time){
	while(this.canBuyStock(stock)){
		this.buyStock(stock,time);
	}
}
Agent.prototype.checkStockEnd = function(stock,time){
	//
}
Agent.prototype.buyStock = function(stock,time){
	var price = stock.price();
	var remaining = this._money-price;
	var slip = new Slip(stock,price,time);
	console.log("AGENT "+this._id+" BUY: "+this._money+" $"+price+"     @ "+time);
	this._slips.push(slip);
	this._money = remaining;
}
Agent.prototype.netAssets = function(){
	var slips = this._slips;
	var sum = 0;
	for(var i=0; i<slips.length; ++i){
		var slip = slips[i];
		var stock = slip.stock();
		var price = stock.price();
		sum += price;
	}
	sum += this._money;
	return sum;
}
Agent.prototype.deltaAssets = function(){
	var net = this.netAssets();
	var start = this._startingAssets;
	return (net/start);
}
// -------------------------------------------------------------------- - wait until N lower values before buying
function AgentWaitBuyLow(cash, goalPercent){
	AgentWaitBuyLow._.constructor.call(this, cash);
	// this._goalPercent = goalPercent;
	this._negativeDays = 0;
	this._positiveDays = 0;
	this._maxWaitNegativeDays = 2;
	// this._previousPrices = [];
	this._hasBoughtToday = false;
	this._maxBuyStocksPerDay = 10;
	// this._maxBuyStocksPerDay = 100;
	this._hasBoughtAlready = false;
}
Code.inheritClass(AgentWaitBuyLow, Agent);
AgentWaitBuyLow.prototype.checkStock = function(stock,time){
	//
}
AgentWaitBuyLow.prototype._checkBuy = function(stock,time){
this._hasBoughtAlready = false; // always check for a low day
	// console.log("this._negativeDays: "+this._negativeDays)
	var price = stock.price();
	if(this._hasBoughtAlready || this._negativeDays>=this._maxWaitNegativeDays){
		if(!this._hasBoughtToday && this.canBuyStock(stock)){
			this._hasBoughtToday = true;
			this._hasBoughtAlready = true;
			var count = 0;
			while(this.canBuyStock(stock) && count<this._maxBuyStocksPerDay){
				++count;
				this.buyStock(stock,time);
			}
		}
	}
}
AgentWaitBuyLow.prototype.checkStockStart = function(stock,time){
	// console.log("checkStockStart: "+stock.price());
	this._startPrice = stock.price();
	this._hasBoughtToday = false;
	this._checkBuy(stock,time);
}
AgentWaitBuyLow.prototype.checkStockEnd = function(stock,time){
	// console.log("checkStockEnd: "+stock.price());
	this._endPrice = stock.price();
	var diff = this._endPrice-this._startPrice;
	// console.log("END: "+diff);
	if(diff<0){
		this._negativeDays++;
		this._positiveDays = 0;
	}else{
		this._positiveDays++;
		this._negativeDays = 0;
	}
}
// --------------------------------------------------------------------
function Slip(stock, price, time){
	this._stock = stock;
	this._time = time;
	this._price = price;
}
Slip.prototype.stock = function(time){
	return this._stock;
}
Slip.prototype.price = function(time){
	return this._price;
}
Slip.prototype.time = function(time){
	return this._time;
}
// --------------------------------------------------------------------
function Wave(){
	// 
}
Wave.prototype.valueAt = function(time){
	return 0;
}
// --------------------------------------------------------------------
function WaveConstant(value){
	console.log(Wave);
	WaveConstant._.constructor.call(this);
	this._value = value;
}
Code.inheritClass(WaveConstant, Wave);
WaveConstant.prototype.valueAt = function(time){
	return this._value;
}
// --------------------------------------------------------------------
function WaveLine(offset, slope){
	WaveLine._.constructor.call(this);
	this._offset = offset;
	this._slope = slope;
}
Code.inheritClass(WaveLine, Wave);
WaveLine.prototype.valueAt = function(time){
	return this._offset + this._slope*time;
}
// --------------------------------------------------------------------
function WaveSinusoid(amplitude, period, phase){
	WaveSinusoid._.constructor.call(this);
	this._amplitude = amplitude;
	this._period = period;
	this._phase = phase;
}
Code.inheritClass(WaveSinusoid, Wave);
WaveSinusoid.prototype.valueAt = function(time){
	return this._amplitude * Math.sin(this._period*time + this._phase);
}
// --------------------------------------------------------------------
function WaveRandom(amplitude){
	WaveRandom._.constructor.call(this);
	this._amplitude = amplitude;
}
Code.inheritClass(WaveRandom, Wave);
WaveRandom.prototype.valueAt = function(time){
	return (Math.random()-0.5)*2.0*this._amplitude;
}
// --------------------------------------------------------------------
function WaveSum(waves){
	WaveSum._.constructor.call(this);
	this._waves = waves;
}
Code.inheritClass(WaveSum, Wave);
WaveSum.prototype.valueAt = function(time){
	var sum = 0;
	var waves = this._waves;
// console.log(waves);
	for(var i=0; i<waves.length; ++i){
		sum += waves[i].valueAt(time);
	}
// throw "here";
	return sum;
}
// --------------------------------------------------------------------
function Stock(wave){
	this._wave = wave;
	this._price = 0;
}
Stock.prototype.updateValue = function(time){
	var sum = this._wave.valueAt(time);
	this._price = sum;
}
Stock.prototype.price = function(){
	return this._price;
}
// --------------------------------------------------------------------

function Market(stocks,agents){
	this._agents = agents;
	this._stocks = stocks;
	this._timer = new TimeKeeper();
	this._duration = 100; // days
	// this._duration = 10;
	this._epsilon = 1.0/100.0; // 
}
Market.prototype.start = function(){
	// this._timer.start();

var values = [];
	var epsilon = this._epsilon;
	var duration = this._duration;
	var time = 0;
	var maxIterations = 1E5;
	var stocks = this._stocks;
	var agents = this._agents;
	var isDayStart = false;
	var isDayEnd = false;
	// initial
	for(var s=0; s<stocks.length; ++s){
		var stock = stocks[s];
		stock.updateValue(time);
	}
values.push(stocks[0].price());
	for(var i=0; i<maxIterations; ++i){
		if(isDayStart){
			for(var a=0; a<agents.length; ++a){
				var agent = agents[a];
				for(var s=0; s<stocks.length; ++s){
					var stock = stocks[s];
					agents[a].checkStockStart(stock, time);
				}
			}
			isDayStart = false;
		}

		for(var s=0; s<stocks.length; ++s){
			var stock = stocks[s];
			stock.updateValue(time);
		}

values.push(stocks[0].price());

		for(var a=0; a<agents.length; ++a){
			var agent = agents[a];
			for(var s=0; s<stocks.length; ++s){
				var stock = stocks[s];
				agents[a].checkStock(stock, time);
			}
		}
		var prevTime = time;
		var nextTime = time + epsilon;

		if(Math.floor(nextTime) > Math.floor(prevTime)){
			isDayStart = true;
			isDayEnd = true;
		}

		if(isDayEnd){
			for(var a=0; a<agents.length; ++a){
				var agent = agents[a];
				for(var s=0; s<stocks.length; ++s){
					var stock = stocks[s];
					agents[a].checkStockEnd(stock, time);
				}
			}
			isDayEnd = false;
		}
		var time = nextTime;

		
		if(time>=duration){
			console.log("DONE");
			break;
		}
	}

	for(var a=0; a<agents.length; ++a){
		var agent = agents[a];
		var delta = agent.deltaAssets();
		console.log(agent);
		console.log(a+" = "+delta);
	}


	var str = Code.printMatlabArray(values);
	console.log(str);
}