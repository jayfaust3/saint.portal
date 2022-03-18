import { useEffect, useState } from 'react';
import { APIResponse } from '../../models/api/APIResponse';
import { Saint } from '../../models/saint/Saint';
import { Service } from '../../models/Service';

const useSaintByIdService = (initialState: Saint, assignCallback: (saint: Saint) => void, id?: string) => {
    const [result, setResult] = useState<Service<{}>>({
        status: 'loading'
    });

    useEffect(() => {
        setResult({ status: 'loading' });
        if (id) {
            const headers = new Headers();
            headers.append('Content-Type', 'application/json; charset=utf-8');
            headers.append('Access-Control-Allow-Origin', '*');
            headers.append('Access-Control-Allow-Headers', '*');

            const getData = async () => {
                const responseBuffer: Response = await fetch(
                    `/saints/${id}`,
                    { method: 'GET', headers: headers }
                );

                const apiResponse = await responseBuffer.json() as APIResponse<Saint>;

                const data: Saint = apiResponse.data;

                assignCallback({  ...initialState, ...data});

                setResult({ status: 'loaded', payload: data });
            };

            getData().catch(error => setResult({ status: 'error', error }));
        } else {
            setResult({ status: 'loaded', payload: { data: { ...initialState } } });
        }
    }, [id]);

    return result;
};

export default useSaintByIdService;