TwistRulesPanel = React.createClass({
  render() {
    return (
      <div className="twist-rules-panel panel">
        <ol className="rules-list">
          <li>
            The original game is fun, but what if the whole board moved instead of just the tiles?
          </li>
          <li>
            In twist, when you swipe right or left the entire board rotates clockwise or counterclockwise.
          </li>
          <li>
            As the board twists, a new tile will appear, and the tiles will fall down.
          </li>
          <li>
            When two tiles of the same value collide, they will combine to become one tile of double the value.
          </li>
          <li>
            Keep the game going. Keep that board moving.
          </li>
          <li>
            The game ends when you're out of moves.
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