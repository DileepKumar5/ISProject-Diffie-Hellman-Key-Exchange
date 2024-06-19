"use client";
import { useState } from 'react';

const gcd = (a: number, b: number): number => {
  while (b) {
    [a, b] = [b, a % b];
  }
  return a;
};

const eulerTotient = (n: number): number => {
  let result = 1;
  for (let i = 2; i < n; i++) {
    if (gcd(i, n) === 1) {
      result++;
    }
  }
  return result;
};

const isPrimitiveRoot = (g: number, n: number): [boolean, number[]] => {
  const steps: number[] = [];
  const requiredSet = new Set<number>();
  const totient = eulerTotient(n);

  for (let i = 1; i < n; i++) {
    const value = Math.pow(g, i) % n;
    steps.push(value);
    requiredSet.add(value);
  }

  return [requiredSet.size === totient, steps];
};

const PrimitiveRoot = () => {
  const [n, setN] = useState<number | null>(null);
  const [g, setG] = useState<number | null>(null);
  const [result, setResult] = useState<[boolean, number[]] | null>(null);

  const handleCalculate = () => {
    if (n && g) {
      const [isRoot, steps] = isPrimitiveRoot(g, n);
      setResult([isRoot, steps]);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-gray-100">
      <h1 className="text-4xl font-bold mb-8">Primitive Root Calculator</h1>
      <div className="w-full max-w-md p-4 bg-white rounded-lg shadow-md">
        <div className="mb-4">
          <label className="block text-gray-700">Enter n:</label>
          <input
            type="number"
            value={n || ''}
            onChange={(e) => setN(Number(e.target.value))}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Enter g:</label>
          <input
            type="number"
            value={g || ''}
            onChange={(e) => setG(Number(e.target.value))}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>
        <button
          onClick={handleCalculate}
          className="w-full px-4 py-2 font-bold text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
        >
          Calculate Primitive Root
        </button>
        {result && (
          <div className="mt-4 text-center">
            <p className="text-gray-700 font-bold mb-4">
              {result[0]
                ? `${g} is a primitive root of ${n}`
                : `${g} is not a primitive root of ${n}`}
            </p>
            <p className="text-gray-700 font-bold mb-2 text-left">Steps:</p>
            <ul className="list-disc list-inside text-left">
              {result[1].map((step, index) => (
                <li key={index}>{`${g}^${index + 1} mod ${n} = ${step}`}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default PrimitiveRoot;
