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

const googleClientId: string = getEnvVar('GOOGLE_CLIENT_ID');

const cacheService = new SessionStorageService();

const redirectToIndex = () => window.location.href = '/';

const onLoginSuccess = (loginResponse: GoogleLoginResponse | GoogleLoginResponseOffline) => {
    loginResponse = loginResponse as GoogleLoginResponse;

    const userService = new AuthService(loginResponse.tokenObj);

    userService.getToken().then(({ data }) => {
      const { token } = data;

      loginResponse = loginResponse as GoogleLoginResponse;

      loginResponse.tokenId = token;
      loginResponse.tokenObj = { ...loginResponse.tokenObj, id_token: token };

      cacheService.setItem(SessionStorageKey.USER_DATA, loginResponse);

      redirectToIndex();
    })
};

const onLoginFailure = (response: GoogleLoginResponse | GoogleLoginResponseOffline) =>
    console.error('UNABLE TO LOGIN!!!', JSON.stringify(response, null, 4));

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
              onFailure={() => console.error('UNABLE TO LOGOUT!!!')}
            />
            }
          </Toolbar>
        </AppBar>
        <br></br>
      </>
    );
}

export default Header;
