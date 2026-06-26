import {flowMax, addStateHandlers, addHandlers} from 'ad-hok'
import {FC} from 'react'

import {typedAs} from './utils/typedAs'
import {withoutIndex} from './utils/withoutIndex'
import {Frequencies, FrequencyAndMagnitude} from './types'

interface FrequencyAndMagnitudeInputValues {
  frequency: string
  magnitude: string
}

const parseFrequencies = (frequencies: FrequencyAndMagnitudeInputValues[]): Frequencies =>
  frequencies.map((frequency: FrequencyAndMagnitudeInputValues): FrequencyAndMagnitude => ({
    frequency: parseFloat(frequency.frequency),
    magnitude: parseFloat(frequency.magnitude),
  }))

interface Props {
  onSubmitFrequencies: (frequencies: number) => void
  clearFrequencies: () => void
}

export const FrequenciesEditor: FC<Props> = flowMax(
  addStateHandlers(
    {
      frequencies: typedAs<FrequencyAndMagnitudeInputValues[]>([]),
    },
    {
      onDeleteFrequencyIndex: ({frequencies}) => (index: number) => ({
        frequencies: withoutIndex(index, frequencies),
      }),
    }
  ),
  addHandlers({
    submitFrequencies: ({frequencies, onSubmitFrequencies}) => () => {
      onSubmitFrequencies(parseFrequencies(frequencies))
    }
  }),
  ({frequencies, onDeleteFrequencyIndex, clearFrequencies, submitFrequencies}) =>
    <>
      <SavedFrequencies frequencies={frequencies} onDeleteFrequencyIndex={onDeleteFrequencyIndex} />
      {frequencies.length <= 5 && <AddNewFrequencyButton />}
      <form
        onSubmit={(event) => {
          event.preventDefault()

          onSubmitFrequencies(parseFloat(frequencyValue))
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
          onFocus={clearFrequencies}
        />
        <button type="submit">Submit</button>
      </form>
    </>
)
