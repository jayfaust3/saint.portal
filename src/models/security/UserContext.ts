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

export interface UserAuth {
    access_token?: string;
    id_token: string;
    login_hint?: string;
    scope?: string;
    expires_in: number;
    first_issued_at?: number;
    expires_at: number;
}
