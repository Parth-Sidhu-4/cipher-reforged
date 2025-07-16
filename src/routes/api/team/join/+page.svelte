<script lang="ts">
	let code = '';
	let message = '';
	let success = false;
	let teamName = '';
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
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ code })
			});

			const result = await res.json();

			if (res.ok) {
				success = true;
				teamName = result.teamName;
				message = `✅ Joined team: ${teamName}`;
			} else {
				message = result.error || 'Failed to join team.';
			}
		} catch (err) {
			message = 'Failed to connect to server.';
			console.error(err);
		} finally {
			loading = false;
		}
	}

	const goToPlay = () => {
		window.location.href = '/play';
	};
</script>

<h1 class="mb-4 text-2xl font-bold">Join a Team</h1>

{#if !success}
	<input
		bind:value={code}
		placeholder="Enter team code"
		class="input input-dark input-bordered mb-4 w-full max-w-md uppercase"
	/>

	<button class="btn btn-primary" on:click={joinTeam} disabled={loading}>
		{loading ? 'Joining...' : 'Join'}
	</button>
{:else}
	<p class="mb-4 text-green-600">{message}</p>
	<button class="btn btn-success" on:click={goToPlay}>Let’s Play!</button>
{/if}

{#if message && !success}
	<p class="mt-4 text-sm text-red-500">{message}</p>
{/if}
