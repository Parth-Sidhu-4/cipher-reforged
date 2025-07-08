<script lang="ts">
	import { auth } from '$lib/firebase/client';
	import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

	const loginWithGoogle = async () => {
		try {
			const provider = new GoogleAuthProvider();
			const result = await signInWithPopup(auth, provider);
			const idToken = await result.user.getIdToken();

			// Set session
			const res = await fetch('/api/session', {
				method: 'POST',
				body: JSON.stringify({ idToken }),
				headers: {
					'Content-Type': 'application/json'
				}
			});

			if (res.ok) {
				// 🔥 Check if user has a team
				const statusRes = await fetch('/auth/status');
				const status = await statusRes.json();

				if (!status.user) {
					window.location.href = '/auth'; // fallback
				} else if (status.user.hasTeam) {
					window.location.href = '/play';
				} else {
					window.location.href = '/team';
				}
			}
		} catch (err) {
			console.error('Login failed:', err);
		}
	};
</script>

<button on:click={loginWithGoogle} class="btn btn-primary">Sign in with Google</button>
