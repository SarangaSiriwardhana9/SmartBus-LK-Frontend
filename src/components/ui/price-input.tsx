import { cn } from '@/utils/tailwind-utils';
import * as React from 'react';
import { Input } from './input';

interface PriceInputProps extends Omit<React.ComponentProps<'input'>, 'prefix'> {
  prefix?: string;
}

const PriceInput = React.forwardRef<HTMLInputElement, PriceInputProps>(
  ({ className, prefix = 'LKR', ...props }, ref) => {
    return (
      <div className='relative flex items-center'>
        <div className='absolute left-3 flex items-center pointer-events-none text-muted-foreground text-sm z-10'>
          {prefix}
        </div>
        <Input ref={ref} className={cn('pl-12', className)} {...props} />
      </div>
    );
  },
);

PriceInput.displayName = 'PriceInput';

export { PriceInput };
