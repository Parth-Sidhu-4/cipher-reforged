<script lang="ts">
	import { cn } from '$lib/utils/cn';
	import { Motion } from 'svelte-motion';

	export let className: string | undefined = undefined;
</script>

<div
	class={cn(
		'relative z-0 flex min-h-screen w-full flex-col items-center justify-center overflow-hidden rounded-md bg-slate-950',
		className
	)}
>
	<div class="relative isolate z-0 flex w-full flex-1 scale-y-125 items-center justify-center">
		<Motion
			let:motion
			initial={{ opacity: 0.5, width: '15rem' }}
			animate={{ opacity: 1, width: '30rem' }}
			transition={{
				delay: 0.3,
				duration: 0.8,
				ease: 'easeInOut'
			}}
			style={{
				backgroundImage: `conic-gradient(var(--conic-position), var(--tw-gradient-stops))`
			}}
		>
			<div
				use:motion
				class="bg-gradient-conic from-primary absolute inset-auto right-1/2 h-56 w-[30rem] overflow-visible via-transparent to-transparent text-white [--conic-position:from_70deg_at_center_top]"
			>
				<div
					class="absolute bottom-0 left-0 z-20 h-40 w-full bg-slate-950 [mask-image:linear-gradient(to_top,white,transparent)]"
				></div>
				<div
					class="absolute bottom-0 left-0 z-20 h-full w-40 bg-slate-950 [mask-image:linear-gradient(to_right,white,transparent)]"
				></div>
			</div>
		</Motion>
		<Motion
			let:motion
			initial={{ opacity: 0.5, width: '15rem' }}
			animate={{ opacity: 1, width: '30rem' }}
			transition={{
				delay: 0.3,
				duration: 0.8,
				ease: 'easeInOut'
			}}
			style={{
				backgroundImage: `conic-gradient(var(--conic-position), var(--tw-gradient-stops))`
			}}
		>
			<div
				use:motion
				style="background-image: conic-gradient(var(--conic-position), var(--tw-gradient-stops));"
				class="bg-gradient-conic to-primary absolute inset-auto left-1/2 h-56 w-[30rem] from-transparent via-transparent text-white [--conic-position:from_290deg_at_center_top]"
			>
				<div
					class="absolute right-0 bottom-0 z-20 h-full w-40 bg-slate-950 [mask-image:linear-gradient(to_left,white,transparent)]"
				></div>
				<div
					class="absolute right-0 bottom-0 z-20 h-40 w-full bg-slate-950 [mask-image:linear-gradient(to_top,white,transparent)]"
				></div>
			</div>
		</Motion>
		<div
			class="absolute top-1/2 h-48 w-full translate-y-12 scale-x-150 bg-slate-950 blur-2xl"
		></div>
		<div class="absolute top-1/2 z-50 h-48 w-full bg-transparent opacity-10 backdrop-blur-md"></div>
		<div
			class="bg-primary absolute inset-auto z-50 h-36 w-[28rem] -translate-y-1/2 rounded-full opacity-50 blur-3xl"
		></div>
		<Motion
			let:motion
			initial={{ width: '8rem' }}
			animate={{ width: '16rem' }}
			transition={{
				delay: 0.3,
				duration: 0.8,
				ease: 'easeInOut'
			}}
		>
			<div
				use:motion
				class="bg-primary absolute inset-auto z-30 h-36 w-64 -translate-y-[6rem] rounded-full blur-2xl"
			></div>
		</Motion>
		<Motion
			let:motion
			initial={{ width: '15rem' }}
			animate={{ width: '30rem' }}
			transition={{
				delay: 0.3,
				duration: 0.8,
				ease: 'easeInOut'
			}}
		>
			<div
				use:motion
				class="bg-primary absolute inset-auto z-50 h-0.5 w-[30rem] -translate-y-[7rem]"
			></div>
		</Motion>

		<div class="absolute inset-auto z-40 h-44 w-full -translate-y-[12.5rem] bg-slate-950"></div>
	</div>

	<div class="relative z-50 flex -translate-y-80 flex-col items-center px-5">
		<slot />
	</div>
</div>
