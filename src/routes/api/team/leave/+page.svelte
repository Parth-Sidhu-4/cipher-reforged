<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { auth } from '$lib/firebase/client';
	import { goto } from '$app/navigation';

	let hasTeam = false;
	let message = '';
	let success = false;
	let loading = false;

	onMount(async () => {
		const res = await fetch('/auth/status');
		const status = await res.json();
		hasTeam = status.user?.hasTeam ?? false;
	});

	async function leaveTeam() {
		message = '';
		success = false;
		loading = true;

		try {
			const user = auth.currentUser;
			if (!user) throw new Error('User not logged in');

			const res = await fetch('/api/team/leave', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ user: { uid: user.uid } })
			});

			const result = await res.json();
			if (res.ok) {
				hasTeam = false;
				message = 'You have successfully left your team.';
				success = true;

				// ✅ Redirect after short delay (optional)
				setTimeout(() => {
					goto('/');
				}, 1200);
			} else {
				message = result.error || 'Unable to leave team.';
				success = false;
			}
		} catch (err) {
			message = 'An error occurred while leaving the team.';
			success = false;
		} finally {
			loading = false;
		}
	}
</script>

<h1 class="mb-4 text-2xl font-bold">Team Settings</h1>

{#if hasTeam}
	<button
		on:click={leaveTeam}
		disabled={loading}
		class="rounded-lg bg-yellow-500 px-6 py-2 font-semibold text-black hover:brightness-110"
	>
		{loading ? 'Leaving...' : 'Leave Team'}
	</button>
{/if}

{#if message}
	<p
		class="mx-auto mt-4 w-fit rounded-md px-4 py-2 text-center text-base font-semibold
			{success ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}"
	>
		{message}
	</p>
{/if}
