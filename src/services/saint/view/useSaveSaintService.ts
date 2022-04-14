import { useState } from 'react';
import { FileValidated } from "@dropzone-ui/react";
import { Service } from '../../../models/Service';
import { Saint } from '../../../models/saint/Saint';
import { SaintService } from '../crud/SaintService';
import { FileService } from '../../file/crud/FileService';

const useSaveSaintService = () => {
    const [saveSaintService, setService] = useState<Service<{}>>({
        status: 'init'
    });

    const saveSaint = async (saint: Saint, file?: FileValidated) => {
        setService({ status: 'loading' });

        const saintService = new SaintService();
            
        try {
            if (saint.id) {
                await saintService.put(saint.id, saint);
            } else {
                await saintService.post(saint);
            }

            if(file) {
                const fileService = new FileService();
    
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
    
                saint.hasAvatar = true;
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
