HighScoreTemplate = function(opts) {
  return React.createClass({
    mixins: [ReactMeteorData],
    getMeteorData() {
      return {
        list: HighScores.find({game: opts.title}, {sort: {score: opts.sort}}).fetch()
      };
    },
    getInitialState() {
      return {
        t: opts.title || "original",
        m: opts.max || 0,
        n: opts.min || 0
      }
    },
    keyAction(e) {
      if($('body').hasClass(this.state.t+'-high')) {
        var code = e.keyCode || e.which;
        if(code === 37) this.left();
        else if(code === 39) this.right();
      }
    },
    left() {
      this.state.n = 1 - this.data.list.length;
      this.state.m = Math.max(this.state.m-1,this.state.n);
      $('.'+this.state.t+'-high-scores .high-scores').css({'left':(this.state.m*100)+"%"});
    },
    right() {
      this.state.m = Math.min(this.state.m+1,0);
      $('.'+this.state.t+'-high-scores .high-scores').css({'left':(this.state.m*100)+"%"});
    },
    componentDidMount() {
      $(document).on('keydown', this.keyAction);
      $('.'+this.state.t+'-high-scores .high-scores').touchswipe({
        swipeLeft: this.left,
        swipeRight: this.right
      });
    },
    render() {
      return (
        <div className={this.state.t+"-high-scores panel"}>
          <ul>
            <li data-target="high-scores">
              back to high scores
            </li>
          </ul>
          <ul className="high-scores">
            {this.data.list.map(function(el,k){
              return (
                <li key={k}>
                  <div className="score">
                    <span>
                      score 
                      {el.score}
                    </span>
                  </div>
                  <div className="board">
                    {el.board.map(function(elx,x){
                      return (
                        elx.map(function(ely,y){
                          return (
                            <div data-val={ely}>
                              <span>{ely}</span>
                            </div>
                          );
                        })
                      );
                    })}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      );
    }
  });
};