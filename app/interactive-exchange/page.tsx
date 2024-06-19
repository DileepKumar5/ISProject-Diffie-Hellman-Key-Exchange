"use client";
import Link from 'next/link';
import { useState } from 'react';
import ChatWindow from '../components/ChatWindow';

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

const isPrimitiveRoot = (g: number, n: number): boolean => {
  const requiredSet = new Set<number>();
  const totient = eulerTotient(n);

  for (let i = 1; i < n; i++) {
    requiredSet.add(Math.pow(g, i) % n);
  }

  return requiredSet.size === totient;
};

const InteractiveExchange = () => {
  const [n, setN] = useState<number | null>(null);
  const [g, setG] = useState<number | null>(null);
  const [adhKey, setAdhKey] = useState<number | null>(null);
  const [owaisKey, setOwaisKey] = useState<number | null>(null);
  const [adhPublicKey, setAdhPublicKey] = useState<number | null>(null);
  const [owaisPublicKey, setOwaisPublicKey] = useState<number | null>(null);
  const [adhSecretKey, setAdhSecretKey] = useState<number | null>(null);
  const [owaisSecretKey, setOwaisSecretKey] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [adhMessages, setAdhMessages] = useState<string[]>([]);
  const [owaisMessages, setOwaisMessages] = useState<string[]>([]);
  const [secretKeySteps, setSecretKeySteps] = useState<string[]>([]);

  const handleOwaisPublicKey = () => {
    if (n === null || g === null || owaisKey === null) {
      setError("Please fill in all fields.");
      return;
    }
    if (!isPrime(n) || !isPrime(g)) {
      setError("n and g must be prime numbers.");
      return;
    }
    if (!isPrimitiveRoot(g, n)) {
      setError("g must be a primitive root of n.");
      return;
    }
    if (n <= 0 || g <= 0 || owaisKey <= 0) {
      setError("All values must be positive.");
      return;
    }

    const owaisPubKey = Math.pow(g, owaisKey) % n;
    setOwaisPublicKey(owaisPubKey);
    setOwaisMessages([
      `Owais computes Owais's public key as g^y mod n = ${g}^${owaisKey} mod ${n} = ${owaisPubKey}`,
      `Owais sends public key: ${owaisPubKey}`,
    ]);
    setError(null);
  };

  const handleAdhPublicKey = () => {
    if (n === null || g === null || adhKey === null || owaisPublicKey === null) {
      setError("Please fill in all fields and ensure Owais has sent their public key.");
      return;
    }

    const adhPubKey = Math.pow(g, adhKey) % n;
    setAdhPublicKey(adhPubKey);
    setAdhMessages([
      `ADH computes ADH's public key as g^x mod n = ${g}^${adhKey} mod ${n} = ${adhPubKey}`,
      `ADH sends public key: ${adhPubKey}`,
    ]);

    setError(null);
  };

  const handleComputeSecretKeys = () => {
    if (n === null || g === null || adhKey === null || owaisKey === null || adhPublicKey === null || owaisPublicKey === null) {
      setError("Please fill in all fields and compute both public keys.");
      return;
    }

    const adhSecKey = Math.pow(owaisPublicKey, adhKey) % n;
    const owaisSecKey = Math.pow(adhPublicKey, owaisKey) % n;
    setAdhSecretKey(adhSecKey);
    setOwaisSecretKey(owaisSecKey);

    setSecretKeySteps([
      `ADH computes the shared secret key as Owais's public key^x mod n = ${owaisPublicKey}^${adhKey} mod ${n} = ${adhSecKey}`,
      `Owais computes the shared secret key as ADH's public key^y mod n = ${adhPublicKey}^${owaisKey} mod ${n} = ${owaisSecKey}`,
    ]);

    setError(null);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-gray-100">
      <h1 className="text-4xl font-bold mb-8">Interactive Key Exchange</h1>
      <div className="w-full max-w-4xl p-4 bg-white rounded-lg shadow-md">
        <div className="mb-4">
          <label className="block text-gray-700">Enter n (must be a prime number):</label>
          <input
            type="number"
            value={n !== null ? n : ''}
            onChange={(e) => setN(Number(e.target.value))}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Enter g (must be a prime number and a primitive root of n):</label>
          <input
            type="number"
            value={g !== null ? g : ''}
            onChange={(e) => setG(Number(e.target.value))}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>
        {error && <p className="mt-4 text-red-600">{error}</p>}
        <div className="flex flex-row mt-4 space-x-4">
          <div className="w-1/2">
            <ChatWindow
              name="Owais"
              messages={owaisMessages}
              publicKey={owaisPublicKey}
              secretKey={owaisSecretKey}
              privateKey={owaisKey}
              onPrivateKeyChange={(e) => setOwaisKey(Number(e.target.value))}
              onComputePublicKey={handleOwaisPublicKey}
            />
          </div>
          <div className="w-1/2">
            <ChatWindow
              name="ADH"
              messages={adhMessages}
              publicKey={adhPublicKey}
              secretKey={adhSecretKey}
              privateKey={adhKey}
              onPrivateKeyChange={(e) => setAdhKey(Number(e.target.value))}
              onComputePublicKey={handleAdhPublicKey}
            />
          </div>
        </div>
        <div className="flex justify-center mt-4">
          <button
            onClick={handleComputeSecretKeys}
            className="px-4 py-2 font-bold text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            Calculate Secret Keys
          </button>
        </div>
        {secretKeySteps.length > 0 && (
          <div className="mt-4 text-left">
            <p className="text-gray-700 font-bold mb-2">Secret Key Calculation Steps:</p>
            <ul className="list-disc list-inside text-gray-700">
              {secretKeySteps.map((step, index) => (
                <li key={index}>{step}</li>
              ))}
            </ul>
          </div>
        )}
        <div className="mt-4">
          <p className="text-gray-700 font-bold">Secret Keys:</p>
          <p className="text-gray-700">ADH's Secret Key: {adhSecretKey}</p>
          <p className="text-gray-700">Owais's Secret Key: {owaisSecretKey}</p>
        </div>
        <div className="mt-4">
          <Link href="/" className="w-full px-4 py-2 font-bold text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-600 text-center block">
            Back to Welcome Page
          </Link>
        </div>
      </div>
    </div>
  );
};

export default InteractiveExchange;
