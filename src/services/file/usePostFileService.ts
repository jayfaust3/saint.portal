import { useState } from 'react';
import { Service } from '../../models/Service';
import { APIResponse } from '../../models/api/APIResponse';
import { File } from '../../models/file/File';
import { Saint } from '../../models/saint/Saint';

const usePostFileService = () => {
    const [postFileService, setService] = useState<Service<APIResponse<File>>>({
        status: 'init'
    });

    const publishFile = async (file: File) => {
        setService({ status: 'loading' });

        const headers = new Headers();
        headers.append('Content-Type', 'application/json;charset=UTF-8');
        headers.append('Access-Control-Allow-Origin', '*');
        headers.append('Access-Control-Allow-Headers', '*');
        headers.append('Accept', 'application/json');

        try {
            const responseBuffer: Response  = await fetch(
                '/files', 
                { 
                    method: 'POST', 
                    headers: headers,
                    body: JSON.stringify(file)
                }
            );

            const apiResponse = await responseBuffer.json() as APIResponse<File>;

            setService({ status: 'loaded', payload: apiResponse });
        } catch (error) {
            setService({ status: 'error', error: error as Error });
        }
    };

    return {
        postFileService,
        publishFile
    };
};

export default usePostFileService;
