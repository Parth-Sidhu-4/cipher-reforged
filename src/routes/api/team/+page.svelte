<script lang="ts">
	let code = '';
	let message = '';
	let teamName = '';
	let success = false;
	let loading = false;

	async function joinTeam() {
		message = '';
		success = false;
		teamName = '';
		loading = true;

		if (!code.trim()) {
			message = 'Please enter a valid team code.';
			loading = false;
			return;
		}

		try {
			const res = await fetch('/api/team/join', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ code })
			});

			const result = await res.json();

			if (res.ok) {
				success = true;
				teamName = result.teamName;
				message = `✅ Successfully joined team "${teamName}"!`;
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

<h1 class="mb-4 text-2xl font-bold">Join a Team</h1>

<input
	bind:value={code}
	placeholder="Enter team code"
	class="input input-bordered mb-4 w-full max-w-md"
/>

<button class="btn btn-primary" on:click={joinTeam} disabled={loading}>
	{loading ? 'Joining...' : 'Join Team'}
</button>

{#if message}
	<p class="mt-4 text-sm {success ? 'text-green-600' : 'text-red-500'}">
		{message}
	</p>
{/if}

{#if success}
	<button class="btn btn-success mt-4" on:click={goToPlay}>Let’s Play</button>
{/if}
