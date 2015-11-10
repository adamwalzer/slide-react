InfinityRulesPanel = React.createClass({
  render() {
    return (
      <div className="infinity-rules-panel panel">
        <ol className="rules-list">
          <li>
            If you've ever played the original game, I'm sure you've wished that those pesky low numbers would stop appearring. Well now your wishes can come true.
          </li>
          <li>
            Swipe up, down, left, or right just like the original game.
          </li>
          <li>
            When two tiles of the same value collide, they will combine to become one tile with a value one higher than the colliding tiles.
          </li>
          <li>
            New tiles will appear just like before, but now they will increase as the tiles on the board increase.
          </li>
          <li>
            Keep going as long as you can.
          </li>
          <li>
            The game ends just as it did before.
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