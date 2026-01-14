import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";

import Badge from "../../ui/badge/Badge";
import api from "../../../api/axios";
import { PointsTableItem } from "../../../@types/Points";
import { useEffect, useState } from "react";

export default function BasicTableOne() {
  const [points, setPoints] = useState<PointsTableItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    api
      .get<PointsTableItem[]>("/points-table")
      .then((res) => {
        console.log("Points table data:", res.data);
        setPoints(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching points table data:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center p-12">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500 mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-gray-400">Loading points table...</p>
      </div>
    </div>
  );

  return (
    <div className='overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]'>
      <div className='max-w-full overflow-x-auto'>
        <Table>
          {/* Table Header */}
          <TableHeader className='border-b border-gray-100 dark:border-white/[0.05]'>
            <TableRow>
              <TableCell isHeader className='px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400'>
                Position
              </TableCell>
              <TableCell isHeader className='px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400'>
                MP
              </TableCell>
              <TableCell isHeader className='px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400'>
                W
              </TableCell>
              <TableCell isHeader className='px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400'>
                L
              </TableCell>
              <TableCell isHeader className='px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400'>
                D
              </TableCell>
              <TableCell isHeader className='px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400'>
                Points
              </TableCell>
              <TableCell isHeader className='px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400'>
                GD
              </TableCell>
              <TableCell isHeader className='px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400'>
                Qualified
              </TableCell>
            </TableRow>
          </TableHeader>

          {/* Table Body */}
          <TableBody className='divide-y divide-gray-100 dark:divide-white/[0.05]'>
            {points.map((order) => (
              <TableRow key={order.id}>
                {/* Position + Team */}
                <TableCell className='px-5 py-4 sm:px-6 text-start'>
                  <div className='flex items-center gap-3'>
                    <p className='dark:text-white/90'>{order.position}</p>
                    {" "}
                    <div className='w-14 h-14 overflow-hidden rounded-full'>
                      <img
                       className="w-full h-full object-contain"
                        width={100}
                        height={70}
                        src={order.teams?.images?.image_url || "/images/logo/1.jpeg"}
                        alt={order.teams?.team_code || "team"}
                      />
                    </div>
                      <h6 className="text-white">{order.teams.team_code}</h6>

                  </div>
                </TableCell>

                <TableCell className='px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400'>
                  {order.matches_played}
                </TableCell>

                <TableCell className='px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400'>
                  {order.wins}
                </TableCell>

                <TableCell className='px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400'>
                  {order.losses}
                </TableCell>

                <TableCell className='px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400'>
                  {order.draws}
                </TableCell>

                <TableCell className='px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400'>
                  {order.points}
                </TableCell>

                <TableCell className='px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400'>
                  {order.goal_Diif ?? 0}
                </TableCell>

                <TableCell className='px-4 py-3 text-start'>
                  <Badge size='sm'>
                    {order.qualified ? "Qualified" : "Not Qualified"}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
