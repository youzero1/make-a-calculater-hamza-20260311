import Calculator from '@/components/Calculator';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-950">
      <h1 className="text-white text-3xl font-bold mb-8 tracking-wide">
        🧮 Calculator
      </h1>
      <Calculator />
    </main>
  );
}
