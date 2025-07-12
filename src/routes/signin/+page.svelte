<script lang="ts">
	import { auth } from '$lib/firebase/client';
	import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

	const loginWithGoogle = async () => {
		try {
			const provider = new GoogleAuthProvider();
			const result = await signInWithPopup(auth, provider);
			const idToken = await result.user.getIdToken();

			await fetch('/api/session', {
				method: 'POST',
				body: JSON.stringify({ idToken }),
				headers: { 'Content-Type': 'application/json' }
			});

			window.location.href = '/team'; // Let /team redirect to /play if already in team
		} catch (err) {
			console.error('Login failed:', err);
		}
	};
</script>

<title>Cipher Reforged - Sign In</title>

<h1 class="mb-4 text-2xl font-semibold">Sign in</h1>
<button class="btn btn-primary" on:click={loginWithGoogle}>Sign in with Google</button>
