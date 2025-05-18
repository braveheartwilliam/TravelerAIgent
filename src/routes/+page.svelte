<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import { Card, CardContent } from "$lib/components/ui/card";
  import { ArrowRight, Globe, Map, Users } from 'lucide-svelte';
</script>

<div class="container px-4 py-16 md:py-32">
  <div class="flex flex-col items-center text-center space-y-8 mb-16">
    <h1 class="text-4xl md:text-6xl font-bold tracking-tighter">
      Plan Your Next Adventure with
      <span class="text-primary">TravelerAIgent</span>
    </h1>
    <p class="text-xl text-muted-foreground max-w-[600px]">
      Create, share, and discover travel itineraries. Connect with fellow travelers
      and make your dream trips a reality.
    </p>
    <div class="flex gap-4">
      <Button size="lg" href="/trips">
        Start Planning
        <ArrowRight class="ml-2 h-4 w-4" />
      </Button>
      <Button size="lg" variant="outline" href="/explore">
        Explore Trips
      </Button>
    </div>
  </div>

  <div class="grid md:grid-cols-3 gap-8">
    <Card>
      <CardContent class="pt-6">
        <div class="flex items-center space-x-4">
          <Globe class="h-8 w-8 text-primary" />
          <div>
            <h3 class="font-semibold">Discover Places</h3>
            <p class="text-muted-foreground">Find hidden gems and popular destinations</p>
          </div>
        </div>
      </CardContent>
    </Card>
    <Card>
      <CardContent class="pt-6">
        <div class="flex items-center space-x-4">
          <Map class="h-8 w-8 text-primary" />
          <div>
            <h3 class="font-semibold">Plan Itineraries</h3>
            <p class="text-muted-foreground">Create detailed day-by-day travel plans</p>
          </div>
        </div>
      </CardContent>
    </Card>
    <Card>
      <CardContent class="pt-6">
        <div class="flex items-center space-x-4">
          <Users class="h-8 w-8 text-primary" />
          <div>
            <h3 class="font-semibold">Connect & Share</h3>
            <p class="text-muted-foreground">Join a community of passionate travelers</p>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</div>
