import React, { useCallback, useEffect } from 'react'
import { useYArrayField } from '../hooks/y-form';
import { FieldRecord, useFormContext, } from '../hooks/useFormContext';
import * as Y from 'yjs'
import { CollabNumberInput, CollabSelectInput, CollabTextInput } from './CollabInputs';
import { useYObserverPath } from '../hooks/useYObserver';

const verdictOptions = [
  { value: '', text: 'Select a verdict' },
  { value: 'Naughty', text: 'Naughty' },
  { value: 'Nice', text: 'Nice' },
]

export const DeedForm: React.FC<{ root: FieldRecord, deleteItem: () => void }> = ({ root, deleteItem }) => {
  return (
    <div className="grid grid-cols-12 gap-4 mb-2">
      <div className="col-span-8">
        <CollabTextInput root={root} name="description" placeholder="Deed (Eg: Picked their nose in public)" />
      </div>
      <div className="col-span-3">
        <CollabSelectInput root={root} name="verdict" options={verdictOptions} />
      </div>
      <div className="flex items-center justify-center">
        <button
          onClick={deleteItem}
          className="bg-gray-300 p-1.5 mt-4"
          style={{ fontSize: '7px' }}
          title="Delete this deed"
        >❌</button>
      </div>
    </div>
  )
}

export const EditPerson: React.FC<{ root: FieldRecord, deleteItem: () => void }> = ({ root, deleteItem }) => {
  const deedsArrayField = useYArrayField(root, 'deeds');
  const { root: formRoot } = useFormContext();

  const [presentOptions, setPresentOptions] = React.useState<{ value: string, text: string }[]>([]);

  const updatePresents = useCallback(() => {
    const values = formRoot.record?.get('presents')?.map?.((item: any) => {
      const desc = item.get('description').toString()
      return { value: desc, text: desc }
    })
    setPresentOptions([{ value: '', text: 'Select a present' }, ...values])
  }, [formRoot.record])

  useEffect(() => updatePresents(), [formRoot.record])
  useYObserverPath(formRoot.record, ['presents', '*', 'description'], updatePresents)

  return (
    <div className="relative">
      <div className="px-6 pt-2 pb-6 w-full">
        <div className="flex justify-stretch gap-2">
          <CollabTextInput root={root} name="name" placeholder="Name (Eg: Emploice Muswushands)" />
          <CollabTextInput root={root} name="profession" placeholder="Profession (Eg: Armpit inspector)" />
        </div>

        <div className="flex justify-stretch gap-2">
          <CollabNumberInput root={root} name="age" placeholder="Age (Eg: 45)" />
          <CollabSelectInput root={root} name="present" options={presentOptions} />
        </div>

        <div className="border border-gray-300 mt-4 py-2 px-4">
          <h3>Deeds</h3>
          {deedsArrayField.length === 0 && <div className="text-slate-500 text-sm text-center">[No deeds yet]</div>}
          {deedsArrayField.array.map((item, index) => (
            <DeedForm
              root={item}
              key={item.id}
              deleteItem={() => deedsArrayField.delete(index)}
            />
          ))}

          <div className="text-right pt-4">
            <button
              className="px-2 py-1 text-xs border border-blue-600 text-blue-600"
              onClick={() => deedsArrayField.append({ description: new Y.Text() })}
            >+ Add</button>
          </div>
        </div>
      </div>

      <div className="absolute top-0 right-0">
        <button
          onClick={deleteItem}
          className="bg-gray-300 p-1.5"
          style={{ fontSize: '7px' }}
          title="Delete this person"
        >❌</button>
      </div>
    </div>
  )
}

export const EditPeopleForm: React.FC = () => {
  const { root } = useFormContext();
  const peopleArrayField = useYArrayField(root, 'people');

  return (
    <div className="pt-4">
      <h2 className="text-xl py-3">People</h2>
      {peopleArrayField.array.map((item, index) => (
        <div key={item.id} className="border bg-gray-50 mb-4">
          <EditPerson
            root={item}
            deleteItem={() => peopleArrayField.delete(index)}
          />
        </div>
      ))}

      <div className="text-right">
        <button
          className="px-2 py-1 bg-blue-600 text-white"
          onClick={() => peopleArrayField.append({ name: new Y.Text(), profession: new Y.Text(), deeds: new Y.Array() })}
        >+ Add</button>
      </div>
    </div>
  )
}
