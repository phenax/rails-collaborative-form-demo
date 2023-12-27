import React, { InputHTMLAttributes } from 'react'
import { useYTextField, useYValueField } from '../hooks/y-form';
import { FieldRecord } from '../hooks/useFormContext';
import { useActiveUsersOnField } from '../hooks/awareness';

export const ActiveUsersDisplay: React.FC<{ path: string }> = ({ path }) => {
  const activeUsers = useActiveUsersOnField(path)

  return (
    <div className="flex justify-end gap-2 text-sm">
      &nbsp; {activeUsers.map(u => <div key={u.id}>{u.name}</div>)}
    </div>
  )
}

export const CollabTextInput: React.FC<{ root: FieldRecord, name: string } & InputHTMLAttributes<HTMLInputElement>> = ({ root, name, ...props }) => {
  const field = useYTextField(root, name);

  return (
    <div className="w-full">
      <ActiveUsersDisplay path={field.fieldPath} />
      <input type="text" className="block w-full" {...props} {...field.props} />
    </div>
  )
}

export const CollabNumberInput: React.FC<{ root: FieldRecord, name: string }> = ({ root, name }) => {
  const field = useYValueField(root, name, 18);

  return (
    <div className="w-full">
      <ActiveUsersDisplay path={field.fieldPath} />
      <input type="number" className="block w-full" {...field.props} />
    </div>
  )
}
export const CollabSelectInput: React.FC<{
  root: FieldRecord;
  name: string;
  options: { value: string, text: string }[];
}> = ({ root, name, options }) => {
  const field = useYValueField(root, name, options[0]?.value);

  return (
    <div className="w-full">
      <ActiveUsersDisplay path={field.fieldPath} />
      <select className="block w-full" {...field.props}>
        {options.map(o => (
          <option key={o.value} value={o.value}>{o.text}</option>
        ))}
      </select>
    </div>
  )
}
