<script lang="ts">
	import toast from 'svelte-5-french-toast';
	import { ArrowRight, CheckCircle, CircleX, List, Lock } from 'lucide-svelte';
	let logsModal: HTMLDialogElement | null = null;
	type LogEntry = {
		questionId: string;
		entered: string;
		correct: boolean;
		timestamp: { seconds: number; nanoseconds: number } | string;
	};

	export let data: {
		blocked: boolean;
		user?: { uid: string };
		questions?: { uid: string; prompt: string; level: number; hint?: string }[];
		completed?: string[];
		logs?: LogEntry[];
	};

	let current = 0;
	let answer = '';
	let loading = false;
	let container: HTMLDivElement | null = null;

	const questions = data.questions ?? [];
	let completed = data.completed ?? [];
	const logs = data.logs ?? [];

	$: if (current >= questions.length) current = questions.length - 1;
	$: isCompleted = questions[current] ? completed.includes(questions[current].uid) : false;
	$: currentLogs = questions[current]
		? logs.filter((log) => log.questionId === questions[current].uid).reverse()
		: [];

	// Inject comment with hint
	$: {
		if (container && questions[current]?.hint) {
			for (const node of Array.from(container.childNodes)) {
				if (node.nodeType === Node.COMMENT_NODE && node.nodeValue?.includes('hint:')) {
					container.removeChild(node);
				}
			}
			const commentNode = document.createComment(` hint: ${questions[current].hint} `);
			container.appendChild(commentNode);
		}
	}

	const submit = async () => {
		if (!questions[current]) return;
		loading = true;
		try {
			const res = await fetch('/api/submit', {
				method: 'POST',
				body: JSON.stringify({
					answer,
					questionId: questions[current].uid,
					userId: data.user?.uid
				})
			});
			const result = await res.json();

			if (result.correct) {
				toast.success('✅ Correct!');
				answer = '';
				if (!completed.includes(questions[current].uid)) {
					completed = [...completed, questions[current].uid];
				}
			} else {
				toast.error('❌ Wrong. Try again.');
			}
		} catch {
			toast.error('⚠️ Error submitting answer.');
		}
		loading = false;
	};

	const handleInput = (e: Event) => {
		const target = e.target as HTMLInputElement;
		answer = target.value.toLowerCase().replace(/[^a-z0-9]/g, '');
	};
</script>

<title>Cipher Reforged - Play</title>

{#if data.blocked}
	<div class="flex min-h-screen items-center justify-center">
		<p class="text-xl font-semibold text-red-600">🚫 You cannot view this right now.</p>
	</div>
{:else if questions.length === 0}
	<div class="flex min-h-screen items-center justify-center">
		<p class="text-gray-500">⚠️ No questions available.</p>
	</div>
{:else}
	<div class="flex min-h-screen flex-col items-center justify-center space-y-6 p-6 text-center">
		<h1 class="text-4xl font-bold">Level {questions[current].level}</h1>

		<!-- Question prompt -->
		<div class="prose dark:prose-invert max-w-2xl" bind:this={container}>
			{@html questions[current].prompt}
		</div>

		<!-- Input -->
		<input
			type="text"
			placeholder="Enter your answer..."
			class="input input-bordered input-lg w-full max-w-md"
			bind:value={answer}
			on:input={handleInput}
			disabled={isCompleted}
		/>

		<!-- Submit -->
		{#if !isCompleted}
			<button on:click={submit} class="btn btn-wide btn-primary" disabled={loading}>
				{#if loading}
					<span class="loading loading-ring text-white"></span>
				{:else}
					Submit
				{/if}
			</button>
		{:else}
			<button class="btn btn-wide btn-success" disabled>
				<CheckCircle class="mr-2" size={20} />
			</button>

			{#if current < questions.length - 1}
				<button class="btn btn-wide btn-outline" on:click={() => current++}>
					Next Level <ArrowRight class="ml-2" />
				</button>
			{/if}
		{/if}

		<!-- Logs -->
		<!-- Logs Button -->
		<button class="btn btn-outline mt-6" on:click={() => logsModal?.showModal()}>
			View Previous Attempts
		</button>

		<!-- Logs Modal -->
		<dialog id="logsModal" class="modal" bind:this={logsModal}>
			<div class="modal-box border border-white/10 bg-[#1e1e20] text-white">
				<form method="dialog">
					<button class="btn btn-sm btn-circle btn-ghost absolute top-2 right-2" aria-label="Close">
						✕
					</button>
				</form>

				<h3 class="mb-4 text-lg font-bold">Previous Attempts</h3>

				{#if currentLogs.length === 0}
					<p class="text-sm text-gray-400">No attempts yet.</p>
				{:else}
					{#each currentLogs as log}
						<button class="btn btn-ghost mb-1 w-full justify-start">
							{#if log.correct}
								<CheckCircle class="text-green-500" />
							{:else}
								<CircleX class="text-red-500" />
							{/if}
							<span class="ml-2">{log.entered}</span>
						</button>
					{/each}
				{/if}
			</div>
		</dialog>
	</div>
{/if}
