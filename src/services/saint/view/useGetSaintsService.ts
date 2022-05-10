import { useEffect, useState } from 'react';
import { UserAuth } from '../../../models/security/UserContext';
import { APIResponse } from '../../../models/api/APIResponse';
import { Saint } from '../../../models/saint/Saint';
import { SaintService } from '../crud/SaintService';
import { Service } from '../../Service';

const useGetSaintsService = (auth: UserAuth) => {
    const [result, setResult] = useState<Service<Array<Saint>>>({
        status: 'loading'
    });

    const saintService = new SaintService(auth);

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