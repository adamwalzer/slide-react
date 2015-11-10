CombineRulesPanel = React.createClass({
  render() {
    return (
      <div className="combine-rules-panel panel">
        <ol className="rules-list">
          <li>
            This time the game starts with a full board.
          </li>
          <li>
            Swipe up, down, left, or right to make all of the tiles move in that direction.
          </li>
          <li>
            This time, no new tiles appear when you swipe.
          </li>
          <li>
            When two tiles of the same value collide, they will combine to become one tile with the value one higher than the original tiles.
          </li>
          <li>
            See if you can combine all of the tiles on the board to create one tile. Once you do, that tile will split back up to fill the board.
          </li>
          <li>
            The game ends when you've made too many consecutive moves without combining tiles.
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