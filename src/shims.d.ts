declare module 'shaka-player';

// Sprawdź, czy przeglądarka już obsługuje te typy, jeśli nie, dodaj je
// Typy dla AbortController
interface AbortController {
  readonly signal: AbortSignal;
  abort(): void;
}

interface AbortSignal {
  readonly aborted: boolean;
  addEventListener(type: "abort", listener: (this: AbortSignal, ev: Event) => any): void;
  removeEventListener(type: "abort", listener: (this: AbortSignal, ev: Event) => any): void;
}

// Typy dla webCrypto
declare namespace webCrypto {
  type CryptoKey = any; // Możesz zastąpić 'any' odpowiednim typem, jeśli go znasz
}
