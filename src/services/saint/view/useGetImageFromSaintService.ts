import { useEffect, useState } from 'react';
import { APIResponse } from '../../../models/api/APIResponse';
import { Saint } from '../../../models/saint/Saint';
import { File } from '../../../models/file/File';
import { FileService } from '../../file/crud/FileService';
import { Service } from '../../../models/Service';

const useGetImageFromSaintService = (saint: Saint) => {
    const [result, setResult] = useState<Service<string | undefined>>({
        status: 'loading'
    });

    useEffect(
        () => {
            setResult({ status: 'loading' });

            if (saint.hasAvatar) {

                const getData = async () => {
                    const fileService = new FileService();

                    const fileAPIResponse: APIResponse<File> = await fileService.getFile(
                        'saint-bucket',
                        'images',
                        saint.name!.replace(/\s/g, '-'),
                        'image/jpeg'
                    );

                    const fileAPIResponseData: File = fileAPIResponse.data;

                    setResult({ status: 'loaded', payload: `data:image/jpeg;base64,${fileAPIResponseData.content}` });
                }

                getData().catch(error => setResult({ status: 'error', error }));
            } else {
                setResult({ status: 'loaded', payload: undefined });
            }
        },
        [saint]
    );

    return result;
};

export default useGetImageFromSaintService;