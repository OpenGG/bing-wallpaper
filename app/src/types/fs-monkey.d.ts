declare module "fs-monkey" {
  export function patchFs(vol: unknown, fs?: unknown): () => void;
}
