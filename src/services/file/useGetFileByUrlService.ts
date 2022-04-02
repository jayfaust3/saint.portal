import { useEffect, useState } from 'react';
import { FileValidated } from "@dropzone-ui/react";
import { Service } from '../../models/Service';
import { APIResponse } from '../../models/api/APIResponse';
import { File } from '../../models/file/File';
import { FileService } from './FileService';

const useGetFileByUrlService = (assignCallback: (files: Array<FileValidated>) => void, url: string) => {
    const [result, setResult] = useState<Service<{}>>({
        status: 'loading'
    });

    const apiService = new FileService();

    useEffect(() => {
        if (url) {
            setResult({ status: 'loading' });

            const getData = async () => {
                const apiResponse: APIResponse<File> = await apiService.getFile(url);

                const data: File = apiResponse.data;

                const fileContentResponse: Response = await fetch(data.content);

                const fileContentBlob: Blob = await fileContentResponse.blob();

                const fileContent = new File([fileContentBlob], data.name, { type: 'image/png' });

                const newState: Array<FileValidated> = [
                    {
                        id: data.name,
                        valid: true,
                        file: fileContent
                    }
                ];

                assignCallback(newState);

                setResult({ status: 'loaded', payload: data });
            };

            getData().catch(error => setResult({ status: 'error', error }));
        }
    });

    return result;
};

export default useGetFileByUrlService;