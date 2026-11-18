import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';

const layout = readFileSync('src/routes/+layout.svelte', 'utf8');
const styles = readFileSync('src/styles.css', 'utf8');
const appShell = readFileSync('src/app.html', 'utf8');

describe('responsive application shell', () => {
  it('supports slash and Ctrl/Command+K search without hijacking text fields', () => {
    expect(layout).toContain("event.key === '/' ");
    expect(layout).toContain("event.key.toLowerCase() === 'k'");
    expect(layout).toContain("/^(INPUT|TEXTAREA|SELECT)$/");
    expect(layout).toContain('bind:this={searchInput}');
  });

  it('switches to thumb navigation below 1024px and a four-column desktop library above it', () => {
    expect(styles).toContain('@media (max-width: 1023px)');
    expect(styles).toContain('@media (min-width: 1024px)');
    expect(styles).toContain('grid-template-columns: repeat(4, minmax(0, 1fr))');
    expect(styles).toContain('env(safe-area-inset-bottom)');
  });

  it('includes Apple standalone metadata while retaining the generated PWA manifest', () => {
    expect(appShell).toContain('apple-mobile-web-app-capable');
    expect(layout).toContain('manifest.webmanifest');
  });
});
