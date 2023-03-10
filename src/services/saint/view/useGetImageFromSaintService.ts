import { useEffect, useState } from 'react';
import { APIResponse } from '../../../models/api/APIResponse';
import { Saint } from '../../../models/saint/Saint';
import { File } from '../../../models/file/File';
import { UserAuth } from '../../../models/security/UserAuth';
import { FileService } from '../../file/crud/FileService';
import { Service } from '../../Service';

const useGetImageFromSaintService = (auth: UserAuth, saint: Saint) => {
    const [result, setResult] = useState<Service<string | undefined>>({
        status: 'loading'
    });

    useEffect(
        () => {
            setResult({ status: 'loading' });

            if (saint.hasAvatar) {

                const getData = async () => {
                    const fileService = new FileService(auth);

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
                setResult({ status: 'loaded', payload: 'dafault-avatar.jpeg' });
            }
        },
        [saint]
    );

    return result;
};

export default useGetImageFromSaintService;