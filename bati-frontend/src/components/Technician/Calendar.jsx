import { useState } from "react";

const DAYS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

const MOCK_EVENTS = [
  {
    id: 1,
    title: "Rénovation SDB – Paul N.",
    date: 5,
    time: "09:00",
    type: "job",
  },
  { id: 2, title: "Devis – Sophie K.", date: 7, time: "14:00", type: "quote" },
  {
    id: 3,
    title: "Installation élec. – Marie A.",
    date: 12,
    time: "10:00",
    type: "job",
  },
  { id: 4, title: "Finitions – Eric F.", date: 15, time: "08:30", type: "job" },
  { id: 5, title: "Visite chantier", date: 20, time: "16:00", type: "visit" },
];

const Calendar = () => {
  const [currentMonth] = useState("Août 2026");
  const daysInMonth = 31;
  const startDay = 4; // Jeudi (0 = Lun)

  const getEventsForDay = (day) => MOCK_EVENTS.filter((e) => e.date === day);

  const typeColor = {
    job: "bg-orange-100 text-orange-700 border-orange-200",
    quote: "bg-blue-100 text-blue-700 border-blue-200",
    visit: "bg-green-100 text-green-700 border-green-200",
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Calendrier</h1>
        <p className="text-gray-600 mt-1">
          Planifiez et suivez vos interventions
        </p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {/* Header mois */}
        <div className="px-6 py-4 border-b flex items-center justify-between">
          <button className="p-2 hover:bg-gray-100 rounded-lg">←</button>
          <h2 className="font-semibold text-gray-900">{currentMonth}</h2>
          <button className="p-2 hover:bg-gray-100 rounded-lg">→</button>
        </div>

        {/* Jours de la semaine */}
        <div className="grid grid-cols-7 border-b">
          {DAYS.map((day) => (
            <div
              key={day}
              className="py-2 text-center text-xs font-medium text-gray-500"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Grille */}
        <div className="grid grid-cols-7">
          {/* Cases vides avant le 1er */}
          {Array.from({ length: startDay }).map((_, i) => (
            <div
              key={`empty-${i}`}
              className="min-h-20 border-b border-r border-gray-100 bg-gray-50"
            />
          ))}

          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const events = getEventsForDay(day);
            return (
              <div
                key={day}
                className="min-h-20 border-b border-r border-gray-100 p-1.5 hover:bg-orange-50/50 transition"
              >
                <span className="text-sm font-medium text-gray-700">{day}</span>
                <div className="mt-1 space-y-0.5">
                  {events.map((ev) => (
                    <div
                      key={ev.id}
                      className={`text-[10px] px-1 py-0.5 rounded border truncate ${typeColor[ev.type]}`}
                      title={`${ev.time} – ${ev.title}`}
                    >
                      {ev.time} {ev.title}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Légende + prochains événements */}
      <div className="grid sm:grid-cols-2 gap-5">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="font-semibold text-gray-900 mb-3">Légende</h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-orange-400" /> Chantier
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-blue-400" /> Devis / RDV
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-green-400" /> Visite
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="font-semibold text-gray-900 mb-3">
            Prochains événements
          </h3>
          <div className="space-y-3">
            {MOCK_EVENTS.slice(0, 4).map((ev) => (
              <div key={ev.id} className="flex items-center gap-3 text-sm">
                <span className="text-gray-400 w-12">{ev.date} août</span>
                <span className="font-medium text-gray-900">{ev.time}</span>
                <span className="text-gray-600 truncate">{ev.title}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;
