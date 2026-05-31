// ── ALL APP DATA ──

const DATA = {

  homeWorkouts: [
    { day: 'Monday', label: 'Push Day', tag: 'Chest · Shoulders · Triceps', exercises: [
      { name: 'Push-ups', sets: '3 sets × 15 reps', tip: 'Full range, chest to floor' },
      { name: 'Wide push-ups', sets: '3 sets × 12 reps', tip: 'Elbows out for chest focus' },
      { name: 'Diamond push-ups', sets: '2 sets × 10 reps', tip: 'Hands close, tricep focus' },
      { name: 'Tricep dips (chair)', sets: '3 sets × 12 reps', tip: 'Keep back straight' },
      { name: 'Plank hold', sets: '3 × 30 seconds', tip: 'Core tight, don\'t sag' },
    ]},
    { day: 'Tuesday', label: 'Pull Day', tag: 'Back · Biceps', exercises: [
      { name: 'Inverted rows (table)', sets: '3 sets × 12 reps', tip: 'Pull chest to table edge' },
      { name: 'Superman holds', sets: '3 sets × 15 reps', tip: 'Squeeze glutes and back' },
      { name: 'Towel bicep curls', sets: '3 sets × 15 reps', tip: 'Use a heavy bag for resistance' },
      { name: 'Reverse snow angels', sets: '3 sets × 12 reps', tip: 'Lie face down, arms to Y shape' },
    ]},
    { day: 'Wednesday', label: 'Legs Day', tag: 'Quads · Hamstrings · Calves', exercises: [
      { name: 'Bodyweight squats', sets: '4 sets × 20 reps', tip: 'Knees track over toes' },
      { name: 'Lunges', sets: '3 sets × 12 each leg', tip: 'Step far enough forward' },
      { name: 'Calf raises', sets: '3 sets × 25 reps', tip: 'Slow on the way down' },
      { name: 'Glute bridges', sets: '3 sets × 20 reps', tip: 'Pause at top, squeeze' },
      { name: 'Jump squats', sets: '3 sets × 10 reps', tip: 'Land soft, bend knees' },
    ]},
    { day: 'Thursday', label: 'Core Day', tag: 'Abs · Lower back', exercises: [
      { name: 'Crunches', sets: '3 sets × 20 reps', tip: 'Exhale at top' },
      { name: 'Leg raises', sets: '3 sets × 15 reps', tip: 'Lower back stays flat' },
      { name: 'Russian twists', sets: '3 sets × 20 reps', tip: 'Feet off floor for extra work' },
      { name: 'Mountain climbers', sets: '3 × 30 seconds', tip: 'Fast pace, keep hips level' },
      { name: 'Plank hold', sets: '3 × 45 seconds', tip: 'Build to 60 sec by week 4' },
    ]},
    { day: 'Friday', label: 'Full Body', tag: 'Compound movements', exercises: [
      { name: 'Burpees', sets: '3 sets × 10 reps', tip: 'Full jump at top' },
      { name: 'Push-ups', sets: '3 sets × 15 reps', tip: 'Superset with squats' },
      { name: 'Bodyweight squats', sets: '3 sets × 20 reps', tip: 'Superset with push-ups' },
      { name: 'Inchworm walk-out', sets: '3 sets × 8 reps', tip: 'Keep legs straight' },
      { name: 'Jumping jacks', sets: '3 × 30 seconds', tip: 'Finish as cardio burn' },
    ]},
    { day: 'Saturday', label: 'Active Rest', tag: 'Light movement only', exercises: [
      { name: 'Brisk walk (15 min)', sets: '1 round', tip: 'After or instead of run' },
      { name: 'Full body stretch', sets: '10 minutes', tip: 'Hip flexors, chest, hamstrings' },
      { name: 'Foam rolling / massage', sets: '5–10 minutes', tip: 'Focus on sore spots' },
    ]},
    { day: 'Sunday', label: 'Rest Day', tag: 'Recovery & sleep', exercises: [
      { name: 'Complete rest', sets: 'All day', tip: 'Sleep 8+ hours tonight' },
      { name: 'Optional light walk', sets: '20 minutes', tip: 'Fresh air, no intensity' },
    ]},
  ],

  gymWorkouts: [
    { day: 'Monday', label: 'Chest + Triceps', tag: 'Heavy push day', exercises: [
      { name: 'Bench press (barbell)', sets: '4 sets × 10 reps', tip: 'Start light, add weight weekly' },
      { name: 'Incline dumbbell press', sets: '3 sets × 12 reps', tip: 'Upper chest focus' },
      { name: 'Cable chest flyes', sets: '3 sets × 15 reps', tip: 'Squeeze at centre' },
      { name: 'Tricep pushdown', sets: '3 sets × 12 reps', tip: 'Elbows fixed at sides' },
      { name: 'Overhead tricep extension', sets: '3 sets × 12 reps', tip: 'Full stretch at bottom' },
    ]},
    { day: 'Tuesday', label: 'Back + Biceps', tag: 'Heavy pull day', exercises: [
      { name: 'Deadlift', sets: '4 sets × 6 reps', tip: 'Most important lift for mass' },
      { name: 'Lat pulldown', sets: '4 sets × 10 reps', tip: 'Pull to upper chest' },
      { name: 'Seated cable row', sets: '3 sets × 12 reps', tip: 'Chest up, elbows back' },
      { name: 'Barbell curl', sets: '3 sets × 10 reps', tip: 'No swinging' },
      { name: 'Hammer curl', sets: '3 sets × 12 reps', tip: 'Builds brachialis thickness' },
    ]},
    { day: 'Wednesday', label: 'Legs', tag: 'Biggest muscle groups', exercises: [
      { name: 'Barbell back squat', sets: '4 sets × 8 reps', tip: 'King of all exercises' },
      { name: 'Leg press', sets: '3 sets × 12 reps', tip: 'Feet shoulder-width apart' },
      { name: 'Romanian deadlift', sets: '3 sets × 10 reps', tip: 'Feel hamstring stretch' },
      { name: 'Leg curl (machine)', sets: '3 sets × 15 reps', tip: 'Control the lowering' },
      { name: 'Calf raises (machine)', sets: '4 sets × 20 reps', tip: 'Full range of motion' },
    ]},
    { day: 'Thursday', label: 'Shoulders', tag: 'Deltoids · Traps', exercises: [
      { name: 'Overhead barbell press', sets: '4 sets × 8 reps', tip: 'Brace core, don\'t arch' },
      { name: 'Lateral raises (DB)', sets: '4 sets × 15 reps', tip: 'Slight lean forward' },
      { name: 'Front raises (DB)', sets: '3 sets × 12 reps', tip: 'Alternate arms to go heavier' },
      { name: 'Face pulls (cable)', sets: '3 sets × 15 reps', tip: 'Pulls to forehead height' },
      { name: 'Barbell shrugs', sets: '3 sets × 15 reps', tip: 'Pause at top 1 second' },
    ]},
    { day: 'Friday', label: 'Full Body Power', tag: 'Compound & functional', exercises: [
      { name: 'Barbell squat', sets: '3 sets × 5 reps', tip: 'Heavier than Wednesday' },
      { name: 'Weighted pull-ups', sets: '3 sets × max reps', tip: 'Add belt weight when 8+ reps easy' },
      { name: 'Weighted dips', sets: '3 sets × 10 reps', tip: 'Add weight from week 4' },
      { name: 'Farmer\'s carry', sets: '3 × 30 metres', tip: 'Heavy dumbbells, walk fast' },
    ]},
    { day: 'Saturday', label: 'Active Rest', tag: 'Light movement', exercises: [
      { name: 'Treadmill walk (incline 5)', sets: '15–20 minutes', tip: 'Active recovery, not cardio' },
      { name: 'Full body stretch', sets: '10 minutes', tip: 'Post-gym soreness recovery' },
      { name: 'Sauna / steam room', sets: '10 minutes', tip: 'Great for recovery if available' },
    ]},
    { day: 'Sunday', label: 'Rest Day', tag: 'Full recovery', exercises: [
      { name: 'Complete rest', sets: 'All day', tip: 'Sleep 8–9 hours tonight' },
      { name: 'Meal prep for the week', sets: '1 hour', tip: 'Cook chicken, boil eggs in advance' },
    ]},
  ],

  meals: {
    phase1: [
      { time: '6:00 AM', name: 'Pre-run fuel', items: '1 banana + 1 large glass of water', cal: 90, tag: 'Pre-workout' },
      { time: '7:15 AM', name: 'Post-run breakfast', items: '2 boiled eggs + 1 glass full-fat milk + 2 rotis + 1 tsp ghee', cal: 550, tag: 'Main' },
      { time: '1:00 PM', name: 'Lunch', items: '2 rotis + 1 cup daal (chana or moong) + 1 cup chawal + 1 cup sabzi', cal: 680, tag: 'Main' },
      { time: '4:00 PM', name: 'Afternoon snack', items: '2 boiled eggs OR 1 glass milk + 1 tbsp peanut butter', cal: 250, tag: 'Snack' },
      { time: '7:30 PM', name: 'Dinner', items: '2 rotis + 100g chicken karahi or beef + 1 cup daal + salad', cal: 700, tag: 'Main' },
      { time: '9:30 PM', name: 'Night snack', items: '1 glass full-fat doodh + 4–5 soaked badam', cal: 200, tag: 'Recovery' },
    ],
    phase2: [
      { time: '6:00 AM', name: 'Pre-run fuel', items: '1 banana + 1 glass water', cal: 90, tag: 'Pre-workout' },
      { time: '7:15 AM', name: 'Post-run breakfast', items: '3 boiled eggs + 1 glass full-fat milk + 2 rotis + 1 tsp ghee', cal: 680, tag: 'Main' },
      { time: '10:30 AM', name: 'Mid-morning', items: '1 glass milk + 1 tbsp peanut butter + 1 banana', cal: 350, tag: 'Snack' },
      { time: '1:00 PM', name: 'Lunch', items: '2 rotis + 150g chicken/beef + 1 cup rice + 1 cup sabzi + 1 cup daal', cal: 780, tag: 'Main' },
      { time: '4:30 PM', name: 'Pre-gym snack', items: '2 eggs + 1 roti OR banana + peanut butter sandwich', cal: 300, tag: 'Pre-workout' },
      { time: '8:00 PM', name: 'Post-gym dinner', items: '3 rotis + 150g chicken/beef + 1 cup daal + 1 cup chawal', cal: 850, tag: 'Main' },
      { time: '10:00 PM', name: 'Night recovery', items: '1 glass doodh + 4 soaked badam + 1 tsp shehad', cal: 230, tag: 'Recovery' },
    ],
  },

  schedule: {
    timeBlocks: [
      { time: '6:00', label: '1-hour run', sub: 'Easy pace · Build to 7km', type: 'run' },
      { time: '7:15', label: 'Breakfast', sub: 'Post-run meal · ~550 kcal', type: 'eat' },
      { time: '9:00', label: 'Work / Study', sub: 'Focus block', type: 'work' },
      { time: '1:00', label: 'Lunch break', sub: 'Eat + 10 min rest', type: 'eat' },
      { time: '1:30', label: 'Work / Study', sub: 'Afternoon focus', type: 'work' },
      { time: '3:00', label: 'Work ends', sub: 'Free time · Walk or nap', type: 'work' },
      { time: '4:00', label: 'Afternoon snack', sub: 'Eggs or milk + PB', type: 'eat' },
      { time: '5:00', label: 'Home workout', sub: '45–60 mins · Mon-Fri', type: 'workout' },
      { time: '7:30', label: 'Dinner', sub: 'Largest meal of day', type: 'eat' },
      { time: '9:30', label: 'Night snack', sub: 'Milk + almonds', type: 'eat' },
      { time: '10:30', label: 'Sleep', sub: 'Target 8 hours minimum', type: 'sleep' },
    ],
  },

  monthTargets: [
    { month: 'Jun 2026', target: 57.5, phase: 'Home workout start' },
    { month: 'Jul 2026', target: 59.0, phase: 'Home workouts' },
    { month: 'Aug 2026', target: 61.0, phase: 'Gym month 1' },
    { month: 'Sep 2026', target: 63.0, phase: 'Gym month 2' },
    { month: 'Oct 2026', target: 65.5, phase: 'Gym month 3' },
    { month: 'Nov 2026', target: 67.5, phase: 'Gym month 4' },
    { month: 'Dec 2026', target: 69.0, phase: 'Gym month 5' },
    { month: 'Jan 2027', target: 70.0, phase: 'Goal reached 🎯' },
  ],
};
