GameTemplate = function(opts) {
  opts = opts || {};
  this.t = opts.title || "original";
  var sort = opts.sort || -1;
  this.move = 0;
  this.moving = false;
  var values = opts.values || [];
  var originalValues = opts.values || [];
  this.b = Array(Array(null,null,null,null),Array(null,null,null,null),Array(null,null,null,null),Array(null,null,null,null));
  this.originalB = opts.originalB || null;
  if(opts.variables) {
  	for(var key in opts.variables) {
  		this[key] = opts.variables[key];
  	}
  }
  var self = this;

  this.rendered = function() {
    $(document).on('keydown', keyAction.bind(self));
    self.$el = $('.'+self.t+'-game .board').touchswipe({
      swipeLeft: self.left,
      swipeRight: self.right,
      swipeUp: self.down,
      swipeDown: self.up
    });

    self.renderGame();
  };

  this.created = opts.created ? opts.created.bind(self) : function() {
		Session.set(self.t+'-score', 0);
		if(getVar(self.t+'-high-score')) Session.set(this.t+'-high-score',getVar(self.t+'-high-score'));
		if(!Session.get(self.t+'-high-score')) Session.set(self.t+'-high-score',0);
	};

	this.helpers = opts.helpers || {
		score: function() {
			return Session.get(self.t+'-score');
		},
		high: function() {
			var highs = HighScores.find({game:self.t},{limit:1,sort:{score:sort}}).fetch();
			if(highs[0]) {
				var max = Math.max(Session.get(self.t+'-high-score'),highs[0].score)
				setVar(self.t+'-high-score',isNaN(max) ? 0 : max);
			}
			return Session.get(self.t+'-high-score') || "N/A";
		},
		title: function() {
			return "Slide - "+self.t;
		}
	};

	this.events = {
		'click .reset-menu li, touchstart .reset-menu li': function(e) {
			setNewHigh($(e.currentTarget).hasClass('yes'),self.b);
			self.$el.parent().removeClass('reset-open');
		},
		'click .reset, touchstart .reset': function() {
			self.$el.parent().addClass('reset-open');
		},
		'click .game-over-menu li, touchstart .game-over-menu li': function(e) {
			setNewHigh($(e.currentTarget).hasClass('yes'),self.b);
			self.$el.parent().removeClass('game-over');
		},
		'click .game-over-menu .no, touchstart .game-over-menu .no': function() {
			$('body').removeClass(self.t);
		}
	};

  this.renderGame = opts.renderGame ? opts.renderGame.bind(self) : function() {
    self.createPiece();
  };

  var PieceView = function(opts) {
    this.initialize = function(opts) {
      var opts = opts || {};
      this.w = opts.w ? 100/opts.w : 25;
      this.x = opts.x || 0;
      this.y = opts.y || 0;
      this.v = opts.z || 2;
      this.m = opts.m || 0
      this.p = opts.p || {};
      this.render();
    };
    this.render = function() {
      this.$el = $('<div style="left:'+this.x*this.w+'%; top:'+this.y*this.w+'%;"><span></span></div>');
      this.$span = this.$el.find('span');
      this.val(this.v);
      self.$el.append(this.$el);
    };
    this.val = function(nv) {
      this.v = nv || this.v;
      if(this.v===" ") this.destroy();
      this.$el.attr({'val':this.v})
      this.$span.html(this.v);
      return this.v;
    };
    this.move = function(m) {
      this.m = m || this.m;
      return this.m;
    };
    this.getX = function() {
      return this.x;
    };
    this.moveX = function(nx) {
      this.x = nx;
      this.$el.css({'left':nx*this.w+'%'});
      return this;
    };
    this.getY = function() {
      return this.y;
    };
    this.moveY = function(ny) {
      this.y = ny;
      this.$el.css({'top':ny*this.w+'%'});
      return this;
    };
    this.destroy = function() {
      var self = this;
      self.$el.addClass('destroying');
      _.delay(function() {
        self.$el.remove();
      },250);
    };
    this.initialize(opts);
  };

  this.makeNewPiece = function(opts) {
  	return new PieceView(opts);
  };

  this.updateScore = function(z) {
    var s = Session.get(self.t+'-score') + z;
    Session.set(self.t+'-score', s);
  };

  var newZ = opts.newZ || function() {
  	return Math.floor(Math.random()*2*.75+1)*2;
  };

  this.makeSpaces = opts.makeSpaces || function(b) {
    var spaces = [];
    _.each(b, function(c,i) {
      _.each(c, function(d,j) {
        if(!d) {
          spaces.push({x:i,y:j});
        }
      });
    });
    return spaces;
  };

  var afterCreatePiece = opts.afterCreatePiece ? opts.afterCreatePiece.bind(self) : function(){};

   this.split = opts.split ? opts.split.bind(self) : function(){};

  var getGameOverMessage = opts.getGameOverMessage || function() {
  	return "You scored "+Session.get(self.t+'-score')+"!";
  }

  var boardCleared = opts.boardCleared ? opts.boardCleared.bind(self) : function() {};

  this.createPiece = function(n) {
    var spaces = this.makeSpaces(self.b,values,n);
  	if(this.t === "clear" && !n && spaces.length === 16) {
			boardCleared();
		} else {
	    if(spaces.length > 0) {
	      var opts = {};
	      opts.p = this;
	      var l = Math.floor(Math.random()*spaces.length);
	      var space = spaces[l];
	      opts.w = 4;
	      opts.x = space.x;
	      opts.y = space.y;
	      opts.z = newZ(values,n);
	      this.move++;
	      this.t != "clear" && this.t != "combine" && self.updateScore(opts.z);
	      self.b[opts.x][opts.y] = new PieceView(opts);
	      afterCreatePiece(opts,n);
	    }
	    if(spaces.length === 1) {
	      var alive = false;
	      _.each(self.b, function(c,i) {
	        _.each(c, function(d,j) {
	          if(d && i != 0) {
	            if(d.val() === self.b[i-1][j].val()) {
	              alive = true;
	            }
	          }
	          if(d && j != 0) {
	            if(d.val() === self.b[i][j-1].val()) {
	              alive = true;
	            }
	          }
	        });
	      });
	      if(!alive) {
	        this.moving = true;
	        var $p = self.$el.parent();
	        $p.find('.game-over-menu h1').html(getGameOverMessage());
	        $p.addClass('game-over');
	      }
	    }
	    if(n) {
	    	self.createPiece(n-1);
	    } else {
		    values = [];
		    self.split(spaces);
	    }
	  }
  };

  var combineVal = opts.combineVal ? opts.combineVal.bind(self) : function(v) {
  	return 2*v;
  }

  var movedWithoutCombine = opts.movedWithoutCombine || function() {
  	return true;
  }

  var moveTiles = function(Z,d) {
    var getB, setB;
    if(Z==='X') {
      getB = function(i,j) {
        return self.b[i][j];
      };
      setB = function(i,j,n) {
        self.b[i][j] = n;
      };
    } else {
      getB = function(i,j) {
        return self.b[j][i];
      };
      setB = function(i,j,n) {
        self.b[j][i] = n;
      };
    }

    return function(create) {
      if(!this.moving || typeof create != "undefined") {
        if(typeof create === "undefined") this.moving = true;
        var moved = false;
        for(var j=0; j<4; j++) {
          for(var i=1.5+.5*d; d*i>d*1.5-2.5; i-=d) {
            if(getB(i,j)) {
              for(var k=1;k<=1.5+d*1.5-d*i;k++) {
                if(!getB(i+d*k,j)) {
                  setB(i+d*k,j,getB(i+d*k-d,j)['move'+Z](i+d*k));
                  setB(i+d*k-d,j,null);
                  moved = movedWithoutCombine();
                } else {
                  if(getB(i+d*k,j).move() != this.move && getB(i+d*k,j).val() === getB(i+d*k-d,j).val()) {
                    getB(i+d*k,j).val(combineVal(getB(i+d*k,j).val()));
                    getB(i+d*k,j).move(self.move);
                    getB(i+d*k-d,j)['move'+Z](getB(i+d*k,j)['get'+Z]()).destroy();
                  	if(getB(i+d*k,j).val() === " ") setB(i+d*k,j,null);
                    setB(i+d*k-d,j,null);
                    moved = true;
                  }
                  break;
                }
              }
            }
          }
        }
        afterMove(moved,create);
      }
    }
  };

  this.left = moveTiles('X',-1);

  this.up = moveTiles('Y',-1);

  this.right = moveTiles('X',1);

  this.down = moveTiles('Y',1);

  var afterMove = opts.afterMove ? opts.afterMove.bind(self) : function(moved) {
    if(moved) {
      _.delay(function() {
        self.createPiece();
      }, 250);
    }
    self.moving = false;
  };

  var keyAction = opts.keyAction || function(e) {
    if($('body').hasClass(self.t)) {
      var code = e.keyCode || e.which;
      if(code === 37) this.left();
      else if(code === 38) this.up();
      else if(code === 39) this.right();
      else if(code === 40) this.down();
    }
  };

  var setNewHigh = opts.setNewHigh ? opts.setNewHigh.bind(self) : function(resetBoard) {
    var high = Math.max(Session.get(self.t+'-score'),Session.get(self.t+'-high-score'));
    setVar(self.t+'-high-score',high);
    var b = Array(Array(null,null,null,null),Array(null,null,null,null),Array(null,null,null,null),Array(null,null,null,null));
    for(var i=0;i<4;i++) {
	    for(var j=0;j<4;j++) {
	    	if(self.b[i][j]) {
		    	b[i][j] = {v:self.b[i][j].v}
		    }
	    }
    }

    if(Meteor.userId()) {
      Meteor.call('addHighScore', {
        game: self.t,
        score: Session.get(self.t+'-score'),
        board: b,
        sort: sort
      }, function() {
        if(resetBoard) {
          Session.set(self.t+'-score', 0);
          _.each(self.b, function(c) {
            _.each(c, function(d) {
              d && d.destroy();
            });
          });
          values = originalValues;
          self.moving = false;
          self.b = Array(Array(null,null,null,null),Array(null,null,null,null),Array(null,null,null,null),Array(null,null,null,null));
          self.renderGame();
        }
      });
    } else if(resetBoard) {
      Session.set(self.t+'-score', 0);
      console.log(self.b);
      _.each(self.b, function(c) {
        _.each(c, function(d) {
          d && d.destroy();
        });
      });
      values = originalValues;
      self.moving = false;
      self.b = Array(Array(null,null,null,null),Array(null,null,null,null),Array(null,null,null,null),Array(null,null,null,null));
      self.renderGame();
    }
  };
};

(function(){
	var opts = {
		title: "original"
	};
	var template = new GameTemplate(opts);

	Template[opts.title+"Game"].created = template.created;

	Template[opts.title+"Game"].rendered = template.rendered;

	Template[opts.title+"Game"].helpers(template.helpers);

	Template[opts.title+"Game"].events(template.events);
})();

(function(){
	var opts = {
		title: "infinity",
		values: [1],
		makeSpaces: function(b,values) {
			var spaces = [];
			_.each(b, function(c,i) {
				_.each(c, function(d,j) {
					if(d) {
						values.push(d.val());
					} else {
						spaces.push({x:i,y:j});
					}
				});
			});
			return spaces;
		},
		newZ: function(values) {
			return Math.max(Math.min.apply(null,values)-Math.floor(Math.random()*10/9),1);
		},
		combineVal: function(v) {
			return v+1;
		}
	};
	var template = new GameTemplate(opts);

	Template[opts.title+"Game"].created = template.created;

	Template[opts.title+"Game"].rendered = template.rendered;

	Template[opts.title+"Game"].helpers(template.helpers);

	Template[opts.title+"Game"].events(template.events);
})();

(function(){
	var opts = {
		title: "twist",
		variables: {
			degrees: 0,
			fall: function(create) {
				self.move++;
				create = create || 0;
				var twist = (this.degrees/90%4+4)%4;
				switch(twist) {
					case 0:
						this.down(create);
						break;
					case 1:
						this.right(create);
						break;
					case 2:
						this.up(create);
						break;
					case 3:
						this.left(create);
						break;
				}
			},
			cw: function() {
				this.rotate(90);
			},
			ccw: function() {
				this.rotate(-90);
			},
			rotate: function(deg) {
				if(!this.moving) {
					this.moving = true;
					this.degrees += deg;
					this.spinBoard();
					this.spinPieces();
					this.fall(1);
				}
			},
			spinBoard: function() {
				this.$el.css({
					'-webkit-transform' : 'rotate('+ this.degrees +'deg)',
					'-moz-transform' : 'rotate('+ this.degrees +'deg)',
					'-ms-transform' : 'rotate('+ this.degrees +'deg)',
					'transform' : 'rotate('+ this.degrees +'deg)'
				});
			},
			spinPieces: function() {
				this.$el.find('>div span').css({
					'-webkit-transform' : 'translateX(-50%) translateY(-50%) rotate('+ -this.degrees +'deg)',
					'-moz-transform' : 'translateX(-50%) translateY(-50%) rotate('+ -this.degrees +'deg)',
					'-ms-transform' : 'translateX(-50%) translateY(-50%) rotate('+ -this.degrees +'deg)',
					'transform' : 'translateX(-50%) translateY(-50%) rotate('+ -this.degrees +'deg)'
				});
			}
		},
		afterCreatePiece: function() {
			var self = this;
			self.$el.find('>div span').css({
				'-webkit-transform' : 'translateX(-50%) translateY(-50%) rotate('+ -this.degrees +'deg)',
				'-moz-transform' : 'translateX(-50%) translateY(-50%) rotate('+ -this.degrees +'deg)',
				'-ms-transform' : 'translateX(-50%) translateY(-50%) rotate('+ -this.degrees +'deg)',
				'transform' : 'translateX(-50%) translateY(-50%) rotate('+ -this.degrees +'deg)'
			});
			_.delay(function() {
				self.fall(0);
				self.fall(0);
			}, 100);
		},
		keyAction: function(e) {
			if($('body').hasClass('twist')) {
				var code = e.keyCode || e.which;
				if(code === 37) this.ccw();
				else if(code === 39) this.cw();
			}
		},
		afterMove: function(moved,create) {
			if(create) {
				var self = this;
				if(moved) {
					_.delay(function() {
						self.createPiece();
					}, 250);
				}
				self.moving = false;
			}
		}
	};
	var template = new GameTemplate(opts);

	Template[opts.title+"Game"].created = template.created;

	Template[opts.title+"Game"].rendered = template.rendered;

	Template[opts.title+"Game"].helpers(template.helpers);

	Template[opts.title+"Game"].events(template.events);
})();

(function(){
	var opts = {
		title: "clear",
		originalB: Array(Array({v:0},{v:0},{v:0},{v:0}),Array({v:0},{v:0},{v:0},{v:0}),Array({v:0},{v:0},{v:0},{v:0}),Array({v:0},{v:0},{v:0},{v:0})),
		created: function() {
			Session.set(this.t+'-score', 0);
			if(getVar(this.t+'-high-score')) Session.set(this.t+'-high-score',getVar(this.t+'-high-score'));
			if(!Session.get(this.t+'-high-score')) Session.set(this.t+'-high-score',10000);
		},
		helpers: {
			score: function() {
				return Session.get('clear-score');
			},
			high: function() {
				var highs = HighScores.find({game:'clear'},{sort:{score:1},limit:1}).fetch();
				if(highs[0]) {
					var min = Math.min(Session.get(self.t+'-high-score'),highs[0].score)
					setVar(self.t+'-high-score',isNaN(min) ? 10000 : min);
				}
				return Session.get('clear-high-score')===10000?"N/A":Session.get('clear-high-score');
			},
			title: function() {
				return "Slide - Clear";
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
			if(gameOver) return;
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
			gameOver = false;
			this.moving = false;
			this.b = Array(Array(null,null,null,null),Array(null,null,null,null),Array(null,null,null,null),Array(null,null,null,null));
			this.originalB =  Array(Array({v:0},{v:0},{v:0},{v:0}),Array({v:0},{v:0},{v:0},{v:0}),Array({v:0},{v:0},{v:0},{v:0}),Array({v:0},{v:0},{v:0},{v:0}));
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
	  	gameOver = true;
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
	var template = new GameTemplate(opts);

	Template[opts.title+"Game"].created = template.created;

	Template[opts.title+"Game"].rendered = template.rendered;

	Template[opts.title+"Game"].helpers(template.helpers);

	Template[opts.title+"Game"].events(template.events);
})();

(function(){
	var opts = {
		title: "combine",
		variables: {
			mx: 0
		},
		renderGame: function() {
			this.mx = 0;
			this.createPiece();
		},
		afterMove: function(moved) {
			var spaces = this.makeSpaces(this.b);
			if(spaces.length===15) {
				this.updateScore(100);
				this.split(spaces);
			}
			this.mx++;
			this.move++;
			this.moving = false;
			if(this.mx>=13) {
				this.moving = true;
				var $p = this.$el.parent();
				$p.find('.game-over-menu h1').html("You scored "+Session.get('combine-score')+"!");
				$p.addClass('game-over');
			}
		},
		split: function(spaces) {
			if(spaces.length > 0) {
				var opts = {};
				opts.p = this;
				var l = Math.floor(Math.random()*spaces.length);
				var space = spaces[l];
				opts.w = 4;
				opts.x = space.x;
				opts.y = space.y;
				var ps = [];
				if(opts.x>0 && this.b[opts.x-1][opts.y]) ps.push(this.b[opts.x-1][opts.y]);
				if(opts.y>0 && this.b[opts.x][opts.y-1]) ps.push(this.b[opts.x][opts.y-1]);
				if(opts.x<3 && this.b[opts.x+1][opts.y]) ps.push(this.b[opts.x+1][opts.y]);
				if(opts.y<3 && this.b[opts.x][opts.y+1]) ps.push(this.b[opts.x][opts.y+1]);
				if(ps.length) {
					var n = Math.floor(Math.random()*ps.length);
					var p = ps[n];
					opts.z = p.val()-1;
					p.val(opts.z);
					this.b[opts.x][opts.y] = this.makeNewPiece(opts);
					var spaces = [];
					_.each(this.b, function(c,i) {
						_.each(c, function(d,j) {
							if(!d) {
								spaces.push({x:i,y:j});
							}
						});
					});
					this.split(spaces);
				} else {
					this.split(spaces);
				}
			}
		},
		newZ: function() {
			return 15;
		},
		combineVal: function(v) {
			this.mx=0;
			this.updateScore(1);
			return v+1;
		},
		movedWithoutCombine: function() {
			return false;
		}
	};
	var template = new GameTemplate(opts);

	Template[opts.title+"Game"].created = template.created;

	Template[opts.title+"Game"].rendered = template.rendered;

	Template[opts.title+"Game"].helpers(template.helpers);

	Template[opts.title+"Game"].events(template.events);
})();