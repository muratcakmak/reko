import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTimerContext } from '@/contexts/TimerContext';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Timer, Volume2, Vibrate, Play, Eye } from 'lucide-react';

const YouPage = () => {
  const { settings, updateSettings } = useTimerContext();
  const [profile, setProfile] = useState(() => {
    const stored = localStorage.getItem('odak-profile');
    return stored ? JSON.parse(stored) : { name: '', weeklyGoal: 5 };
  });

  const saveProfile = (updates: Partial<typeof profile>) => {
    const newProfile = { ...profile, ...updates };
    setProfile(newProfile);
    localStorage.setItem('odak-profile', JSON.stringify(newProfile));
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="px-6 pt-12 pb-6">
        <h1 className="text-xl font-semibold text-foreground">You</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Settings & preferences
        </p>
      </header>

      {/* Profile section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-6 p-6 bg-card rounded-2xl shadow-card mb-6"
      >
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1">
            <h2 className="font-medium text-foreground">Profile</h2>
            <p className="text-sm text-muted-foreground">Personalize your experience</p>
          </div>
        </div>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="name" className="text-sm text-muted-foreground">
              Display name
            </Label>
            <Input
              id="name"
              placeholder="Your name"
              value={profile.name}
              onChange={(e) => saveProfile({ name: e.target.value })}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="goal" className="text-sm text-muted-foreground">
              Weekly session goal
            </Label>
            <Input
              id="goal"
              type="number"
              min={1}
              max={50}
              value={profile.weeklyGoal}
              onChange={(e) => saveProfile({ weeklyGoal: parseInt(e.target.value) || 5 })}
              className="mt-1"
            />
          </div>
        </div>
      </motion.div>

      {/* Duration settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mx-6 p-6 bg-card rounded-2xl shadow-card mb-6"
      >
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Timer className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1">
            <h2 className="font-medium text-foreground">Durations</h2>
            <p className="text-sm text-muted-foreground">Customize session lengths</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-sm">Quick focus</Label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                min={5}
                max={30}
                value={settings.quickDuration}
                onChange={(e) => updateSettings({ quickDuration: parseInt(e.target.value) || 10 })}
                className="w-20 text-center"
              />
              <span className="text-sm text-muted-foreground">min</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <Label className="text-sm">Standard focus</Label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                min={15}
                max={45}
                value={settings.standardDuration}
                onChange={(e) => updateSettings({ standardDuration: parseInt(e.target.value) || 25 })}
                className="w-20 text-center"
              />
              <span className="text-sm text-muted-foreground">min</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <Label className="text-sm">Deep focus</Label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                min={30}
                max={90}
                value={settings.deepDuration}
                onChange={(e) => updateSettings({ deepDuration: parseInt(e.target.value) || 50 })}
                className="w-20 text-center"
              />
              <span className="text-sm text-muted-foreground">min</span>
            </div>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-border">
            <Label className="text-sm">Break duration</Label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                min={1}
                max={15}
                value={settings.breakDuration}
                onChange={(e) => updateSettings({ breakDuration: parseInt(e.target.value) || 5 })}
                className="w-20 text-center"
              />
              <span className="text-sm text-muted-foreground">min</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Behavior settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mx-6 p-6 bg-card rounded-2xl shadow-card"
      >
        <h2 className="font-medium text-foreground mb-6">Behavior</h2>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Eye className="w-5 h-5 text-muted-foreground" />
              <div>
                <Label className="text-sm">Show time remaining</Label>
                <p className="text-xs text-muted-foreground">Display minutes during focus</p>
              </div>
            </div>
            <Switch
              checked={settings.showMinutesRemaining}
              onCheckedChange={(checked) => updateSettings({ showMinutesRemaining: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Play className="w-5 h-5 text-muted-foreground" />
              <div>
                <Label className="text-sm">Auto-start break</Label>
                <p className="text-xs text-muted-foreground">Begin break after focus ends</p>
              </div>
            </div>
            <Switch
              checked={settings.autoStartBreak}
              onCheckedChange={(checked) => updateSettings({ autoStartBreak: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Volume2 className="w-5 h-5 text-muted-foreground" />
              <div>
                <Label className="text-sm">Sounds</Label>
                <p className="text-xs text-muted-foreground">Audio feedback</p>
              </div>
            </div>
            <Switch
              checked={settings.soundEnabled}
              onCheckedChange={(checked) => updateSettings({ soundEnabled: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Vibrate className="w-5 h-5 text-muted-foreground" />
              <div>
                <Label className="text-sm">Vibration</Label>
                <p className="text-xs text-muted-foreground">Haptic feedback</p>
              </div>
            </div>
            <Switch
              checked={settings.vibrationEnabled}
              onCheckedChange={(checked) => updateSettings({ vibrationEnabled: checked })}
            />
          </div>
        </div>
      </motion.div>

      {/* App info */}
      <div className="px-6 py-8 text-center">
        <p className="text-sm font-medium text-foreground">Odak</p>
        <p className="text-xs text-muted-foreground mt-1">
          Commit to the next 25.
        </p>
      </div>
    </div>
  );
};

export default YouPage;
