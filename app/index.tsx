import {
    useCallback,
    useState,
} from 'react';

import { AppSplash } from '@/features/auth/components/AppSplash';
import { LoginForm } from '@/features/auth/components/LoginForm';

export default function Index() {
  const [
    mostrandoSplash,
    setMostrandoSplash,
  ] = useState(true);

  const finalizarSplash =
    useCallback(() => {
      setMostrandoSplash(false);
    }, []);

  if (mostrandoSplash) {
    return (
      <AppSplash
        onFinish={
          finalizarSplash
        }
      />
    );
  }

  return <LoginForm />;
}