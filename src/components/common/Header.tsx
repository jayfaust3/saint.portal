import React, { FC, PropsWithChildren } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
// import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
// import MenuIcon from '@mui/icons-material/Menu';
import GoogleLogin, { GoogleLoginResponse, GoogleLoginResponseOffline, GoogleLogout } from 'react-google-login';
import { UserContext } from '../../models/security/UserContext';
import { SessionStorageKey, SessionStorageService } from '../../services/browser/SessionStorageService';
import { getEnvVar } from '../../utilities/environmentUtilities';
import { AuthService } from '../../services/auth/crud/AuthService';
import { redirectToIndex } from '../../utilities/navigationUtilities';

const googleClientId: string = getEnvVar('GOOGLE_CLIENT_ID');

const cacheService = new SessionStorageService();

const onLoginSuccess = (loginResponse: GoogleLoginResponse | GoogleLoginResponseOffline) => {
    const successResponse = loginResponse as GoogleLoginResponse;

    const authService = new AuthService(successResponse.tokenObj);

    authService.getToken().then(({ data }) => {
      const { token } = data;

      if (token) {
        successResponse.tokenId = token;
        successResponse.tokenObj = { ...successResponse.tokenObj, id_token: token };
      }
      
      cacheService.setItem(SessionStorageKey.USER_DATA, successResponse);

      redirectToIndex();
    })
};

const onLoginFailure = (response: GoogleLoginResponse | GoogleLoginResponseOffline) =>
    console.error('Login Failure', JSON.stringify(response, null, 4));

const Header: FC<{ userContext: UserContext }> = (props: PropsWithChildren<{ userContext: UserContext }>) => {
    const isLoggedIn: boolean = props.userContext.isLoggedIn;

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
            <Typography variant="h6" 
              component="div" sx={{ flexGrow: 1 }}>
              {/* <Text goes here> */}
            </Typography>
            {
            !isLoggedIn ?
            <GoogleLogin
              clientId={googleClientId}
              buttonText='Login'
              onSuccess={(response) => onLoginSuccess(response)}
              onFailure={onLoginFailure}
            />
            :
            <GoogleLogout
              clientId={googleClientId}
              buttonText='Logout'
              onLogoutSuccess={
                  () => {
                      cacheService.removeItem(SessionStorageKey.USER_DATA);
                      redirectToIndex();
                  }
              }
              onFailure={() => console.error('Logout Failure')}
            />
            }
          </Toolbar>
        </AppBar>
        <br></br>
      </>
    );
}

export default Header;
