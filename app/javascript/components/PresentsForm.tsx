import React from 'react'
import { useYArrayField } from '../hooks/y-form';
import { useFormContext } from '../hooks/useFormContext';
import { CollabTextInput } from './CollabInputs';
import * as Y from 'yjs'

export const PresentsForm: React.FC = () => {
  const { root } = useFormContext();
  const presentsArrayField = useYArrayField(root, 'presents');

  return (
    <div className="mt-2 pt-6">
      <h2 className="text-xl pb-2">Presents</h2>
      {presentsArrayField.array.map((item, index) => (
        <div key={item.id} className="flex gap-4 relative px-2 pb-2">
          <CollabTextInput root={item} name="description" placeholder="Present description (Eg: PS5 or lump of coal)" />

          <div className="pt-6">
            <button
              onClick={() => presentsArrayField.delete(index)}
              className="bg-gray-300 p-1.5"
              style={{ fontSize: '7px' }}
              title="Delete this present"
            >❌</button>
          </div>
        </div>
      ))}

      <div className="text-right pt-2">
        <button
          className="px-2 py-1 bg-blue-600 text-white"
          onClick={() => presentsArrayField.append({ description: new Y.Text() })}
        >+ Add</button>
      </div>
    </div>
  )
}
