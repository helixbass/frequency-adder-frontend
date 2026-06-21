import {flowMax, addWrapper, addStateHandlers} from 'ad-hok'
import {FC} from 'react'
import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client'
import { ApolloProvider } from '@apollo/client/react'

import { FrequencyPlayer } from './FrequencyPlayer'
import {GRAPHQL_BACKEND_URL} from './backend'
import {typedAs} from './utils/typedAs'

import './index.css'

const apolloClient = new ApolloClient({
  link: new HttpLink({uri: GRAPHQL_BACKEND_URL}),
  cache: new InMemoryCache(),
})

interface Props {
}

const App: FC<Props> = flowMax(
  addWrapper((render) =>
    <ApolloProvider client={apolloClient}>
      {render()}
    </ApolloProvider>
  ),
  addStateHandlers(
    {
      frequency: typedAs<number | undefined>(undefined),
    },
    {
      onSubmitFrequency: () => (frequency: number) => ({
        frequency,
      }),
      clearFrequency: () => () => ({
        frequency: undefined,
      }),
    },
  ),
  ({frequency}) => (
    <>
      {frequency != null && <FrequencyPlayer frequency={frequency} />}
    </>
  )
)

export default App
