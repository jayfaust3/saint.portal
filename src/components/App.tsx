import React, { FC } from 'react';
import { BrowserRouter as Router} from 'react-router-dom';
import { GoogleLoginResponse } from 'react-google-login';
import { SignJWT } from 'jose';
import { SessionStorageKey, SessionStorageService } from '../services/browser/SessionStorageService';
import { UserContext } from '../models/security/UserContext';
import AppRouter from './AppRouter';
import Header from './common/Header';

const App: FC<unknown> = () =>  {
    const expiresIn: number = 3599;
    const expiresAt: number = new Date().getTime() + (60 * 60 * 1000);

    let userContext: UserContext = {
        isLoggedIn: false,
        auth: {
            id_token: '',
            expires_in: expiresIn,
            expires_at: expiresAt
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
    } else {
        const jwt = new SignJWT({})
            .setAudience('593080116652-b3nl1jjpf7ke5p294p0atco72eu8dflk.apps.googleusercontent.com')
            .setIssuer('accounts.google.com').setExpirationTime(expiresAt);

        // jwt.sign(undefined as unknown as Uint8Array).then((token) => {
        //     userContext = {
        //         isLoggedIn: false,
        //         auth: {
        //             id_token: token,
        //             expires_in: expiresIn,
        //             expires_at: expiresAt
        //         }
        //     };
        // });
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
