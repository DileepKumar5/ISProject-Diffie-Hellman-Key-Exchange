"use client";
import { useState } from 'react';
import Link from 'next/link';

const isPrime = (num: number): boolean => {
  if (num <= 1) return false;
  if (num <= 3) return true;
  if (num % 2 === 0 || num % 3 === 0) return false;
  for (let i = 5; i * i <= num; i += 6) {
    if (num % i === 0 || num % (i + 2) === 0) return false;
  }
  return true;
};

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

const DiffieHellman = () => {
  const [n, setN] = useState<number | null>(null);
  const [g, setG] = useState<number | null>(null);
  const [adhKey, setAdhKey] = useState<number | null>(null);
  const [owaisKey, setOwaisKey] = useState<number | null>(null);
  const [adhPublicKey, setAdhPublicKey] = useState<number | null>(null);
  const [owaisPublicKey, setOwaisPublicKey] = useState<number | null>(null);
  const [adhSecretKey, setAdhSecretKey] = useState<number | null>(null);
  const [owaisSecretKey, setOwaisSecretKey] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [reason, setReason] = useState<number[] | null>(null);
  const [showSteps, setShowSteps] = useState<boolean>(false);

  const computeKeys = () => {
    if (!n || !g || !adhKey || !owaisKey) {
      setError("Please fill in all fields.");
      setAdhPublicKey(null);
      setOwaisPublicKey(null);
      setAdhSecretKey(null);
      setOwaisSecretKey(null);
      setReason(null);
      return;
    }
    if (!isPrime(n) || !isPrime(g)) {
      setError("n and g must be prime numbers.");
      setAdhPublicKey(null);
      setOwaisPublicKey(null);
      setAdhSecretKey(null);
      setOwaisSecretKey(null);
      setReason(null);
      return;
    }
    const [isRoot, steps] = isPrimitiveRoot(g, n);
    if (!isRoot) {
      setError("g must be a primitive root of n.");
      setReason(steps);
      setAdhPublicKey(null);
      setOwaisPublicKey(null);
      setAdhSecretKey(null);
      setOwaisSecretKey(null);
      return;
    }
    if (n <= 0 || g <= 0 || adhKey <= 0 || owaisKey <= 0) {
      setError("All values must be positive.");
      setAdhPublicKey(null);
      setOwaisPublicKey(null);
      setAdhSecretKey(null);
      setOwaisSecretKey(null);
      setReason(null);
      return;
    }

    const adhPubKey = Math.pow(g, adhKey) % n;
    const owaisPubKey = Math.pow(g, owaisKey) % n;

    setAdhPublicKey(adhPubKey);
    setOwaisPublicKey(owaisPubKey);

    const adhSecKey = Math.pow(owaisPubKey, adhKey) % n;
    const owaisSecKey = Math.pow(adhPubKey, owaisKey) % n;

    setAdhSecretKey(adhSecKey);
    setOwaisSecretKey(owaisSecKey);
    setError(null);
    setReason(null);
    setShowSteps(false); // Reset the steps visibility
  };

  const toggleSteps = () => {
    setShowSteps(!showSteps);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-gray-100">
      <h1 className="text-4xl font-bold mb-8">Diffie-Hellman Key Exchange</h1>
      <div className="w-full max-w-md p-4 bg-white rounded-lg shadow-md">
        <div className="mb-4">
          <label className="block text-gray-700">Enter n (must be a prime number):</label>
          <input
            type="number"
            value={n || ''}
            onChange={(e) => setN(Number(e.target.value))}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Enter g (must be a prime number and a primitive root of n):</label>
          <input
            type="number"
            value={g || ''}
            onChange={(e) => setG(Number(e.target.value))}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Enter ADH's private key:</label>
          <input
            type="number"
            value={adhKey || ''}
            onChange={(e) => setAdhKey(Number(e.target.value))}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Enter Owais's private key:</label>
          <input
            type="number"
            value={owaisKey || ''}
            onChange={(e) => setOwaisKey(Number(e.target.value))}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>
        <button
          onClick={computeKeys}
          className="w-full px-4 py-2 font-bold text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
        >
          Compute Keys
        </button>
        {error && <p className="mt-4 text-red-600">{error}</p>}
        {reason && (
          <div className="mt-4 text-left">
            <p className="text-red-600 font-bold mb-2">Calculations:</p>
            <ul className="list-disc list-inside text-red-600">
              {reason.map((step, index) => (
                <li key={index}>{`${g}^${index + 1} mod ${n} = ${step}`}</li>
              ))}
            </ul>
          </div>
        )}
        {adhPublicKey !== null && (
          <div className="mt-4">
            <p className="text-gray-700">ADH Sends: {adhPublicKey}</p>
            <p className="text-gray-700">Owais Sends: {owaisPublicKey}</p>
            <p className="text-gray-700">ADH's Secret Key: {adhSecretKey}</p>
            <p className="text-gray-700">Owais's Secret Key: {owaisSecretKey}</p>
            <button
              onClick={toggleSteps}
              className="mt-4 w-full px-4 py-2 font-bold text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              {showSteps ? "Hide Detailed Steps" : "Show Detailed Steps"}
            </button>
            {showSteps && (
              <div className="mt-4 text-left">
                <p className="text-gray-700 font-bold mb-2">Steps:</p>
                <ul className="list-disc list-inside text-gray-700">
                  {[
                    `ADH computes ADH's public key as g^x mod n = ${g}^${adhKey} mod ${n} = ${adhPublicKey}`,
                    `Owais computes Owais's public key as g^y mod n = ${g}^${owaisKey} mod ${n} = ${owaisPublicKey}`,
                    `ADH computes the shared secret key as Owais's public key^x mod n = ${owaisPublicKey}^${adhKey} mod ${n} = ${adhSecretKey}`,
                    `Owais computes the shared secret key as ADH's public key^y mod n = ${adhPublicKey}^${owaisKey} mod ${n} = ${owaisSecretKey}`,
                  ].map((step, index) => (
                    <li key={index}>{step}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
        <div className="mt-4">
          <Link href="/" className="w-full px-4 py-2 font-bold text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-600 text-center block">
            Back to Welcome Page
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DiffieHellman;
