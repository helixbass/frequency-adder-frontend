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
  onSubmitFrequencies: (frequencies: Frequencies) => void
  clearFrequencies: () => void
}

export const FrequenciesEditor: FC<Props> = flowMax(
  addStateHandlers(
    {
      frequencies: typedAs<FrequencyAndMagnitudeInputValues[]>([]),
      inProgressFrequency: typedAs<FrequencyAndMagnitudeInputValues | undefined>(undefined),
    },
    {
      onDeleteFrequencyIndex: ({frequencies}) => (index: number) => ({
        frequencies: withoutIndex(index, frequencies),
      }),
      onAddNewFrequency: () => () => ({
        inProgressFrequency: {
          frequency: '',
          magnitude: '',
        }
      }),
    }
  ),
  addHandlers({
    submitFrequencies: ({frequencies, onSubmitFrequencies}) => () => {
      onSubmitFrequencies(parseFrequencies(frequencies))
    }
  }),
  ({frequencies, onDeleteFrequencyIndex, clearFrequencies, submitFrequencies, onAddNewFrequency}) =>
    <>
      <SavedFrequencies frequencies={frequencies} onDeleteFrequencyIndex={onDeleteFrequencyIndex} />
      {frequencies.length <= 5 && <AddNewFrequencyButton onClick={onAddNewFrequency} />}
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

interface AddNewFrequencyButtonProps {
  onClick: () => void
}

const AddNewFrequencyButton: FC<AddNewFrequencyButtonProps> = ({onClick}) =>
  <button onClick={onClick}>+</button>

interface SavedFrequenciesProps {
  frequencies: FrequencyAndMagnitudeInputValues[]
  onDeleteFrequencyIndex: (index: number) => void
}

const SavedFrequencies: FC<SavedFrequenciesProps> = ({frequencies, onDeleteFrequencyIndex}) =>
  <div>
    {frequencies.map((frequency, index) => <SavedFrequency index={index} frequency={frequency} onDeleteFrequencyIndex={onDeleteFrequencyIndex} />)}
  </div>

interface SavedFrequencyProps {
  frequency: FrequencyAndMagnitudeInputValues
  index: number
  onDeleteFrequencyIndex: (index: number) => void
}

const SavedFrequency: FC<SavedFrequencyProps> = ({frequency, onDeleteFrequencyIndex, index}) =>
  <div>
    <span>Frequency</span>
    <span>{frequency.frequency}</span>
    <span>Magnitude</span>
    <span>{frequency.magnitude}</span>
    <DeleteSavedFrequencyButton onDeleteFrequencyIndex={onDeleteFrequencyIndex} index={index} />
  </div>

interface DeleteSavedFrequencyButtonProps {
  index: number
  onDeleteFrequencyIndex: (index: number) => void
}

const DeleteSavedFrequencyButton: FC<DeleteSavedFrequencyButtonProps> = ({onDeleteFrequencyIndex, index}) =>
  <button onClick={() => onDeleteFrequencyIndex(index)}>X</button>
