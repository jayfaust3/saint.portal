import React from 'react';
import { useNavigate } from 'react-router-dom';
import Loader from '../Loader';
import useSaintsService from '../../services/saint/view/useGetSaintsService';

const Saints: React.FC<{}> = () => {
    const navigate = useNavigate();
    const service = useSaintsService();

    return (
        <>
            <div className="card">
                <header className="header">
                    <div className="container">
                        <h1>Who were the Saints?</h1>
                        <p className="slogan">
                            Learn where the Saints were born, where they're from, and their fates.
                        </p>
                    </div>
                </header>
                {service.status === 'loading' && (
                    <div className="loader-container">
                        <Loader />
                    </div>
                )}
                {service.status === 'loaded' &&
                    (service.payload ?? []).map(saint => (
                        <div
                            className="saint-item"
                            onClick={() => navigate(`/saint/${saint.id}`)}
                            key={saint.id}
                        >
                            {saint.name + ' of ' + saint.region + ', ' + saint.yearOfBirth + ' - ' + saint.yearOfDeath}
                        </div>
                    ))}
                <div className="button-container">
                    <button type="button" className="action-button" onClick={() => navigate('/saint')}>Create</button>
                </div>
            </div>
            {service.status === 'error' && (
                <div>Error, unable to retrieve the Saints.</div>
            )}
        </>
    );
};

export default Saints;
