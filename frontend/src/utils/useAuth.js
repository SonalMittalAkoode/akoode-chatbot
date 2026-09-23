import { useEffect } from 'react';
import { useRouter, useParams } from "next/navigation";

export default function useAuth() {
  const router = useRouter();

  useEffect(() => {
    const token = sessionStorage.getItem('user');
    if (!token) {
      router.replace('/thebusinesshub'); // redirect to login if no token
    }
  }, []);
}
