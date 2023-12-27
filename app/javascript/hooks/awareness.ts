import { useEffect, useState } from 'react'
import { useFormContext } from './useFormContext';

type DocUser = { name: string, id: string }

export const useSetupUser = (getUser: () => DocUser) => {
  const { provider } = useFormContext();

  useEffect(() => {
    if (provider && !provider.awareness.getLocalState()?.user) {
      provider.awareness.setLocalStateField('user', getUser())
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
