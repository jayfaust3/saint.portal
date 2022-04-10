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
                const apiResponse: APIResponse<File> = await apiService.getFile(
                    'saint-bucket',
                    'images',
                    saintState.name!.replace(/\s/g, '-'),
                    'image/jpeg'
                );

                const apiResponseData: File = apiResponse.data;

                const base64Response: Response = await fetch(`data:image/jpeg;base64,${apiResponseData.content}`);

                const fileContentBlob: Blob = await base64Response.blob();
                
                const fileContent = new File(
                    [fileContentBlob],
                    apiResponseData.name,
                    {
                        type: 'image/jpeg'
                    });

                const newState: Array<FileValidated> = [
                    {
                        id: apiResponseData.name,
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