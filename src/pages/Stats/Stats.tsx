import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { PlayersTableItem } from "../../@types/Players";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../components/ui/table";

const Stats: React.FC = () => {
  const [points, setPoints] = useState<PlayersTableItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const teams = [
    { name: "NetBusters", slug: "netbusters" },
    { name: "Jugling Giants", slug: "jugling-giants" },
    { name: "Soccer Hooligans", slug: "soccer-hooligans" },
    { name: "Mit", slug: "mit" },
    { name: "Faking Phantoms", slug: "faking-phantoms" },
    { name: "Drbling Demons", slug: "drbling-demons" },
  ];

  const [activeTeam, setActiveTeam] = useState<string>(teams[0].slug);

  // Convert slug -> Title Case (fallback)
  const formatLabel = (s: string) =>
    s
      .replace(/[-_]+/g, " ")
      .split(" ")
      .filter(Boolean)
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(" ");

  // slug -> display name map
  const teamMap = teams.reduce<Record<string, string>>((acc, t) => {
    acc[t.slug] = t.name;
    return acc;
  }, {});

  useEffect(() => {
    setLoading(true);

    api
      .get<PlayersTableItem[]>(`/players/${activeTeam}`)
      .then((res) => {
        setPoints(res.data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching players for team", activeTeam, err);
        setPoints([]);
        setLoading(false);
      });
  }, [activeTeam]);

  if (loading)
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading players...</p>
        </div>
      </div>
    );

  if (!points || points.length === 0)
    return (
      <div className="p-2 sm:p-4 lg:p-6">
        {/* Tabs - Responsive */}
        <div className="flex flex-wrap gap-2 mb-4 sm:mb-6">
          {teams.map((t) => (
            <button
              key={t.slug}
              onClick={() => setActiveTeam(t.slug)}
              className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-full font-semibold transition-colors text-xs sm:text-sm ${
                activeTeam === t.slug
                  ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg"
                  : "bg-transparent border border-gray-600 text-gray-200 hover:bg-gray-800"
              }`}
            >
              {t.name}
            </button>
          ))}
        </div>
        
        <div className="flex items-center justify-center p-12 bg-white dark:bg-white/[0.03] rounded-xl border border-gray-200 dark:border-white/[0.05]">
          <div className="text-center">
            <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">No Players Available</h3>
            <p className="text-gray-500 dark:text-gray-400">There are no players registered for {teamMap[activeTeam] ?? formatLabel(activeTeam)} yet.</p>
          </div>
        </div>
      </div>
    );

  return (
    <div className="p-2 sm:p-4 lg:p-6">
      {/* Tabs - Responsive */}
      <div className="flex flex-wrap gap-2 mb-4 sm:mb-6">
        {teams.map((t) => (
          <button
            key={t.slug}
            onClick={() => setActiveTeam(t.slug)}
            className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-full font-semibold transition-colors text-xs sm:text-sm ${
              activeTeam === t.slug
                ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg"
                : "bg-transparent border border-gray-600 text-gray-200 hover:bg-gray-800"
            }`}
          >
            {t.name}
          </button>
        ))}
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <Table>
            {/* Table Header */}
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell
                  isHeader
                  className="px-3 py-2 sm:px-5 sm:py-3 font-medium text-gray-500 text-start text-xs sm:text-sm dark:text-gray-400"
                >
                  Name
                </TableCell>
                <TableCell
                  isHeader
                  className="px-3 py-2 sm:px-5 sm:py-3 font-medium text-gray-500 text-start text-xs sm:text-sm dark:text-gray-400"
                >
                  Team
                </TableCell>
                <TableCell
                  isHeader
                  className="hidden md:table-cell px-3 py-2 sm:px-5 sm:py-3 font-medium text-gray-500 text-start text-xs sm:text-sm dark:text-gray-400"
                >
                  Position
                </TableCell>
              </TableRow>
            </TableHeader>

            {/* Table Body */}
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {points.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="px-3 py-3 sm:px-5 sm:py-4 text-start">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 overflow-hidden rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                        {(p as any).avatar ? (
                          <img
                            src={(p as any).avatar}
                            alt={p.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="font-bold text-xs sm:text-sm text-gray-700">
                            {p.name
                              .split(" ")
                              .map((n) => n[0])
                              .slice(0, 2)
                              .join("")}
                          </span>
                        )}
                      </div>

                      <div className="min-w-0">
                        <div className="font-medium dark:text-white/90 text-sm sm:text-base truncate">
                          {p.name}
                        </div>

                        {(p as any).owner && (
                          <div className="text-xs text-red-500">Owner</div>
                        )}
                        {(p as any).icon && (
                          <div className="text-xs text-indigo-400">Icon</div>
                        )}
                      </div>
                    </div>
                  </TableCell>

                  {/* Team Name */}
                  <TableCell className="px-3 py-3 sm:px-4 sm:py-3 text-gray-500 text-start text-xs sm:text-sm dark:text-gray-400">
                    <span className="block sm:inline">
                      {teamMap[p.team] ?? formatLabel(p.team)}
                    </span>
                  </TableCell>

                  {/* Position - Hidden on mobile */}
                  <TableCell className="hidden md:table-cell px-3 py-3 sm:px-5 sm:py-4 text-gray-500 text-start text-xs sm:text-sm dark:text-gray-400">
                    {p.position || '-'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default Stats;
