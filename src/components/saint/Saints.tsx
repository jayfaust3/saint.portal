import React from 'react';
import { useNavigate } from 'react-router-dom';
import Loader from '../common/Loader';
import SaintAvatar from './SaintAvatar';
import useSaintsService from '../../services/saint/view/useGetSaintsService';
import { Region } from '../../models/saint/Region';
import { enumValueToFriendlyName } from '../../utilities/enumUtilities';

const Saints: React.FC<{}> = () => {
    const navigate = useNavigate();
    const saintDataService = useSaintsService();

    return (
        <>
            <div className='card'>
                <header className='header'>
                    <div className='container'>
                        <h1>Who were the Saints?</h1>
                        <p className='slogan'>
                            Learn where the Saints were born, where they're from, and their fates.
                        </p>
                    </div>
                </header>
                {saintDataService.status === 'loading' && (
                    <div className='loader-container'>
                        <Loader />
                    </div>
                )}
                {saintDataService.status === 'loaded' &&
                    (saintDataService.payload).map(saint => (
                        <div
                            className='saint-item'
                            onClick={() => navigate(`/saint/${saint.id}`)}
                            key={saint.id}
                        >
                            <div className='image-container'>
                                <SaintAvatar { ...saint }/>
                            </div>
                            <div className='right'>
                                <h5>{`${saint.name} of ${enumValueToFriendlyName(Region, saint.region! as unknown as object)}`}</h5>
                                <p>{`${saint.yearOfBirth} - ${saint.yearOfDeath}${saint.martyred ? ' (Martyred)' : ''}`}</p>
                            </div>
                        </div>
                    ))}
                <div className='button-container'>
                    <button type='button' className='action-button' onClick={() => navigate('/saint')}>Create</button>
                </div>
            </div>
            {saintDataService.status === 'error' && (
                <div>Error, unable to retrieve the Saints.</div>
            )}
        </>
    );
};

export default Saints;
