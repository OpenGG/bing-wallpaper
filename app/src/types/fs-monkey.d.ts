declare module "fs-monkey" {
  export function patchFs(vol: any, fs?: any): () => void;
}
