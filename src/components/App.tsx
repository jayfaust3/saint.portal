import React, { FC } from 'react';
import { BrowserRouter as Router} from 'react-router-dom';
import { GoogleLoginResponse } from 'react-google-login';
import { SessionStorageKey, SessionStorageService } from '../services/browser/SessionStorageService';
import { UserContext } from '../models/security/UserContext';
import AppRouter from './AppRouter';
import Header from './common/Header';

const App: FC<unknown> = () =>  {
    let userContext: UserContext = {
        isLoggedIn: false,
        auth: {
            id_token: '',
            expires_in: 3599,
            expires_at: new Date().getTime() + (60 * 60 * 1000)
        }
    };

    const cacheService = new SessionStorageService();

    const userData: GoogleLoginResponse | null = cacheService.getItem(SessionStorageKey.USER_DATA, false);

    if (userData) {
        userContext = {
            isLoggedIn: true,
            auth: userData.tokenObj,
            userData: userData.profileObj
        };
    }

    return (
        <div className="App">
            <div className="container">
                <Header userContext={userContext}/>
                <Router>                                      
                    <AppRouter userContext={userContext}/>
                </Router>
            </div>
        </div>
    );
}

export default App;
