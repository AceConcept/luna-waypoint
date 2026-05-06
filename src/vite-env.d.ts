/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Optional override; defaults to https://luna-code-editor.vercel.app when unset. */
  readonly VITE_LUNA_CODE_EDITOR_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
