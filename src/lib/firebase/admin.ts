import admin from 'firebase-admin';

if (!admin.apps.length) {
	let credentials;

	if (process.env.FB_SERVICE_ACCOUNT) {
		credentials = JSON.parse(process.env.FB_SERVICE_ACCOUNT);
	} else {
		credentials = {
			projectId: process.env.FB_PROJECT_ID,
			clientEmail: process.env.FB_CLIENT_EMAIL,
			privateKey: (process.env.FB_PRIVATE_KEY || '').replace(/\\n/g, '\n')
		};
	}

	admin.initializeApp({
		credential: admin.credential.cert(credentials)
	});
}

export const adminAuth = admin.auth();
export const adminDB = admin.firestore();
