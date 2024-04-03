// Files exported from axios/unsafe are not typed because they are vanilla javascript
// so we must manually add a type to make typescript happy

declare module 'axios/unsafe/helpers/buildURL.js' {
  export default function buildURL(url: string, params: any, paramsSerializer: any): string;
}

declare module 'axios/unsafe/helpers/combineURLs.js' {
  export default function combineURLs(baseURL: string, relativeURL: string): string;
}

declare module 'axios/unsafe/helpers/isAbsoluteURL.js' {
  export default function isAbsoluteURL(url: string): boolean;
}
