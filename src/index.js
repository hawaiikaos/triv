import React from 'react';
import ReactDOM from 'react-dom';
import Cookies from 'universal-cookie';
import './index.css';

function UserScore(props) {
  console.log('userScore props: ', props);

  // Dear lord there must be a saner way of handling this data
  const temp = Object.entries(props.users);
  let users = [];
  for (const item of temp) {
    const user = { id: item[0], name: item[1].name, score: item[1].score };
    users.push(user);
  }
  const listItems = users.map((item, index) => <div className='user_item' key={item.id}><div className='user'>{item.name}</div><div className='score'>{item.score}</div></div>);
  return (
    <div className="user_score">
      {listItems}
    </div>
  );
}

class Game extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      showName: false,
      showPlayPanel: false,
      isValidName: false,
      username: '',
      currentQuestion: 0,
      users: '',
    };
  }

  handleKeyDown() {
    this.setState({
      isValidName: true,
    });
  }
  
  handleKeyUp(evt) {
    if (evt.key === 'Enter') {
      this.submitUsername();
    }
  }

  updateUsername(event) {
    this.setState({
      username: event.target.value.replace(/[\W_]+/g, '') // remove whitespace
    });
  }

  submitUsername() {
    const cookies = new Cookies();
    this.setState({
      showName: false,
      showPlayPanel: true,
    });
    const gameTime = new Date();
    let tomorrow = new Date();
    tomorrow.setDate(gameTime.getDate()+1);
    cookies.set('trivia-game', gameTime, { path: '/'});
    cookies.set('trivia-game-name', this.state.username, { path: '/', expires: tomorrow });
    this.addUserToGame();
    this.timerID = setInterval(() => this.gameCycle(), 5000);
  }

  getCurrentGameState() {
    const axios = require('axios');
    const game = this;
    const url = 'https://trivia-d1a29.firebaseio.com/react/sessions/gravy/.json';
    console.log('url: ', url);
    axios.get(url)
      .then(function (response) {
        // success
        console.log(response);
        const data = response.data;
        console.log('data: ', data);
        game.setState({
          users: data.users,
          currentQuestion: data.question,
        });
      })
      .catch(function (error) {
        // error
        console.log(error);
      })
      .then(function () {
        console.log('is done');
      });
  }

  addUserToGame() {
    const axios = require('axios');
    const url = 'https://trivia-d1a29.firebaseio.com/react/sessions/gravy/users/.json';
    const data = { name: this.state.username, score: 0 };
    axios.post(url, data)
    .then(function (response) {
      // success
      console.log(response);
    })
    .catch(function (error) {
      // error
      console.log(error);
    })
    .then(function () {
      // is done
    });
  }
  gameCycle() {
    // in gameCycle
    this.getCurrentGameState();
  }

  componentDidMount() {
    const cookies = new Cookies();
    if (!cookies.get('trivia-game')) {
      // no cookie set
      this.setState({
        showName: true,
      });
    } else {
      // cookie set
      // console.log('trivia-game-name: ', cookies.get('trivia-game-name'));

      this.setState({
        showPlayPanel: true,
        username: cookies.get('trivia-game-name'),
      });
      // currently set to 5 seconds to prevent excessively hitting the db in dev
      // in an actually game should be set more frequent
      this.timerID = setInterval(() => this.gameCycle(), 5000);
    }
   }

   componentWillUnmount() {
     clearInterval(this.timerID);
   }

  render() {
    return (
      <div className="game">
        <div id="enter_name" style={this.state.showName ? {} : { display: 'none' }}>
          <h1>Welcome to team trivia</h1>
          <div id="entry">
            <div className="entry_item">
              <label>Enter your name:</label>
            </div>
            <div className="entry_item">
              <input type="text" id="username"
                value={this.state.username}
                onKeyDown={() => this.handleKeyDown()}
                onKeyUp={evt => this.handleKeyUp(evt)}
                onChange={evt => this.updateUsername(evt)}/>

              <button id="submitname"
                disabled={this.state.isValidName === false}
                onClick={() => this.submitUsername()}
                onKeyPress={this.onKeyUp}>Submit</button>
            </div>
          </div>
          <p className="input_warn">(no spaces, letters and numbers only)</p>
        </div>

        <div id="play_panel" style={this.state.showPlayPanel ? {} : { display: 'none' }}>
          <p>Current question: <span id="current_question">{this.state.currentQuestion}</span></p>
          <div id="respond">
            <button id="answer_button">Answer</button>
            <p id="response_time"></p>
          </div>
          <div id="answer_order"></div>
          <div>
          <div id="player_heading">
              <div>
                <h1>Players</h1>
              </div>
              <div>
                <h1>Score</h1>
              </div>
            </div>
            <div id="player_list">
            <UserScore users={this.state.users} />
            </div>
          </div>
        </div>
      </div>
    )
  };
}

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
