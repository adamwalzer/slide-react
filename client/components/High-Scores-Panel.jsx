HighScoresPanel = React.createClass({
  render() {
    return (
      <div className="high-scores-panel panel">
        <ul className="options-list">
          <li data-target="original-high">
            original high scores
          </li>
          <li data-target="infinity-high">
            infinity high scores
          </li>
          <li data-target="twist-high">
            twist high score
          </li>
          <li data-target="clear-high">
            clear low scores
          </li>
          <li data-target="combine-high">
            combine high scores
          </li>
          <li data-target="options">
            back to options
          </li>
        </ul>
      </div>
    );
  }
});