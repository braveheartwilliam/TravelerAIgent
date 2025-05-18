<!-- src/routes/auth/signin/+page.svelte -->
<script lang="ts">
  import { signIn } from '@auth/sveltekit/client';
  import { Button } from '$lib/components/ui/button';
  import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '$lib/components/ui/card';
  import { Github, Mail } from 'lucide-svelte';

  export let data;

  async function handleGithubSignIn() {
    try {
      await signIn('github', {
        callbackUrl: 'http://127.0.0.1:65477',
        redirect: true
      });
    } catch (error) {
      console.error('Sign in error:', error);
    }
  }
</script>

<div class="container flex h-screen w-screen flex-col items-center justify-center">
  <Card class="w-[350px]">
    <CardHeader>
      <CardTitle>Welcome back</CardTitle>
      <CardDescription>Choose your sign in method</CardDescription>
    </CardHeader>
    <CardContent class="grid gap-4">
      <Button variant="outline" on:click={handleGithubSignIn}>
        <Github class="mr-2 h-4 w-4" />
        Github
      </Button>
      <Button variant="outline" on:click={() => signIn('google')}>
        <Mail class="mr-2 h-4 w-4" />
        Google
      </Button>
    </CardContent>
    <CardFooter>
      <p class="text-sm text-muted-foreground">
        By clicking continue, you agree to our Terms of Service and Privacy Policy.
      </p>
    </CardFooter>
  </Card>
</div>
