import React, { FC, PropsWithChildren } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
// import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
// import MenuIcon from '@mui/icons-material/Menu';
import GoogleLogin, { GoogleLoginResponse, GoogleLoginResponseOffline, GoogleLogout } from 'react-google-login';
import { UserContext } from '../../models/security/UserContext';
import { APIResponse } from '../../models/api/APIResponse';
import { PageToken } from '../../models/api/PageToken';
import { User } from '../../models/user/User';
import { SessionStorageKey, SessionStorageService } from '../../services/browser/SessionStorageService';
import { UserService } from '../../services/user/crud/UserService';
import { getEnvVar } from '../../utilities/environmentUtilities';

const googleClientId: string = getEnvVar('GOOGLE_CLIENT_ID');

const cacheService = new SessionStorageService();

const redirectToIndex = () => window.location.href = '/';

const onLoginSuccess = (loginResponse: GoogleLoginResponse | GoogleLoginResponseOffline) => {
  loginResponse = loginResponse as GoogleLoginResponse;

    cacheService.setItem(SessionStorageKey.USER_DATA, loginResponse);

    const userService = new UserService(loginResponse.tokenObj);

    const pageToken: PageToken = {
        cursor: 0,
        limit: 1,
        term: loginResponse.profileObj.email
    };

    userService.getAll(pageToken)
        .then((userResponse: APIResponse<Array<User>>) => {
            if (!userResponse.data.length) {
                const { givenName, familyName, email } = (loginResponse as GoogleLoginResponse).profileObj;

                userService.post({
                  firstName: givenName,
                  lastName: familyName,
                  emailAddress: email
                }).then();
            }

            redirectToIndex();
        });
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
