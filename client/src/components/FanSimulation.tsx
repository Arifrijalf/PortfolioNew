import { useRef, useState, useEffect, useCallback } from "react";

const INITIAL_TEMP = 22;
const TEMP_COLD = 25.0;
const TEMP_WARM = 30.0;
const TEMP_HOT = 40.0;

const PWM_LOW = 76;
const PWM_MED = 153;
const PWM_HIGH = 255;

type Speed = 0 | 1 | 2 | 3;

const fanSpeedMap: Record<Speed, number> = {
  0: 0,
  1: PWM_LOW,
  2: PWM_MED,
  3: PWM_HIGH,
};

export function FanSimulation() {
  const [temperature, setTemperature] = useState(INITIAL_TEMP);
  const [fanSpeed, setFanSpeed] = useState<Speed>(0);
  const [running, setRunning] = useState(false);
  const animationRef = useRef<number | null>(null);

  const updateFanState = useCallback((temp: number) => {
    if (temp < TEMP_COLD) {
      setFanSpeed(0);
    } else if (temp < TEMP_WARM) {
      setFanSpeed(1);
    } else if (temp < TEMP_HOT) {
      setFanSpeed(2);
    } else {
      setFanSpeed(3);
    }
  }, []);

  const animate = useCallback(() => {
    if (!running) return;
    setTemperature((t) => {
      const next = t >= 50 ? 22 : Math.min(t + 0.05, 50);
      updateFanState(next);
      return next;
    });
    animationRef.current = requestAnimationFrame(animate);
  }, [running, updateFanState]);

  const toggleRun = () => {
    setRunning(!running);
    if (running) {
      animationRef.current && cancelAnimationFrame(animationRef.current!);
    } else {
      animate();
    }
  };

  const manualStep = (delta: number) => {
    setTemperature((t) => {
      const next = Math.max(20, Math.min(40, t + delta));
      updateFanState(next);
      return next;
    });
  };

  useEffect(() => {
    if (running) {
      animate();
    }
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current!);
    };
  }, [running, animate]);

  return (
    <div className="space-y-8">
      <div className="border rounded-lg p-6 border-[var(--line)]">
        <h3 className="text-[10px] uppercase tracking-widest text-[var(--accent)] font-mono mb-4">
          Temperature & Fan Speed Simulation
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div>
            <p className="text-sm text-[var(--ink-soft)] mb-1">Current Temperature</p>
            <p className="text-3xl font-bold font-serif">
              {temperature.toFixed(1)} C
            </p>
          </div>
          <div>
            <p className="text-sm text-[var(--ink-soft)] mb-1">Fan Speed</p>
            <p className="text-3xl font-bold">
              {fanSpeed === 0
                ? "OFF"
                : `Speed ${fanSpeed} (PWM ${fanSpeedMap[fanSpeed]})`}
            </p>
          </div>
        </div>

        <div className="mt-6 h-64 rounded bg-[var(--paper)] relative overflow-hidden">
          <div
            className="absolute bottom-0 left-0 right-0 bg-[var(--accent)]"
            style={{ height: `${(temperature - 20) / 20 * 100}%` }}
          ></div>
        </div>

        <div className="mt-6 grid grid-cols-3 gap-2">
          <button
            onClick={() => manualStep(-2)}
            className="flex-1 py-2 rounded border border-[var(--line)] hover:bg-[var(--accent)] text-[10px] uppercase tracking-widest transition-colors"
          >
            -2C
          </button>
          <button
            onClick={() => manualStep(2)}
            className="flex-1 py-2 rounded border border-[var(--line)] hover:bg-[var(--accent)] text-[10px] uppercase tracking-widest transition-colors"
          >
            +2C
          </button>
          <button onClick={toggleRun} className="flex-1 py-2 rounded border border-[var(--line)] hover:bg-[var(--accent)] text-[10px] uppercase tracking-widest transition-colors">
            {running ? "Pause" : "Run"}
          </button>
        </div>
      </div>

      <div className="border rounded-lg p-6 border-[var(--line)]">
        <h3 className="text-[10px] uppercase tracking-widest text-[var(--accent)] font-mono mb-4">
          Temperature Zones & PWM
        </h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="font-mono text-[var(--accent)]">Cold (Off)</p>
            <p>{"Temp < 25°C; PWM 0"}</p>
          </div>
          <div>
            <p className="font-mono text-[var(--accent)]">Warm (Low)</p>
            <p>{"25°C - 30°C; PWM 76 (30%)"}</p>
          </div>
          <div>
            <p className="font-mono text-[var(--accent)]">Hot (Medium)</p>
            <p>{"30°C - 40°C; PWM 153 (60%)"}</p>
          </div>
          <div>
            <p className="font-mono text-[var(--accent)]">Very Hot (High)</p>
            <p>{"> 40°C; PWM 255 (100%)"}</p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-3 gap-2">
          <div>
            <p className="font-mono text-[var(--accent)]">LED 1</p>
            <p>{"Temp >= 25°C"}</p>
          </div>
          <div>
            <p className="font-mono text-[var(--accent)]">LED 2</p>
            <p>{"Temp >= 30°C"}</p>
          </div>
          <div>
            <p className="font-mono text-[var(--accent)]">LED 3</p>
            <p>{"Temp >= 40°C"}</p>
          </div>
        </div>
      </div>
    </div>
  );
}