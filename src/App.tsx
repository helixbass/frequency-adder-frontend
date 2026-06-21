import { WavLoader } from './WavLoader'
import {flowMax} from 'ad-hok'
import {FC} from 'react'

import './index.css'

interface Props {
}

const App: FC<Props> = flowMax(
  () => (
    <>
      <WavLoader uuid="A52691A1-64AA-40C5-AEA8-9FD8C67230C4" />
    </>
  )
)

export default App
