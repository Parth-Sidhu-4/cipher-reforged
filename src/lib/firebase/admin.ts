// src/lib/firebase/admin.ts
import admin from 'firebase-admin';

const { privateKey } = JSON.parse(process.env.FIREBASE_PRIVATE_KEY || '{}');

if (!admin.apps.length) {
	admin.initializeApp({
		credential: admin.credential.cert({
			projectId: process.env.FB_PROJECT_ID,
			clientEmail: process.env.FB_CLIENT_EMAIL,
			privateKey
		})
	});
}

export const adminAuth = admin.auth();
export const adminDB = admin.firestore();
