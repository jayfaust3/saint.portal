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

const googleClientId: string = '593080116652-b3nl1jjpf7ke5p294p0atco72eu8dflk.apps.googleusercontent.com';

const cacheService = new SessionStorageService();

const redirectToIndex = () => window.location.href = '/';

const onLoginSuccess = async (response: GoogleLoginResponse | GoogleLoginResponseOffline) => {
    response = response as GoogleLoginResponse;

    const userService = new UserService(response.tokenObj);

    const pageToken: PageToken = {
        cursor: 0,
        limit: 1,
        term: response.profileObj.email
    };

    const userResponse: APIResponse<Array<User>> = await userService.getAll(pageToken);

    if (!userResponse.data.length) {
        const { givenName, familyName, email } = response.profileObj;

        await userService.post({
          firstName: givenName,
          lastName: familyName,
          emailAddress: email
        });
    }

    cacheService.setItem(SessionStorageKey.USER_DATA, response);

    redirectToIndex();
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
              onSuccess={(response) => onLoginSuccess(response).then(() => {})}
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
