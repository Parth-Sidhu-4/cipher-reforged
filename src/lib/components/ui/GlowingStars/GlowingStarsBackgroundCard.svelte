<script lang="ts">
	import { cn } from '$lib/utils/cn';
	import Illustration from './Illustration.svelte';

	export let className: string | undefined = undefined;
	export let bgColorclass: string;

	let mouseEnter = false;
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
	on:mouseenter={() => (mouseEnter = true)}
	on:mouseleave={() => (mouseEnter = false)}
	class={cn(
		'm-4 h-full max-h-[25rem] w-full max-w-[25vw] rounded-xl border border-[#eaeaea] bg-[linear-gradient(110deg,#333_0.6%,#222)] p-4 dark:border-neutral-600',
		className
	)}
>
	<div class="flex items-center justify-center">
		<Illustration {mouseEnter} glowColorClass={bgColorclass} />
	</div>
	<div class="px-2 pb-6"><slot /></div>
</div>
