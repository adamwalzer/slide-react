ClearRulesPanel = React.createClass({
  render() {
    return (
      <div className="clear-rules-panel panel">
        <ol className="rules-list">
          <li>
            This time around the board starts with 11 tiles numbered 1-10 with one of the numbers appearing twice.
          </li>
          <li>
            Swipe up, down, left, or right to make all of the tiles move in that direction.
          </li>
          <li>
            Each time you swipe a new tile will appear on the board randomly, but only numbers on the board can appear.
          </li>
          <li>
            When two tiles of the same value collide, they both disappear.
          </li>
          <li>
            Try to make all of the tiles disappear with as few swipes as you can.
          </li>
          <li>
            The games ends when the board is clear, or you run out of moves.
          </li>
        </ol>
        <ul>
          <li data-target="rules">
            back to rules
          </li>
        </ul>
      </div>
    );
  }
});