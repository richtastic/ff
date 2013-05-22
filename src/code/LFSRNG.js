// LFSRNG.js
// Linear Feedback Shift Register-Random Number Generator
LFSRNG.seedArr = function(arr, mod, add){
	var time = Code.getTimeMilliseconds() + (add?add:0);
	var i, len, t = new Array();
	i = 0;
	while(time>0 && i<5){
		t[i] = time % mod;
		//if(t[i]==0){t[i]=1;}
		time = Math.floor(time/10);
		++i;
	}
	var tLen = t.length;
	//
	len = arr.length;
	for(i=0;i<len;++i){
		if(i>=tLen){
			arr[i] = ( t[i%tLen] + t[(i+Math.floor(i/tLen))%tLen] + 0) % mod;
			/*if(arr[i]==0){
				arr[i] = (t[i%tLen] * t[(i+Math.floor(i/tLen))%tLen] + 1) % mod;
			}*/
		}else{
			arr[i] = t[i];
		}
	}
}

function LFSRNG(count, coeffs, regs){
	var self = this;
	this._registers = new Array();
	this._coefficients = new Array();
	this._mod = 10;
	this.length = function(cnt, coe, reg){
		if(arguments.length>0){
			var i, len;
			if(coe){
				len = coe.length;
				for(i=0;i<len;++i){
					self._coefficients[i] = coe[i];
				}
			}
			cnt +=1;
			while(self._coefficients.length<cnt){
				self._coefficients.push(0);
			}
			while(self._coefficients.length>cnt){
				self._coefficients.pop();
			}
			if(!coe){
				LFSRNG.seedArr(self._coefficients, self._mod);
			}
			cnt -=1;
			if(reg){
				len = reg.length;
				for(i=0;i<len;++i){
					self._registers[i] = reg[i];
				}
			}
			while(self._registers.length<cnt){
				self._registers.push(0);
			}
			while(self._registers.length>cnt){
				self._registers.pop();
			}
			if(!reg){
				LFSRNG.seedArr(self._registers, self._mod, 111111111);
			}
		}
		return self._registers.length;
	}
	this.current = function(){
		return self._registers[0];
	}
	this.next = function(){
		var i, len = self._registers.length;
		var lenm1 = len-1;
		var sop = 0;
		for(i=0;i<len;++i){
			sop += self._coefficients[i]*self._registers[i];
		}
		sop += self._coefficients[i];
		sop = sop % self._mod;
		var num = self._registers[0];
		for(i=0;i<lenm1;++i){
			self._registers[i] = self._registers[i+1];
		}
		self._registers[i] = sop;
		return num;
	}
	this.toString = function(){
		var str = "";
		var i, len = self._registers.length;
		for(i=0;i<len;++i){
			str = str + " " + self._coefficients[i] + "*[" + self._registers[i] + "] +";
		}
		str = str + " "+self._coefficients[i] ;
		return str;
	}
	 // ----- contsructor
	this.length(count?count:5, coeffs, regs);
}





