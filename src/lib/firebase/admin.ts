import admin from 'firebase-admin';

if (!admin.apps.length) {
	admin.initializeApp({
		credential: admin.credential.cert({
			projectId: process.env.FB_PROJECT_ID || import.meta.env?.VITE_FB_PROJECT_ID,

			clientEmail: process.env.FB_CLIENT_EMAIL || import.meta.env?.VITE_FB_CLIENT_EMAIL,
			privateKey: (process.env.FB_PRIVATE_KEY || import.meta.env?.VITE_FB_PRIVATE_KEY)?.replace(
				/\n/g,
				'\n'
			)
		})
	});
}

export const adminAuth = admin.auth();
export const adminDB = admin.firestore();
