'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import * as React from 'react';
import { DayPicker } from 'react-day-picker';

import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/utils/tailwind-utils';

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

interface OptionProps {
  value?: string | number;
  children?: React.ReactNode;
}

function Calendar({ className, classNames, showOutsideDays = true, ...props }: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn('p-3 w-full', className)}
      classNames={{
        months: 'flex flex-col sm:flex-row space-y-3 sm:space-x-3 sm:space-y-0 w-full',
        month: 'space-y-3 w-full',
        caption: 'flex justify-center pt-1 relative items-center mb-3',
        caption_label: 'text-xs font-medium',
        caption_dropdowns: 'flex justify-center gap-1.5 mb-3',
        dropdown_month: 'relative',
        dropdown_year: 'relative',
        dropdown:
          'inline-flex items-center justify-between rounded-md border border-input bg-background px-2 py-1 text-xs font-medium shadow-sm hover:bg-accent focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary min-w-[80px]',
        vhidden: 'sr-only',
        nav: 'space-x-1 flex items-center',
        nav_button: cn(
          buttonVariants({ variant: 'outline' }),
          'h-6 w-6 bg-transparent p-0 opacity-50 ml-4 mb-3 hover:opacity-100',
        ),
        nav_button_previous: 'hidden',
        nav_button_next: 'hidden',
        table: 'w-full border-collapse space-y-1 mt-3',
        head_row: 'flex w-full',
        head_cell:
          'text-muted-foreground rounded-md flex-1 font-normal text-[10px] text-center py-1',
        row: 'flex w-full mt-0.5',
        cell: 'relative p-0 text-center text-[10px] focus-within:relative focus-within:z-20 flex-1',
        day: cn(
          buttonVariants({ variant: 'ghost' }),
          'h-6 w-full p-0 font-normal text-[10px] text-foreground hover:bg-accent hover:text-primary',
        ),
        day_selected:
          'bg-primary text-white hover:bg-primary hover:text-white focus:bg-primary focus:text-white',
        day_today: 'bg-accent font-semibold',
        day_outside: 'text-muted-foreground opacity-50',
        day_disabled: 'text-muted-foreground opacity-30',
        day_hidden: 'invisible',
        ...classNames,
      }}
      components={{
        IconLeft: ({ className, ...props }) => (
          <ChevronLeft className={cn('h-3 w-3', className)} {...props} />
        ),
        IconRight: ({ className, ...props }) => (
          <ChevronRight className={cn('h-3 w-3', className)} {...props} />
        ),
        Dropdown: ({ value, onChange, children, ...props }) => {
          const options = React.Children.toArray(children) as React.ReactElement<OptionProps>[];

          return (
            <select
              className='inline-flex items-center justify-between rounded-md border border-input bg-background px-2 py-1 text-xs font-medium shadow-sm hover:bg-accent focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary min-w-[80px] appearance-none cursor-pointer'
              value={value}
              onChange={onChange}
              {...props}
            >
              {options.map((option: React.ReactElement<OptionProps>, id: number) => (
                <option key={id} value={option.props.value}>
                  {option.props.children}
                </option>
              ))}
            </select>
          );
        },
      }}
      {...props}
    />
  );
}

Calendar.displayName = 'Calendar';

export { Calendar };
