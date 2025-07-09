<script lang="ts">
	export let error;
	export let status;

	let reason: string | null = null;

	try {
		// If it's a stringified error like 'banned'
		if (typeof error?.message === 'string') {
			reason = error.message;
		}
	} catch (e) {
		reason = null;
	}
</script>

{#if status === 403 && reason === 'banned'}
	<div class="flex min-h-screen flex-col items-center justify-center p-4 text-center">
		<h1 class="mb-4 text-4xl font-bold text-red-600">🚫 Banned</h1>
		<p class="mb-2 text-lg text-gray-700">
			You or your team has been banned from participating in Cipher Reforged.
		</p>
		<p class="text-gray-500">If you believe this is a mistake, please contact the organizers.</p>
	</div>
{:else}
	<div class="flex min-h-screen flex-col items-center justify-center p-4 text-center">
		<h1 class="mb-4 text-4xl font-bold text-red-600">🚫 Banned</h1>
		<p class="mb-2 text-lg text-gray-700">
			You or your team has been banned from participating in Cipher Reforged.
		</p>
		<p class="text-gray-500">If you believe this is a mistake, please contact the organizers.</p>
	</div>
{/if}
