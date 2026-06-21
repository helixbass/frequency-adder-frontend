import { FC } from 'react'
import { css } from '../styled-system/css'
import { flowMax, addProps } from 'ad-hok'

const styles = {
  root: css({
    color: 'green',
  }),
}

interface Props {
  wavFileContents: Blob,
}

const WavPlayer: FC<Props> = flowMax(
  addProps(
    ({wavFileContents}) => ({
      browserLocalWavFileUrl: URL.createObjectURL(wavFileContents),
    }),
    ['wavFileContents'],
  ),
  ({browserLocalWavFileUrl}) =>
    <div className={styles.root}>
      <audio controls>
        <source src={browserLocalWavFileUrl} type="audio/wav" />
      </audio>
    </div>,
)

export default WavPlayer
