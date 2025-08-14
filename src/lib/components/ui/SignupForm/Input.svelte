<script lang="ts">
	import { cn } from '$lib/utils/utils';
	import { useMotionTemplate, useMotionValue, Motion } from 'svelte-motion';
	import { createEventDispatcher } from 'svelte';

	export let className: string | undefined = undefined;
	export let type: string = 'text';

	// The actual bound value
	export let value: string = "";

	// Svelte dispatcher to forward events
	const dispatch = createEventDispatcher();

	let visible = false;
	let mouseX = useMotionValue(0);
	let mouseY = useMotionValue(0);

	function handleMouseMove({ currentTarget, clientX, clientY }: any) {
		let { left, top } = currentTarget.getBoundingClientRect();
		mouseX.set(clientX - left);
		mouseY.set(clientY - top);
	}

	function handleInput(e: Event) {
		value = (e.target as HTMLInputElement).value;
		dispatch('input', e); // forward event so bind:value works
	}
</script>

<Motion
	let:motion
	style={{
		background: visible
			? useMotionTemplate`
				radial-gradient(
					100px circle at ${mouseX}px ${mouseY}px,
					var(--blue-500),
					transparent 80%
				)`
			: useMotionTemplate`
				radial-gradient(
					0px circle at ${mouseX}px ${mouseY}px,
					var(--blue-500),
					transparent 80%
				)`
	}}
>
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		use:motion
		on:mousemove={handleMouseMove}
		on:mouseenter={() => (visible = true)}
		on:mouseleave={() => (visible = false)}
		class="group/input rounded-lg p-[2px] transition duration-300"
	>
		<input
			bind:value
			on:input={handleInput}
			{type}
			class={cn(
				`dark:placeholder-text-neutral-600 shadow-input flex h-10 w-full rounded-md border-none bg-gray-50 px-3 py-2 text-sm text-black transition duration-400 group-hover/input:shadow-none
				file:border-0 file:bg-transparent file:text-sm file:font-medium
				placeholder:text-neutral-400 focus-visible:ring-[2px] focus-visible:ring-neutral-400 focus-visible:outline-none
				disabled:cursor-not-allowed disabled:opacity-50
				dark:bg-zinc-800
				dark:text-white dark:shadow-[0px_0px_1px_1px_var(--neutral-700)] dark:focus-visible:ring-neutral-600`,
				className
			)}
			{...$$restProps}
		/>
	</div>
</Motion>
