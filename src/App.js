/// external modules ///
import React from 'react';
import axios from 'axios';

/// internal modules ///
import immutably from './tools/immutably';
import UserCardsDeck from './components/GitHub/User/CardsDeck';

/// styles ///
import './styles/App.css';

/// data ///
import { routes as urls, fullURL } from './data/app/routes';

/***************************************
  STATE
***************************************/
const init = {
  'user' : 'jason-glassbrook',
  'data' : {
    'user' : {},
    'user_followers' : [{}],
    'user_following' : [{}],
  },
};

const setFieldOfState = (setState, field, valueFun) => {
  setState ((state, props) => ({
    [field] : valueFun (state, props),
  }));
}

const setStateData = (setState, point, data) => {
  setFieldOfState (setState, 'data',
    (state) => (immutably.set (state.data, point, data)),
  );
};

const getRemoteData = (point, args, handleResponse, handleError) => {
  /* DEV */ console.log (`--- ${point} : getting... ---`);
  axios
    .get (fullURL (urls.there.GH, point, ...args))
    .then ((axResponse) => {
      /* DEV */ console.log (`>>> ${point} : success <<<`);
      handleResponse (axResponse);
    })
    .catch ((axError) => {
      /* DEV */ console.warn (`>>> ${point} : failure <<<`);
      handleError (axError);
    })
    .finally (() => {
      /* DEV */ console.log (`--- ${point} : done. ---`);
    });
};

/***************************************
  COMPONENT
***************************************/
class App extends React.Component {
  /***************************************
    lifecycle
  ***************************************/
  constructor (props) {
    /* DEV */ console.log (`>>> App : constructing... <<<`);
    super (props);
    this.state = {
      'user' : init.user,
      'data' : init.data,
    };
  };

  componentDidMount () {
    /* DEV */ console.log (`>>> App : did mount... <<<`);
    this.getRemoteData ('user', [this.state.user]);
    this.getRemoteData ('user_followers', [this.state.user]);
    this.getRemoteData ('user_following', [this.state.user]);
  };

  componentDidUpdate () {
    /* DEV */ console.log (`>>> App : did update... <<<`);
  };

  componentWillUnmount () {
    /* DEV */ console.log (`>>> App : will unmount... <<<`);
  };

  render () {
    /* DEV */ console.log (`>>> App : rendering... <<<`);
    return (
      <div className='App'>
        <header>
          <h1>react-github-user-card</h1>
        </header>
        <main>
          <section id='user'>
            <header>
              <h2>User</h2>
            </header>
            <main>
              <UserCardsDeck
              row wrap
              users={[this.state.data.user]}
              />
            </main>
          </section>
          <section id='user_followers'>
            <header>
              <h2>Followers</h2>
            </header>
            <main>
              <UserCardsDeck
              row wrap
              users={this.state.data.user_followers}
              />
            </main>
          </section>
          <section id='user_following'>
            <header>
              <h2>Following</h2>
            </header>
            <main>
              <UserCardsDeck
              row wrap
              users={this.state.data.user_following}
              />
            </main>
          </section>
        </main>
      </div>
    );
  };

  /***************************************
    data
  ***************************************/
  setStateData (point, data) {
    /*module.*/setStateData (
      (...x) => (this.setState (...x)) /* WHAT? WHY? */,
      point, data
    );
  };

  resetStateData (point) {
    this.setStateData (point, init.data[point])
  };

  getRemoteData (point, args) {
    /*module.*/getRemoteData (point, args,
      (axResponse) => (this.handleRemoteDataResponse (point, axResponse)),
      (axError) => (this.handleRemoteDataError (point, axError))
    );
  };

  handleRemoteDataResponse (point, axResponse) {
    console.log (point, axResponse);
    this.setStateData (point, axResponse.data)
  };

  handleRemoteDataError (point, axError) {
    console.warn (point, axError);
    this.resetStateData (point);
  };

  /**************************************/
};

/**************************************/
export default App;
