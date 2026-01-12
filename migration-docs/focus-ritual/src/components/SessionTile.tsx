import { motion } from 'framer-motion';
import { Session, getPresetGrid } from '@/hooks/useTimer';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface SessionTileProps {
  session: Session;
  index: number;
}

const SessionTile = ({ session, index }: SessionTileProps) => {
  const grid = getPresetGrid(session.preset);
  const totalDots = grid.rows * grid.cols;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={cn(
        'p-4 bg-card rounded-2xl shadow-card',
        !session.completed && 'opacity-60'
      )}
    >
      <div className="flex items-start justify-between gap-4">
        {/* Mini dot grid */}
        <div
          className="grid gap-1 flex-shrink-0"
          style={{
            gridTemplateColumns: `repeat(${grid.cols}, minmax(0, 1fr))`,
          }}
        >
          {Array.from({ length: totalDots }).map((_, i) => (
            <div
              key={i}
              className={cn(
                'w-2 h-2 rounded-full',
                session.completed ? 'bg-primary' : 'bg-muted'
              )}
            />
          ))}
        </div>

        {/* Session info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium capitalize">
              {session.preset}
            </span>
            <span className="text-xs text-muted-foreground">
              {session.duration} min
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {format(new Date(session.startTime), 'h:mm a')}
          </p>
        </div>

        {/* Status */}
        {!session.completed && (
          <span className="text-xs text-muted-foreground">
            Incomplete
          </span>
        )}
      </div>
    </motion.div>
  );
};

export default SessionTile;
