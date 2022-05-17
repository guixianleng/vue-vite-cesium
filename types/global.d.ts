declare type ElRef<T extends HTMLElement = HTMLDivElement> = Nullable<T>

declare global {
  interface Window {
    CViewer: any
  }
}
