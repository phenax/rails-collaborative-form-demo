import React from 'react'
import { FormProvider, useYTextField } from '../y-form';

export const MyForm: React.FC = () => {
  const field = useYTextField('name');

  return <input type="text" {...field.props} />
}

export const App = () => {
  return (
    <FormProvider>
      <div className="App">
        <h1>Form</h1>
        <MyForm />
      </div>
    </FormProvider>
  )
}

