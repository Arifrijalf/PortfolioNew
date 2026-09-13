import { useState, useEffect } from "react";

const zones = [
  { label: "Off", range: "T <25 C", pwm: 0 },
  { label: "Low", range: "25 C <= T <30 C", pwm: 76 },
  { label: "Medium", range: "30 C <= T <35 C", pwm: 153 },
  { label: "High", range: "T >=35 C", pwm: 255 },
];

export function FanSimulation() {
  const [temperature, setTemperature] = useState(22);
  const [running, setRunning] = useState(false);
  const level =
    temperature < 25 ? 0 : temperature < 30 ? 1 : temperature < 35 ? 2 : 3;
  const indicator =
    temperature < 25
      ? "Off"
      : temperature < 31
        ? "Green"
        : temperature < 35
          ? "Yellow"
          : "Red";

  useEffect(() => {
    if (!running) return;
    const timer = window.setInterval(() => {
      setTemperature(current =>
        current >= 40 ? 20 : Math.min(40, Math.round((current + 0.1) * 10) / 10)
      );
    }, 100);
    return () => window.clearInterval(timer);
  }, [running]);

  const adjustTemperature = (value: number) => {
    setRunning(false);
    setTemperature(Math.max(20, Math.min(40, value)));
  };

  return (
    <div className="simulation-panel">
      <p className="section-overline">Try the control logic</p>
      <h2>Temperature & fan simulation</h2>
      <div className="simulation-layout">
        <div>
          <p className="text-sm text-[var(--ink-soft)]">
            Move the slider to explore each fan target and temperature
            indicator.
          </p>
          <dl className="simulation-readings">
            <div>
              <dt>Temperature</dt>
              <dd>{temperature.toFixed(1)} C</dd>
            </div>
            <div>
              <dt>Fan target</dt>
              <dd>
                {zones[level].label} / {zones[level].pwm}
              </dd>
            </div>
          </dl>
          <label htmlFor="simulation-temperature" className="text-sm">
            Temperature (20 to 40 C)
          </label>
          <input
            id="simulation-temperature"
            type="range"
            min="20"
            max="40"
            step="0.1"
            value={temperature}
            aria-valuetext={`${temperature.toFixed(1)} degrees Celsius`}
            onChange={event => adjustTemperature(Number(event.target.value))}
          />
          <p className="text-sm">
            Active LED: <strong>{indicator}</strong>
          </p>
          <div className="simulation-controls">
            <button
              type="button"
              onClick={() => adjustTemperature(temperature - 1)}
              disabled={temperature <= 20}
            >
              -1 C
            </button>
            <button
              type="button"
              onClick={() => adjustTemperature(temperature + 1)}
              disabled={temperature >= 40}
            >
              +1 C
            </button>
            <button
              type="button"
              onClick={() => setRunning(current => !current)}
              aria-pressed={running}
            >
              {running ? "Pause" : "Run"}
            </button>
            <button type="button" onClick={() => adjustTemperature(22)}>
              Reset
            </button>
          </div>
        </div>
        <div>
          <table className="simulation-table">
            <caption className="text-left text-sm mb-3">
              Fan temperature zones
            </caption>
            <thead>
              <tr>
                <th scope="col">Target</th>
                <th scope="col">Temperature</th>
                <th scope="col">PWM</th>
              </tr>
            </thead>
            <tbody>
              {zones.map((zone, index) => (
                <tr key={zone.label} data-active={index === level}>
                  <th scope="row">{zone.label}</th>
                  <td>{zone.range}</td>
                  <td>{zone.pwm}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="simulation-note">
            One LED at a time: green from 25 to below 31 C, yellow from 31 to
            below 35 C, red at 35 C and above. All LEDs are off below 25 C.
          </p>
        </div>
      </div>
      <p className="simulation-note">
        This demonstration shows target duty. Firmware ramps applied PWM by 5
        counts every 20 ms; OFF is immediate when detected. PWM is a command,
        not measured RPM.
      </p>
    </div>
  );
}
