import { useEffect, useRef, useState } from 'react'
import { useFormContext } from './useFormContext';

type DocUser = { name: string, shortName: string, id: string, focus?: string, color?: string }

export const useSetupUser = (getUser: () => DocUser) => {
  const { provider } = useFormContext();
  const getUserRef = useRef(getUser);
  getUserRef.current = getUser;

  useEffect(() => {
    if (provider && !provider.awareness.getLocalState()?.user) {
      provider.awareness.setLocalStateField('user', getUserRef.current())
    }
  }, [provider]);
}

export const useActiveUsers = () => {
  const { provider } = useFormContext();
  const [selfUser, setSelfUser] = useState<DocUser | undefined>(undefined);
  const [users, setUsers] = useState<DocUser[]>([]);

  useEffect(() => {
    if (!provider) return;
    const onUpdate = () => {
      const awStates = Array.from(provider.awareness.getStates().values())
      setSelfUser(provider.awareness.getLocalState()?.user)
      setUsers(awStates.map((v: any) => v.user))
    };

    provider.awareness.on('update', onUpdate)
    return () => provider.awareness.off('update', onUpdate);
  }, [provider]);

  return { self: selfUser, users };
}

export const useUserFocus = (fieldPath: string) => {
  const { provider } = useFormContext();

  const onFocus = () => {
    const user = provider?.awareness.getLocalState()?.user;
    provider?.awareness.setLocalStateField('user', Object.assign(user, {
      focus: fieldPath,
    }))
  }

  const onBlur = () => {
    const user = provider?.awareness.getLocalState()?.user;
    provider?.awareness.setLocalStateField('user', Object.assign(user, {
      focus: '',
    }))
  }

  return { onFocus, onBlur }
}

export const useActiveUsersOnField = (fieldPath: string) => {
  const { provider } = useFormContext();
  const [users, setUsers] = useState<DocUser[]>([]);

  useEffect(() => {
    if (!provider) return;
    const onUpdate = () => {
      const awStates = Array.from(provider.awareness.getStates().values())
      const self = provider.awareness.getLocalState()?.user
      const focusUsers = awStates
        .filter(v => v.user.id !== self.id && v.user?.focus === fieldPath)
        .map((v: any) => v.user);
      if (focusUsers.length !== users.length || users.length === 0 || !focusUsers.every((v, i) => v.id === users[i].id)) {
        setUsers(focusUsers)
      }
    };

    provider.awareness.on('update', onUpdate)
    return () => provider.awareness.off('update', onUpdate);
  }, [provider, fieldPath, setUsers]);

  return users;
}
