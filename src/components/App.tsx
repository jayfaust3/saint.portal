import React, { FC } from 'react';
import { BrowserRouter as Router} from 'react-router-dom';
import { GoogleLoginResponse } from 'react-google-login';
import { SessionStorageKey, SessionStorageService } from '../services/browser/SessionStorageService';
import { UserContext } from '../models/security/UserContext';
import AppRouter from './AppRouter';
import Header from './common/Header';

const App: FC<unknown> = () =>  {
    const now = new Date().getTime();

    let userContext: UserContext = {
        isLoggedIn: false,
        auth: {
            apiKey: 'fd2b3237b2a94b511961f1c88859cd6affeae19a42d085d2da60198e83a5a62f',
            expires_in: 3599,
            expires_at: now + (60 * 60 * 1000)
        }
    };

    const cacheService = new SessionStorageService();

    const userData: GoogleLoginResponse | null = cacheService.getItem(SessionStorageKey.USER_DATA, false);

    if (userData) {
        if (now < userData.tokenObj.expires_at ?? now) {
            userContext = {
                isLoggedIn: true,
                auth: userData.tokenObj,
                userData: userData.profileObj
            };
        } else {
            cacheService.removeItem(SessionStorageKey.USER_DATA);
        }
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
