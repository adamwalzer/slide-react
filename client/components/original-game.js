// var $el;
// var move = 0;
// var moving = false;
// var b = Array(Array(null,null,null,null),Array(null,null,null,null),Array(null,null,null,null),Array(null,null,null,null));

// var PieceView = function(opts) {
// 	this.initialize = function(opts) {
// 		var opts = opts || {};
// 		this.w = opts.w ? 100/opts.w : 25;
// 		this.x = opts.x || 0;
// 		this.y = opts.y || 0;
// 		this.v = opts.z || 2;
// 		this.m = opts.m || 0
// 		this.p = opts.p || {};
// 		this.render();
// 	};
// 	this.render = function() {
// 		this.$el = $('<div style="left:'+this.x*this.w+'%; top:'+this.y*this.w+'%;"><span></span></div>');
// 		this.$span = this.$el.find('span');
// 		this.val(this.v);
// 		$el.append(this.$el);
// 	};
// 	this.val = function(nv) {
// 		this.v = nv || this.v;
// 		this.$el.attr({'val':this.v})
// 		this.$span.html(this.v);
// 		return this.v;
// 	};
// 	this.move = function(m) {
// 		this.m = m || this.m;
// 		return this.m;
// 	};
// 	this.getX = function() {
// 		return this.x;
// 	};
// 	this.moveX = function(nx) {
// 		this.x = nx;
// 		this.$el.css({'left':nx*this.w+'%'});
// 		return this;
// 	};
// 	this.getY = function() {
// 		return this.y;
// 	};
// 	this.moveY = function(ny) {
// 		this.y = ny;
// 		this.$el.css({'top':ny*this.w+'%'});
// 		return this;
// 	};
// 	this.destroy = function() {
// 		var self = this;
// 		self.$el.addClass('destroying');
// 		_.delay(function() {
// 			self.$el.remove();
// 		},250);
// 	};
// 	this.initialize(opts);
// };

// var updateScore = function(z) {
// 	var s = Session.get('original-score') + z;
// 	Session.set('original-score', s);
// }

// var createPiece = function() {
// 	var spaces = [];
// 	// for(var i=0;i<4;i++) {
// 	// 	for(var j=0;j<4;j++) {
// 	// 		if(!this.b[i][j]) {
// 	// 			spaces.push({x:i,y:j});
// 	// 		}
// 	// 	}
// 	// }
// 	_.each(b, function(c,i) {
// 		_.each(c, function(d,j) {
// 			if(d) {
// 				// self.values.push(b.val());
// 			} else {
// 				spaces.push({x:i,y:j});
// 			}
// 		});
// 	});
// 	if(spaces.length > 0) {
// 		var opts = {};
// 		opts.p = this;
// 		var l = Math.floor(Math.random()*spaces.length);
// 		var space = spaces[l];
// 		// spaces.splice(l,1);
// 		opts.w = 4;
// 		opts.x = space.x;
// 		opts.y = space.y;
// 		// opts.z = Math.min.apply(null,this.values);
// 		opts.z = Math.floor(Math.random()*2*.75+1)*2;
// 		// opts.z = 2;
// 		move++;
// 		updateScore(opts.z);
// 		b[opts.x][opts.y] = new PieceView(opts);
// 	}
// 	if(spaces.length === 1) {
// 		var alive = false;
// 		_.each(b, function(c,i) {
// 			_.each(c, function(d,j) {
// 				if(d && i != 0) {
// 					if(d.val() === b[i-1][j].val()) {
// 						alive = true;
// 					}
// 				}
// 				if(d && j != 0) {
// 					if(d.val() === b[i][j-1].val()) {
// 						alive = true;
// 					}
// 				}
// 			});
// 		});
// 		if(!alive) {
// 			moving = true;
// 			var $p = $el.parent();
// 			$p.find('.game-over-menu h1').html("You scored "+Session.get('original-score')+"!");
// 			$p.addClass('game-over');
// 			// alert("No more moves. Your score is "+Session.get('original-score'));
// 		}
// 	}
// 	// this.values = [];
// };

// var moveTiles = function(Z,d) {
// 	var getB, setB;
// 	if(Z==='X') {
// 		getB = function(i,j) {
// 			return b[i][j];
// 		};
// 		setB = function(i,j,n) {
// 			b[i][j] = n;
// 		};
// 	} else {
// 		getB = function(i,j) {
// 			return b[j][i];
// 		};
// 		setB = function(i,j,n) {
// 			b[j][i] = n;
// 		};
// 	}

// 	return function() {
// 		if(!moving) {
// 			moving = true;
// 			var moved = false;
// 			for(var j=0; j<4; j++) {
// 				for(var i=1.5+.5*d; d*i>d*1.5-2.5; i-=d) {
// 					if(getB(i,j)) {
// 						for(var k=1;k<=1.5+d*1.5-d*i;k++) {
// 							if(!getB(i+d*k,j)) {
// 								setB(i+d*k,j,getB(i+d*k-d,j)['move'+Z](i+d*k));
// 								setB(i+d*k-d,j,null);
// 								moved = true;
// 							} else {
// 								if(getB(i+d*k,j).move() != move && getB(i+d*k,j).val() === getB(i+d*k-d,j).val()) {
// 									getB(i+d*k,j).val(2*getB(i+d*k,j).val());
// 									getB(i+d*k,j).move(move);
// 									getB(i+d*k-d,j)['move'+Z](getB(i+d*k,j)['get'+Z]()).destroy();
// 									setB(i+d*k-d,j,null);
// 									moved = true;
// 								}
// 								break;
// 							}
// 						}
// 					}
// 				}
// 			}
// 			afterMove(moved);
// 		}
// 	}
// }

// var left = moveTiles('X',-1);

// var up = moveTiles('Y',-1);

// var right = moveTiles('X',1);

// var down = moveTiles('Y',1);

// var afterMove = function(moved) {
// 	if(moved) {
// 		_.delay(function() {
// 			createPiece();
// 		}, 250);
// 	}
// 	moving = false;
// };

// var keyAction = function(e) {
// 	if($('body').hasClass('original')) {
// 		var code = e.keyCode || e.which;
// 		if(code === 37) left();
// 		else if(code === 38) up();
// 		else if(code === 39) right();
// 		else if(code === 40) down();
// 	}
// };

// var setNewHigh = function(resetBoard) {
// 	var high = Math.max(Session.get('original-score'),Session.get('original-high-score'));
// 	setVar('original-high-score',high);

// 	if(Meteor.userId()) {
// 		Meteor.call('addHighScore', {
// 			game: "original",
// 			score: Session.get('original-score'),
// 			board: b
// 		}, function() {
// 			if(resetBoard) {
// 				Session.set('original-score', 0);
// 				_.each(b, function(c) {
// 					_.each(c, function(d) {
// 						d && d.destroy();
// 					});
// 				});
// 				moving = false;
// 				b = Array(Array(null,null,null,null),Array(null,null,null,null),Array(null,null,null,null),Array(null,null,null,null));
// 				createPiece();
// 			}
// 		});
// 	} else if(resetBoard) {
// 		Session.set('original-score', 0);
// 		_.each(b, function(c) {
// 			_.each(c, function(d) {
// 				d && d.destroy();
// 			});
// 		});
// 		moving = false;
// 		b = Array(Array(null,null,null,null),Array(null,null,null,null),Array(null,null,null,null),Array(null,null,null,null));
// 		createPiece();
// 	}
// };

// Template.originalGame.created = function() {
// 	Session.set('original-score', 0);
// 	if(getVar('original-high-score')) Session.set('original-high-score',getVar('original-high-score'));
// 	if(!Session.get('original-high-score')) Session.set('original-high-score',0);
// };

// Template.originalGame.rendered = function() {
// 	$(document).on('keydown', keyAction);
// 	$el = $('.original-game .board').touchswipe({
// 		swipeLeft: left,
// 		swipeRight: right,
// 		swipeUp: down,
// 		swipeDown: up
// 	});

// 	createPiece();
// };

// Template.originalGame.helpers({
// 	score: function() {
// 		return Session.get('original-score');
// 	},
// 	high: function() {
// 		var highs = HighScores.find({game:'original'},{limit:1,sort:{score:-1}}).fetch();
// 		if(highs[0]) setVar('original-high-score',Math.max(Session.get('original-high-score'),highs[0].score));
// 		return Session.get('original-high-score');
// 	},
// 	title: function() {
// 		return "Slide - Original";
// 	}
// });

// Template.originalGame.events({
// 	'click .reset-menu li, touchstart .reset-menu li': function(e) {
// 		setNewHigh($(e.currentTarget).hasClass('yes'));
// 		$el.parent().removeClass('reset-open');
// 	},
// 	'click .reset, touchstart .reset': function() {
// 		$el.parent().addClass('reset-open');
// 	},
// 	'click .game-over-menu li, touchstart .game-over-menu li': function(e) {
// 		setNewHigh($(e.currentTarget).hasClass('yes'));
// 		$el.parent().removeClass('game-over');
// 	},
// 	'click .game-over-menu .no, touchstart .game-over-menu .no': function() {
// 		$('body').removeClass('original');
// 	}
// });