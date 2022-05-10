import React, { FC } from 'react';
import { GoogleLogin, GoogleLoginResponse } from 'react-google-login';
import { useNavigate } from 'react-router-dom';
import { SessionStorageKey, SessionStorageService } from '../../services/browser/SessionStorageService';

const SignIn: FC<{}> = () => {
    const navigate = useNavigate();

    const cacheService = new SessionStorageService();

    return (
        <div >
            <GoogleLogin
                clientId='593080116652-b3nl1jjpf7ke5p294p0atco72eu8dflk.apps.googleusercontent.com'
                buttonText='Login'
                onSuccess={(response) => {
                        cacheService.setItem(SessionStorageKey.USER_DATA, (response as GoogleLoginResponse));
                        navigate('/saints');
                    }
                }
                onFailure={(response) => console.error('UNABLE TO LOGIN!!!', JSON.stringify(response))}
            />
        </div>
    );
}

export default SignIn;
