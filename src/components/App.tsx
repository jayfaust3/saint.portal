import React, { FC } from 'react';
import { BrowserRouter as Router} from 'react-router-dom';
import AppRouter from './AppRouter';

const App: FC<{}> = () =>  {
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

export default App;
