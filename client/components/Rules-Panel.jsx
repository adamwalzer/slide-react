RulesPanel = React.createClass({
  render() {
    return (
      <div className="rules-panel panel">
        <ul className="options-list">
          <li data-target="original-rules">
            original rules
          </li>
          <li data-target="infinity-rules">
            infinity rules
          </li>
          <li data-target="twist-rules">
            twist rules
          </li>
          <li data-target="clear-rules">
            clear rules
          </li>
          <li data-target="combine-rules">
            combine rules
          </li>
          <li data-target="options">
            back to options
          </li>
        </ul>
      </div>
    );
  }
});