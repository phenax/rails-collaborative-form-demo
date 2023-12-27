import { useEffect, useState } from 'react'
import { useFormContext } from './useFormContext';

type DocUser = { name: string, id: string, focus?: string }

export const useSetupUser = (getUser: () => DocUser) => {
  const { provider } = useFormContext();

  useEffect(() => {
    if (provider && !provider.awareness.getLocalState()?.user) {
      provider.awareness.setLocalStateField('user', { focus: '', ...getUser() })
    }
  }, [provider, getUser]);
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
    provider?.awareness.setLocalStateField('user', {
      ...provider?.awareness.getLocalState()?.user,
      focus: fieldPath,
    })
  }

  const onBlur = () => {
    provider?.awareness.setLocalStateField('user', {
      ...provider?.awareness.getLocalState()?.user,
      focus: '',
    })
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
      setUsers(
        awStates
          .filter(v => v.user.id !== self.id && v.user?.focus === fieldPath)
          .map((v: any) => v.user)
      )
    };

    provider.awareness.on('update', onUpdate)
    return () => provider.awareness.off('update', onUpdate);
  }, [provider, fieldPath, setUsers]);

  return users;
}
