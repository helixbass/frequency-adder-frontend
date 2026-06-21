import { FC } from 'react'
import { css } from '../styled-system/css'

const styles = {
  root: css({
    color: 'green',
  }),
}

interface Props {
}

const WavPlayer: FC<Props> = (props) => {
  return <div className={styles.root}>wavplayer</div>
}

export default WavPlayer
