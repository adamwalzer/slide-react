var opts = {
	title: "clear",
	gameOver: false,
	originalB: Array(Array({v:0},{v:0},{v:0},{v:0}),Array({v:0},{v:0},{v:0},{v:0}),Array({v:0},{v:0},{v:0},{v:0}),Array({v:0},{v:0},{v:0},{v:0})),
	created: function() {
		Session.set(this.t+'-score', 0);
		if(getVar(this.t+'-high-score')) Session.set(this.t+'-high-score',getVar(this.t+'-high-score'));
		if(!Session.get(this.t+'-high-score')) Session.set(this.t+'-high-score',10000);
	},
	helpers: function() {
		var highs = HighScores.find({game:'clear'},{sort:{score:1},limit:1}).fetch();
		if(highs[0]) {
			var min = Math.min(Session.get(self.t+'-high-score'),highs[0].score)
			setVar(self.t+'-high-score',isNaN(min) ? 10000 : min);
		}
		return {
			score: Session.get('clear-score'),
			high: Session.get('clear-high-score')===10000?"N/A":Session.get('clear-high-score'),
			title: "Slide - Clear"
		}
	},
	setNewHigh: function(resetBoard,b) {
		if(resetBoard) {
			Session.set('clear-score', 0);
			_.each(b, function(c) {
				_.each(c, function(d) {
					d && d.destroy();
				});
			});
			this.renderGame();
		}
	},
	afterMove: function(moved) {
		if(this.gameOver) return;
		var self = this;
		self.updateScore(1);
		if(moved) {
			_.delay(function() {
				self.createPiece();
			}, 250);
		}
		self.moving = false;
	},
	renderGame: function() {
		this.gameOver = false;
		this.moving = false;
		this.b = Array(Array(null,null,null,null),Array(null,null,null,null),Array(null,null,null,null),Array(null,null,null,null));
		this.originalB = Array(Array({v:0},{v:0},{v:0},{v:0}),Array({v:0},{v:0},{v:0},{v:0}),Array({v:0},{v:0},{v:0},{v:0}),Array({v:0},{v:0},{v:0},{v:0}));
		this.createPiece(10);
	},
	makeSpaces: function(b,values,n) {
		var spaces = [];
		_.each(b, function(c,i) {
			_.each(c, function(d,j) {
				if(d) {
					!n && values.push(d.val());
				} else {
					spaces.push({x:i,y:j});
				}
			});
		});
		return spaces;
	},
	getGameOverMessage: function() {
		return "You couldn't clear the board";
	},
	boardCleared: function() {
  	this.gameOver = true;
		var low = Math.min(Session.get('clear-score'),Session.get('clear-high-score'));
		setVar('clear-high-score',low);

		Meteor.call('addHighScore', {
			game: "clear",
			score: Session.get('clear-score'),
			board: this.originalB,
			sort: 1
		});

		var $p = this.$el.parent();
		$p.find('.game-over-menu h1').html("You scored " + Session.get('clear-score') + "!");
		$p.addClass('game-over');
  },
  combineVal: function() {
  	return " ";
  },
  newZ: function(values,n) {
  	return n || values[Math.floor(Math.random()*values.length)];
  },
  afterCreatePiece: function(opts,n) {
		if(typeof n == "number") {
			this.originalB[opts.x][opts.y] = {v:opts.z};
		}
  }
};

ClearGame = GameTemplate(opts);