<script lang="ts">
	let teamName = '';
	let message = '';
	let success = false;
	let code = '';
	let loading = false;

	async function createTeam() {
		message = '';
		success = false;
		code = '';

		if (!teamName.trim()) {
			message = 'Please enter a team name.';
			return;
		}

		loading = true;

		try {
			const res = await fetch('/api/team/create', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ teamName })
			});

			const result = await res.json();

			if (res.ok) {
				success = true;
				code = result.code;
				message = `✅ Team "${result.teamName}" created successfully!`;
			} else {
				message = result.error || 'Something went wrong.';
			}
		} catch (err) {
			message = 'Failed to connect to server.';
			console.error(err);
		} finally {
			loading = false;
		}
	}

	function goToPlay() {
		window.location.href = '/play';
	}
</script>

<h1 class="mb-4 text-2xl font-bold">Create a Team</h1>

<input
	bind:value={teamName}
	placeholder="Team name"
	class="input input-bordered mb-4 w-full max-w-md"
/>

<button class="btn btn-primary" on:click={createTeam} disabled={loading}>
	{loading ? 'Creating...' : 'Create Team'}
</button>

{#if message}
	<p class="mt-4 text-sm {success ? 'text-green-600' : 'text-red-500'}">
		{message}
	</p>
{/if}

{#if code}
	<p class="mt-2 text-sm">📋 Share this code with your teammates: <strong>{code}</strong></p>
	<button class="btn btn-success mt-4" on:click={goToPlay}>Let’s Play</button>
{/if}
