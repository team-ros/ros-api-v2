import * as admin from 'firebase-admin';

admin.initializeApp({
    credential: admin.credential.cert(JSON.parse(Buffer.from(String(process.env.FIREBASE), 'base64').toString("utf-8")))
});

export default admin