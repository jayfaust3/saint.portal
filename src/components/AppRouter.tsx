import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Saints from './saint/Saints';
import Saint from './saint/Saint';

export default function AppRouter() {
    return (
        <div>             
            <Routes>
              <Route path='/' element={<Saints />} />
              <Route path='/saint' element={<Saint />} />                      
              <Route path='/saint/:id' element={<Saint />} />
            </Routes>               
        </div>
    );
  }