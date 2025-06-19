'use client';

export default function GlobalError({
	error,
	reset,
}: {
	error: Error;
	reset: () => void;
}) {
	console.error(error);

	return (
		<div className="min-h-screen bg-black text-white flex flex-col items-center justify-center text-center px-4">
			<h1 className="text-4xl font-bold mb-4">Something went wrong</h1>
			<p className="text-gray-400">{error.message}</p>

			<button
				onClick={() => reset()}
				className="mt-6 px-6 py-3 bg-white text-black rounded hover:bg-gray-300 transition"
			>
				Try Again
			</button>
		</div>
	);
}
