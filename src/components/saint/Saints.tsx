import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MaterialTable from 'material-table';
import { SvgIconComponent } from '@material-ui/icons';
import Loader from '../common/Loader';
import tableIcons from '../utils/MaterialTableIcons';
import SaintAvatar from './SaintAvatar';
import { Region } from '../../models/saint/Region';
import { enumValueToFriendlyName } from '../../utilities/enumUtilities';
import { Saint } from '../../models/saint/Saint';
import useSaintsService from '../../services/saint/view/useGetSaintsService';
import useSaveSaintService from '../../services/saint/view/useSaveSaintService';

const Saints: React.FC<{}> = () => {
    const navigate = useNavigate();
    const getSaintsService = useSaintsService();
    const { saveSaint } = useSaveSaintService();
    const [saints, setSaints] = useState<Array<Saint>>([]);
    useEffect(
        () => {
            setSaints(getSaintsService.status === 'loaded' ? getSaintsService.payload.filter((saint) => saint.active) : []);
        },
        [getSaintsService]
    );

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
                {getSaintsService.status === 'loading' && (
                    <div className='loader-container'>
                        <Loader />
                    </div>
                )}
                <div className='button-container'>
                    <button type='button' className='action-button' onClick={() => navigate('/saint')}>Add</button>
                </div>
                {getSaintsService.status === 'loaded' &&
                    <MaterialTable
                        title=''
                        icons={tableIcons}
                        options={{actionsColumnIndex: -1}}
                        localization={{
                            header: {
                              actions: ''
                            }
                          }}
                        columns={[
                            {
                                title: '',
                                render: (saint) =>  <div className='avatar-container'>
                                                        <SaintAvatar { ...saint }/>
                                                    </div>
                            },
                            {
                                title: '',
                                render: (saint) =>  <div>
                                                        <h5>{`${saint.name} of ${enumValueToFriendlyName(Region, saint.region! as unknown as object)}`}</h5>
                                                        <p>{`${saint.yearOfBirth} - ${saint.yearOfDeath}${saint.martyred ? ' (Martyred)' : ''}`}</p>
                                                    </div>
                            }
                        ]}
                        data={saints}
                        actions={[
                            {
                                icon: tableIcons.Edit as SvgIconComponent,
                                tooltip: 'Edit',
                                onClick: (event, saint) => navigate(`/saint/${(saint as Saint).id}`)
                            },
                            {
                                icon: tableIcons.Delete as SvgIconComponent,
                                tooltip: 'Delete',
                                onClick: async (event, saint) => {
                                    await saveSaint({ ...(saint as Saint), active: false });

                                    setSaints([...saints].filter((_) => _.id !== (saint as Saint).id));
                                }
                            }
                          ]}
                    />
                }
            </div>
            {getSaintsService.status === 'error' && (
                <div>Error, unable to retrieve the Saints.</div>
            )}
        </>
    );
};

export default Saints;
