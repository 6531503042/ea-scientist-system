import { redirect } from 'next/navigation';

// Root ให้ redirect ไป dashboard ตามโครง Next.js ใหม่
export default function HomePage() {
  redirect('/dashboard');
}
