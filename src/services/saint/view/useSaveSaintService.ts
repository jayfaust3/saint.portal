import { useState } from 'react';
import { FileValidated } from '@dropzone-ui/react';
import { UserAuth } from '../../../models/security/UserContext';
import { Saint } from '../../../models/saint/Saint';
import { Service } from '../../Service';
import { SaintService } from '../crud/SaintService';
import { FileService } from '../../file/crud/FileService';

const useSaveSaintService = (auth: UserAuth) => {
    const [saveSaintService, setService] = useState<Service<{}>>({
        status: 'init'
    });

    const validateSaint = (saint: Saint) => {
        if (!saint.name || !saint.region || !saint.yearOfDeath || !saint.region) {
            throw Error('Saint missing one or more required properties.');
        }

        if (saint.yearOfBirth! > saint.yearOfDeath) {
            throw Error(`Saint's Year Of Birth must not be after Year Of Death.`);
        }
    };

    const saveSaint = async (saint: Saint, file?: FileValidated) => {
        setService({ status: 'loading' });
            
        try {
            validateSaint(saint);

            const saintService = new SaintService(auth);

            if (saint.id) {
                await saintService.put(saint.id, saint);
            } else {
                await saintService.post(saint);
            }

            if(file) {
                const fileService = new FileService(auth);
    
                const fileContent: string = Buffer.from(
                    await file!.file.arrayBuffer()
                ).toString('base64');
    
                await fileService.postFile({
                    bucketName: 'saint-bucket',
                    directory: 'images',
                    name: saint.name!.replace(/\s/g, '-'),
                    contentType: 'image/jpeg',
                    content: fileContent
                });
            }

            setService({ status: 'loaded', payload: {} });
        } catch (error) {
            setService({ status: 'error', error: error as Error });
        }
    };

    return {
        saveSaintService,
        saveSaint
    };
};

export default useSaveSaintService;
