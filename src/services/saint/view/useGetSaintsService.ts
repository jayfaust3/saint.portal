import { useEffect, useState } from 'react';
import { APIResponse } from '../../../models/api/APIResponse';
import { Saint } from '../../../models/saint/Saint';
import { SaintService } from '../crud/SaintService';
import { Service } from '../../../models/Service';

const useGetSaintsService = () => {
    const [result, setResult] = useState<Service<Array<Saint>>>({
        status: 'loading'
    });

    const saintService = new SaintService();

    useEffect(() => {
        const getData = async () => {
            const response: APIResponse<Array<Saint>> = await saintService.getAll();

            setResult({ status: 'loaded', payload: response.data });
        };

        getData().catch(error => setResult({ status: 'error', error }));
    }, []);

    return result;
};

export default useGetSaintsService;