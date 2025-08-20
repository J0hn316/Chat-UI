import 'react';

declare module 'react' {
  interface HTMLAttributes<T> {
    /**
     * Standardized `inert` attribute:
     * When present, the element and its subtree are unfocusable and non-interactive.
     * Presence-only attribute; the actual string value is ignored by the browser.
     */
    inert?: boolean | '' | 'true' | 'false';
  }
}
