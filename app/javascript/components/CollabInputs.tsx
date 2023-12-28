import React, { InputHTMLAttributes } from 'react'
import { useYTextField, useYValueField } from '../hooks/y-form';
import { FieldRecord } from '../hooks/useFormContext';
import { useActiveUsersOnField } from '../hooks/awareness';

export const ActiveUsersDisplay: React.FC<{ path: string }> = ({ path }) => {
  const activeUsers = useActiveUsersOnField(path)

  return (
    <div className="flex justify-end gap-2 text-xs">
      <div className="border border-transparent">&nbsp;</div>
      {activeUsers.map(u => <div
        key={u.id}
        className="border px-1"
        style={{ borderColor: u.color, color: u.color }}
      >{u.shortName}</div>)}
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

export const CollabNumberInput: React.FC<{ root: FieldRecord, name: string } & InputHTMLAttributes<HTMLInputElement>> = ({ root, name, ...props }) => {
  const field = useYValueField(root, name);

  return (
    <div className="w-full">
      <ActiveUsersDisplay path={field.fieldPath} />
      <input type="number" className="block w-full" {...props} {...field.props} />
    </div>
  )
}

export const SelectInput: React.FC<{
  name: string;
  options: { value: string, text: string }[];
} & InputHTMLAttributes<HTMLSelectElement>> = ({ options, ...props }) => {
  return (
    <select className="block w-full" {...props}>
      {options.map((o, i) => (
        <option
          key={i}
          value={o.value}
          className={!o.value ? 'text-slate-500' : ''}
        >{o.text}</option>
      ))}
    </select>
  )
}

export const CollabSelectInput: React.FC<{
  root: FieldRecord;
  name: string;
  options: { value: string, text: string }[];
} & InputHTMLAttributes<HTMLSelectElement>> = ({ root, name, options, ...selectProps }) => {
  const field = useYValueField(root, name, options[0]?.value);

  return (
    <div className="w-full">
      <ActiveUsersDisplay path={field.fieldPath} />
      <SelectInput {...selectProps} {...field.props} options={options} />
    </div>
  )
}
