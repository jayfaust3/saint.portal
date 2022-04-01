import React, { ChangeEvent, FC, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Select, { ActionMeta, SingleValue } from 'react-select';
import Loader from '../Loader';
import { APIResponse } from '../../models/api/APIResponse';
import { Service } from '../../models/Service';
import { Saint } from '../../models/saint/Saint';
import { Region } from '../../models/saint/Region';
import useSaintByIdService from '../../services/saint/useSaintByIdService';
import usePostSaintService from '../../services/saint/usePostSaintService';
import usePutSaintService from '../../services/saint/usePutSaintService';
import usePostFileService from '../../services/file/usePostFileService';

const Saint: FC<{}> = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const create: boolean = !id;

    let saveSaintService: Service<APIResponse<Saint>>;
    let saveSaintAction: (saint: Saint) => Promise<void>;
    const [saint, setSaint] = React.useState<Saint>({ id, active: true });
    const [file, setFile] = React.useState<File | undefined>(undefined);
    const getSaintService: Service<{}> = useSaintByIdService(saint, setSaint, id);
    const { postFileService, publishFile } = usePostFileService();

    const regions: Array<{ label: string; value: string}> = 
        Object.entries(Region).map((entry) => {
            return { 
                label: entry[1],
                value: entry[0]
            };
        })
        .sort((a, b) => a.label.localeCompare(b.label));

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

    const handleRegionChange = (event: SingleValue<{label: string; value: string}>, actionMeta: ActionMeta<{label: string; value: string}>) => {        
        setSaint(prevSaint => ({
            ...prevSaint,
            region: event!.value as Region
        }));
    };

    const handleAvatarChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files?.length) {
            setFile(event.target.files[0]);
        } else {
            setFile(undefined);
        }
    }

    useEffect(() => {
        if (file && saint.imageURL) {
            saveSaintAndReturnToIndex();
        }
    }, [saint]);

    const saveSaintAndReturnToIndex = async () => {
        await saveSaintAction(saint);

        navigate('/');
    };

    const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (file) {
            await publishFile({
                name: `${saint.name}-${new Date().toISOString()}`,
                content: Buffer.from(await file.arrayBuffer()).toString('base64'),
                bucketName: 'saint',
                path: 'images'
            });

            do {
                if (postFileService.status === 'loaded') {
                    setSaint(prevSaint => ({
                        ...prevSaint,
                        imageURL: postFileService.payload.data.url
                    }));

                    break;
                }

                if (postFileService.status === 'error') {
                    break;
                }

            } while (postFileService.status === 'loading')
        } else {
            await saveSaintAndReturnToIndex();
        }
    };

    return (
        <div className="card">
            <p className="form-title">Who's this Saint?</p>
            {getSaintService.status === 'loaded' && 
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
                    <input
                        type="file"
                        name="avatar"
                        accept="image/*"
                        onChange={handleAvatarChange}
                    />
                    {postFileService.status === 'error' && (
                        <div>
                            Unable to upload avatar.
                        </div>
                    )}
                </div>
                <div className="button-container">
                    <button type="button" className="cancel-button" onClick={() => navigate('/')}>Cancel</button>
                    <button type="submit" className="action-button">Save</button>
                </div>
            </form>)}

            {(getSaintService.status === 'loading' || saveSaintService.status === 'loading') && (
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
