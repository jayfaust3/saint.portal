import React, { FC, useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
// import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
// import MenuIcon from '@mui/icons-material/Menu';
import GoogleLogin, { GoogleLoginResponse, GoogleLogout } from 'react-google-login';
import { SessionStorageKey, SessionStorageService } from '../../services/browser/SessionStorageService';

const Header: FC<unknown> = () => {
    const cacheService = new SessionStorageService();

    let _isLoggedIn: boolean = false;

    const userData: GoogleLoginResponse | null = cacheService.getItem(SessionStorageKey.USER_DATA, false);

    if (userData) {
      const now: number = new Date().getTime();

      _isLoggedIn = userData.tokenObj.expires_at > now;
    }

    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(_isLoggedIn);

    const googleClientId: string = '593080116652-b3nl1jjpf7ke5p294p0atco72eu8dflk.apps.googleusercontent.com';
    
    return (
      <>
        <AppBar position='fixed'>
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
            {
            !isLoggedIn ?
            <GoogleLogin
              clientId={googleClientId}
              buttonText='Login'
              onSuccess={(response) => {
                  cacheService.setItem(SessionStorageKey.USER_DATA, (response as GoogleLoginResponse));
                  setIsLoggedIn(true);
                  window.location.href = '/';
                }
              }
            onFailure={(response) => console.error('UNABLE TO LOGIN!!!', JSON.stringify(response))}
            />
            :
            <GoogleLogout
              clientId={googleClientId}
              buttonText='Logout'
              onLogoutSuccess={() => {
                  cacheService.removeItem(SessionStorageKey.USER_DATA);
                  setIsLoggedIn(false);
                  window.location.href = '/';
                }
              }
              onFailure={() => console.error('UNABLE TO LOGOUT!!!')}
            />
            }
            <Typography variant="h6" 
              component="div" sx={{ flexGrow: 1 }}>
              {/* <Text goes here> */}
            </Typography>
          </Toolbar>
        </AppBar>
        <br></br>
      </>
    );
}

export default Header;
