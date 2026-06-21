import { FC } from 'react'
import { flowMax, SimplePropsAdder } from 'ad-hok'

import WavPlayer from './WavPlayer'

const addLoadedWavUrl: SimplePropsAdder<{
  wavUrl: string
}> = flowMax(
)

interface Props {
  uuid: string
}

const WavLoader: FC<Props> = flowMax(
  addLoadedWavUrl,
  ({wavUrl}) => <WavPlayer wavUrl={wavUrl} />
)

export const WavLoader
