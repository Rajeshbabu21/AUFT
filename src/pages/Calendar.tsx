import { useState, useRef, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { EventInput, EventClickArg } from "@fullcalendar/core";
import { Modal } from "../components/ui/modal";
import { useModal } from "../hooks/useModal";
import PageMeta from "../components/common/PageMeta";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import "./calendar.css";
import api from "../api/axios";

interface Team {
  badge: {
    image_url: string;
  };
  team_code: string;
  team_name: string;
}

interface Match {
  id: string;
  match_week: number;
  conduction_date: string | null;
  match_time: string;
  home_team: Team;
  away_team: Team;
}

interface CalendarEvent extends EventInput {
  extendedProps: {
    calendar?: string;
    match?: Match;
    isMatch?: boolean;
  };
}

const Calendar: React.FC = () => {
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [selectedMatches, setSelectedMatches] = useState<Match[]>([]);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const calendarRef = useRef<FullCalendar>(null);
  const { isOpen, openModal, closeModal } = useModal();

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    try {
      setLoading(true);
      const response = await api.get("/matches");
      // Handle both response.data and response.data.data structures
      const matchesData = Array.isArray(response.data) ? response.data : response.data.data;
      const matches: Match[] = matchesData || [];
      
      // Transform matches to calendar events - don't filter, show all
      const matchEvents: CalendarEvent[] = matches.map((match: any) => {
        // Try different possible date field names
        const matchDate = match.conduction_date || match.match_date || match.date;
        return {
          id: match.id,
          title: `${match.home_team.team_code} vs ${match.away_team.team_code}`,
          start: matchDate || new Date().toISOString().split("T")[0],
          allDay: true,
          extendedProps: {
            match: match,
            isMatch: true,
          },
        };
      });
      
    
      setEvents(matchEvents);
    } catch (error) {
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  // Format time to 12-hour format
  const formatTime = (time24: string) => {
    const [hours, minutes] = time24.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const hours12 = hours % 12 || 12;
    return `${hours12}:${minutes.toString().padStart(2, '0')} ${period}`;
  };

  // Check if match date has passed
  const isMatchEnded = (matchDate: string | null): boolean => {
    if (!matchDate) return false;
    const matchDateObj = new Date(matchDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    matchDateObj.setHours(0, 0, 0, 0);
    return matchDateObj < today;
  };

  const handleEventClick = (clickInfo: EventClickArg) => {
    const event = clickInfo.event;
    const match = event.extendedProps.match as Match | undefined;
    
    if (match) {
      // Get the date of the clicked event
      const clickedDate = event.startStr;
      
      // Find all matches on this date
      const matchesOnDate = events
        .filter(e => e.start === clickedDate && e.extendedProps.match)
        .map(e => e.extendedProps.match as Match);
      
      // console.log("Matches on", clickedDate, ":", matchesOnDate.length);
      
      // If multiple matches on same date, show all
      if (matchesOnDate.length > 1) {
        setSelectedMatches(matchesOnDate);
        setSelectedMatch(null);
      } else {
        // Single match, show individual details
        setSelectedMatch(match);
        setSelectedMatches([]);
      }
      
      openModal();
    }
  };

 

  return (
    <>
      <PageMeta
        title="AUFT"
        description="A-Ligue Football Tournament Management System"
      />
      <PageBreadcrumb pageTitle="Calendar" />
      <div className="rounded-2xl border  border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        {loading ? (
          <div className="flex items-center justify-center p-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">Loading matches...</p>
            </div>
          </div>
        ) : (
          <div className="custom-calendar">
            <FullCalendar
              ref={calendarRef}
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              headerToolbar={{
                left: "prev,next addMatchButton",
                center: "title",
                right: "dayGridMonth"
              }}
              height="auto"
              contentHeight="auto"
              events={events}
              selectable={false}
              eventClick={handleEventClick}
              eventContent={renderEventContent}
              displayEventTime={true}
              customButtons={{
                addMatchButton: {
                  text: "Matches",
                },
              }}
            />
          </div>
        )}
        <Modal
          isOpen={isOpen}
          onClose={closeModal}
          className={`${selectedMatches.length > 1 ? "max-w-[900px]" : "max-w-[700px]"} p-6 lg:p-10`}
        >
          <div className="flex flex-col px-2 overflow-y-auto custom-scrollbar">
            <div>
              <h5 className="mb-2 font-semibold text-gray-800 modal-title text-theme-xl dark:text-white/90 lg:text-2xl">
                {selectedMatch ? "Match Details" : selectedMatches.length > 0 ? `Matches (${selectedMatches.length})` : "Add Match"}
              </h5>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {selectedMatch 
                  ? "View match information"
                  : selectedMatches.length > 0
                  ? `${selectedMatches.length} matches on this date`
                  : "Create a new match"}
              </p>
            </div>

            {selectedMatches.length > 1 ? (
              // Multiple Matches View
              <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
                {selectedMatches.map((match) => (
                  <div key={match.id} className="p-6 rounded-lg" style={{ backgroundColor: '#131d31' }}>
                    {/* Match Info Header */}
                    <div className="mb-6 text-center">
                      <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                        Week {match.match_week}
                      </p>
                      <p className="text-lg font-bold text-gray-800 dark:text-white">
                        {match.conduction_date}
                      </p>
                    </div>

                    {/* Match Details - Teams */}
                    <div className="flex items-center justify-between gap-4 group">
                      
                      {/* Home Team */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 transition-transform duration-300 group-hover:translate-x-1">
                          <div className="relative flex-shrink-0">
                            <img
                              className="w-10 h-10 rounded-lg object-cover shadow-md dark:shadow-lg border border-gray-200 dark:border-gray-700"
                              src={match.home_team.badge.image_url}
                              alt={match.home_team.team_name}
                            />
                            <div className="absolute inset-0 rounded-lg bg-gradient-to-tr from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">HOME</p>
                            {/* <h4 className="text-sm font-bold text-gray-900 dark:text-white/90"> */}
                            <h4 className="text-sm font-bold text-gray-900 dark:text-white/90">
                              {match.home_team.team_code}
                            </h4>
                          </div>
                        </div>
                      </div>

                      {/* Center - Time */}
                      <div className="flex flex-col items-center gap-1 flex-shrink-0">
                        <div className="px-2 py-1 rounded-lg text-white font-bold text-xs shadow-md" style={{ backgroundColor: '#131d31' }}>
                          {formatTime(match.match_time)}
                        </div>
                      </div>

                      {/* Away Team */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-end gap-2 transition-transform duration-300 group-hover:-translate-x-1">
                          <div className="text-right min-w-0">
                            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">AWAY</p>
                            <h4 className="text-sm font-bold text-gray-900 dark:text-white/90">
                              {match.away_team.team_code}
                            </h4>
                          </div>
                          <div className="relative flex-shrink-0">
                            <img
                              className="w-10 h-10 rounded-lg object-cover shadow-md dark:shadow-lg border border-gray-200 dark:border-gray-700"
                              src={match.away_team.badge.image_url}
                              alt={match.away_team.team_name}
                            />
                            <div className="absolute inset-0 rounded-lg bg-gradient-to-tl from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : selectedMatch ? (
              // Match Details View
              <div className="mt-8">
                <div className="p-6 rounded-lg" style={{ backgroundColor: '#131d31' }}>
                  {/* Match Info Header */}
                  <div className="mb-6 text-center">
                    <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                      Week {selectedMatch.match_week}
                    </p>
                    <p className="text-lg font-bold text-gray-800 dark:text-white">
                      {selectedMatch.conduction_date || "TBD"}
                    </p>
                  </div>

                  {/* Match Details - Teams */}
                  <div className="flex items-center justify-between gap-6 group">
                    
                    {/* Home Team */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 transition-transform duration-300 group-hover:translate-x-2">
                        <div className="relative">
                          <img
                            className="w-14 h-14 rounded-xl object-cover shadow-md dark:shadow-lg border border-gray-200 dark:border-gray-700"
                            src={selectedMatch.home_team.badge.image_url}
                            alt={selectedMatch.home_team.team_name}
                          />
                          <div className="absolute inset-0 rounded-xl bg-gradient-to-tr from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">HOME</p>
                          <h4 className="text-lg font-bold text-gray-900 dark:text-white/90">
                            {selectedMatch.home_team.team_name}
                          </h4>
                          <p className="text-sm font-bold text-blue-600 dark:text-blue-400">
                            {selectedMatch.home_team.team_code}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Center - Time & Divider */}
                    <div className="flex flex-col items-center gap-2">
                      <div className="px-4 py-2 rounded-xl text-white font-bold text-sm shadow-md" style={{ backgroundColor: '#131d31' }}>
                        {formatTime(selectedMatch.match_time)}
                      </div>
                      <div className="h-px w-8 bg-gray-300 dark:bg-gray-700" />
                    </div>

                    {/* Away Team */}
                    <div className="flex-1">
                      <div className="flex items-center justify-end gap-3 transition-transform duration-300 group-hover:-translate-x-2">
                        <div className="text-right min-w-0">
                          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">AWAY</p>
                          <h4 className="text-lg font-bold text-gray-900 dark:text-white/90">
                            {selectedMatch.away_team.team_name}
                          </h4>
                          <p className="text-sm font-bold text-blue-600 dark:text-blue-400">
                            {selectedMatch.away_team.team_code}
                          </p>
                        </div>
                        <div className="relative">
                          <img
                            className="w-14 h-14 rounded-xl object-cover shadow-md dark:shadow-lg border border-gray-200 dark:border-gray-700"
                            src={selectedMatch.away_team.badge.image_url}
                            alt={selectedMatch.away_team.team_name}
                          />
                          <div className="absolute inset-0 rounded-xl bg-gradient-to-tl from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="mt-8">
                <p className="text-gray-600 dark:text-gray-400">Match creation form would go here</p>
              </div>
            )}

            
          </div>
        </Modal>
      </div>
    </>
  );
};

const renderEventContent = (eventInfo: any) => {
  const match = eventInfo.event.extendedProps.match as Match | undefined;
  
  if (match) {
    // Check if match has ended
    const matchDate = match.conduction_date;
    const ended = matchDate ? new Date(matchDate) < new Date() : false;
    
    // Render match event with team codes and match week
    return (
      <div className="event-fc-color flex flex-col gap-1 p-1 rounded-sm">
        <div className="font-bold text-xs">
          {match.home_team.team_code} vs {match.away_team.team_code}
        </div>
        <div className="text-xs text-gray-600 dark:text-gray-300">
          Week {match.match_week}
        </div>
        {ended && (
          <div className="text-xs font-bold text-red-500">Ended</div>
        )}
      </div>
    );
  }

  // Fallback for regular events
  const colorClass = `fc-bg-${eventInfo.event.extendedProps.calendar?.toLowerCase() || "primary"}`;
  return (
    <div
      className={`event-fc-color flex fc-event-main ${colorClass} p-1 rounded-sm`}
    >
      <div className="fc-daygrid-event-dot"></div>
      <div className="fc-event-time">{eventInfo.timeText}</div>
      <div className="fc-event-title">{eventInfo.event.title}</div>
    </div>
  );
};

export default Calendar;
