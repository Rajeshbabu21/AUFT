import { useState } from "react";
import ComponentCard from "../../components/common/ComponentCard";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import { videosByWeek } from "./data";

export default function Videos() {
  const [selectedWeek, setSelectedWeek] = useState(1);

  const weeks = Object.keys(videosByWeek).map(Number);
  const currentVideos = videosByWeek[selectedWeek as keyof typeof videosByWeek] || [];

  return (
    <>
      <PageMeta
        title="AUFT"
        description="A-Ligue Football Tournament Management System"
      />
      <PageBreadcrumb pageTitle="AUFTtv" />
      
      {/* Week Tabs */}
      <div className="mb-6 flex overflow-x-auto md:flex-wrap gap-2 border-b border-gray-200 dark:border-gray-700 scrollbar-hide">
        {weeks.map((week) => (
          <button
            key={week}
            onClick={() => setSelectedWeek(week)}
            className={`px-6 py-3 font-semibold transition-all whitespace-nowrap flex-shrink-0 ${
              selectedWeek === week
                ? "border-b-2 border-brand-500 text-brand-500"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            }`}
          >
            Week {week}
          </button>
        ))}
      </div>

      {/* Video Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
        {currentVideos.map((video) => (
          <ComponentCard key={video.id}title={video.title}>
            <div className="aspect-video overflow-hidden rounded-lg">
              <iframe
                src={video.url}
                title={video.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              ></iframe>
            </div>
          </ComponentCard>
        ))}
      </div>
    </>
  );
}
