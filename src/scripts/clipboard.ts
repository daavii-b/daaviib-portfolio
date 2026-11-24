/**
 * Clipboard helpers shared by the contact dialog and the "copy email" button.
 * Browser-only (bundled into component scripts); behaviour is covered by the e2e suite.
 */

/** Copy text; when the Clipboard API is unavailable, select `fallbackNode` so the visitor can copy it. */
export async function copyText(text: string, fallbackNode?: Node | null): Promise<void> {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    if (fallbackNode) window.getSelection()?.selectAllChildren(fallbackNode);
  }
}

const timers = new WeakMap<HTMLElement, number>();

/**
 * Mark an element as copied (`data-copied`, used by `in-data-[copied]:` styles) for `ms`, then run `onReset`.
 * Repeated clicks restart the timer.
 */
export function flagCopied(element: HTMLElement, onReset?: () => void, ms = 2000): void {
  element.dataset.copied = '';
  window.clearTimeout(timers.get(element));
  timers.set(
    element,
    window.setTimeout(() => {
      delete element.dataset.copied;
      onReset?.();
    }, ms),
  );
}
