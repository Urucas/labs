/**
 * 
 * Developed at Urucas. (www.urucas.com)
 * 
 * info@urucas.com
 *
 * Enjoy!
 */

function _app() {

	this.characters  = [];
	this.viewport    = null;
	this.userFBID    = null;
	
	this.setViewport = function(id) {
	
		var vp = document.getElementById(id);
		if(vp == null) {
			console.log("viewport element not found");
			return;
		}
		this.viewport = vp;
		var that = this;
		this.viewport.addEventListener("click", function(event) {
			that.clearCharacterSelection();
		})

	}

	this.clearCharacterSelection = function() {
		var list = this.viewport.getElementsByClassName("dragme");
		for(var i=0; i<list.length;i++) {
			var n = list[i];
				n.classList.remove("selected");
		}
		this.selected = null;
	}

	this.selectCharacter = function(target) {
		this.clearCharacterSelection();
		this.selected = target.id;
		target.classList.add("selected");
		var h = target.offsetHeight;
		document.getElementById("characterRange").value = h;

	}

	this.charactersList = [
		{ src: "http://urucas.com/images/detail-canarios.png", id: "canario", },
		{ src: "http://urucas.com/images/detail-loro.png", id: "loro"},
		{ src: "http://urucas.com/images/detail-oruganaranja.png", id:"oruga"},
		{ src: "http://urucas.com/images/detail-ornero.png", id:"ornero"},
		{ src: "http://urucas.com/labs/dragndrop/img/uruca.png", id:"uruca", unique: true},
		{ src: "http://urucas.com/labs/dragndrop/img/urucas_purple_xsmall.png", id:"urucapurple", unique: true}
	]
	this.selected = null;
	
	this.addCharacter = function(cid) {		
		
		if(this.characters.legth == 10) {
			console.log("maximum reach");
			return;
		}
		var character = this.getCharacterData(cid);
		if(!character) return;

		if(character.unique != undefined && character.unique && app.alreadyAdded(cid)) {
			alert("Solo se permite agregar un unico elemento de ese tipo");
			return;
		}

		var nid = "character_"+(this.characters.length+1);

		var img = document.createElement("img");
			img.src = character.src;
			img.draggable = true;
			img.id=nid;
			img.classList.add("dragme");
			img.setAttribute("rel",character.id);

		img.onload = function() {
			img.style.top = app.viewport.offsetTop+"px";
			img.style.left = app.viewport.offsetLeft+"px";
		}

		var that = this;
		img.addEventListener("click",function(e){
			that.selectCharacter(e.target);
			event.stopPropagation();
			event.preventDefault();
		},false);

		img.addEventListener('dragstart',app.dragStart,false); 

		document.body.addEventListener('dragover',app.dragOver,false); 
		document.body.addEventListener('drop',app.drop,false);

		this.characters.push(img);
		this.viewport.appendChild(img);
	}

	this.dragOver = function(event) {
		event.preventDefault(); 
		return false; 
	}

	this.drop = function(event) {

		var offset = event.dataTransfer.getData("text/plain").split(',');
		var dm = document.getElementById(app.selected);
		var vp = app.viewport;

		var bounds = {
			x0: vp.offsetLeft,
			y0: vp.offsetTop,
			x1: vp.offsetLeft + vp.offsetWidth,
			y1: vp.offsetTop + vp.offsetHeight,
		}
		var xpos = event.clientX + parseInt(offset[0],10);
		var ypos = event.clientY + parseInt(offset[1],10)
		if(xpos < bounds.x0 || xpos > bounds.x1) { 
			return;
		}
		if(ypos < bounds.y0 || ypos > bounds.y1) {
			return;
		}

		dm.style.left = (event.clientX + parseInt(offset[0],10)) + 'px';
		dm.style.top = (event.clientY + parseInt(offset[1],10)) + 'px';

		// app.clearCharacterSelection();
		event.preventDefault();
		return false;
	}

	this.dragStart = function(event) {
		app.selectCharacter(event.target);
		var style = window.getComputedStyle(event.target, null);
		event.dataTransfer.setData("text/plain",
			(parseInt(style.getPropertyValue("left"),10) - event.clientX) + ',' + (parseInt(style.getPropertyValue("top"),10) - event.clientY));
	}

	this.getCharacterData = function(cid) {
		for(var i=0;i<this.charactersList.length;i++) {
			if(cid == this.charactersList[i].id) {
				return this.charactersList[i];
			}
		}
		return false;
	}

	this.alreadyAdded = function(cid) {
		for(var i=0;i<this.characters.length;i++) {
			var c = this.characters[i];
			if(cid == c.getAttribute("rel")) {
				return true;
			}
		}
		return false;
	}

	this.removeCharacter = function() {
		var el = document.getElementById(this.selected);
		if(el == null) {
			console.log("no character selected");
			return;
		}
		for(var i=0; i<this.characters.length;i++) {
			var c = this.characters[i];
			if(el.id = c.id) {
				var todel = i;
			}
		}
		if(todel != undefined) {
			this.characters.splice(todel,1);
			this.viewport.removeChild(el);
		}
	}

	this.resizeCharacter = function(val) {
		var el = document.getElementById(this.selected);
		if(el == null) {
			console.log("no character selected");
			return;
		}
		el.style.height = val + "px";	
	}

	this.setMainPicture = function(url) {
	
		if(url != undefined) {
		
			var ajax = new XMLHttpRequest();
		    ajax.open("GET","imagetobinary.php?imgURL="+url,false);
		    ajax.onreadystatechange = function() {
				if(ajax.readyState == 4) {
					var img = document.getElementById("main_picture");
					if(img == null) {
						var img = document.createElement("img");
							img.id = "main_picture";

						app.viewport.appendChild(img);
					}
					console.log(ajax.responseText);
					img.src = ajax.responseText;
					img.onload = function(){ 
						var w = img.width;
						var h = img.height;

						var x = h*830/w;
						img.width = 830;
						img.height = x;

						app.viewport.style.height = x+"px";
					}	
				}
		    }
		    ajax.send();
			return;
		}

		var f = document.getElementById("fileurl");
		if(f.files.length == 0) { return; }

		if (window.FileReader) {  
			if(url == undefined) {
				var file = document.getElementById("fileurl").files[0];
			}else {
				var file = url;
			}
			var reader = new FileReader();  
		    	reader.onloadend = function (e) {  
					console.log(e);
					var img = document.getElementById("main_picture");
					if(img == null) {
						var img = document.createElement("img");
						img.id = "main_picture";

					app.viewport.appendChild(img);
					}
					img.src = e.target.result;	
					img.onload = function(){ 
						var w = img.width;
						var h = img.height;

						var x = h*830/w;
						img.width = 830;
						img.height = x;

					app.viewport.style.height = x+"px";
					}				
				};  
		    reader.readAsDataURL(file);  
		}  
	}

	this.createCharactersMenu = function() {
		var xhtml = ""; 
		for(var i=0;i<this.charactersList.length;i++) {
			var c = this.charactersList[i];

			var chtml = [
				'<div id="'+c.id+'_button" onclick="app.addCharacter(\''+c.id+'\')">',
				' <img src="'+c.src+'" width="40px" height="40px" />',
				'</div>'
				].join("");
			xhtml += chtml;
		}
		return xhtml;
	}
	
	this.getFBPicture = function() {
		
		FB.ui('/me/albums', function(response) {
			console.log(response);
		});
	}

	this.postPicture = function(canvasData) {
		
		var ajax = new XMLHttpRequest();
		    ajax.open("POST",'imagetobinary.php',false);
		    ajax.onreadystatechange = function() {
				if(ajax.readyState == 4) {
               		var response = JSON.parse(ajax.responseText);
					app.lastFilename = response;
				}
		    }
		    ajax.setRequestHeader('Content-Type', 'application/upload');
		    ajax.send("imgData="+canvasData);
		
	}

	this.postFB = function() {
		FB.api('/'+app.userFBID+'/photos', 'post', {
	    	message:'Testing!',
			from: "http://urucas.com/labs/dragndrop",
			url:"http://urucas.com/labs/dragndrop/img/tmps/"+app.lastFilename, 
			}, function(response){
				if (!response || response.error) {
					alert("Ha ocurrido un error al publicar tu foto en facebook!");
				}
			}
		);
	}

	this.save = function() {
	
		var canvas = document.getElementById("canvas");
	
		var context = canvas.getContext('2d');
		
		var vp = this.viewport;
		var baseimage = new Image();
			baseimage.src = document.getElementById("main_picture").src;
			
		var that = this;
		baseimage.onload = function(e) {

			var x = baseimage.height*830/ baseimage.width;
			console.log(x);

			context.drawImage(baseimage, 0, 0, 830, x);

			var characters = that.characters;
			for(var i=0; i < characters.length;i++){
				var d = characters[i];
				var y = d.offsetTop - vp.offsetTop;
				var x = d.offsetLeft - vp.offsetLeft;				
				var	w = d.offsetWidth;
				var	h = d.offsetHeight;
				
				context.drawImage(d, x, y, w, h);
			}

			var img = canvas.toDataURL("image/png");
			document.getElementById("generatedimg").src = img;
			document.getElementById("downloadA").setAttribute("href",img);
			// app.postPicture(img);
		}
	}
}

var app = new _app();

window.addEventListener("load", function(){
	
	app.setViewport("div_viewport");

	document.getElementById("charactersButtons").innerHTML = app.createCharactersMenu();
}, false)



