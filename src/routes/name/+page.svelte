<script lang="ts">
	let displayName = '';
	let error = '';
	let success = false;

	async function setName() {
		if (!displayName.trim()) {
			error = 'Name cannot be empty';
			return;
		}

		const res = await fetch('/api/user/set-name', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ displayName })
		});

		const result = await res.json();
		if (res.ok) {
			success = true;
			window.location.href = '/team';
		} else {
			error = result.error || 'Something went wrong.';
		}
	}
</script>

<h1 class="mb-4 text-xl font-bold">Choose your Display Name</h1>
<input
	bind:value={displayName}
	class="input input-dark input-bordered mb-4"
	placeholder="Your name"
/>
<button on:click={setName} class="btn btn-primary">Submit</button>
{#if error}<p class="text-red-500">{error}</p>{/if}
