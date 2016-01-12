Meteor.publish('HighScores', function() {
	return HighScores.find({userId: this.userId});
});