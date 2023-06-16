import { Region } from './Region';

export interface Saint {
    id?: string;
    name?: string;
    yearOfBirth?: number;
    yearOfDeath?: number;
    region?: Region;
    martyred?: boolean;
    notes?: string;
    hasAvatar: boolean;
}
