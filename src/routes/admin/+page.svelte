<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { ArrowUpRight, Settings } from 'lucide-svelte';

	let prompt = '';
	let level: number | null = null;
	let hint = '';
	let imageURLs = [''];
	let editingId: string | null = null;
	let answer = '';
	let showAnswers = false;

	let success = false;
	let error: string | null = null;
	let questions: {
		uid: string;
		prompt: string;
		level: number;
		hint?: string;
		images?: string[];
		answer?: string;
	}[] = [];

	let previewContainer: HTMLDivElement | null = null;
	let modal: HTMLDialogElement | null = null;

	const addImageField = () => imageURLs.push('');
	const removeImageField = (index: number) => imageURLs.splice(index, 1);

	async function fetchQuestions() {
		const res = await fetch('/api/admin/questions');
		const data = await res.json();
		questions = data.questions ?? [];
	}
	let teams: any[] = [];

	async function fetchTeams() {
		const res = await fetch('/api/admin/teams');
		const data = await res.json();
		teams = data.teams || [];
	}

	async function toggleTeamBan(teamId: string, banned: boolean) {
		const res = await fetch('/api/admin/toggle-team-ban', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ teamId, banned })
		});

		if (res.ok) {
			await fetchTeams();
		} else {
			alert('Failed to update team.');
		}
	}

	onMount(() => {
		fetchQuestions();
		fetchTeams();
	});

	function resetForm() {
		prompt = '';
		level = null;
		hint = '';
		answer = '';
		imageURLs = [''];
		editingId = null;
		success = false;
		error = null;
	}

	async function submit() {
		error = null;
		success = false;

		const res = await fetch(editingId ? '/api/admin/update-question' : '/api/admin/add-question', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				id: editingId,
				prompt,
				level: Number(level),
				hint,
				answer,
				images: imageURLs.filter((url) => url.trim() !== '')
			})
		});

		if (res.ok) {
			success = true;
			await fetchQuestions();
			modal?.close();
			resetForm();
		} else {
			const data = await res.json();
			error = data?.error ?? 'Unknown error';
		}
	}

	function convertMarkdownToHTML(text: string): string {
		return text.replace(
			/\[([^\]]+)]\(([^)]+)\)/g,
			'<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>'
		);
	}

	function editQuestion(q: any) {
		editingId = q.uid;
		prompt = q.prompt;
		level = q.level;
		hint = q.hint ?? '';
		answer = q.answer ?? '';
		imageURLs = q.images?.length ? [...q.images] : [''];
		success = false;
		error = null;
		modal?.showModal();
	}

	async function deleteQuestion(id: string) {
		if (!confirm('Are you sure you want to delete this question?')) return;
		const res = await fetch('/api/admin/delete-question', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ id })
		});
		if (res.ok) {
			await fetchQuestions();
			if (editingId === id) resetForm();
		} else {
			alert('Error deleting question.');
		}
	}
</script>

<svelte:head>
	<meta name="viewport" content="width=device-width, initial-scale=1" />
</svelte:head>

<title>Cipher Reforged - Admin Dashboard</title>
<nav
	class="fixed top-0 left-0 z-50 flex w-full items-center justify-between border-b border-white/10 bg-[#1e1e20]/70 px-4 py-2 shadow-md backdrop-blur"
>
	<div class="flex gap-3">
		<a class="btn btn-ghost text-md" class:text-primary={$page.url.pathname === '/'} href="/">
			<ArrowUpRight class="mr-1" /> Home
		</a>
		<a
			class="btn btn-ghost text-md flex items-center"
			class:text-primary={$page.url.pathname.startsWith('/admin')}
			href="/admin"
		>
			<Settings class="mr-1" /> Admin
		</a>
	</div>
</nav>

<div class="pt-[2.5rem]"></div>
<section class="mt-12 text-center">
	<h1
		class="bg-gradient-to-br from-[#8e8ee3] to-[#c58fef] bg-clip-text text-5xl font-bold text-transparent md:text-6xl"
	>
		Admin Dashboard
	</h1>
	<p class="mt-2 text-sm text-gray-400 sm:text-base">Manage players, teams, and questions</p>
</section>
<div class="mt-12 mb-6 border-b border-white/10 pb-2">
	<h2 class="flex items-center gap-2 text-2xl font-semibold text-white">All Teams & Players</h2>
</div>

{#if teams.length === 0}
	<p class="text-gray-400">No teams found in the database.</p>
{:else}
	<ul class="space-y-3">
		{#each teams as team}
			<li class="rounded border bg-zinc-800 p-4 text-white">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-lg font-semibold">
							{team.name ? `${team.name} (${team.id})` : team.id}
							{#if team.banned}
								<span class="ml-2 text-sm text-red-400">(Banned)</span>
							{/if}
							{#if team.id === 'organizers'}
								<div class="badge badge-success badge-outline">Boss</div>
							{:else if !team.gsv}
								<div class="badge badge-error badge-outline">Non-GSV</div>
							{/if}
						</p>
						<p class="text-sm text-gray-400">Team ID: {team.id}</p>
					</div>
					<button
						class={`rounded px-3 py-1 font-medium text-white transition ${
							team.banned ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'
						}`}
						on:click={() => toggleTeamBan(team.id, !team.banned)}
					>
						{team.banned ? 'Unban' : 'Ban'}
					</button>
				</div>
				<div class="mt-2">
					<p class="mb-1 text-sm text-gray-300">Members:</p>
					<ul class="list-disc pl-5 text-sm">
						{#each team.members as member}
							<li>{member}</li>
						{:else}
							<li class="text-gray-400 italic">No members listed</li>
						{/each}
					</ul>
				</div>
			</li>
		{/each}
	</ul>
{/if}

<div class="mt-10 flex items-center justify-between">
	<div class="mt-12 mb-6 border-b border-white/10 pb-2">
		<h2 class="flex items-center gap-2 text-2xl font-semibold text-white">Questions Panel</h2>
		<label class="flex items-center gap-2 text-sm text-gray-300">
			<input type="checkbox" bind:checked={showAnswers} />
			            Show Answers
		</label>
	</div>
	<button
		class="rounded bg-gradient-to-r from-indigo-600 to-indigo-600 px-4 py-2 text-white transition hover:brightness-110"
		on:click={() => {
			resetForm();
			modal?.showModal();
		}}
	>
		➕ Add New
	</button>
</div>
<ul class="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
	{#each questions as q}
		<li class="rounded border bg-white/5 p-4 text-white">
			<div>
				<p class="text-md font-medium">Level {q.level}</p>
				<div class="truncate text-sm text-gray-300">{q.prompt}</div>
				{#if showAnswers && q.answer}
					<div class="mt-1 text-xs text-green-400">Answer: <code>{q.answer}</code></div>
				{/if}
			</div>
			<div class="mt-2 flex gap-2">
				<button
					on:click={() => editQuestion(q)}
					class="text-blue-400 transition hover:text-blue-500"
				>
					Edit
				</button>
				<button
					on:click={() => deleteQuestion(q.uid)}
					class="text-red-500 transition hover:text-red-600"
				>
					Delete
				</button>
			</div>
		</li>
	{/each}
</ul>

<dialog bind:this={modal} class="modal">
	<div class="modal-box max-w-2xl border border-white/10 bg-[#1e1e20] text-white">
		<form method="dialog">
			<button class="btn btn-sm btn-circle btn-ghost absolute top-2 right-2">✕</button>
		</form>
		<h2 class="mb-4 text-xl font-semibold">{editingId ? '✏️ Edit Question' : '➕ Add Question'}</h2>
		<div class="space-y-4">
			<textarea
				bind:value={prompt}
				placeholder="Prompt (you can use [text](url) for links)"
				class="w-full rounded border p-2"
				rows="4"
			/>
			<input
				type="number"
				bind:value={level}
				placeholder="Level (numeric)"
				class="w-full rounded border p-2"
			/>
			<input
				type="text"
				bind:value={hint}
				placeholder="Hint (optional)"
				class="w-full rounded border p-2"
			/>
			<input
				type="text"
				bind:value={answer}
				placeholder="Correct Answer (will be lowercased)"
				class="w-full rounded border p-2"
			/>
			{#each imageURLs as url, i}
				<div class="flex items-start gap-4">
					<input
						type="text"
						bind:value={imageURLs[i]}
						placeholder="Image URL"
						class="w-full rounded border p-2"
					/>

					{#if url.trim() !== ''}
						<img src={url} alt="preview" class="h-20 rounded border object-cover" />
					{/if}

					{#if imageURLs.length > 1}
						<button
							on:click={() => removeImageField(i)}
							class="text-red-500 transition hover:text-red-600">❌</button
						>
					{/if}
				</div>
			{/each}
			<button on:click={addImageField} class="text-sm text-blue-400 underline"
				>+ Add another image</button
			>
			<h3 class="mt-4 mb-2 font-semibold">🔍 Preview</h3>
			<div class="rounded border bg-black/20 p-3 text-sm" bind:this={previewContainer}>
				{@html convertMarkdownToHTML(prompt)}
			</div>
			<div class="flex gap-4 pt-4">
				<button
					type="button"
					class="rounded bg-green-600 px-4 py-2 font-medium text-white transition hover:bg-green-700"
					on:click={submit}
				>
					{editingId ? 'Update' : 'Submit'}
				</button>
				<button
					type="button"
					class="rounded bg-zinc-600 px-4 py-2 font-medium text-white transition hover:bg-zinc-700"
					on:click={resetForm}
				>
					Reset
				</button>
			</div>

			{#if success}
				<p class="mt-2 text-sm text-green-500">✅ Saved successfully!</p>
			{:else if error}
				<p class="mt-2 text-sm text-red-500">⚠️ {error}</p>
			{/if}
		</div>
	</div>
</dialog>
