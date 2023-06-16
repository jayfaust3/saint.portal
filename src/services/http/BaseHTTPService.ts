import { UserAuth } from '../../models/security/UserAuth';

type HTTPMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

export abstract class BaseHTTPService {
    protected readonly _headers: Record<string, string> = {
        'Accept': 'application/json',
        'Access-Control-Allow-Headers': '*',
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json;charset=UTF-8'
    };
    private readonly _requestTimeoutMS: number = 6000;
    private readonly _abortController: AbortController;

    protected constructor(auth: UserAuth) {
        const authHeaderValue = auth.apiKey ? `ApiKey ${auth.apiKey}` : `Bearer ${auth.id_token}`
        this._headers['Authorization'] = authHeaderValue
        this._abortController = new AbortController()
    }

    protected async makeRequest<TResult>(httpMethod: HTTPMethod, url: string, payload?: unknown, headers?: Headers): Promise<TResult> {
        let body: string | undefined;

        if (payload) body = JSON.stringify(payload);

        setTimeout(this._abortController.abort, this._requestTimeoutMS);
            
        const response: Response = await fetch(
            url, 
            {
                method: httpMethod, 
                headers: headers ?? this._headers,
                body: body,
                signal: this._abortController.signal
            },
        );

        return await response.json() as TResult;
    }
}
