import { Region } from "./Region";

export interface Saint {
    id?: string;
    active: boolean;
    name?: string;
    yearOfBirth?: number;
    yearOfDeath?: number;
    region?: Region;
    martyred?: boolean;
    notes?: string;
    imageURL?: string;
}
