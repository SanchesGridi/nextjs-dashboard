'use client';

import { useEffect } from 'react';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Optionally log the error to an error reporting service
        console.error(error);
    }, [error]);

    if (!error.digest) {
        error.digest = "#__not_set__#";
    }

    const env = process.env.NODE_ENV;
    const errorText = `Error: ${error.message}`;
    const digestText = `Digest: ${error.digest}`;
    const className = "text-center text-red-600";
    return (
        <main className="flex h-full flex-col items-center justify-center">
            <h2 className="text-center">Something went wrong!</h2>
            <p className="text-center text-green-600">Current Environment: {env}</p>
            {env === "production" ? null : (<><p className={className}>{errorText}</p><p className={className}>{digestText}</p></>) }
            <button
                className="mt-4 rounded-md bg-blue-500 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-400"
                onClick={
                    // Attempt to recover by trying to re-render the invoices route
                    () => reset()
                }
            >
                Try again
            </button>
        </main>
    );
}