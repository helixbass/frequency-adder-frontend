import { FC } from 'react'
import { flowMax, SimplePropsAdder, addStateHandlers, addProps } from 'ad-hok'
import {addEffectOnMount} from 'ad-hok-utils'
import { gql } from '@apollo/client'
import { useQuery } from '@apollo/client/react'

import WavPlayer from './WavPlayer'
import {typedAs} from './utils/typedAs'

const WAV_FILE_URL_QUERY = gql`
  query WavFileUrl($uuid: String!) {
    wavFileUrl(uuid: $uuid)
  }
`

const addLoadedWavUrl: SimplePropsAdder<{
  wavUrl: string
}> = flowMax(
  addStateHandlers(
    {
      wavUrl: typedAs<string | undefined>(undefined),
    },
    {
      onQueryResolved: () => (wavUrl: string) => ({
        wavUrl,
      })
    }
  ),
  addProps(() => {
    const { loading, error, data } = useQuery<string | null>(WAV_FILE_URL_QUERY)

    if (error) {
      throw new Error("not expecting wavFileUrl error at the moment")
    }

    if (data === undefined) return {
      wavUrl: typedAs<string | undefined>(undefined),
    }
  }),
  addEffectOnMount(
    ({onQueryResolved}) => () => {
    }
  ),
)

interface Props {
  uuid: string
}

const WavLoader: FC<Props> = flowMax(
  // TODO: assert that uuid prop never changes after mount? Also same for
  // wavUrl prop in <WavPlayer>?
  addLoadedWavUrl,
  ({wavUrl}) => <WavPlayer wavUrl={wavUrl} />
)

export const WavLoader
