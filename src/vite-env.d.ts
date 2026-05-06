/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** When set, the step stage embeds this origin (e.g. http://localhost:3000) in an iframe. */
  readonly VITE_LUNA_CODE_EDITOR_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
