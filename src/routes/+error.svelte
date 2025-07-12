<script lang="ts">
	export let error: unknown;
	export let status: number;

	let reason: string | null = null;

	if (typeof error === 'string') {
		reason = error;
	} else if (
		typeof error === 'object' &&
		error !== null &&
		'message' in error &&
		typeof (error as any).message === 'string'
	) {
		reason = (error as any).message;
	}

	console.log('[ERROR]', { error, status, reason });
</script>

<title>Error!</title>
{#if status === 987 && reason === 'banned'}
	<div class="flex min-h-screen flex-col items-center justify-center p-4 text-center">
		<h1 class="mb-4 text-4xl font-bold text-red-600">🚫 Banned</h1>
		<p class="mb-2 text-lg text-gray-700">
			You or your team has been banned from participating in Cipher Reforged.
		</p>
		<p class="text-gray-500">If you believe this is a mistake, please contact the organizers.</p>
	</div>
{:else}
	<div class="flex min-h-screen flex-col items-center justify-center p-4 text-center">
		<h1 class="mb-4 text-4xl font-bold text-red-600">🚫 Something Went Wrong</h1>
		<p class="mb-2 text-lg text-gray-700">An unexpected error occurred.</p>
		<p class="text-gray-500">If you believe this is a mistake, please contact the organizers.</p>
	</div>
{/if}
