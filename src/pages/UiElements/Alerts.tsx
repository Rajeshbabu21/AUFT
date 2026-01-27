import { useEffect, useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
// import ComponentCard from "../../components/common/ComponentCard";
import Alert from "../../components/ui/alert/Alert";
import { TeamStat } from "../../@types/TeamStats";
import { getTeamStats } from "../../api/teamStats";

const fallbackLogo = "/images/logo/logo.png";

const toneByDiff = () => {
  return {
    border: "border-blue-light-500/40 dark:border-blue-500/40",
    accent:
      "from-blue-500/10 via-transparent to-transparent dark:from-blue-500/10 dark:via-transparent dark:to-transparent",
    chip:
      "bg-blue-500/20 text-blue-300 dark:bg-blue-500/20 dark:text-blue-300",
    delta: "text-blue-400 dark:text-blue-300",
    label: "Team Stats",
    // caption: "Championship performance metrics.",
  };
};

const formatDiff = (value: number) => (value > 0 ? `+${value}` : `${value}`);

export default function Alerts() {
  const [teamStats, setTeamStats] = useState<TeamStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);

  useEffect(() => {
    const fetchTeamStats = async () => {
      try {
        const data = await getTeamStats();
        setTeamStats(data);
        if (data.length > 0) {
          setSelectedTeamId(data[0].team_id);
        }
      } catch (err: any) {
        setError(err.message || "Failed to load team stats.");
      } finally {
        setLoading(false);
      }
    };

    fetchTeamStats();
  }, []);

  return (
    <>
      <PageMeta
        title="AUFT"
        description="A-Ligue Football Tournament Management System"
      />
      <PageBreadcrumb pageTitle="Teams" />
      <div className="space-y-6">
        {/* Team Stats Grid */}
        <div className="rounded-2xl border border-slate-700/50 bg-slate-900/30 p-6">
          <h3 className="mb-6 text-lg font-semibold text-white">Team Goal Stats</h3>

          {error && (
            <Alert
              variant="error"
              title="Could not load team stats"
              message={error}
            />
          )}

          {!error && (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {loading ? (
                <div className="col-span-full flex items-center justify-center py-12">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500 mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">Loading team stats</p>
                  </div>
                </div>
              ) : teamStats.length > 0 ? (
                teamStats
                    .map((team, index) => ({
                      ...team,
                      position: index + 1,
                    }))
                    .map((team) => {
                      const tone = toneByDiff();

                      return (
                        <div
                          key={team.team_id}
                          className={`relative overflow-hidden rounded-xl border bg-gradient-to-br from-slate-800/40 to-slate-900/40 p-4 shadow-lg transition-all duration-300 hover:scale-105 ${tone.border} ${
                            selectedTeamId === team.team_id
                              ? "ring-2 ring-blue-500/50"
                              : ""
                          }`}
                        >
                          <div
                            className={`absolute inset-0 bg-gradient-to-br ${tone.accent}`}
                            aria-hidden
                          />
                          <div className="relative flex items-start gap-4">
                            <div className="h-14 w-14 shrink-0 overflow-hidden rounded-md border border-slate-600/60 bg-slate-800/80 shadow-md">
                              <img
                                src={team.team_image || fallbackLogo}
                                alt={team.team_name}
                                className="h-full w-full object-cover border border-slate-500/40"
                                onError={(event) => {
                                  (event.target as HTMLImageElement).src =
                                    fallbackLogo;
                                }}
                              />
                            </div>

                            <div className="flex-1 space-y-3">
                              <div className="flex items-center justify-between gap-2">
                                <h4 className="text-base font-semibold text-white">
                                  {team.team_name}
                                </h4>
                                <span
                                  className={`rounded-full px-3 py-1 text-xs font-medium ${tone.chip}`}
                                >
                                  {team.position}
                                  {team.position === 1
                                    ? "st"
                                    : team.position === 2
                                    ? "nd"
                                    : team.position === 3
                                    ? "rd"
                                    : "th"}
                                </span>
                              </div>

                              <div className="space-y-2">
                                <div className="flex items-center justify-between rounded-lg bg-slate-800/60 px-3 py-2">
                                  <span className="text-sm text-slate-300">
                                    Goals Scored
                                  </span>
                                  <span className="text-base font-bold text-white">
                                    {team.goals_scored}
                                  </span>
                                </div>
                                {/* <div className="flex items-center justify-between rounded-lg border border-red-500/60 bg-slate-800/60 px-3 py-2">
                                  <span className="text-sm text-slate-300">
                                    Goals Conceded
                                  </span>
                                  <span className="text-base font-bold text-white">
                                    {team.goals_conceded}
                                  </span>
                                  
                                </div> */}
                                <div className="flex items-center justify-between rounded-lg  bg-slate-800/60 px-3 py-2">
                                  <span className="text-sm text-slate-300">
                                    Clean Sheets
                                  </span>
                                  <span className="text-base font-bold text-white">
                                    {team.clean_sheets}
                                  </span>
                                  
                                </div>
                                <div className="flex items-center justify-between rounded-lg bg-slate-700/40 px-3 py-2">
                                  <span className="text-sm font-medium text-slate-300">
                                    Goal Difference
                                  </span>
                                  <span
                                    className={`text-base font-bold ${tone.delta}`}
                                  >
                                    {formatDiff(team.goal_difference)}
                                  </span>
                                </div>
                              </div>

                              
                            </div>
                          </div>
                        </div>
                      );
                    })
              ) : (
                <div className="col-span-full flex items-center justify-center p-12">
                  <div className="text-center">
                    <svg
                      className="w-16 h-16 mx-auto mb-4 text-gray-400"
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
                    <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      No Team Stats Available
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400">
                      The backend returned an empty list. Add team stats to see them here.
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
