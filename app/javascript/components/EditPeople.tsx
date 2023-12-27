import React from 'react'
import { useYArrayField, useYTextField, useYValueField } from '../hooks/y-form';
import { FieldRecord, useFormContext, } from '../hooks/useFormContext';
import * as Y from 'yjs'

export const EditPerson: React.FC<{ root: FieldRecord, deleteItem: () => void }> = ({ root, deleteItem }) => {
  const nameField = useYTextField(root, 'name');
  const professionField = useYTextField(root, 'profession');
  const ageField = useYValueField(root, 'age');
  const valueField = useYValueField(root, 'justValue');

  return (
    <div>
      <input type="text" {...nameField.props} />
      <input type="text" {...professionField.props} />
      <input type="number" {...ageField.props} />
      <select {...valueField.props}>
        <option>Select plis</option>
        <option value="1">ONE</option>
        <option value="2">TWO</option>
        <option value="3">THREE</option>
      </select>

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
