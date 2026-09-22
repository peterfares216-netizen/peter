/* =========================================================
   PETER FARES - PERSONAL PRODUCTIVITY DASHBOARD
   ========================================================= */

const STORAGE_KEY = "peterFaresData";

function createId() {
    if (window.crypto && typeof window.crypto.randomUUID === "function") {
        return window.crypto.randomUUID();
    }

    return "id-" +
        Date.now().toString(36) +
        "-" +
        Math.random().toString(36).slice(2);
}

function cloneDefaultData() {
    return JSON.parse(JSON.stringify(defaultData));
}

const defaultData = {

    xp: 0,

    level: 1,

    streak: 0,

    tasks: [],

    finance: {
        startingBalance: 0,
        transactions: []
    },

    fitness: {

        workoutOrder: [],

        workouts: {

            chestTriceps: {
                name: "Chest + Triceps",
                exercises: []
            },

            backBiceps: {
                name: "Back + Biceps",
                exercises: []
            },

            absShoulders: {
                name: "Abs + Shoulders",
                exercises: []
            },

            legs: {
                name: "Legs",
                exercises: []
            }
        }
    },

    faith: {
        prayers: []
    },

    notes: [],

    homeApps: [
        {
            id: "spotify",
            name: "Spotify",
            url: "https://open.spotify.com/",
            icon: "🎵"
        },

        {
            id: "youtube",
            name: "YouTube",
            url: "https://www.youtube.com/",
            icon: "▶️"
        },

        {
            id: "whatsapp",
            name: "WhatsApp",
            url: "https://web.whatsapp.com/",
            icon: "💬"
        },

        {
            id: "discord",
            name: "Discord",
            url: "https://discord.com/channels/@me",
            icon: "🎮"
        },

        {
            id: "netflix",
            name: "Netflix",
            url: "https://www.netflix.com/lb-en/",
            icon: "🎬"
        },

        {
            id: "instagram",
            name: "Instagram",
            url: "https://www.instagram.com/",
            icon: "📸"
        }
    ],

    dayActive: true,

    dayStartedAt:
        new Date().toISOString(),

    lastDayEndedAt: null
};


/* =========================================================
   DATA
   ========================================================= */

function loadData() {

    let saved =
        localStorage.getItem(
            STORAGE_KEY
        );

    if (!saved) {
        return cloneDefaultData();
    }

    try {

        const parsed =
            JSON.parse(saved);

        const merged = {

            ...cloneDefaultData(),

            ...parsed,

            finance: {

                ...cloneDefaultData().finance,

                ...(parsed.finance || {})
            },

            fitness: {

                ...cloneDefaultData().fitness,

                ...(parsed.fitness || {}),

                workouts: {

                    ...cloneDefaultData()
                        .fitness
                        .workouts,

                    ...(
                        (
                            parsed.fitness &&
                            parsed.fitness.workouts
                        ) || {}
                    )
                }
            },

            faith: {

                ...cloneDefaultData().faith,

                ...(parsed.faith || {})
            },

            notes:
                parsed.notes || [],

            tasks:
                parsed.tasks || [],

            homeApps:
                Array.isArray(parsed.homeApps)
                    ? parsed.homeApps
                    : cloneDefaultData().homeApps
        };

        return merged;

    } catch (error) {

        console.error(error);

        return cloneDefaultData();
    }
}


let data =
    loadData();


function saveData() {

    data.level =
        Math.floor(
            data.xp / 100
        ) + 1;

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(data)
    );

    updateGlobalStats();
}


/* =========================================================
   NAVIGATION
   ========================================================= */

const allNavButtons =
    document.querySelectorAll(
        ".nav-btn, .mobile-nav-btn, .home-section"
    );


allNavButtons.forEach(button => {

    button.addEventListener(
        "click",
        () => {

            const page =
                button.dataset.page;

            if (!page) return;

            showPage(page);
        }
    );

});


function showPage(pageName) {

    document
        .querySelectorAll(".page")
        .forEach(page => {

            page.classList.remove(
                "active-page"
            );

        });


    const target =
        document.getElementById(
            pageName
        );


    if (target) {

        target.classList.add(
            "active-page"
        );
    }


    document
        .querySelectorAll(
            ".nav-btn, .mobile-nav-btn"
        )
        .forEach(button => {

            button.classList.toggle(
                "active",
                button.dataset.page ===
                    pageName
            );

        });


    if (pageName === "fitness") {

        renderFitness();
    }


    if (pageName === "photos") {

        renderFolders();
    }


    if (pageName === "notes") {

        renderNotes();
    }


    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });

}


/* =========================================================
   LEBANON CLOCK
   ========================================================= */

function updateLebanonClock() {

    const now =
        new Date();


    const time =
        new Intl.DateTimeFormat(

            "en-US",

            {

                timeZone:
                    "Asia/Beirut",

                hour:
                    "2-digit",

                minute:
                    "2-digit",

                second:
                    "2-digit",

                hour12:
                    false
            }

        ).format(now);


    const date =
        new Intl.DateTimeFormat(

            "en-US",

            {

                timeZone:
                    "Asia/Beirut",

                weekday:
                    "long",

                year:
                    "numeric",

                month:
                    "long",

                day:
                    "numeric"
            }

        ).format(now);


    document.getElementById(
        "lebanonTime"
    ).textContent =
        time;


    document.getElementById(
        "lebanonDate"
    ).textContent =
        date;
}


setInterval(
    updateLebanonClock,
    1000
);


updateLebanonClock();


/* =========================================================
   GLOBAL STATS
   ========================================================= */

function calculateTaskCompletion() {

    if (
        data.tasks.length === 0
    ) {

        return 0;
    }


    const completed =
        data.tasks.filter(
            task =>
                task.completed
        ).length;


    return Math.round(

        completed /
        data.tasks.length *
        100

    );
}


function updateGlobalStats() {

    const completion =
        calculateTaskCompletion();


    document.getElementById(
        "homeXP"
    ).textContent =
        data.xp;


    document.getElementById(
        "homeLevel"
    ).textContent =
        data.level;


    document.getElementById(
        "homeStreak"
    ).textContent =
        data.streak;


    document.getElementById(
        "homeCompletion"
    ).textContent =
        completion + "%";


    document.getElementById(
        "mobileLevel"
    ).textContent =
        data.level;


    document.getElementById(
        "taskCompletion"
    ).textContent =
        completion + "%";


    document.getElementById(
        "completedTasks"
    ).textContent =

        `${data.tasks.filter(
            task =>
                task.completed
        ).length} / ${data.tasks.length}`;


    document.getElementById(
        "taskXP"
    ).textContent =

        data.tasks.filter(
            task =>
                !task.xpAwarded
        ).length * 10;


    document.getElementById(
        "taskProgress"
    ).style.width =
        completion + "%";
}


/* =========================================================
   TASKS
   ========================================================= */

const taskInput =
    document.getElementById(
        "taskInput"
    );


document.getElementById(
    "addTaskBtn"
).addEventListener(
    "click",
    addTask
);


taskInput.addEventListener(
    "keydown",
    event => {

        if (event.key === "Enter") {

            addTask();
        }

    }
);


function addTask() {

    const name =
        taskInput.value.trim();


    if (!name) return;


    data.tasks.push({

        id:
            createId(),

        name,

        completed:
            false,

        xpAwarded:
            false,

        createdAt:
            new Date().toISOString()

    });


    taskInput.value =
        "";


    saveData();


    renderTasks();
}


function renderTasks() {

    const list =
        document.getElementById(
            "taskList"
        );


    list.innerHTML =
        "";


    if (
        data.tasks.length === 0
    ) {

        list.innerHTML = `

            <div class="panel">

                <p class="muted">
                    No tasks yet. Add your first task.
                </p>

            </div>

        `;

        updateGlobalStats();

        return;
    }


    data.tasks.forEach(task => {

        const item =
            document.createElement(
                "div"
            );


        item.className =

            "task-item" +

            (
                task.completed
                    ? " completed"
                    : ""
            );


        item.innerHTML = `

            <input
                class="task-checkbox"
                type="checkbox"
                ${
                    task.completed
                        ? "checked"
                        : ""
                }
            >

            <span class="task-name">

                ${
                    escapeHTML(
                        task.name
                    )
                }

            </span>

            <span class="muted">

                +10 XP

            </span>

            <button class="delete-btn">

                ×

            </button>

        `;


        const checkbox =
            item.querySelector(
                ".task-checkbox"
            );


        checkbox.addEventListener(
            "change",
            () => {

                task.completed =
                    checkbox.checked;


                if (
                    task.completed &&
                    !task.xpAwarded
                ) {

                    data.xp += 10;

                    task.xpAwarded =
                        true;
                }


                saveData();


                renderTasks();

            }
        );


        item
            .querySelector(
                ".delete-btn"
            )
            .addEventListener(
                "click",
                () => {

                    data.tasks =
                        data.tasks.filter(
                            t =>
                                t.id !==
                                task.id
                        );


                    saveData();


                    renderTasks();

                }
            );


        list.appendChild(
            item
        );

    });


    updateGlobalStats();
}


/* =========================================================
   END DAY
   ========================================================= */

document.getElementById(
    "endDayBtn"
).addEventListener(
    "click",
    endProductivityDay
);


function endProductivityDay() {

    if (!data.dayActive) {

        alert(
            "Your productivity day has already ended."
        );

        return;
    }


    const allComplete =

        data.tasks.length > 0 &&

        data.tasks.every(
            task =>
                task.completed
        );


    if (allComplete) {

        data.streak += 1;


        alert(

            "Day completed! Your streak increased to " +

            data.streak +

            "."

        );

    } else {

        data.streak = 0;


        alert(

            "Day ended. Not every planned task was completed, so your streak reset to 0."

        );
    }


    data.tasks.forEach(
        task => {

            task.completed =
                false;

            task.xpAwarded =
                false;

        }
    );


    data.dayActive =
        true;


    data.dayStartedAt =
        new Date().toISOString();


    data.lastDayEndedAt =
        new Date().toISOString();


    saveData();


    renderTasks();
}


/* =========================================================
   FINANCE
   ========================================================= */

const transactionDate =
    document.getElementById(
        "transactionDate"
    );


transactionDate.value =
    getLocalDateString();


document.getElementById(
    "saveStartingBalance"
).addEventListener(
    "click",
    () => {

        const amount =
            parseFloat(

                document.getElementById(
                    "startingBalance"
                ).value

            );


        if (isNaN(amount))
            return;


        data.finance
            .startingBalance =
                amount;


        saveData();


        renderFinance();

    }
);


document.getElementById(
    "addTransactionBtn"
).addEventListener(
    "click",
    addTransaction
);


function addTransaction() {

    const amount =
        parseFloat(

            document.getElementById(
                "transactionAmount"
            ).value

        );


    const type =
        document.getElementById(
            "transactionType"
        ).value;


    const note =
        document.getElementById(
            "transactionNote"
        ).value.trim();


    const date =
        document.getElementById(
            "transactionDate"
        ).value;


    if (

        isNaN(amount) ||

        amount <= 0 ||

        !note

    ) {

        alert(
            "Please enter an amount and a note."
        );

        return;
    }


    data.finance.transactions.unshift({

        id:
            createId(),

        amount,

        type,

        note,

        date:
            date ||
            getLocalDateString()

    });


    document.getElementById(
        "transactionAmount"
    ).value =
        "";


    document.getElementById(
        "transactionNote"
    ).value =
        "";


    saveData();


    renderFinance();
}


function renderFinance() {

    const starting =
        Number(
            data.finance
                .startingBalance
        ) || 0;


    let earned = 0;

    let spent = 0;


    data.finance.transactions
        .forEach(
            transaction => {

                if (
                    transaction.type ===
                    "earned"
                ) {

                    earned +=
                        Number(
                            transaction.amount
                        );
                }


                if (
                    transaction.type ===
                    "spent"
                ) {

                    spent +=
                        Number(
                            transaction.amount
                        );
                }

            }
        );


    const balance =
        starting +
        earned -
        spent;


    document.getElementById(
        "financeBalance"
    ).textContent =
        formatMoney(balance);


    document.getElementById(
        "totalEarned"
    ).textContent =
        formatMoney(earned);


    document.getElementById(
        "totalSpent"
    ).textContent =
        formatMoney(spent);


    document.getElementById(
        "startingBalance"
    ).value =
        starting;


    const list =
        document.getElementById(
            "transactionList"
        );


    list.innerHTML =
        "";


    if (
        data.finance.transactions
            .length === 0
    ) {

        list.innerHTML =
            `<p class="muted">
                No transactions yet.
            </p>`;

        return;
    }


    data.finance.transactions
        .forEach(
            transaction => {

                const row =
                    document.createElement(
                        "div"
                    );


                row.className =
                    "transaction";


                const sign =

                    transaction.type ===
                    "earned"

                        ? "+"

                        : "-";


                row.innerHTML = `

                    <div>
                        ${
                            escapeHTML(
                                transaction.date
                            )
                        }
                    </div>

                    <div
                        class="transaction-type ${
                            transaction.type
                        }"
                    >
                        ${
                            transaction.type
                        }
                    </div>

                    <div>
                        ${
                            escapeHTML(
                                transaction.note
                            )
                        }
                    </div>

                    <div
                        class="transaction-amount ${
                            transaction.type
                        }"
                    >
                        ${
                            sign
                        }${
                            formatMoney(
                                transaction.amount
                            )
                        }
                    </div>

                    <button class="delete-btn">
                        ×
                    </button>

                `;


                row
                    .querySelector(
                        ".delete-btn"
                    )
                    .addEventListener(
                        "click",
                        () => {

                            data.finance
                                .transactions =

                                data.finance
                                    .transactions
                                    .filter(
                                        t =>
                                            t.id !==
                                            transaction.id
                                    );


                            saveData();


                            renderFinance();

                        }
                    );


                list.appendChild(
                    row
                );

            }
        );
}


/* =========================================================
   FITNESS
   ========================================================= */

let selectedWorkout =
    null;


let workoutTimer = {

    interval:
        null,

    mode:
        "exercise",

    seconds:
        0,

    exerciseIndex:
        null,

    running:
        false,

    initialSeconds:
        0
};


document
    .querySelectorAll(
        ".muscle-btn"
    )
    .forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    const id =
                        button.dataset
                            .workout;


                    if (
                        !data.fitness
                            .workoutOrder
                            .includes(id)
                    ) {

                        if (
                            data.fitness
                                .workoutOrder
                                .length >= 4
                        ) {

                            return;
                        }


                        data.fitness
                            .workoutOrder
                            .push(id);


                        saveData();
                    }


                    selectedWorkout =
                        id;


                    renderFitness();

                }
            );

        }
    );


function renderFitness() {

    document
        .querySelectorAll(
            ".muscle-btn"
        )
        .forEach(
            button => {

                const id =
                    button.dataset
                        .workout;


                const index =
                    data.fitness
                        .workoutOrder
                        .indexOf(id);


                const badge =
                    button.querySelector(
                        ".day-badge"
                    );


                if (index !== -1) {

                    badge.textContent =
                        index + 1;


                    button.classList.toggle(
                        "selected",
                        selectedWorkout ===
                            id
                    );

                } else {

                    badge.textContent =
                        "";

                    button.classList.remove(
                        "selected"
                    );
                }

            }
        );


    const editor =
        document.getElementById(
            "workoutEditor"
        );


    if (

        !selectedWorkout ||

        !data.fitness
            .workoutOrder
            .includes(
                selectedWorkout
            )

    ) {

        if (
            data.fitness
                .workoutOrder
                .length > 0
        ) {

            selectedWorkout =
                data.fitness
                    .workoutOrder[0];

        } else {

            editor.innerHTML =
                "";

            return;
        }
    }


    const workout =
        data.fitness
            .workouts[
                selectedWorkout
            ];


    if (!workout)
        return;


    const dayNumber =
        data.fitness
            .workoutOrder
            .indexOf(
                selectedWorkout
            ) + 1;


    const completed =
        workout.exercises.filter(
            exercise =>
                exercise.completed
        ).length;


    const total =
        workout.exercises.length;


    const percentage =

        total === 0

            ? 0

            : Math.round(
                completed /
                total *
                100
            );


    editor.innerHTML = `

        <div class="workout-card">

            <div class="workout-card-header">

                <div>

                    <p class="eyebrow">
                        DAY ${dayNumber}
                    </p>

                    <h2>
                        ${
                            escapeHTML(
                                workout.name
                            )
                        }
                    </h2>

                </div>

                <button
                    class="secondary-btn"
                    id="removeWorkoutBtn"
                >
                    REMOVE DAY
                </button>

            </div>

            <div class="workout-progress">

                ${completed}
                /
                ${total}
                exercises completed
                —
                ${percentage}%

            </div>

            <div class="progress-bar">

                <div
                    style="width:${percentage}%"
                ></div>

            </div>

            <br>

            <div class="exercise-form">

                <input
                    id="exerciseName"
                    placeholder="Exercise name"
                >

                <input
                    id="exerciseDuration"
                    type="number"
                    min="1"
                    value="10"
                    placeholder="Minutes"
                >

                <input
                    id="exerciseBreak"
                    type="number"
                    min="0"
                    value="1"
                    placeholder="Break"
                >

                <button
                    class="primary-btn"
                    id="addExerciseBtn"
                >
                    ADD EXERCISE
                </button>

            </div>

            <div
                id="exerciseList"
            ></div>

            <div class="workout-timer">

                <div
                    class="workout-timer-label"
                    id="workoutTimerLabel"
                >
                    EXERCISE
                </div>

                <div
                    class="workout-timer-time"
                    id="workoutTimerDisplay"
                >
                    00:00
                </div>

                <div
                    class="workout-timer-buttons"
                >

                    <button
                        class="primary-btn"
                        id="startWorkoutBtn"
                    >
                        START WORKOUT
                    </button>

                    <button
                        class="secondary-btn"
                        id="pauseWorkoutBtn"
                    >
                        PAUSE
                    </button>

                    <button
                        class="secondary-btn"
                        id="resetWorkoutBtn"
                    >
                        RESET
                    </button>

                </div>

                <p
                    class="timer-status"
                    id="workoutTimerStatus"
                >
                    Select an exercise to start its timer.
                </p>

            </div>

        </div>

    `;

    document.getElementById(
        "removeWorkoutBtn"
    ).addEventListener(
        "click",
        removeSelectedWorkout
    );

    document.getElementById(
        "addExerciseBtn"
    ).addEventListener(
        "click",
        addExercise
    );

    document.getElementById(
        "startWorkoutBtn"
    ).addEventListener(
        "click",
        startWorkout
    );

    document.getElementById(
        "pauseWorkoutBtn"
    ).addEventListener(
        "click",
        pauseWorkout
    );

    document.getElementById(
        "resetWorkoutBtn"
    ).addEventListener(
        "click",
        resetWorkoutTimer
    );

    renderExerciseList();

    updateWorkoutTimerDisplay();
}    renderExerciseList();

    updateWorkoutTimerDisplay();

function addExercise() {

    const name =
        document.getElementById(
            "exerciseName"
        ).value.trim();

    const duration =
        Number(
            document.getElementById(
                "exerciseDuration"
            ).value
        );

    const breakTime =
        Number(
            document.getElementById(
                "exerciseBreak"
            ).value
        );

    if (
        !name ||
        duration <= 0 ||
        breakTime < 0
    ) {

        alert("Enter valid exercise information.");

        return;
    }

    data.fitness.workouts[
        selectedWorkout
    ].exercises.push({

        id: createId(),

        name,

        duration,

        break: breakTime,

        completed: false
    });

    saveData();

    renderFitness();
}


function renderExerciseList() {

    const list =
        document.getElementById(
            "exerciseList"
        );

    if (!list) return;

    list.innerHTML = "";

    const exercises =
        data.fitness.workouts[
            selectedWorkout
        ].exercises;

    if (exercises.length === 0) {

        list.innerHTML =
            `<p class="muted">No exercises added yet.</p>`;

        return;
    }

    exercises.forEach(
        (exercise, index) => {

            const item =
                document.createElement("div");

            item.className =
                "exercise-item" +
                (exercise.completed
                    ? " completed"
                    : "");

            item.innerHTML = `

                <input
                    type="checkbox"
                    class="exercise-checkbox"
                    ${exercise.completed ? "checked" : ""}
                >

                <div class="exercise-info">

                    <strong>
                        ${escapeHTML(exercise.name)}
                    </strong>

                    <small>
                        ${exercise.duration} min exercise
                        · ${exercise.break} min break
                    </small>

                </div>

                <div class="exercise-actions">

                    <button
                        class="secondary-btn start-exercise-btn"
                    >
                        START TIMER
                    </button>

                    <button
                        class="delete-btn delete-exercise-btn"
                    >
                        ×
                    </button>

                </div>
            `;

            item.querySelector(
                ".exercise-checkbox"
            ).addEventListener(
                "change",
                event => {

                    exercise.completed =
                        event.target.checked;

                    if (
                        workoutTimer.exerciseIndex === index &&
                        workoutTimer.running
                    ) {

                        stopWorkoutTimer();
                    }

                    saveData();

                    renderFitness();
                }
            );

            item.querySelector(
                ".start-exercise-btn"
            ).addEventListener(
                "click",
                () => {

                    selectExerciseTimer(index);
                }
            );

            item.querySelector(
                ".delete-exercise-btn"
            ).addEventListener(
                "click",
                () => {

                    stopWorkoutTimer();

                    exercises.splice(index, 1);

                    saveData();

                    renderFitness();
                }
            );

            list.appendChild(item);
        }
    );
}


function selectExerciseTimer(index) {

    stopWorkoutTimer();

    const exercise =
        data.fitness.workouts[
            selectedWorkout
        ].exercises[index];

    if (!exercise) return;

    workoutTimer.mode = "exercise";
    workoutTimer.exerciseIndex = index;

    workoutTimer.seconds =
        exercise.duration * 60;

    workoutTimer.initialSeconds =
        workoutTimer.seconds;

    workoutTimer.running = false;

    updateWorkoutTimerDisplay();

    const status =
        document.getElementById(
            "workoutTimerStatus"
        );

    if (status) {

        status.textContent =
            "Ready to start " + exercise.name;
    }
}


function startWorkout() {

    if (!selectedWorkout) return;

    const exercises =
        data.fitness.workouts[
            selectedWorkout
        ].exercises;

    let index =
        workoutTimer.exerciseIndex;

    if (
        index === null ||
        !exercises[index] ||
        exercises[index].completed
    ) {

        index =
            exercises.findIndex(
                exercise => !exercise.completed
            );
    }

    if (index === -1) {

        alert("Workout complete!");

        return;
    }

    if (
        workoutTimer.seconds <= 0 ||
        workoutTimer.exerciseIndex !== index
    ) {

        selectExerciseTimer(index);
    }

    workoutTimer.running = true;

    startWorkoutInterval();

    const status =
        document.getElementById(
            "workoutTimerStatus"
        );

    if (status) {
        status.textContent = "Workout in progress.";
    }
}


function startWorkoutInterval() {

    clearInterval(
        workoutTimer.interval
    );

    workoutTimer.interval =
        setInterval(
            () => {

                if (
                    !workoutTimer.running
                ) {
                    return;
                }

                workoutTimer.seconds--;

                if (
                    workoutTimer.seconds <= 0
                ) {

                    workoutTimer.seconds = 0;

                    finishWorkoutPhase();

                }

                updateWorkoutTimerDisplay();

            },
            1000
        );
}


function finishWorkoutPhase() {

    const exercises =
        data.fitness.workouts[
            selectedWorkout
        ].exercises;

    const current =
        exercises[
            workoutTimer.exerciseIndex
        ];

    if (!current) {

        stopWorkoutTimer();

        return;
    }

    if (
        workoutTimer.mode === "exercise"
    ) {

        current.completed = true;

        saveData();

        if (current.break > 0) {

            workoutTimer.mode = "break";

            workoutTimer.seconds =
                current.break * 60;

            workoutTimer.initialSeconds =
                workoutTimer.seconds;

            workoutTimer.running = true;

            const label =
                document.getElementById(
                    "workoutTimerLabel"
                );

            if (label) {
                label.textContent = "BREAK";
            }

            const status =
                document.getElementById(
                    "workoutTimerStatus"
                );

            if (status) {

                status.textContent =
                    "Break started.";
            }

            startWorkoutInterval();

        } else {

            prepareNextExercise();
        }

    } else {

        prepareNextExercise();
    }

    renderFitness();
}


function prepareNextExercise() {

    const exercises =
        data.fitness.workouts[
            selectedWorkout
        ].exercises;

    const nextIndex =
        exercises.findIndex(
            exercise => !exercise.completed
        );

    stopWorkoutTimer();

    if (nextIndex === -1) {

        workoutTimer.exerciseIndex = null;

        const status =
            document.getElementById(
                "workoutTimerStatus"
            );

        if (status) {
            status.textContent =
                "Workout complete!";
        }

        return;
    }

    const next =
        exercises[nextIndex];

    workoutTimer.mode = "exercise";
    workoutTimer.exerciseIndex = nextIndex;

    workoutTimer.seconds =
        next.duration * 60;

    workoutTimer.initialSeconds =
        workoutTimer.seconds;

    workoutTimer.running = false;

    renderFitness();

    const status =
        document.getElementById(
            "workoutTimerStatus"
        );

    if (status) {

        status.textContent =
            "Next: " + next.name + ". Press START.";
    }
}


function pauseWorkout() {

    workoutTimer.running = false;

    const status =
        document.getElementById(
            "workoutTimerStatus"
        );

    if (status) {
        status.textContent = "Timer paused.";
    }
}


function resetWorkoutTimer() {

    stopWorkoutTimer();

    if (
        workoutTimer.exerciseIndex === null
    ) {

        updateWorkoutTimerDisplay();

        return;
    }

    const exercises =
        data.fitness.workouts[
            selectedWorkout
        ].exercises;

    const exercise =
        exercises[
            workoutTimer.exerciseIndex
        ];

    if (!exercise) return;

    if (
        workoutTimer.mode === "break"
    ) {

        workoutTimer.seconds =
            exercise.break * 60;

    } else {

        workoutTimer.seconds =
            exercise.duration * 60;
    }

    workoutTimer.initialSeconds =
        workoutTimer.seconds;

    updateWorkoutTimerDisplay();
}


function stopWorkoutTimer() {

    clearInterval(
        workoutTimer.interval
    );

    workoutTimer.interval = null;

    workoutTimer.running = false;
}


function updateWorkoutTimerDisplay() {

    const display =
        document.getElementById(
            "workoutTimerDisplay"
        );

    const label =
        document.getElementById(
            "workoutTimerLabel"
        );

    if (!display) return;

    display.textContent =
        formatTime(
            workoutTimer.seconds
        );

    if (label) {

        label.textContent =
            workoutTimer.mode === "break"
                ? "BREAK"
                : "EXERCISE";
    }
}


function removeSelectedWorkout() {

    if (!selectedWorkout) return;

    stopWorkoutTimer();

    data.fitness.workoutOrder =
        data.fitness.workoutOrder.filter(
            id => id !== selectedWorkout
        );

    selectedWorkout = null;

    saveData();

    renderFitness();
}


/* =========================================================
   FAITH READING TIMER
   ========================================================= */

let readingTimer = {

    interval: null,

    seconds: 900,

    running: false
};


document.getElementById(
    "readingStart"
).addEventListener(
    "click",
    startReading
);

document.getElementById(
    "readingPause"
).addEventListener(
    "click",
    pauseReading
);

document.getElementById(
    "readingReset"
).addEventListener(
    "click",
    resetReading
);


function startReading() {

    if (readingTimer.running) return;

    readingTimer.running = true;

    clearInterval(
        readingTimer.interval
    );

    readingTimer.interval =
        setInterval(
            () => {

                readingTimer.seconds--;

                if (
                    readingTimer.seconds <= 0
                ) {

                    readingTimer.seconds = 0;

                    pauseReading();

                    document.getElementById(
                        "readingStatus"
                    ).textContent =
                        "Reading session complete.";

                    alert(
                        "15-minute reading session complete."
                    );
                }

                updateReadingDisplay();

            },
            1000
        );

    document.getElementById(
        "readingStatus"
    ).textContent =
        "Reading in progress.";
}


function pauseReading() {

    readingTimer.running = false;

    clearInterval(
        readingTimer.interval
    );

    readingTimer.interval = null;

    document.getElementById(
        "readingStatus"
    ).textContent =
        "Reading timer paused.";
}


function resetReading() {

    pauseReading();

    readingTimer.seconds = 900;

    updateReadingDisplay();

    document.getElementById(
        "readingStatus"
    ).textContent =
        "15-minute reading session.";
}


function updateReadingDisplay() {

    document.getElementById(
        "readingTimer"
    ).textContent =
        formatTime(
            readingTimer.seconds
        );
}


/* =========================================================
   PRAYERS
   ========================================================= */

document.getElementById(
    "savePrayer"
).addEventListener(
    "click",
    savePrayer
);


function savePrayer() {

    const input =
        document.getElementById(
            "prayerInput"
        );

    const text =
        input.value.trim();

    if (!text) return;

    data.faith.prayers.unshift({

        id: createId(),

        text,

        date: new Date().toISOString()
    });

    input.value = "";

    saveData();

    renderPrayers();
}


function renderPrayers() {

    const list =
        document.getElementById(
            "prayerList"
        );

    list.innerHTML = "";

    if (data.faith.prayers.length === 0) {

        list.innerHTML =
            `<p class="muted">No saved prayers yet.</p>`;

        return;
    }

    data.faith.prayers.forEach(
        prayer => {

            const card =
                document.createElement("div");

            card.className =
                "prayer-card";

            card.innerHTML = `

                <div class="prayer-date">
                    ${formatDate(prayer.date)}
                </div>

                <div class="prayer-text">
                    ${escapeHTML(prayer.text)}
                </div>

                <br>

                <button class="delete-btn">
                    DELETE
                </button>
            `;

            card.querySelector(
                ".delete-btn"
            ).addEventListener(
                "click",
                () => {

                    data.faith.prayers =
                        data.faith.prayers.filter(
                            p => p.id !== prayer.id
                        );

                    saveData();

                    renderPrayers();
                }
            );

            list.appendChild(card);
        }
    );
}


/* =========================================================
   FOCUS TIMER
   ========================================================= */

let focusTimer = {

    interval: null,

    mode: "focus",

    seconds: 1800,

    running: false,

    focusSeconds: 1800,

    breakSeconds: 600
};


document.querySelectorAll(
    'input[name="focusDuration"]'
).forEach(input => {

    input.addEventListener(
        "change",
        setupFocusTimer
    );
});


document.querySelectorAll(
    'input[name="breakDuration"]'
).forEach(input => {

    input.addEventListener(
        "change",
        setupFocusTimer
    );
});


document.getElementById(
    "focusStart"
).addEventListener(
    "click",
    startFocus
);

document.getElementById(
    "focusPause"
).addEventListener(
    "click",
    pauseFocus
);

document.getElementById(
    "focusReset"
).addEventListener(
    "click",
    resetFocus
);


function getFocusSettings() {

    const focus =
        Number(
            document.querySelector(
                'input[name="focusDuration"]:checked'
            ).value
        );

    const breakTime =
        Number(
            document.querySelector(
                'input[name="breakDuration"]:checked'
            ).value
        );

    return {
        focus: focus * 60,
        break: breakTime * 60
    };
}


function setupFocusTimer() {

    if (focusTimer.running) return;

    const settings =
        getFocusSettings();

    focusTimer.focusSeconds =
        settings.focus;

    focusTimer.breakSeconds =
        settings.break;

    focusTimer.mode = "focus";

    focusTimer.seconds =
        settings.focus;

    updateFocusDisplay();
}


function startFocus() {

    if (focusTimer.running) return;

    focusTimer.running = true;

    clearInterval(
        focusTimer.interval
    );

    focusTimer.interval =
        setInterval(
            () => {

                focusTimer.seconds--;

                if (
                    focusTimer.seconds <= 0
                ) {

                    focusTimer.seconds = 0;

                    finishFocusPhase();
                }

                updateFocusDisplay();

            },
            1000
        );

    updateFocusStatus();
}


function finishFocusPhase() {

    if (
        focusTimer.mode === "focus"
    ) {

        focusTimer.mode = "break";

        focusTimer.seconds =
            focusTimer.breakSeconds;

        document.getElementById(
            "focusStatus"
        ).textContent =
            "Focus complete. Break started.";

        if (
            focusTimer.seconds <= 0
        ) {

            finishFocusPhase();

        }

    } else {

        pauseFocus();

        document.getElementById(
            "focusStatus"
        ).textContent =
            "Focus session complete.";

        alert(
            "Focus session complete."
        );
    }
}


function updateFocusStatus() {

    document.getElementById(
        "focusModeLabel"
    ).textContent =
        focusTimer.mode === "focus"
            ? "FOCUS"
            : "BREAK";

    document.getElementById(
        "focusStatus"
    ).textContent =
        focusTimer.mode === "focus"
            ? "Focus session in progress."
            : "Break in progress.";
}


function pauseFocus() {

    focusTimer.running = false;

    clearInterval(
        focusTimer.interval
    );

    focusTimer.interval = null;

    document.getElementById(
        "focusStatus"
    ).textContent =
        "Timer paused.";
}


function resetFocus() {

    pauseFocus();

    setupFocusTimer();

    document.getElementById(
        "focusStatus"
    ).textContent =
        "Ready to focus.";
}


function updateFocusDisplay() {

    document.getElementById(
        "focusTimer"
    ).textContent =
        formatTime(
            focusTimer.seconds
        );

    document.getElementById(
        "focusModeLabel"
    ).textContent =
        focusTimer.mode === "focus"
            ? "FOCUS"
            : "BREAK";
}


/* =========================================================
   PHOTOS - INDEXEDDB
   ========================================================= */

const DB_NAME = "PeterFaresPhotosDB";
const DB_VERSION = 1;

let photoDB = null;
let currentFolderId = null;


function openPhotoDB() {

    return new Promise(
        (resolve, reject) => {

            const request =
                indexedDB.open(
                    DB_NAME,
                    DB_VERSION
                );

            request.onupgradeneeded =
                event => {

                    const db =
                        event.target.result;

                    if (
                        !db.objectStoreNames.contains(
                            "folders"
                        )
                    ) {

                        db.createObjectStore(
                            "folders",
                            {
                                keyPath: "id"
                            }
                        );
                    }

                    if (
                        !db.objectStoreNames.contains(
                            "photos"
                        )
                    ) {

                        const store =
                            db.createObjectStore(
                                "photos",
                                {
                                    keyPath: "id"
                                }
                            );

                        store.createIndex(
                            "folderId",
                            "folderId",
                            {
                                unique: false
                            }
                        );
                    }
                };

            request.onsuccess =
                event => {

                    photoDB =
                        event.target.result;

                    resolve(photoDB);
                };

            request.onerror =
                () => reject(
                    request.error
                );
        }
    );
}


function dbPut(storeName, object) {

    return new Promise(
        (resolve, reject) => {

            const transaction =
                photoDB.transaction(
                    storeName,
                    "readwrite"
                );

            transaction.objectStore(
                storeName
            ).put(object);

            transaction.oncomplete =
                () => resolve();

            transaction.onerror =
                () => reject(
                    transaction.error
                );
        }
    );
}


function dbGetAll(storeName) {

    return new Promise(
        (resolve, reject) => {

            const transaction =
                photoDB.transaction(
                    storeName,
                    "readonly"
                );

            const request =
                transaction.objectStore(
                    storeName
                ).getAll();

            request.onsuccess =
                () => resolve(request.result);

            request.onerror =
                () => reject(
                    request.error
                );
        }
    );
}


function dbDelete(storeName, id) {

    return new Promise(
        (resolve, reject) => {

            const transaction =
                photoDB.transaction(
                    storeName,
                    "readwrite"
                );

            transaction.objectStore(
                storeName
            ).delete(id);

            transaction.oncomplete =
                () => resolve();

            transaction.onerror =
                () => reject(
                    transaction.error
                );
        }
    );
}


document.getElementById(
    "createFolderBtn"
).addEventListener(
    "click",
    createFolder
);


async function createFolder() {

    const input =
        document.getElementById(
            "folderName"
        );

    const name =
        input.value.trim();

    if (!name) return;

    const folder = {

        id: createId(),

        name,

        coverPhotoId: null,

        createdAt: new Date().toISOString()
    };

    await dbPut(
        "folders",
        folder
    );

    input.value = "";

    renderFolders();
}


async function renderFolders() {

    if (!photoDB) return;

    const folders =
        await dbGetAll("folders");

    const grid =
        document.getElementById(
            "folderGrid"
        );

    grid.innerHTML = "";

    if (folders.length === 0) {

        grid.innerHTML = `
            <div class="panel">
                <p class="muted">
                    No folders yet. Create your first folder.
                </p>
            </div>
        `;

        return;
    }

    for (const folder of folders) {

        const card =
            document.createElement("div");

        card.className =
            "folder-card";

        let coverURL = null;

        if (folder.coverPhotoId) {

            const photos =
                await dbGetAll("photos");

            const cover =
                photos.find(
                    photo =>
                        photo.id === folder.coverPhotoId
                );

            if (cover) {

                coverURL =
                    URL.createObjectURL(
                        cover.blob
                    );
            }
        }

        card.innerHTML = `

            <div class="folder-cover">

                ${
                    coverURL
                        ? `<img src="${coverURL}">`
                        : `<span>NO PHOTO</span>`
                }

            </div>

            <div class="folder-info">

                <strong>
                    ${escapeHTML(folder.name)}
                </strong>

                <span>
                    Loading photos...
                </span>

                <br><br>

                <button class="delete-btn delete-folder">
                    DELETE FOLDER
                </button>

            </div>
        `;

        const photos =
            await dbGetAll("photos");

        const count =
            photos.filter(
                photo =>
                    photo.folderId === folder.id
            ).length;

        card.querySelector(
            ".folder-info span"
        ).textContent =
            `${count} photo${count === 1 ? "" : "s"}`;

        card.addEventListener(
            "click",
            event => {

                if (
                    event.target.closest(
                        ".delete-folder"
                    )
                ) return;

                openFolder(folder.id);
            }
        );

        card.querySelector(
            ".delete-folder"
        ).addEventListener(
            "click",
            async () => {

                if (
                    !confirm(
                        "Delete this folder and all its photos?"
                    )
                ) return;

                const allPhotos =
                    await dbGetAll("photos");

                for (
                    const photo of allPhotos
                ) {

                    if (
                        photo.folderId === folder.id
                    ) {

                        await dbDelete(
                            "photos",
                            photo.id
                        );
                    }
                }

                await dbDelete(
                    "folders",
                    folder.id
                );

                renderFolders();
            }
        );

        grid.appendChild(card);
    }
}


async function openFolder(folderId) {

    currentFolderId = folderId;

    const folders =
        await dbGetAll("folders");

    const folder =
        folders.find(
            f => f.id === folderId
        );

    if (!folder) return;

    document.getElementById(
        "folderView"
    ).classList.add("hidden");

    document.getElementById(
        "photoFolderView"
    ).classList.remove("hidden");

    document.getElementById(
        "currentFolderName"
    ).textContent =
        folder.name;

    renderPhotos();
}


document.getElementById(
    "backToFolders"
).addEventListener(
    "click",
    () => {

        currentFolderId = null;

        document.getElementById(
            "photoFolderView"
        ).classList.add("hidden");

        document.getElementById(
            "folderView"
        ).classList.remove("hidden");

        renderFolders();
    }
);


document.getElementById(
    "addPhotoBtn"
).addEventListener(
    "click",
    addPhoto
);


async function addPhoto() {

    if (!currentFolderId) return;

    const fileInput =
        document.getElementById(
            "photoFile"
        );

    const nameInput =
        document.getElementById(
            "photoName"
        );

    const file =
        fileInput.files[0];

    let name =
        nameInput.value.trim();

    if (!file) {

        alert("Choose a photo first.");

        return;
    }

    if (!name) {

        name =
            file.name
                .replace(/\.[^/.]+$/, "");
    }

    const photo = {

        id: createId(),

        folderId: currentFolderId,

        name,

        date: new Date().toISOString(),

        createdAt: new Date().toISOString(),

        blob: file
    };

    await dbPut(
        "photos",
        photo
    );

    const folders =
        await dbGetAll("folders");

    const folder =
        folders.find(
            f => f.id === currentFolderId
        );

    /*
       The first photo ever added becomes
       the permanent folder cover.
    */

    if (
        folder &&
        !folder.coverPhotoId
    ) {

        folder.coverPhotoId =
            photo.id;

        await dbPut(
            "folders",
            folder
        );
    }

    fileInput.value = "";
    nameInput.value = "";

    renderPhotos();
}


async function renderPhotos() {

    const allPhotos =
        await dbGetAll("photos");

    const photos =
        allPhotos.filter(
            photo =>
                photo.folderId === currentFolderId
        );

    document.getElementById(
        "currentFolderCount"
    ).textContent =
        `${photos.length} photo${photos.length === 1 ? "" : "s"}`;

    const grid =
        document.getElementById(
            "photoGrid"
        );

    grid.innerHTML = "";

    if (photos.length === 0) {

        grid.innerHTML = `
            <div class="panel">
                <p class="muted">
                    This folder has no photos yet.
                </p>
            </div>
        `;

        return;
    }

    photos.sort(
        (a, b) =>
            new Date(a.createdAt) -
            new Date(b.createdAt)
    );

    photos.forEach(
        photo => {

            const card =
                document.createElement("div");

            card.className =
                "photo-card";

            const url =
                URL.createObjectURL(
                    photo.blob
                );

            card.innerHTML = `

                <div class="photo-image">

                    <img
                        src="${url}"
                        alt="${escapeHTML(photo.name)}"
                    >

                </div>

                <div class="photo-info">

                    <strong>
                        ${escapeHTML(photo.name)}
                    </strong>

                    <span>
                        ${formatDate(photo.date)}
                    </span>

                    <br>

                    <button class="photo-delete">
                        DELETE
                    </button>

                </div>
            `;

            card.querySelector(
                ".photo-delete"
            ).addEventListener(
                "click",
                async () => {

                    await dbDelete(
                        "photos",
                        photo.id
                    );

                    renderPhotos();
                }
            );

            grid.appendChild(card);
        }
    );
}


/* =========================================================
   NOTES
   ========================================================= */

let editingNoteId = null;


document.getElementById(
    "newNoteBtn"
).addEventListener(
    "click",
    () => openNoteEditor(null)
);


document.getElementById(
    "closeNoteBtn"
).addEventListener(
    "click",
    closeNoteEditor
);


document.getElementById(
    "saveNoteBtn"
).addEventListener(
    "click",
    saveNote
);


function openNoteEditor(noteId) {

    editingNoteId = noteId;

    const editor =
        document.getElementById(
            "noteEditor"
        );

    editor.classList.remove("hidden");

    if (noteId === null) {

        document.getElementById(
            "noteTitle"
        ).value = "";

        document.getElementById(
            "noteContent"
        ).innerHTML = "";

        return;
    }

    const note =
        data.notes.find(
            n => n.id === noteId
        );

    if (!note) return;

    document.getElementById(
        "noteTitle"
    ).value =
        note.title;

    document.getElementById(
        "noteContent"
    ).innerHTML =
        note.content || "";

    editor.scrollIntoView({
        behavior: "smooth"
    });
}


function closeNoteEditor() {

    editingNoteId = null;

    document.getElementById(
        "noteEditor"
    ).classList.add("hidden");
}


function saveNote() {

    const title =
        document.getElementById(
            "noteTitle"
        ).value.trim();

    const content =
        document.getElementById(
            "noteContent"
        ).innerHTML;

    if (!title) {

        alert("Give your note a title.");

        return;
    }

    if (editingNoteId) {

        const note =
            data.notes.find(
                n => n.id === editingNoteId
            );

        if (note) {

            note.title = title;
            note.content = content;
            note.updatedAt =
                new Date().toISOString();
        }

    } else {

        data.notes.unshift({

            id: createId(),

            title,

            content,

            createdAt:
                new Date().toISOString(),

            updatedAt:
                new Date().toISOString()
        });
    }

    saveData();

    closeNoteEditor();

    renderNotes();
}


function renderNotes() {

    const grid =
        document.getElementById(
            "notesGrid"
        );

    grid.innerHTML = "";

    if (data.notes.length === 0) {

        grid.innerHTML = `
            <div class="panel">
                <p class="muted">
                    No notes yet. Create your first note.
                </p>
            </div>
        `;

        return;
    }

    data.notes.forEach(
        note => {

            const card =
                document.createElement("div");

            card.className =
                "note-card";

            const preview =
                stripHTML(
                    note.content || ""
                );

            card.innerHTML = `

                <h3>
                    ${escapeHTML(note.title)}
                </h3>

                <div class="note-preview">
                    ${escapeHTML(
                        preview || "Empty note"
                    )}
                </div>

                <div class="note-date">
                    ${formatDate(note.updatedAt)}
                </div>

                <button class="delete-btn note-delete">
                    ×
                </button>
            `;

            card.addEventListener(
                "click",
                event => {

                    if (
                        event.target.closest(
                            ".note-delete"
                        )
                    ) return;

                    openNoteEditor(
                        note.id
                    );
                }
            );

            card.querySelector(
                ".note-delete"
            ).addEventListener(
                "click",
                () => {

                    if (
                        !confirm(
                            "Delete this note?"
                        )
                    ) return;

                    data.notes =
                        data.notes.filter(
                            n => n.id !== note.id
                        );

                    saveData();

                    renderNotes();
                }
            );

            grid.appendChild(card);
        }
    );
}


/* =========================================================
   NOTE COLORS
   ========================================================= */

function changeSelectedTextColor(color) {

    const editor =
        document.getElementById(
            "noteContent"
        );

    editor.focus();

    document.execCommand(
        "styleWithCSS",
        false,
        true
    );

    document.execCommand(
        "foreColor",
        false,
        color === "red"
            ? "#ff3b3b"
            : "#ffffff"
    );
}


/* =========================================================
   HOME APPS
   ========================================================= */

const DEFAULT_HOME_APPS = [
    { id: "spotify", name: "Spotify", url: "https://open.spotify.com/", icon: "🎵" },
    { id: "youtube", name: "YouTube", url: "https://www.youtube.com/", icon: "▶️" },
    { id: "whatsapp", name: "WhatsApp", url: "https://web.whatsapp.com/", icon: "💬" },
    { id: "discord", name: "Discord", url: "https://discord.com/channels/@me", icon: "🎮" },
    { id: "netflix", name: "Netflix", url: "https://www.netflix.com/lb-en/", icon: "🎬" },
    { id: "instagram", name: "Instagram", url: "https://www.instagram.com/", icon: "📸" }
];

function ensureHomeApps() {
    if (!Array.isArray(data.homeApps)) {
        data.homeApps = DEFAULT_HOME_APPS.map(app => ({ ...app }));
        saveData();
    }
}

function injectHomeAppsStyles() {
    if (document.getElementById("homeAppsStyles")) return;

    const style = document.createElement("style");
    style.id = "homeAppsStyles";
    style.textContent = `
        .home-apps-section {
            margin-top: 24px;
        }

        .home-apps-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 16px;
            margin-bottom: 14px;
        }

        .home-apps-header h2 {
            margin: 0;
        }

        .home-apps-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
            gap: 14px;
        }

        .home-app-card {
            position: relative;
            min-height: 125px;
            padding: 18px 12px;
            border: 1px solid rgba(255,255,255,.09);
            border-radius: 16px;
            background: rgba(255,255,255,.035);
            color: inherit;
            text-decoration: none;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 9px;
            transition: transform .18s ease, border-color .18s ease, background .18s ease;
        }

        .home-app-card:hover {
            transform: translateY(-3px);
            border-color: rgba(255,59,59,.55);
            background: rgba(255,59,59,.07);
        }

        .home-app-icon {
            width: 52px;
            height: 52px;
            display: grid;
            place-items: center;
            border-radius: 14px;
            background: rgba(255,255,255,.07);
            font-size: 27px;
        }

        .home-app-name {
            font-weight: 700;
            text-align: center;
        }

        .home-app-edit {
            position: absolute;
            top: 7px;
            right: 7px;
            width: 25px;
            height: 25px;
            border: 0;
            border-radius: 7px;
            background: rgba(255,255,255,.08);
            color: #fff;
            cursor: pointer;
            opacity: 0;
            transition: opacity .15s ease;
        }

        .home-app-card:hover .home-app-edit,
        .home-app-card:focus-within .home-app-edit {
            opacity: 1;
        }

        .home-app-add {
            border-style: dashed;
            cursor: pointer;
            background: transparent;
        }

        .home-apps-empty {
            padding: 20px;
            border: 1px dashed rgba(255,255,255,.12);
            border-radius: 14px;
        }

        @media (max-width: 600px) {
            .home-apps-grid {
                grid-template-columns: repeat(3, minmax(0, 1fr));
                gap: 9px;
            }

            .home-app-card {
                min-height: 105px;
                padding: 12px 7px;
            }

            .home-app-icon {
                width: 44px;
                height: 44px;
                font-size: 23px;
            }

            .home-app-name {
                font-size: 12px;
            }
        }
    `;
    document.head.appendChild(style);
}

function getHomeAppsContainer() {
    let section = document.getElementById("homeAppsSection");
    if (section) return section;

    const homePage = document.getElementById("home");
    if (!homePage) return null;

    section = document.createElement("section");
    section.id = "homeAppsSection";
    section.className = "home-apps-section";
    section.innerHTML = `
        <div class="home-apps-header">
            <div>
                <p class="eyebrow">QUICK ACCESS</p>
                <h2>Home Apps</h2>
            </div>
            <button class="primary-btn" id="addHomeAppBtn">ADD APP</button>
        </div>
        <div id="homeAppsGrid" class="home-apps-grid"></div>
    `;

    homePage.appendChild(section);

    document.getElementById("addHomeAppBtn").addEventListener("click", addHomeApp);

    return section;
}

function renderHomeApps() {
    ensureHomeApps();
    injectHomeAppsStyles();

    const section = getHomeAppsContainer();
    if (!section) return;

    const grid = document.getElementById("homeAppsGrid");
    if (!grid) return;

    grid.innerHTML = "";

    data.homeApps.forEach(app => {
        const card = document.createElement("a");
        card.className = "home-app-card";
        card.href = app.url;
        card.target = "_blank";
        card.rel = "noopener noreferrer";
        card.title = app.url;

        card.innerHTML = `
            <span class="home-app-icon">${escapeHTML(app.icon || "🔗")}</span>
            <span class="home-app-name">${escapeHTML(app.name)}</span>
            <button type="button" class="home-app-edit" aria-label="Edit ${escapeHTML(app.name)}">✎</button>
        `;

        card.querySelector(".home-app-edit").addEventListener("click", event => {
            event.preventDefault();
            event.stopPropagation();
            editHomeApp(app.id);
        });

        grid.appendChild(card);
    });

    const addCard = document.createElement("button");
    addCard.type = "button";
    addCard.className = "home-app-card home-app-add";
    addCard.innerHTML = `
        <span class="home-app-icon">+</span>
        <span class="home-app-name">Add App</span>
    `;
    addCard.addEventListener("click", addHomeApp);
    grid.appendChild(addCard);
}

function addHomeApp() {
    const name = prompt("App name:");
    if (name === null) return;

    const cleanName = name.trim();
    if (!cleanName) {
        alert("Enter an app name.");
        return;
    }

    const urlInput = prompt("App link:", "https://");
    if (urlInput === null) return;

    let url = urlInput.trim();
    if (!url) {
        alert("Enter an app link.");
        return;
    }

    if (!/^https?:\/\//i.test(url)) {
        url = "https://" + url;
    }

    try {
        new URL(url);
    } catch {
        alert("Enter a valid website link.");
        return;
    }

    const icon = prompt("Optional emoji/icon:", "🔗") || "🔗";

    data.homeApps.push({
        id: createId(),
        name: cleanName,
        url,
        icon: icon.trim() || "🔗"
    });

    saveData();
    renderHomeApps();
}

function editHomeApp(id) {
    const app = data.homeApps.find(item => item.id === id);
    if (!app) return;

    const action = prompt(
        `Editing ${app.name}. Type:\n1 = change name\n2 = change link\n3 = change icon\n4 = delete app`,
        "1"
    );

    if (action === null) return;

    if (action === "1") {
        const name = prompt("New app name:", app.name);
        if (name !== null && name.trim()) app.name = name.trim();
    } else if (action === "2") {
        const value = prompt("New app link:", app.url);
        if (value !== null && value.trim()) {
            let url = value.trim();
            if (!/^https?:\/\//i.test(url)) url = "https://" + url;
            try {
                new URL(url);
                app.url = url;
            } catch {
                alert("Enter a valid website link.");
                return;
            }
        }
    } else if (action === "3") {
        const icon = prompt("New emoji/icon:", app.icon || "🔗");
        if (icon !== null) app.icon = icon.trim() || "🔗";
    } else if (action === "4") {
        if (!confirm(`Delete ${app.name}?`)) return;
        data.homeApps = data.homeApps.filter(item => item.id !== id);
    } else {
        return;
    }

    saveData();
    renderHomeApps();
}


/* =========================================================
   HELPERS
   ========================================================= */

function formatTime(totalSeconds) {

    totalSeconds =
        Math.max(
            0,
            Math.floor(totalSeconds)
        );

    const hours =
        Math.floor(
            totalSeconds / 3600
        );

    const minutes =
        Math.floor(
            (totalSeconds % 3600) / 60
        );

    const seconds =
        totalSeconds % 60;

    if (hours > 0) {

        return (
            String(hours).padStart(2, "0") +
            ":" +
            String(minutes).padStart(2, "0") +
            ":" +
            String(seconds).padStart(2, "0")
        );
    }

    return (
        String(minutes).padStart(2, "0") +
        ":" +
        String(seconds).padStart(2, "0")
    );
}


function formatMoney(amount) {

    return "$" +
        Number(amount || 0)
            .toFixed(2);
}


function getLocalDateString() {

    const now = new Date();

    const year =
        now.getFullYear();

    const month =
        String(
            now.getMonth() + 1
        ).padStart(2, "0");

    const day =
        String(
            now.getDate()
        ).padStart(2, "0");

    return `${year}-${month}-${day}`;
}


function formatDate(date) {

    return new Intl.DateTimeFormat(
        "en-US",
        {
            year: "numeric",
            month: "short",
            day: "numeric"
        }
    ).format(
        new Date(date)
    );
}


function stripHTML(html) {

    const temp =
        document.createElement("div");

    temp.innerHTML = html;

    return temp.textContent || "";
}


function escapeHTML(text) {

    const div =
        document.createElement("div");

    div.textContent =
        text;

    return div.innerHTML;
}


/* =========================================================
   INITIALIZE
   ========================================================= */

let initialized = false;

async function initialize() {

    if (initialized) return;
    initialized = true;

    updateGlobalStats();

    renderTasks();

    renderFinance();

    renderPrayers();

    updateReadingDisplay();

    setupFocusTimer();

    renderNotes();

    renderHomeApps();

    try {

        await openPhotoDB();

        renderFolders();

    } catch (error) {

        console.error(
            "Photo database could not open:",
            error
        );
    }
}

initialize();