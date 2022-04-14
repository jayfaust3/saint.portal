import React, { ChangeEvent, FC } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Select, { ActionMeta, SingleValue } from 'react-select';
import { Dropzone, FileItem, FileValidated } from '@dropzone-ui/react';
import Loader from '../common/Loader';
import { Service } from '../../models/Service';
import { Saint } from '../../models/saint/Saint';
import { Region } from '../../models/saint/Region';
import { DropdownModel } from '../../models/component/DropdownModel';
import useGetSaintService from '../../services/saint/view/useGetSaintService';
import useSaveSaintService from '../../services/saint/view/useSaveSaintService';
import { enumToDropDownModelArray } from '../../utilities/enumUtilities';

const Saint: FC<{}> = () => {
    const navigate = useNavigate();
    const { saintId } = useParams();
    const [saint, setSaint] = React.useState<Saint>({ id: saintId, active: true, hasAvatar: false });
    const [files, setFiles] = React.useState<Array<FileValidated>>([]);
    const getSaintService: Service<{}> = useGetSaintService(saint, setSaint, setFiles, saintId);
    const { saveSaintService, saveSaint } = useSaveSaintService();
    const regions: Array<DropdownModel> = enumToDropDownModelArray(Region);

    const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
        event.persist();

        setSaint(prevSaint => ({
            ...prevSaint,
            name: event.target.value
        }));
    };

    const handleMartyredChange = (event: ChangeEvent<HTMLInputElement>) => {
        event.persist();
        
        setSaint(prevSaint => ({
            ...prevSaint,
            martyred: event.target.checked
        }));
    };

    const handleYearChange = (event: ChangeEvent<HTMLInputElement>) => {
        event.persist();
        
        setSaint(prevSaint => ({
            ...prevSaint,
            [event.target.name]: event.target.valueAsNumber
        }));
    };

    const handleRegionChange = (event: SingleValue<DropdownModel>, actionMeta: ActionMeta<DropdownModel>) => {        
        setSaint(prevSaint => ({
            ...prevSaint,
            region: event!.value as Region
        }));
    };

    const handleNotesChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
        event.persist();

        setSaint(prevSaint => ({
            ...prevSaint,
            notes: event.target.value
        }));
    };

    const handleAvatarChange = (incomingFiles: Array<FileValidated>) => setFiles(incomingFiles);

    const navigateToIndex = () => navigate('/');

    const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        await saveSaint(saint, files?.pop());

        navigateToIndex();
    };

    return (
        <div className='card'>
            <p className='form-title'>Who's this Saint?</p>
            {getSaintService.status === 'loaded' &&
            (<form onSubmit={handleFormSubmit}>
                <div>
                    <label>Name</label>
                    <input
                        type='text'
                        name='name'
                        value={saint.name || ''}
                        onChange={handleNameChange}
                        required
                    />
                </div>
                <div>
                    <label>Year Born</label>
                    <input
                        type='number'
                        name='yearOfBirth'
                        value={saint.yearOfBirth || 0}
                        onChange={handleYearChange}
                        required
                    />
                </div>
                <div>
                    <label>Year Died</label>
                    <input
                        type='number'
                        name='yearOfDeath'
                        value={saint.yearOfDeath || 0}
                        onChange={handleYearChange}
                        required
                    />
                </div>
                <div>
                    <label>Region</label>
                    <Select
                        options={regions}
                        name='region'
                        onChange={handleRegionChange}
                        value={[...regions].filter(x => x.value === saint.region).pop()}
                    />
                </div>
                <div>
                    <label>Martyred?</label>
                    <input
                        className='left-justified-input'
                        type='checkbox'
                        name='martyred'
                        checked={saint.martyred}
                        onChange={handleMartyredChange}
                    />
                </div>
                <div>
                    <label>Notes</label>
                    <textarea
                        rows={5}
                        cols={120}
                        name='notes'
                        value={saint.notes || ''}
                        onChange={handleNotesChange}>
                    </textarea>
                </div>
                <div>
                    <label>Avatar</label>
                   {getSaintService.status === 'loaded' &&
                   (<Dropzone 
                        onChange={handleAvatarChange}
                        value={files}
                        maxFiles={1}
                        accept={'image/jpeg, image/jpg'}
                        behaviour={'replace'}
                    >
                        {files.map((file) => (
                            <FileItem {...file} preview />
                        ))}
                    </Dropzone>)}
                </div>
                <div className='button-container'>
                    <button type='button' className='cancel-button' onClick={navigateToIndex}>Cancel</button>
                    <button type='submit' className='action-button'>Save</button>
                </div>
            </form>)}

            {(getSaintService.status === 'loading' || 
            saveSaintService.status === 'loading') && (
                <div className='loader-container'>
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