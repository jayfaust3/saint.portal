import React, { ChangeEvent, FC, FormEvent, PropsWithChildren, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Select, { ActionMeta, SingleValue } from 'react-select';
import { Dropzone, FileItem, FileValidated } from '@dropzone-ui/react';
import Loader from '../common/Loader';
import SaintAvatar from './SaintAvatar';
import { Service } from '../../services/Service';
import { Saint } from '../../models/saint/Saint';
import { Region } from '../../models/saint/Region';
import { DropdownModel } from '../../models/component/DropdownModel';
import { UserContext } from '../../models/security/UserContext';
import useGetSaintService from '../../services/saint/view/useGetSaintService';
import useSaveSaintService from '../../services/saint/view/useSaintCRUDService';
import { enumToDropDownModelArray, enumValueToFriendlyName } from '../../utilities/enumUtilities';

const Saint: FC<{ userContext: UserContext }> = (props: PropsWithChildren<{ userContext: UserContext }>) => {
    const isLoggedIn: boolean = props.userContext.isLoggedIn;
    const navigate = useNavigate();
    const { saintId } = useParams();
    const create: boolean = !saintId;
    const [formValid, setFormValid] = useState<boolean>(!create);
    const [saint, setSaint] = useState<Saint>({ id: saintId, hasAvatar: false });
    const [files, setFiles] = useState<Array<FileValidated>>([]);
    const getSaintService: Service<{}> = useGetSaintService(props.userContext.auth, saint, setSaint, setFiles, saintId);
    const { saintCRUDService, saveSaint } = useSaveSaintService(props.userContext.auth);
    const regions: Array<DropdownModel> = enumToDropDownModelArray(Region);
    useEffect(
        () => setFormValid(
            !(!saint.name || !saint.region || !saint.yearOfDeath || !saint.region || (saint.yearOfBirth! > saint.yearOfDeath))
        ),
        [saint]
    ); 
    useEffect(
        () => {
            const hasAvatar: boolean = files.length > 0;

            setSaint(prevSaint => ({
                ...prevSaint,
                hasAvatar
            }));
        },
        [files]
    );

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

    const handleFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (formValid && isLoggedIn) {
            await saveSaint(saint, files?.pop());

            navigateToIndex();
        }
    };

    return (
        <div className='card'>
            <h3 className='form-title'>Who's this Saint?</h3>
            <p>{isLoggedIn ? '' : 'Login to make changes'}</p>
            {getSaintService.status === 'loaded' &&
            (<form onSubmit={handleFormSubmit}>
                <div>
                    <label className='required'>Name</label>
                    <input
                        type='text'
                        name='name'
                        value={saint.name || ''}
                        disabled={!isLoggedIn}
                        onChange={handleNameChange}
                        required
                    />
                </div>
                <div>
                    <label className='required'>Year Born</label>
                    <input
                        type='number'
                        name='yearOfBirth'
                        value={saint.yearOfBirth || 0}
                        disabled={!isLoggedIn}
                        onChange={handleYearChange}
                        required
                    />
                </div>
                <div>
                    <label className='required'>Year Died</label>
                    <input
                        type='number'
                        name='yearOfDeath'
                        value={saint.yearOfDeath || 0}
                        disabled={!isLoggedIn}
                        onChange={handleYearChange}
                        required
                    />
                </div>
                <div>
                    <label className='required'>Region</label>
                    {
                        isLoggedIn ?
                        <Select
                            options={regions}
                            name='region'
                            onChange={handleRegionChange}
                            value={[...regions].filter(x => x.value === saint.region).pop()}
                        /> :
                        <input
                            type='text'
                            name='region'
                            value={enumValueToFriendlyName(Region, saint.region! as unknown as object)}
                            disabled={!isLoggedIn}
                            required
                        />
                    }
                </div>
                <div>
                    <label>Martyred?</label>
                    <input
                        className='left-justified-input'
                        type='checkbox'
                        name='martyred'
                        checked={saint.martyred}
                        disabled={!isLoggedIn}
                        onChange={handleMartyredChange}
                    />
                </div>
                <div>
                    <label>Notes</label>
                    <textarea
                        rows={10}
                        cols={120}
                        name='notes'
                        value={saint.notes || ''}
                        disabled={!isLoggedIn}
                        onChange={handleNotesChange}>
                    </textarea>
                </div>
                <div>
                    <label>Avatar</label>
                    {
                        isLoggedIn && getSaintService.status === 'loaded' ?
                        <Dropzone 
                            onChange={handleAvatarChange}
                            value={files}
                            maxFiles={1}
                            accept={'image/jpeg, image/jpg'}
                            behaviour={'replace'}
                        >
                            {files.map((file) => (
                                <FileItem {...file} preview />
                            ))}
                        </Dropzone>
                            :
                        <div className='avatar-container'>
                            <SaintAvatar data={saint} userContext={props.userContext}/>
                        </div>
                    }
                </div>
                   
                <div className='button-container'>
                    <button type='button' className='cancel-button' onClick={navigateToIndex}>
                        { isLoggedIn ? 'Cancel' : 'Done' }
                    </button>
                    <button type='submit' className='action-button' disabled={!formValid || !isLoggedIn} hidden={!isLoggedIn}>
                        Save
                    </button>
                </div>
            </form>)}

            {(getSaintService.status === 'loading' || 
            saintCRUDService.status === 'loading') && (
                <div className='loader-container'>
                    <Loader />
                </div>
            )}
            {saintCRUDService.status === 'loaded' && (
                <div>Your Saint has been submitted.</div>
            )}
            {saintCRUDService.status === 'error' && (
                <div>
                    Unable to submit Saint.
                </div>
            )}
        </div>
    );
};

export default Saint;