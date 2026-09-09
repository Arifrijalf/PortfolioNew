export type ProgressWeek = {
  week: number;
  dateRange: string;
  title: string;
  progress: string[];
  challenges: string[];
  selfEvaluation: string;
  nextPlan: string[];
};

export type ProgressProject = {
  slug: string;
  title: string;
  type: string;
  category: string;
  technologies: string[];
  image: string;
  imageSrcSet?: string;
  repo: string;
  driveUrl?: string;
  status: "ongoing" | "done";
  summary: string;
  objectives: string[];
  features: string[];
  techStack: string[];
  architectureNotes: {
    components: string[];
    dataFlow: string[];
    deployment: string;
  };
  flowchartImage: string;
  flowchartSrcSet?: string;
  blockDiagramImage: string;
  blockDiagramSrcSet?: string;
  folderStructure: string;
  codeSnippets: {
    label: string;
    lang: string;
    code: string;
  }[];
  links: {
    label: string;
    url: string;
  }[];
  weeks: ProgressWeek[];
};

export const projects: ProgressProject[] = [
  {
    slug: "ds18b20-3-speed-fan",
    title: "3-Speed Automatic Fan Based on DS18B20 Temperature Sensor (ESP32)",
    type: "ESP32 / PWM FAN CONTROL",
    category: "Microcontroller",
    technologies: ["ESP32", "DS18B20", "PWM"],
    image: "/assets/project1.webp",
    imageSrcSet: "/assets/project1_480.webp 480w, /assets/project1_800.webp 800w, /assets/project1.webp 1024w",
    repo: "https://github.com/Arifrijalf/Kipas-Otomatis-3-Kecepatan-Berbasis-Sensor-Suhu-DS18B20",
    driveUrl:
      "https://drive.google.com/drive/folders/1CZNMAuUZl66mUhxRKfNqMLktxJXYp4JU?usp=sharing",
    status: "ongoing",
    summary:
      "Conventional fans are still operated manually, often causing energy waste. This system uses a DS18B20 digital temperature sensor and ESP32 to automatically adjust fan speed in 3 tiers (Low, Medium, High) based on room temperature changes.",
    objectives: [
      "Read temperature data using a DS18B20 sensor with ESP32",
      "Control fan speed using PWM (Pulse Width Modulation) signals",
      "Display temperature and fan speed information to the user via Serial Monitor",
      "Optimize energy usage by turning off the fan when the room is cool",
    ],
    features: [
      "Three speeds: Low (PWM 76), Medium (PWM 153), High (PWM 255)",
      "Temperature Zones: <25°C (Off), 25-30°C (Low), 30-40°C (Medium), >40°C (High)",
      "LED Indicators: LED 1 (Warm), LED 1-2 (Hot), LED 1-2-3 (Very Hot)",
      "Flyback protection using a 1N4007 diode to safeguard the MOSFET",
      "Real-time debugging via Serial Monitor",
    ],
    techStack: [
      "ESP32 Dev Board",
      "Arduino IDE / PlatformIO",
      "C++",
      "OneWire Library",
      "DallasTemperature Library",
    ],
    architectureNotes: {
      components: [
        "ESP32 Dev Board (DOIT DEVKIT V1)",
        "DS18B20 Temperature Sensor (Digital, 1-Wire)",
        "MOSFET IRLZ44N (N-Channel Logic-Level)",
        "1N4007 Diode (Flyback Protection)",
        "3x LED Indicators",
        "Resistor (4.7k Pull-up & Gate Resistor)",
        "Fan DC 12V",
        "Adaptor Power Supply 12V 1A",
      ],
      dataFlow: [
        "DS18B20 sensor sends digital temperature data to ESP32 via 1-Wire protocol",
        "ESP32 compares temperature against the defined thresholds",
        "ESP32 sends PWM signal (0-255) to MOSFET Gate to regulate fan power",
        "System status is sent to Serial Monitor and LED indicators are updated",
      ],
      deployment:
        "Standalone Embedded System. Fan powered by a separate 12V adapter with Common Ground to ESP32. MOSFET acts as a fast electronic switch (PWM).",
    },
    flowchartImage: "/assets/flowchart-project1.svg",
    blockDiagramImage: "/assets/block-diagram-project1.webp",
    blockDiagramSrcSet:
      "/assets/block-diagram-project1_480.webp 480w, /assets/block-diagram-project1_800.webp 800w, /assets/block-diagram-project1.webp 1498w",
    folderStructure: `.
├── platformio.ini
├── src/
│   └── main.cpp
├── include/
├── lib/
├── test/
└── README.md`,
    codeSnippets: [
      {
        label: "Constants & Thresholds (main.cpp)",
        lang: "cpp",
        code: `// Pin Definitions
const int SENSOR_PIN = 4;
const int FAN_PWM_PIN = 15;
const int LED1 = 18;
const int LED2 = 19;
const int LED3 = 21;

// Thresholds
const float TEMP_COLD = 25.0;
const float TEMP_WARM = 30.0;
const float TEMP_HOT = 40.0;

// PWM Values
const int PWM_LOW = 76;   // 30%
const int PWM_MED = 153;  // 60%
const int PWM_HIGH = 255; // 100%`,
      },
      {
        label: "Speed Control Logic (main.cpp)",
        lang: "cpp",
        code: `void controlFan(float temp) {
  if (temp < TEMP_COLD) {
    analogWrite(FAN_PWM_PIN, 0);
    setLEDs(LOW, LOW, LOW);
  } else if (temp < TEMP_WARM) {
    analogWrite(FAN_PWM_PIN, PWM_LOW);
    setLEDs(HIGH, LOW, LOW);
  } else if (temp < TEMP_HOT) {
    analogWrite(FAN_PWM_PIN, PWM_MED);
    setLEDs(HIGH, HIGH, LOW);
  } else {
    analogWrite(FAN_PWM_PIN, PWM_HIGH);
    setLEDs(HIGH, HIGH, HIGH);
  }
}`,
      },
    ],
    links: [
      {
        label: "GitHub Repo",
        url: "https://github.com/Arifrijalf/Kipas-Otomatis-3-Kecepatan-Berbasis-Sensor-Suhu-DS18B20",
      },
    ],
    weeks: [
      {
        week: 1,
        dateRange: "2026-08-24 — 2026-08-30",
        title: "Scaffold, Wiring Docs, and Threshold Firmware",
        progress: [
          "Scaffolded PlatformIO project (esp32doit-devkit-v1, OneWire + DallasTemperature auto-installed)",
          "Wrote WIRING.md: GPIO 4 sensor / GPIO 15 PWM pin mapping with a 13-row pin-to-pin table",
          "Implemented hysteresis firmware (25.5 ON / 24.5 OFF, steps at 30.0 and 35.0) with 25 kHz LEDC output",
          "Added per-second serial telemetry (Smart Fan initialized, temp / PWM / SPEED lines)",
          "Scaffolded docs/hari-01 through hari-07 plus docs/final for daily photo and serial logs",
        ],
        challenges: [
          "DS18B20 needs the 4.7k pull-up between 3.3V and DATA or it never reads",
          "Common GND across ESP32, sensor, MOSFET, and 12V adapter is easy to forget and breaks PWM stability",
          "Only a logic-level MOSFET (IRLZ44N) fully opens at 3.3V Vgs; a non-logic type overheats",
          "Clone boards may need the BOOT button held during upload",
        ],
        selfEvaluation:
          "Control loop, wiring documentation, and project scaffold are complete and verifiable in the repo. Daily photo and serial logs in docs/hari-01 through hari-07 are still unfilled upstream.",
        nextPlan: [
          "Fill daily logs with foto-utama.jpg and serial captures per folder",
          "Bench-test finger and ice transitions through SPEED 1, 2, and 3",
          "Verify fan cuts out below 24.5 C and sensor-error shutdown works",
          "Mount the DS18B20 outside the enclosure, then connect the 12V fan",
        ],
      },
      {
        week: 2,
        dateRange: "2026-08-31 — 2026-09-06",
        title: "Sensor Validation on Serial",
        progress: [
          "Wired DS18B20 on GPIO 4 with 4.7k pull-up to 3.3V",
          "Confirmed sane readings at 115200 baud",
          "Tested finger/ice transitions crossing 25.5/30/35 C",
        ],
        challenges: [
          "SENSOR ERROR / -127 readings (pull-up missing, DATA/VDD/GND swapped, wrong pin)",
        ],
        selfEvaluation:
          "Sensor validation passed against a reference thermometer. No fan connected yet.",
        nextPlan: [
          "Wire the MOSFET stage (GPIO 15 → 220 Ω → IRLZ44N gate, 1N4007 flyback, 12 V rail with common GND)",
          "Observe SPEED 1/2/3 transitions",
        ],
      },
      {
        week: 3,
        dateRange: "2026-09-07 — 2026-09-13",
        title: "Fan Driver and Speed Tiers",
        progress: [
          "Wired GPIO 15 → 220 Ω → IRLZ44N gate",
          "Added 1N4007 flyback diode across the 12V fan",
          "Ensured common GND across ESP32, MOSFET, and 12V adapter",
          "Observed SPEED 1/2/3 transitions",
        ],
        challenges: [
          "Fan still while serial shows SPEED (adapter unplugged, GND not joined, Drain/Source swapped, diode reversed)",
          "Hot MOSFET (non-logic-level type)",
          "Audible whine (PWM ≠ 25 kHz)",
        ],
        selfEvaluation:
          "Driver stage validated. Enclosure and final test pending.",
        nextPlan: [
          "Mount DS18B20 outside the enclosure",
          "Connect the 12V fan",
          "Perform full hot/cold cycle test",
          "Fill docs/hari-0X + docs/final with photos/serial logs",
          "Link the Drive report",
        ],
      },
      {
        week: 4,
        dateRange: "2026-09-14 — 2026-09-20",
        title: "Enclosure, Final Test, and Report",
        progress: [
          "Mounted DS18B20 outside the enclosure",
          "Connected the 12V fan",
          "Performed full hot/cold cycle test",
          "Filled docs/hari-0X + docs/final with photos/serial logs",
          "Linked the Drive report",
        ],
        challenges: [
          "...",
        ],
        selfEvaluation:
          "...",
        nextPlan: [
          "...",
        ],
      },
    ],
  },
];
