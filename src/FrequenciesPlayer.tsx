import {flowMax, addStateHandlers, addProps} from 'ad-hok'
import {FC} from 'react'
import {branchIfNullish, addEffectOnMount} from 'ad-hok-utils'
import {gql} from '@apollo/client'
import {useMutation} from '@apollo/client/react'

import { WavLoader } from './WavLoader'
import { Frequencies } from './types'
import {typedAs} from './utils/typedAs'

const CREATE_WAV_FILE_MUTATION = gql`
  mutation CreateWavFile($frequencies: [FrequencyAndMagnitude!]!) {
    createWavFile(frequencies: $frequencies)
  }
`

interface Props {
  frequencies: Frequencies
}

export const FrequenciesPlayer: FC<Props> = flowMax(
  // TODO: assert that frequencies prop never changes after mounted?
  addStateHandlers(
    {
      uuid: typedAs<string | undefined>(undefined),
    },
    {
      onUuidFetched: () => (uuid: string) => ({
        uuid
      }),
    },
  ),
  addProps(() => {
    const [createWavFileMutate] = useMutation<{
      createWavFile: string
    }>(CREATE_WAV_FILE_MUTATION)

    return {
      createWavFileMutate,
    }
  }),
  addEffectOnMount(({createWavFileMutate, onUuidFetched, frequencies}) => () => {
    const inner = async () => {
      try {
        const { data } = await createWavFileMutate({
          variables: {
            frequencies,
          }
        })

        if (!data) {
          throw new Error("mutation failed")
        }

        onUuidFetched(data.createWavFile)
      } catch (error) {
        console.error("create wav file mutation failed:", error)
      }
    }

    inner()
  }),
  branchIfNullish('uuid', {
    returns: () => <div>loading</div>
  }),
  ({uuid}) => <WavLoader uuid={uuid} />
)

