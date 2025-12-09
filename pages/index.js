import Link from 'next/link';

export default function Home() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">API Center Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link href="/joke-api/v1" passHref>
          <div className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer">
            <h2 className="text-xl font-semibold mb-2">Joke API</h2>
            <p className="text-gray-600">Get a random joke or add your own!</p>
          </div>
        </Link>
        <Link href="/tt-clan-leaderboard" passHref>
          <div className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer">
            <h2 className="text-xl font-semibold mb-2">TT Clan Leaderboard</h2>
            <p className="text-gray-600">View the Territorial.io clan leaderboard.</p>
          </div>
        </Link>
        {/* Add more API cards here */}
      </div>
    </div>
  );
}
