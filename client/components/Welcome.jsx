// Welcome component - represents the whole app
Welcome = React.createClass({
  render() {
    return (
      <div className="welcome">
        <h1>
          <img src="./images/logo.svg" alt="" className="logo"/>
        </h1>
        <ul>
          <li data-target="original">
            original
          </li>
          <li data-target="infinity">
            infinity
          </li>
          <li data-target="twist">
            twist
          </li>
          <li data-target="clear">
            clear
          </li>
          <li data-target="combine">
            combine
          </li>
          <li data-target="options">
            options
          </li>
        </ul>
      </div>
    );
  }
});