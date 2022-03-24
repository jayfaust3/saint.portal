import S3 from 'aws-sdk/clients/s3';
import { S3Config } from "../../models/config/aws/S3Config";

export class S3Service {
    readonly #config: S3Config;
    readonly #client: S3;

    constructor(config?: S3Config) {
        this.#config = config ?? {
            bucketName: 'saint',
            dirName: 'images',
            region: 'us-east-1',
            accessKeyId: 'fake',
            secretAccessKey: 'fake'
        };

        this.#client = new S3({
            s3ForcePathStyle: true,
            accessKeyId: this.#config.accessKeyId,
            secretAccessKey: this.#config.secretAccessKey,
            endpoint: '/saint-bucket'
        });

        this.#client.config.update({
            region: this.#config.region
        });
    }

    public async uploadFile(file: Buffer | Uint8Array | Blob): Promise<string> {
        const uploadResponse = await this.#client.upload({
            Bucket: this.#config.bucketName,
            Key: `saint-${new Date().toISOString()}`,
            Body: file
        }).promise();

        return uploadResponse.Location;
    }
}
