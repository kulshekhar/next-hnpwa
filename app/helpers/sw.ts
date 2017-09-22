export async function registerSW() {
  if ('serviceWorker' in navigator) {
    try {
      await navigator.serviceWorker.register('/service-worker.js', {
        scope: '/'
      });

      console.log(`Registration successful`);

    } catch (e) {
      console.warn(`Registration failed: ${e}`);
    }
  }
}
