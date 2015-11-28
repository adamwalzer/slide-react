var opts = {
	title: "twist",
	variables: {
		degrees: 0,
		fall: function(create) {
			this.move++;
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
		setTimeout(function() {
			self.fall(0);
			self.fall(0);
		}, 100);
	},
  componentDidMount: function() {
    document.addEventListener('keydown', this.keyAction);
    this.el = document.getElementsByClassName(this.t+'-game')[0].getElementsByClassName('board')[0];
    this.$el = $(this.el);
    swipe.on(document.getElementsByClassName(this.t+'-game')[0].getElementsByClassName("board")[0], {
      left: this.ccw,
      right: this.cw
    });

    this.renderGame();
  },
	keyAction: function(e) {
		if(document.getElementById('body').className.indexOf('twist') > -1) {
			var code = e.keyCode || e.which;
			if(code === 37) this.ccw();
			else if(code === 39) this.cw();
		}
	},
	afterMove: function(moved,create) {
		if(create) {
			var self = this;
			if(moved) {
				setTimeout(function() {
					self.createPiece();
				}, 250);
			}
			this.moving = false;
		}
	}
};

TwistGame = GameTemplate(opts);