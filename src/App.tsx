import WavPlayer from './WavPlayer'
import {flowMax, SimplePropsAdder, addStateHandlers} from 'ad-hok'
import {FC} from 'react'
import {typedAs} from './utils/typedAs'
import {addEffectOnMount, branchIfNullish} from 'ad-hok-utils'

import './index.css'

const EXAMPLE_WAV_FILE_URL = "/M1F1-float32WE-AFsp.wav"

const loadWavFile = async ({onWavFileLoaded}: {
  onWavFileLoaded: (wavFileContents: Blob) => void,
}) => {
  try {
    const response = await fetch(EXAMPLE_WAV_FILE_URL)

    if (!response.ok) {
      throw new Error('Wav fetch failed')
    }

    const blob = await response.blob();

    onWavFileLoaded(blob)
  } catch (error) {
    console.error("Loading wav file failed: ", error)
  }
}

const addWavFileContents: SimplePropsAdder<{
  wavFileContents: Blob,
}> = flowMax(
  addStateHandlers(
    {
      wavFileContents: typedAs<Blob | undefined>(undefined),
    },
    {
      onWavFileLoaded: () => (wavFileContents: Blob) => ({
        wavFileContents,
      }),
    }
  ),
  addEffectOnMount(
    ({onWavFileLoaded}) => () => {
      loadWavFile({onWavFileLoaded})
    },
  ),
  branchIfNullish(
    'wavFileContents',
    {
      returns: () => <div>loading</div>,
    },
  ),
)

interface Props {
}

const App: FC<Props> = flowMax(
  addWavFileContents,
  ({wavFileContents}) => (
    <>
      <WavPlayer wavFileContents={wavFileContents} />
    </>
  )
)

export default App
