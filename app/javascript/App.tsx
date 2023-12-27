import React from 'react'
import { useYForm, useYTextField } from './hooks/y-form';
import { formCtx, useFormContext } from './hooks/useFormContext';
import { EditPeopleForm } from './components/EditPeople';
import { FormHeader } from './components/FormHeader';

export const MyForm: React.FC = () => {
  const { root } = useFormContext();
  const descField = useYTextField(root, 'description');

  return (
    <div style={{ padding: '1rem 0' }}>
      <input type="text" name="description" {...descField.props} />
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
