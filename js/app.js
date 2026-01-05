const { createApp } = Vue;

createApp({
  data() {
    return {
      // App state
      currentView: 'onboarding', // onboarding, dashboard, workout, schedule, settings
      darkMode: false,
      
      // User profile
      userProfile: {
        programType: null, // 'bodyweight' or 'dumbbell'
        bodyWeight: null,
        bodyFatPercent: null,
        startDate: null,
        currentWeek: 1,
        currentDay: 0,
        completedWorkouts: [], // Array of {date, week, workout, exercises: [{name, sets: [{reps}]}]}
        cardioLog: [], // Array of {date, completed}
        totalTimeTrainedMinutes: 0
      },
      
      // Workout session state
      activeWorkout: null,
      currentExerciseIndex: 0,
      currentSet: 1,
      completedSets: [],
      workoutStartTime: null,
      isResting: false,
      restTimeRemaining: 0,
      restTimerInterval: null,
      workoutNotes: '',
      
      // Timer audio
      timerAudio: null,
      
      // UI state
      showWorkoutSummary: false,
      workoutSummaryData: null
    };
  },
  
  computed: {
    programData() {
      return this.userProfile.programType ? PROGRAMS[this.userProfile.programType] : null;
    },
    
    todayWorkout() {
      if (!this.userProfile.startDate || !this.userProfile.programType) return null;
      
      const { week, dayOfWeek } = calculateCurrentWeekAndDay(this.userProfile.startDate);
      this.userProfile.currentWeek = week;
      this.userProfile.currentDay = dayOfWeek;
      
      return getWorkoutForDay(this.userProfile.programType, week, dayOfWeek);
    },
    
    currentExercise() {
      if (!this.activeWorkout || !this.activeWorkout.exercises) return null;
      return this.activeWorkout.exercises[this.currentExerciseIndex];
    },
    
    progressPercentage() {
      if (!this.programData) return 0;
      return Math.round((this.userProfile.completedWorkouts.length / this.programData.totalWorkouts) * 100);
    },
    
    workoutsThisWeek() {
      if (!this.userProfile.completedWorkouts.length) return 0;
      
      const today = new Date();
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - today.getDay());
      startOfWeek.setHours(0, 0, 0, 0);
      
      return this.userProfile.completedWorkouts.filter(w => {
        const workoutDate = new Date(w.date);
        return workoutDate >= startOfWeek;
      }).length;
    },
    
    streak() {
      if (!this.userProfile.completedWorkouts.length && !this.userProfile.cardioLog.length) return 0;
      
      const allActivities = [
        ...this.userProfile.completedWorkouts.map(w => w.date),
        ...this.userProfile.cardioLog.filter(c => c.completed).map(c => c.date)
      ].sort((a, b) => new Date(b) - new Date(a));
      
      let streak = 0;
      let checkDate = new Date();
      checkDate.setHours(0, 0, 0, 0);
      
      for (let activity of allActivities) {
        const activityDate = new Date(activity);
        activityDate.setHours(0, 0, 0, 0);
        
        const diffDays = Math.floor((checkDate - activityDate) / (1000 * 60 * 60 * 24));
        
        if (diffDays === 0 || diffDays === 1) {
          streak++;
          checkDate = activityDate;
        } else {
          break;
        }
      }
      
      return streak;
    },
    
    isWorkoutCompletedToday() {
      const today = new Date().toISOString().split('T')[0];
      return this.userProfile.completedWorkouts.some(w => w.date === today);
    },
    
    isCardioCompletedToday() {
      const today = new Date().toISOString().split('T')[0];
      return this.userProfile.cardioLog.some(c => c.date === today && c.completed);
    },
    
    weekSchedule() {
      if (!this.programData || !this.userProfile.startDate) return [];
      
      const schedule = [];
      const { week } = calculateCurrentWeekAndDay(this.userProfile.startDate);
      
      for (let dayOfWeek = 0; dayOfWeek < 7; dayOfWeek++) {
        const workout = getWorkoutForDay(this.userProfile.programType, week, dayOfWeek);
        const date = this.getDateForDayOfWeek(dayOfWeek);
        const isCompleted = this.userProfile.completedWorkouts.some(w => w.date === date);
        const isToday = dayOfWeek === this.userProfile.currentDay;
        
        schedule.push({
          dayOfWeek,
          dayName: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][dayOfWeek],
          date,
          workout,
          isCompleted,
          isToday
        });
      }
      
      return schedule;
    }
  },
  
  methods: {
    // Onboarding
    selectProgram(programType) {
      this.userProfile.programType = programType;
      this.userProfile.startDate = new Date().toISOString().split('T')[0];
      this.saveUserProfile();
      this.currentView = 'dashboard';
    },
    
    // Navigation
    navigateTo(view) {
      this.currentView = view;
    },
    
    // Workout controls
    startWorkout() {
      if (!this.todayWorkout || this.todayWorkout.type === 'rest') return;
      
      this.activeWorkout = JSON.parse(JSON.stringify(this.todayWorkout));
      this.currentExerciseIndex = 0;
      this.currentSet = 1;
      this.completedSets = [];
      this.workoutStartTime = Date.now();
      this.workoutNotes = '';
      this.currentView = 'workout';
    },
    
    completeSet(reps) {
      if (!this.currentExercise) return;
      
      const setData = {
        exerciseIndex: this.currentExerciseIndex,
        setNumber: this.currentSet,
        reps: reps || this.currentExercise.reps,
        timestamp: Date.now()
      };
      
      this.completedSets.push(setData);
      
      // Check if more sets remain for this exercise
      if (this.currentSet < this.currentExercise.sets) {
        this.currentSet++;
        this.startRestTimer();
      } else {
        // Move to next exercise
        if (this.currentExerciseIndex < this.activeWorkout.exercises.length - 1) {
          this.currentExerciseIndex++;
          this.currentSet = 1;
        } else {
          // Workout complete
          this.finishWorkout();
        }
      }
    },
    
    skipSet() {
      if (this.currentSet < this.currentExercise.sets) {
        this.currentSet++;
        this.startRestTimer();
      } else {
        if (this.currentExerciseIndex < this.activeWorkout.exercises.length - 1) {
          this.currentExerciseIndex++;
          this.currentSet = 1;
        }
      }
    },
    
    previousExercise() {
      if (this.currentExerciseIndex > 0) {
        this.currentExerciseIndex--;
        this.currentSet = 1;
        this.stopRestTimer();
      }
    },
    
    nextExercise() {
      if (this.currentExerciseIndex < this.activeWorkout.exercises.length - 1) {
        this.currentExerciseIndex++;
        this.currentSet = 1;
        this.stopRestTimer();
      }
    },
    
    startRestTimer() {
      this.stopRestTimer();
      this.isResting = true;
      this.restTimeRemaining = this.currentExercise.restPeriod;
      
      this.restTimerInterval = setInterval(() => {
        this.restTimeRemaining--;
        
        if (this.restTimeRemaining <= 0) {
          this.stopRestTimer();
          this.playTimerSound();
          this.vibrateDevice();
        }
      }, 1000);
    },
    
    stopRestTimer() {
      if (this.restTimerInterval) {
        clearInterval(this.restTimerInterval);
        this.restTimerInterval = null;
      }
      this.isResting = false;
      this.restTimeRemaining = 0;
    },
    
    addRestTime(seconds) {
      this.restTimeRemaining += seconds;
    },
    
    skipRest() {
      this.stopRestTimer();
    },
    
    finishWorkout() {
      const workoutDuration = Math.round((Date.now() - this.workoutStartTime) / 1000 / 60);
      
      const workoutRecord = {
        date: new Date().toISOString().split('T')[0],
        week: this.userProfile.currentWeek,
        workout: this.activeWorkout.key,
        workoutName: this.activeWorkout.name,
        duration: workoutDuration,
        exercises: this.activeWorkout.exercises.map((ex, idx) => ({
          name: ex.name,
          sets: this.completedSets
            .filter(s => s.exerciseIndex === idx)
            .map(s => ({ reps: s.reps }))
        })),
        notes: this.workoutNotes,
        timestamp: Date.now()
      };
      
      this.userProfile.completedWorkouts.push(workoutRecord);
      this.userProfile.totalTimeTrainedMinutes += workoutDuration;
      this.saveUserProfile();
      
      this.workoutSummaryData = {
        duration: workoutDuration,
        exercises: this.activeWorkout.exercises.length,
        sets: this.completedSets.length
      };
      
      this.showWorkoutSummary = true;
      this.stopRestTimer();
    },
    
    closeWorkoutSummary() {
      this.showWorkoutSummary = false;
      this.activeWorkout = null;
      this.currentView = 'dashboard';
    },
    
    cancelWorkout() {
      if (confirm('Are you sure you want to cancel this workout? Progress will not be saved.')) {
        this.stopRestTimer();
        this.activeWorkout = null;
        this.currentView = 'dashboard';
      }
    },
    
    // Cardio tracking
    toggleCardio() {
      const today = new Date().toISOString().split('T')[0];
      const existingIndex = this.userProfile.cardioLog.findIndex(c => c.date === today);
      
      if (existingIndex >= 0) {
        this.userProfile.cardioLog[existingIndex].completed = !this.userProfile.cardioLog[existingIndex].completed;
      } else {
        this.userProfile.cardioLog.push({ date: today, completed: true });
      }
      
      this.saveUserProfile();
    },
    
    // Audio & Haptics
    playTimerSound() {
      if (!this.timerAudio) {
        // Create a simple beep sound using Web Audio API
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = 800;
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.5);
      }
    },
    
    vibrateDevice() {
      if ('vibrate' in navigator) {
        navigator.vibrate([200, 100, 200]);
      }
    },
    
    // Settings
    toggleDarkMode() {
      this.darkMode = !this.darkMode;
      document.documentElement.classList.toggle('dark', this.darkMode);
      localStorage.setItem('darkMode', this.darkMode);
    },
    
    resetProgress() {
      if (confirm('Are you sure you want to reset all progress? This cannot be undone.')) {
        this.userProfile.completedWorkouts = [];
        this.userProfile.cardioLog = [];
        this.userProfile.totalTimeTrainedMinutes = 0;
        this.saveUserProfile();
        alert('Progress has been reset.');
      }
    },
    
    switchProgram() {
      if (confirm('Switching programs will reset your progress. Continue?')) {
        this.userProfile.programType = null;
        this.userProfile.completedWorkouts = [];
        this.userProfile.cardioLog = [];
        this.userProfile.totalTimeTrainedMinutes = 0;
        this.userProfile.startDate = null;
        this.saveUserProfile();
        this.currentView = 'onboarding';
      }
    },
    
    // Utility
    getDateForDayOfWeek(dayOfWeek) {
      const today = new Date();
      const currentDay = today.getDay();
      const diff = dayOfWeek - currentDay;
      const targetDate = new Date(today);
      targetDate.setDate(today.getDate() + diff);
      return targetDate.toISOString().split('T')[0];
    },
    
    formatTime(seconds) {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins}:${secs.toString().padStart(2, '0')}`;
    },
    
    formatDuration(minutes) {
      if (minutes < 60) return `${minutes}m`;
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      return `${hours}h ${mins}m`;
    },
    
    // Data persistence
    saveUserProfile() {
      localStorage.setItem('jcUserProfile', JSON.stringify(this.userProfile));
    },
    
    loadUserProfile() {
      const saved = localStorage.getItem('jcUserProfile');
      if (saved) {
        try {
          const loaded = JSON.parse(saved);
          this.userProfile = { ...this.userProfile, ...loaded };
          
          if (this.userProfile.programType && this.userProfile.startDate) {
            this.currentView = 'dashboard';
          }
        } catch (e) {
          console.error('Error loading profile:', e);
        }
      }
    }
  },
  
  mounted() {
    // Load saved data
    this.loadUserProfile();
    
    // Load dark mode preference
    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode === 'true') {
      this.darkMode = true;
      document.documentElement.classList.add('dark');
    }
    
    // Register service worker for PWA
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('sw.js').catch(err => {
        console.log('Service worker registration failed:', err);
      });
    }
  },
  
  beforeUnmount() {
    this.stopRestTimer();
  },
  
  template: `
    <div class="min-h-screen pb-20 bg-gray-50 dark:bg-gray-900">
      <!-- Onboarding Screen -->
      <div v-if="currentView === 'onboarding'" class="min-h-screen flex flex-col items-center justify-center p-6">
        <div class="w-full max-w-md">
          <div class="text-center mb-8">
            <h1 class="text-4xl font-black text-primary-600 dark:text-primary-500 mb-2">JAY CUTLER</h1>
            <p class="text-xl font-bold text-gray-800 dark:text-gray-200">12-Week Home Training</p>
            <p class="text-gray-600 dark:text-gray-400 mt-2">Select your program to begin</p>
          </div>
          
          <!-- Program Cards -->
          <div class="space-y-4">
            <!-- Bodyweight Program -->
            <div @click="selectProgram('bodyweight')" 
                 class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border-2 border-transparent hover:border-primary-500 cursor-pointer touch-feedback transition-all">
              <div class="flex items-start">
                <div class="bg-primary-100 dark:bg-primary-900 rounded-xl p-3 mr-4">
                  <i class="fas fa-running text-2xl text-primary-600 dark:text-primary-400"></i>
                </div>
                <div class="flex-1">
                  <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-1">Bodyweight Program</h3>
                  <p class="text-sm text-gray-600 dark:text-gray-400 mb-3">Zero equipment needed</p>
                  <div class="flex items-center space-x-4 text-sm text-gray-700 dark:text-gray-300">
                    <div class="flex items-center">
                      <i class="fas fa-calendar-alt mr-1 text-primary-600"></i>
                      <span>4 days/week</span>
                    </div>
                    <div class="flex items-center">
                      <i class="fas fa-dumbbell mr-1 text-primary-600"></i>
                      <span>48 workouts</span>
                    </div>
                  </div>
                </div>
                <i class="fas fa-chevron-right text-gray-400"></i>
              </div>
            </div>
            
            <!-- Dumbbell Program -->
            <div @click="selectProgram('dumbbell')" 
                 class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border-2 border-transparent hover:border-primary-500 cursor-pointer touch-feedback transition-all">
              <div class="flex items-start">
                <div class="bg-primary-100 dark:bg-primary-900 rounded-xl p-3 mr-4">
                  <i class="fas fa-dumbbell text-2xl text-primary-600 dark:text-primary-400"></i>
                </div>
                <div class="flex-1">
                  <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-1">Dumbbell Program</h3>
                  <p class="text-sm text-gray-600 dark:text-gray-400 mb-3">Requires dumbbells only</p>
                  <div class="flex items-center space-x-4 text-sm text-gray-700 dark:text-gray-300">
                    <div class="flex items-center">
                      <i class="fas fa-calendar-alt mr-1 text-primary-600"></i>
                      <span>5 days/week</span>
                    </div>
                    <div class="flex items-center">
                      <i class="fas fa-dumbbell mr-1 text-primary-600"></i>
                      <span>60 workouts</span>
                    </div>
                  </div>
                </div>
                <i class="fas fa-chevron-right text-gray-400"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Dashboard Screen -->
      <div v-if="currentView === 'dashboard'" class="p-4 space-y-4">
        <!-- Header -->
        <div class="flex items-center justify-between mb-6">
          <div>
            <h1 class="text-2xl font-black text-gray-900 dark:text-white">Dashboard</h1>
            <p class="text-sm text-gray-600 dark:text-gray-400">Week {{ userProfile.currentWeek }} of 12</p>
          </div>
          <button @click="navigateTo('settings')" class="w-10 h-10 flex items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700 touch-feedback">
            <i class="fas fa-cog text-gray-700 dark:text-gray-300"></i>
          </button>
        </div>
        
        <!-- Progress Overview Card -->
        <div class="bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl p-6 text-white shadow-lg">
          <h2 class="text-lg font-bold mb-4">Program Progress</h2>
          
          <div class="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p class="text-primary-100 text-sm">Completed</p>
              <p class="text-3xl font-black">{{ userProfile.completedWorkouts.length }}</p>
              <p class="text-primary-100 text-xs">of {{ programData.totalWorkouts }} workouts</p>
            </div>
            <div>
              <p class="text-primary-100 text-sm">This Week</p>
              <p class="text-3xl font-black">{{ workoutsThisWeek }}</p>
              <p class="text-primary-100 text-xs">of {{ programData.workoutsPerWeek }} workouts</p>
            </div>
          </div>
          
          <div class="w-full bg-primary-900 rounded-full h-3 mb-2">
            <div class="bg-white rounded-full h-3 transition-all duration-500" :style="{width: progressPercentage + '%'}"></div>
          </div>
          <p class="text-sm text-primary-100">{{ progressPercentage }}% Complete</p>
        </div>
        
        <!-- Quick Stats -->
        <div class="grid grid-cols-3 gap-3">
          <div class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow">
            <div class="flex items-center justify-center w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900 mx-auto mb-2">
              <i class="fas fa-fire text-orange-600 dark:text-orange-400"></i>
            </div>
            <p class="text-2xl font-bold text-center text-gray-900 dark:text-white">{{ streak }}</p>
            <p class="text-xs text-center text-gray-600 dark:text-gray-400">Day Streak</p>
          </div>
          
          <div class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow">
            <div class="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 mx-auto mb-2">
              <i class="fas fa-clock text-blue-600 dark:text-blue-400"></i>
            </div>
            <p class="text-2xl font-bold text-center text-gray-900 dark:text-white">{{ formatDuration(userProfile.totalTimeTrainedMinutes) }}</p>
            <p class="text-xs text-center text-gray-600 dark:text-gray-400">Trained</p>
          </div>
          
          <div class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow">
            <div class="flex items-center justify-center w-10 h-10 rounded-full bg-green-100 dark:bg-green-900 mx-auto mb-2">
              <i class="fas fa-chart-line text-green-600 dark:text-green-400"></i>
            </div>
            <p class="text-2xl font-bold text-center text-gray-900 dark:text-white">{{ ((userProfile.currentWeek - 1) % 4) + 1 === 4 ? 'Deload' : 'Build' }}</p>
            <p class="text-xs text-center text-gray-600 dark:text-gray-400">Week Type</p>
          </div>
        </div>
        
        <!-- Today's Schedule Card -->
        <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
          <h2 class="text-lg font-bold text-gray-900 dark:text-white mb-4">Today's Schedule</h2>
          
          <div v-if="todayWorkout">
            <div v-if="todayWorkout.type === 'workout'">
              <div class="flex items-center mb-3">
                <div class="bg-primary-100 dark:bg-primary-900 rounded-lg p-3 mr-3">
                  <i class="fas fa-dumbbell text-xl text-primary-600 dark:text-primary-400"></i>
                </div>
                <div class="flex-1">
                  <h3 class="font-bold text-gray-900 dark:text-white">Workout {{ todayWorkout.key }}</h3>
                  <p class="text-sm text-gray-600 dark:text-gray-400">{{ todayWorkout.name }}</p>
                </div>
                <span v-if="isWorkoutCompletedToday" class="text-green-600 dark:text-green-400">
                  <i class="fas fa-check-circle text-2xl"></i>
                </span>
              </div>
              
              <div class="mb-3 text-sm text-gray-700 dark:text-gray-300">
                <p><strong>{{ todayWorkout.exercises.length }}</strong> exercises × <strong>{{ todayWorkout.sets }}</strong> sets</p>
                <p v-if="todayWorkout.isDeload" class="text-primary-600 dark:text-primary-400 mt-1">
                  <i class="fas fa-info-circle mr-1"></i>Deload Week - Lower Volume
                </p>
              </div>
              
              <button v-if="!isWorkoutCompletedToday" 
                      @click="startWorkout" 
                      class="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-4 rounded-xl touch-feedback transition-all shadow-lg">
                <i class="fas fa-play mr-2"></i>Start Workout
              </button>
              
              <div v-else class="w-full bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 font-semibold py-4 rounded-xl text-center">
                <i class="fas fa-check-circle mr-2"></i>Workout Completed!
              </div>
            </div>
            
            <div v-else class="text-center py-6">
              <div class="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-3">
                <i class="fas fa-bed text-3xl text-blue-600 dark:text-blue-400"></i>
              </div>
              <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">Rest Day</h3>
              <p class="text-gray-600 dark:text-gray-400 mb-4">Recovery is just as important as training</p>
              
              <!-- Cardio Reminder -->
              <div class="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
                <div class="flex items-center justify-between">
                  <div class="flex-1 text-left">
                    <p class="font-semibold text-gray-900 dark:text-white">30-Min Fasted Cardio</p>
                    <p class="text-sm text-gray-600 dark:text-gray-400">Optional activity</p>
                  </div>
                  <button @click="toggleCardio" 
                          :class="isCardioCompletedToday ? 'bg-green-600' : 'bg-gray-300 dark:bg-gray-600'"
                          class="w-12 h-12 rounded-full touch-feedback transition-all">
                    <i class="fas fa-check text-white"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Cardio Tracker (on workout days too) -->
        <div v-if="todayWorkout && todayWorkout.type === 'workout'" class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
          <div class="flex items-center justify-between">
            <div class="flex-1">
              <h3 class="font-bold text-gray-900 dark:text-white">Daily Cardio</h3>
              <p class="text-sm text-gray-600 dark:text-gray-400">30 minutes fasted (optional)</p>
            </div>
            <button @click="toggleCardio" 
                    :class="isCardioCompletedToday ? 'bg-green-600' : 'bg-gray-300 dark:bg-gray-600'"
                    class="w-12 h-12 rounded-full touch-feedback transition-all">
              <i class="fas fa-check text-white"></i>
            </button>
          </div>
        </div>
      </div>
      
      <!-- Workout Screen -->
      <div v-if="currentView === 'workout' && activeWorkout && !showWorkoutSummary" class="min-h-screen bg-gray-900 text-white">
        <!-- Header -->
        <div class="bg-gray-800 px-4 py-4 flex items-center justify-between sticky top-0 z-10">
          <button @click="cancelWorkout" class="text-gray-400 hover:text-white">
            <i class="fas fa-times text-xl"></i>
          </button>
          <div class="text-center">
            <h2 class="font-bold">Workout {{ activeWorkout.key }}</h2>
            <p class="text-xs text-gray-400">Exercise {{ currentExerciseIndex + 1 }} of {{ activeWorkout.exercises.length }}</p>
          </div>
          <div class="w-6"></div>
        </div>
        
        <!-- Progress Bar -->
        <div class="w-full h-2 bg-gray-700">
          <div class="h-2 bg-primary-600 transition-all duration-300" 
               :style="{width: ((currentExerciseIndex / activeWorkout.exercises.length) * 100) + '%'}"></div>
        </div>
        
        <div v-if="currentExercise" class="p-6">
          <!-- Exercise Info -->
          <div class="text-center mb-8">
            <h1 class="text-3xl font-black mb-2">{{ currentExercise.name }}</h1>
            <div class="flex items-center justify-center space-x-4 text-gray-400">
              <span><i class="fas fa-redo mr-1"></i>{{ currentExercise.reps }} reps</span>
              <span><i class="fas fa-layer-group mr-1"></i>Set {{ currentSet }} of {{ currentExercise.sets }}</span>
            </div>
            <p v-if="currentExercise.instructions" class="text-sm text-primary-400 mt-2">
              <i class="fas fa-info-circle mr-1"></i>{{ currentExercise.instructions }}
            </p>
            <p v-if="currentExercise.tempo !== 'Standard'" class="text-sm text-yellow-400 mt-1">
              Tempo: {{ currentExercise.tempo }}
            </p>
          </div>
          
          <!-- Rest Timer -->
          <div v-if="isResting" class="mb-8">
            <div class="relative w-48 h-48 mx-auto">
              <svg class="transform -rotate-90 w-48 h-48">
                <circle cx="96" cy="96" r="88" stroke="currentColor" stroke-width="8" fill="transparent" class="text-gray-700"/>
                <circle cx="96" cy="96" r="88" stroke="currentColor" stroke-width="8" fill="transparent" 
                        class="text-primary-600 transition-all duration-1000"
                        :style="{'stroke-dasharray': 553, 'stroke-dashoffset': 553 - (553 * (restTimeRemaining / currentExercise.restPeriod))}"/>
              </svg>
              <div class="absolute inset-0 flex items-center justify-center flex-col">
                <p class="text-5xl font-black">{{ restTimeRemaining }}</p>
                <p class="text-sm text-gray-400">Rest Time</p>
              </div>
            </div>
            
            <div class="flex justify-center space-x-3 mt-6">
              <button @click="addRestTime(15)" class="bg-gray-700 hover:bg-gray-600 px-6 py-3 rounded-xl touch-feedback">
                <i class="fas fa-plus mr-2"></i>15s
              </button>
              <button @click="skipRest" class="bg-primary-600 hover:bg-primary-700 px-8 py-3 rounded-xl touch-feedback font-bold">
                <i class="fas fa-forward mr-2"></i>Skip Rest
              </button>
            </div>
          </div>
          
          <!-- Set Completion (when not resting) -->
          <div v-else class="space-y-4">
            <div class="bg-gray-800 rounded-2xl p-6">
              <label class="block text-sm text-gray-400 mb-2">Reps Completed</label>
              <input type="number" 
                     v-model.number="currentExercise.reps" 
                     class="w-full bg-gray-700 text-white text-4xl font-bold text-center py-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-600"
                     min="0">
            </div>
            
            <button @click="completeSet(currentExercise.reps)" 
                    class="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-6 rounded-xl touch-feedback text-xl shadow-lg">
              <i class="fas fa-check-circle mr-2"></i>Complete Set
            </button>
            
            <button @click="skipSet" 
                    class="w-full bg-gray-700 hover:bg-gray-600 text-white font-semibold py-4 rounded-xl touch-feedback">
              Skip Set
            </button>
          </div>
          
          <!-- Exercise Navigation -->
          <div class="flex justify-between mt-8">
            <button @click="previousExercise" 
                    :disabled="currentExerciseIndex === 0"
                    :class="currentExerciseIndex === 0 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-gray-700'"
                    class="px-6 py-3 bg-gray-800 rounded-xl touch-feedback">
              <i class="fas fa-chevron-left mr-2"></i>Previous
            </button>
            
            <button @click="nextExercise" 
                    :disabled="currentExerciseIndex === activeWorkout.exercises.length - 1"
                    :class="currentExerciseIndex === activeWorkout.exercises.length - 1 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-gray-700'"
                    class="px-6 py-3 bg-gray-800 rounded-xl touch-feedback">
              Next<i class="fas fa-chevron-right ml-2"></i>
            </button>
          </div>
          
          <!-- Completed Sets Indicator -->
          <div class="mt-8 text-center">
            <p class="text-sm text-gray-400 mb-2">Completed Sets for This Exercise</p>
            <div class="flex justify-center space-x-2">
              <div v-for="set in currentExercise.sets" :key="set" 
                   :class="set <= (completedSets.filter(s => s.exerciseIndex === currentExerciseIndex).length) ? 'bg-green-600' : 'bg-gray-700'"
                   class="w-3 h-3 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Workout Summary Modal -->
      <div v-if="showWorkoutSummary" class="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-6">
        <div class="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md w-full text-center">
          <div class="w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <i class="fas fa-trophy text-4xl text-green-600 dark:text-green-400"></i>
          </div>
          
          <h2 class="text-2xl font-black text-gray-900 dark:text-white mb-2">Workout Complete!</h2>
          <p class="text-gray-600 dark:text-gray-400 mb-6">Great job crushing it today!</p>
          
          <div class="grid grid-cols-3 gap-4 mb-6">
            <div class="bg-gray-50 dark:bg-gray-700 rounded-xl p-3">
              <p class="text-2xl font-bold text-primary-600 dark:text-primary-400">{{ workoutSummaryData.duration }}</p>
              <p class="text-xs text-gray-600 dark:text-gray-400">Minutes</p>
            </div>
            <div class="bg-gray-50 dark:bg-gray-700 rounded-xl p-3">
              <p class="text-2xl font-bold text-primary-600 dark:text-primary-400">{{ workoutSummaryData.exercises }}</p>
              <p class="text-xs text-gray-600 dark:text-gray-400">Exercises</p>
            </div>
            <div class="bg-gray-50 dark:bg-gray-700 rounded-xl p-3">
              <p class="text-2xl font-bold text-primary-600 dark:text-primary-400">{{ workoutSummaryData.sets }}</p>
              <p class="text-xs text-gray-600 dark:text-gray-400">Sets</p>
            </div>
          </div>
          
          <button @click="closeWorkoutSummary" 
                  class="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-4 rounded-xl touch-feedback">
            Back to Dashboard
          </button>
        </div>
      </div>
      
      <!-- Schedule Screen -->
      <div v-if="currentView === 'schedule'" class="p-4">
        <div class="flex items-center justify-between mb-6">
          <h1 class="text-2xl font-black text-gray-900 dark:text-white">Week {{ userProfile.currentWeek }}</h1>
          <button @click="navigateTo('dashboard')" class="text-primary-600 dark:text-primary-400 font-semibold">
            <i class="fas fa-times mr-1"></i>Close
          </button>
        </div>
        
        <div class="space-y-3">
          <div v-for="day in weekSchedule" :key="day.dayOfWeek" 
               :class="[
                 'bg-white dark:bg-gray-800 rounded-xl p-4 shadow',
                 day.isToday ? 'ring-2 ring-primary-600' : '',
                 day.isCompleted ? 'opacity-75' : ''
               ]">
            <div class="flex items-center">
              <div class="mr-4">
                <p class="text-xs text-gray-500 dark:text-gray-400">{{ day.dayName }}</p>
                <p class="text-sm font-bold text-gray-900 dark:text-white">{{ day.date.split('-')[2] }}</p>
              </div>
              
              <div class="flex-1">
                <div v-if="day.workout.type === 'workout'">
                  <h3 class="font-bold text-gray-900 dark:text-white">Workout {{ day.workout.key }}</h3>
                  <p class="text-sm text-gray-600 dark:text-gray-400">{{ day.workout.name }}</p>
                </div>
                <div v-else>
                  <h3 class="font-bold text-blue-600 dark:text-blue-400">Rest Day</h3>
                  <p class="text-sm text-gray-600 dark:text-gray-400">Recovery</p>
                </div>
              </div>
              
              <div>
                <i v-if="day.isCompleted" class="fas fa-check-circle text-2xl text-green-600 dark:text-green-400"></i>
                <i v-else-if="day.isToday" class="fas fa-circle text-primary-600 pulse"></i>
                <i v-else class="fas fa-circle text-gray-300 dark:text-gray-600"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Settings Screen -->
      <div v-if="currentView === 'settings'" class="p-4">
        <div class="flex items-center justify-between mb-6">
          <h1 class="text-2xl font-black text-gray-900 dark:text-white">Settings</h1>
          <button @click="navigateTo('dashboard')" class="text-primary-600 dark:text-primary-400 font-semibold">
            <i class="fas fa-times mr-1"></i>Close
          </button>
        </div>
        
        <div class="space-y-4">
          <!-- Program Info -->
          <div class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow">
            <h3 class="font-bold text-gray-900 dark:text-white mb-2">Current Program</h3>
            <p class="text-gray-600 dark:text-gray-400">{{ programData.name }}</p>
            <button @click="switchProgram" class="mt-3 text-primary-600 dark:text-primary-400 font-semibold text-sm">
              <i class="fas fa-sync-alt mr-1"></i>Switch Program
            </button>
          </div>
          
          <!-- Dark Mode Toggle -->
          <div class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow flex items-center justify-between">
            <div>
              <h3 class="font-bold text-gray-900 dark:text-white">Dark Mode</h3>
              <p class="text-sm text-gray-600 dark:text-gray-400">Toggle dark theme</p>
            </div>
            <button @click="toggleDarkMode" 
                    :class="darkMode ? 'bg-primary-600' : 'bg-gray-300 dark:bg-gray-600'"
                    class="relative w-14 h-8 rounded-full transition-colors">
              <div :class="darkMode ? 'translate-x-7' : 'translate-x-1'"
                   class="absolute top-1 w-6 h-6 bg-white rounded-full transition-transform"></div>
            </button>
          </div>
          
          <!-- Reset Progress -->
          <div class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow">
            <h3 class="font-bold text-gray-900 dark:text-white mb-2">Reset Progress</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400 mb-3">Clear all workout data and start fresh</p>
            <button @click="resetProgress" class="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg touch-feedback">
              <i class="fas fa-exclamation-triangle mr-2"></i>Reset All Data
            </button>
          </div>
          
          <!-- Stats -->
          <div class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow">
            <h3 class="font-bold text-gray-900 dark:text-white mb-3">Statistics</h3>
            <div class="space-y-2 text-sm">
              <div class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-400">Total Workouts:</span>
                <span class="font-semibold text-gray-900 dark:text-white">{{ userProfile.completedWorkouts.length }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-400">Total Time Trained:</span>
                <span class="font-semibold text-gray-900 dark:text-white">{{ formatDuration(userProfile.totalTimeTrainedMinutes) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-400">Current Streak:</span>
                <span class="font-semibold text-gray-900 dark:text-white">{{ streak }} days</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-400">Start Date:</span>
                <span class="font-semibold text-gray-900 dark:text-white">{{ userProfile.startDate }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Bottom Navigation -->
      <nav v-if="currentView !== 'onboarding' && currentView !== 'workout'" 
           class="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 bottom-nav">
        <div class="flex justify-around items-center h-16">
          <button @click="navigateTo('dashboard')" 
                  :class="currentView === 'dashboard' ? 'text-primary-600 dark:text-primary-400' : 'text-gray-400'"
                  class="flex flex-col items-center justify-center flex-1 h-full touch-feedback">
            <i class="fas fa-home text-xl mb-1"></i>
            <span class="text-xs font-medium">Home</span>
          </button>
          
          <button @click="navigateTo('schedule')" 
                  :class="currentView === 'schedule' ? 'text-primary-600 dark:text-primary-400' : 'text-gray-400'"
                  class="flex flex-col items-center justify-center flex-1 h-full touch-feedback">
            <i class="fas fa-calendar-alt text-xl mb-1"></i>
            <span class="text-xs font-medium">Schedule</span>
          </button>
          
          <button @click="startWorkout" 
                  v-if="todayWorkout && todayWorkout.type === 'workout' && !isWorkoutCompletedToday"
                  class="flex flex-col items-center justify-center flex-1 h-full touch-feedback text-primary-600 dark:text-primary-400">
            <i class="fas fa-play-circle text-2xl mb-1"></i>
            <span class="text-xs font-medium">Start</span>
          </button>
          
          <button @click="navigateTo('settings')" 
                  :class="currentView === 'settings' ? 'text-primary-600 dark:text-primary-400' : 'text-gray-400'"
                  class="flex flex-col items-center justify-center flex-1 h-full touch-feedback">
            <i class="fas fa-cog text-xl mb-1"></i>
            <span class="text-xs font-medium">Settings</span>
          </button>
        </div>
      </nav>
    </div>
  `
}).mount('#app');

