import React, { FC, PropsWithChildren } from 'react';
import { Routes, Route } from 'react-router-dom';
import { GoogleLoginResponse } from 'react-google-login';
import { SessionStorageKey, SessionStorageService } from '../services/browser/SessionStorageService';
import { UserContext } from '../models/security/UserContext';
import Saints from './saint/Saints';
import Saint from './saint/Saint';

const AppRouter: FC<{ userContext: UserContext }> = (props: PropsWithChildren<{ userContext: UserContext }>) => {
    return (
        <div>             
            <Routes>
              <Route path='/' element={<Saints userContext={props.userContext}/>} /> 
              <Route path='/saint' element={<Saint userContext={props.userContext}/>} />                      
              <Route path='/saint/:saintId' element={<Saint userContext={props.userContext}/>} />
            </Routes>               
        </div>
    );
}

export default AppRouter;
