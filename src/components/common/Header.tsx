import React, { FC, PropsWithChildren, useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
// import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
// import MenuIcon from '@mui/icons-material/Menu';
import GoogleLogin, { GoogleLoginResponse, GoogleLogout } from 'react-google-login';
import { SessionStorageKey, SessionStorageService } from '../../services/browser/SessionStorageService';
import { UserContext } from '../../models/security/UserContext';

const Header: FC<{ userContext: UserContext }> = (props: PropsWithChildren<{ userContext: UserContext }>) => {
    const isLoggedIn: boolean = props.userContext.isLoggedIn;  
    const cacheService = new SessionStorageService();
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
                  window.location.href = '/';
                }
              }
            onFailure={(response) => console.error('UNABLE TO LOGIN!!!', JSON.stringify(response, null, 4))}
            />
            :
            <GoogleLogout
              clientId={googleClientId}
              buttonText='Logout'
              onLogoutSuccess={() => {
                  cacheService.removeItem(SessionStorageKey.USER_DATA);
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
