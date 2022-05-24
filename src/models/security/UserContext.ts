import { UserAuth } from './UserAuth';

export interface UserContext {
    auth: UserAuth;
    userData?: {
        googleId: string;
        imageUrl: string;
        email: string;
        name: string;
        givenName: string;
        familyName: string;
    };
    isLoggedIn: boolean;
}
