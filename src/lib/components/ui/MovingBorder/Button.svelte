<script lang="ts">
	import { cn } from '$lib/utils/utils';
	import MovingBorder from './MovingBorder.svelte';

	export let borderRadius: string | undefined = '1.75rem';
	export let containerClassName: string | undefined = undefined;
	export let borderClassName: string | undefined = undefined;
	export let duration: number | undefined = 2000;
	export let className: string | undefined = undefined;
</script>

<button
	on:click
	{...$$restProps}
	class={cn(
		'relative h-16 w-40  overflow-hidden bg-transparent p-[1px] text-xl ',
		containerClassName
	)}
	style={`border-radius: ${borderRadius};`}
	{...$$props}
>
	<div class="absolute inset-0" style={`border-radius: calc(${borderRadius} * 0.96);`}>
		<MovingBorder {duration} rx="30%" ry="30%">
			<!-- svelte-ignore element_invalid_self_closing_tag -->
			<div
				class={cn(
					'h-20 w-20 bg-[radial-gradient(#605DFF_40%,transparent_60%)] opacity-[0.8]',
					borderClassName
				)}
			/>
		</MovingBorder>
	</div>

	<div
		class={cn(
			'relative flex h-full w-full items-center justify-center border border-slate-800 bg-slate-900/[0.8] text-sm text-white antialiased backdrop-blur-xl',
			className
		)}
		style={`border-radius: calc(${borderRadius} * 0.96);`}
	>
		<slot />
	</div>
</button>
