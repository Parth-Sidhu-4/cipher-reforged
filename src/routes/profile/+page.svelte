<script lang="ts">
	let displayName = '';
	let message = '';
	let loading = false;

	const updateName = async () => {
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

<input
	class="input input-bordered mb-2 w-full max-w-md"
	bind:value={displayName}
	placeholder="Enter your name"
/>

<button class="btn btn-primary" on:click={updateName} disabled={loading}>
	{loading ? 'Saving...' : 'Save'}
</button>

{#if message}
	<p class="mt-4 text-sm">{message}</p>
{/if}
