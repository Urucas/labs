var app = new (function __app() {

	this.tries = 1;

	this.rel = [
		[1,2,3,4],
		[0,3,4,5],
		[0,3,6],
		[0,1,2,4,6,7],
		[0,1,3,5,6,7],
		[1,4,7],
		[2,3,4,7],
		[3,4,5,6]
	];

	this.values = [null,null,null,null,null,null,null,null];

	this.clear = function(pos) {
		console.log(pos);
		if(pos == undefined) {
			this.values = [null,null,null,null,null,null,null,null];
		}else {
			this.values[pos] = null;
		}
	}

	this.test = function(pos, value) {
		var vec = this.rel[pos];
		for(var i = 0; i < vec.length; i++) {
			var _pos = vec[i];
		//	console.log("["+pos+","+_pos+"]");
			var a = this.values[_pos];
			if(a==null) { 
				continue;
			}

			if(Math.abs(this.values[_pos] - value) == 1) {
				return _pos;
			}
		}
		return false;
	}

	this.set = function(pos, value) {
		this.values[pos] = value;
	}

	this.alreadyhas = function(pos, value) {
		for(var i=0; i<this.values.length;i++) {
			if(this.values[i] == value) return pos;
		}
		this.values[pos] = value;
		return false;
	}
	this.check = function() {
		for(var i =0; i < this.values.length; i++) {
			if(this.values[i] == null) { 
				return false;
			}
		}
		return true;
	}
})();

var inputs = document.querySelectorAll(".input-test");
for(var i = 0; i < inputs.length; i++) {
	inputs[i].onblur = function() {
		document.querySelector(".x-marks-the-spot").style.display = "none";
	}
	inputs[i].onkeydown = function() {
		document.querySelector(".x-marks-the-spot").style.display = "none";
	}
	inputs[i].onkeyup = function(e) {
		console.log(app.values);
		document.querySelector(".x-marks-the-spot").style.display = "none";
		pos = e.target.getAttribute("pos");
		app.clear(pos);

		if(e.target.value < 1 || e.target.value > 8) {
			e.target.value = "";
			return;
		}
		if(app.alreadyhas(pos, e.target.value)) {
			e.target.value="";
			return;
		}
		if((_pos = app.test(pos, e.target.value)) !== false) {
			// alert("Perdiste");
			for(var j=0;j<inputs.length;j++) {
			//	inputs[j].value = "";
			}
			
			var _x  = document.querySelector(".x-marks-the-spot");
			_x.style.display = "block";
			
			app.tries++;
			var _ints = document.querySelectorAll(".intentos");
			for(var j=0;j<_ints.length;j++) {
				_ints[j].innerText = app.tries;
			}
			document.getElementById("test-"+pos).value = "";
			app.clear(pos);
			return;
		}
		app.set(pos, e.target.value);

		if(app.check()) {
			document.getElementById("u-r-a-winner").style.display = "block";
		}
	}
}


/*     Watching the source code is cheating      */
/*************************************************/
/************           *           **************/
/************     3     *     5     **************/
/************           *           **************/
/*************************************************/
/*          *           *           *            */
/*     7    *     1     *     8     *      2     */
/*          *           *           *            */
/*************************************************/
/************           *           **************/
/************    4      *    6      **************/
/************           *           **************/
/*************************************************/
