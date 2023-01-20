import React, { FC } from 'react';
import { GoogleLogin, GoogleLoginResponse } from 'react-google-login';
import { useNavigate } from 'react-router-dom';
import { APIResponse } from '../../models/api/APIResponse';
import { PageToken } from '../../models/api/PageToken';
import { User } from '../../models/user/User';
import { SessionStorageKey, SessionStorageService } from '../../services/browser/SessionStorageService';
import { UserService } from '../../services/user/crud/UserService';

const SignIn: FC<{}> = () => {
    console.error(`\nLOGGING IN\n`);
    return (
        <div >
            <GoogleLogin
                clientId='593080116652-b3nl1jjpf7ke5p294p0atco72eu8dflk.apps.googleusercontent.com'
                buttonText='Login'
                onSuccess={(response) => {
                        response = response as GoogleLoginResponse;

                        const navigate = useNavigate();

                        const cacheService = new SessionStorageService();

                        const userService = new UserService(response.tokenObj);

                        const pageToken: PageToken = {
                            cursor: 0,
                            limit: 1,
                            term: response.profileObj.email
                        };

                        console.error(`\nLOGIN SUCCESSFUL, FETCHING USER\n`);
                        userService.getAll(pageToken)
                            .then((userResponse: APIResponse<Array<User>>) => {
                                console.error(`\nUSER RESPONSE: ${JSON.stringify(userResponse, null, 4)}\n`);

                                cacheService.setItem(SessionStorageKey.USER_DATA, response);
                                navigate('/saints');
                            })
                            .catch(() => {
                                console.error(`\nFAILURE RETREIVING USERS\n`);
                                cacheService.setItem(SessionStorageKey.USER_DATA, response);
                                navigate('/saints');
                            });

                        // cacheService.setItem(SessionStorageKey.USER_DATA, (response as GoogleLoginResponse));

                        // navigate('/saints');
                    }
                }
                onFailure={(response) => console.error('Unable to login\n', JSON.stringify(response, null, 4))}
            />
        </div>
    );
}

export default SignIn;
