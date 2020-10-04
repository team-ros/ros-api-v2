import minio from "minio"

const minioClient = new minio.Client({
    endPoint: String(process.env.S3_ENDPOINT),
    port: 443,
    useSSL: true,
    accessKey: String(process.env.S3_ACCESS_KEY),
    secretKey: String(process.env.S3_SECRET_KEY)
});

export default minioClient