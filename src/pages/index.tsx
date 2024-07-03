import LoadingPage from '@/components/loading';
import withAuth from '@/components/withAuth';
import { auth } from '@/services/firebaseConfig';
import { useSignOut } from 'react-firebase-hooks/auth';

const SignOut = () => {
  const [signOut, loading] = useSignOut(auth);

  if (loading) {
    return <LoadingPage/>;
  }

  return (
    <div className="App">
      <button
        onClick={async () => {
          const success = await signOut();
          if (success) {
            alert('Logout com sucesso');
          }
        }}
      >
        Sair
      </button>
    </div>
  );
};

export default withAuth(SignOut);
