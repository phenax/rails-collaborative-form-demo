import React from 'react'
import { useActiveUsers, useSetupUser } from '../hooks/awareness';

export const ActiveUsers: React.FC = () => {
  const activeUsers = useActiveUsers();

  return (
    <div className="flex gap-2 text-xs">
      <div className="border-2 border-transparent">Active users:</div>
      <div className="flex gap-2">
        {activeUsers.users.map(user => (
          <div key={user.id} title={user.name} className="border-2 px-1" style={{ borderColor: user.color, color: user.color }}>
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
    <div className="py-4">
      <h1 className="text-4xl">Santa's collaborative list</h1>
      <ActiveUsers />
    </div>
  )
}

export const getRandomUser = () => {
  const id = `${Math.random()}`;
  const firstNames = [
    'Haskell',
    'JS',
    'TS',
    'Rust',
    'BQN',
    'APL',
    'Uiua',
    'Nix',
    'Lisp',
    'Idris',
    'Agda',
    'Coq',
    'Lua',
    'C',
    'Elixir',
    'Go',
    'Ruby',
    'Kotlin',
    'Scala',
    'R',
    'Dart',
    'Erlang',
    'Clojure',
    'F#',
    'OCaml',
    'Racket',
    'Zig',
    'Prolog',
    'Crystal',
  ]

  const lastNames = [
    'Sucks',
    'Rocks',
    'Educates',
    'Procreates',
    'Kills',
    'Explains',
    'Massages',
    'Sings',
    'Skates',
    'Bullies',
    'Stabs',
    'Punches',
    'Kisses',
  ]

  const colors = [
    '#ef4444',
    '#f97316',
    '#eab308',
    '#84cc16',
    '#14b8a6',
    '#0ea5e9',
    '#6366f1',
    '#a855f7',
    '#f43f5e',
    '#500724',
    '#172554',
    '#052e16',
    '#1e293b',
  ]

  const fn = firstNames[Math.floor(Math.random() * firstNames.length)]
  const ln = lastNames[Math.floor(Math.random() * lastNames.length)]
  const c = colors[Math.floor(Math.random() * colors.length)]

  return {
    id,
    name: `${fn} ${ln}`,
    color: c,
    focus: '',
  }
}
