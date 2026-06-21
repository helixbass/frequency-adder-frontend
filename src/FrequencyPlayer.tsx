import {flowMax, addStateHandlers, addProps} from 'ad-hok'
import {FC} from 'react'
import {branchIfNullish, addEffectOnMount} from 'ad-hok-utils'
import {gql} from '@apollo/client'
import {useMutation} from '@apollo/client/react'

import { WavLoader } from './WavLoader'
import {typedAs} from './utils/typedAs'

const CREATE_WAV_FILE_MUTATION = gql`
  mutation CreateWavFile($frequency: Float!) {
    createWavFile(frequency: $frequency)
  }
`

interface Props {
  frequency: number
}

export const FrequencyPlayer: FC<Props> = flowMax(
  // TODO: assert that frequency prop never changes after mounted?
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
  addEffectOnMount(({createWavFileMutate, onUuidFetched, frequency}) => () => {
    const inner = async () => {
      try {
        const { data } = await createWavFileMutate({
          variables: {
            frequency,
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

