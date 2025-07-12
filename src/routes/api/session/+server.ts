import { adminAuth, adminDB } from '$lib/firebase/admin';
import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { FieldValue } from 'firebase-admin/firestore';

export const POST: RequestHandler = async ({ request, cookies }) => {
	try {
		const { idToken } = await request.json();
		if (!idToken) throw error(400, 'Missing ID token');

		const expiresIn = 60 * 60 * 24 * 5 * 1000;

		const decodedToken = await adminAuth.verifyIdToken(idToken);
		const sessionCookie = await adminAuth.createSessionCookie(idToken, { expiresIn });

		cookies.set('__session', sessionCookie, {
			httpOnly: true,
			secure: true,
			path: '/',
			maxAge: expiresIn
		});

		const userRef = adminDB.collection('users').doc(decodedToken.uid);
		const doc = await userRef.get();

		if (!doc.exists) {
			await userRef.set({
				uid: decodedToken.uid,
				email: decodedToken.email,
				name: decodedToken.name,
				photoURL: decodedToken.picture,
				created: FieldValue.serverTimestamp()
			});
		}

		return json({ success: true });
	} catch (err: any) {
		console.error('Session creation failed:', err);
		throw error(500, 'Internal Server Error');
	}
};

export const DELETE: RequestHandler = async ({ cookies }) => {
	cookies.delete('__session', { path: '/' });
	return json({ success: true });
};
