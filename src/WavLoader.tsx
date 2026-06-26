import type { FC } from 'react'
import { flowMax, addProps } from 'ad-hok'
import {branchIfNullish} from 'ad-hok-utils'
import { gql } from '@apollo/client'
import { useQuery } from '@apollo/client/react'

import WavPlayer from './WavPlayer'
import {typedAs} from './utils/typedAs'
import {backendFileUrlFromAbsoluteUrlPath} from './backend'

const WAV_FILE_URL_QUERY = gql`
  query WavFileUrl($uuid: UUID!) {
    wavFileUrl(uuid: $uuid)
  }
`

type AddLoadedWavUrl = <TProps extends {
  uuid: string
}>(props: TProps) => TProps & {
  wavUrl: string
}

const addLoadedWavUrl: AddLoadedWavUrl = flowMax(
  addProps(({uuid}) => {
    const { loading: _loading, error, data } = useQuery<{
      wavFileUrl: string | null
    }>(WAV_FILE_URL_QUERY, {
      variables: {
        uuid,
      }
    })

    if (error) {
      throw new Error("not expecting wavFileUrl error at the moment")
    }

    if (data === undefined) return {
      wavUrl: typedAs<string | undefined>(undefined),
    }

    if (data.wavFileUrl === null) return {
      wavUrl: typedAs<string | undefined>(undefined),
    }

    return {
      wavUrl: backendFileUrlFromAbsoluteUrlPath(data.wavFileUrl),
    }
  }),
  branchIfNullish('wavUrl', {
    returns: () => <div>loading</div>
  }),
)

interface Props {
  uuid: string
}

export const WavLoader: FC<Props> = flowMax(
  // TODO: assert that uuid prop never changes after mount? Also same for
  // wavUrl prop in <WavPlayer>?
  addLoadedWavUrl,
  ({wavUrl}) => <WavPlayer wavUrl={wavUrl} />
)
