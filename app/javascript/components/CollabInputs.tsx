import React from 'react'
import { useYTextField, useYValueField } from '../hooks/y-form';
import { FieldRecord } from '../hooks/useFormContext';
import { useActiveUsersOnField } from '../hooks/awareness';

export const ActiveUsersDisplay: React.FC<{ path: string }> = ({ path }) => {
  const activeUsers = useActiveUsersOnField(path)

  return (
    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '5px', fontSize: '10px' }}>
      &nbsp; {activeUsers.map(u => <div key={u.id}>{u.name}</div>)}
    </div>
  )
}

export const CollabTextInput: React.FC<{ root: FieldRecord, name: string }> = ({ root, name }) => {
  const field = useYTextField(root, name);

  return (
    <div>
      <ActiveUsersDisplay path={field.fieldPath} />
      <input type="text" style={{ display: 'block', width: '100%' }} {...field.props} />
    </div>
  )
}

export const CollabNumberInput: React.FC<{ root: FieldRecord, name: string }> = ({ root, name }) => {
  const field = useYValueField(root, name);

  return (
    <div>
      <ActiveUsersDisplay path={field.fieldPath} />
      <input type="number" style={{ display: 'block', width: '100%' }} {...field.props} />
    </div>
  )
}
export const CollabSelectInput: React.FC<{
  root: FieldRecord;
  name: string;
  options: { value: string, text: string }[];
}> = ({ root, name, options }) => {
  const field = useYValueField(root, name);

  return (
    <div>
      <ActiveUsersDisplay path={field.fieldPath} />
      <select style={{ display: 'block', width: '100%' }} {...field.props}>
        {options.map(o => (
          <option key={o.value} value={o.value}>{o.text}</option>
        ))}
      </select>
    </div>
  )
}
