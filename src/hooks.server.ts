import type { Handle } from '@sveltejs/kit';
import { adminAuth } from '$lib/firebase/admin';

export const handle: Handle = async ({ event, resolve }) => {
	const session = event.cookies.get('__session');

	if (session) {
		try {
			const decoded = await adminAuth.verifySessionCookie(session, true);
			event.locals.user = {
				uid: decoded.uid,
				email: decoded.email ?? 'unknown@example.com',
				name: decoded.name ?? decoded.email ?? 'User'
			};
		} catch (e) {
			event.locals.user = null;
		}
	} else {
		event.locals.user = null;
	}

	return resolve(event);
};
