import { WavLoader } from './WavLoader'
import {flowMax} from 'ad-hok'
import {FC} from 'react'
import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client'
import { ApolloProvider } from '@apollo/client/react'

import './index.css'

const apolloClient = new ApolloClient({
  link: new HttpLink({uri: "http://localhost:8080/graphql"}),
  cache: new InMemoryCache(),
})

interface Props {
}

const App: FC<Props> = flowMax(
  () => (
    <>
      <ApolloProvider client={apolloClient}>
        <WavLoader uuid="A52691A1-64AA-40C5-AEA8-9FD8C67230C4" />
      </ApolloProvider>
    </>
  )
)

export default App
