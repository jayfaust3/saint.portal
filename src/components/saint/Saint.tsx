import React, { ChangeEvent, FC } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Select, { ActionMeta, SingleValue } from 'react-select';
import { Dropzone, FileItem, FileValidated } from "@dropzone-ui/react";
import Loader from '../Loader';
import { APIResponse } from '../../models/api/APIResponse';
import { Service } from '../../models/Service';
import { Saint } from '../../models/saint/Saint';
import { Region } from '../../models/saint/Region';
import { DropdownModel } from '../../models/component/DropdownModel';
import useSaintByIdService from '../../services/saint/useSaintByIdService';
import usePostSaintService from '../../services/saint/usePostSaintService';
import usePutSaintService from '../../services/saint/usePutSaintService';
import useGetFileByUrlService from '../../services/file/useGetFileByUrlService';
import { FileService } from '../../services/file/FileService';
import { enumToDropDownModelArray } from '../../utilities/enumUtilities';

const Saint: FC<{}> = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const create: boolean = !id;
    let saveSaintService: Service<APIResponse<Saint>>;
    let saveSaintAction: (saint: Saint) => Promise<void>;
    const [saint, setSaint] = React.useState<Saint>({ id, active: true, hasAvatar: false });
    const [files, setFiles] = React.useState<Array<FileValidated>>([]);
    const getSaintService: Service<{}> = useSaintByIdService(saint, setSaint, id);
    let getFileService: Service<{}> = useGetFileByUrlService(saint, setFiles);
    const fileService = new FileService();
    const regions: Array<DropdownModel> = enumToDropDownModelArray(Region);
    
    if (create) {
        const { postSaintService, publishSaint } = usePostSaintService();

        saveSaintService = postSaintService;

        saveSaintAction = publishSaint;

    } else {
        const { putSaintService, updateSaint } = usePutSaintService();

        saveSaintService = putSaintService;

        saveSaintAction = updateSaint;
    }

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        event.persist();

        setSaint(prevSaint => ({
            ...prevSaint,
            [event.target.name]: event.target.value
        }));
    };

    const handleMartyredChange = (event: ChangeEvent<HTMLInputElement>) => {
        event.persist();
        
        setSaint(prevSaint => ({
            ...prevSaint,
            martyred: event.target.checked
        }));
    };

    const handleRegionChange = (event: SingleValue<DropdownModel>, actionMeta: ActionMeta<DropdownModel>) => {        
        setSaint(prevSaint => ({
            ...prevSaint,
            region: event!.value as Region
        }));
    };

    const handleAvatarChange = (incomingFiles: Array<FileValidated>) => setFiles(incomingFiles);

    const navigateToIndex = () => navigate('/');

    const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        let hasAvatar: boolean = false;

        if (files?.length) {
            const validatedFile: FileValidated = files[0];

            const file = validatedFile.file;

            // const fileType: string = file.name.split('.').pop()!;

            // let prefix: string = '';

            const fileContent: string = Buffer.from(await file.arrayBuffer()).toString('base64url');

            await fileService.postFile({
                name: saint.name!.replace(/\s/g, '-'),
                content: fileContent,
                bucketName: 'saint-bucket'
            });

            hasAvatar = true;
        }
        
        await saveSaintAction({
            ...saint,
            hasAvatar
        });

        navigateToIndex();
    };

    return (
        <div className="card">
            <p className="form-title">Who's this Saint?</p>
            {getSaintService.status === 'loaded' && getFileService.status === 'loaded' &&
            (<form onSubmit={handleFormSubmit}>
                <div>
                    <label>Name</label>
                    <input
                        type="text"
                        name="name"
                        value={saint.name || ''}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Year Born</label>
                    <input
                        type="text"
                        name="yearOfBirth"
                        value={saint.yearOfBirth || 0}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Year Died</label>
                    <input
                        type="text"
                        name="yearOfDeath"
                        value={saint.yearOfDeath || 0}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Region</label>
                    <Select
                        options={regions}
                        name="region"
                        onChange={handleRegionChange}
                        value={[...regions].filter(x => x.value === saint.region).pop()}
                    />
                </div>
                <div className="checkbox-container">
                    <label>Martyred?</label>
                    <input
                        type="checkbox"
                        name="martyred"
                        checked={saint.martyred}
                        onChange={handleMartyredChange}
                    />
                </div>
                <div>
                    <label>Notes</label>
                    <input
                        type="text"
                        name="notes"
                        value={saint.notes || ''}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Avatar</label>
                   {getFileService.status === 'loaded' &&
                   (<Dropzone 
                        onChange={handleAvatarChange}
                        value={files}
                        maxFiles={1}
                        accept={'image/jpeg, image/png'}
                        behaviour={'replace'}
                    >
                        {files.map((file) => (
                            <FileItem {...file} preview />
                        ))}
                    </Dropzone>)}
                </div>
                <div className="button-container">
                    <button type="button" className="cancel-button" onClick={navigateToIndex}>Cancel</button>
                    <button type="submit" className="action-button">Save</button>
                </div>
            </form>)}

            {(getSaintService.status === 'loading' || 
            saveSaintService.status === 'loading' ||
            getFileService.status === 'loading') && (
                <div className="loader-container">
                    <Loader />
                </div>
            )}
            {saveSaintService.status === 'loaded' && (
                <div>Your Saint has been submitted.</div>
            )}
            {saveSaintService.status === 'error' && (
                <div>
                    Unable to submit Saint.
                </div>
            )}
        </div>
    );
};

export default Saint;
