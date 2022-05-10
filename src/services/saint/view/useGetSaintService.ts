import { useEffect, useState } from 'react';
import { FileValidated } from '@dropzone-ui/react';
import { UserAuth } from '../../../models/security/UserContext';
import { APIResponse } from '../../../models/api/APIResponse';
import { Saint } from '../../../models/saint/Saint';
import { SaintService } from '../crud/SaintService';
import { File } from '../../../models/file/File';
import { FileService } from '../../file/crud/FileService';
import { Service } from '../../Service';

const useGetSaintService = (
    auth: UserAuth,
    initialSaintState: Saint,
    assignSaintCallback: (saint: Saint) => void,
    assignFileCallback: (files: Array<FileValidated>) => void,
    saintId?: string
) => {
    const [result, setResult] = useState<Service<{}>>({
        status: 'loading'
    });

    useEffect(
        () => {
            setResult({ status: 'loading' });

            if (saintId) {
                const saintService = new SaintService(auth);

                const getData = async () => {
                    const saintAPIResponse: APIResponse<Saint> = await saintService.get(saintId);

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
        },
        [saintId]
    );

    return result;
};

export default useGetSaintService;