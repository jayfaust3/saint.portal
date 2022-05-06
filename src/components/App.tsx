import React, { FC } from 'react';
import { BrowserRouter as Router} from 'react-router-dom';
import AppRouter from './AppRouter';
import Header from './common/Header';

const App: FC<{}> = () =>  {
  return (
    <div className="App">
      <Header/>
      <div className="container">
        <Router>                                      
          <AppRouter />
        </Router>
      </div>
    </div>
  );
}

export default App;
