declare module '*aggregate-ratios.mjs' {
  export function calculateAggregateRatios(data: unknown): { contractVersion: string; ratios: Record<string, { status: string; value: number | null }> };
}
declare module '*analysis-transfer.mjs' {
  export function createTransferEnvelope(records: string, options: Record<string, string>): string;
  export function planImport(envelope: string, existing: string): { additions: unknown[] };
}
