import React, { FC, PropsWithChildren, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MaterialTable from 'material-table';
import { SvgIconComponent } from '@material-ui/icons';
import Loader from '../common/Loader';
import tableIcons from '../utils/MaterialTableIcons';
import SaintAvatar from './SaintAvatar';
import { Region } from '../../models/saint/Region';
import { enumValueToFriendlyName } from '../../utilities/enumUtilities';
import { Saint } from '../../models/saint/Saint';
import { UserContext } from '../../models/security/UserContext';
import useSaintsService from '../../services/saint/view/useGetSaintsService';
import useSaveSaintService from '../../services/saint/view/useSaveSaintService';

const Saints: FC<{ userContext: UserContext }> = (props: PropsWithChildren<{ userContext: UserContext }>) => {
    const isLoggedIn: boolean = props.userContext.isLoggedIn;
    const navigate = useNavigate();
    const getSaintsService = useSaintsService(props.userContext.auth);
    const { saveSaint } = useSaveSaintService(props.userContext.auth);
    const [saints, setSaints] = useState<Array<Saint>>([]);
    useEffect(
        () => {
            setSaints(getSaintsService.status === 'loaded' ? getSaintsService.payload : []);
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
                    <button title={isLoggedIn ? 'Add a new saint' : 'Login to add a new saint'} type='button' className='action-button' disabled={!isLoggedIn} onClick={() => navigate('/saint')}>
                        Add
                    </button>
                </div>
                {getSaintsService.status === 'loaded' &&
                    <MaterialTable
                        icons={tableIcons}
                        options={
                            {
                                actionsColumnIndex: -1,
                                search: false,
                                showTitle: false,
                                toolbar: false,
                                pageSize: 25
                            }
                        }
                        localization={
                            {
                                header: {
                                    actions: ''
                                }
                            }
                        }
                        columns={
                            [
                                {
                                    title: '',
                                    render: (saint) =>  <div>
                                                            <div className='avatar-container'>
                                                                <SaintAvatar data={saint} userContext={props.userContext}/>
                                                            </div>
                                                            <h5>{`${saint.name} of ${enumValueToFriendlyName(Region, saint.region! as unknown as object)}`}</h5>
                                                            <p>{`${saint.yearOfBirth} - ${saint.yearOfDeath}${saint.martyred ? ' (Martyred)' : ''}`}</p>
                                                        </div>
                                                        
                                },
                                {
                                    title: '',
                                    render: (saint) =>  <div className='summary-column'>
                                                            <p>{saint.notes ?? ''}</p>
                                                        </div>
                                }
                            ]
                        }
                        data={(saints ?? []).filter((saint) => saint.active)}
                        actions={
                            [
                                (
                                    isLoggedIn ?
                                    {
                                        icon: tableIcons.Edit as SvgIconComponent,
                                        tooltip: 'Edit',
                                        onClick: (event, saint) => navigate(`/saint/${(saint as Saint).id}`)
                                    } :
                                    {
                                        icon: tableIcons.Search as SvgIconComponent,
                                        tooltip: 'View',
                                        onClick: (event, saint) => navigate(`/saint/${(saint as Saint).id}`)
                                    }
                                ),
                                {
                                    icon: tableIcons.Delete as SvgIconComponent,
                                    disabled: !isLoggedIn,
                                    tooltip: isLoggedIn ? 'Delete' : 'Login to Delete',
                                    onClick: async (event, data) => {
                                        const saint = data as Saint;

                                        saint.active = false;

                                        await saveSaint(saint);
                                    }
                                }
                            ]
                        }
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
