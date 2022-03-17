import { useEffect, useState } from 'react';
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
                const response: Response = await fetch(
                    `/saints/${id}`,
                    { method: 'GET', headers: headers }
                );

                const data = await response.json();

                assignCallback({  ...initialState, ...data.data});

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