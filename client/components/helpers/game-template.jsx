GameTemplate = function(opts) {

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
      this.p.$el.append(this.$el);
    };
    this.val = function(nv) {
      this.v = nv || this.v;
      if(this.v===" ") this.destroy();
      this.$el.attr({'data-val':this.v});
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

  var combineVal = opts.combineVal || function(v) {
    return 2*v;
  }

  var movedWithoutCombine = opts.movedWithoutCombine || function() {
    return true;
  }

  var moveTiles = function(Z,d) {
    var getB, setB;
    if(Z==='X') {
      getB = function(self,i,j) {
        return self.b[i][j];
      };
      setB = function(self,i,j,n) {
        self.b[i][j] = n;
      };
    } else {
      getB = function(self,i,j) {
        return self.b[j][i];
      };
      setB = function(self,i,j,n) {
        self.b[j][i] = n;
      };
    }

    return function(create) {
      if(!this.moving || typeof create != "undefined") {
        if(typeof create === "undefined") this.moving = true;
        var moved = false;
        for(var j=0; j<4; j++) {
          for(var i=1.5+.5*d; d*i>d*1.5-2.5; i-=d) {
            if(getB(this,i,j)) {
              for(var k=1;k<=1.5+d*1.5-d*i;k++) {
                if(!getB(this,i+d*k,j)) {
                  setB(this,i+d*k,j,getB(this,i+d*k-d,j)['move'+Z](i+d*k));
                  setB(this,i+d*k-d,j,null);
                  moved = movedWithoutCombine();
                } else {
                  if(getB(this,i+d*k,j).move() != this.move && getB(this,i+d*k,j).val() === getB(this,i+d*k-d,j).val()) {
                    getB(this,i+d*k,j).val(combineVal(getB(this,i+d*k,j).val()));
                    getB(this,i+d*k,j).move(this.move);
                    getB(this,i+d*k-d,j)['move'+Z](getB(this,i+d*k,j)['get'+Z]()).destroy();
                    if(getB(this,i+d*k,j).val() === " ") setB(this,i+d*k,j,null);
                    setB(this,i+d*k-d,j,null);
                    moved = true;
                  }
                  break;
                }
              }
            }
          }
        }
        this.afterMove(moved,create);
      }
    }
  };

  var classOpts = {
    mixins: [ReactMeteorData],
    getMeteorData: opts.helpers || function() {
      var highs = HighScores.find({game:this.t},{limit:1,sort:{score:this.sort}}).fetch();
      if(highs[0]) {
        var max = Math.max(Session.get(this.t+'-high-score'),highs[0].score)
        setVar(this.t+'-high-score',isNaN(max) ? 0 : max);
      }
      return {
        score: Session.get(this.t+'-score'),
        high: Session.get(this.t+'-high-score') || "N/A",
        title: "Slide - "+this.t
      };
    },
    t: opts.title || "original",
    sort: opts.sort || -1,
    move: 0,
    moving: false,
    values: opts.values || [],
    originalValues: opts.values || [],
    b: Array(Array(null,null,null,null),Array(null,null,null,null),Array(null,null,null,null),Array(null,null,null,null)),
    originalB: opts.originalB || null,
    componentWillMount: opts.created || function() {
      Session.set(this.t+'-score', 0);
      if(getVar(this.t+'-high-score')) Session.set(this.t+'-high-score',getVar(this.t+'-high-score'));
      if(!Session.get(this.t+'-high-score')) Session.set(this.t+'-high-score',0);
    },
    componentDidMount: function() {
      $(document).on('keydown', this.keyAction);
      this.$el = $('.'+this.t+'-game .board').touchswipe({
        swipeLeft: this.left,
        swipeRight: this.right,
        swipeUp: this.down,
        swipeDown: this.up
      });

      this.renderGame();
    },
    keyAction: opts.keyAction || function(e) {
      if($('body').hasClass(this.t)) {
        var code = e.keyCode || e.which;
        if(code === 37) this.left();
        else if(code === 38) this.up();
        else if(code === 39) this.right();
        else if(code === 40) this.down();
      }
    },
    renderGame: opts.renderGame || function() {
      this.createPiece();
    },
    createPiece(n) {
      var self = this;
      var spaces = this.makeSpaces(this.b,this.values,n);
      if(this.t === "clear" && !n && spaces.length === 16) {
        this.boardCleared();
      } else {
        if(spaces.length > 0) {
          var opts = {};
          opts.p = this;
          var l = Math.floor(Math.random()*spaces.length);
          var space = spaces[l];
          opts.w = 4;
          opts.x = space.x;
          opts.y = space.y;
          opts.z = this.newZ(this.values,n);
          this.move++;
          this.t != "clear" && this.t != "combine" && this.updateScore(opts.z);
          this.b[opts.x][opts.y] = new PieceView(opts);
          this.afterCreatePiece(opts,n);
        }
        if(spaces.length === 1) {
          var alive = false;
          _.each(this.b, function(c,i) {
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
            $p.find('.game-over-menu h1').html(this.getGameOverMessage());
            $p.addClass('game-over');
          }
        }
        if(n) {
          this.createPiece(n-1);
        } else {
          this.values = [];
          this.split(spaces);
        }
      }
    },
    makeNewPiece(opts) {
      return new PieceView(opts);
    },
    updateScore(z) {
      var s = Session.get(this.t+'-score') + z;
      Session.set(this.t+'-score', s);
    },
    newZ: opts.newZ || function() {
      return Math.floor(Math.random()*2*.75+1)*2;
    },
    makeSpaces: opts.makeSpaces || function(b) {
      var spaces = [];
      _.each(b, function(c,i) {
        _.each(c, function(d,j) {
          if(!d) {
            spaces.push({x:i,y:j});
          }
        });
      });
      return spaces;
    },
    afterCreatePiece: opts.afterCreatePiece || function(){},
    split: opts.split || function(){},
    left: moveTiles('X',-1),
    up: moveTiles('Y',-1),
    right: moveTiles('X',1),
    down: moveTiles('Y',1),
    afterMove: opts.afterMove || function(moved) {
      var self = this;
      if(moved) {
        _.delay(function() {
          self.createPiece();
        }, 250);
      }
      this.moving = false;
    },
    boardCleared: opts.boardCleared || function() {},
    getGameOverMessage: opts.getGameOverMessage || function() {
      return "You scored "+Session.get(this.t+'-score')+"!";
    },
    setNewHigh: opts.setNewHigh || function(resetBoard) {
      var self = this;
      var high = Math.max(Session.get(this.t+'-score'),Session.get(this.t+'-high-score'));
      setVar(this.t+'-high-score',high);
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
          game: this.t,
          score: Session.get(this.t+'-score'),
          board: b,
          sort: this.sort
        }, function() {
          if(resetBoard) {
            Session.set(self.t+'-score', 0);
            _.each(self.b, function(c) {
              _.each(c, function(d) {
                d && d.destroy();
              });
            });
            self.values = self.originalValues;
            self.moving = false;
            self.b = Array(Array(null,null,null,null),Array(null,null,null,null),Array(null,null,null,null),Array(null,null,null,null));
            self.renderGame();
          }
        });
      } else if(resetBoard) {
        Session.set(this.t+'-score', 0);
        _.each(this.b, function(c) {
          _.each(c, function(d) {
            d && d.destroy();
          });
        });
        this.values = originalValues;
        this.moving = false;
        this.b = Array(Array(null,null,null,null),Array(null,null,null,null),Array(null,null,null,null),Array(null,null,null,null));
        this.renderGame();
      }
    },
    clickReset() {
      this.$el.parent().addClass('reset-open');
    },
    clickResetOption(e) {
      if(e.target.tagName === "LI") {
        this.setNewHigh(e.target.className.indexOf('yes') > -1,this.b);
        this.$el.parent().removeClass('reset-open');
      }
    },
    clickGameOverOption(e) {
      if(e.target.tagName === "LI") {
        this.setNewHigh(e.target.className.indexOf('yes') > -1,this.b);
        this.$el.parent().removeClass('game-over');
        e.target.className.indexOf('no') > -1 && $('body').removeClass(this.t);
      }
    },
    render() {
      return (
        <div className={this.t+"-game game"}>
          <div className="menu">
            <span className="options" data-target=" ">
              <span></span>
              <span></span>
              <span></span>
            </span>
            <span className="reset" onClick={this.clickReset}></span>
          </div>
          <div className="title">{this.data.title}</div>
          <div className="score">
            <span>
              score
              {this.data.score}
            </span>
            <span>
              high
              {this.data.high}
            </span>
          </div>
          <div className="board"></div>
          <div className="reset-menu">
            <h1>
              Reset Game?
            </h1>
            <ul onClick={this.clickResetOption}>
              <li className="yes">
                Yes
              </li>
              <li className="no">
                No
              </li>
            </ul>
          </div>
          <div className="game-over-menu">
            <h1></h1>
            <h2>
              Play Again?
            </h2>
            <ul onClick={this.clickGameOverOption}>
              <li className="yes">
                Yes
              </li>
              <li className="no">
                No
              </li>
            </ul>
          </div>
        </div>
      );
    }
  };

  if(opts.variables) {
    for(var key in opts.variables) {
      classOpts[key] = opts.variables[key];
    }
  }

  return React.createClass(classOpts);
};