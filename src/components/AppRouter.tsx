import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { GoogleLoginResponse } from 'react-google-login';
import { SessionStorageKey, SessionStorageService } from '../services/browser/SessionStorageService';
import SignIn from './auth/SignIn';
import Saints from './saint/Saints';
import Saint from './saint/Saint';

export default function AppRouter() {
    const cacheService = new SessionStorageService();

    const userData: GoogleLoginResponse | null = cacheService.getItem(SessionStorageKey.USER_DATA, false);

    const now: number = new Date().getTime();

    const isLoggedIn: boolean = (userData?.tokenObj?.expires_at ?? now) > now;

    return (
        <div>             
            <Routes>
              <Route path='/' element={isLoggedIn ? <Saints /> : <SignIn />} />
              <Route path='/signin' element={<SignIn />} /> 
              <Route path='/saints' element={<Saints />} /> 
              <Route path='/saint' element={<Saint />} />                      
              <Route path='/saint/:saintId' element={<Saint />} />
            </Routes>               
        </div>
    );
  }