import { useEffect, useState } from 'react';
import { FileValidated } from "@dropzone-ui/react";
import { Service } from '../../models/Service';
import { APIResponse } from '../../models/api/APIResponse';
import { File } from '../../models/file/File';
import { Saint } from '../../models/saint/Saint';
import { FileService } from './FileService';

const useGetFileByUrlService = (saintState: Saint, assignCallback: (files: Array<FileValidated>) => void) => {
    const [result, setResult] = useState<Service<{}>>({
        status: 'loading'
    });

    const apiService = new FileService();

    useEffect(() => {
        if (saintState.hasAvatar) {
            setResult({ status: 'loading' });

            const getData = async () => {
                const apiResponse: APIResponse<File> = await apiService.getFile('saint-bucket', saintState.name!.replace(/\s/g, '-'));

                const data: File = apiResponse.data;

                const fileContent = new File([data.content], data.name);

                const newState: Array<FileValidated> = [
                    {
                        id: data.name,
                        valid: true,
                        file: fileContent
                    }
                ];

                assignCallback(newState);

                setResult({ status: 'loaded', payload: {} });
            };

            getData().catch(error => setResult({ status: 'error', error }));
        } else {
            setResult({ status: 'loaded', payload: {} });
        }
    }, [saintState]);

    return result;
};

export default useGetFileByUrlService;