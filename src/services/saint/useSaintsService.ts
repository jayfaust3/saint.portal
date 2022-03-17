import { useEffect, useState } from 'react';
import { APIResponse } from '../../models/api/APIResponse';
import { Saint } from '../../models/saint/Saint';
import { Service } from '../../models/Service';

const useSaintsService = () => {
    const [result, setResult] = useState<Service<APIResponse<Array<Saint>>>>({
        status: 'loading'
    });

    useEffect(() => {
        const headers = new Headers();
        headers.append('Content-Type', 'application/json; charset=utf-8');
        headers.append('Access-Control-Allow-Origin', '*');
        headers.append('Access-Control-Allow-Headers', '*');

        const getData = async () => {
            const response: Response = await fetch(
                '/saints',
                { method: 'GET', headers: headers }
            );

            const data = await response.json();

            setResult({ status: 'loaded', payload: data });
        };

        getData().catch(error => setResult({ status: 'error', error }));
    }, []);

    return result;
};

export default useSaintsService;