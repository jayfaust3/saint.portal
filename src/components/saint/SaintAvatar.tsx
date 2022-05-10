import React, { FC, PropsWithChildren } from 'react';
import Loader from '../common/Loader';
import { Saint } from '../../models/saint/Saint';
import { UserContext } from '../../models/security/UserContext';
import useGetImageFromSaintService from '../../services/saint/view/useGetImageFromSaintService';

const SaintAvatar: FC<{data: Saint, userContext: UserContext }> = (props: PropsWithChildren<{data: Saint, userContext: UserContext }>) => {
    const imageService = useGetImageFromSaintService(props.userContext.auth, props.data);
    
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
