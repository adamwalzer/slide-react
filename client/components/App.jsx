// App component - represents the whole app
App = React.createClass({
  aClick(e) {
    var target = e.target.getAttribute("data-target");
    if(target) {
      document.body.className = target;
      ga('send', 'event', target, 'aClick');
    }
  },
  render() {
    return (
      <div onClick={this.aClick}>
        <Welcome/>
        <OriginalGame/>
        <InfinityGame/>
        <TwistGame/>
        <ClearGame/>
        <CombineGame/>
        <OptionPanel/>
        <HighScoresPanel/>
        <OriginalHighScores/>
        <InfinityHighScores/>
        <TwistHighScores/>
        <ClearHighScores/>
        <CombineHighScores/>
        <RulesPanel/>
        <OriginalRulesPanel/>
        <InfinityRulesPanel/>
        <TwistRulesPanel/>
        <ClearRulesPanel/>
        <CombineRulesPanel/>
      </div>
    );
  }
});