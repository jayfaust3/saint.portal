import React, { ChangeEvent, FC } from 'react';import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Select, { ActionMeta, SingleValue } from 'react-select';
import { APIResponse } from '../../models/api/APIResponse';
import { Service } from '../../models/Service';
import useSaintByIdService from '../../services/saint/useSaintByIdService';
import usePostSaintService from '../../services/saint/usePostSaintService';
import usePutSaintService from '../../services/saint/usePutSaintService';
import { Saint } from '../../models/saint/Saint';
import { Region } from '../../models/saint/Region';
import Loader from '../Loader';

const Saint: FC<{}> = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const create: boolean = !id;

    let saveSaintService: Service<APIResponse<Saint>>;
    let saveSaintAction: (saint: Saint) => Promise<void>;
    const [saint, setSaint] = React.useState<Saint>({ id, active: true });
    const getSaintService: Service<{}> = useSaintByIdService(saint, setSaint, id);

    const regions: Array<{ label: string; value: string}> = 
        Object.entries(Region).map((entry) => {
            return { 
                label: entry[1],
                value: entry[0]
            };
        })
        .sort((a, b) => a.label.localeCompare(b.label));

    if (create) {
        const { service, publishSaint } = usePostSaintService();

        saveSaintService = service;

        saveSaintAction = publishSaint;

    } else {
        const { service, updateSaint } = usePutSaintService();

        saveSaintService = service;

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

    const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        await saveSaintAction(saint);

        navigate('/');
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
