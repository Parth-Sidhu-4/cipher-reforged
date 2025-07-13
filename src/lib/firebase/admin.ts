import admin from 'firebase-admin';

if (!admin.apps.length) {
	const serviceAccount = JSON.parse(process.env.FB_SERVICE_ACCOUNT!);

	admin.initializeApp({
		credential: admin.credential.cert(serviceAccount)
	});
}

export const adminAuth = admin.auth();
export const adminDB = admin.firestore();

// import admin from 'firebase-admin';

// if (!admin.apps.length) {
// 	admin.initializeApp({
// 		credential: admin.credential.cert({
// 			projectId: process.env.FB_PROJECT_ID,
// 			clientEmail: process.env.FB_CLIENT_EMAIL,
// 			privateKey: (process.env.FB_PRIVATE_KEY || '').replace(/\\n/g, '\n')
// 		})
// 	});
// }

// export const adminAuth = admin.auth();
// export const adminDB = admin.firestore();
