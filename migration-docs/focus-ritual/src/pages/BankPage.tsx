import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useTimerContext } from '@/contexts/TimerContext';
import SessionTile from '@/components/SessionTile';
import { format, isToday, isYesterday, startOfDay } from 'date-fns';
import { Download, Upload, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const BankPage = () => {
  const { sessions, exportSessions, importSessions, clearSessions } = useTimerContext();

  const groupedSessions = useMemo(() => {
    const groups: { [key: string]: typeof sessions } = {};
    
    sessions.forEach(session => {
      const date = startOfDay(new Date(session.startTime)).toISOString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(session);
    });

    return Object.entries(groups).sort(([a], [b]) => 
      new Date(b).getTime() - new Date(a).getTime()
    );
  }, [sessions]);

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const content = e.target?.result as string;
          importSessions(content);
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const formatDateHeader = (dateString: string) => {
    const date = new Date(dateString);
    if (isToday(date)) return 'Today';
    if (isYesterday(date)) return 'Yesterday';
    return format(date, 'EEEE, MMM d');
  };

  const todayStats = useMemo(() => {
    const todaySessions = sessions.filter(s => 
      isToday(new Date(s.startTime)) && s.completed
    );
    return {
      count: todaySessions.length,
      minutes: todaySessions.reduce((acc, s) => acc + s.duration, 0),
    };
  }, [sessions]);

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="px-6 pt-12 pb-6">
        <h1 className="text-xl font-semibold text-foreground">Bank</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Your completed focus sessions
        </p>
      </header>

      {/* Today's summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-6 p-6 bg-card rounded-2xl shadow-card mb-6"
      >
        <p className="text-sm text-muted-foreground mb-2">Today</p>
        <div className="flex items-baseline gap-4">
          <div>
            <span className="text-3xl font-semibold text-foreground">
              {todayStats.count}
            </span>
            <span className="text-muted-foreground ml-1">sessions</span>
          </div>
          <div className="text-muted-foreground">
            {todayStats.minutes} min focused
          </div>
        </div>
      </motion.div>

      {/* Actions */}
      <div className="flex items-center gap-2 px-6 mb-6">
        <Button
          variant="outline"
          size="sm"
          onClick={exportSessions}
          disabled={sessions.length === 0}
          className="gap-2"
        >
          <Download className="w-4 h-4" />
          Export
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleImport}
          className="gap-2"
        >
          <Upload className="w-4 h-4" />
          Import
        </Button>
        {sessions.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={clearSessions}
            className="gap-2 text-destructive hover:text-destructive"
          >
            <Trash2 className="w-4 h-4" />
            Clear
          </Button>
        )}
      </div>

      {/* Session list */}
      <div className="px-6 space-y-6">
        {groupedSessions.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mx-auto mb-4">
              <div className="grid grid-cols-3 gap-1">
                {Array.from({ length: 9 }).map((_, i) => (
                  <div key={i} className="w-2 h-2 rounded-full bg-muted" />
                ))}
              </div>
            </div>
            <p className="text-muted-foreground">No sessions yet</p>
            <p className="text-sm text-muted-foreground mt-1">
              Complete a focus session to see it here
            </p>
          </div>
        ) : (
          groupedSessions.map(([date, daySessions]) => (
            <div key={date}>
              <h2 className="text-sm font-medium text-muted-foreground mb-3">
                {formatDateHeader(date)}
              </h2>
              <div className="space-y-3">
                {daySessions.map((session, index) => (
                  <SessionTile
                    key={session.id}
                    session={session}
                    index={index}
                  />
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default BankPage;
