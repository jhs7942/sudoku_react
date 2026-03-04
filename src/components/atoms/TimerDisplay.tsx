
interface TimerDisplayProps {
  seconds: number;
}

/**
 * TimerDisplay - MM:SS 형식 타이머 표시
 * 게임 진행 시간을 표시
 */
export function TimerDisplay({ seconds }: TimerDisplayProps) {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;

  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

  return (
    <div className="text-2xl font-mono font-bold text-slate-800">
      ⏱️ {formattedTime}
    </div>
  );
}
