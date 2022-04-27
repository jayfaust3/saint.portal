import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MaterialTable from 'material-table';
import Loader from '../common/Loader';
import tableIcons from '../utils/MaterialTableIcons';
import SaintAvatar from './SaintAvatar';
import useSaintsService from '../../services/saint/view/useGetSaintsService';
import { Region } from '../../models/saint/Region';
import { enumValueToFriendlyName } from '../../utilities/enumUtilities';
import { Saint } from '../../models/saint/Saint';
import { SessionStorageService } from '../../services/browser/SessionStorageService';

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
                <div className='button-container'>
                    <button type='button' className='action-button' onClick={() => navigate('/saint')}>Add</button>
                </div>
                {saintDataService.status === 'loaded' &&
                    // saintDataService.payload
                    // .sort((a: Saint, b: Saint) => a.name!.localeCompare(b.name!))
                    // .slice(startIndex, endIndex)
                    // .map(saint =>
                    //     (
                    //         <div
                    //             className='saint-item'
                    //             onClick={() => navigate(`/saint/${saint.id}`)}
                    //             key={saint.id}
                    //         >
                    //             <div className='image-container'>
                    //                 <SaintAvatar { ...saint }/>
                    //             </div>
                    //             <div>
                    //                 <h5>{`${saint.name} of ${enumValueToFriendlyName(Region, saint.region! as unknown as object)}`}</h5>
                    //                 <p>{`${saint.yearOfBirth} - ${saint.yearOfDeath}${saint.martyred ? ' (Martyred)' : ''}`}</p>
                    //             </div>
                    //         </div>
                    //     )
                    // )
                    <MaterialTable
                        title=''
                        icons={tableIcons}
                        columns={[
                            { title: "Name", field: "name" },
                            { title: "Surname", field: "surname" },
                            { title: "Birth Year", field: "birthYear", type: "numeric" }
                        ]}
                        data={[
                            { name: "Mohammad", surname: "Faisal", birthYear: 1995 },
                            { name: "Nayeem Raihan ", surname: "Shuvo", birthYear: 1994 }
                        ]}
                    />
                }
            </div>
            {saintDataService.status === 'error' && (
                <div>Error, unable to retrieve the Saints.</div>
            )}
        </>
    );
};

export default Saints;
