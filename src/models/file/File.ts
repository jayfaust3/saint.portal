export interface File {
    name: string;
    content: string | Buffer | Uint8Array;
    bucketName?: string;
    path?: string;
    url?: string;
}
