let x, y;
let audio = new Audio("https://www.soundjay.com/button/button-2.mp3");

class App extends React.Component {
  constructor(props) {
    super(props);
    this.startStop = this.startStop.bind(this);
    this.state = {
      breakCounter: 1,
      sessionCounter: 1,
      mainTimerMins: 1, //changed
      mainTimerSecs: 0, //changed
      breakTimerMins: 1,
      breakTimerSecs: 0,
      timerRunning: false,
      breakTimerRunning: false,
    };
  }

  start = () => {
    audio.play();
  };
  reset = () => {
    clearInterval(x);
    clearInterval(y);
    this.setState({
      breakCounter: 5,
      sessionCounter: 25,
      mainTimerMins: 25,
      mainTimerSecs: 0,
      breakTimerMins: 5,
      breakTimerSecs: 0,
      timerRunning: false,
      breakTimerRunning: false,
    });
    console.log(this.state);
  };

  breakCounterIncrement = () => {
    if (this.state.breakCounter < 60) {
      this.setState(
        (state, props) => ({
          breakCounter: state.breakCounter + 1,
          breakTimerMins: state.breakTimerMins + 1,
        }),
        () => console.log("breakCounterIncrement", this.state)
      );
    }
  };
  breakCounterDecrement = () => {
    if (this.state.breakCounter >= 2 && this.state.breakCounter < 60) {
      this.setState(
        (state, props) => ({
          breakCounter: state.breakCounter - 1,
          breakTimerMins: state.breakTimerMins - 1,
        }),
        () => console.log("breakCounterDecrement", this.state)
      );
    }
  };

  sessionCounterIncrement = () => {
    if (this.state.sessionCounter > 0 && this.state.sessionCounter < 60) {
      this.setState(
        (state, props) => ({
          sessionCounter: state.sessionCounter + 1,
          mainTimerMins: state.mainTimerMins + 1,
        }),
        () => console.log("sessionCounterIncrement", this.state)
      );
    }
  };

  sessionCounterDecrement = () => {
    if (this.state.sessionCounter > 1 && this.state.sessionCounter < 60) {
      this.setState(
        (state, props) => ({
          sessionCounter: state.sessionCounter - 1,
          mainTimerMins: state.mainTimerMins - 1,
        }),
        () => console.log("sessionCounterDecrement", this.state)
      );
    }
  };

  breakInterval = () => {
    //alert('break');
    y = setInterval(() => {
      if (this.state.breakTimerMins == 0 && this.state.breakTimerSecs == 0) {
        this.start();
        clearInterval(y);
        this.interval();
        this.setState(
          (state, props) => ({
            breakTimerMins: state.breakCounter,
            breakTimerSecs: 0,
            breakTimerRunning: false,
            timerRunning: true,
          }),
          () => console.log("breakRestore", this.state)
        );
      }

      if (this.state.breakTimerSecs > 0) {
        this.setState(
          (state, props) => ({
            breakTimerSecs: state.breakTimerSecs - 1,
          }),
          () => console.log("breakTimerSecsDecrement", this.state)
        );
      } else if (this.state.breakTimerSecs == 0) {
        this.setState(
          (state, props) => ({
            breakTimerSecs: 59,
            breakTimerMins: state.breakTimerMins - 1,
          }),
          () => console.log("breakTimerMinsDecrement", this.state)
        );
      }
    }, 1000);
  };

  breakTimer = () => {
    if (!this.state.breakTimerRunning) {
      this.setState({
        breakTimerRunning: true,
      });
      this.breakInterval();
    } else {
      this.setState({
        breakTimerRunning: false,
      });
      clearInterval(y);
    }
  };

  interval = () => {
    x = setInterval(() => {
      if (this.state.mainTimerMins == 0 && this.state.mainTimerSecs == 0) {
        this.start();
        clearInterval(x);
        this.breakTimer();
        this.setState(
          (state, props) => ({
            mainTimerMins: state.sessionCounter,
            mainTimerSecs: 0,
            breakTimerRunning: true,
            timerRunning: false,
          }),
          () => console.log("mainTimerRestore", this.state)
        );
      }

      if (this.state.mainTimerSecs > 0) {
        this.setState((state, props) => ({
          mainTimerSecs: state.mainTimerSecs - 1,
        }));
      } else if (this.state.mainTimerSecs == 0) {
        this.setState((state, props) => ({
          mainTimerSecs: 59,
          mainTimerMins: state.mainTimerMins - 1,
        }));
      }
    }, 1000);
  };

  startStop = () => {
    if (!this.state.timerRunning && this.state.breakTimerSecs == 0) {
      this.interval();
      this.setState({
        timerRunning: true,
      });
      console.log(this.state);
    } else if (this.state.timerRunning && this.state.breakTimerSecs == 0) {
      this.setState({
        timerRunning: false,
      });
      clearInterval(x);
      console.log(this.state);
    } else if (!this.state.breakTimerRunning && this.state.breakTimerSecs > 0) {
      this.breakInterval();
      this.setState({
        breakTimerRunning: true,
      });
      console.log(this.state);
    } else if (this.state.breakTimerRunning && this.state.breakTimerSecs > 0) {
      clearInterval(y);
      this.setState({
        breakTimerRunning: false,
      });
      console.log(this.state);
    }
  };

  render() {
    return (
      <div>
        <audio id="beep" src="https://www.soundjay.com/button/button-2.mp3" />

        <MainTimer
          breakTimerRunning={this.state.breakTimerRunning ? true : false}
          timerRunning={this.state.timerRunning ? true : false}
          reset={this.reset}
          mins={
            (this.state.mainTimerMins <= 0 && this.state.mainTimerSecs <= 0) ||
            this.state.mainTimerSecs == 59
              ? this.state.breakTimerMins
              : this.state.mainTimerMins
          }
          secs={
            (this.state.mainTimerMins <= 0 && this.state.mainTimerSecs <= 0) ||
            this.state.mainTimerSecs == 59
              ? this.state.breakTimerSecs
              : this.state.mainTimerSecs
          }
          startStop={this.startStop}
        />
        <BreakCounter
          inc={this.breakCounterIncrement}
          dec={this.breakCounterDecrement}
          breakCounter={this.state.breakCounter}
        />
        <SessionCounter
          session={this.state.sessionCounter}
          inc={this.sessionCounterIncrement}
          dec={this.sessionCounterDecrement}
        />
      </div>
    );
  }
}

class BreakCounter extends React.Component {
  increment = () => {
    this.props.inc(true);
    console.log(this.props.breakCounter); //child props doesn't update
  };

  decrement = () => {
    this.props.dec(true);
  };

  render() {
    return (
      <div>
        <h1 id="break-label">Break Length</h1>
        <div id="controller">
          <i id="controls" onClick={this.increment}>
            &#8593;
          </i>
          <div id="break-length" key={this.props.breakCounter}>
            {this.props.breakCounter}
          </div>
          <i id="controls" onClick={this.decrement}>
            &#8595;
          </i>
        </div>
      </div>
    );
  }
}

class SessionCounter extends React.Component {
  increment = () => {
    this.props.inc(true);
    console.log(this.props.session);
  };

  decrement = () => {
    this.props.dec(true);
  };

  render() {
    return (
      <div>
        <h1 id="session-label">Session length</h1>
        <div id="controller">
          <i id="controls" onClick={this.increment}>
            &#8593;
          </i>
          <div id="session-length">{this.props.session}</div>
          <i id="controls" onClick={this.decrement}>
            &#8595;
          </i>
        </div>
      </div>
    );
  }
}

class MainTimer extends React.Component {
  reset = () => {
    this.props.reset(true);
  };
  startStop = () => {
    this.props.startStop
      ? this.props.startStop(false)
      : this.props.startStop(true);
  };
  render() {
    return (
      <div>
        <span>
          <h3>Pomodoro Clock</h3>
        </span>
        <div id="timer-label">
          {" "}
          <h3>
            {this.props.breakTimerRunning ? "Break in progress..." : ""}{" "}
            {this.props.timerRunning ? "Timer in progress..." : ""}
          </h3>
        </div>
        <div id="time-left">
          {this.props.mins < 10 ? "0" + this.props.mins : this.props.mins}:
          {this.props.secs < 10 ? "0" + this.props.secs : this.props.secs}{" "}
        </div>

        <button id="start_stop" onClick={this.startStop}></button>
        <i id="reset" onClick={this.reset}>
          Reset
        </i>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("root"));
