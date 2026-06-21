import { FC } from 'react'
import { css } from '../styled-system/css'
import { flowMax } from 'ad-hok'

const styles = {
  root: css({
    color: 'green',
  }),
}

interface Props {
  wavUrl: string,
}

const WavPlayer: FC<Props> = flowMax(
  ({wavUrl}) =>
    <div className={styles.root}>
      <audio controls>
        <source src={wavUrl} type="audio/wav" />
      </audio>
    </div>,
)

export default WavPlayer
