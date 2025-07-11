<script lang="ts">
	import { onMount } from 'svelte';
	import { getAuth, type User } from 'firebase/auth';
	import { app } from '$lib/utils/firebase';
	import { browser } from '$app/environment';

	let user: User | null = null;
	let displayName = '';
	let message = '';
	let loading = false;

	onMount(() => {
		if (!browser) return;

		const auth = getAuth(app);
		user = auth.currentUser;

		// Optional: preload display name
		if (user?.displayName) {
			displayName = user.displayName;
		}

		// Listen for auth changes (in case user signs in later)
		auth.onAuthStateChanged((u) => {
			user = u;
			if (u?.displayName) displayName = u.displayName;
		});
	});

	const updateName = async () => {
		if (!user) {
			message = '❌ You must be signed in to update your name.';
			return;
		}

		if (!displayName.trim()) {
			message = 'Name cannot be empty.';
			return;
		}

		loading = true;
		try {
			const res = await fetch('/api/profile/update', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ displayName })
			});

			const result = await res.json();
			message = res.ok ? '✅ Name updated!' : result.error || 'Failed to update.';
		} catch (err) {
			console.error(err);
			message = 'Something went wrong.';
		} finally {
			loading = false;
		}
	};
</script>

<h1 class="mb-4 text-2xl font-bold">Set Your Display Name</h1>

{#if user}
	<input
		class="input input-bordered mb-2 w-full max-w-md"
		bind:value={displayName}
		placeholder="Enter your name"
	/>

	<button class="btn btn-primary" on:click={updateName} disabled={loading}>
		{loading ? 'Saving...' : 'Save'}
	</button>
{:else}
	<p class="mb-4 font-medium text-red-500">⚠️ You must be signed in to set a display name.</p>
{/if}

{#if message}
	<p class="mt-4 text-sm">{message}</p>
{/if}
