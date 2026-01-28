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
      <div className="space-y-4 md:space-y-6">
        {/* Player Stats Section */}
        <div className="rounded-xl md:rounded-2xl border border-slate-700/50 bg-slate-900/30 p-4 sm:p-5 md:p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-5 md:mb-6">
            <h3 className="text-base sm:text-lg md:text-xl font-semibold text-white">Player Goal Stats</h3>
            <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 w-full sm:w-auto">
              <span className="text-xs sm:text-sm text-slate-400 px-2 py-1.5 sm:py-2 rounded-md bg-slate-800/40">
                {currentPage + 1} / {totalPages > 0 ? totalPages : 1}
              </span>
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
                disabled={currentPage === 0}
                className="flex-1 sm:flex-none rounded-lg border border-slate-600/60 bg-slate-800/60 px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-slate-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-700/60 transition-colors"
              >
                ← Prev
              </button>
              <button
                onClick={() => setCurrentPage((prev) => (hasNextPage ? prev + 1 : prev))}
                disabled={!hasNextPage}
                className="flex-1 sm:flex-none rounded-lg border border-slate-600/60 bg-slate-800/60 px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-slate-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-700/60 transition-colors"
              >
                Next →
              </button>
            </div>
          </div>

          {error && (
            <div className="rounded-lg border border-red-500/40 bg-red-500/10 p-3 sm:p-4">
              <p className="text-xs sm:text-sm text-red-300">{error}</p>
            </div>
          )}

          {!error && (
            <div className="space-y-2 sm:space-y-2.5 md:space-y-3">
              {loading ? (
                <div className="flex items-center justify-center py-8 sm:py-10 md:py-12">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-brand-500 mx-auto mb-3 sm:mb-4"></div>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Loading player stats...</p>
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
                      {index + 1}
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
                <div className="flex items-center justify-center p-6 sm:p-8 md:p-12">
                  <div className="text-center">
                    <svg
                      className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 mx-auto mb-2 sm:mb-3 md:mb-4 text-slate-500"
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
                    <h3 className="text-base sm:text-lg md:text-xl font-semibold text-slate-200 mb-1 sm:mb-2">
                      No Player Stats Available
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-400">
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
