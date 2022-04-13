import { useEffect, useState } from 'react';
import { FileValidated } from "@dropzone-ui/react";
import { APIResponse } from '../../models/api/APIResponse';
import { Saint } from '../../models/saint/Saint';
import { File } from '../../models/file/File';
import { FileService } from '../file/FileService';
import { Service } from '../../models/Service';

const useSaintByIdService = (
    initialSaintState: Saint,
    assignSaintCallback: (saint: Saint) => void,
    assignFileCallback: (files: Array<FileValidated>) => void,
    saintId?: string
) => {
    const [result, setResult] = useState<Service<{}>>({
        status: 'loading'
    });

    useEffect(() => {
        setResult({ status: 'loading' });

        if (saintId) {
            const headers = new Headers();
            headers.append('Content-Type', 'application/json; charset=utf-8');
            headers.append('Access-Control-Allow-Origin', '*');
            headers.append('Access-Control-Allow-Headers', '*');

            const getData = async () => {
                const saintResponseBuffer: Response = await fetch(
                    `/saints/${saintId}`,
                    { method: 'GET', headers: headers }
                );

                const saintAPIResponse = await saintResponseBuffer.json() as APIResponse<Saint>;

                const saintData: Saint = saintAPIResponse.data;

                assignSaintCallback({  ...initialSaintState, ...saintData});

                if (saintData.hasAvatar) {
                    const fileService = new FileService();

                    const fileAPIResponse: APIResponse<File> = await fileService.getFile(
                        'saint-bucket',
                        'images',
                        saintData.name!.replace(/\s/g, '-'),
                        'image/jpeg'
                    );

                    const fileAPIResponseData: File = fileAPIResponse.data;

                    const base64Response: Response = await fetch(`data:image/jpeg;base64,${fileAPIResponseData.content}`);

                    const fileContentBlob: Blob = await base64Response.blob();
                
                    const fileContent = new File(
                        [fileContentBlob],
                        fileAPIResponseData.name,
                        {
                            type: 'image/jpeg'
                        }
                    );

                    const newFileState: Array<FileValidated> = [
                        {
                            id: fileAPIResponseData.name,
                            valid: true,
                            file: fileContent
                        }
                    ];

                    assignFileCallback(newFileState);
                }

                setResult({ status: 'loaded', payload: saintData });
            };

            getData().catch(error => setResult({ status: 'error', error }));
        } else {
            setResult({ status: 'loaded', payload: { data: { ...initialSaintState } } });
        }
    }, [saintId]);

    return result;
};

export default useSaintByIdService;