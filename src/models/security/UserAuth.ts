export interface UserAuth {
    access_token?: string;
    id_token?: string;
    apiKey?: string;
    login_hint?: string;
    scope?: string;
    expires_in: number;
    first_issued_at?: number;
    expires_at: number;
}
