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

InfinityGame = GameTemplate(opts);