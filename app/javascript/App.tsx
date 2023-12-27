import React from 'react'
import { useYForm } from './hooks/y-form';
import { formCtx, useFormContext } from './hooks/useFormContext';
import { EditPeopleForm } from './components/EditPeople';
import { FormHeader } from './components/FormHeader';
import { CollabTextInput } from './components/CollabInputs';

export const MyForm: React.FC = () => {
  const { root } = useFormContext();

  return (
    <div style={{ padding: '1rem 0' }}>
      <CollabTextInput root={root} name="description" />
      <EditPeopleForm />
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
