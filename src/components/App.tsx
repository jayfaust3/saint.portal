import React, { FC } from 'react';
import { BrowserRouter as Router} from 'react-router-dom';
import { GoogleLoginResponse } from 'react-google-login';
import { SessionStorageKey, SessionStorageService } from '../services/browser/SessionStorageService';
import { UserContext } from '../models/security/UserContext';
import AppRouter from './AppRouter';
import Header from './common/Header';
import { getEnvVar } from '../utilities/environmentUtilities';

const App: FC<unknown> = () =>  {
    const cacheService = new SessionStorageService();

    const now = new Date().getTime();

    let userContext: UserContext = {
        isLoggedIn: false,
        auth: {
            apiKey: getEnvVar('BACKEND_API_KEY'),
            expires_in: 3599,
            expires_at: now + (60 * 60 * 1000)
        }
    };

    const loginResponse: GoogleLoginResponse | null = cacheService.getItem(SessionStorageKey.USER_DATA, false);

    if (loginResponse) {
        const token = loginResponse.tokenObj;

        if (now < token.expires_at ?? now) {
            const userData = loginResponse.profileObj;

            userContext = {
                isLoggedIn: true,
                auth: token,
                userData: userData
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
