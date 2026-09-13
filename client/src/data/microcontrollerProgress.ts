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
    imageSrcSet:
      "/assets/project1_480.webp 480w, /assets/project1_800.webp 800w, /assets/project1.webp 1024w",
    repo: "https://github.com/Arifrijalf/Kipas-Otomatis-3-Kecepatan-Berbasis-Sensor-Suhu-DS18B20",
    driveUrl:
      "https://drive.google.com/drive/folders/1CZNMAuUZl66mUhxRKfNqMLktxJXYp4JU?usp=sharing",
    status: "ongoing",
    summary:
      "An ESP32 controller reads a DS18B20 temperature sensor and selects three fixed PWM targets for a 12V DC fan. Nonblocking sensor conversions keep PWM transitions responsive, while separate green, yellow, and red indicators show temperature ranges. Firmware and compile-time tests are implemented; physical acceptance testing remains pending in the repository.",
    objectives: [
      "Read room temperature through a 12-bit DS18B20 on GPIO 4",
      "Select low, medium, and high fan targets at 25, 30, and 35°C",
      "Smooth active PWM transitions while switching off immediately when cold or a sensor fault is detected",
      "Report temperature, target/applied PWM, target duty, and fan state at 115200 baud",
    ],
    features: [
      "Fan zones: T <25°C OFF; 25°C ≤ T <30°C LOW; 30°C ≤ T <35°C MEDIUM; T ≥35°C HIGH",
      "Fixed PWM targets: 0 / 76 / 153 / 255 at 25 kHz with 8-bit resolution (0 / 29.8 / 60 / 100% duty)",
      "PWM ramp: 5 counts every 20 ms toward the active target; OFF takes effect immediately",
      "One LED at a time: green 25°C ≤ T <31°C, yellow 31°C ≤ T <35°C, red T ≥35°C",
      "Nonblocking 750 ms sensor conversion, requested approximately every second",
      "Startup and detected sensor faults turn the fan and LEDs off; subsequent reads retry automatically",
    ],
    techStack: [
      "ESP32 DOIT DevKit V1",
      "PlatformIO / Arduino framework",
      "C++14",
      "OneWire",
      "DallasTemperature",
      "ESP32 LEDC PWM",
    ],
    architectureNotes: {
      components: [
        "ESP32 DOIT DevKit V1, powered by USB",
        "DS18B20: GPIO 4, 3.3V supply, 4.7 kΩ DATA pull-up",
        "IRLZ44N MOSFET driver: GPIO 15 through a 220 Ω gate resistor",
        "12V DC fan and separate 12V adapter, sharing GND with ESP32",
        "1N4007 flyback diode across the fan",
        "Green / yellow / red LEDs on GPIO 18 / 19 / 21, each with a 330 Ω resistor",
      ],
      dataFlow: [
        "Request a 12-bit DS18B20 conversion without blocking the control loop",
        "After 750 ms, check conversion completion and validate the reading within -55 to 125°C",
        "Select the fan target at 25 / 30 / 35°C and the separate LED color at 25 / 31 / 35°C",
        "Ramp LEDC duty toward the target while reporting temperature and target/applied PWM over serial",
        "On a detected fault, switch outputs off and retry on the next sensor cycle",
      ],
      deployment:
        "PlatformIO environment esp32dev targets esp32doit-devkit-v1 with the Arduino framework. The fan uses a separate 12V supply with common ground. The repository documents successful firmware builds and compile-time logic tests; upload and physical sensor, LED, driver, and fan acceptance checks remain pending.",
    },
    flowchartImage: "/assets/flowchart-project1.svg",
    blockDiagramImage: "/assets/block-diagram-project1.webp",
    blockDiagramSrcSet:
      "/assets/block-diagram-project1_480.webp 480w, /assets/block-diagram-project1_800.webp 800w, /assets/block-diagram-project1.webp 1498w",
    folderStructure: `.
├── docs/
│   └── IMPLEMENTATION.md
├── include/
│   └── FanControl.h
│   └── README.md
├── src/
│   └── main.cpp
├── test/
│   └── test_control.cpp
│   └── README.md
├── platformio.ini
├── README.md
└── WIRING.md`,
    codeSnippets: [
      {
        label: "Fan Targets & Temperature Indicators (include/FanControl.h)",
        lang: "cpp",
        code: `constexpr float ON_C = 25.0f;
constexpr float MEDIUM_C = 30.0f;
constexpr float HIGH_C = 35.0f;
constexpr uint8_t LOW_PWM = 76;
constexpr uint8_t MEDIUM_PWM = 153;
constexpr uint8_t HIGH_PWM = 255;
constexpr uint32_t RAMP_INTERVAL_MS = 20;
constexpr uint8_t RAMP_STEP = 5;

constexpr bool validTemperature(float temperature) {
    return __builtin_isfinite(temperature) && temperature >= -55.0f && temperature <= 125.0f;
}

constexpr uint8_t levelFor(float temperature) {
    if (!validTemperature(temperature) || temperature < ON_C) return 0;
    if (temperature >= HIGH_C) return 3;
    if (temperature >= MEDIUM_C) return 2;
    return 1;
}

// Temperature indicator: 0 = OFF, 1 = green, 2 = yellow, 3 = red.
constexpr uint8_t indicatorFor(float temperature) {
    if (!validTemperature(temperature) || temperature < 25.0f) return 0;
    if (temperature >= 35.0f) return 3;
    if (temperature >= 31.0f) return 2;
    return 1;
}

constexpr uint8_t pwmFor(uint8_t level) {
    switch (level) {
        case 1: return LOW_PWM;
        case 2: return MEDIUM_PWM;
        case 3: return HIGH_PWM;
        default: return 0;
    }
}`,
      },
      {
        label: "Timed PWM Ramp (include/FanControl.h)",
        lang: "cpp",
        code: `constexpr uint8_t ramp(uint8_t current, uint8_t target, uint32_t elapsedMs) {
    if (target == 0) return 0;  // OFF and faults take effect immediately.
    const uint32_t ticks = elapsedMs / RAMP_INTERVAL_MS;
    if (ticks >= 51) return target;
    const int step = static_cast<int>(ticks * RAMP_STEP);
    if (current < target) return current + step >= target ? target : current + step;
    return current - step <= target ? target : current - step;
}`,
      },
      {
        label: "Nonblocking Sensor Loop (src/main.cpp)",
        lang: "cpp",
        code: `void loop() {
    const uint32_t now = millis();
    updatePwm(now);
    if (conversionPending && now - conversionStarted >= CONVERSION_MS) {
        conversionPending = false;
        const bool conversionComplete = temperatureSensor.isConversionComplete();
        const float temperature = temperatureSensor.getTempCByIndex(0);
        if (!conversionComplete || !FanControl::validTemperature(temperature)) {
            setLevel(0);
            setIndicator(0);
            Serial.println("Temperature: SENSOR ERROR | PWM: 0 | Fan: MATI | LEDs: OFF");
        } else {
            setLevel(FanControl::levelFor(temperature));
            setIndicator(FanControl::indicatorFor(temperature));
            reportTemperature(temperature);
        }
    }
    if (!conversionPending && now - conversionStarted >= SENSOR_INTERVAL_MS) {
        startConversion();
    }
}`,
      },
    ],
    links: [
      {
        label: "GitHub Repo",
        url: "https://github.com/Arifrijalf/Kipas-Otomatis-3-Kecepatan-Berbasis-Sensor-Suhu-DS18B20",
      },
      {
        label: "Wiring Guide",
        url: "https://github.com/Arifrijalf/Kipas-Otomatis-3-Kecepatan-Berbasis-Sensor-Suhu-DS18B20/blob/main/WIRING.md",
      },
      {
        label: "Implementation & Acceptance Checks",
        url: "https://github.com/Arifrijalf/Kipas-Otomatis-3-Kecepatan-Berbasis-Sensor-Suhu-DS18B20/blob/main/docs/IMPLEMENTATION.md",
      },
      {
        label: "Control Tests",
        url: "https://github.com/Arifrijalf/Kipas-Otomatis-3-Kecepatan-Berbasis-Sensor-Suhu-DS18B20/blob/main/test/test_control.cpp",
      },
    ],
    weeks: [
      {
        week: 1,
        dateRange: "2026-08-31 — 2026-09-06",
        title: "PlatformIO Scaffold and Wiring Documentation",
        progress: [
          "September 4 repository history records the initial fan-control project and wiring guide",
          "Configured ESP32 DOIT DevKit V1 with OneWire, DallasTemperature, and serial monitoring",
          "Documented the sensor connection, MOSFET driver, separate fan supply, and common ground",
        ],
        challenges: [
          "Sensor communication depends on the DATA pull-up and correct GPIO wiring",
          "The driver and fan require physical checks beyond firmware compilation",
        ],
        selfEvaluation:
          "The initial software and wiring baseline is recorded in Git. Physical sensor accuracy and fan operation are not established by the repository's acceptance documentation.",
        nextPlan: [
          "Separate hardware-independent control logic from the Arduino loop",
          "Add boundary tests, PWM ramping, and sensor-fault recovery",
        ],
      },
      {
        week: 2,
        dateRange: "2026-09-07 — 2026-09-13",
        title: "Control Logic, Color Indicators, and Compile-Time Tests",
        progress: [
          "September 10: extracted constexpr control logic into FanControl.h and standardized project documentation (94b4c4b)",
          "Implemented nonblocking conversions, fixed PWM targets, timed ramping, and automatic recovery after sensor errors",
          "September 12: updated the high-speed threshold to 35°C and introduced one-at-a-time color indicators (f195b4f)",
          "Added static assertions for fan and LED boundaries, invalid readings, PWM targets, and ramp convergence from every initial PWM value",
          "README records successful firmware build and compile-time logic tests",
        ],
        challenges: [
          "Fan and LED thresholds differ: at 30°C the fan is medium while the indicator stays green until 31°C",
          "No hysteresis is implemented, so temperatures fluctuating near a boundary can change zones",
          "A 29.8% PWM command does not prove the fan can start or establish its measured RPM",
        ],
        selfEvaluation:
          "The current implementation and test source agree on 25/30/35°C fan thresholds and 25/31/35°C LED thresholds. Hardware acceptance remains pending; the repository does not contain completed measurement or photo logs.",
        nextPlan: [
          "Upload firmware and verify startup OFF behavior, sensor readings, and LED boundaries",
          "Check fan startup at low duty and transitions through all speed zones",
          "Disconnect and reconnect the sensor to verify fault shutdown and automatic recovery",
          "Record reference-temperature measurements, PWM observations, driver temperature, photos, and serial logs in docs/",
        ],
      },
    ],
  },
];
