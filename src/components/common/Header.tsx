import React, { FC } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
// import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
// import MenuIcon from '@mui/icons-material/Menu';
// import { GoogleLogout } from 'react-google-login';
import { useNavigate } from 'react-router-dom';
import { SessionStorageKey, SessionStorageService } from '../../services/browser/SessionStorageService';

const Header: FC<{}> = () => {
    const navigate = useNavigate();

    const cacheService = new SessionStorageService();

    return (
        <AppBar position="static">
        <Toolbar>
          {/*Inside the IconButton, we 
           can render various icons*/}
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            {/*This is a simple Menu 
             Icon wrapped in Icon */}
            {/* <MenuIcon /> */}
          </IconButton>
          {/* The Typography component applies 
           default font weights and sizes */}
  
          <Typography variant="h6" 
            component="div" sx={{ flexGrow: 1 }}>
            Saints
          </Typography>
          <button
            type='button'
            className='cancel-button'
            onClick={() => {
              cacheService.removeItem(SessionStorageKey.USER_DATA);
              navigate('/signin');
            }}>
            Log Out
          </button>
          {/* <GoogleLogout
            clientId='593080116652-b3nl1jjpf7ke5p294p0atco72eu8dflk.apps.googleusercontent.com'
            buttonText='Logout'
            onLogoutSuccess={() => {
                // cacheService.removeItem(SessionStorageKey.USER_DATA);
                navigate('/signin');
              }
            }
            onFailure={() => console.error('UNABLE TO LOGOUT!!!')}
        /> */}
        </Toolbar>
      </AppBar>
    );
}

export default Header;
