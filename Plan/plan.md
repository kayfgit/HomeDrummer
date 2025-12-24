# Implementation Plan - HomeDrummer (v2)

## Goal
Record audio of a household object being hit and show how close it matches a selected drum's sound profile using a color-coded similarity meter.

## Styling
- **NativeWind** for all styling (Tailwind CSS syntax).

## Drum Kit Components
Standard 8-piece kit:
1. Bass Drum (Kick)
2. Snare Drum
3. High Tom
4. Mid Tom
5. Floor Tom
6. Hi-Hat
7. Crash Cymbal
8. Ride Cymbal

## Result Feedback
Color-based similarity indicator (not pass/fail):
- **Green**: Very close match
- **Yellow**: Somewhat close
- **Red**: Not close enough

---

## Proposed Changes

### Configuration
#### [MODIFY] [package.json]()
- Add: `nativewind`, `tailwindcss`, `expo-av`, `react-native-svg`, `react-native-reanimated`, `fft-js`.

---

### UI Components
#### [NEW] [components/DrumSet.tsx]()
- 8-piece drum kit visualization.
- Tappable areas to select target drum.

#### [NEW] [components/SimilarityMeter.tsx]()
- Visual feedback during/after recording.
- Color gradient bar showing match percentage (green -> yellow -> red).

---

### Logic Layer
#### [NEW] [services/AudioService.ts]()
- Permissions, Start/Stop recording, return URI.

#### [NEW] [services/AnalysisEngine.ts]()
- `analyzeSound(uri, targetDrum)` -> returns similarity percentage (0-100).

---

## Verification Plan
1. Launch app, verify drum kit renders.
2. Tap a drum, verify recording starts.
3. Hit an object, verify similarity meter displays with correct color.
