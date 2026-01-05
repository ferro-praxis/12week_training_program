# 🏋️ Jay Cutler 12-Week Home Training Tracker

A comprehensive mobile-first Progressive Web App (PWA) for tracking Jay Cutler's 12-Week Home Training Programs. Built with Vue.js, Tailwind CSS, and designed for optimal mobile workout tracking experience.

## 📱 Live Demo

Open `index.html` in your browser or deploy to any static hosting service. The app works completely offline after the first load thanks to PWA capabilities.

## 🎯 Project Overview

This fitness tracking application provides a complete daily workout companion with:
- **Two Training Programs**: Bodyweight (4 days/week) and Dumbbell (5 days/week)
- **Dual Program Tracking**: Switch between programs while maintaining separate progress for each
- **Weight Tracking (Dumbbell)**: Record weights used per set with previous workout references
- **12-Week Progressive Overload**: Build weeks (1-3) and Deload weeks (4) in 4-week cycles
- **Exercise-by-Exercise Tracking**: Step-through each exercise with set and rep logging
- **Built-in Rest Timer**: Automatic countdown with audio/vibration alerts
- **Progress Dashboard**: Comprehensive tracking of workouts, streaks, and time trained
- **Oregon Timezone Support**: Accurate date tracking for Pacific Time (PST/PDT)
- **Offline Support**: Full PWA with service worker for offline functionality

---

## ✅ Currently Completed Features

### Core Functionality
✅ **Dual Program Management** 🆕
- Independent progress tracking for Bodyweight and Dumbbell programs
- Switch between programs without losing progress
- Dashboard displays both programs' stats when active
- Each program maintains separate: workouts, cardio logs, start dates, and time trained

✅ **Program Selection & Onboarding**
- Two program options: Bodyweight and Dumbbell
- Automatic start date tracking (Oregon timezone)
- Program information display

✅ **Dashboard (Home Screen)**
- **All Programs Overview Card** 🆕 - View progress for both programs side-by-side
- Active program highlighted with "Active" badge
- Progress overview with completion percentage (for active program)
- Current week and day tracking
- Workouts completed this week (X/4 or X/5)
- Total workouts completed (X/48 or X/60)
- Progress bar for overall program completion
- Streak counter (consecutive days with activities)
- Today's schedule card with workout name and status
- Quick stats: Streak, Time Trained, Week Type (Build/Deload)
- Cardio completion toggle

✅ **Workout Tracker Screen**
- Pre-workout view with full exercise list
- Exercise-by-exercise progression
- Set counter (Set X of Y)
- Target reps display
- **Weight Input Field (Dumbbell mode only)** 🆕
- **Previous Weights Display** 🆕 - Shows last used weights for each exercise
- Tempo/instruction reminders
- Actual reps input
- Set logging and confirmation (with weight for dumbbell exercises)
- Exercise navigation (Previous/Next)
- Workout progress indicator
- Pause and cancel workout options

✅ **Built-in Rest Timer**
- Automatic countdown (45s for bodyweight, 60s for dumbbell)
- Circular visual progress indicator
- Audio alert when rest completes (Web Audio API beep)
- Vibration alert (on supported devices)
- Add 15 seconds option
- Skip rest option

✅ **Workout Completion**
- Post-workout summary (time, exercises, sets, weights for dumbbell)
- Motivational completion message
- Automatic progress saving (weights saved per exercise for dumbbell)
- Trophy celebration screen

✅ **Weekly Schedule View**
- Calendar showing all 7 days of current week
- Workout names and types displayed
- Completed workouts marked with checkmark
- Current day highlighted (Oregon timezone accurate)
- Rest days clearly marked
- Visual status indicators

✅ **Cardio Tracker**
- Daily 30-minute fasted cardio reminder
- Simple checkbox completion
- Cardio log integrated into streak counter
- Available on both workout and rest days

✅ **Settings & Profile**
- Current program display
- **Switch program option (preserves both programs' progress)** 🆕
- Reset progress functionality (for current program only)
- Dark mode toggle
- Statistics display (workouts, time, streak, start date)

✅ **Data Persistence**
- LocalStorage for all user data
- **Separate storage for each program** 🆕
- **Exercise weight history (Dumbbell mode)** 🆕
- Workout history saved with weights (Dumbbell)
- Cardio log saved
- User preferences saved
- Survives page refresh
- **Automatic migration from old data format** 🆕

✅ **Mobile Optimization**
- Responsive design (320px-428px optimized)
- Touch-friendly buttons (44px+ tap targets)
- Bottom navigation bar
- Smooth transitions and animations
- Pull-to-refresh disabled
- Safe area support for iOS notch

✅ **PWA Support**
- Service worker for offline functionality
- Web app manifest
- Installable on home screen
- Caching strategy for assets
- Works offline after first load

✅ **UI/UX**
- Light and dark mode
- Color-coded status indicators
- Progress bars and visual feedback
- Card-based layout
- Smooth animations
- Motivational icons and messages

---

## 📋 Program Structure

### Bodyweight Program (4 workouts/week)
**Weekly Pattern**: A → B → Rest → C → D → Rest → Rest

- **Workout A**: Push/Abs/Calves (Push Ups, Diamond Push Ups, Pike Push Ups, Crunches, Calf Raises)
- **Workout B**: Legs (Squats, Lunges, Bulgarian Split Squats, Wall Sit)
- **Workout C**: Pull/Abs/Calves (Pull Ups, Chin Ups, Inverted Rows, Plank, Calf Raises)
- **Workout D**: Legs (Jump Squats, Walking Lunges, Single Leg RDLs, Glute Bridges)

**Progression**:
- Weeks 1-4: Foundation exercises
- Weeks 5-8: Progressive variations
- Weeks 9-12: Advanced variations
- Rest Period: 45 seconds

### Dumbbell Program (5 workouts/week)
**Weekly Pattern**: 1 → 2 → 3 → Rest → 4 → 5 → Rest

- **Day 1**: Calves & Shoulders (DB Calf Raises, Standing DB Press, Lateral Raises, Front Raises, Shrugs)
- **Day 2**: Chest (Floor DB Press, DB Flyes, DB Pullovers, Close Grip DB Press)
- **Day 3**: Back & Abs (Bent Over Rows, Single Arm Rows, DB Deadlifts, DB Pullovers, Weighted Crunches)
- **Day 4**: Arms (Alternating Curls, Hammer Curls, Overhead Extension, Kickbacks, Concentration Curls)
- **Day 5**: Legs (Goblet Squats, DB RDLs, DB Lunges, DB Step Ups, DB Calf Raises)

**Progression**:
- Weeks 1-4: Foundation exercises
- Weeks 5-8: Progressive variations
- Weeks 9-12: Advanced variations
- Rest Period: 45-60 seconds

### Sets Progression (Both Programs)
- **Week 1**: 5 sets per exercise
- **Week 2**: 6 sets per exercise
- **Week 3**: 6 sets per exercise
- **Week 4**: 3 sets per exercise (DELOAD)
- Pattern repeats for weeks 5-8 and 9-12

---

## 🗂️ File Structure

```
jay-cutler-training-tracker/
├── index.html              # Main HTML with Vue app mount point
├── manifest.json           # PWA manifest
├── sw.js                   # Service worker for offline support
├── js/
│   ├── app.js             # Main Vue.js application (40KB)
│   └── program-data.js    # All 12 weeks of both programs (18KB)
└── README.md              # This file
```

---

## 🔧 Technical Stack

### Frontend Framework
- **Vue.js 3**: Reactive UI components
- **Tailwind CSS**: Utility-first styling via CDN
- **Font Awesome**: Icon library

### Core Technologies
- **Vanilla JavaScript**: Program logic and data structures
- **LocalStorage API**: Data persistence
- **Web Audio API**: Timer sound alerts
- **Vibration API**: Haptic feedback
- **Service Workers**: Offline functionality

### Mobile Optimizations
- Touch event handling
- CSS animations and transitions
- Responsive breakpoints
- Safe area insets for iOS
- Meta viewport configuration

---

## 🚀 Getting Started

### Installation
1. Clone or download this repository
2. Open `index.html` in a web browser
3. Or deploy to any static hosting service (GitHub Pages, Netlify, Vercel, etc.)

### First Use
1. Select your program (Bodyweight or Dumbbell)
2. App automatically sets start date to today (Oregon timezone)
3. View dashboard with today's workout
4. Tap "Start Workout" to begin training
5. **For Dumbbell mode**: Enter weights used for each set
6. Follow exercise-by-exercise with built-in timer

### Daily Workflow
1. Open app (works offline)
2. Check today's workout on dashboard
3. **View both programs' progress** (if you've started both) 🆕
4. **Switch programs** if needed (your progress is saved) 🆕
5. Start workout when ready
6. Complete each set with rest timer
7. **See previous weights** for each exercise (Dumbbell mode) 🆕
8. Finish workout to see summary
9. Mark cardio as complete if done
10. Track progress and streak

---

## 📊 Data Structure

### User Profile 🆕 UPDATED
```javascript
{
  activeProgramType: "bodyweight" | "dumbbell",  // Currently active program
  bodyWeight: number,
  bodyFatPercent: number,
  
  // Separate data for each program
  programs: {
    bodyweight: {
      startDate: "YYYY-MM-DD",
      currentWeek: 1-12,
      currentDay: 0-6,
      completedWorkouts: [
        {
          date: "YYYY-MM-DD",
          week: number,
          workout: string,
          workoutName: string,
          duration: number,
          exercises: [{name, sets: [{reps}]}],
          notes: string,
          timestamp: number
        }
      ],
      cardioLog: [{date: "YYYY-MM-DD", completed: boolean}],
      totalTimeTrainedMinutes: number
    },
    dumbbell: {
      startDate: "YYYY-MM-DD",
      currentWeek: 1-12,
      currentDay: 0-6,
      completedWorkouts: [
        {
          date: "YYYY-MM-DD",
          week: number,
          workout: string,
          workoutName: string,
          duration: number,
          exercises: [{name, sets: [{reps, weight}]}],  // ⬅️ Weight included
          notes: string,
          timestamp: number
        }
      ],
      cardioLog: [{date: "YYYY-MM-DD", completed: boolean}],
      totalTimeTrainedMinutes: number,
      exerciseWeights: {  // ⬅️ Stores last used weights per exercise
        "Exercise Name": [weight1, weight2, ...]
      }
    }
  }
}
```

### Program Data
- Stored in `js/program-data.js`
- Contains all 12 weeks for both programs
- Helper functions for dynamic workout generation
- Automatic set progression based on week cycle

---

## 🎨 UI Features

### Color Scheme
- **Primary**: Red/Orange (#DC2626) for Jay Cutler branding
- **Success**: Green for completed items
- **Warning**: Orange for streaks and alerts
- **Info**: Blue for rest days
- **Neutral**: Gray for inactive states

### Key Design Elements
- **Card-based layout**: Clean, modern information hierarchy
- **Bottom navigation**: Easy thumb-reach on mobile
- **Circular timer**: Visual countdown with SVG progress ring
- **Progress bars**: Visual representation of completion
- **Touch feedback**: Scale animation on button press
- **Status badges**: Checkmarks, indicators, and icons

### Dark Mode
- Full dark theme support
- Automatic system preference detection (optional enhancement)
- Manual toggle in settings
- Preserved in localStorage

---

## 🔄 Features Not Yet Implemented

### Potential Enhancements
❌ Exercise demo GIFs/videos library
❌ Workout history detailed log view
❌ Export progress report (PDF/CSV)
❌ Social sharing of completed workouts
❌ Motivational quotes from Jay Cutler
❌ Body weight and body fat tracking over time
❌ Charts and graphs for progress visualization
❌ Custom workout notes and exercises
❌ Rest day activities and stretching routines
❌ Nutrition tracking integration
❌ Water intake reminder
❌ Push notifications for workout reminders
❌ Multiple user profiles
❌ Cloud sync across devices

---

## 🛠️ Recommended Next Steps

### Phase 1: Enhanced Tracking
1. **Workout History View**
   - Detailed log of all completed workouts
   - Filter by week, month, or workout type
   - View individual workout details and notes

2. **Progress Charts**
   - Weekly workout completion graph
   - Streak history visualization
   - Time trained over weeks

3. **Body Metrics Tracking**
   - Weight and body fat % input
   - Progress photos
   - Measurements tracking

### Phase 2: Engagement Features
1. **Exercise Library**
   - Demo videos or GIFs for each exercise
   - Form tips and common mistakes
   - Alternative exercises

2. **Achievements System**
   - Badges for milestones (first week, 30 days, etc.)
   - Completion certificates
   - Streak achievements

3. **Social Features**
   - Share workout completion to social media
   - Progress report export
   - Leaderboards (if backend added)

### Phase 3: Advanced Functionality
1. **Custom Workouts**
   - Create custom exercises
   - Modify existing programs
   - Save favorite workouts

2. **Smart Notifications**
   - Workout reminders at set times
   - Rest day cardio reminders
   - Motivational push notifications

3. **Backend Integration** (requires server)
   - Cloud data sync
   - Multi-device support
   - Community features

---

## 🧪 Testing

### Browser Compatibility
✅ Chrome (Desktop & Mobile)
✅ Safari (iOS)
✅ Firefox (Desktop & Mobile)
✅ Edge (Desktop & Mobile)

### Device Testing
✅ iPhone (Safari) - 375px, 390px, 428px widths
✅ Android (Chrome) - Various screen sizes
✅ iPad (Safari) - Responsive scaling
✅ Desktop browsers - All sizes

### Functionality Testing
✅ Timer accuracy and audio alerts
✅ Offline functionality after first load
✅ Data persistence across sessions
✅ All workout progressions (weeks 1-12)
✅ Program switching and reset
✅ Dark mode toggle

---

## 📱 PWA Installation

### iOS (Safari)
1. Open the app in Safari
2. Tap the Share button
3. Scroll down and tap "Add to Home Screen"
4. Name it and tap "Add"
5. App icon appears on home screen

### Android (Chrome)
1. Open the app in Chrome
2. Tap the menu (three dots)
3. Tap "Add to Home screen"
4. Confirm the installation
5. App icon appears in app drawer

---

## 💾 Data Management

### LocalStorage Keys
- `jcUserProfile`: All user data and progress (both programs)
- `darkMode`: Dark mode preference

### Data Migration
The app automatically migrates data from the old single-program format to the new dual-program structure. If you were using the app before this update, your progress will be preserved in the appropriate program (bodyweight or dumbbell) when you first load the updated version.

---

## 🆕 What's New in v2.0

### January 2026 Update - Major Features Added

#### 1. **Dual Program Tracking** 
- **Switch between programs without losing progress!**
- Each program (Bodyweight and Dumbbell) maintains separate:
  - Start dates
  - Completed workouts
  - Cardio logs  
  - Time trained statistics
  - Current week/day position
- Dashboard now shows "All Programs" overview card displaying both programs' stats
- Active program is clearly marked with an "Active" badge
- Easy program switching via Settings → Switch Program

#### 2. **Weight Tracking (Dumbbell Mode)**
- **Record weights used for each set** during Dumbbell workouts
- New weight input field appears below reps input (Dumbbell mode only)
- **Previous weights display** - See the weights you used last time for each exercise
- Weights are stored per exercise and automatically displayed as reference
- Format: "Last: 20/20/20/20/20 lbs" (one weight per set)
- Helps with progressive overload tracking

#### 3. **Oregon Timezone Support**
- **Fixed date offset issue** - App now uses Pacific Time (PST/PDT)
- Accurate "today's workout" calculation for Oregon users
- All date functions now use `America/Los_Angeles` timezone
- Streak calculations and workout logging work correctly for West Coast users

#### 4. **Enhanced Dashboard**
- New "All Programs" card shows both programs side-by-side
- Each program displays:
  - Program name with icon
  - Current week (Week X of 12)
  - Workouts completed (X/48 or X/60)
  - Active badge for current program
  - Color-coded highlighting
- Original program progress card now shows active program name in header

#### 5. **Data Structure Improvements**
- Backward compatible - old data automatically migrates
- More scalable architecture supporting multiple programs
- Exercise weight history stored efficiently per exercise name
- No data loss when updating from previous version

### How to Use New Features

**To Track Weights (Dumbbell Mode):**
1. Start a Dumbbell workout
2. Complete reps as usual
3. Enter the weight you used in the "Weight Used (lbs)" field
4. Tap "Complete Set"
5. Next time you do this exercise, you'll see "Last: X/X/X lbs" above the weight input

**To Switch Programs:**
1. Go to Settings (gear icon)
2. Tap "Switch Program"
3. Confirm the switch
4. Your progress in both programs is preserved
5. Dashboard shows both programs' stats

**To View Both Programs' Progress:**
1. Start one program (e.g., Bodyweight)
2. Later, switch to the other program (e.g., Dumbbell)
3. Dashboard will show "All Programs" card with both
4. Each displays current week and workout count

---

### Data Backup
Users can backup their data by:
1. Opening browser developer tools
2. Going to Application → Local Storage
3. Copying the `jcUserProfile` value
4. Saving it as a JSON file

### Data Restore
To restore data:
1. Open developer tools
2. Set `jcUserProfile` in Local Storage
3. Refresh the page

---

## 🎯 Key Features Highlight

### 1. Smart Workout Flow
- Automatically loads today's workout
- Checks if already completed
- Prevents duplicate completion
- Seamless exercise-to-exercise transition

### 2. Intelligent Timer
- Auto-starts after set completion
- Different durations for each program
- Visual and audio feedback
- Flexible add time or skip options

### 3. Progress Tracking
- Real-time streak calculation
- Includes both workouts and cardio
- Accurate week/day calculation from start date
- Total time trained accumulation

### 4. Mobile-First Design
- Optimized for one-handed use
- Bottom navigation for easy reach
- Large tap targets (44px minimum)
- Smooth animations and transitions

---

## 🐛 Known Issues & Limitations

### Current Limitations
- No cloud sync (LocalStorage only)
- No exercise videos/GIFs included
- Timer sound is basic beep (no custom audio)
- No push notifications
- Single user per device
- Data lost if LocalStorage cleared

### Browser Limitations
- Timer audio may require user interaction on iOS
- Vibration not supported on iOS
- Service worker requires HTTPS in production
- LocalStorage has 5-10MB limit

---

## 🤝 Contributing

This is a static web app with no backend. To enhance:
1. Fork the repository
2. Add features to `js/app.js`
3. Update program data in `js/program-data.js`
4. Test on mobile devices
5. Submit pull request

---

## 📄 License

This project is open source and available for personal use.

---

## 👤 Author

Built as a comprehensive mobile fitness tracking solution for Jay Cutler's Home Training Programs.

---

## 🙏 Acknowledgments

- **Jay Cutler** for the training program design
- **Vue.js** for reactive framework
- **Tailwind CSS** for rapid styling
- **Font Awesome** for icons

---

## 📞 Support

For issues or questions:
1. Check the browser console for errors
2. Clear LocalStorage and try again
3. Test in different browsers
4. Ensure JavaScript is enabled
5. Try hard refresh (Ctrl+Shift+R)

---

**Ready to transform your body in 12 weeks? Open the app and start training! 💪**
