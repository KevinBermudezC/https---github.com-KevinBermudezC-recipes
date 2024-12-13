import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground shadow hover:bg-yellow-500/90 dark:hover:bg-yellow-600 dark:text-white',
        destructive:
          'bg-red-600 text-white shadow-sm hover:bg-red-500 dark:bg-red-700 dark:hover:bg-red-600',
        outline:
          'border border-input bg-background shadow-sm hover:bg-yellow-100 hover:text-yellow-900 dark:hover:bg-yellow-800 dark:hover:text-yellow-100 dark:text-white',
        secondary:
          'bg-secondary text-secondary-foreground shadow-sm hover:bg-yellow-200 dark:hover:bg-yellow-700 dark:text-white dark:hover:text-yellow-100',
        ghost: 'hover:bg-yellow-100 hover:text-yellow-900 dark:hover:bg-yellow-800 dark:text-white dark:hover:text-yellow-100',
        link: 'text-primary underline-offset-4 hover:text-yellow-600 dark:text-yellow-200 dark:hover:text-yellow-400',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
