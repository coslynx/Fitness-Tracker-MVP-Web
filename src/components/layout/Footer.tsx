'use client'

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useStore } from '@/store';
import { Button } from '@/components/common';
import { AUTH_ENDPOINT } from '@/common/constants';
import { useRouter } from 'next/navigation';

interface FooterProps {}

const Footer: React.FC<FooterProps> = () => {
  const { data: session } = useSession();
  const { setShowModal, setErrorMessage } = useStore();
  const router = useRouter();

  return (
    <footer className="bg-gray-100 p-4 text-center mt-10 rounded-lg shadow-md">
      <p className="text-gray-700">&copy; 2024 Fitness Tracker</p>
      <ul className="flex justify-center gap-4 mt-2">
        <li>
          <Link href="/privacy" className="text-gray-700 hover:text-blue-500">
            Privacy Policy
          </Link>
        </li>
        <li>
          <Link href="/terms" className="text-gray-700 hover:text-blue-500">
            Terms of Use
          </Link>
        </li>
        <li>
          <Link href="/contact" className="text-gray-700 hover:text-blue-500">
            Contact Us
          </Link>
        </li>
      </ul>
      {!session && (
        <div className="mt-4">
          <Button
            type="button"
            onClick={() => {
              router.push(`${AUTH_ENDPOINT}/login`);
            }}
            className="mt-4"
            variant="primary"
          >
            Log In
          </Button>
          <Button
            type="button"
            onClick={() => {
              router.push(`${AUTH_ENDPOINT}/register`);
            }}
            className="mt-2"
            variant="secondary"
          >
            Sign Up
          </Button>
        </div>
      )}
    </footer>
  );
};

export default Footer;