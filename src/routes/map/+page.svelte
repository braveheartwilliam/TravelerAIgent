<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '$lib/components/ui/card';
  import { Tabs, TabsContent, TabsList, TabsTrigger } from '$lib/components/ui/tabs';
  import { Badge } from '$lib/components/ui/badge';
  import { ScrollToTop } from '$lib/components/ui/scroll-to-top';
  
  // Define active tab state with a default value
  let activeTab = 'explore';
</script>

<div class="min-h-screen flex flex-col bg-gradient-to-br from-blue-900 to-blue-600 bg-cover bg-center" style="background-image: url('/images/world-map-bg.svg');">
  <!-- Main Content -->
  <main class="flex-1 container py-8 px-4 md:px-6">
    <div class="max-w-6xl mx-auto">
      <h1 class="text-3xl font-bold text-white mb-6">Interactive World Map</h1>
      
      <Tabs value={activeTab} class="w-full">
        <TabsList class="grid grid-cols-3 mb-6">
          <TabsTrigger value="explore">Explore</TabsTrigger>
          <TabsTrigger value="my-trips">My Trips</TabsTrigger>
          <TabsTrigger value="popular">Popular Destinations</TabsTrigger>
        </TabsList>
        
        <TabsContent value="explore" class="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Explore the World</CardTitle>
              <CardDescription>Discover new destinations and plan your next adventure</CardDescription>
            </CardHeader>
            <CardContent>
              <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {#each ['Europe', 'Asia', 'North America', 'South America', 'Africa', 'Oceania'] as continent}
                  <Card>
                    <CardHeader class="pb-2">
                      <CardTitle class="text-lg">{continent}</CardTitle>
                    </CardHeader>
                    <CardContent class="pb-2">
                      <p class="text-sm text-muted-foreground">Explore popular destinations in {continent}</p>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" size="sm" class="w-full">Explore</Button>
                    </CardFooter>
                  </Card>
                {/each}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="my-trips" class="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>My Trips on the Map</CardTitle>
              <CardDescription>View and manage your planned and completed trips</CardDescription>
            </CardHeader>
            <CardContent>
              <div class="grid gap-4">
                <p class="text-muted-foreground">Your trips will be displayed here on the interactive map. Connect to the trips service to view your journeys.</p>
                <Button variant="default">Connect to Trips</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="popular" class="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Popular Destinations</CardTitle>
              <CardDescription>Trending places loved by travelers worldwide</CardDescription>
            </CardHeader>
            <CardContent>
              <div class="grid gap-4 md:grid-cols-2">
                {#each [
                  { name: 'Paris, France', tag: 'Cultural' },
                  { name: 'Bali, Indonesia', tag: 'Beach' },
                  { name: 'Tokyo, Japan', tag: 'Urban' },
                  { name: 'Santorini, Greece', tag: 'Island' }
                ] as destination}
                  <div class="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 class="font-medium">{destination.name}</h3>
                      <Badge variant="outline">{destination.tag}</Badge>
                    </div>
                    <Button variant="ghost" size="sm">View</Button>
                  </div>
                {/each}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  </main>
  
  <ScrollToTop />
</div>
