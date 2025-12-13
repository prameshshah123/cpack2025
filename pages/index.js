import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Home() {
  const router = useRouter();
  
  useEffect(() => {
    router.push('/products');
  }, [router]);
  
  return <div>Redirecting to products...</div>;
}
