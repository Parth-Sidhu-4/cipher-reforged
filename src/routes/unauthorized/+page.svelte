<script lang="ts">
	import Button from '$lib/components/ui/MovingBorder/Button.svelte';
	import { goto } from '$app/navigation';
</script>

<title>Unauthorized</title>
<div class="flex min-h-screen flex-col items-center justify-center text-white">
	<div class="text-center backdrop-blur-sm">
		<h1 class="mb-3 text-5xl font-bold text-red-500">Unauthorized Access</h1>
		<p class="mb-6 text-lg text-gray-300">It seems you've wandered off the designated path.</p>
		<p class="text-md mb-8 max-w-prose text-gray-400">
			You don't have the necessary credentials to view this content. If you believe this is an
			error, please ensure you are logged in with the correct account.
		</p>
		<Button
			on:click={() => goto('/')}
			borderRadius="0.75rem"
			className="cursor-pointer border-slate-800 hover: text-base font-bold text-white shadow-md inline-flex items-center"
		>
			Return to Safety
		</Button>
	</div>
</div>

<style>
	@keyframes bounce {
		0%,
		100% {
			transform: translateY(0);
		}
		50% {
			transform: translateY(-10px);
		}
	}
</style>
