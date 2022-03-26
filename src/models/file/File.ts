export interface File {
    name: string;
    content: Uint8Array;
    bucketName?: string;
    path?: string;
    url?: string;
}
