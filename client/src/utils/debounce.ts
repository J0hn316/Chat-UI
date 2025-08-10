export function debounce<A>(fn: (a: A) => void, delay?: number): (a: A) => void;

export function debounce<A, B>(
  fn: (a: A, b: B) => void,
  delay?: number
): (a: A, b: B) => void;

export function debounce<A, B, C>(
  fn: (a: A, b: B, c: C) => void,
  delay?: number
): (a: A, b: B, c: C) => void;

export function debounce(fn: (...args: unknown[]) => void, delay = 300) {
  let timer: ReturnType<typeof setTimeout> | null = null;
  return (...args: unknown[]) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}
