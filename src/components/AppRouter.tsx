import React, { FC, PropsWithChildren } from 'react';
import { Routes, Route } from 'react-router-dom';
import { GoogleLoginResponse } from 'react-google-login';
import { SessionStorageKey, SessionStorageService } from '../services/browser/SessionStorageService';
import { UserContext } from '../models/security/UserContext';
import Saints from './saint/Saints';
import Saint from './saint/Saint';

const AppRouter: FC<{ userContext: UserContext }> = (props: PropsWithChildren<{ userContext: UserContext }>) => {
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
        <div>             
            <Routes>
              <Route path='/' element={<Saints userContext={userContext}/>} /> 
              <Route path='/saint' element={<Saint userContext={userContext}/>} />                      
              <Route path='/saint/:saintId' element={<Saint userContext={userContext}/>} />
            </Routes>               
        </div>
    );
}

export default AppRouter;
