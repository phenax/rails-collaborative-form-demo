import React from 'react'
import { useActiveUsers, useSetupUser } from '../hooks/awareness';

export const ActiveUsers: React.FC = () => {
  const activeUsers = useActiveUsers();

  return (
    <div style={{ display: 'flex', gap: '10px' }}>
      <div>Active users:</div>
      <div style={{ display: 'flex', gap: '5px' }}>
        {activeUsers.users.map(user => (
          <div key={user.id} title={user.name} style={{ border: '1px solid gray' }}>
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
    <div>
      <h1>Form</h1>
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
    'Is Cool',
    'Is Drunk',
    'Kills',
  ]

  const fn = firstNames[Math.floor(Math.random() * firstNames.length)]
  const ln = lastNames[Math.floor(Math.random() * lastNames.length)]

  return { id, name: `${fn} ${ln}` }
}
