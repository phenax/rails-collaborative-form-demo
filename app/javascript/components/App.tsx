import React from 'react'
import { FieldRecord, formCtx, useActiveUsers, useFormContext, useSetupUser, useYFieldArray, useYForm, useYTextField } from '../y-form';
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
    <div style={{ padding: '1rem 0' }}>
      <input type="text" name="description" {...descField.props} />
      <PeopleForm />
    </div>
  )
}

export const getRandomUser = () => {
  const id = `${Math.random()}`;
  const names = ['Haskell', 'JavaScript', 'TypeScript', 'Rust', 'BQN', 'APL', 'Uiua', 'Nix', 'Lisp', 'Idris', 'Agda', 'Coq', 'Lua', 'C', 'Elixir', 'Go', 'CoffeeScript', 'Ruby', 'Kotlin', 'Scala', 'R', 'Dart', 'Erlang', 'Clojure', 'F#', 'OCaml', 'Racket', 'Zig', 'Prolog', 'Crystal']

  return { id, name: names[Math.floor(Math.random() * names.length)] }
}

export const ActiveUsers: React.FC = () => {
  const activeUsers = useActiveUsers();

  return (
    <div style={{ display: 'flex', gap: '10px' }}>
      <div>Active users:</div>
      <div style={{ display: 'flex', gap: '5px' }}>
        {activeUsers.users.map(user => (
          <div key={user.id} title={user.name} style={{ border: '1px solid gray' }}>
            {activeUsers.self?.id === user.id ? `Me (${user.name})` : user.name}
          </div>
        ))}
      </div>
    </div>
  )
}

export const FormHeader: React.FC = () => {
  useSetupUser(getRandomUser);

  return (
    <div>
      <h1>Form</h1>
      <ActiveUsers />
    </div>
  )
}

export const App = () => {
  const yForm = useYForm();

  return (
    <formCtx.Provider value={yForm}>
      {yForm.isReady && (
        <div className="App">
          <FormHeader />
          <MyForm />
        </div>
      )}
    </formCtx.Provider>
  )
}
