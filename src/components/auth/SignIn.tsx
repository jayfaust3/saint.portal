import React, { FC } from 'react';
import GoogleLogin, { GoogleLoginResponse, GoogleLoginResponseOffline, GoogleLogout } from 'react-google-login';
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

const SignIn: FC<{}> = () => {
    return (
        <div >
            <GoogleLogin
              clientId={googleClientId}
              buttonText='Login'
              onSuccess={(response) => onLoginSuccess(response)}
              onFailure={onLoginFailure}
            />
        </div>
    );
}

export default SignIn;
