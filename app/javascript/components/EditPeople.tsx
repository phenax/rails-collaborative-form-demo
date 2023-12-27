import React from 'react'
import { useYFieldArray, useYTextField } from '../hooks/y-form';
import { FieldRecord, useFormContext, } from '../hooks/useFormContext';
import * as Y from 'yjs'

export const EditPerson: React.FC<{ root: FieldRecord, deleteItem: () => void }> = ({ root, deleteItem }) => {
  const nameField = useYTextField(root, 'name');
  const professionField = useYTextField(root, 'profession');

  return (
    <div>
      <input type="text" name="name" {...nameField.props} />
      <input type="text" name="profession" {...professionField.props} />
      <button onClick={deleteItem}>DEL</button>
    </div>
  )
}

export const EditPeopleForm: React.FC = () => {
  const { root } = useFormContext();
  const peopleField = useYFieldArray(root, 'people');

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
