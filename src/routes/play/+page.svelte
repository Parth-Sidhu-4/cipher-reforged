<script lang="ts">
	type LogEntry = {
		questionId: string;
		entered: string;
		correct: boolean;
		timestamp: { seconds: number; nanoseconds: number } | string;
	};

	export let data: {
		user: { uid: string };
		questions: { uid: string; prompt: string; level: number; hint?: string }[];
		completed: string[];
		logs: LogEntry[];
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

	// Inject HTML comment with hint (invisible to user, visible in Inspect)
	$: {
		if (container && questions[current]?.hint) {
			// Remove all previous hint comments
			for (const node of Array.from(container.childNodes)) {
				if (node.nodeType === Node.COMMENT_NODE && node.nodeValue?.includes('hint:')) {
					container.removeChild(node);
				}
			}

			// Add new hint comment
			const hintText = ` hint: ${questions[current].hint} `;
			const commentNode = document.createComment(hintText);
			container.appendChild(commentNode);
		}
	}

	const submit = async () => {
		if (!questions[current]) return;

		loading = true;

		const res = await fetch('/api/submit', {
			method: 'POST',
			body: JSON.stringify({
				answer,
				questionId: questions[current].uid,
				userId: data.user.uid
			})
		});

		const result = await res.json();

		if (result.correct) {
			alert('Correct!');
			answer = '';

			if (!completed.includes(questions[current].uid)) {
				completed = [...completed, questions[current].uid]; // ✅ triggers reactivity
			}

			if (current < questions.length - 1) {
				current++;
			}
		} else {
			alert('Wrong. Try again!');
		}

		loading = false;
	};

	const handleInput = (e: Event) => {
		const target = e.target as HTMLInputElement;
		answer = target.value.toLowerCase().replace(/[^a-z0-9]/g, '');
	};
</script>

{#if questions.length === 0}
	<p class="mt-8 text-center text-gray-500">⚠️ No questions available.</p>
{:else}
	<h1 class="mb-2 text-2xl font-bold">
		Level {questions[current].level}
	</h1>

	<!-- Question prompt rendered here -->
	<div class="mb-4" bind:this={container}>
		{@html questions[current].prompt}
	</div>

	<input
		placeholder="your answer..."
		class="input input-bordered mb-2 w-full max-w-md"
		bind:value={answer}
		on:input={handleInput}
		disabled={isCompleted}
	/>

	<button on:click={submit} class="btn btn-primary" disabled={loading || isCompleted}>
		{loading ? 'Checking...' : isCompleted ? 'Completed ✅' : 'Submit'}
	</button>

	{#if isCompleted && current < questions.length - 1}
		<button on:click={() => current++} class="btn btn-outline mt-4"> Next Level → </button>
	{/if}

	{#if currentLogs.length > 0}
		<h2 class="mt-6 text-lg font-semibold">Previous Attempts</h2>
		<ul class="mt-2 max-w-md space-y-1">
			{#each currentLogs as log}
				<li class="flex items-center gap-2 text-sm">
					<span class={log.correct ? 'text-green-600' : 'text-red-500'}>
						{log.correct ? '✅' : '❌'}
					</span>
					<code class="rounded bg-gray-100 px-2 py-1 dark:bg-gray-800">
						{log.entered}
					</code>
					<span class="text-xs text-gray-400">
						{#if typeof log.timestamp === 'string'}
							({new Date(log.timestamp).toLocaleString()})
						{:else}
							(Unknown time)
						{/if}
					</span>
				</li>
			{/each}
		</ul>
	{/if}
{/if}
