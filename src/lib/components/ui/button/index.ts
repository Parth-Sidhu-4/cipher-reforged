import { type VariantProps, tv } from 'tailwind-variants';
import { Button as ButtonPrimitive } from 'bits-ui'; // Just import the component
import Root from './button.svelte'; // Your wrapper component

const buttonVariants = tv({
	base: 'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
	variants: {
		variant: {
			default: 'bg-primary text-primary-foreground hover:bg-primary/90',
			destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
			outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
			secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
			ghost: 'hover:bg-accent hover:text-accent-foreground',
			link: 'text-primary underline-offset-4 hover:underline'
		},
		size: {
			default: 'h-10 px-4 py-2',
			sm: 'h-9 rounded-md px-3',
			lg: 'h-11 rounded-md px-8',
			icon: 'h-10 w-10'
		}
	},
	defaultVariants: {
		variant: 'default',
		size: 'default'
	}
});

type Variant = VariantProps<typeof buttonVariants>['variant'];
type Size = VariantProps<typeof buttonVariants>['size'];

// 🛠️ Instead of ButtonPrimitive.Props, define your own compatible props
type Props = {
	variant?: Variant;
	size?: Size;
	class?: string;
	// Add standard button props (adjust if needed)
	type?: 'button' | 'submit' | 'reset';
	disabled?: boolean;
	onClick?: (event: MouseEvent) => void;
};

type Events = {
	click: MouseEvent;
	keydown: KeyboardEvent;
};

export {
	Root,
	type Props,
	type Events,
	Root as Button,
	type Props as ButtonProps,
	type Events as ButtonEvents,
	buttonVariants
};
