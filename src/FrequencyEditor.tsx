import {flowMax, addState} from 'ad-hok'
import {FC} from 'react'

interface Props {
  onSubmitFrequency: (frequency: number) => void
  clearFrequency: () => void
}

export const FrequencyEditor: FC<Props> = flowMax(
  addState('frequencyValue', 'setFrequencyValue', ''),
  ({frequencyValue, setFrequencyValue, clearFrequency, onSubmitFrequency}) =>
    <form
      onSubmit={(event) => {
        event.preventDefault()

        onSubmitFrequency(parseFloat(frequencyValue))
      }}
    >
      <label htmlFor="frequencyValue">Frequency</label>
      <input
        type="text"
        id="frequencyValue"
        value={frequencyValue}
        onChange={(event) => {
          setFrequencyValue(event.target.value)
        }}
        onFocus={clearFrequency}
      />
      <button type="submit">Submit</button>
    </form>
)
