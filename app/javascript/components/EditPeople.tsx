import React from 'react'
import { useYArrayField } from '../hooks/y-form';
import { FieldRecord, useFormContext, } from '../hooks/useFormContext';
import * as Y from 'yjs'
import { CollabNumberInput, CollabSelectInput, CollabTextInput } from './CollabInputs';


export const EditPerson: React.FC<{ root: FieldRecord, deleteItem: () => void }> = ({ root, deleteItem }) => {
  const options = [
    { value: '1', text: 'One' },
    { value: '2', text: 'Two' },
    { value: '3', text: 'Three' },
    { value: '4', text: 'Four' },
    { value: '5', text: 'Five' },
  ]

  return (
    <div style={{ padding: '1rem 0' }}>
      <CollabTextInput root={root} name="name" />
      <CollabTextInput root={root} name="profession" />

      <CollabNumberInput root={root} name="age" />

      <CollabSelectInput root={root} name="justValue" options={options} />

      <button onClick={deleteItem}>DEL</button>
    </div>
  )
}

export const EditPeopleForm: React.FC = () => {
  const { root } = useFormContext();
  const peopleField = useYArrayField(root, 'people');

  return (
    <div>
      <h2>People <button onClick={() => peopleField.append({ name: new Y.Text(), profession: new Y.Text() })}>+ Add</button></h2>
      {peopleField.array.map((item, index) => (
        <div key={item.id}>
          <EditPerson root={item} deleteItem={() => peopleField.delete(index)} />
        </div>
      ))}
    </div>
  )
}
