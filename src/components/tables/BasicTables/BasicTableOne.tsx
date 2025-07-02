import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";

import Badge from "../../ui/badge/Badge";

interface Order {
  id: number
  user: {
    pos: number
    image: string
    name: string
    role: string
  }
  projectName: number
  // team: number;
  team: {
    images: string[]
  }
  status: number
  budget: number
  draw: number
}

// Define the table data using the interface
const tableData: Order[] = [
  {
    id: 1,
    user: {
      pos: 1,
      image: '/images/user/user-17.jpg',
      name: 'NB',
      // role: 'Captain',
    },
    projectName: 1,
    team: {
      images: [
        // '/images/user/user-22.jpg',
        // '/images/user/user-23.jpg',
        '/images/user/user-24.jpg',
      ],
    },
    status: 10,
    budget: 5,
    draw: 1,
  },
  {
    id: 2,
    user: {
      pos: 2,
      image: '/images/user/user-18.jpg',
      name: 'MIT',
      // role: 'Forward',
    },
    projectName: 2,
    team: {
      images: [
        // '/images/user/user-22.jpg',
        // '/images/user/user-23.jpg',
        '/images/user/user-24.jpg',
      ],
    },
    status: 8,
    budget: 4,
    draw: 2,
  },
  {
    id: 3,
    user: {
      pos: 3,
      image: '/images/user/user-17.jpg',
      name: 'JG',
      // role: 'Goalie',
    },
    projectName: 3,
    team: {
      images: [
        // '/images/user/user-22.jpg',
        // '/images/user/user-23.jpg',
        '/images/user/user-24.jpg',
      ],
    },
    status: 6,
    budget: 3,
    draw: 3,
  },
  {
    id: 4,
    user: {
      pos: 4,
      image: '/images/user/user-20.jpg',
      name: 'PH',
      // role: 'Defender',
    },
    projectName: 4,
    team: {
      images: [
        // '/images/user/user-22.jpg',
        // '/images/user/user-23.jpg',
        '/images/user/user-24.jpg',
      ],
    },
    status: 4,
    budget: 2,
    draw: 4,
  },
  {
    id: 5,
    user: {
      pos: 5,
      image: '/images/user/user-21.jpg',
      name: 'DD',
      // role: 'Midfielder',
    },
    projectName: 5,
    team: {
      images: [
        // '/images/user/user-22.jpg',
        // '/images/user/user-23.jpg',
        '/images/user/user-24.jpg',
      ],
    },
    status: 2,
    budget: 1,
    draw: 5,
  },
]


export default function BasicTableOne() {
  return (
    <div className='overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]'>
      <div className='max-w-full overflow-x-auto'>
        <Table>
          {/* Table Header */}
          <TableHeader className='border-b border-gray-100 dark:border-white/[0.05]'>
            <TableRow>
              <TableCell
                isHeader
                className='px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400'
              >
                Position
              </TableCell>
              <TableCell
                isHeader
                className='px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400'
              >
                NM
              </TableCell>
              <TableCell
                isHeader
                className='px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400'
              >
                MP
              </TableCell>
              <TableCell
                isHeader
                className='px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400'
              >
                W
              </TableCell>
              <TableCell
                isHeader
                className='px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400'
              >
                L
              </TableCell>
              <TableCell
                isHeader
                className='px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400'
              >
                D
              </TableCell>
            </TableRow>
          </TableHeader>

          {/* Table Body */}
          <TableBody className='divide-y divide-gray-100 dark:divide-white/[0.05]'>
            {tableData.map((order) => (
              <TableRow key={order.id}>
                <TableCell className='px-5 py-4 sm:px-6 text-start'>
                  <div className='flex items-center gap-3'>
                    <p className=' dark:text-white/90'>{order.user.pos}</p>
                    <div className='w-10 h-10 overflow-hidden rounded-full'>
                      <img
                        width={40}
                        height={40}
                        src={order.user.image}
                        alt={order.user.name}
                      />
                    </div>
                    <div>
                      <span className='block font-medium text-gray-800 text-theme-sm dark:text-white/90'>
                        {order.user.name}
                      </span>
                      <span className='block text-gray-500 text-theme-xs dark:text-gray-400'>
                        {order.user.role}
                      </span>
                    </div>
                  </div>
                </TableCell>
                {/* images next team */}
                <TableCell className='px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400'>
                  <div className='flex -space-x-2'>
                    {order.team.images.map((teamImage, index) => (
                      <div
                        key={index}
                        className='w-6 h-6 overflow-hidden border-2 border-white rounded-full dark:border-gray-900'
                      >
                        {/* <img
                          width={40}
                          height={40}
                          src={teamImage}
                          alt={`Team member ${index + 1}`}
                          className='w-full size-6'
                        /> */}
                        <img
                          width={40}
                          height={40}
                          src={teamImage}
                          alt={teamImage}
                        />
                      </div>
                    ))}
                  </div>
                  {/* <p>{order.team}</p> */}
                </TableCell>
                <TableCell className='px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400'>
                  {order.projectName}
                </TableCell>

                <TableCell className='px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400'>
                  <Badge size='sm'>{order.status}</Badge>
                </TableCell>
                <TableCell className='px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400'>
                  {order.budget}
                </TableCell>
                <TableCell className='px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400'>
                  {order.draw}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
