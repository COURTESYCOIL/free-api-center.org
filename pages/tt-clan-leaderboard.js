import React, { useState, useEffect } from 'react';

const TTClanLeaderboard = () => {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [fetchDate, setFetchDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [availableDates, setAvailableDates] = useState([]);
  const [previousLeaderboardData, setPreviousLeaderboardData] = useState([]);

  const getRankChange = (currentClan, currentIndex) => {
    if (!previousLeaderboardData || previousLeaderboardData.length === 0) {
      return { type: 'N/A', value: 0 };
    }

    const previousIndex = previousLeaderboardData.findIndex(clan => clan.name === currentClan.name);

    if (previousIndex === -1) {
      return { type: 'New', value: 0 }; // Clan is new to the leaderboard
    }

    const currentRank = currentIndex + 1;
    const previousRank = previousIndex + 1;
    const change = previousRank - currentRank;

    if (change > 0) {
      return { type: 'Increase', value: change };
    } else if (change < 0) {
      return { type: 'Decrease', value: Math.abs(change) };
    } else {
      return { type: 'Stable', value: 0 };
    }
  };

  const maxPoints = React.useMemo(() => {
    if (leaderboardData.length === 0) return 0;
    return Math.max(...leaderboardData.map(clan => clan.points));
  }, [leaderboardData]);

  const fetchLeaderboard = async (date = null) => {
    setLoading(true);
    setError(null);
    try {
      const url = date ? `/api/leaderboard?date=${date}` : '/api/leaderboard';
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setLeaderboardData(data.leaderboard);
      setFetchDate(data.fetchDate);
      setAvailableDates(data.availableDates || []);

      // Fetch previous day's data for rank comparison
      if (data.availableDates && data.availableDates.length > 1) {
        const previousDate = data.availableDates[1]; // Assuming availableDates is sorted descending
        try {
          const prevResponse = await fetch(`/api/leaderboard?date=${previousDate}`);
          if (prevResponse.ok) {
            const prevData = await prevResponse.json();
            setPreviousLeaderboardData(prevData.leaderboard);
          } else {
            console.warn('Could not fetch previous day\'s leaderboard data.');
            setPreviousLeaderboardData([]);
          }
        } catch (prevError) {
          console.error('Error fetching previous day\'s data:', prevError);
          setPreviousLeaderboardData([]);
        }
      } else {
        setPreviousLeaderboardData([]);
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const handleDateChange = (event) => {
    const date = event.target.value;
    setSelectedDate(date);
    fetchLeaderboard(date);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">TT Clan Leaderboard</h1>

      <div className="flex justify-between items-center mb-4">
        {fetchDate && (
          <p className="text-sm text-gray-600">Last fetched: {new Date(fetchDate).toLocaleString()}</p>
        )}
        <div className="flex space-x-2">
          <select
            className="border p-2 rounded"
            value={selectedDate}
            onChange={handleDateChange}
          >
            <option value="">Select a date</option>
            {availableDates.map((date) => (
              <option key={date} value={date}>
                {new Date(date).toLocaleDateString()}
              </option>
            ))}
          </select>
          <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    onClick={() => fetchLeaderboard()}
                    disabled={loading}
                  >
                    {loading ? 'Fetching...' : 'Fetch Latest'}
                  </button>
                  <button
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                    onClick={() => fetchLeaderboard()}
                    disabled={loading}
                  >
                    {loading ? 'Fetching...' : 'Fetch'}
                  </button>
        </div>
      </div>

      {error && <p className="text-red-500 mb-4">Error: {error}</p>}

      {/* Top 3 Clans Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {leaderboardData.slice(0, 3).map((clan, index) => (
          <div key={clan.name} className="bg-white shadow-lg rounded-lg p-4">
            <h2 className="text-xl font-semibold mb-2">#{index + 1} {clan.name}</h2>
            <p className="text-gray-700">Points: {clan.points}</p>
            {/* Add Increase/Decrease/Stable Indicator here later */}
          </div>
        ))}
      </div>

      {/* Leaderboard Table */}
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Points</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progress</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Change</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {leaderboardData.map((clan, index) => (
              <tr key={clan.name}>
                <td className="px-6 py-4 whitespace-nowrap">{index + 1}</td>
                <td className="px-6 py-4 whitespace-nowrap">{clan.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{clan.points}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                            <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${(clan.points / maxPoints) * 100}%` }}></div>
                          </div>
                        </td>
                <td className="px-6 py-4 whitespace-nowrap">
                          {(() => {
                            const { type, value } = getRankChange(clan, index);
                            if (type === 'Increase') {
                              return <span className="text-green-500">▲ {value}</span>;
                            } else if (type === 'Decrease') {
                              return <span className="text-red-500">▼ {value}</span>;
                            } else if (type === 'Stable') {
                              return <span className="text-gray-500">-</span>;
                            } else if (type === 'New') {
                              return <span className="text-blue-500">New</span>;
                            } else {
                              return <span className="text-gray-500">N/A</span>;
                            }
                          })()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TTClanLeaderboard;
