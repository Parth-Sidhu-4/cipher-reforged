<script lang="ts">
	let targetDate = new Date(2025, 6, 12, 16, 55); // July is month 6 (0-indexed)
	let timeLeft = '';
	let interval: NodeJS.Timeout;

	function updateCountdown() {
		const now = new Date();
		const diff = targetDate.getTime() - now.getTime();

		if (diff <= 0) {
			clearInterval(interval);
			timeLeft = 'Testing Mode';
			return;
		}

		const days = Math.floor(diff / (1000 * 60 * 60 * 24));
		const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
		const minutes = Math.floor((diff / (1000 * 60)) % 60);
		const seconds = Math.floor((diff / 1000) % 60);

		timeLeft = `${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds`;
	}

	// Start interval on mount
	import { onMount } from 'svelte';
	onMount(() => {
		updateCountdown();
		interval = setInterval(updateCountdown, 1000);
		return () => clearInterval(interval);
	});
</script>

{#if timeLeft}
	<p
		class="mb-2 text-center text-sm font-medium tracking-wide text-indigo-300 opacity-60 md:text-base"
	>
		{timeLeft}
	</p>
{/if}
