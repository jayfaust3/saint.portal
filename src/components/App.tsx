import React, { Component } from 'react';
import { BrowserRouter as Router} from 'react-router-dom';
import AppRouter from './AppRouter';

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="container">
          <Router>                                      
            <AppRouter />
          </Router>
        </div>
      </div>
    );
  }
}

export default App;
