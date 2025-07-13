<script lang="ts">
	import { ArrowLeft, ArrowRight, ArrowUpRight, CheckCircle, History } from 'lucide-svelte';
	import { Input } from '$lib/components/ui/SignupForm';
	import { sendSuccessToast, sendErrorToast } from '$lib/utils/toast_utils';
	import { tick } from 'svelte';

	let logsModal: HTMLDialogElement | null = null;
	let container: HTMLDivElement | null = null;

	type LogEntry = {
		questionId: string;
		entered: string;
		correct: boolean;
		timestamp: { seconds: number; nanoseconds: number } | string;
	};

	export let data: {
		blocked: boolean;
		user?: { uid: string };
		questions?: { uid: string; prompt: string; level: number; hint?: string; images?: string[] }[];
		completed?: string[];
		logs?: LogEntry[];
	};

	let current = 0;
	let answer = '';
	let loading = false;

	const questions = data.questions ?? [];
	let completed = data.completed ?? [];
	const logs = data.logs ?? [];

	$: if (current >= questions.length) current = questions.length - 1;
	$: currentQuestion = questions[current];
	$: isCompleted = currentQuestion ? completed.includes(currentQuestion.uid) : false;
	$: currentLogs = currentQuestion
		? logs.filter((log) => log.questionId === currentQuestion.uid).reverse()
		: [];

	$: {
		if (container && currentQuestion?.hint) {
			for (const node of Array.from(container.childNodes)) {
				if (node.nodeType === Node.COMMENT_NODE && node.nodeValue?.includes('hint:')) {
					container.removeChild(node);
				}
			}
			const commentNode = document.createComment(` hint: ${currentQuestion.hint} `);
			container.appendChild(commentNode);
		}
	}
	$: (async () => {
		if (container && currentQuestion?.prompt) {
			await tick(); // ensures DOM has rendered {@html}
			const links = container.querySelectorAll('a');
			links.forEach((link) => {
				link.style.color = '#60a5fa';
				link.style.textDecoration = 'underline';
				link.style.fontSize = '0.6em';
				link.target = '_blank';
				link.rel = 'noopener noreferrer';
			});
		}
	})();

	const submit = async () => {
		if (!currentQuestion) return;
		loading = true;

		try {
			const res = await fetch('/api/submit', {
				method: 'POST',
				body: JSON.stringify({
					answer,
					questionId: currentQuestion.uid,
					userId: data.user?.uid
				})
			});

			const result = await res.json();

			if (result.correct) {
				sendSuccessToast('Correct!', 'Well Done!');
				answer = '';
				if (!completed.includes(currentQuestion.uid)) {
					completed = [...completed, currentQuestion.uid];
				}
			} else {
				sendErrorToast('Wrong Answer', 'Give it another shot!');
			}
		} catch (e) {
			console.error(e);
			sendErrorToast('⚠️ Error', 'Error submitting answer.');
		}

		loading = false;
	};
	const handleKeydown = (e: KeyboardEvent) => {
		const key = e.key;

		const isLetter = /^[a-zA-Z]$/.test(key);
		const isControlKey = ['Backspace', 'ArrowLeft', 'ArrowRight', 'Delete', 'Tab'].includes(key);

		if (!isLetter && !isControlKey) {
			e.preventDefault();
		}
	};

	const handleInput = (e: Event) => {
		const target = e.target as HTMLInputElement;

		answer = target.value.toLowerCase().replace(/[^a-z]/g, '');
	};
</script>

<title>Cipher Reforged - Play</title>

{#if data.blocked || questions.length === 0}
	<div class="flex min-h-screen items-center justify-center">
		<p class="text-xl font-semibold text-red-600">🚫 You cannot view this right now.</p>
	</div>
{:else}
	<!-- ✅ Top NavBar (fixed, full width, transparent) -->
	<div
		class="fixed top-0 left-0 z-20 flex w-full items-center justify-between border-b border-white/10 bg-transparent px-6 py-2 backdrop-blur"
	>
		<div class="flex items-center gap-3">
			<a class="btn btn-ghost text-md" href="/"><ArrowUpRight class="mr-1" />Home</a>
			<button class="btn btn-square" on:click={() => current--} disabled={current === 0}>
				<ArrowLeft />
			</button>
			<span class="btn btn-ghost text-xl"> {currentQuestion.level}/{questions.length}</span>
			<button
				class="btn btn-square"
				on:click={() => current++}
				disabled={current >= questions.length - 1 || !isCompleted}
			>
				{#if !isCompleted}
					<History />
				{:else}
					<ArrowRight />
				{/if}
			</button>
		</div>
	</div>

	<!-- ✅ Main Content -->
	<center class="px-4 pt-24 pb-10">
		<!-- Prompt -->
		<div class="mb-4 max-w-3xl text-4xl" bind:this={container}>
			{@html currentQuestion.prompt}
		</div>

		<!-- Images -->
		{#if currentQuestion.images?.length}
			<p class="mt-4 mb-2 text-lg font-medium">Images</p>
			<div class="mb-4 flex flex-wrap justify-center gap-3">
				{#each currentQuestion.images as img}
					<img class="h-60 rounded-lg" src={img} alt="Level image" />
				{/each}
			</div>
		{/if}

		<!-- Answer Input -->
		{#if !isCompleted}
			<div class="mb-4 w-[min(90vw,450px)]">
				<Input
					id="answer"
					placeholder="Enter your answer..."
					type="text"
					onInput={handleInput}
					autocomplete="off"
				/>
			</div>

			<!-- Submit Button -->
			<button class="btn btn-wide btn-primary" on:click={submit} disabled={loading}>
				{#if loading}
					<span class="loading loading-ring text-white"></span>
				{:else}
					Submit
				{/if}
			</button>

			<!-- Logs Button BELOW Submit with spacing -->
			<div class="mt-6">
				<button
					class="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-white shadow-md backdrop-blur-md transition-all hover:bg-white/10 hover:text-purple-300 hover:shadow-purple-500/20"
					on:click={() => logsModal?.showModal()}
				>
					<History />
				</button>
			</div>
		{:else}
			<!-- Completed Message -->
			<div class="flex flex-col items-center justify-center gap-4 sm:flex-row">
				<button class="btn btn-success" disabled>
					<CheckCircle class="mr-2" />
				</button>

				{#if current < questions.length - 1}
					<button class="btn btn-outline" on:click={() => current++}>
						<ArrowRight class="ml-2" />
					</button>
				{/if}
			</div>

			<!-- Logs Button even after completion -->
			<div class="mt-6">
				<button
					class="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-white shadow-md backdrop-blur-md transition-all hover:bg-white/10 hover:text-purple-300 hover:shadow-purple-500/20"
					on:click={() => logsModal?.showModal()}
				>
					<History />
				</button>
			</div>
		{/if}
	</center>

	<!-- Logs Modal -->
	<dialog id="logsModal" class="modal" bind:this={logsModal}>
		<div class="modal-box border border-white/10 bg-[#1e1e20] text-white">
			<form method="dialog">
				<button class="btn btn-sm btn-circle btn-ghost absolute top-2 right-2">✕</button>
			</form>

			<h3 class="mb-4 text-lg font-bold">Previous Attempts</h3>

			{#if currentLogs.length > 0}
				<ul class="mt-2 max-w-md space-y-1">
					{#each currentLogs as log}
						<li class="flex items-center gap-2 text-sm">
							<span class={log.correct ? 'text-green-600' : 'text-red-500'}>
								{log.correct ? '✅' : '❌'}
							</span>
							<code
								class="rounded bg-gray-100 px-2 py-1 text-black dark:bg-gray-800 dark:text-white"
							>
								{log.entered}
							</code>
						</li>
					{/each}
				</ul>
			{:else}
				<p class="text-sm text-gray-400">No attempts yet.</p>
			{/if}
		</div>
	</dialog>
{/if}
