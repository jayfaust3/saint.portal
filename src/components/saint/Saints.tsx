import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MaterialTable from 'material-table';
import Loader from '../common/Loader';
import SaintAvatar from './SaintAvatar';
import useSaintsService from '../../services/saint/view/useGetSaintsService';
import { Region } from '../../models/saint/Region';
import { enumValueToFriendlyName } from '../../utilities/enumUtilities';
import { Saint } from '../../models/saint/Saint';
import { SessionStorageService } from '../../services/browser/SessionStorageService';

const Saints: React.FC<{}> = () => {
    const navigate = useNavigate();
    const saintDataService = useSaintsService();
    const sessionStorageService = new SessionStorageService();
    const itemsPerPage: number = 5;
    const indexPageNumberKey: string = 'saint:IndexPageNumber';
    const startPageNumber = sessionStorageService.getItem<number>(indexPageNumberKey, false) ?? 1;
    const [pageNumber, setPageNumber] = useState<number>(startPageNumber);
    const getStartIndex = (page: number) => ((page - 1) * itemsPerPage);
    const getEndIndex = (page: number) => (page + itemsPerPage);
    const [startIndex, setStartIndex] = useState<number>(getStartIndex(startPageNumber));
    const [endIndex, setEndIndex] = useState<number>(getEndIndex(startPageNumber));

    const handleNavigation = (page: number) => {
        setPageNumber(page);

        sessionStorageService.setItem(indexPageNumberKey, page);

        setStartIndex(getStartIndex(page));

        setEndIndex(getEndIndex(page));
    };


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
                        columns={[
                            { title: "Adı", field: "name" },
                            { title: "Soyadı", field: "surname" },
                            { title: "Doğum Yılı", field: "birthYear", type: "numeric" },
                            { title: "Doğum Yeri", field: "birthCity" },
                        ]}
                        data={[
                            {
                                name: "Mehmet",
                                surname: "Baran",
                                birthYear: 1987,
                                birthCity: 63,
                            },
                        ]}
                    />
                }
                {saintDataService.status === 'loaded' &&
                <div className='button-container'>
                    <button type='button' className='action-button' disabled={pageNumber <= 1} onClick={() => handleNavigation(Math.max(1, pageNumber - 1))}>Previous Page</button>
                    <button type='button' className='action-button' disabled={(pageNumber * itemsPerPage) >= saintDataService.payload.length} onClick={() => handleNavigation(Math.min(saintDataService.payload.length, pageNumber + 1))}>Next Page</button>
                </div>
                }
            </div>
            {saintDataService.status === 'error' && (
                <div>Error, unable to retrieve the Saints.</div>
            )}
        </>
    );
};

export default Saints;
