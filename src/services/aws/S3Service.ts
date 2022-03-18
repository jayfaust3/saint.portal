import { S3Config } from "../../models/config/aws/S3Config";

const S3FileUpload = require('react-s3');

export class S3Service {
    readonly #config: S3Config;

    constructor(config?: S3Config) {
        this.#config = config ?? {
            bucketName: 'saint',
            dirName: 'images',
            region: 'us-east-1',
            accessKeyId: 'fake',
            secretAccessKey: 'fake'
        };
    }

    public async uploadFile(file: File): Promise<string> {
        const uploadResponse = await S3FileUpload.uploadFile(file, this.#config);

        return uploadResponse.location;
    }
}
