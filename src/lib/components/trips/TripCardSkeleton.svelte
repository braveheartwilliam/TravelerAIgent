<script lang="ts">
  import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '$lib/components/ui/card';
  import { Skeleton } from '$lib/components/ui/skeleton';
  
  // Props
  const { class: className = '' } = $props<{
    class?: string;
  }>();
</script>

<Card class={`overflow-hidden h-full flex flex-col ${className}`}>
  <div class="relative h-48 w-full">
    <Skeleton class="w-full h-full" />
  </div>
  
  <CardHeader class="pb-2">
    <div class="flex justify-between items-start">
      <div class="space-y-2 w-full">
        <Skeleton class="h-6 w-3/4" />
        <Skeleton class="h-4 w-full" />
      </div>
    </div>
  </CardHeader>
  
  <CardContent class="flex-grow">
    <div class="space-y-4">
      <div class="flex flex-wrap items-center gap-2">
        <Skeleton class="h-6 w-20" />
        <Skeleton class="h-6 w-24" />
      </div>
      
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-2">
        <Skeleton class="h-5 w-full" />
        <Skeleton class="h-5 w-full" />
        <Skeleton class="h-5 w-full" />
        <Skeleton class="h-5 w-full" />
      </div>
    </div>
  </CardContent>
  
  <CardFooter class="pt-2">
    <Skeleton class="h-9 w-full" />
  </CardFooter>
</Card>
