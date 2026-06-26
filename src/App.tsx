import {flowMax, addWrapper, addStateHandlers} from 'ad-hok'
import type {FC} from 'react'
import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client'
import { ApolloProvider } from '@apollo/client/react'

import { FrequenciesPlayer } from './FrequenciesPlayer'
import { FrequenciesEditor } from './FrequenciesEditor'
import type { Frequencies } from './types'
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
      frequencies: typedAs<Frequencies | undefined>(undefined),
    },
    {
      onSubmitFrequencies: () => (frequencies: Frequencies) => ({
        frequencies,
      }),
      clearFrequencies: () => () => ({
        frequencies: undefined,
      }),
    },
  ),
  ({frequencies, onSubmitFrequencies, clearFrequencies}) => (
    <div>
      <FrequenciesEditor onSubmitFrequencies={onSubmitFrequencies} clearFrequencies={clearFrequencies} />
      {frequencies != null && <FrequenciesPlayer frequencies={frequencies} key={frequencies.length} />}
    </div>
  )
)

export default App
