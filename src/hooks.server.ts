import type { Handle } from '@sveltejs/kit';
import { adminAuth } from '$lib/firebase/admin';

export const handle: Handle = async ({ event, resolve }) => {
	const sessionCookie = event.cookies.get('__session');

	// Initialize user as null
	event.locals.user = null;

	if (sessionCookie) {
		try {
			// ✅ Verify the Firebase session cookie
			const decodedToken = await adminAuth.verifySessionCookie(sessionCookie, true);

			// ✅ Populate event.locals.user for use in load functions
			event.locals.user = {
				uid: decodedToken.uid,
				email: decodedToken.email ?? 'unknown@example.com',
				name: decodedToken.name ?? decodedToken.email ?? 'User'
			};
		} catch (err) {
			console.warn('Invalid or expired session cookie:', err);
			// Optionally clear the invalid session cookie
			event.cookies.delete('__session', { path: '/' });
		}
	}

	// ✅ Continue with resolving the request
	return resolve(event);
};
