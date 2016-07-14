// var ws = new WebSocket("ws://testagain.t5ciiurhqw.us-west-2.elasticbeanstalk.com");
 var ws = new WebSocket("ws://192.168.0.10:8080/");

var quickStartEnabled = true;

var abilityFont = "Permanent Marker";
var infoBoxTitleFont = "Permanent Marker";
var infoBoxTextFont = "Nunito";
var logButtonFont = "Permanent Marker";
var logTextFont = "Nunito";
var buttonFont = "Permanent Marker";
var portraitFont = "Permanent Marker";
var buttonFont = "Permanent Marker";
var iconFont = "Caesar Dressing";


function searchForOpponent() {
	ws.send("searchqueue,add");
	searchButton.disable();
	searchButton.setText(fighterSelectPaper.text(WIDTH/2, 50, "Searching...").attr("font-family", buttonFont).attr("font-size", 18));
}

 Raphael.fn.print_center = function(x, y, string, font, size, letter_spacing) {
    var path = this.print(x, y, string, font, size, 'baseline', letter_spacing);
    var bb = path.getBBox();

    var dx = (x - bb.x) - bb.width / 2;
    var dy = (y - bb.y) - bb.height / 2;

    return path.transform("t" + dx + "," + dy);
}


ws.onopen = function() {

};

ws.onmessage = function (evt) {

//alert(evt.data);
    var tokens = evt.data.split(",");
    if (tokens[0] == "startgame") {
    	startGame();
    } else if (tokens[0] == "indicatespots") {
    	
    	if (tokens[1].charAt(0) != 'n') { 
        	possibleMovesStr = evt.data;
        }
        showPossibleMoves(evt.data, true);
    } else if (tokens[0] == "move") {
        if (identifyFighter(tokens[1], tokens[2]) != null) {
            move(evt.data);
        } 
    } else if (tokens[0] == "moveQueue") {
        displayActionQueue(evt.data);
    } else if (tokens[0] == "indicate") {
        indicateActions(evt.data);
        actionQueueStr = evt.data;
     //   alert(actionQueueStr);
    } else if (tokens[0] == "reset") {
        reset();
    } else if (tokens[0] == "inititems") {
		initItems(evt.data);	
    } else if (tokens[0] == "energy" || tokens[0] == "health") {
        changeBars(evt.data);
    } else if (tokens[0] == "calculating") {
    	if (tokens[1] == "begin") {
    		calculateTurn(evt.data);
    	} else {
    		calculateTurn(evt.data);
    	}
    } else if (tokens[0] == "time") {
        displayTime(tokens[1], tokens[2]);
    } else if (tokens[0] == "clickable" || tokens[0] == "notclickable") {
        displayAbilities(evt.data);      
    } else if (tokens[0] == "removeabilities") {
    	displayAbiltiies("remove");
    } else if (tokens[0] == "animate") {
    	animate(evt.data);
    } else if (tokens[0] == "effecttt") {
    	createEffectTT(evt.data);
    } else if (tokens[0] == "itemdisplay") {
    	otherItemDisplay(evt.data);
    } else if (tokens[0] == "showgrid") {
		showGrid(evt.data);
    } else if (tokens[0] == "fighterselect") {
    	fighterSelect(evt.data);
    } else if (tokens[0] == "initialphaseend") {
    	initialPhaseEnd(evt.data);
    } else if (tokens[0] == "dead") {
    	death(evt.data);
    } else if (tokens[0] == "combatlog") {
    	combatLog(evt.data);
    } else if (tokens[0] == "chat") {
    	updateChatLog(evt.data);
    } else if (tokens[0] == "actionlog") {
    	updateActionLog(evt.data);
    } else if (tokens[0] == "morale") {
    	moraleBar(evt.data);
    } else if (tokens[0] == "revive") {
    	revive(evt.data);
    } else if (tokens[0] == "option"){
    	actionOptions(evt.data);    	
    } else if (tokens[0] == "fighterhover" || tokens[0] == "itemhover"){
    	selectHovers(evt.data);  	
    } else if (tokens[0] == "possiblemoves") {
    	possibleMovesStr = tokens[1];
    } else if (tokens[0] == "newfighter") {
        showPossibleMoves(",no moves", false);
        possibleMovesStr = "";  		
    } else if (tokens[0] == "transition") {
    	transition();
    } else if (tokens[0] == "fighterupdate") {
    	fighterUpdate(evt.data);
    } else if (tokens[0] == "gameover") {
    	gameOver(evt.data);
    }
};

ws.onclose = function() {
//    alert("Closed!");
};

ws.onerror = function(err) {
//    alert("Error: " + err);
};
var totalFighterNames = ["wolf", "fox", "lion", "turtle", "dove", "donkey"];
var totalFighterSelectPaths = ["wolf/wolfright.png","fox/foxright.png","lion/lionright.png","turtle/turtleright.png","dove/doveright.png","donkey/donkeyright.png"];
var totalItemPaths = ["firstaidkit.png", "warhorn.png", "oilbomb.png", "jestershat.png", "thiefgloves.png", "smokebomb.png"];
var totalItemNames = ["First Aid Kit", "War Horn", "Oil Bomb", "Coxcomb", "Gloves of Thievery", "Smoke Bomb"];
var WIDTH = 1080;
var HEIGHT = 675;
var paperX = window.screen.availWidth/2-540;
var paperY = window.screen.availHeight/2-338;
var blockColor = "#b3e9ea";
var attackColor = "#f0bfcd";
var supportColor = "#fffccb";
var moveColor = "#e0eea7";
var GAMEOVER = false;
//----------------------------------------------------------------------------------------------------------------------------------------------------------
var backgroundPaper = Raphael(window.screen.availWidth/2-550,window.screen.availHeight/2-348,1100,695);

var edge = backgroundPaper.rect(0,0,1100,695, 10).attr('fill', 'black');
var gridPaper = Raphael(window.screen.availWidth/2-540,window.screen.availHeight/2-338,1080,675);

var fighterSelectPaper = Raphael(window.screen.availWidth/2-540,window.screen.availHeight/2-338,1080,675);

var titleScreen = fighterSelectPaper.image("AmTitleScreen.jpg",0,0,1080,675);

var fightersSelected = [];
var itemsSelected = [];
var fighterSelectables = [];
var itemSelectables = [];
// var itemHoverRect = fighterSelectPaper.rect(75, 570, WIDTH - 150, 100).attr("fill", "white").attr("fill-opacity", 0.3);
var searchButton = new Button(fighterSelectPaper.rect(WIDTH/2 - 100, 30, 200, 40, 6).attr("fill", "yellow"), 
							  fighterSelectPaper.text(WIDTH/2, 50, "Search For Opponent").attr("font-family", buttonFont).attr("font-size", 18), 
							  fighterSelectPaper, searchForOpponent);
if (!quickStartEnabled) {							  
	searchButton.disable();	
}				  
for (var i = 0; i < totalItemPaths.length; i++) {

	var newItemSelectable = new ItemSelectable("items/" + totalItemPaths[i], i, totalItemNames[i], fighterSelectPaper.image("items/" + totalItemPaths[i], WIDTH/2-40, 250, 80,80), fighterSelectPaper.image("items/itembox" + (i%3 + 1) + ".png", WIDTH/2-40, 250, 80,80)
																								 , fighterSelectPaper.image("items/pressed" + totalItemPaths[i], WIDTH/2-40, 250, 80,80));
	itemSelectables.push(newItemSelectable);
}

itemSelectables.forEach(function(is) {
	is.getPic().click(function() {
	searchButton.disable();

	if (!(searchButton.getRect()[1].attr('text') == 'searching...')){
		if (!is.getSelected()) {

	if (itemsSelected.length < 3) {


		//	is.getRect().attr('stroke', 'white');
					is.setSelected(true);
					is.getPressedImage().show();
					is.getImage().hide();
					itemsSelected.push(is.getName());
				

			}
			if (itemsSelected.length == 3 && fightersSelected.length == 4) {
				searchButton.enable();
			}
		} else {
	//		is.getRect().attr('stroke', 'black');
			is.setSelected(false);
			is.getImage().show();
			is.getPressedImage().hide();
			var index = itemsSelected.indexOf(is.getName());
			searchButton.disable();
			itemsSelected.splice(index,1);
		}
		}
	});
});
//var fighterSelectRect = fighterSelectPaper.rect(75, 75, WIDTH - 150, 150);
//var fighterSelectRect = fighterSelectPaper.rect(75, 245, WIDTH - 150, 290);



var abil1Rect = new InfoBox (75, 245, (WIDTH - 150)/2 - 180, 160, fighterSelectPaper,"", 5,13);
var abil2Rect = new InfoBox(75, 405, (WIDTH - 150)/2 - 180, 160, fighterSelectPaper, "", 5,13);
var abil3Rect = new InfoBox((WIDTH - 150)/2 + 255, 245, (WIDTH - 150)/2 - 180, 160, fighterSelectPaper, "", 5,13);
var abil4Rect = new InfoBox((WIDTH - 150)/2 + 255, 405, (WIDTH - 150)/2 - 180, 160, fighterSelectPaper, "", 5,13);
var bpRect = new InfoBox((WIDTH - 150)/2 - 180 + 75, 525, 360, 40, fighterSelectPaper, "", 5,13);
var abilRects = [abil1Rect,abil2Rect,abil3Rect,abil4Rect,bpRect];

var itemRect = new InfoBox(WIDTH/2-140,240,280,295, fighterSelectPaper,"",120, 17);
itemRect.getRect().hide();
itemRect.setColor('white');
itemRect.setOpacity(0.6);


abilRects.forEach(function(a) {
	a.setOpacity(0.8);
	a.getRect().hide();
});

for (var i = 0; i < totalFighterNames.length; i++) {
	var newFighterSelectable = new FighterSelectable(totalFighterNames[i] + "/" + totalFighterNames[i] + "portraitleft.png", i, totalFighterNames[i], fighterSelectPaper.image(totalFighterSelectPaths[i],WIDTH/2-200, 150,400,400));
	fighterSelectables.push(newFighterSelectable);
}

function selectHovers(str) {
	var tokens = str.split(',');
	if (tokens[0] == "fighterhover") {
	if (tokens[1] == "in" ) {

		abilRects.forEach(function(a) {
			a.getRect().show();

		});
		setColorBasedOnType(abil1Rect, tokens[2]);
		abil1Rect.setInfo(tokens[3]);
		setColorBasedOnType(abil2Rect, tokens[4]);
		abil2Rect.setInfo(tokens[5]);
		setColorBasedOnType(abil3Rect, tokens[6]);
		abil3Rect.setInfo(tokens[7]);
		setColorBasedOnType(abil4Rect, tokens[8]);
		abil4Rect.setInfo(tokens[9]);
		setColorBasedOnType(bpRect, tokens[10]);
		bpRect.setInfo(tokens[11]);
	} else {
		abilRects.forEach(function(a) {
			a.getRect().hide();
			a.setInfo("");
		});

	}
	} else {
		if (tokens[1] == "in") {
			itemRect.setInfo(tokens[2]);
			itemRect.getRect().show();
		} else {
			itemRect.setInfo("");
			itemRect.getRect().hide();
		}
	}
}

function setColorBasedOnType(infobox, type) {
	   if (type == "attack") {
         infobox.getRect().attr("fill", attackColor);
    } else if (type == "support") {
         infobox.getRect().attr("fill", supportColor);
    } else if (type == "block") {
         infobox.getRect().attr("fill", blockColor);
    } else if (type == "passive") {
   	 	infobox.getRect().attr("fill", moveColor);
    }
}

fighterSelectables.forEach(function(fs) {
	fs.getPortrait().click(function() {
	searchButton.disable();
	
		if (!(searchButton.getRect()[1].attr('text') == 'searching...')){
		if (!fs.getSelected()) {
			if (fightersSelected.length < 4) {
				fs.getCircle().attr('stroke', 'white');
				fs.setSelected(true);
				fightersSelected.push(fs.getName());
			}
			if (fightersSelected.length == 4 && itemsSelected.length == 3) {
				searchButton.enable();
			}

		} else {
			fs.getCircle().attr('stroke', 'black');
			fs.setSelected(false);
			var index = fightersSelected.indexOf(fs.getName());
			searchButton.disable();
			fightersSelected.splice(index,1);
		}
		}
	});
});

function FighterSelectable(imageName, pos, name, fullImage) {
	this.x = WIDTH/2 - 115 * (totalFighterNames.length/2) + 115 *pos + 55;
	this.y = 140;
	this.image = fighterSelectPaper.image(imageName, this.x - 50 , this.y - 50, 100, 100);
	this.circle = fighterSelectPaper.circle(this.x, this.y, 50).attr("fill", "#fff").attr('fill-opacity', '0').attr('stroke-width', '3');
	this.portrait = fighterSelectPaper.set(this.image, this.circle);
	this.fullImage = fullImage;
	fullImage.hide();
	this.name = name;
	this.portrait.hover(
		function() {
		fullImage.show();
			ws.send("hover,in,fighter,select," + name);
			document.body.style.cursor = 'pointer';


			
		},
		function () {
		fullImage.hide();
			ws.send("hover,out,fighter,select," + name);
			document.body.style.cursor = 'auto';

		}
	);

	this.selected = false;

	this.setSelected = function(selected) {this.selected = selected}
	this.getSelected = function () {return this.selected};
	this.getPortrait = function () {return this.portrait};
	this.getCircle = function(){return this.circle};
	this.getName = function(){return this.name};
}

function ItemSelectable(imageName, pos, name, hoverImage, hoverBox, pressedImage) {

	this.x = WIDTH/2 + 10 - 110*3 + 110*pos;
	this.y = 570;
	this.image = fighterSelectPaper.image(imageName, this.x, this.y, 100, 100);
	this.pressedImage = pressedImage;
	this.pressedImage.attr({x: this.x, y: this.y, width: 100, height: 100});
	this.pic = fighterSelectPaper.set(this.image, this.pressedImage);
	this.name = name;
	this.pressedImage.hide();
	hoverImage.hide();
	hoverBox.hide();
	this.getImage = function() {return this.image};
	this.getPressedImage = function() {return this.pressedImage};
	this.pic.hover(
		function() {
			ws.send("hover,in,item,select," + name);
			document.body.style.cursor = 'pointer';
			hoverImage.show();
			hoverBox.show();
			hoverBox.toFront();
			hoverImage.toFront();

		},
		function () {
			ws.send("hover,out,item,select," + name);
			document.body.style.cursor = 'auto';
			hoverImage.hide();
			hoverBox.hide();
		}
	);
	this.selected = false;
	this.setSelected = function(selected) {this.selected = selected};
	this.getSelected = function () {return this.selected};
	this.getPic = function () {return this.pic};
	this.getName = function(){return this.name};
	
}




//-----------------------------------------------------------------------------------------------------------------------------------------------------------



gridPaper.setViewBox(0,0,0,0,true);
var initialCalcQueue = true;

//gridPaper.setViewBox(0,0,1680,984,true);
//gridPaper.setSize(1680, 984)
//var background = gridPaper.rect(0,0,0,0);


var background = gridPaper.image("background.png", 0,0,1080,675);
var backgroundBottom = gridPaper.image("backgroundbottom.png", 0,HEIGHT/2 - 40,1080,675 - (HEIGHT/2 - 40));
var leftPortraitFrames = gridPaper.image("portraitframes.png", 0,0,366,152).hide();
var rightPortraitFrames = gridPaper.image("portraitframesright.png", WIDTH-366, 0, 366, 152).hide();
var iconY = 330;

var actionBarFrame = gridPaper.image("actionbarframe.png", 120, iconY - 12, WIDTH - 240, 90).hide();
var SIDE;
var sideFighters;

var calculating = false;
//var timeText = gridPaper.text(900, 700, "0/10");

var abilityPaper;
var abilities = [];
var icons = [];
var locked = false;
var initialPhase = true;
var actionQueueStr;
var possibleMovesStr;
var abilitySelected = false;

var item1;
var item2;
var item3;
var items = [item1, item2, item3];
var otherItems = [];
var itemsChosen = [];
var itemBeingDragged = false;


//var infoBoxBackground = gridPaper.image("gameinfobackground.png", 75, 465, (WIDTH/2 - 240) - 75, HEIGHT-480);

var logBackground = gridPaper.image("chatbackground.png", WIDTH/2 + 260, 430, WIDTH/2 - 240 - 50, HEIGHT-445).toFront().hide();
hideLogButtonsAndText();
var log = document.getElementById('wrapper');
log.style.width = "225px";
log.style.height = HEIGHT - 450 + "px";
var leftPos = paperX + WIDTH/2 + 270;
var topPos = paperY + 435;
log.style.left = leftPos + "px";

log.style.top = topPos + "px";
// document.getElementsByName('message')[0].style.width = "225px";


var leftFighters = [];
var rightFighters = [];
var fighters = [];

function startGame() {
	if (fightersSelected.length == 0) {
		ws.send("select," + fighterSelectables[0].getName() + "," + fighterSelectables[1].getName() + "," + fighterSelectables[2].getName() + "," + fighterSelectables[3].getName() + "," + itemSelectables[0].getName() + "," + itemSelectables[1].getName() + "," + itemSelectables[2].getName());
	}
	else {
		ws.send("select," + fightersSelected[0] + "," + fightersSelected[1] + "," + fightersSelected[2] + "," + fightersSelected[3] + "," + itemsSelected[0] + "," + itemsSelected[1] + "," + itemsSelected[2]);
	}
	gridPaper.setViewBox(0,0,WIDTH,HEIGHT,true);
	itemsChosen = itemsSelected;	
	document.getElementById('wrapper').style.visibility="visible";
//	document.getElementById('play').parentNode.removeChild(document.getElementById('play'));
	fighterSelectPaper.remove();

}

// var rightBar = gridPaper.rect(WIDTH/2-100, 7, 200, 20).attr('fill','blue');
// var leftBar = gridPaper.rect(WIDTH/2-100, 7, 100, 20).attr('fill','orange');
var moraleCircles = gridPaper.set();
for (var i = 0; i < 10; i++) {
	var circle = gridPaper.circle(WIDTH/2-100 + i * 22, 9, 8);
	if (i < 5) {
		circle.attr('fill', '#FFD997');
	} else {
		circle.attr('fill', '#98BEFF');
	}
	
	moraleCircles.push(circle);

}
moraleCircles.hide();


function moraleBar(str) {
	var tokens = str.split(",");
	if (tokens[2] == "left") {
		for (var i = 0; i < 10; i++) {
			if (i < tokens[1]) {
				moraleCircles[i].attr('fill', '#FFD997');
			} else {
				moraleCircles[i].attr('fill', '#98BEFF');
			}
		}
	} else {
		for (var i = 9; i >= 0; i--) {
			if (i > 9 - tokens[1]) {
				moraleCircles[i].attr('fill', '#98BEFF');
			} else {
				moraleCircles[i].attr('fill', '#FFD997');
			}
		}
	}
}



function actionOptions(str) {
	var tokens = str.split(",");
	var toShowOptions = [];
	for (var i = 3; i < tokens.length; i = i + 2) {
		toShowOptions.push(identifyFighter(tokens[i], tokens[i+1]));	
	}
	if (tokens[1] == "remove") {
		showPossibleMoves(possibleMovesStr, false);
		abilitySelected = false;
		abilities.forEach(function(a){
			if (tokens[2] == a.getName()) {
				a.setClicked(false);
				a.getRect().attr("fill-opacity", 0);
				a.getRect().attr("fill", "white");				
    		}
		});
		fighters.forEach(function(f) {
			f.hideAttackOption();
			f.hideSupportOption();
			f.hideBlockOption();
			f.getClickBox().unhover();
			f.getClickBox().hover(
				function() {			
					document.body.style.cursor = 'pointer';					
					f.updateInfoBox();
					infoBox.show();
				},
				function () {
					document.body.style.cursor = 'auto';
					infoBox.hide(false);
				}
			);
			f.getPortraitClickBox().unhover();
			f.getPortraitClickBox().hover(
				function() {			
					document.body.style.cursor = 'pointer';
					f.updateInfoBox();
					infoBox.show();
				},
				function () {
					document.body.style.cursor = 'auto';
					infoBox.hide(false);
				}
		);
		});
	} else {
		showPossibleMoves(",no moves", false);
		abilitySelected = true;
		abilities.forEach(function(a){
			if (a.getName() == tokens[2]) {
				a.setClicked(true);
    	  		a.getRect().attr("fill", "#999999");
				a.getRect().attr("fill-opacity", 0.5);    	  	
			}
		 });
		toShowOptions.forEach(function(f){
		var st = gridPaper.set();

		st.push(f.getClickBox());

		st.push(f.getPortraitClickBox());

		st.forEach(function (a) {
	
		a.hover(
			
			function() {
				if (tokens[1] == "attack") {
					f.showAttackOption();
				} else if (tokens[1] == "support") {
					f.showSupportOption();
				} else if (tokens[1] == "block") {
					f.showBlockOption();
				}
			},
			function () {
				if (tokens[1] == "attack") {
					f.hideAttackOption();
				} else if (tokens[1] == "support") {
					f.hideSupportOption();
				} else if (tokens[1] == "block") {
					f.hideBlockOption();
				}
			}
		);	
	});
	});
	}
}

function updateChatLog(str) {

	var tokens = str.split(",");
	var str = tokens[1] + ": " + tokens[2];
	var p = document.createElement("p");
	p.innerHTML = str;
	p.style.fontFamily = logTextFont;
	p.style.fontSize = 10;
	textArea = document.getElementById("chattextarea");
	textArea.appendChild(p);
	textArea.scrollTop = textArea.scrollHeight;
	
}
function updateActionLog(str) {
	var tokens = str.split(",");
	var str = tokens[1];
	var p = document.createElement("p");
	p.innerHTML = str;
	p.style.fontFamily = logTextFont;
	p.style.fontSize = 10;
	textArea = document.getElementById("actiontextarea");
	textArea.appendChild(p);
	textArea.scrollTop = textArea.scrollHeight;
}

function chatLogButton() {
	document.getElementById("chatlog").disabled=true;
	document.getElementById("actionlog").disabled=false;
	document.getElementById("actiontextarea").style.visibility="hidden";
	document.getElementById("chattextarea").style.visibility="visible";
	
}
function actionLogButton() {
	document.getElementById("chatlog").disabled=false;
	document.getElementById("actionlog").disabled=true;
	document.getElementById("chattextarea").style.visibility="hidden";
	document.getElementById("actiontextarea").style.visibility="visible";
	
}
function hideLogButtonsAndText() {
	document.getElementById("actionlog").style.visibility="hidden";
	document.getElementById("chatlog").style.visibility="hidden";
	document.getElementById("chattextarea").style.visibility="hidden";
	document.getElementById("actiontextarea").style.visibility="hidden";
	document.getElementById("usermsg").style.visibility="hidden";
}
function showLogButtonsAndText() {
	document.getElementById("actionlog").style.visibility="visible";
	document.getElementById("chatlog").style.visibility="visible";
	if (document.getElementById("chatlog").disabled) {
		document.getElementById("chattextarea").style.visibility="visible";
	} else {
		document.getElementById("actiontextarea").style.visibility="visible";
	}
	document.getElementById("usermsg").style.visibility="visible";

}
function test(str) {

 document.getElementsByName('message')[0].reset();
 ws.send("chat," + str + ",chat,chat,chat");
 
 return false;
}

// var layoutrect = gridPaper.rect(75, 465, WIDTH - 150, HEIGHT - 480).attr("fill", "purple").attr("fill-opacity", "0.1");
var infoBoxBackground = gridPaper.image("gameinfobackground.png", 30, 430, (WIDTH/2 - 240) - 50, HEIGHT-445).hide();
var infoBox = new InfoBox(30, 430, (WIDTH/2 - 240) - 50, HEIGHT-445, gridPaper, "Game Info", 30,15);
infoBox.hide(true);
infoBox.getRect().remove();




function InfoBox(x, y, width, height, paper, title, distanceFromTop, fontSize) {
	this.x = x;
	this.width = width;
	this.y = y;
	this.height = height;
	this.fontSize = fontSize;
	this.rect = paper.rect(this.x,this.y,this.width,this.height).attr("fill", "black").attr("fill-opacity", "0.1");	
	this.getRect = function() {return this.rect;}
	this.getY = function() {return this.y;}
	this.info = paper.text(this.x + 5, this.y + 30, "").
		attr({"text-anchor":"start", "font-family": infoBoxTextFont});
	this.setColor = function(color) {this.rect.attr("fill",color)};
	this.setOpacity = function(opacity){this.rect.attr("fill-opacity", opacity);}
	this.setInfo = function(str) {this.info.remove();this.info = paper.text(this.x + 5, this.y + distanceFromTop, str).attr("text-anchor","start").attr("font-size", this.fontSize).attr("font-family", infoBoxTextFont); alignTop(this.info);}
	this.hide = function(titleToo) {this.rect.hide(); this.info.hide(); if (titleToo) {this.title.hide();}}
	this.show = function() {this.rect.show(); this.title.show(); this.info.show();}
	this.title = paper.text(this.x + this.width/2, this.y + 10, title)
	.attr({"font-size": 16, "font-family": infoBoxTitleFont});
	this.title.node.setAttribute("class","donthighlight");
	this.info.node.setAttribute("class","donthighlight");
	this.setFontSize = function(fs) {this.info.attr('font-size', fs);
									this.fontSize = fs;}
	this.move = function(y) {
		this.y = y;
		this.height = this.rect.attr('height');
		this.title.attr('y', this.y + 10);
		this.info.attr('y', this.y + 30); 
		alignTop(this.info);
	}; 
}



function revive(str) {
	var tokens = str.split(',');
	var fighter = identifyFighter(tokens[1], tokens[3]);

	move("a," + tokens[1] + ',' + tokens[3] + ',' + tokens[2] + ',' + 300);

    setTimeout(function() {    		
		fighter.getImage().show();
		fighter.getAltImage().show();
		fighter.getClickBox().show();
		fighter.getScreen().hide();
	},250);

}

function death(str) {
	var tokens = str.split(',');
	var fighter = identifyFighter(tokens[1], tokens[2]);
	fighter.getImages().hide();
	fighter.getImage().hide();
	fighter.getClickBox().hide();
	fighter.getScreen().show();
	changeBars("energy," + tokens[1] + "," + tokens[2] + "," + 0);
	changeBars("health," + tokens[1] + "," + tokens[2] + "," + 0);
	var origLength = fighter.getEffecttts().length;
	for (var i = 0; i < origLength; i++) {
		createEffectTT("effecttt,remove," + tokens[1] + "," + tokens[2] + "," + 0);
	}
}

function initialPhaseEnd(str) {
	
    		readyButton.getRect()[0].attr('fill','yellow');
    		readyButton.getRect()[1].attr('text','Fight!');
	leftPortraitFrames.show();
	rightPortraitFrames.show();
	var tokens = str.split(',');
	initialPhase = false;

	var f1 = identifyFighter(tokens[1], tokens[2]);
	var s1 = identifySpot(tokens[3]);
	var f2 = identifyFighter(tokens[4], tokens[5]);
	var s2 = identifySpot(tokens[6]);
	var f3 = identifyFighter(tokens[7], tokens[8]);
	var s3 = identifySpot(tokens[9]);
	var f4 = identifyFighter(tokens[10], tokens[11]);
	var s4 = identifySpot(tokens[12]);
	var f5 = identifyFighter(tokens[13], tokens[14]);
	var s5 = identifySpot(tokens[15]);	
	var f6 = identifyFighter(tokens[16], tokens[17]);
	var s6 = identifySpot(tokens[18]);
	var f7 = identifyFighter(tokens[19], tokens[20]);
	var s7 = identifySpot(tokens[21]);
	var f8 = identifyFighter(tokens[22], tokens[23]);
	var s8 = identifySpot(tokens[24]);
	var ftrs = [f1,f2,f3,f4,f5,f6,f7,f8];
	var spts = [s1,s2,s3,s4,s5,s6,s7,s8];
	spots.forEach(function(s) {
		s.getPolygon().attr("stroke-width", 0);
	});
	for(var i = 0; i < 8; i++) {
		ftrs[i].setX(spts[i].getFighterX());
		ftrs[i].setY(spts[i].getFighterY());
		if (ftrs[i].getY() == midFighterY) {
			ftrs[i].getImage().animate({transform: 's0.95'});
			ftrs[i].getImages().forEach(function(fi){
				fi.animate({transform: 's0.95'});
			});
			ftrs[i].getClickBox().animate({transform: 's0.95'});
			
    	} else if (ftrs[i].getY() == benchFighterY) {
    		ftrs[i].getImage().animate({transform: 's0.97'});
			ftrs[i].getImages().forEach(function(fi){
				fi.animate({transform: 's0.97'});
			});
			ftrs[i].getClickBox().animate({transform: 's0.97'});
    	} else if (ftrs[i].getY() == topFighterY) {   		
			ftrs[i].getImage().animate({transform: 's0.90'});
			ftrs[i].getImages().forEach(function(fi){
				fi.animate({transform: 's0.90'});
			});
			ftrs[i].getClickBox().animate({transform: 's0.90'});
    	}

		ftrs[i].getToken().getPortrait().hide();
		
    	if (ftrs[i].getY() == leftTopBackSpot.getFighterY()) {
    		ftrs[i].getImage().insertBefore(topRow);    	
    		ftrs[i].getImages().insertBefore(topRow);    
		}  else if (ftrs[i].getY() == leftMiddleBackSpot.getFighterY()) {
    		ftrs[i].getImage().insertBefore(middleRow);
    		ftrs[i].getImages().insertBefore(middleRow);        		
    	} else if (ftrs[i].getY() == benchFighterY) {
    		ftrs[i].getImage().insertBefore(benchRow);
    		ftrs[i].getImages().insertBefore(benchRow);   
    	} else {
    		ftrs[i].getImage().insertBefore(botRow);
    		ftrs[i].getImages().insertBefore(botRow);    
    	}
    	ftrs[i].getPortraitClickBox().show();
    	ftrs[i].getClickBox().attr('x', spts[i].getFighterX() + 20).attr('y', spts[i].getFighterY() + 40).show();
		ftrs[i].getImages().attr('x', spts[i].getFighterX()).attr('y', spts[i].getFighterY());
		ftrs[i].getImage().attr('x', spts[i].getFighterX()).attr('y', spts[i].getFighterY()).show();
		ftrs[i].getAltImage().show();
		ftrs[i].getPortrait().show();
		moraleCircles.show();
		
	}	
	ftrs.forEach(function (f) {
		if (f.getY() == leftMiddleFrontSpot.getFighterY()) {
			f.getClickBox().toFront();
		} 
	});
	ftrs.forEach(function (f) {
		if (f.getY() == leftBottomFrontSpot.getFighterY()) {
			f.getClickBox().toFront();
		} 
	});
	actionBarFrame.show();
	logBackground.show();
	infoBoxBackground.show();
	showLogButtonsAndText();
	infoBox.show();
	locked = false;
}

function showGrid(str) {	
	var sideSpots;
	var tokens = str.split(",");
	SIDE = tokens[1];
    	if (tokens[1] == "left") {
    		leftSpots.forEach(function(s) {
    			s.getPolygon().attr("stroke-width", "1");
    		});  
    		sideFighters = leftFighters;  
    		sideSpots = leftSpots;		
    	} else {
    	    rightSpots.forEach(function(s) {
    			s.getPolygon().attr("stroke-width", "1");
    		});
    		sideFighters = rightFighters;
    		sideSpots = rightSpots;
    	}
    	sideFighters[3].getToken().getPortrait().toFront();
    	if (SIDE == "left") {
			sideFighters[3].getToken().getPortrait()[0].attr({x : leftBench.getFighterX() + 70, y : benchFighterY + 110});
			sideFighters[3].getToken().getPortrait()[1].attr({cx : leftBench.getFighterX() + 95, cy : benchFighterY + 135});
			sideFighters[3].getToken().setSpot(leftBench);
			leftBench.setPositionedAt(true);
		} else {
			sideFighters[3].getToken().getPortrait()[0].attr({x : rightBench.getFighterX() + 70, y : benchFighterY + 110});
			sideFighters[3].getToken().getPortrait()[1].attr({cx : rightBench.getFighterX() + 95, cy : benchFighterY + 135});
			sideFighters[3].getToken().setSpot(rightBench);
			rightBench.setPositionedAt(true);
		}

    	sideFighters.forEach(function(sf) {
			var lx = 0;
			var ly = 0;
    		sf.getToken().getPortrait().drag(			
    		function(dx, dy) {
    			if (!locked) {
    				sf.getToken().getPortrait().transform('t' + dx + ',' + dy);
    				lx = dx;
    				ly = dy;
    			}
    		},
			function() {
				

			},
			function (dx, dy) {
			if (!locked) {
				var token = sf.getToken();
				token.getPortrait().transform('t' + -dx + ',' + -dy);
				sideSpots.forEach(function(ss) {
					if (ss.getPolygon().isPointInside(dx.x - paperX, dx.y - paperY) && !ss.getPositionedAt()) {
						token.getPortrait().toFront();
						if (token.getSpot() != null) {
							token.getSpot().setPositionedAt(false);
						}
						token.setSpot(ss);
						ss.setPositionedAt(true);
							token.getPortrait()[0].attr({x : ss.getFighterX() + 70, y : ss.getFighterY() + 110});
							token.getPortrait()[1].attr({cx : ss.getFighterX() + 95, cy : ss.getFighterY() + 135});										
					}
				
				});
			}
			}
		);
    	});

}

// var linerinos = gridPaper.set();
// for (var i = 0; i < WIDTH; i += 10) {
//	var l = gridPaper.path('M' + i + ',' + 0 + ' L ' + i + ',' + HEIGHT).attr("stroke-width", 1).attr("stroke-opacity", 0.3);
//	linerinos.push(l);
//}
//for (var i = 0; i < HEIGHT; i += 10) {
//	var l = gridPaper.path('M' + 0 + ',' + i + ' L ' + WIDTH + ',' + i).attr("stroke-width", 1).attr("stroke-opacity", 0.3);
//	linerinos.push(l);
//}


function fighterSelect(str){
	var newFighter;
	var bigTokens = str.split("|");
	
    for (var i = 1; i < bigTokens.length -1; i++) {
        var tokens = bigTokens[i].split(",");
        newFighter = new Fighter(tokens[0], tokens[1], tokens[2], tokens[3], i - 1, tokens[4], tokens[5]);  
        newFighter.getClickBox().toFront();
	 leftPortraitFrames.toFront();
	 rightPortraitFrames.toFront();
   		fighters.push(newFighter);
   		if (tokens[3] == "right") {
   			rightFighters.push(newFighter);
   		} else {
   			leftFighters.push(newFighter);
   		} 	   
    }
    leftFighters.forEach(function(lf) {
    	lf.getPortraitClickBox().toFront();
    	lf.getClickBox().click(function() {
            if (!calculating) {
            	ws.send("click,fighter," + lf.getName() + ",left");         	
        	}
        })
    });
    rightFighters.forEach(function(rf) {
    	rf.getPortraitClickBox().toFront();
    	rf.getClickBox().click(function() {
            if (!calculating) {
            	ws.send("click,fighter," + rf.getName() + ",right");          	
        	}
        })
    });
}

function transition() {
    logBackground.attr({"clip-rect": (logBackground.attr('x') + " " + (logBackground.attr('y') + 110) + " " + logBackground.attr('width') + " " + (logBackground.attr('height') - 110))});
    infoBoxBackground.attr({"clip-rect": (infoBoxBackground.attr('x') + " " + (infoBoxBackground.attr('y') + 110) + " " + infoBoxBackground.attr('width') + " " + (infoBoxBackground.attr('height') - 110))});
    readyButton.getRect().hide();
    actionBarFrame.hide();
    fighters.forEach(function(f) {
        	f.unindicateAttack(); 
        	f.unindicateSupport(); 
        	f.unindicateBlock();
   	});
   	infoBox.setFontSize(10);
   	log.style.height = HEIGHT - 590 + "px";
	infoBox.move(infoBox.getY() + 110);
	log.style.top = paperY + infoBox.getY() + "px";
    items.forEach(function(item) {
    	if(item.getPic() != null && !item.isQueued()) {
        		item.getPic().hide();
        }
    });
    opponentPaper.hide();
	myPaper.hide();
	displayAbilities("remove");
	upperRect.attr('y', actionBarFrame.attr('y')).show();
	lowerRect.attr('y', actionBarFrame.attr('y')).show();
	lowerRect.animate({y: lowerFrameY},750);	
}

function calculateTurn(str) {

	var tokens = str.split(",");
    if (tokens[1] == "begin") {
		timeBar();         
		var i = 0;
        items.forEach(function(item) {	
        	if (item.isQueued()) {
        		item.getMiniPic().show();
        		var lineX = item.getLine().getPointAtLength().x;
        		item.getLine().attr('y', '480');
        		item.getPic().attr('y', '444');	
       			item.getLine().toFront();
    		}
    		i++;
     	});		
        calculating = true;
            
    } else { 

    		actionBarFrame.show();
        	while(otherItems.length	> 0) {
        		otherItem = otherItems.pop();
        		otherItem.getPic().remove();
        		otherItem.getLine().remove();
        		otherItem.getMiniPic().remove();
        	}
       		fighters.forEach(function(f) {

            	for (var i = 0; i < f.getEffecttts().length; i++) {
        			f.getEffecttts()[i].setDuration(f.getEffecttts()[i].getDuration() -1);
        		}
        	});
 

        	log.style.height = HEIGHT - 450 + "px";
        	logBackground.attr({"clip-rect": (logBackground.attr('x') + " " + logBackground.attr('y') + " " + logBackground.attr('width') + " " + logBackground.attr('height'))});
    		infoBoxBackground.attr({"clip-rect": (infoBoxBackground.attr('x') + " " + infoBoxBackground.attr('y') + " " + infoBoxBackground.attr('width') + " " + infoBoxBackground.attr('height'))});
        	infoBox.move(infoBox.getY() - 110);  
        	infoBox.setFontSize(15);
        	log.style.top = topPos + "px";

        	document.getElementById("usermsg").style.visibility="visible";
        	
        	for (var i = 0; i < items.length; i++) {
        		if (items[i].isQueued()) {
        			items.splice(i,1);
        		}
        	}
        	for (var i = 0; i < itemsChosen.length; i++) {
        		if (itemsChosen[i].isQueued()) {
        			itemsChosen.splice(i,1);
        		}
        	}
    items.forEach(function(item) {
    	if(item.getPic() != null && !item.isQueued()) {
        		item.getPic().show();
        }
    });	
        	readyButton.getRect()[0].attr('fill','yellow');
    		readyButton.getRect()[1].attr('text','Fight!');
    		readyButton.getRect().show();
        	calculating = false; 
        }

}


function otherItemDisplay(str) {
	
	var tokens = str.split(",");
	var otherItem = new Item(tokens[1], tokens[2], tokens[3], tokens[4]);
	otherItem.getPic().hide();
	var otherItemMiniPic = otherItem.getMiniPic();
	otherItemMiniPic.show();
	var newX = tokens[5] * 0.1*(WIDTH-260) + 130;

	var newNewX = newX;
	otherItems.forEach(function(it) {
		if (it.getPic()[0].attr('x') == newX && it != otherItem) {
			otherItems.forEach(function(ite) {
				if (ite.getPic()[0].attr('x') == newX + 30 && ite != otherItem) {
					newNewX += 30;
				}
			});
		newNewX += 30;
		}
	});

	otherItemMiniPic.attr('x', newNewX).attr('y', otherItemY);
	otherItem.getPic().forEach(function(n){   
		n.attr('x', newNewX).attr('y', otherItemY);
	});
	
	otherItemMiniPic.hover(
		function() {
			document.body.style.cursor = 'pointer';
			infoBox.setInfo(otherItem.getDescription());
		},
		function () {
			document.body.style.cursor = 'auto';
			infoBox.setInfo("");
		}
	);
	line = gridPaper.path("M" + (newX) + " " + (iconY + 100) + " L " + (newX)  + " " + (otherItemY + 25)).attr('stroke', 'white').attr('stroke-width', '1');					
	otherItem.setLine(line);
	otherItems.push(otherItem);

}

function initItems(str) {

	var bigTokens = str.split("|");
	if (!initialPhase) {
		var newItem;
	    for (var i = 1; i < bigTokens.length -1; i++) {
	    	var tokens = bigTokens[i].split(",");
	    	newItem = new Item(tokens[0], tokens[1], tokens[2], tokens[3]);
        	items.push(newItem);  
        	itemsChosen.push(newItem);
   		}
   		newItem.getPic().hide();
   		    	newItem.getPic().click(function() {
    		if (!locked) {
    			if (itemsChosen.indexOf(newItem) != -1) {
    				itemsChosen[itemsChosen.indexOf(newItem)] = null;
    				newItem.getPic().attr({y : newItem.getY(), x: newItem.getX()});
    			} 
    		}
    	});
    	newItem.getMiniPic().itemDraggable(newItem.getImage().attr('x'), newItem.getImage().attr('y'), newItem.getImage(), newItem);
		newItem.getPic().itemDraggable(newItem.getImage().attr('x'), newItem.getImage().attr('y'), newItem.getImage(), newItem);
		newItem.getPic().hover(
			function() {
				document.body.style.cursor = 'pointer';
				infoBox.setInfo(newItem.getDescription());
			},
			function () {
			document.body.style.cursor = 'auto';
			infoBox.setInfo("");
			}
		);		
		
		newItem.getMiniPic().hover(
			function() {
				document.body.style.cursor = 'pointer';
				infoBox.setInfo(newItem.getDescription());
			},
			function () {
			document.body.style.cursor = 'auto';
			infoBox.setInfo("");
			}
		);
	} else {
    for (var i = 1; i < bigTokens.length -1; i++) {
        var tokens = bigTokens[i].split(",");
        items[i -1] = new Item(tokens[0], tokens[1], tokens[2], tokens[3]);  
    }
    
    itemsChosen = items;
    items.forEach(function(item) {
    	item.getPic().click(function() {
    		if (!locked) {
    			if (itemsChosen.indexOf(item) != -1) {
    				itemsChosen[itemsChosen.indexOf(item)] = null;
    				item.getPic().attr({y : item.getY(), x: item.getX()});
    			} 
    		}
    	});
    	item.getMiniPic().itemDraggable(item.getImage().attr('x'), item.getImage().attr('y'), item.getImage(), item);
		item.getPic().itemDraggable(item.getImage().attr('x'), item.getImage().attr('y'), item.getImage(), item);
		item.getPic().hover(
			function() {
				document.body.style.cursor = 'pointer';
				infoBox.setInfo(item.getDescription());
			},
			function () {
			document.body.style.cursor = 'auto';
			infoBox.setInfo("");
			}
		);		
		
		item.getMiniPic().hover(
			function() {
				document.body.style.cursor = 'pointer';
				infoBox.setInfo(item.getDescription());
			},
			function () {
			document.body.style.cursor = 'auto';
			infoBox.setInfo("");
			}
		);
	});
	}
	
	
}

function Effect(x, y, imgName, source, duration, effect) {
	this.img = gridPaper.image("EffectSigns/" + imgName, x, y - 24, 15, 15);
	this.img.hover(
		function() {
			document.body.style.cursor = 'pointer';
		},
		function () {
			document.body.style.cursor = 'auto';
		}
	);
	this.getImg = function(){return this.img;}
	this.source = source;
	this.duration = duration;
	this.effect = effect;
	this.description = imgName.substring(0, imgName.length - 4) + "\neffect: " + this.effect + "\nsource: " + this.source + "\nduration: " + this.duration;
	this.getDescription = function() {return this.description};
	this.getDuration = function() {return this.duration;}
	this.setDuration = function(duration) {this.duration = duration;
											this.description = imgName.substring(0, imgName.length - 4) + "\neffect: " + this.effect + "\nsource: " + this.source + "\nduration: " + this.duration;
											}
}

function createEffectTT(str) {
	var bigTokens = str.split("|");
    for (var i = 0; i < bigTokens.length; i++) {
        var tokens = bigTokens[i].split(",");
	if (tokens[1] == "create") {

	var fighter = identifyFighter(tokens[4], tokens[5]);
	var portraitX = fighter.getPortraitX();
	var portraitY = fighter.getPortraitY();	
	var x;
	if (tokens[5] == "right") {
		x = portraitX - 57 - 15 * tokens[8]; 
	} else if (tokens[5] == "left") {
		x = portraitX + 45 + 15 * tokens[8];
	}

	var newEffect = new Effect(x, portraitY - 5, tokens[2], tokens[3], tokens[6], tokens[7]);
	fighter.getEffecttts().push(newEffect);

	newEffect.getImg().hover(
	function() {
		infoBox.setInfo(newEffect.getDescription());
	},
	function () {
		infoBox.setInfo("");
	}
	);
	
	
	
	
	} else if (tokens[1] == "remove") {
		var fighter = identifyFighter(tokens[2],tokens[3]);

		var effectttArrToRemove = fighter.getEffecttts().splice(tokens[4],1);		

		var effectttToRemove = effectttArrToRemove[0];

		
		for (var h = 0; h < 5; h++) { 
			effectttToRemove.getImg().remove();
		}

		if (fighter.getEffecttts()[i].getImg().attr('x') < 300) {
			for (var i = tokens[4]; i < fighter.getEffecttts().length; i++) {
				var toShift = fighter.getEffecttts()[i].getImg();			
					toShift.attr('x', toShift.attr('x') - 15);
			
			}
		} else {
			for (var i = tokens[4]; i < fighter.getEffecttts().length; i++) {
				var toShift = fighter.getEffecttts()[i].getImg();			
					toShift.attr('x', toShift.attr('x') + 15);
			
			}
		
		}
	}
	}

}


function animate(str) {

	var bigTokens = str.split("|");
    for (var i = 0; i < bigTokens.length; i++) {
        var smallTokens = bigTokens[i].split(",");
      if (smallTokens[1] == "stealth") {
      	  var fighter = identifyFighter(smallTokens[2], smallTokens[3]);
		  setTimeout(function() {
          fighter.getAltImage().hide();
          fighter.getImage().hide();
          fighter.getClickBox().hide();
          fighter.getPortraitClickBox().hide();
          fighter.getScreen().show().attr('fill-opacity','0');
          },smallTokens[4] * 1000);
    	} else if (smallTokens[1] == "unstealth") {
    	  var fighter = identifyFighter(smallTokens[2], smallTokens[3]);
    	  setTimeout(function() {
          fighter.getImage().show();
          fighter.getAltImage().show();
          fighter.getClickBox().show();
          fighter.getPortraitClickBox().show();
          fighter.getScreen().attr('fill-opacity','0.7').hide();
          },smallTokens[4] * 1000);
        } else if (smallTokens[1] == "basic") {
    		var fighter = identifyFighter(smallTokens[2], smallTokens[3]);
            setTimeout(function() {
        	fighter.getAltImage().animate({y: fighter.getY() - 20},50, function() {
        																			fighter.getAltImage().animate({y: fighter.getY()} , 50)
        																			fighter.getImage().animate({y: fighter.getY()} , 50)
        																			});
        	fighter.getImage().animate({y: fighter.getY() - 20},50);
			},smallTokens[4] * 1000 - 100);
        }
     }
}
function gameOver(str) {
	var tokens = str.split(',');
	GAMEOVER = true;
	locked = true;
    log.style.height = HEIGHT - 450 + "px";
    logBackground.attr({"clip-rect": (logBackground.attr('x') + " " + logBackground.attr('y') + " " + logBackground.attr('width') + " " + logBackground.attr('height'))});
    infoBoxBackground.attr({"clip-rect": (infoBoxBackground.attr('x') + " " + infoBoxBackground.attr('y') + " " + infoBoxBackground.attr('width') + " " + infoBoxBackground.attr('height'))});
    infoBox.move(infoBox.getY() - 110);  
    infoBox.setFontSize(15);
   	log.style.top = topPos + "px";

        	document.getElementById("usermsg").style.visibility="visible";	
	readyButton.getRect()[0].attr('fill','yellow');
    readyButton.getRect().show();
	while (icons.length > 0) {
        icons.pop().remove();  
    }
    items.forEach(function(item) {
    	if (item.isQueued()) {
    		item.getMiniPic().remove();
    		item.getLine().remove();
    		item.getPic().remove();
    	}
    });
	upperRect.hide(); lowerRect.hide(); bar.hide();
	if (tokens[1] == "win") {
		readyButton.getRect()[1].attr('text','YOU WIN!');
	} else if (tokens[1] == "loss") { 
		readyButton.getRect()[1].attr('text','YOU LOSE');
	} else if (tokens[1] == "draw") { 
		readyButton.getRect()[1].attr('text','DRAW');
	}
}



function reset() {
    while (icons.length > 0) {
        icons.pop().remove();  
    }
    items.forEach(function(item) {
    	if (item.isQueued()) {
    		item.getMiniPic().remove();
    		item.getLine().remove();
    		item.getPic().remove();
    	}
    });

   	beforeClick = true;

	spots.forEach(function(s) {
		s.unindicateMove();
		s.unindicateAttack();
		s.unindicateSupport();
	});	
	fighters.forEach(function(f) {
//		f.coordinateImages();
		
	});
	upperRect.hide(); lowerRect.hide();
    locked = false;
    initialCalcQueue = true;
}
var beforeClick = true;
var isMyPaper = true;
var opponentPaper = gridPaper.image("opponentabilitypaper.png", WIDTH/2 - 257, 423, 514, 150).hide();
var myPaper = gridPaper.image("abilitypaper.png", WIDTH/2 - 257, 423, 514, 150).hide();
function displayAbilities(str) {
	if (str == "remove") {
		while(abilities.length > 0) {
			abilities.pop().remove();
		}
		
	} else {
	
	while(abilities.length > 0) {
		abilities.pop().remove();
	}
    var bigTokens = str.split("|");

    if (bigTokens[0].split(",")[0] == "clickable") {
    	if (!isMyPaper || beforeClick) {
    		opponentPaper.hide();
    		myPaper.show();
    		isMyPaper = true;
    		beforeClick = false;
    	}
    } else {
    	if (isMyPaper || beforeClick) {
        	opponentPaper.show();
    		myPaper.hide();
    		isMyPaper = false;
    		beforeClick = false;
        }
    }

    for (var i = 0; i < bigTokens.length -1; i++) {
        var smallTokens = bigTokens[i].split(",");
        var ability = new Ability(smallTokens[0], smallTokens[1], smallTokens[2], smallTokens[3], smallTokens[4], smallTokens[5], smallTokens[6], smallTokens[7], smallTokens[8]);
        abilities.push(ability);
    }
    abilities.forEach(function(a) {
        a.getPic().abilityClickable(a);
        a.getPic().abilityHoverable(a);
    });
    }

}


function changeBars(str) {
    var bigTokens = str.split("|");
    for (var i = 0; i < bigTokens.length; i++) {
        var smallTokens = bigTokens[i].split(",");

      	if (smallTokens[0] == "health") {
        	identifyFighter(smallTokens[1], smallTokens[2]).setHealth(parseInt(smallTokens[3]));
        }
      	else if (smallTokens[0] == "energy") {
        	identifyFighter(smallTokens[1], smallTokens[2]).setEnergy(parseInt(smallTokens[3]));
       	}      
    }
}
var lastBigTokenLen = 0;
function indicateActions(str) {
	var massiveTokens = str.split("~");
    var bigTokens = massiveTokens[0].split("|");
	if (bigTokens.length == lastBigTokenLen + 1) {

		bigTokens = massiveTokens[1].split("|");
	}
    for (var i = 1; i < bigTokens.length; i++) {
    	var smallTokens = bigTokens[i].split(",");
    	if (smallTokens[0] == "move") {
        	identifySpot(smallTokens[1]).indicateMove();
    	} else if (smallTokens[0] == "attack") {
        	identifyFighter(smallTokens[1], smallTokens[2]).indicateAttack();
    	} else if (smallTokens[0] == "support") {
    		identifyFighter(smallTokens[1], smallTokens[2]).indicateSupport();
    	} else if (smallTokens[0] == "block") {
        	identifyFighter(smallTokens[1], smallTokens[2]).indicateBlock();
    	} else if (smallTokens[0] == "attackspot") {
        	identifySpot(smallTokens[1]).indicateAttack();
    	} else if (smallTokens[0] == "supportspot") {
        	identifySpot(smallTokens[1]).indicateSupport();
    	}  
    }
    lastBigTokenLen = massiveTokens[0].length;
}


function displayActionQueue(str) {	
	if (!calculating) {

   		while (icons.length > 0) {

        	icons.pop().remove(); 
    	}  	        		         
    }

    var bigTokens = str.split("_")
    var lastX = 130;        
	if (bigTokens[1] == "remove") {
	   		while (icons.length > 0) {

        	icons.pop().remove(); 
    	}  	
	} else {

    for (var i = 1; i < bigTokens.length -1; i++) {
        var smallTokens = bigTokens[i].split("/");
		var anIcon = null;
		
        if (bigTokens[bigTokens.length -1] == iconY + 100 && smallTokens.length > 3) {
        	anIcon = new icon(smallTokens[0], parseInt(smallTokens[1]), smallTokens[2], smallTokens[3], smallTokens[4], lastX, smallTokens[5], smallTokens[6], smallTokens[7], smallTokens[8], bigTokens[bigTokens.length-1]);
        	initialCalcQueue = false;
        } else if (smallTokens.length > 3) {
      		anIcon = new icon(smallTokens[0], parseInt(smallTokens[1]), smallTokens[2], smallTokens[3], smallTokens[4], lastX, smallTokens[5], smallTokens[6], smallTokens[7], smallTokens[8]);
        }
        var lastX;
		if (anIcon != null) {
        	icons.push(anIcon);
        	lastX = anIcon.getX2();
        }
        
     }
    icons.forEach(function(m){
        m.getIcon().iconDraggable(m,icons);
        m.getIcon().iconHoverable(m);
    });

}
}

Raphael.st.abilityHoverable = function(ability) {
	var me = this,


	hoverIn = function() {
	infoBox.setInfo(ability.getDescription());
	me[0].attr('fill-opacity', 0.5);
	me.toFront();
	if (isMyPaper) {
		document.body.style.cursor = 'pointer';	
	}
	},
	hoverOut = function() {
	infoBox.setInfo('');
	if (!ability.isClicked()) {
		me[0].attr('fill-opacity', 0);
	}
	if (isMyPaper) {
			document.body.style.cursor = 'auto';		
	}
	};
	this.hover(hoverIn, hoverOut);
	
}

Raphael.st.abilityClickable = function(ability) {
    var me = this,
    onClick = function() {
        if (ability.isClickable()) {
            ws.send("click,ability,ability," + ability.getName());
        }        
    };
    this.click(onClick);
};



Raphael.st.iconHoverable = function(icon) {
    var me = this,
    hoverIn = function() {
    if (!iconDragging) {
    	if (!calculating) {
    		fighters.forEach(function(f) {f.unindicateAttack(); f.unindicateSupport(); f.unindicateBlock();});
			spots.forEach(function(s) {s.unindicateMove(); s.unindicateAttack(); s.unindicateSupport();});
    		icon.indicate();
    		document.body.style.cursor = 'pointer';
    	}
    	infoBox.setInfo(icon.getInfo());  
    	}
    					  },
    hoverOut = function() {
    if (!iconDragging) {
    	document.body.style.cursor = 'auto';
		infoBox.setInfo("");  
        	if (!locked) {

    	indicateActions(actionQueueStr);
    	if (!abilitySelected) {
    		showPossibleMoves(possibleMovesStr, true); 
    	}
    	
    	}
	}			  
    };

    this.hover(hoverIn, hoverOut);
    
};

var itemY = actionBarFrame.attr('y') + 82;

Raphael.st.itemDraggable = function(x,y,image,item) {
	var me = this,
	lx = 0,
	ly = 0,
	origX = x,
	origY = y,
	pos,
	line,
	moveFnc = function(dx, dy) {
	if (!initialPhase && !locked) {
		lx = dx;
		ly = dy;
		item.getPic().transform('t' + lx + ',' + ly);
		}
	},
	startFnc = function() {
	
	if (!initialPhase && !locked) {
		if (item.isQueued()) {

			item.getLine().remove();
		}
		item.getPic().toFront();
		item.getMiniImage().hide();
		itemBeingDragged = true;
		item.getPic()[0].hide();
		item.getPic()[1].show();

		}
	},
	endFnc = function() {
		if (!initialPhase && !locked) {
		itemBeingDragged = false;
		var initialY = image.attr('y');
		var initialX = image.attr('x');
	    var midX = initialX + lx + image.attr('width')/2;	        
		var currX = lx + origX;
		var lineX = 0;
		if (ly + initialY >= 316  && ly + initialY <= 444) {

			item.setQueued(true);
			item.getPic()[0].hide();
			item.getPic()[1].hide();
			item.getMiniImage().show().toFront();
			
			var leftX = 130;

			item.getPic().transform('t' + (-lx) - ',' + (-ly));	
			
			if (midX <= 130) {
				var newX = 130;				
				var newNewX = newX;

				itemsChosen.forEach(function(it) {
					if (it.getPic()[0] != null) {
						if (it.getMiniImage() == newX && it != item) {																					
							itemsChosen.forEach(function(ite) {
								if (ite.getMiniImage().attr('x') == newX + 30 && ite != item) {
									newNewX += 30;
								}
							});
							newNewX += 30;
						}
					}
				});				
															
			    item.getMiniImage().attr('x', newNewX).attr('y', itemY);		
			    item.getPic().attr('x', newNewX).attr('y', itemY);	
			    lineX = newX;  	
				if (item.isQueued()) {
					ws.send("click,item,remove," + item.getName() + "," + 0);
				} 
				ws.send("click,item,add," + item.getName() + "," +  0);	
				
			} else if (midX >= WIDTH - 130) {
				var newX = WIDTH-130;
				var newNewX = newX;

				itemsChosen.forEach(function(it) {
					if (it.getPic()[0] != null) {
						if (it.getPic()[0].attr('x') == newX && it != item) {																					
							itemsChosen.forEach(function(ite) {
								if (ite.getMiniImage().attr('x') == newX + 30 && ite != item) {
									newNewX += 30;
								}
							});
							newNewX += 30;
						}
					}
				});		
  
			  	item.getMiniImage().attr('x', newNewX).attr('y', itemY);
			  	item.getPic().attr('x', newNewX).attr('y', itemY);
			  	lineX = newX;	
				if (item.isQueued()) {
					ws.send("click,item,remove," + item.getName() + "," + 10);
				} 
				ws.send("click,item,add," + item.getName() + "," +  10);					
			} else {
			
				for (var i = 0; i < 11; i++) {
					if (midX <= leftX) {		
						var newX;
						if (leftX - midX <= midX - (leftX - 0.1*(WIDTH-260))) {
							newX = leftX;
							if (item.isQueued()) {
							   ws.send("click,item,remove," + item.getName() + "," + pos);
							} 
							ws.send("click,item,add," + item.getName() + "," +  (i));
							
							pos = i;
						} else {
							newX = leftX - 0.1*(WIDTH-260);

							
							if (item.isQueued()) {
							   ws.send("click,item,remove," + item.getName() + "," + pos);
							} 
							ws.send("click,item,add," + item.getName() + "," +  (i -1));							
							pos = i-1;
						}
						var newNewX = newX;

						itemsChosen.forEach(function(it) {
						if (it.getPic()[0] != null) {

								if (it.getMiniImage().attr('x') == newX && it != item) {
																					
									itemsChosen.forEach(function(ite) {
										if (ite.getMiniImage().attr('x') == newX + 30 && ite != item) {
											newNewX += 30;
										}
									});
									newNewX += 30;
								}
								}
							});

						item.getMiniImage().attr('x', newNewX).attr('y', itemY);
						item.getPic().attr('x', newNewX).attr('y', itemY);
						
						
						lineX = newX;
						break;
					}
					leftX += 0.1*(WIDTH-260);
				}
			}
			line = gridPaper.path("M" + (lineX) + " " + iconY + " L " + (lineX)  + " " + (itemY + 25)).attr('stroke', 'white').attr('stroke-width', '1');
			item.setLine(line);
		} else {
			item.getPic()[0].show();
			item.getPic()[1].show();
			item.getMiniImage().hide();
            item.getPic().transform('t' + (-lx) - ',' + (-ly));
            if (item.isQueued()) {
            	item.setQueued(false);
            	ws.send("click,item,remove," + item.getName() + "," + pos);
            	item.getPic().forEach(function(n){   
			  		n.attr('x', item.getX()).attr('y', item.getY());			  		
			  	}); 	
			  	item.getMiniImage().attr('x', 0);
	//		  	item.coordinateTextBox();	  	
        	}
        }
        }	
        lx = 0;
	};
	this.drag(moveFnc, startFnc, endFnc);
}
var iconDragging = false;
Raphael.st.iconDraggable = function(icon, arr) {

  var me = this,
      lx = 0,
      ly = 0,
      collapsed = false,
      changed = false,
      origPos = 0,
      iconPos = -2,
      newIconPos = 0,
      origIconX = 0;

      moveFnc = function(dx, dy) {
      if (!locked) {

          me.toFront();
          lx = dx
          ly = dy
          if ((ly < -70 || ly > 70) && !collapsed) {
               
            iconPos = arr.indexOf(icon);
            arr.splice(iconPos, 1);
          
            collapsed = true;

            for (var i = 0; i < icons.length; i++) {
              if (i == 0) {
                    icons[i].setX(130);
                    if (icons[i] != icon) {
                        slide(icons[i].getX(), icons[i]);  
                    ;} 
              } else {
                    icons[i].setX(icons[i -1 ].getX2());
                    if (icons[i] != icon) {
                        slide(icons[i].getX(), icons[i]);  
                    } 
                }                                        
            }            
          } else if (collapsed && ly > -70 && ly < 70) {
            collapsed = false;
            if (arr.length == 0) {
                arr.splice(0,0,icon);
            } else {
            
            for (var i = 0; i < arr.length; i++) {

                var iconMidPoint = origIconX + lx + icon.getWidth()/2;

                var prevIconMidPoint = arr[i].getX() + arr[i].getWidth()/2;

                if (arr.length > 1) {
                 var nextIconMidPoint = arr[i+1].getX() + arr[i+1].getWidth()/2;
                }
                if (iconMidPoint > arr[arr.length - 1].getX() + arr[arr.length - 1].getWidth()/2) { 
                    arr.splice(arr.length, 0 , icon);
                    newIconPos = arr.length-1;
                     break;                 
                } else if (iconMidPoint < arr[0].getX() + arr[0].getWidth()/2) {
                    arr.splice(0,0,icon);
                    newIconPos = 0;
                    break;
                } else if (prevIconMidPoint < iconMidPoint && nextIconMidPoint >= iconMidPoint) {
                   arr.splice(i+1,0,icon);   
                   newIconPos = i+1; 
                   break;          
                } 


            }   
            }
          
            for (var i = 0; i < icons.length; i++) {
              if (i == 0) {
  
                icons[i].setX(130);
               if (!icons[i] == icon) {
                   slide(icons[i].getX(), icons[i]);
                }
              } else  {
                    icons[i].setX(icons[i -1 ].getX2());
                   if (!(icons[i] == icon)) {
                        slide(icons[i].getX(), icons[i]);
                    }
                }  
            }                                                               
          }         

          me.transform('t' + lx + ',' + ly);
          var rect = icon.getIcon()[0];
          icon.getIcon()[1].attr({"clip-rect": (rect.attr('x') + " " + rect.attr('y') + " " + rect.attr('width') + " " + rect.attr('height'))});                    
        }
      },
      startFnc = function() {	
      	if (!locked) {
      		me.toFront();
      		hideLogButtonsAndText();
      		icon.getIcon()[0].attr('stroke-width', 1);
        	origIconX = icon.getX();
        	origPos = arr.indexOf(icon);
        	newIconPos = origPos;
        }
      },

      endFnc = function() {
      if (!locked) {
      	  showLogButtonsAndText();
          if (ly < -70 || ly >70) {
            fighters.forEach(function(f) {f.unindicateAttack(); f.unindicateSupport(); f.unindicateBlock();});
			spots.forEach(function(s) {s.unindicateMove(); s.unindicateAttack(); s.unindicateSupport();});
            ws.send("click,actionqueue,remove," + iconPos + "," + iconPos);

            icon.remove();
          } else {
			icon.getIcon()[0].attr('stroke-width', 0);
			icon.moveIcon(icon.getX() + lx - (icon.getX() - origIconX), icon.getY()  + ly);
            me.transform('t' + (-lx) - ',' + (-ly));          
            icon.getIcon().insertAfter(backgroundBottom);
            icon.getIcon()[5].toFront();
            if ((origPos != newIconPos) && !collapsed) {
                ws.send("click,actionqueue,switch," + origPos + "," + newIconPos);
            }
            slide(icon.getX(), icon);
          }
         changed = false;
         lx = 0;
         ly = 0;
         }

      };
    this.drag(moveFnc, startFnc, endFnc);
};

function slide(newX, icon) {
  var nameY = iconY + 12;
  var descY = iconY + 32;
  var statY = iconY + 54; 

  var rectangle = icon.getIcon()[0];
  var slideDiff = newX - rectangle.attr('x');
  var texture = icon.getIcon()[1];
  var newTextureX = texture.attr('x') + slideDiff;
  var rect = true;
  rectangle.animate({x: newX, y: iconY}, 50);
  texture.animate({x: newTextureX, y: iconY}, 50);
  texture.animate({"clip-rect": (newX + " " + iconY + " " + rectangle.attr('width') + " " + rectangle.attr('height'))});                    
  icon.getIcon()[2].animate({x: newX + icon.getWidth()/2, y: nameY}, 50);
  icon.getIcon()[3].animate({x: newX + icon.getWidth()/2, y: descY}, 50);
  icon.getIcon()[4].animate({x: newX + icon.getWidth()/2, y: statY}, 50);
  icon.getIcon()[5].animate({x: newX, y: iconY}, 50);
}



function Button(rect, text, paper, onclick) {
    this.rect = rect;
    this.text = text;
    this.disabled = true;
    this.disableRect = paper.rect(rect.attr('x'), rect.attr('y'), rect.attr('width'), rect.attr('height'), 7).attr("fill", "gray").attr("fill-opacity", "0.6").hide();
	this.text.node.setAttribute("class","donthighlight");
	this.isDisabled = function() {return this.disabled;};
    this.getRect = function() {var st = paper.set();
                              st.push(this.rect, this.text, this.disabledRect);                             
	 						return st;}
	this.getRect().toFront(); 				
	 						
	this.getRect().hover(
		function() {
			document.body.style.cursor = 'pointer';
		},
		function () {
			document.body.style.cursor = 'auto';
		}
	);
	this.setText = function(newText) {this.text.remove(); this.text = newText; this.text.node.setAttribute("class","donthighlight");};
	this.disable = function() {this.disableRect.toFront(); this.disableRect.show(); this.disabled = true;};
	this.enable = function() {this.disableRect.hide(); this.disabled = false;};
	this.getRect().click(onclick);

		this.text.toFront();
		this.text.node.setAttribute("class","donthighlight");
}

function empty() {
}
var readyButton = new Button(gridPaper.rect(WIDTH/2-40, HEIGHT/2 - 95, 80, 40, 2).attr("fill", "yellow"), 
					gridPaper.text(WIDTH/2, HEIGHT/2 - 75, "Ready").attr("font-family", buttonFont).attr("font-size", 16), gridPaper);



readyButton.getRect().click(function () {
	if (initialPhase) {
		var leftAble = true;
		var rightAble = true;
	 	leftFighters.forEach(function(lf) {
	 		if (lf.getToken().getSpot() == null) {
	 			leftAble = false;
	 		}
	 	});
	 	rightFighters.forEach(function(rf) {
	 		if (rf.getToken().getSpot() == null) {
	 			rightAble = false;
	 		}
	 	});
	 	
	 	if (leftAble) {
	 	if(leftBench.getPositionedAt()) {
    		ws.send("click,initialposition,left," + leftFighters[0].getName() + "," + leftFighters[0].getToken().getSpot().getName() + "," + 
    												leftFighters[1].getName() + "," + leftFighters[1].getToken().getSpot().getName() + "," + 
    												leftFighters[2].getName() + "," + leftFighters[2].getToken().getSpot().getName() + "," + 
    												leftFighters[3].getName() + "," + leftFighters[3].getToken().getSpot().getName());
    		locked = true;
    		readyButton.getRect()[0].attr('fill','gray');
    		readyButton.getRect()[1].attr('text','waiting');
    	}
    	} else if (rightAble) {

    	if (rightBench.getPositionedAt()) {
    		ws.send("click,initialposition,right," + rightFighters[0].getName() + "," + rightFighters[0].getToken().getSpot().getName() + "," + 
    												rightFighters[1].getName() + "," + rightFighters[1].getToken().getSpot().getName() + "," + 
    												rightFighters[2].getName() + "," + rightFighters[2].getToken().getSpot().getName() + "," + 
    												rightFighters[3].getName() + "," + rightFighters[3].getToken().getSpot().getName());
    		
    		locked = true;
    		readyButton.getRect()[0].attr('fill','gray');
    		readyButton.getRect()[1].attr('text','waiting');
    	}
    	} else if (quickStartEnabled) {
    		var defaultSpotNames = [SIDE + "MiddleBack", SIDE + "BottomFront", SIDE + "TopFront", SIDE + "Bench"];  
    		var defaultSpots = [];    	
    		defaultSpots.push(identifySpot(defaultSpotNames[0]));
    		defaultSpots.push(identifySpot(defaultSpotNames[1]));
    		defaultSpots.push(identifySpot(defaultSpotNames[2]));
    		defaultSpots.push(identifySpot(defaultSpotNames[3]));
    		defaultSpots.forEach(function(ds) {
				ds.setPositionedAt(true);
    		});
    		ws.send("click,initialposition," + SIDE + "," + sideFighters[0].getName() + "," + SIDE + "MiddleBack" + "," + 
    												sideFighters[1].getName() + "," + SIDE + "BottomFront" + "," + 
    												sideFighters[2].getName() + "," + SIDE + "TopFront" + "," + 
    												sideFighters[3].getName() + "," + SIDE + "Bench");
    		locked = true;
    		readyButton.getRect()[0].attr('fill','gray');
    		readyButton.getRect()[1].attr('text','waiting');
    	}
    } else if (GAMEOVER){
    	window.location.reload(false); 
    } else {
        ws.send("click,ready,ready");
        locked = true;
        readyButton.getRect()[0].attr('fill','gray');
        readyButton.getRect()[1].attr('text','waiting');
    }
});



function Spot(polygon, name, fighterX, fighterY) {

    this.polygon = polygon;
    this.polygon.attr("fill", "white").attr("fill-opacity", "0");
    this.getPolygon = function() {return this.polygon}
    this.name = name;
    this.getName = function() {return this.name}
    this.positionedAt = false;
    this.getPositionedAt = function() {return this.positionedAt}
    this.setPositionedAt = function(positionedAt) {this.positionedAt = positionedAt}
    this.actionIndicated = false;
    this.highlighted = false;
    this.isHighlighted = function() {return this.highlighted;}
    this.possibleAttacksShown = false;
    this.possibleSupportsShown = false;
    this.isActionIndicated = function() {return this.actionIndicated}
    this.setActionIndicated = function(actionIndicated) {this.actionIndicated = actionIndicated}
    this.fighterX = fighterX;
    this.getFighterX =  function() {return this.fighterX}
    this.fighterY = fighterY;
    this.getFighterY = function() {return this.fighterY}
    this.compare = function(str) {if(str == name) {return true}return false}

    this.indicateMove = function () {if (!this.highlighted && !this.possibleAttacksShown && !this.possibleSupportsShown){this.polygon.attr ("fill", moveColor).attr("stroke", moveColor).attr ("fill-opacity", 1), this.actionIndicated = true; this.polygon.show();}}
    this.indicateAttack = function () {if (!this.highlighted && !this.possibleAttacksShown && !this.possibleSupportsShown) {this.polygon.attr ("fill", attackColor).attr("stroke", attackColor).attr ("fill-opacity", 1), this.actionIndicated = true; this.polygon.show();}}
    this.indicateSupport = function () {if (!this.highlighted && !this.possibleAttacksShown && !this.possibleSupportsShown) {this.polygon.attr ("fill", supportColor).attr("stroke", supportColor).attr ("fill-opacity", 1), this.actionIndicated = true; this.polygon.show();}}
    this.unindicateMove = function () { if (this.actionIndicated) {this.polygon.attr ("fill-opacity", 0).attr("stroke", "#704000"); this.actionIndicated = false; this.polygon.hide(); return true;} return false;} 
    this.unindicateAttack = function () { if (this.actionIndicated) {this.polygon.attr ("fill-opacity", 0).attr("stroke", "#704000"); this.actionIndicated = false; this.polygon.hide(); return true;} return false;} 
    this.unindicateSupport = function () { if (this.actionIndicated) {this.polygon.attr ("fill-opacity", 0).attr("stroke", "#704000"); this.actionIndicated = false; this.polygon.hide(); return true;} return false;} 
   

   
    this.highlight = function () {
    	this.polygon.attr({"stroke-opacity": 0.4, "stroke-width": 1}).insertBefore(backgroundBottom).show();
    	this.highlighted = true;
    	this.polygon.hover(
    		function() {
    			document.body.style.cursor = 'pointer';
    			polygon.attr("fill-opacity", 0.4).attr("fill", moveColor);  
    		},
    		function() {
    			document.body.style.cursor = 'auto';
    			polygon.attr("fill-opacity", 0);
    		}
    	);
	}         
    this.possibleAttacks = function () {this.polygon.attr("fill-opacity", 0.5)
    	this.polygon.attr({"stroke-opacity": 0.4, "stroke-width": 1}).insertBefore(backgroundBottom).show();
    	this.highlighted = true;
    	this.polygon.hover(
    		function() {
    			document.body.style.cursor = 'pointer';
    			polygon.attr("fill-opacity", 0.4).attr("fill", attackColor);  
    		},
    		function() {
    			document.body.style.cursor = 'auto';
    			polygon.attr("fill-opacity", 0);
    		}
    	);
    };
    this.possibleSupports = function () {this.polygon.attr("fill-opacity", 0.5)
    	this.polygon.attr({"stroke-opacity": 0.4, "stroke-width": 1}).insertBefore(backgroundBottom).show();
    	this.highlighted = true;
    	this.polygon.hover(
    		function() {
    			document.body.style.cursor = 'pointer';
    			polygon.attr("fill-opacity", 0.4).attr("fill", supportColor);  
    		},
    		function() {
    			document.body.style.cursor = 'auto';
    			polygon.attr("fill-opacity", 0);
    		}
    	);
    };
    
    
    this.unhighlight = function () { if (this.highlighted) {this.polygon.unhover(); this.polygon.attr ("fill-opacity", 0).attr("stroke-opacity", 0);  this.polygon.insertAfter(background); this.highlighted = false;  this.polygon.hide(); return true;} return false;}
   	this.unPossibleAttacks = function () {if (this.possibleAttacksShown) {this.polygon.unhover(); this.polygon.attr ("fill-opacity", 0); this.polygon.insertAfter(background); this.possibleAttacksShown = false; this.polygon.hide(); return true;} return false;}
    this.unPossibleSupports = function () { if (this.possibleSupportsShown) {this.polygon.unhover(); this.polygon.attr ("fill-opacity", 0); this.polygon.insertAfter(background); this.possibleSupportsShown = false; this.polygon.hide(); return true; } return false;}
}
	var upperFrameY = actionBarFrame.attr('y');
	var lowerFrameY = upperFrameY + 100;
	var upperRect = gridPaper.image("actionbarframe.png", 120, upperFrameY, WIDTH - 245, 90).hide();
	var lowerRect = gridPaper.image("actionbarframe.png", 120, lowerFrameY, WIDTH - 245, 90).hide();
	var otherItemY = lowerRect.attr('y') + 82;
	var bar = gridPaper.image("timebar.png", 120, upperFrameY - 3, (lowerFrameY - upperFrameY + 10 + 90) * 0.29, lowerFrameY - upperFrameY + 5 + 90).hide();
function timeBar () {
	var h = 90;
	var w = WIDTH - 245;
	var startX = 120;
	var startY = 370;
	upperRect.show();
	lowerRect.show();
	abilities.forEach(function(ability) {

		ability.getPic().remove();
	});
//	var bar = gridPaper.path('M' + (startX + 10) + ',' + (startY + 10) + ' L ' + (startX + 10) + ',' + (startY + 80 + h)).attr("stroke-width", "2");
	bar.insertAfter(lowerRect);
	bar.attr('x', startX - 25).show();
	bar.animate({x: w + 70}, 10000, function removeTimeBar() {bar.hide();});

	
}



function displayTime(allotted, max) {
    timeText.remove();
    timeText = gridPaper.text(900, 700, allotted + "/" + max);
}

function icon (time, energy, user, target, description, x, type, targetSide, indicatorMessage, info, y) {
    this.info = info;
    this.getInfo = function() {return this.info};
    this.description = description;
    this.time = time;
    this.energy = energy;
    this.user = user;
    this.target = target;
    this.width = time/10*(WIDTH-260);
    this.getWidth = function() {return this.width}
    this.y = iconY;
    this.height = 64;
        if (y > 0) {

    	var a = y;
    	a = a+1;
    	a = a-1;
    	a = a/10;
    	this.y = a;
    	

    }
    this.moveIcon = function(x, y) {
    	this.texture.attr({x: this.texture.attr('x') + x - this.rect.attr('x'), y: iconY}, 50);
  		this.texture.attr({"clip-rect": (x + " " + y + " " + this.rect.attr('width') + " " + this.rect.attr('height'))});
    	this.rect.attr('x', x).attr('y', y);
    	
    	     
    	this.clickRect.attr('x', x).attr('y', y);
    	this.nameText.attr('x', x + this.width/2).attr('y', y + 12);
    	this.descText.attr('x', x + this.width/2).attr('y', y + 27);
    	this.statText.attr('x', x + this.width/2).attr('y', y + 39);
    };


    this.getY = function() {return this.y}
    this.setY = function(y) { this.y = y}
    this.x = x;
    this.getX = function() {return this.x}
    this.setX = function(x) { this.x = x}
    this.type = type;
    this.getX2 = function() {return (this.x + this.width)}
    this.remove = function() {this.clickRect.remove(); this.rect.remove(); this.nameText.remove(); this.descText.remove(); this.statText.remove(); this.texture.remove();}
    if (this.type == "move") {
         this.rect = gridPaper.rect(this.x, this.y, this.width, this.height).attr("stroke-width", "0").attr("fill", moveColor);
    } else if (this.type == "attack") {
         this.rect = gridPaper.rect(this.x, this.y, this.width, this.height).attr("stroke-width", "0").attr("fill", attackColor);
    } else if (this.type == "support") {
         this.rect = gridPaper.rect(this.x, this.y, this.width, this.height).attr("stroke-width", "0").attr("fill", supportColor);
    } else if (this.type == "block") {
         this.rect = gridPaper.rect(this.x, this.y, this.width, this.height).attr("stroke-width", "0").attr("fill", blockColor);
    }
    this.clickRect = gridPaper.rect(this.x, this.y, this.width, this.height).attr({"stroke-width":0, "fill":"white", "fill-opacity": 0});
    this.getClickRect = function() {return this.clickRect}

//	this.texture = gridPaper.image("marbletexture.png", 0,0,1504,1000).attr({"clip-rect": (this.x + " " + this.y + " " + this.width + " " + this.height)});
	this.texture = gridPaper.rect(0,0,0,0);
	
    this.nameText = gridPaper.text(this.x + this.width/2, this.y + 12, this.user).attr(
  {"font-family":iconFont,
   "font-size":"12"});


    this.descText = gridPaper.text(this.x + this.width/2, this.y + this.height/2, this.description).attr(
  {"font-family":"Caesar Dressing",
   "font-size":"15"});

    this.statText = gridPaper.text(this.x + this.width/2, this.y + this.height - 10, "E:" + this.energy + " T:" + this.time).attr(
  {"font-family":"Caesar Dressing",
   "font-size":"12"});
   
   this.getUser = function() {return this.user}
   this.getIcon = function() {var st = gridPaper.set();
                              st.push(this.rect, this.texture, this.nameText, this.descText, this.statText, this.clickRect);
                              return st;}
   this.nameText.insertAfter(backgroundBottom);
   this.descText.insertAfter(backgroundBottom);
   this.statText.insertAfter(backgroundBottom);
   this.texture.insertAfter(backgroundBottom);
   this.nameText.node.setAttribute("class","donthighlight");
   this.descText.node.setAttribute("class","donthighlight");
   this.statText.node.setAttribute("class","donthighlight");
   this.rect.insertAfter(backgroundBottom);
           
   this.indicate = function() {
   showPossibleMoves(",no moves", false);
   showPossibleMoves(",no attacks", false);
   showPossibleMoves(",no supports", false);
   indicateActions(indicatorMessage);
   }
                               
   
}

function alignTop(t) {
    var b = t.getBBox();
    var h = Math.abs(b.y2) - Math.abs(b.y) + 1;

    t.attr({
        'y': b.y + h
    });
}

function Item (name, description, pos, imageStr) {	
	this.name = name;
	this.getName = function() {return this.name;};
	this.queued = false;
	this.isQueued = function() {return this.queued;};
	this.setQueued = function(queued) {this.queued = queued;};
	this.description = description;
	this.getDescription = function() {return description;}
	this.pos = pos;
	this.getPos = function() {return this.pos;};
	this.line = null;
	this.getLine = function() {return this.line};
	this.setLine = function(line) {this.line = line};
	this.y = HEIGHT - 110;
	this.x = WIDTH/2 - 175 + 130 * pos;
	this.getY = function() {return this.y};
	this.setY = function(y) {this.y = y};
	this.getX = function() {return this.x};
	this.setX = function(x) {this.x = x};
	this.width = 80;
	this.height = 80;
	this.itemBox;
	if (pos == 0) {
		this.itemBox = gridPaper.image("items/itembox1.png", this.x, this.y, this.width, this.height);
	} else if (pos == 1) {
		this.itemBox = gridPaper.image("items/itembox2.png", this.x, this.y, this.width, this.height);	
	} else {
		this.itemBox = gridPaper.image("items/itembox3.png", this.x, this.y, this.width, this.height);	
	}
	this.image = gridPaper.image("items/" + imageStr, this.x, this.y, this.width, this.height);
	this.miniImage = gridPaper.image("items/" + imageStr, 0, 444, 30, 30).hide();
	this.getMiniPic = function (){var st = gridPaper.set();
					   st.push(this.miniImage);
					   return st;};
	this.getMiniImage = function() {return this.miniImage;};
	this.getImage = function() {return this.image;};
	this.getPic = function() {var st = gridPaper.set();
         		  st.push(this.itemBox, this.image);
                  return st;} 
}


function Ability (clickable, time, energy, name, description, pos, damage, type, effects) {
    this.clickable;
    if (clickable == "clickable") {
        this.clickable = true;
    } else {
        this.clickable = false;
    }

    this.isClickable = function() {return this.clickable;}
    this.time = time;
    this.energy = energy;
    this.name = name;
    this.getName = function() {return this.name;}
    this.description = description;
    this.getDescription = function(){return this.description;}
    this.width = 115;
    this.x = pos * this.width + WIDTH/2 - this.width*2;
    this.height = 100;
    this.y = 447;
    this.rect = gridPaper.rect(this.x + 5, this.y, this.width - 10, this.height, 3);
    this.rect.attr("stroke-width", 0).attr("fill-opacity", 0);
    this.getRect = function() {return this.rect;}
    
    this.damage = damage;
    this.type = type;
    this.getType = function() {return this.type;}
    
    this.effects = effects.split('*');
    this.effectPics = gridPaper.set();
    if (effects != "") {
    	for (var i = 0; i < this.effects.length; i++) {
    		this.effectPics.push(gridPaper.image("EffectSigns/" + this.effects[i], this.x+this.width/2-10 -25*i, this.y+this.height/2 - 10, 20, 20));
   		}
    }
    
    if (this.clickable) {
   		this.rect.attr("fill", "white");
    } else {
    	this.rect.attr("fill", "#CCE5FF").attr("fill-opacity","0");
    }
    this.setColor = function(color) {this.rect.attr("fill",color);}
    this.clicked = false;
    this.setClicked = function(clicked) {this.clicked = clicked;}
	this.isClicked = function() {return this.clicked;}
    
	this.nameText = gridPaper.text(this.x + this.width/2,this.y + 10, this.name).attr(
  {"font-family":abilityFont,
   "font-size":"12"});


   
   this.typeIcon = null;
   if (type == "attack") {
   	 this.typeIcon = gridPaper.image("attackicon.png", this.x + this.width/2 - 9, this.y + this.height - 25, 18, 18);
   } else if (type == "block") {
     this.typeIcon = gridPaper.image("blockicon.png",this.x + this.width/2 - 10, this.y + this.height - 25, 20, 20);
   } else {
     this.typeIcon = gridPaper.image("supporticon.png", this.x + this.width/2 - 11, this.y + this.height - 25, 22, 22);
   }

   this.energyIcon = gridPaper.image("energy.png", this.x + 27 - 18, this.y + this.height - 13, 36, 36);
   this.energyText = gridPaper.text(this.x + 27, this.y + this.height - 15, this.energy).attr({"font-family": abilityFont, "font-size": 12});
   
   this.timeIcon = gridPaper.image("time.png", this.x + 90 - 18, this.y + this.height - 13, 36, 36);
   this.timeText = gridPaper.text(this.x + 90, this.y + this.height - 15, this.time).attr({"font-family": abilityFont, "font-size": 12});
   
   
   


   this.energyText.node.setAttribute("class","donthighlight");
   this.nameText.node.setAttribute("class","donthighlight");
   this.timeText.node.setAttribute("class","donthighlight");
   

   
    this.getPic = function() {var st = gridPaper.set();
                              st.push(this.rect, this.nameText, this.descText, this.energyIcon, this.energyText, this.timeIcon, this.timeText, this.typeIcon, this.effectPics);                             
	 						return st;}
                    
    this.remove = function() {this.getPic().remove();this.effectPics.remove();}

}
var startX = 140;
var startY = HEIGHT/2 - 28;
var horizL = 120;
var vertL = 50;
var h = 45;
var fighterSize = 170;
var forwardOffset = 10;

function createPathFromCoords(str) {
	var path = "M ";
	var coords = str.split("-");
	
	if (coords[0] == "leftBench") {
		path = 'M' + (0) + ',' + (startY - h*3) + 'L' + (startX + vertL*3 - 30) + ',' + (startY - h*3) + 'L' + (startX- 30) + ',' + (startY) + 'L' + (0) + ',' + (startY) + 'L' + (0) + ',' + (startY - h*3);
	} else if (coords[0] == "rightBench") {
		path = 'M' + (WIDTH - startX - vertL*3 + 30) + ',' + (startY - h*3) + 'L' + (WIDTH) + ',' + (startY - h*3) + 'L' + (WIDTH) + ',' + (startY) + 'L' + (WIDTH - startX + 30) + ',' + (startY) + 'L' + (WIDTH - startX - vertL*3 + 30) + ',' + (startY - h*3);
		
	} else {
	
	for (var i = 0; i < coords.length; i++) {
		if (coords[i].charAt(0) < 3) {
			path += startX + (3 - coords[i].charAt(1)) * vertL + coords[i].charAt(0) * horizL ;
			path += ',';
			path += startY - (3 - coords[i].charAt(1)) * h;
			if (i != coords.length - 1) {
				path += " L ";
			}
		} else {
			path += WIDTH - (startX + (3 - coords[i].charAt(1)) * vertL + (2 - (coords[i].charAt(0) - 3)) * horizL);
			path += ',';
			path += startY - (3 - coords[i].charAt(1)) * h;
			if (i != coords.length - 1) {
				path += " L ";
			}
		}
	}
	}
	return gridPaper.path(path).attr('stroke-width', '1').attr("fill", "yellow").attr("fill-opacity", 0).attr("stroke", "#704000");
	
}




var topFighterY = (startY - h*3) - fighterSize + 40;
var midFighterY = (startY - h*2) - fighterSize + 40;
var botFighterY = (startY - h) - fighterSize + 40;
var benchFighterY = (startY - h) - fighterSize + 20;


var leftTopBackSpot = new Spot(gridPaper.path('M ' +  (startX + vertL*3) + ',' +  (startY - h*3) + ' L ' +  (startX + vertL*3 + horizL) + ',' +  (startY - h*3) + ' L ' +  (startX + vertL*2 + horizL) + ',' +  (startY - h*2) + ' L ' +  (startX + vertL*2) + ',' +  (startY - h*2) + ' L ' +  (startX + vertL*3) + ',' +  (startY - h*3)  ).attr ("stroke-width", "3"), 
                      "leftTopBack",
                      (startX + vertL*3) + (- vertL + horizL - fighterSize) / 2 + forwardOffset,
                      topFighterY);

var leftTopFrontSpot = new Spot(gridPaper.path('M ' +  (startX + vertL*3 + horizL) + ',' +  (startY - h*3) + ' L ' +  (startX + vertL*3 + horizL*2) + ',' +  (startY - h*3) + ' L ' +  (startX + vertL*2 + horizL*2) + ',' +  (startY - h*2) + ' L ' +  (startX + vertL*2 + horizL) + ',' +  (startY - h*2) + ' L ' +  (startX + vertL*3 + horizL) + ',' +  (startY - h*3)  ).attr ("stroke-width", "3"), 
                      "leftTopFront",
                      startX + vertL*3 + horizL + (- vertL + horizL - fighterSize) / 2 + forwardOffset,
                      topFighterY);

var leftMiddleBackSpot = new Spot(gridPaper.path('M ' +  (startX + vertL*2) + ',' +  (startY - h*2) + ' L ' +  (startX + vertL*2 + horizL) + ',' +  (startY - h*2) + ' L ' +  (startX + vertL + horizL) + ',' +  (startY - h) + ' L ' +  (startX + vertL) + ',' +  (startY - h) + ' L ' +  (startX + vertL*2) + ',' +  (startY - h*2) ).attr ("stroke-width", "3"), 
                      "leftMiddleBack",
                      startX + vertL*2 + (- vertL + horizL - fighterSize) / 2 + forwardOffset,
                      midFighterY);
                      
 var leftMiddleFrontSpot = new Spot(gridPaper.path('M ' +  (startX + vertL*2 + horizL) + ',' +  (startY - h*2) + ' L ' +  (startX + vertL*2 + horizL*2) + ',' +  (startY - h*2) + ' L ' +  (startX + vertL + horizL*2) + ',' +  (startY - h) + ' L ' +  (startX + vertL + horizL) + ',' +  (startY - h) + ' L ' +  (startX + vertL*2 + horizL) + ',' +  (startY - h*2) ).attr ("stroke-width", "3"),
                      "leftMiddleFront",
                      startX + vertL*2 + horizL + (- vertL + horizL - fighterSize) / 2 + forwardOffset,
                      midFighterY);                               

var leftBottomBackSpot = new Spot(gridPaper.path('M' +  (startX + vertL) + ',' +  (startY - h) + ' L ' +  (startX + vertL + horizL) + ',' +  (startY - h) + ' L ' +  (startX + horizL) + ',' +  (startY) + ' L ' +  (startX) + ',' +  (startY) + ' L ' +  (startX + vertL) + ',' +  (startY - h)).attr ("stroke-width", "3"),
                      "leftBottomBack",
                      startX + vertL + (- vertL + horizL - fighterSize) / 2 + forwardOffset,
                      botFighterY);                      

var leftBottomFrontSpot = new Spot(gridPaper.path('M' +  (startX + vertL + horizL) + ',' +  (startY - h) + ' L ' +  (startX + vertL + horizL*2) + ',' +  (startY - h) + ' L ' +  (startX + horizL*2) + ',' +  (startY) + ' L ' +  (startX + horizL) + ',' +  (startY) + ' L ' +  (startX + vertL + horizL) + ',' +  (startY - h)).attr ("stroke-width", "3"),
                      "leftBottomFront",
                      startX + vertL + horizL + (- vertL + horizL - fighterSize) / 2 + forwardOffset,
                      botFighterY);
                      
                      
var rightTopBackSpot = new Spot(gridPaper.path('M ' +  (WIDTH - startX - vertL*3) + ',' +  (startY - h*3) + ' L ' +  (WIDTH - startX - vertL*3 - horizL) + ',' +  (startY - h*3) + ' L ' +  (WIDTH - startX - vertL*2 - horizL) + ',' +  (startY - h*2) + ' L ' +  (WIDTH - startX - vertL*2) + ',' +  (startY - h*2) + ' L ' +  (WIDTH - startX - vertL*3) + ',' +  (startY - h*3)  ).attr ("stroke-width", "3"), 
                      "rightTopBack",
                      WIDTH - startX - vertL*3 + (vertL - horizL - fighterSize) / 2 - forwardOffset,
                      topFighterY);

var rightTopFrontSpot = new Spot(gridPaper.path('M ' +  (WIDTH - startX - vertL*3 - horizL) + ',' +  (startY - h*3) + ' L ' +  (WIDTH - startX - vertL*3 - horizL*2) + ',' +  (startY - h*3) + ' L ' +  (WIDTH - startX - vertL*2 - horizL*2) + ',' +  (startY - h*2) + ' L ' +  (WIDTH - startX - vertL*2 - horizL) + ',' +  (startY - h*2) + ' L ' +  (WIDTH - startX - vertL*3 - horizL) + ',' +  (startY - h*3)  ).attr ("stroke-width", "3"), 
                      "rightTopFront",
                      WIDTH - startX - vertL*3 - horizL + (vertL - horizL - fighterSize) / 2 - forwardOffset,
                      topFighterY);

var rightMiddleBackSpot = new Spot(gridPaper.path('M ' +  (WIDTH - startX - vertL*2) + ',' +  (startY - h*2) + ' L ' +  (WIDTH - startX - vertL*2 - horizL) + ',' +  (startY - h*2) + ' L ' +  (WIDTH - startX - vertL - horizL) + ',' +  (startY - h) + ' L ' +  (WIDTH - startX - vertL) + ',' +  (startY - h) + ' L ' +  (WIDTH - startX - vertL*2) + ',' +  (startY - h*2) ).attr ("stroke-width", "3"), 
                      "rightMiddleBack",
                      WIDTH - startX - vertL*2 + (vertL - horizL - fighterSize) / 2 - forwardOffset,
                      midFighterY);
                      
 var rightMiddleFrontSpot = new Spot(gridPaper.path('M ' +  (WIDTH - startX - vertL*2 - horizL) + ',' +  (startY - h*2) + ' L ' +  (WIDTH - startX - vertL*2 - horizL*2) + ',' +  (startY - h*2) + ' L ' +  (WIDTH - startX - vertL - horizL*2) + ',' +  (startY - h) + ' L ' +  (WIDTH - startX - vertL - horizL) + ',' +  (startY - h) + ' L ' +  (WIDTH - startX - vertL*2 - horizL) + ',' +  (startY - h*2) ).attr ("stroke-width", "3"),
                      "rightMiddleFront",
                      WIDTH - startX - vertL*2 - horizL + (vertL - horizL - fighterSize) / 2 - forwardOffset,
                      midFighterY);                               

var rightBottomBackSpot = new Spot(gridPaper.path('M' +  (WIDTH - startX - vertL) + ',' +  (startY - h) + ' L ' +  (WIDTH - startX - vertL - horizL) + ',' +  (startY - h) + ' L ' +  (WIDTH - startX - horizL) + ',' +  (startY) + ' L ' +  (WIDTH - startX) + ',' +  (startY) + ' L ' +  (WIDTH - startX - vertL) + ',' +  (startY - h)).attr ("stroke-width", "3"),
                      "rightBottomBack",
                      WIDTH - startX - vertL + (vertL - horizL - fighterSize) / 2 - forwardOffset,
                      botFighterY);


var rightBottomFrontSpot = new Spot(gridPaper.path('M' +  (WIDTH - startX - vertL - horizL) + ',' +  (startY - h) + ' L ' +  (WIDTH - startX - vertL - horizL*2) + ',' +  (startY - h) + ' L ' +  (WIDTH - startX - horizL*2) + ',' +  (startY) + ' L ' +  (WIDTH - startX - horizL) + ',' +  (startY) + ' L ' +  (WIDTH - startX - vertL - horizL) + ',' +  (startY - h)).attr ("stroke-width", "3"),
                      "rightBottomFront",
                      WIDTH - startX - vertL - horizL + (vertL - horizL - fighterSize) / 2 - forwardOffset,
                      botFighterY);

	                      
var leftBench = new Spot(gridPaper.path('M' + (0) + ',' + (startY - h*3) + 'L' + (startX + vertL*3 - 30) + ',' + (startY - h*3) + 'L' + (startX- 30) + ',' + (startY) + 'L' + (0) + ',' + (startY) + 'L' + (0) + ',' + (startY - h*3)).attr ("stroke-width", "3"),
					"leftBench",
					10,
					benchFighterY);
			
var rightBench = new Spot(gridPaper.path('M' + (WIDTH - startX - vertL*3 + 30) + ',' + (startY - h*3) + 'L' + (WIDTH) + ',' + (startY - h*3) + 'L' + (WIDTH) + ',' + (startY) + 'L' + (WIDTH - startX + 30) + ',' + (startY) + 'L' + (WIDTH - startX - vertL*3 + 30) + ',' + (startY - h*3)).attr ("stroke-width", "3"),
					"rightBench",
					WIDTH - fighterSize - 10,
					benchFighterY);						
                      
var spots = [leftTopBackSpot, leftTopFrontSpot, leftMiddleBackSpot, leftMiddleFrontSpot, leftBottomBackSpot, leftBottomFrontSpot, leftBench, 
            rightTopBackSpot, rightTopFrontSpot, rightMiddleBackSpot, rightMiddleFrontSpot, rightBottomBackSpot, rightBottomFrontSpot, rightBench];
 
            
 spots.forEach(function(s) {

 	s.getPolygon().attr("stroke-width", "0").attr("stroke", "#704000").attr("stroke-opacity", "0.4").attr("stroke-linecap", "round").attr("stroke-linejoin", "round");
 	s.getPolygon().insertBefore(backgroundBottom);
 });
            
var leftSpots = [leftTopBackSpot, leftTopFrontSpot, leftMiddleBackSpot, leftMiddleFrontSpot, leftBottomBackSpot, leftBottomFrontSpot, leftBench];
var rightSpots = [rightTopBackSpot, rightTopFrontSpot, rightMiddleBackSpot, rightMiddleFrontSpot, rightBottomBackSpot, rightBottomFrontSpot, rightBench];
      
var fighterDistanceCheck = gridPaper.rect(0, 0, 1, 1);

function fighterUpdate(str) {
	var tokens = str.split(',');
	var toUpdate = identifyFighter(tokens[1], tokens[2]);
	toUpdate.setCurrentHealth(tokens[3]);
	toUpdate.setHealth(tokens[3]);
	toUpdate.setCurrentEnergy(tokens[4]);
	toUpdate.setEnergy(tokens[4]);
	toUpdate.setBonusDamage(tokens[5]);
	toUpdate.setDefence(tokens[6]);
}

function Fighter(name, maxHealth, maxEnergy, side, pos, passiveName, passiveDescription) {
	this.name = name.toLowerCase();
	this.pos = pos;
    this.imageName = this.name + "/" + this.name + side +".png";
    this.passiveName = passiveName;
    this.passiveDescription = passiveDescription;
    this.attackImageName = this.name + "/" + this.name + "attack" + side + ".png";
    this.blockImageName = this.name + "/" + this.name + "block" + side + ".png";
    this.supportImageName = this.name + "/" + this.name + "support" + side + ".png";
    this.portraitImageName = this.name + "/" + this.name + "portrait" + side + ".png";
    this.attackOptionImageName = this.name + "/" + this.name + "attackoption" + side + ".png";
    this.supportOptionImageName = this.name + "/" + this.name + "supportoption" + side + ".png";
    this.blockOptionImageName = this.name + "/" + this.name + "blockoption" + side + ".png";

    this.x = 100;
    if (side == "left") {
    	this.x = 550;
    } else {
    	this.x = 650;
    }
    this.getX = function(){return this.x}
    this.setX = function(newX) {this.x = newX; }
    this.y = 200;
    this.getY = function(){return this.y}
    this.setY = function(newY) {this.y = newY;}
    this.width = fighterSize;
    this.height = fighterSize;
    this.image = gridPaper.image(this.imageName, this.x, 150, fighterSize, fighterSize);
	this.portraitX = 400;
	if (side == "left") {
		if (pos == 3 || pos == 7){ 
			this.portraitX = 53 + 165;
		} else {
			this.portraitX = 53 - (pos % 4) * 9;
		}
	} else {
		if (pos == 3 || pos == 7){
			this.portraitX = WIDTH - 53 - 165;
		} else {
			this.portraitX = WIDTH - 53 + (pos % 4) * 9 ;
		}
		
	}
	this.getMaxEnergy = function(){return maxEnergy};
    this.portraitY = 35 + (pos % 4) * 40 ;
    if (pos == 3 || pos == 7) {
    	this.portraitY = 35;
    }
    this.getPortraitX = function() {return this.portraitX};
   	this.getPortraitY = function() {return this.portraitY};
   	this.altImage = this.image.clone();
    this.attackImage = gridPaper.image(this.attackImageName, this.x, 150, fighterSize, fighterSize);
    this.attackOptionImage = gridPaper.image(this.attackOptionImageName, this.x, 150, fighterSize, fighterSize);
    this.blockOptionImage = gridPaper.image(this.blockOptionImageName, this.x, 150, fighterSize, fighterSize);
    this.supportOptionImage = gridPaper.image(this.supportOptionImageName, this.x, 150, fighterSize, fighterSize);
    this.blockImage = gridPaper.image(this.blockImageName, this.x, 150, fighterSize, fighterSize);
    this.supportImage = gridPaper.image(this.supportImageName, this.x, 150, fighterSize, fighterSize);
    this.coordinateImages = function() {
   										this.image.attr('x', this.x).attr('y', this.y);
    									this.altImage.attr('x', this.x).attr('y', this.y);
    									this.attackOptionImage.attr('x', this.x).attr('y', this.y);
    									this.supportOptionImage.attr('x', this.x).attr('y', this.y);
    									this.blockOptionImage.attr('x', this.x).attr('y', this.y);
    									this.attackImage.attr('x', this.x).attr('y', this.y);
    									this.blockImage.attr('x', this.x).attr('y', this.y);
    									this.supportImage.attr('x', this.x).attr('y', this.y);  							
    									};
    
    												
    this.getImage = function(){return this.image} 
    this.getAttackImage = function(){return this.attackImage} 
    this.getAttackOptionImage = function(){return this.attackOptionImage}
    this.getSupportOptionImage = function(){return this.supportOptionImage}
    this.getBlockOptionImage = function(){return this.blockOptionImage}
    this.getBlockImage = function(){return this.blockImage} 
    this.getSupportImage = function(){return this.supportImage} 
    this.attackImage.hide();
    this.attackOptionImage.hide();
    this.supportOptionImage.hide();
    this.blockOptionImage.hide();
    this.blockImage.hide();
    this.supportImage.hide();
	this.portraitImage = gridPaper.image(this.portraitImageName, this.portraitX - 30, this.portraitY - 30, 64, 64);
	this.getPortraitImage = function() {return this.portraitImage};
	this.portraitImage.hide();
	this.getInfoStr = function () {var infoStr = name + "\n" + "Health: " + this.currentHealth + "/" + this.maxHealth + "\n" 
				 + "Energy: " + this.currentEnergy + "/" + this.maxEnergy + "\n"
				 + "Bonus Damage: " + this.bonusDamage + "\n"
				 + "Defence: " + this.defence + "\n"
				 + this.passiveName + ": " + this.passiveDescription;
				 return infoStr;}
	this.updateInfoBox = function(){
		infoBox.setInfo(this.getInfoStr());
	};
   
    this.getAltImage = function() {return this.altImage};
    this.setImage = function(image) {this.image = image}
    this.images = gridPaper.set();
        this.images.push(this.altImage);
    this.images.push(this.attackImage);
    this.images.push(this.attackOptionImage);
    this.images.push(this.supportOptionImage);
    this.images.push(this.blockOptionImage);
    this.images.push(this.blockImage);
    this.images.push(this.supportImage);

	this.altImage.hide();
 	this.image.hide();

    this.getImages = function () {return this.images};
    this.clickBox = gridPaper.rect(this.x + 20 , this.y + 40, fighterSize * 0.78, fighterSize*0.78).attr('fill', 'white')
    																				 .attr('opacity', '0').hide();
    this.getClickBox = function() {return this.clickBox};
    
    if (this.y == topFighterY - 40) {
        this.image.insertBefore(topRow);
    	this.images.insertBefore(topRow);

    } else if (this.y == midFighterY - 40) {
        this.image.insertBefore(middleRow);
    	this.images.insertBefore(middleRow);    

    } else if (this.y == benchFighterY - 40) {
    	this.image.insertBefore(benchRow); 
    	this.images.insertBefore(benchRow);
    
    } else {
        this.image.insertBefore(botRow); 
    	this.images.insertBefore(botRow);

    }
    this.maxHealth = maxHealth;
    this.maxEnergy = maxEnergy;
	this.defence = 0;
	this.setDefence = function(defence) {this.defence = defence};
    this.bonusDamage = 0;
    this.setBonusDamage = function(bonusDamage) {this.bonusDamage = bonusDamage};
    this.currentEnergy = maxEnergy;
    this.setCurrentEnergy = function(currentEnergy) {this.currentEnergy = currentEnergy};
    this.currentHealth = maxHealth;
    this.setCurrentHealth = function(currentHealth) {this.currentHealth = currentHealth};
    this.name = name;
    this.getName = function(){return this.name}
    this.animating = false;
    this.setAnimating = function(animating){this.animating = animating}
    this.isAnimating = function(){return this.animating}
    this.healthText;
    this.energyText;
    this.abilities;
    this.setAbilities = function(abilities) {this.abilities = abilities;}
    this.removeAbilities = function(){abilities.forEach(function(a) {
        a.remove();
    });}
    this.attackIndicated = false;
    this.attackOptionShown = false;
    this.supportOptionShown = false;
    this.blockOptionShown = false;
    this.supportIndicated = false;
    this.blockIndicated = false;
    
    var attackGlow;
    var blockGlow;
    var supportGlow;
    this.indicateAttack = function() { if (this.attackIndicated == false) {this.attackIndicated = true; this.attackImage.show();}};
    this.unindicateAttack = function() { if(this.attackIndicated == true) {this.attackImage.hide(); this.attackIndicated = false; return true;} return false};
	
	this.showAttackOption = function() { if (this.attackOptionShown == false) {this.attackOptionShown = true; this.attackOptionImage.show();}};
	this.hideAttackOption = function() { if(this.attackOptionShown == true) {this.attackOptionImage.hide(); this.attackOptionShown = false; return true;} return false};
	
	this.showSupportOption = function() { if (this.supportOptionShown == false) {this.supportOptionShown = true; this.supportOptionImage.show();}};
	this.hideSupportOption = function() { if(this.supportOptionShown == true) {this.supportOptionImage.hide(); this.supportOptionShown = false; return true;} return false};
	
	this.showBlockOption = function() { if (this.blockOptionShown == false) {this.blockOptionShown = true; this.blockOptionImage.show();}};
	this.hideBlockOption = function() { if(this.blockOptionShown == true) {this.blockOptionImage.hide(); this.blockOptionShown = false; return true;} return false};

	this.indicateSupport = function() { if (this.supportIndicated == false) {this.supportIndicated = true; this.supportImage.show();}};
	this.unindicateSupport = function() { if(this.supportIndicated == true) {this.supportImage.hide(); this.supportIndicated = false; return true;} return false};
	this.indicateBlock = function() {  if (this.blockIndicated == false) {this.blockIndicated = true; this.blockImage.show();}};
	this.unindicateBlock = function() { if(this.blockIndicated == true) {this.blockImage.hide(); this.blockIndicated = false; return true;} return false};
    
    this.effecttts = new Array();
    this.getEffecttts = function () {return this.effecttts};
    
    //portrait
    if (this.portraitX < 700) {
                                                                    // #cc5200, #FFF1E6#E275D3
        this.healthBar = gridPaper.rect(this.portraitX + 33, this.portraitY - 9, 80, 9).attr("fill", "#D3E275").attr("stroke", "#7CFC00"); 
        this.healthText = gridPaper.text(this.portraitX + 73, this.portraitY - 5, this.maxHealth + "/" + this.maxHealth).attr({"font-size": 10, "font-family": portraitFont});
        this.energyBar = gridPaper.rect(this.portraitX + 33, this.portraitY + 4, 80, 9).attr("fill", "#759DE2").attr("stroke", "#0000FF");
        this.energyText = gridPaper.text(this.portraitX + 73, this.portraitY + 9, this.maxEnergy + "/" + this.maxEnergy).attr({"font-size": 10, "font-family": portraitFont});
    } else if (this.portraitX > 700) {
        this.healthBar = gridPaper.rect(this.portraitX - 113, this.portraitY - 9, 80, 9).attr("fill", "#D3E275").attr("stroke", "#7CFC00");        
        this.healthText = gridPaper.text(this.portraitX - 73, this.portraitY - 5, this.maxHealth + "/" + this.maxHealth).attr({"font-size": 10, "font-family": portraitFont});   
        this.energyBar = gridPaper.rect(this.portraitX - 113, this.portraitY + 4, 80, 9).attr("fill", "#759DE2").attr("stroke", "#0000FF");
        this.energyText = gridPaper.text(this.portraitX - 73, this.portraitY + 9, this.maxEnergy + "/" + this.maxEnergy).attr({"font-size": 10, "font-family": portraitFont});            
    }
    this.energyText.node.setAttribute("class","donthighlight");
    this.healthText.node.setAttribute("class","donthighlight");
    
                      
    this.health = 0;
    this.energy = maxEnergy;

    this.setHealth = function(health) {
    
    if (health < 0) {
    	this.currentHealth = 0;
    } else {
    	this.currentHealth = health;
    }
    	
        if (this.portraitX < 700) {
            this.healthBar.animate({width: health/maxHealth * 80}, 8);          
	       } else {
            this.healthBar.animate({width: health/maxHealth * 80, x: this.portraitX - 31 - health/maxHealth * 80}, 8);
	       }
        this.healthText.attr('text', health + "/" + maxHealth);
        this.healthText.node.setAttribute("class","donthighlight");
    };
    
    this.getCurrentHealth = function() {
    	return this.currentHealth;
    }    

    this.setEnergy = function(energy) {
    	this.currentEnergy = energy;
    
        if (this.portraitX < 700) {
            this.energyBar.animate({width: energy/maxEnergy * 80}, 8);    	
        } else {
            this.energyBar.animate({width: energy/maxEnergy * 80, x: this.portraitX -31 - energy/maxEnergy * 80}, 8);    	
        }
        this.energyText.attr('text', energy + "/" + maxEnergy);
        this.energyText.node.setAttribute("class","donthighlight");
    };   
    
    this.getCurrentEnergy = function() {
    	return this.currentEnergy;
    }   

	this.portraitClickBox = gridPaper.circle(this.portraitX, this.portraitY, 32).attr('fill-opacity','0').attr("fill", "BEBEBE").attr('stroke-opacity', '0').hide();
	this.getPortraitClickBox = function() {return this.portraitClickBox};
	this.screen = gridPaper.circle(this.portraitX, this.portraitY, 32).attr('stroke-width', '3').attr('fill','#BEBEBE').attr('fill-opacity','0.7').attr('stroke-opacity', '0').hide();
	this.portrait = new gridPaper.set();
	this.faceAndCircle = new gridPaper.set();
	this.portrait.push( this.portraitImage, this.energyText, this.energyBar, this.healthText, this.healthBar);
    this.faceAndCircle.push( this.portraitImage);
    this.portrait.hide();
    this.portraitClickBox.click(function() {
    	if (!calculating) {
			ws.send("click,fighter," + name + "," + side);
		}
	});
	this.portraitClickBox.hover(
		function() {
			document.body.style.cursor = 'pointer';
			infoBox.setInfo(name + "\n" + "Health: " + maxHealth + "/" + maxHealth + "\n" 
				 + "Energy: " + maxEnergy + "/" + maxEnergy + "\n"
				 + "Bonus Damage: " + 0 + "\n"
				 + "Defence: " + 0 + "\n"
				 + passiveName + ": " + passiveDescription);
			infoBox.show();
			
		},
		function () {
			document.body.style.cursor = 'auto';
			infoBox.hide(false);
		}
	);    
	this.clickBox.hover(
		function() {
			document.body.style.cursor = 'pointer';
			infoBox.setInfo(name + "\n" + "Health: " + maxHealth + "/" + maxHealth + "\n" 
				 + "Energy: " + maxEnergy + "/" + maxEnergy + "\n"
				 + "Bonus Damage: " + 0 + "\n"
				 + "Defence: " + 0 + "\n"
				 + passiveName + ": " + passiveDescription);
			infoBox.show();
			
		},
		function () {
			document.body.style.cursor = 'auto';
			infoBox.hide(false);
		}
	); 
	this.getScreen = function() {return this.screen};		
	this.getPortraitCircle = function() {return this.portraitCircle};
    this.getPortrait = function() {return this.portrait};
    this.token = new FighterToken(this.portraitImageName, pos, side);
    
    this.getToken = function() {return this.token};
    
        this.healthText.hide();
    this.energyText.hide();
}     

function FighterToken(imageName, pos, side) {
	pos = pos % 4;
	this.x = 250 + 65 *(pos);
	if (side == "right") {
		this.x = WIDTH - 250 - 65 *(pos);
	}
	this.y = 75;
	this.image = gridPaper.image(imageName, this.x - 25 , this.y - 25, 50, 50);
	
	this.circle = gridPaper.circle(this.x, this.y, 25).attr("fill", "#fff").attr('fill-opacity', '0').attr('stroke-width', '2');
	this.portrait = gridPaper.set(this.image, this.circle);
	this.portrait.hover(
		function() {
			document.body.style.cursor = 'pointer';
		},
		function () {
			document.body.style.cursor = 'auto';
		}
	);
	this.getPortrait = function () {return this.portrait};
	this.spot = null;
	this.getSpot = function () {return this.spot};
	this.setSpot = function (spot) {this.spot = spot};
	this.getCircle = function(){return this.circle};
	
}          

var topRow = gridPaper.rect(0, 0, 0, 0);
var middleRow = gridPaper.rect(0, 0, 0, 0);
var benchRow = gridPaper.rect(0, 0, 0, 0);
var botRow = gridPaper.rect(0, 0, 0, 0);


var optionPolySet = gridPaper.set();

function showPossibleMoves(message, justPressed) {
    var messageTokens = message.split(",");
    while(optionPolySet.length > 0) {
    	optionPolySet.pop().remove();
    }
    if (justPressed) {
	abilities.forEach(function(a){
		a.getRect().attr("fill-opacity", 0);
		a.getRect().attr("fill", "white");
		a.setClicked(false);				
	});    
	}
 	var abilityName = messageTokens[2];
    var hoverColor;	
    var spotInfoTokens = [];
    abilities.forEach(function(a){
		if (messageTokens[2] == a.getName()) {
			a.setClicked(true);
			a.getRect().attr("fill", "#999999");
			a.getRect().attr("fill-opacity", 0.5);			
    	}
	});
    
    for (var j = 3; j < messageTokens.length - 1; j++) {
    	spotInfoTokens[j - 3] = messageTokens[j];
    }
    spotInfoTokens.forEach(function(si) {
        var coords = si.split(".")[1];
        var optionPoly = createPathFromCoords(coords);
   //     optionPoly.insertBefore(backgroundBottom);
        var spotNames = si.split(".")[0].split("-");    
        var spotsToIndicate = [];
        var side = si.split(".")[2];
        for (var i = 0; i < spotNames.length; i++) {
        	spotsToIndicate.push(identifySpot(spotNames[i]));
        } 
        optionPolySet.push(optionPoly);
   		if (messageTokens[1] == "move") {
   			hoverColor = moveColor;
        } else if (messageTokens[1] == "support") {
 			hoverColor = supportColor;
        } else if (messageTokens[1] == "attack") {
 			hoverColor = attackColor;
        }  
        optionPoly.click(function() {
   			spotsToIndicate.forEach(function(s) {			
   				ws.send("click,spot," + spotNames[0] + "," + side);
   					while(optionPolySet.length > 0) {
    					optionPolySet.pop().remove();
    				}
   				});
   			});
        optionPoly.hover(
   			function() {
   				optionPoly.attr("fill", hoverColor).attr("fill-opacity", 0.5);
   			},
   			function() {
   				optionPoly.attr("fill-opacity", 0);  				
   			});	 
   		 
//        }

    });
    
	
}

function move(moves) {
//		alert(moves);
        var images = gridPaper.set();
        var nextStr = "";
        var smallTokens = moves.split(",");
        var fighter = identifyFighter(smallTokens[1], smallTokens[2]);
        images.push(fighter.getAltImage());
        var spot = identifySpot(smallTokens[3]);
          fighter.setX(spot.getFighterX());
          fighter.setY(spot.getFighterY());   
          fighter.getClickBox().attr({x: fighter.getX() + 20, y: fighter.getY() + 40});  
          var newSize = 's1';
          var botset = gridPaper.set();
          var topset = gridPaper.set();
          var midset = gridPaper.set();
          var benchset = gridPaper.set();
          if (fighter.getY() == botFighterY) {
          	fighter.getImage().insertBefore(botRow);
          	 fighter.getImages().insertBefore(botRow);
          	 newSize = 's1';
          } else if (fighter.getY() == benchFighterY) {
            fighter.getImage().insertBefore(benchRow);
          	fighter.getImages().insertBefore(benchRow);
          	newSize = 's0.97';
          
          }	else if (fighter.getY() == midFighterY) {
          	fighter.getImage().insertBefore(middleRow);
          	fighter.getImages().insertBefore(middleRow);
          	newSize = 's0.95';
	
          } else if (fighter.getY() == topFighterY) {
            newSize = 's0.90';
            fighter.getImage().insertBefore(topRow);
          	fighter.getImages().insertBefore(topRow);
          }
		  
          fighters.forEach(function(f) {
          	if (f.getY() == botFighterY) {
          	 	botset.push(f.getClickBox());
          	} else if (f.getY() == benchFighterY) {
          		benchset.push(f.getClickBox());
          	} else if (f.getY() == midFighterY) {
          	 	midset.push(f.getClickBox());
          	} else if (f.getY() == topFighterY) {
          	 	topset.push(f.getClickBox());
          	}
          });
          
          topset.toFront();
          midset.toFront();
          benchset.toFront();
          botset.toFront();

          	
         setTimeout(function() {     
            fighter.getImage().animate({x: spot.getFighterX(), y: spot.getFighterY(), transform: newSize}, smallTokens[4] - 300, 
            function () {
            	fighter.getImages().forEach(function(fi){
					fi.animate({transform: newSize});
		  		});
		  		fighter.getClickBox().animate({transform: newSize});
            });
            fighter.getAltImage().animate({x: spot.getFighterX(), y: spot.getFighterY(), transform: newSize}, smallTokens[4] - 300);  
            fighter.getImages().animate({x: spot.getFighterX(), y: spot.getFighterY(), transform: newSize}, smallTokens[4] - 300);        

		},250);
                 
             
        

}

leftSpots.forEach(function(spot) {
    spot.getPolygon().click(function() {
        ws.send("click,spot," + spot.getName() + ",left");
    });
});
rightSpots.forEach(function(spot) {
    spot.getPolygon().node.onclick = function() {
        ws.send("click,spot," + spot.getName() + ",right");
    };
});

function identifySpot(str) {
    for (var i = 0; i < spots.length; i++) {
        if (spots[i].getName() == str) {
            return spots[i];
        }
    }
}

function identifyFighter(name, side) {
if (side == "left") {
    for (var i = 0; i < leftFighters.length; i++) {
        if (leftFighters[i].getName().toLowerCase() == name.toLowerCase()) {
            return leftFighters[i];
        }
    }    
}  else if (side == "right") {
    for (var i = 0; i < rightFighters.length; i++) {
        if (rightFighters[i].getName().toLowerCase() == name.toLowerCase()) {
            return rightFighters[i];
        }
    }  
}
}
