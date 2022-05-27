declare type ElRef<T extends HTMLElement = HTMLDivElement> = Nullable<T>

declare global {
  interface Window {
    CViewer: any
  }
}

declare type Recordable<T = any> = Record<string, T>
