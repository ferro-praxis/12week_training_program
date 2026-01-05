// Jay Cutler 12-Week Home Training Programs Data Structure

const PROGRAMS = {
  bodyweight: {
    name: "Bodyweight Home Workout",
    description: "Zero equipment needed. 4 workouts per week.",
    workoutsPerWeek: 4,
    totalWeeks: 12,
    totalWorkouts: 48,
    restPeriod: 45, // seconds
    
    // Workout naming pattern: A, B, C, D
    workoutLabels: {
      A: "Push/Abs/Calves",
      B: "Legs",
      C: "Pull/Abs/Calves",
      D: "Legs"
    },
    
    // Weekly schedule (which workouts on which days)
    weeklySchedule: ["A", "B", "rest", "C", "D", "rest", "rest"],
    
    // Exercise database for all 12 weeks
    exercises: {
      // WEEKS 1-4
      weeks_1_4: {
        A: [
          { name: "Push Ups", reps: "10-12", tempo: "3-4 sec negatives", instructions: "Controlled descent" },
          { name: "Diamond Push Ups", reps: "10-12", tempo: "3-4 sec negatives", instructions: "Focus on triceps" },
          { name: "Pike Push Ups", reps: "10-12", tempo: "Standard", instructions: "Shoulders focus" },
          { name: "Crunches", reps: "15-20", tempo: "Standard", instructions: "To failure" },
          { name: "Calf Raises", reps: "15-20", tempo: "Pause at top", instructions: "Hold contraction" }
        ],
        B: [
          { name: "Squats", reps: "15-20", tempo: "Standard", instructions: "Full depth" },
          { name: "Lunges", reps: "15-20", tempo: "Standard", instructions: "Each leg" },
          { name: "Bulgarian Split Squats", reps: "10-12", tempo: "Standard", instructions: "Each leg" },
          { name: "Wall Sit", reps: "To failure", tempo: "Static hold", instructions: "Time under tension" }
        ],
        C: [
          { name: "Pull Ups", reps: "To failure", tempo: "Standard", instructions: "Full range of motion" },
          { name: "Chin Ups", reps: "To failure", tempo: "Standard", instructions: "Biceps focus" },
          { name: "Inverted Rows", reps: "10-12", tempo: "Standard", instructions: "Under table/bar" },
          { name: "Plank", reps: "To failure", tempo: "Static hold", instructions: "Core engagement" },
          { name: "Calf Raises", reps: "15-20", tempo: "Pause at top", instructions: "Hold contraction" }
        ],
        D: [
          { name: "Jump Squats", reps: "15-20", tempo: "Explosive", instructions: "Maximum height" },
          { name: "Walking Lunges", reps: "15-20", tempo: "Standard", instructions: "Each leg" },
          { name: "Single Leg Romanian Deadlifts", reps: "10-12", tempo: "Slow eccentric", instructions: "Each leg" },
          { name: "Glute Bridges", reps: "15-20", tempo: "Squeeze at top", instructions: "Hip thrust" }
        ]
      },
      
      // WEEKS 5-8
      weeks_5_8: {
        A: [
          { name: "Incline Push Ups", reps: "10-12", tempo: "3-4 sec negatives", instructions: "Hands elevated" },
          { name: "Wide Push Ups", reps: "10-12", tempo: "3-4 sec negatives", instructions: "Chest focus" },
          { name: "Handstand Hold", reps: "To failure", tempo: "Static hold", instructions: "Against wall" },
          { name: "Leg Raises", reps: "15-20", tempo: "Standard", instructions: "Lower abs" },
          { name: "Single Leg Calf Raises", reps: "15-20", tempo: "Pause at top", instructions: "Each leg" }
        ],
        B: [
          { name: "Pistol Squats", reps: "8-10", tempo: "Standard", instructions: "Each leg (assisted if needed)" },
          { name: "Bulgarian Split Squats", reps: "12-15", tempo: "Standard", instructions: "Each leg" },
          { name: "Sumo Squats", reps: "15-20", tempo: "Standard", instructions: "Wide stance" },
          { name: "Plank Leg Lifts", reps: "15-20", tempo: "Standard", instructions: "Alternating legs" }
        ],
        C: [
          { name: "Wide Grip Pull Ups", reps: "To failure", tempo: "Standard", instructions: "Lat focus" },
          { name: "Close Grip Chin Ups", reps: "To failure", tempo: "Standard", instructions: "Biceps focus" },
          { name: "Superman Pulls", reps: "15-20", tempo: "Squeeze at top", instructions: "Lower back" },
          { name: "Russian Twists", reps: "20-30", tempo: "Standard", instructions: "Obliques" },
          { name: "Jump Rope", reps: "100", tempo: "Standard", instructions: "Or high knees" }
        ],
        D: [
          { name: "Squat Pulses", reps: "20-30", tempo: "Constant tension", instructions: "Small range" },
          { name: "Reverse Lunges", reps: "15-20", tempo: "Standard", instructions: "Each leg" },
          { name: "Single Leg Glute Bridges", reps: "15-20", tempo: "Pause at top", instructions: "Each leg" },
          { name: "Hamstring Curls", reps: "15-20", tempo: "Slow eccentric", instructions: "Lying/sliding" }
        ]
      },
      
      // WEEKS 9-12
      weeks_9_12: {
        A: [
          { name: "Decline Push Ups", reps: "10-12", tempo: "3-4 sec negatives", instructions: "Feet elevated" },
          { name: "Archer Push Ups", reps: "8-10", tempo: "Standard", instructions: "Each side" },
          { name: "Pike Push Ups", reps: "12-15", tempo: "Standard", instructions: "Shoulders" },
          { name: "Hanging Knee Raises", reps: "15-20", tempo: "Standard", instructions: "Full range" },
          { name: "Calf Raises", reps: "20-25", tempo: "Pause at top", instructions: "Maximum reps" }
        ],
        B: [
          { name: "Pistol Squats", reps: "10-12", tempo: "Standard", instructions: "Each leg" },
          { name: "Jump Lunges", reps: "15-20", tempo: "Explosive", instructions: "Alternating" },
          { name: "Bulgarian Split Squats", reps: "15-20", tempo: "Standard", instructions: "Each leg" },
          { name: "Wall Sit", reps: "To failure", tempo: "Static hold", instructions: "Maximum time" }
        ],
        C: [
          { name: "Muscle Ups", reps: "To failure", tempo: "Standard", instructions: "Advanced (or pull ups)" },
          { name: "Typewriter Pull Ups", reps: "To failure", tempo: "Standard", instructions: "Side to side" },
          { name: "Inverted Rows", reps: "15-20", tempo: "Standard", instructions: "Feet elevated" },
          { name: "V-Ups", reps: "15-20", tempo: "Standard", instructions: "Full body" },
          { name: "Calf Raises", reps: "20-25", tempo: "Pause at top", instructions: "Maximum reps" }
        ],
        D: [
          { name: "Jump Squats", reps: "20-25", tempo: "Explosive", instructions: "Maximum effort" },
          { name: "Walking Lunges", reps: "20-25", tempo: "Standard", instructions: "Each leg" },
          { name: "Single Leg Deadlifts", reps: "12-15", tempo: "Slow eccentric", instructions: "Each leg" },
          { name: "Glute Bridge Pulses", reps: "25-30", tempo: "Constant tension", instructions: "Small range" }
        ]
      }
    },
    
    // Sets progression (Build weeks 1-3, Deload week 4)
    getSetsForWeek: function(week) {
      const weekInCycle = ((week - 1) % 4) + 1;
      if (weekInCycle === 1) return 5;
      if (weekInCycle === 2) return 6;
      if (weekInCycle === 3) return 6;
      if (weekInCycle === 4) return 3; // Deload
    },
    
    getExercisesForWeek: function(week, workout) {
      if (week <= 4) return this.exercises.weeks_1_4[workout];
      if (week <= 8) return this.exercises.weeks_5_8[workout];
      return this.exercises.weeks_9_12[workout];
    }
  },
  
  dumbbell: {
    name: "Dumbbell Only Home Workout",
    description: "Requires dumbbells. 5 workouts per week.",
    workoutsPerWeek: 5,
    totalWeeks: 12,
    totalWorkouts: 60,
    restPeriod: 60, // seconds (45-60)
    
    // Workout naming pattern: Days 1-5
    workoutLabels: {
      1: "Calves & Shoulders",
      2: "Chest",
      3: "Back & Abs",
      4: "Arms",
      5: "Legs"
    },
    
    // Weekly schedule
    weeklySchedule: ["1", "2", "3", "rest", "4", "5", "rest"],
    
    // Exercise database for all 12 weeks
    exercises: {
      // WEEKS 1-4
      weeks_1_4: {
        1: [ // Calves & Shoulders
          { name: "DB Calf Raises", reps: "15-20", tempo: "Pause at top", instructions: "Dumbbells in hands" },
          { name: "Standing DB Press", reps: "10-12", tempo: "Standard", instructions: "Overhead press" },
          { name: "DB Lateral Raises", reps: "10-12", tempo: "Controlled", instructions: "Side delts" },
          { name: "DB Front Raises", reps: "10-12", tempo: "Controlled", instructions: "Front delts" },
          { name: "DB Shrugs", reps: "15-20", tempo: "Squeeze at top", instructions: "Traps" }
        ],
        2: [ // Chest
          { name: "Floor DB Press", reps: "10-12", tempo: "Standard", instructions: "Lying on floor" },
          { name: "DB Flyes", reps: "10-12", tempo: "Stretch at bottom", instructions: "Flat or floor" },
          { name: "DB Pullovers", reps: "10-12", tempo: "Full stretch", instructions: "Cross bench" },
          { name: "Close Grip DB Press", reps: "10-12", tempo: "Standard", instructions: "Triceps focus" }
        ],
        3: [ // Back & Abs
          { name: "Bent Over DB Rows", reps: "10-12", tempo: "Squeeze at top", instructions: "Both arms" },
          { name: "Single Arm DB Rows", reps: "10-12", tempo: "Standard", instructions: "Each arm" },
          { name: "DB Deadlifts", reps: "15-20", tempo: "Controlled", instructions: "Hip hinge" },
          { name: "DB Pullovers", reps: "10-12", tempo: "Full stretch", instructions: "Back focus" },
          { name: "Weighted Crunches", reps: "15-20", tempo: "Standard", instructions: "DB on chest" }
        ],
        4: [ // Arms
          { name: "Alternating DB Curls", reps: "10-12", tempo: "Standard", instructions: "Each arm" },
          { name: "Hammer Curls", reps: "10-12", tempo: "Standard", instructions: "Neutral grip" },
          { name: "DB Overhead Extension", reps: "10-12", tempo: "Standard", instructions: "Triceps" },
          { name: "DB Kickbacks", reps: "10-12", tempo: "Squeeze at top", instructions: "Each arm" },
          { name: "Concentration Curls", reps: "10-12", tempo: "Controlled", instructions: "Each arm" }
        ],
        5: [ // Legs
          { name: "Goblet Squats", reps: "15-20", tempo: "Standard", instructions: "DB at chest" },
          { name: "DB Romanian Deadlifts", reps: "15-20", tempo: "Slow eccentric", instructions: "Hamstrings" },
          { name: "DB Lunges", reps: "15-20", tempo: "Standard", instructions: "Each leg" },
          { name: "DB Step Ups", reps: "15-20", tempo: "Standard", instructions: "Each leg" },
          { name: "DB Calf Raises", reps: "20-25", tempo: "Pause at top", instructions: "Single leg optional" }
        ]
      },
      
      // WEEKS 5-8 (Progressive variations)
      weeks_5_8: {
        1: [ // Calves & Shoulders
          { name: "Single Leg DB Calf Raises", reps: "15-20", tempo: "Pause at top", instructions: "Each leg" },
          { name: "Seated DB Press", reps: "10-12", tempo: "Standard", instructions: "On bench/chair" },
          { name: "DB Lateral Raises", reps: "12-15", tempo: "Controlled", instructions: "Side delts" },
          { name: "DB Arnold Press", reps: "10-12", tempo: "Standard", instructions: "Rotation" },
          { name: "DB Upright Rows", reps: "12-15", tempo: "Standard", instructions: "Shoulders/traps" }
        ],
        2: [ // Chest
          { name: "Incline DB Press", reps: "10-12", tempo: "Standard", instructions: "Upper chest" },
          { name: "Incline DB Flyes", reps: "10-12", tempo: "Stretch at bottom", instructions: "Upper chest" },
          { name: "DB Pullovers", reps: "12-15", tempo: "Full stretch", instructions: "Cross bench" },
          { name: "DB Push Up Position Rows", reps: "10-12", tempo: "Standard", instructions: "Each arm" }
        ],
        3: [ // Back & Abs
          { name: "Bent Over DB Rows", reps: "12-15", tempo: "Squeeze at top", instructions: "Both arms" },
          { name: "Single Arm DB Rows", reps: "12-15", tempo: "Standard", instructions: "Each arm" },
          { name: "DB Deadlifts", reps: "15-20", tempo: "Controlled", instructions: "Hip hinge" },
          { name: "DB Reverse Flyes", reps: "12-15", tempo: "Squeeze", instructions: "Rear delts" },
          { name: "Russian Twists", reps: "20-30", tempo: "Standard", instructions: "DB held" }
        ],
        4: [ // Arms
          { name: "DB Curls", reps: "10-12", tempo: "Standard", instructions: "Both arms" },
          { name: "Hammer Curls", reps: "12-15", tempo: "Standard", instructions: "Neutral grip" },
          { name: "Overhead DB Extension", reps: "12-15", tempo: "Standard", instructions: "Triceps" },
          { name: "DB Skull Crushers", reps: "10-12", tempo: "Controlled", instructions: "Lying" },
          { name: "Zottman Curls", reps: "10-12", tempo: "Rotation", instructions: "Each rep" }
        ],
        5: [ // Legs
          { name: "Goblet Squats", reps: "20-25", tempo: "Standard", instructions: "DB at chest" },
          { name: "DB Romanian Deadlifts", reps: "15-20", tempo: "Slow eccentric", instructions: "Hamstrings" },
          { name: "DB Bulgarian Split Squats", reps: "12-15", tempo: "Standard", instructions: "Each leg" },
          { name: "DB Step Ups", reps: "15-20", tempo: "Explosive", instructions: "Each leg" },
          { name: "DB Calf Raises", reps: "25-30", tempo: "Pause at top", instructions: "Maximum reps" }
        ]
      },
      
      // WEEKS 9-12 (Advanced variations)
      weeks_9_12: {
        1: [ // Calves & Shoulders
          { name: "Single Leg DB Calf Raises", reps: "20-25", tempo: "Pause at top", instructions: "Each leg" },
          { name: "DB Push Press", reps: "10-12", tempo: "Explosive", instructions: "Leg drive" },
          { name: "DB Lateral Raises", reps: "15-20", tempo: "Controlled", instructions: "Lighter weight" },
          { name: "DB Arnold Press", reps: "12-15", tempo: "Standard", instructions: "Rotation" },
          { name: "DB Shrugs", reps: "20-25", tempo: "Squeeze at top", instructions: "Heavy" }
        ],
        2: [ // Chest
          { name: "Floor DB Press", reps: "12-15", tempo: "Standard", instructions: "Heavy" },
          { name: "DB Flyes", reps: "12-15", tempo: "Stretch at bottom", instructions: "Deep stretch" },
          { name: "DB Pullovers", reps: "15-20", tempo: "Full stretch", instructions: "Cross bench" },
          { name: "Close Grip DB Press", reps: "12-15", tempo: "Standard", instructions: "Triceps" },
          { name: "DB Push Ups", reps: "To failure", tempo: "Standard", instructions: "Hands on DBs" }
        ],
        3: [ // Back & Abs
          { name: "Bent Over DB Rows", reps: "15-20", tempo: "Squeeze at top", instructions: "Heavy" },
          { name: "Single Arm DB Rows", reps: "15-20", tempo: "Standard", instructions: "Each arm" },
          { name: "DB Deadlifts", reps: "15-20", tempo: "Controlled", instructions: "Heavy" },
          { name: "DB Reverse Flyes", reps: "15-20", tempo: "Squeeze", instructions: "Rear delts" },
          { name: "Weighted V-Ups", reps: "15-20", tempo: "Standard", instructions: "DB held" }
        ],
        4: [ // Arms
          { name: "DB Curls", reps: "12-15", tempo: "Standard", instructions: "To failure" },
          { name: "Hammer Curls", reps: "12-15", tempo: "Standard", instructions: "Heavy" },
          { name: "Overhead DB Extension", reps: "15-20", tempo: "Standard", instructions: "To failure" },
          { name: "DB Kickbacks", reps: "15-20", tempo: "Squeeze at top", instructions: "Each arm" },
          { name: "21s", reps: "21", tempo: "Standard", instructions: "7 bottom, 7 top, 7 full" }
        ],
        5: [ // Legs
          { name: "Goblet Squats", reps: "25-30", tempo: "Standard", instructions: "Heavy DB" },
          { name: "DB Romanian Deadlifts", reps: "20-25", tempo: "Slow eccentric", instructions: "Heavy" },
          { name: "DB Bulgarian Split Squats", reps: "15-20", tempo: "Standard", instructions: "Each leg" },
          { name: "DB Walking Lunges", reps: "20-25", tempo: "Standard", instructions: "Each leg" },
          { name: "DB Calf Raises", reps: "30+", tempo: "Pause at top", instructions: "To failure" }
        ]
      }
    },
    
    // Sets progression (Build weeks 1-3, Deload week 4)
    getSetsForWeek: function(week) {
      const weekInCycle = ((week - 1) % 4) + 1;
      if (weekInCycle === 1) return 5;
      if (weekInCycle === 2) return 6;
      if (weekInCycle === 3) return 6;
      if (weekInCycle === 4) return 3; // Deload
    },
    
    getExercisesForWeek: function(week, workout) {
      if (week <= 4) return this.exercises.weeks_1_4[workout];
      if (week <= 8) return this.exercises.weeks_5_8[workout];
      return this.exercises.weeks_9_12[workout];
    }
  }
};

// Helper function to get workout for a specific day
function getWorkoutForDay(program, week, dayOfWeek) {
  const programData = PROGRAMS[program];
  const workoutKey = programData.weeklySchedule[dayOfWeek];
  
  if (workoutKey === "rest") {
    return {
      type: "rest",
      name: "Rest Day",
      cardioReminder: "Complete 30 minutes fasted cardio (optional)"
    };
  }
  
  const sets = programData.getSetsForWeek(week);
  const exercises = programData.getExercisesForWeek(week, workoutKey);
  
  return {
    type: "workout",
    key: workoutKey,
    name: programData.workoutLabels[workoutKey],
    sets: sets,
    exercises: exercises.map(ex => ({
      ...ex,
      sets: sets,
      restPeriod: programData.restPeriod
    })),
    isDeload: (((week - 1) % 4) + 1) === 4
  };
}

// Calculate which week and day based on start date
function calculateCurrentWeekAndDay(startDate) {
  const start = new Date(startDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  start.setHours(0, 0, 0, 0);
  
  const diffTime = today - start;
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  const week = Math.floor(diffDays / 7) + 1;
  const dayOfWeek = diffDays % 7;
  
  return {
    week: Math.min(week, 12),
    dayOfWeek: dayOfWeek,
    totalDays: diffDays + 1
  };
}
