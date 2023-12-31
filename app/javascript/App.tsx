import React from 'react'
import { useYForm } from './hooks/y-form';
import { formCtx, useFormContext } from './hooks/useFormContext';
import { EditPeopleForm } from './components/EditPeople';
import { FormHeader } from './components/FormHeader';
import { CollabTextInput } from './components/CollabInputs';
import { PresentsForm } from './components/PresentsForm';

export const MyForm: React.FC = () => {
  const { root } = useFormContext();

  return (
    <div className="py-1">
      <CollabTextInput root={root} name="description" placeholder="Description" />

      <PresentsForm />

      <EditPeopleForm />
    </div>
  )
}

export const App = () => {
  const yForm = useYForm('FormChannel', 'thisdocid');

  return (
    <formCtx.Provider value={yForm}>
      {yForm.isReady ? (
        <div className="max-w-4xl m-auto p-2">
          <FormHeader />
          <MyForm />
        </div>
      ) : (<div>Loading...</div>)}
    </formCtx.Provider>
  )
}
