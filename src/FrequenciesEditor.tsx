import {flowMax, addStateHandlers, addHandlers, addEffect} from 'ad-hok'
import {FC} from 'react'

import {typedAs} from './utils/typedAs'
import {withoutIndex} from './utils/withoutIndex'
import {checkNonNullish} from './utils/assert'
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
      isAddingNewFrequency: false,
    },
    {
      onDeleteFrequencyIndex: ({frequencies}) => (index: number) => ({
        frequencies: withoutIndex(index, frequencies),
      }),
      onAddNewFrequency: () => () => ({
        isAddingNewFrequency: true,
      }),
      onSaveInProgressFrequency: ({frequencies}) => (inProgressFrequency: FrequencyAndMagnitudeInputValues) => ({
          frequencies: [
            ...frequencies,
            inProgressFrequency
          ],
          isAddingNewFrequency: false,
      }),
    }
  ),
  addHandlers({
    submitFrequencies: ({frequencies, onSubmitFrequencies}) => () => {
      onSubmitFrequencies(parseFrequencies(frequencies))
    }
  }),
  addEffect(({submitFrequencies, frequencies}) => () => {
    if (frequencies.length === 0) {
      return
    }
    submitFrequencies()
  }, ['frequencies']),
  addEffect(({clearFrequencies, isAddingNewFrequency}) => () => {
    if (isAddingNewFrequency) {
      clearFrequencies()
    }
  }, ['isAddingNewFrequency']),
  ({frequencies, onDeleteFrequencyIndex, onAddNewFrequency, isAddingNewFrequency, onSaveInProgressFrequency}) =>
    <>
      <SavedFrequencies frequencies={frequencies} onDeleteFrequencyIndex={onDeleteFrequencyIndex} />
      {
        isAddingNewFrequency
          ? <InProgressFrequency onSave={onSaveInProgressFrequency} />
          : frequencies.length < 5 && <AddNewFrequencyButton onClick={onAddNewFrequency} />
      }
    </>
)

interface InProgressFrequencyProps {
  onSave: (inProgressFrequency: FrequencyAndMagnitudeInputValues) => void
}

const InProgressFrequency: FC<InProgressFrequencyProps> = flowMax(
  addStateHandlers(
    {
      inProgressFrequency: {
        frequency: '',
        magnitude: '',
      },
    },
    {
      setFrequency: ({inProgressFrequency}) => (frequency: string) => ({
        inProgressFrequency: {
          ...inProgressFrequency,
          frequency,
        }
      }),
      setMagnitude: ({inProgressFrequency}) => (magnitude: string) => ({
        inProgressFrequency: {
          ...inProgressFrequency,
          magnitude,
        }
      }),
    },
  ),
  addHandlers({
    save: ({onSave, inProgressFrequency}) => () => {
      onSave(inProgressFrequency)
    }
  }),
  ({save, inProgressFrequency, setFrequency, setMagnitude}) =>
    <form
      onSubmit={(event) => {
        event.preventDefault()

        save()
      }}
    >
      <label htmlFor="frequency">Frequency</label>
      <input
        type="text"
        id="frequency"
        value={inProgressFrequency.frequency}
        onChange={(event) => {
          setFrequency(event.target.value)
        }}
      />
      <label htmlFor="magnitude">Magnitude</label>
      <input
        type="text"
        id="magnitude"
        value={inProgressFrequency.magnitude}
        onChange={(event) => {
          setMagnitude(event.target.value)
        }}
      />
      <button type="submit">Submit</button>
    </form>
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
