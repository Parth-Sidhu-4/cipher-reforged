<script lang="ts">
	import { ArrowLeft, ArrowRight, CheckCircle } from 'lucide-svelte';

	let teamName = '';
	let teamCode = '';
	let message = '';
	let success = false;
	let loading = false;

	let mode: 'idle' | 'create' | 'join' = 'idle';

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
				message = `Team "${result.teamName}" created! Code: ${result.code}`;
				setTimeout(() => {
					window.location.href = '/team/info';
				}, 1200);
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
				message = `Joined team "${result.teamName}" successfully!`;
				setTimeout(() => {
					window.location.href = '/team/info';
				}, 1200);
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

<title>Cipher Reforged - Get a Team</title>
<!-- Centered Wrapper -->
<div class="flex min-h-screen flex-col items-center justify-center px-4 text-center text-white">
	<!-- Heading -->
	<h1 class="mb-6 text-3xl font-bold">Team Setup</h1>

	<!-- Idle mode: Just two options -->
	{#if mode === 'idle'}
		<div class="flex flex-col items-center gap-4 md:flex-row md:justify-center">
			<button class="btn btn-primary w-48" on:click={() => (mode = 'create')}>Create a Team</button>
			<button class="btn btn-secondary w-48" on:click={() => (mode = 'join')}>Join a Team</button>
		</div>
	{/if}

	<!-- Create Team Form -->
	{#if mode === 'create'}
		<div class="mt-6 flex flex-col items-center gap-4">
			<input
				bind:value={teamName}
				placeholder="Enter team name"
				class="input input-dark input-bordered w-full max-w-sm"
			/>

			<button class="btn btn-primary w-full max-w-sm" on:click={createTeam} disabled={loading}>
				{loading ? 'Creating...' : 'Create Team'}
			</button>

			<button class="btn btn-ghost text-sm" on:click={() => (mode = 'idle')}>
				<ArrowLeft class="mr-1 inline h-4 w-4" /> Go Back
			</button>
		</div>
	{/if}

	<!-- Join Team Form -->
	{#if mode === 'join'}
		<div class="mt-6 flex flex-col items-center gap-4">
			<input
				bind:value={teamCode}
				placeholder="Enter team code"
				class="input input-dark input-bordered w-full max-w-sm"
			/>

			<button class="btn btn-secondary w-full max-w-sm" on:click={joinTeam} disabled={loading}>
				{loading ? 'Joining...' : 'Join Team'}
			</button>

			<button class="btn btn-ghost text-sm" on:click={() => (mode = 'idle')}>
				<ArrowLeft class="mr-1 inline h-4 w-4" /> Go Back
			</button>
		</div>
	{/if}
</div>

<!-- Message Toast -->
{#if message}
	<div
		class={`fixed top-6 left-1/2 z-50 w-[90vw] max-w-md -translate-x-1/2 transform rounded-xl px-6 py-4 text-sm shadow-lg transition-all duration-300 ${
			success
				? 'border border-indigo-300 bg-gradient-to-br from-indigo-700 to-violet-600 text-white'
				: 'border border-red-300 bg-gradient-to-br from-rose-800 to-red-600 text-white'
		}`}
	>
		<div class="flex items-center gap-3 font-semibold">
			{#if success}
				<CheckCircle class="h-5 w-5 text-yellow-300" />
			{:else}
				<ArrowRight class="h-5 w-5 text-yellow-300" />
			{/if}
			<span>{message}</span>
		</div>
	</div>
{/if}
