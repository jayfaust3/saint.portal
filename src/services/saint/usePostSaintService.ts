import { useState } from 'react';
import { APIResponse } from '../../models/api/APIResponse';
import { Saint } from '../../models/saint/Saint';
import { Service } from '../../models/Service';

const usePostSaintService = () => {
    const [service, setService] = useState<Service<APIResponse<Saint>>>({
        status: 'init'
    });

    const publishSaint = async (saint: Saint) => {
        setService({ status: 'loading' });

        const headers = new Headers();
        headers.append('Content-Type', 'application/json;charset=UTF-8');
        headers.append('Access-Control-Allow-Origin', '*');
        headers.append('Access-Control-Allow-Headers', '*');
        headers.append('Accept', 'application/json');

        try {
            const response: Response = await fetch(
                '/saints', 
                { 
                    method: 'POST', 
                    headers: headers,
                    body: JSON.stringify(saint)
                }
            );

            const data = await response.json();

            setService({ status: 'loaded', payload: data });
        } catch (error) {
            setService({ status: 'error', error: error as Error });
        }
    };

    return {
        service,
        publishSaint
    };
};

export default usePostSaintService;
