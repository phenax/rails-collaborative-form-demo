import React from 'react'
import { FieldRecord, formCtx, useFormContext, useYFieldArray, useYForm, useYTextField } from '../y-form';
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

export const PeopleForm: React.FC = () => {
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

export const MyForm: React.FC = () => {
  const { root } = useFormContext();
  const descField = useYTextField(root, 'description');

  return (
    <div>
      <input type="text" name="description" {...descField.props} />
      <PeopleForm />
    </div>
  )
}

export const App = () => {
  const yForm = useYForm();

  return (
    <formCtx.Provider value={yForm}>
      {yForm.isReady && (
        <div className="App">
          <h1>Form</h1>
          <MyForm />
        </div>
      )}
    </formCtx.Provider>
  )
}
