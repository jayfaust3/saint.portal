import React, { PropsWithChildren } from 'react';
import Loader from '../common/Loader';
import { Saint } from '../../models/saint/Saint';
import useGetImageFromSaintService from '../../services/saint/view/useGetImageFromSaintService';

const SaintAvatar: React.FC<Saint> = (props: PropsWithChildren<Saint>) => {
    const imageService = useGetImageFromSaintService(props);
    
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
