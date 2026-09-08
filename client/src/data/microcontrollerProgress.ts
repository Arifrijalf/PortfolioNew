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
  mermaidFlowchart: string;
  mermaidBlock: string;
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
      "A 12V DC fan that regulates its own speed from room temperature. A DS18B20 sensor feeds an ESP32, which drives the fan through a MOSFET in three PWM tiers — slow, medium, fast — with on/off hysteresis so the fan never chatters at the temperature boundary.",
    objectives: [
      "Read temperature over OneWire from a DS18B20 on GPIO 4",
      "Drive a 3-stage fan curve with 25 kHz LEDC PWM from GPIO 15",
      "Keep switching stable with 25.5 ON / 24.5 OFF hysteresis",
      "Fail safe to fan-off on sensor disconnect",
    ],
    features: [
      "Three speeds: PWM 85 (33%), 170 (66%), 255 (100%)",
      "Hysteresis band: fan starts at 25.5 C, stops below 24.5 C",
      "Speed steps at 30.0 C and 35.0 C",
      "Fail-safe shutdown on SENSOR ERROR",
      "Per-second serial telemetry at 115200 baud",
    ],
    techStack: [
      "PlatformIO",
      "ESP32 Arduino",
      "C/C++",
      "OneWire",
      "DallasTemperature",
    ],
    architectureNotes: {
      components: [
        "ESP32 DevKit V1 (controller, esp32doit-devkit-v1)",
        "DS18B20 on GPIO 4 with mandatory 4.7k pull-up to 3.3V",
        "IRLZ44N logic-level MOSFET, gate via 220 ohm from GPIO 15",
        "1N4007 flyback diode across the 12V fan",
        "12V DC fan on an isolated 12V rail (min 1A adapter)",
      ],
      dataFlow: [
        "DS18B20 reports temperature over OneWire to GPIO 4 every 1s",
        "Firmware applies hysteresis latch, then maps to a PWM tier",
        "ESP32 writes 25 kHz LEDC on GPIO 15 and logs status to serial",
      ],
      deployment:
        "Local standalone embedded system. 12V rail isolated from the ESP32; common GND across ESP32, sensor, MOSFET, and adapter is required.",
    },
    mermaidFlowchart: `%%{init: {"flowchart": {"curve": "stepBefore"}}}%%
flowchart TD
  A[Start]
  B[Initialize ESP32, DS18B20, and PWM]
  C[Read Temperature from DS18B20]
  D{Is Temperature < 25°C?}
  E[PWM = 0<br>Fan Off]
  F[Calculate PWM Linearly<br>25-40°C → 0-255]
  G[Send PWM Signal to MOSFET]
  H[Display Data to Serial Monitor<br>Temperature, PWM, Status]
  I[Delay 1 Second]

  A --> B
  B --> C
  C --> D
  D -- Yes --> E
  D -- No --> F
  E --> G
  F --> G
  G --> H
  H --> I
  I --> C`,
    mermaidBlock: `%%{init: {"flowchart": {"curve": "stepBefore"}}}%%
flowchart LR
  subgraph Input
    A[Temperature Sensor<br>DS18B20]
  end

  subgraph Process
    B[ESP32<br>Reads temperature data<br>Calculates PWM<br>Linear Mapping]
  end

  subgraph Output
    C[MOSFET IRLZ44N<br>PWM Driver]
    D[12V DC Fan]
  end

  A -- "Digital temperature data (1-Wire)" --> B
  B -- "PWM signal (GPIO 15)" --> C
  C -- "Controlled 12V power" --> D

  style A fill:#f9f,stroke:#333,stroke-width:2px
  style B fill:#bbf,stroke:#333,stroke-width:2px
  style C fill:#bfb,stroke:#333,stroke-width:2px
  style D fill:#bfb,stroke:#333,stroke-width:2px`,
    folderStructure: `.
├── platformio.ini
├── src/
│   └── main.cpp
├── include/
├── lib/
├── test/
├── docs/
│   ├── hari-01/ … hari-07/
│   └── final/
├── WIRING.md
└── README.md`,
    codeSnippets: [
      {
        label: "Pin and Threshold Configuration (src/main.cpp)",
        lang: "cpp",
        code: `constexpr uint8_t ONE_WIRE_PIN = 4;           // DS18B20 DATA
constexpr uint8_t FAN_PWM_PIN = 15;          // MOSFET Gate (via 220 ohm)
constexpr uint8_t PWM_CHANNEL = 0;
constexpr uint8_t PWM_RESOLUTION = 8;
constexpr uint32_t PWM_FREQUENCY = 25000;    // 25 kHz, no audible whine
constexpr float FAN_ON_TEMPERATURE = 25.5f;  // fan starts
constexpr float FAN_OFF_TEMPERATURE = 24.5f; // full stop (hysteresis)
constexpr float SPEED2_TEMPERATURE = 30.0f;  // step to speed 2
constexpr float SPEED3_TEMPERATURE = 35.0f;  // step to speed 3
constexpr uint8_t SPEED1_PWM = 85;           // slow, ~33%
constexpr uint8_t SPEED2_PWM = 170;          // medium, ~66%
constexpr uint8_t SPEED3_PWM = 255;          // fast, 100%
constexpr unsigned long SENSOR_INTERVAL_MS = 1000;`,
      },
      {
        label: "Hysteresis Latch and PWM Mapping (src/main.cpp)",
        lang: "cpp",
        code: `void updateFanState(float temperature) {
    if (!fanActive && temperature >= FAN_ON_TEMPERATURE) {
        fanActive = true;
    } else if (fanActive && temperature < FAN_OFF_TEMPERATURE) {
        fanActive = false;
    }
}

uint8_t calculatePwm(float temperature) {
    if (!fanActive || temperature < FAN_OFF_TEMPERATURE) {
        return 0;
    }
    if (temperature >= SPEED3_TEMPERATURE) {
        return SPEED3_PWM;
    }
    if (temperature >= SPEED2_TEMPERATURE) {
        return SPEED2_PWM;
    }
    return SPEED1_PWM;
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
