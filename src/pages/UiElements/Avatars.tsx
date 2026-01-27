import { useEffect, useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import { PlayerStat } from "../../@types/PlayerStats";
import { getPlayerStats } from "../../api/playerStats";

const fallbackLogo = "/images/logo/logo.png";

export default function Avatars() {
  const [playerStats, setPlayerStats] = useState<PlayerStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const recordsPerPage = 5;

  useEffect(() => {
    const fetchPlayerStats = async () => {
      try {
        const data = await getPlayerStats();
        setPlayerStats(data);
      } catch (err: any) {
        setError(err.message || "Failed to load player stats.");
      } finally {
        setLoading(false);
      }
    };

    fetchPlayerStats();
  }, []);

  const startIndex = currentPage * recordsPerPage;
  const endIndex = startIndex + recordsPerPage;
  const displayedPlayers = playerStats.slice(startIndex, endIndex);
  const totalPages = Math.ceil(playerStats.length / recordsPerPage);
  const hasNextPage = currentPage < totalPages - 1;

  return (
    <>
      <PageMeta
        title="AUFT"
        description="A-Ligue Football Tournament Management System"
      />
      <PageBreadcrumb pageTitle="Players" />
      <div className="space-y-6">
        {/* Player Stats Section */}
        <div className="rounded-2xl border border-slate-700/50 bg-slate-900/30 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">Player Goal Stats</h3>
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-400">
                {currentPage + 1} / {totalPages > 0 ? totalPages : 1}
              </span>
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
                disabled={currentPage === 0}
                className="rounded-lg border border-slate-600/60 bg-slate-800/60 px-3 py-2 text-sm font-medium text-slate-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ← Prev
              </button>
              <button
                onClick={() => setCurrentPage((prev) => (hasNextPage ? prev + 1 : prev))}
                disabled={!hasNextPage}
                className="rounded-lg border border-slate-600/60 bg-slate-800/60 px-3 py-2 text-sm font-medium text-slate-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next →
              </button>
            </div>
          </div>

          {error && (
            <div className="rounded-lg border border-red-500/40 bg-red-500/10 p-4">
              <p className="text-sm text-red-300">{error}</p>
            </div>
          )}

          {!error && (
            <div className="space-y-2">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500 mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">Loading player stats...</p>
                  </div>
                </div>
              ) : playerStats.length > 0 ? (
                displayedPlayers.map((player, index) => (
                  <div
                    key={player.player_id}
                    className="flex items-center gap-4 rounded-xl border border-slate-600/40 bg-gradient-to-r from-slate-800/40 to-slate-900/40 p-4 shadow-lg"
                  >
                    {/* Rank */}
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-500/20 font-bold text-blue-300">
                      {player.position ?? (index + 1)}
                    </div>

                    {/* Player Info */}
                    <div className="flex-1">
                      <h4 className="text-base font-semibold text-white">
                        {player.player_name}
                      </h4>
                      {player.player_position && player.player_position !== "Unknown" && (
                        <p className="text-xs text-slate-400 mt-1">{player.player_position}</p>
                      )}
                      <div className="flex items-center gap-2 mt-1">
                        <div className="h-8 w-8 shrink-0 overflow-hidden rounded-full border border-slate-400/60 bg-slate-700">
                          <img
                            src={player.team_image || fallbackLogo}
                            alt={player.team_name}
                            className="h-full w-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = fallbackLogo;
                            }}
                          />
                        </div>
                        <span className="text-sm text-slate-300">{player.team_name}</span>
                      </div>
                    </div>

                    {/* Goals Count */}
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-2xl font-bold text-white">{player.goals}</span>
                      <span className="text-xs text-slate-400">Goals</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex items-center justify-center p-12">
                  <div className="text-center">
                    <svg
                      className="w-16 h-16 mx-auto mb-4 text-slate-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    <h3 className="text-xl font-semibold text-slate-200 mb-2">
                      No Player Stats Available
                    </h3>
                    <p className="text-slate-400">
                      The backend returned an empty list. Add player stats to see them here.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
