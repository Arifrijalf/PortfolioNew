import { useRef, useState, useEffect, useCallback } from "react";

const INITIAL_TEMP = 22;
const FAN_ON_TEMP = 25.5;
const FAN_OFF_TEMP = 24.5;
const SPEED2_TEMP = 30.0;
const SPEED3_TEMP = 35.0;

const SPEED1_PWM = 85;
const SPEED2_PWM = 170;
const SPEED3_PWM = 255;

type Speed = 1 | 2 | 3 | 0;

const fanSpeedMap: Record<Speed, number> = {
  0: 0,
  1: SPEED1_PWM,
  2: SPEED2_PWM,
  3: SPEED3_PWM,
};

export function FanSimulation() {
  const [temperature, setTemperature] = useState(INITIAL_TEMP);
  const [fanSpeed, setFanSpeed] = useState<Speed>(0);
  const [running, setRunning] = useState(false);
  const animationRef = useRef<number | null>(null);

  const updateFanState = useCallback((temp: number, currentSpeed: Speed) => {
    if (currentSpeed === 0 && temp >= FAN_ON_TEMP) {
      setFanSpeed(1);
    } else if (currentSpeed > 0 && temp < FAN_OFF_TEMP) {
      setFanSpeed(0);
    }
    if (temp >= SPEED3_TEMP && currentSpeed < 3) {
      setFanSpeed(3);
    } else if (temp >= SPEED2_TEMP && currentSpeed < 2) {
      setFanSpeed(2);
    }
  }, []);

  const animate = useCallback(() => {
    if (!running) return;
    setTemperature((t) => {
      const next = t >= 40 ? 22 : Math.min(t + 0.02, 40);
      updateFanState(next, fanSpeed);
      return next;
    });
    animationRef.current = requestAnimationFrame(animate);
  }, [running, fanSpeed, updateFanState]);

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
      updateFanState(next, fanSpeed);
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
          Hysteresis & Speed Tiers
        </h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="font-mono text-[var(--accent)]">Fan OFF</p>
            <p>{"Temperature < 24.5 C"}</p>
          </div>
          <div>
            <p className="font-mono text-[var(--accent)]">Speed 1 (Slow)</p>
            <p>{"PWM 85 (~33%); 25.5C <= Temp < 30.0C"}</p>
          </div>
          <div>
            <p className="font-mono text-[var(--accent)]">Speed 2 (Medium)</p>
            <p>{"PWM 170 (~66%); 30.0C <= Temp < 35.0C"}</p>
          </div>
          <div>
            <p className="font-mono text-[var(--accent)]">Speed 3 (Fast)</p>
            <p>{"PWM 255 (100%); Temp >= 35.0C"}</p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-3 gap-2">
          <div>
            <p className="font-mono text-[var(--accent)]">{"ON ->"}</p>
            <p>{"Temp >= 25.5C (hysteresis)"}</p>
          </div>
          <div>
            <p className="font-mono text-[var(--accent)]">Speed steps</p>
            <p>{"at 30.0C and 35.0C"}</p>
          </div>
          <div>
            <p className="font-mono text-[var(--accent)]">Fail-safe</p>
            <p>{"Sensor error -> Fan OFF"}</p>
          </div>
        </div>
      </div>
    </div>
  );
}