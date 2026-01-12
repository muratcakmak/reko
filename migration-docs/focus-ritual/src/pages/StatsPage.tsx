import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useTimerContext } from '@/contexts/TimerContext';
import { isToday, subDays, startOfDay, format } from 'date-fns';

const StatsPage = () => {
  const { sessions } = useTimerContext();

  const todayStats = useMemo(() => {
    const todaySessions = sessions.filter(s => 
      isToday(new Date(s.startTime)) && s.completed
    );
    return {
      count: todaySessions.length,
      minutes: todaySessions.reduce((acc, s) => acc + s.duration, 0),
    };
  }, [sessions]);

  const weekData = useMemo(() => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const date = subDays(new Date(), i);
      const dayStart = startOfDay(date);
      const daySessions = sessions.filter(s => {
        const sessionDate = startOfDay(new Date(s.startTime));
        return sessionDate.getTime() === dayStart.getTime() && s.completed;
      });
      days.push({
        date,
        day: format(date, 'EEE'),
        sessions: daySessions.length,
        minutes: daySessions.reduce((acc, s) => acc + s.duration, 0),
      });
    }
    return days;
  }, [sessions]);

  const maxMinutes = Math.max(...weekData.map(d => d.minutes), 1);
  const weekTotal = weekData.reduce((acc, d) => acc + d.minutes, 0);
  const weekSessions = weekData.reduce((acc, d) => acc + d.sessions, 0);

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="px-6 pt-12 pb-6">
        <h1 className="text-xl font-semibold text-foreground">Stats</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Your focus patterns
        </p>
      </header>

      {/* Today card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-6 p-6 bg-card rounded-2xl shadow-card mb-6"
      >
        <p className="text-sm text-muted-foreground mb-4">Today</p>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <span className="text-4xl font-semibold text-foreground">
              {todayStats.count}
            </span>
            <p className="text-muted-foreground text-sm mt-1">sessions</p>
          </div>
          <div>
            <span className="text-4xl font-semibold text-primary">
              {todayStats.minutes}
            </span>
            <p className="text-muted-foreground text-sm mt-1">minutes</p>
          </div>
        </div>
      </motion.div>

      {/* Week chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mx-6 p-6 bg-card rounded-2xl shadow-card mb-6"
      >
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-muted-foreground">Last 7 days</p>
          <p className="text-sm font-medium text-foreground">
            {weekTotal} min · {weekSessions} sessions
          </p>
        </div>
        
        {/* Bar chart */}
        <div className="flex items-end justify-between gap-2 h-32">
          {weekData.map((day, index) => {
            const height = day.minutes > 0 
              ? Math.max((day.minutes / maxMinutes) * 100, 8) 
              : 8;
            const isActiveToday = isToday(day.date);
            
            return (
              <motion.div
                key={day.day}
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ delay: index * 0.05 }}
                className="flex flex-col items-center gap-2 flex-1"
                style={{ originY: 1 }}
              >
                <div className="relative w-full flex justify-center">
                  <div
                    className={`w-6 rounded-t-lg transition-colors ${
                      day.minutes > 0 
                        ? isActiveToday 
                          ? 'bg-primary' 
                          : 'bg-primary/60'
                        : 'bg-muted'
                    }`}
                    style={{ height: `${height}px` }}
                  />
                </div>
                <span className={`text-xs ${
                  isActiveToday ? 'text-foreground font-medium' : 'text-muted-foreground'
                }`}>
                  {day.day}
                </span>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Dot heatmap */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mx-6 p-6 bg-card rounded-2xl shadow-card"
      >
        <p className="text-sm text-muted-foreground mb-4">Session dots</p>
        <div className="flex flex-wrap gap-2">
          {weekData.flatMap((day, dayIndex) =>
            Array.from({ length: day.sessions }).map((_, i) => (
              <motion.div
                key={`${day.day}-${i}`}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: (dayIndex * 4 + i) * 0.03 }}
                className="w-4 h-4 rounded-full bg-primary"
              />
            ))
          )}
          {weekSessions === 0 && (
            <p className="text-muted-foreground text-sm">
              Complete sessions to see dots here
            </p>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default StatsPage;
