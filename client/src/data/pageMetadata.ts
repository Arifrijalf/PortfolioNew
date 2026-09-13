export const siteOrigin = "https://arifrijalfadhilah.fun";

export const pageMetadata: Record<
  string,
  { title: string; description: string }
> = {
  "/": {
    title: "Arif Rijal Fadhilah — Electronics Engineering",
    description:
      "Electronics Engineering student building embedded systems, IoT telemetry, firmware, and practical hardware projects. Explore selected work and engineering logs.",
  },
  "/progress-microcontroller": {
    title: "Microcontroller Progress — Arif Rijal Fadhilah",
    description:
      "Follow ESP32 microcontroller projects through firmware implementation, wiring documentation, weekly progress, and planned hardware acceptance checks.",
  },
  "/progress-microcontroller/ds18b20-3-speed-fan": {
    title: "DS18B20 Automatic Fan Engineering Log — Arif Rijal Fadhilah",
    description:
      "Explore the ESP32 three-speed DS18B20 fan controller: temperature thresholds, PWM logic, wiring notes, interactive simulation, and weekly implementation logs.",
  },
};

export function getPageMetadata(path: string) {
  const normalized = path.replace(/\/$/, "") || "/";
  return (
    pageMetadata[normalized] ?? {
      title: "Page Not Found — Arif Rijal Fadhilah",
      description:
        "Return to the portfolio or explore the microcontroller engineering logbook.",
    }
  );
}
