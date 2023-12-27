import React from 'react'
import { useYArrayField } from '../hooks/y-form';
import { FieldRecord, useFormContext, } from '../hooks/useFormContext';
import * as Y from 'yjs'
import { CollabNumberInput, CollabSelectInput, CollabTextInput } from './CollabInputs';


export const EditPerson: React.FC<{ root: FieldRecord, deleteItem: () => void }> = ({ root, deleteItem }) => {
  const options = [
    { value: '', text: 'Select a thing' },
    { value: '1', text: 'One' },
    { value: '2', text: 'Two' },
    { value: '3', text: 'Three' },
    { value: '4', text: 'Four' },
    { value: '5', text: 'Five' },
  ]

  return (
    <div className="relative">
      <div className="px-6 pt-2 pb-6 w-full">
        <div className="flex justify-stretch gap-2">
          <CollabTextInput root={root} name="name" placeholder="Eg: Emploice Muswushands" />
          <CollabTextInput root={root} name="profession" placeholder="Eg: Armpit inspector" />
        </div>

        <div className="flex justify-stretch gap-2">
          <CollabNumberInput root={root} name="age" />
          <CollabSelectInput root={root} name="justValue" options={options} />
        </div>
      </div>

      <div className="absolute top-0 right-0">
        <button
          onClick={deleteItem}
          className="bg-gray-300 p-1.5"
          style={{ fontSize: '7px' }}
          title="Delete this person"
        >❌</button>
      </div>
    </div>
  )
}

export const EditPeopleForm: React.FC = () => {
  const { root } = useFormContext();
  const peopleField = useYArrayField(root, 'people');

  return (
    <div className="pt-4">
      <h2 className="text-xl py-3">People</h2>
      {peopleField.array.map((item, index) => (
        <div key={item.id} className="border bg-gray-100 mb-4">
          <EditPerson
            root={item}
            deleteItem={() => peopleField.delete(index)}
          />
        </div>
      ))}

      <div className="text-right">
        <button
          className="px-2 py-1 bg-blue-600 text-white"
          onClick={() => peopleField.append({ name: new Y.Text(), profession: new Y.Text() })}
        >+ Add</button>
      </div>
    </div>
  )
}
