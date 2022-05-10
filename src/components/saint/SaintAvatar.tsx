import React, { FC, PropsWithChildren } from 'react';
import Loader from '../common/Loader';
import { Saint } from '../../models/saint/Saint';
import { UserContext } from '../../models/security/UserContext';
import useGetImageFromSaintService from '../../services/saint/view/useGetImageFromSaintService';

const SaintAvatar: FC<{saint: Saint, context: UserContext }> = (props: PropsWithChildren<{saint: Saint, context: UserContext }>) => {
    const imageService = useGetImageFromSaintService(props.context.auth, props.saint);
    
    return (
        <>
            {imageService.status === 'loaded' && (
                <img src={imageService.payload}/>)
            }
            {imageService.status === 'loading' && (
                <div className='loader-container'>
                    <Loader />
                </div>
            )}
        </>
    );
};

export default SaintAvatar;
