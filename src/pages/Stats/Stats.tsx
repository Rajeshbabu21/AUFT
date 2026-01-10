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

  return (
    <div>
      {/* Tabs */}
      <div className="flex gap-2 mb-4">
        {teams.map((t) => (
          <button
            key={t.slug}
            onClick={() => setActiveTeam(t.slug)}
            className={`px-4 py-2 rounded-full font-semibold transition-colors text-sm ${
              activeTeam === t.slug
                ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg"
                : "bg-transparent border border-gray-600 text-gray-200"
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
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Name
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Team
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Position
                </TableCell>
              </TableRow>
            </TableHeader>

            {/* Table Body */}
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {points.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="px-5 py-4 sm:px-6 text-start">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 overflow-hidden rounded-full bg-gray-100 flex items-center justify-center">
                        {(p as any).avatar ? (
                          <img
                            src={(p as any).avatar}
                            alt={p.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="font-bold text-sm text-gray-700">
                            {p.name
                              .split(" ")
                              .map((n) => n[0])
                              .slice(0, 2)
                              .join("")}
                          </span>
                        )}
                      </div>

                      <div>
                        <div className="font-medium dark:text-white/90">
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

                  {/* ✅ Normalized Team Name */}
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {teamMap[p.team] ?? formatLabel(p.team)}
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
