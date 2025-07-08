<script lang="ts">
	let teamName = '';
	let teamCode = '';
	let message = '';
	let success = false;
	let loading = false;

	async function createTeam() {
		message = '';
		success = false;

		if (!teamName.trim()) {
			message = 'Please enter a team name.';
			return;
		}

		loading = true;

		try {
			const res = await fetch('/api/team/create', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ teamName })
			});
			const result = await res.json();

			if (res.ok) {
				success = true;
				message = `✅ Team "${result.teamName}" created! Code: ${result.code}`;
				setTimeout(() => (window.location.href = '/play'), 1000);
			} else {
				message = result.error || 'Something went wrong.';
			}
		} catch (err) {
			message = 'Failed to connect to server.';
		} finally {
			loading = false;
		}
	}

	async function joinTeam() {
		message = '';
		success = false;

		if (!teamCode.trim()) {
			message = 'Please enter a team code.';
			return;
		}

		loading = true;

		try {
			const res = await fetch('/api/team/join', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ code: teamCode })
			});
			const result = await res.json();

			if (res.ok) {
				success = true;
				message = `✅ Joined team "${result.teamName}" successfully!`;
				setTimeout(() => (window.location.href = '/play'), 1000);
			} else {
				message = result.error || 'Unable to join team.';
			}
		} catch (err) {
			message = 'Failed to connect to server.';
		} finally {
			loading = false;
		}
	}
</script>

<h1 class="mb-4 text-2xl font-bold">Team Setup</h1>

<h2 class="mt-4 font-semibold">Create a Team</h2>
<input
	bind:value={teamName}
	placeholder="Team name"
	class="input input-bordered mb-2 w-full max-w-md"
/>
<button on:click={createTeam} class="btn btn-primary mb-4" disabled={loading}>
	{loading ? 'Creating...' : 'Create Team'}
</button>

<h2 class="mt-4 font-semibold">Join a Team</h2>
<input
	bind:value={teamCode}
	placeholder="Enter team code"
	class="input input-bordered mb-2 w-full max-w-md"
/>
<button on:click={joinTeam} class="btn btn-secondary" disabled={loading}>
	{loading ? 'Joining...' : 'Join Team'}
</button>

{#if message}
	<p class="mt-4 text-sm {success ? 'text-green-600' : 'text-red-500'}">{message}</p>
{/if}
