export const BACKEND_ROOT_URL = "http://localhost:8080"

export const GRAPHQL_BACKEND_URL = `${BACKEND_ROOT_URL}/graphql`

export const backendFileUrlFromAbsoluteUrlPath = (absoluteUrlPath: string): string =>
  `${BACKEND_ROOT_URL}${absoluteUrlPath}`
