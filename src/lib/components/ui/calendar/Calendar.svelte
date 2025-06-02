<script lang="ts">
  import { cn } from '$lib/utils/cn';
  import { createEventDispatcher } from 'svelte';
  import { format, addDays, getDay, isToday, isSameMonth, isWithinInterval, startOfMonth, endOfMonth, eachDayOfInterval, startOfWeek, endOfWeek } from 'date-fns';
  
  type CalendarProps = {
    mode?: 'single' | 'range' | 'multiple';
    selected?: Date | Date[] | DateRange | undefined;
    onSelect?: (date: Date | Date[] | DateRange | undefined) => void;
    disabled?: boolean | ((date: Date) => boolean);
    initialFocus?: boolean;
    weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
    locale?: any; // Using any for now, should be imported from date-fns
    className?: string;
    numberOfMonths?: number;
    fromDate?: Date;
    toDate?: Date;
    captionLayout?: 'dropdown' | 'buttons';
    defaultMonth?: Date;
    showOutsideDays?: boolean;
    fixedWeeks?: boolean;
  };
  
  type DateRange = {
    from: Date;
    to?: Date;
  };
  
  // Define props
  const {
    mode = 'single',
    selected = undefined,
    disabled = false,
    initialFocus = false,
    weekStartsOn = 0,
    className = '',
    numberOfMonths = 1,
    fromDate,
    toDate,
    captionLayout = 'dropdown',
    defaultMonth = new Date(),
    showOutsideDays = true,
    fixedWeeks = false
  } = $props();
  
  // Event dispatcher
  const dispatch = createEventDispatcher();
  
  // State
  let currentMonth = $state(defaultMonth || new Date());
  let focusedDate = $state<Date | null>(null);
  
  // Days of the week
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  // Get days for the current month
  function getDaysInMonth(date: Date) {
    const firstDayOfMonth = startOfMonth(date);
    const lastDayOfMonth = endOfMonth(date);
    const startDate = startOfWeek(firstDayOfMonth, { weekStartsOn });
    const endDate = endOfWeek(lastDayOfMonth, { weekStartsOn });
    
    return eachDayOfInterval({ start: startDate, end: endDate });
  }
  
  // Check if a date is selected
  function isDateSelected(date: Date): boolean {
    if (!selected) return false;
    
    if (mode === 'single') {
      return selected instanceof Date && 
        date.getDate() === selected.getDate() &&
        date.getMonth() === selected.getMonth() &&
        date.getFullYear() === selected.getFullYear();
    }
    
    if (mode === 'range' && typeof selected === 'object' && 'from' in selected) {
      const selectedRange = selected as DateRange;
      if (!selectedRange.to) return false;
      return isWithinInterval(date, { 
        start: selectedRange.from, 
        end: selectedRange.to 
      });
    }
    
    if (mode === 'multiple' && Array.isArray(selected)) {
      return selected.some(selectedDate => 
        date.getDate() === selectedDate.getDate() &&
        date.getMonth() === selectedDate.getMonth() &&
        date.getFullYear() === selectedDate.getFullYear()
      );
    }
    
    return false;
  }
  
  // Check if a date is disabled
  function isDateDisabled(date: Date): boolean {
    if (typeof disabled === 'boolean') return disabled;
    if (typeof disabled === 'function') return disabled(date);
    return false;
  }
  
  // Handle date selection
  function handleSelect(date: Date) {
    if (isDateDisabled(date)) return;
    
    let newSelected: Date | Date[] | DateRange | undefined = undefined;
    
    if (mode === 'single') {
      newSelected = date;
    } else if (mode === 'range') {
      const selectedRange = selected as DateRange | undefined;
      
      if (!selectedRange || !selectedRange.from || selectedRange.to) {
        newSelected = { from: date };
      } else {
        const from = selectedRange.from;
        if (date < from) {
          newSelected = { from: date, to: from };
        } else {
          newSelected = { from, to: date };
        }
      }
    } else if (mode === 'multiple') {
      const selectedDates = (selected as Date[] | undefined) || [];
      
      const isSelected = selectedDates.some(selectedDate => 
        date.getDate() === selectedDate.getDate() &&
        date.getMonth() === selectedDate.getMonth() &&
        date.getFullYear() === selectedDate.getFullYear()
      );
      
      if (isSelected) {
        newSelected = selectedDates.filter(selectedDate => 
          !(date.getDate() === selectedDate.getDate() &&
          date.getMonth() === selectedDate.getMonth() &&
          date.getFullYear() === selectedDate.getFullYear())
        );
      } else {
        newSelected = [...selectedDates, date];
      }
    }
    
    dispatch('select', newSelected);
  }
  
  // Navigate to previous month
  function previousMonth() {
    const prevMonth = new Date(currentMonth);
    prevMonth.setMonth(prevMonth.getMonth() - 1);
    currentMonth = prevMonth;
  }
  
  // Navigate to next month
  function nextMonth() {
    const nextMonth = new Date(currentMonth);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    currentMonth = nextMonth;
  }
  
  // Get days for the current view
  const days = $derived(getDaysInMonth(currentMonth));
</script>

<div class={cn('p-3', className)}>
  <div class="flex justify-between items-center mb-4">
    <button
      type="button"
      class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-7 w-7 bg-transparent p-0"
      onclick={previousMonth}
      aria-label="Previous month"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4">
        <path d="M15 18l-6-6 6-6" />
      </svg>
    </button>
    <div class="font-medium">
      {format(currentMonth, 'MMMM yyyy')}
    </div>
    <button
      type="button"
      class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-7 w-7 bg-transparent p-0"
      onclick={nextMonth}
      aria-label="Next month"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4">
        <path d="M9 18l6-6-6-6" />
      </svg>
    </button>
  </div>
  <div class="grid grid-cols-7 gap-1">
    {#each daysOfWeek as day, i}
      <div class="text-center text-sm text-muted-foreground h-9 flex items-center justify-center">
        {day.slice(0, 2)}
      </div>
    {/each}
    {#each days as day, i}
      <button
        type="button"
        class={cn(
          'h-9 w-9 rounded-md p-0 text-center text-sm font-normal aria-selected:opacity-100',
          'hover:bg-accent hover:text-accent-foreground focus-visible:bg-accent focus-visible:text-accent-foreground',
          isDateSelected(day) && 'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground',
          !isSameMonth(day, currentMonth) && 'text-muted-foreground opacity-50',
          isToday(day) && !isDateSelected(day) && 'border border-input',
          isDateDisabled(day) && 'pointer-events-none opacity-50'
        )}
        disabled={isDateDisabled(day)}
        onclick={() => handleSelect(day)}
        aria-label={format(day, 'PPP')}
        data-selected={isDateSelected(day)}
      >
        {format(day, 'd')}
      </button>
    {/each}
  </div>
</div>
