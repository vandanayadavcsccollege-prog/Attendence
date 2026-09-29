// =====================================================
// GLOBAL LOGIN ROLE
// =====================================================

window.loginRole = "student";


// =====================================================
// ATTENDANCE PAGE LOAD
// =====================================================

document.addEventListener("DOMContentLoaded", function () {

    const attendanceTable =
        document.getElementById("attendanceTable");

    if (!attendanceTable) {
        return;
    }

    const dateInput =
        document.getElementById("attDate");

    // =================================================
    // SET TODAY'S DATE
    // =================================================

    if (dateInput && !dateInput.value) {

        const today =
            new Date().toISOString().split("T")[0];

        dateInput.value = today;
    }

    // LOAD CLASS-WISE SUBJECTS

updateSubjectsByClass();


// LOAD REGISTERED STUDENTS

loadAttendanceStudents();


    // =================================================
// CLASS CHANGE
// =================================================

const classSelect =
    document.getElementById("attClass");

if (classSelect) {

    classSelect.addEventListener("change", function () {

        updateSubjectsByClass();

        loadAttendanceStudents();

    });

}


// =================================================
// SUBJECT CHANGE
// =================================================

const subjectSelect =
    document.getElementById("attSubject");

if (subjectSelect) {

    subjectSelect.addEventListener(
        "change",
        loadAttendanceStudents
    );

}


// =================================================
// LOAD SUBJECTS ACCORDING TO CLASS
// =================================================

function updateSubjectsByClass() {

    const classSelect =
        document.getElementById("attClass");

    const subjectSelect =
        document.getElementById("attSubject");

    if (!classSelect || !subjectSelect) {
        return;
    }


    const selectedClass =
        classSelect.value;


    // CLASS-WISE SUBJECTS

    const subjects = {

        "BSc IT - TY": [
            "Data Analytics",
            "Java",
            "Web Development",
            "Python",
            "Software Engineering",
            "Computer Networks"
        ],

        "BSc IT - SY": [
            "Java",
            "Python",
            "Web Development",
            "Computer Networks"
        ],

        "BSc IT - FY": [
            "Python",
            "Web Development",
            "Computer Networks"
        ],

        "BCom": [
            "Financial Accounting",
            "Business Economics",
            "Business Communication",
            "Business Law"
        ],

        "BA": [
            "English",
            "Economics",
            "Political Science",
            "History"
        ],

        "BSc": [
            "Physics",
            "Chemistry",
            "Mathematics",
            "Computer Science"
        ]

    };


    // Clear old subjects

    subjectSelect.innerHTML = "";


    // Get subjects for selected class

    const classSubjects =
        subjects[selectedClass] || [];


    // Add subjects

    classSubjects.forEach(function (subject) {

        const option =
            document.createElement("option");

        option.value = subject;
        option.textContent = subject;

        subjectSelect.appendChild(option);

    });

}

    // =================================================
    // DATE CHANGE
    // =================================================

    if (dateInput) {

        dateInput.addEventListener(
            "change",
            loadAttendanceStudents
        );
    }

});


// =====================================================
// LOAD STUDENTS FOR ATTENDANCE
// =====================================================

function loadAttendanceStudents() {

    const students =
        JSON.parse(
            localStorage.getItem("students")
        ) || [];


    const classSelect =
        document.getElementById("attClass");

    const subjectSelect =
        document.getElementById("attSubject");

    const dateInput =
        document.getElementById("attDate");

    const table =
        document.getElementById("attendanceTable");

    const info =
        document.getElementById("attendanceInfo");


    if (
        !classSelect ||
        !subjectSelect ||
        !dateInput ||
        !table
    ) {
        return;
    }


    const selectedClass =
        classSelect.value;

    const subject =
        subjectSelect.value;

    const date =
        dateInput.value;


    // =================================================
    // DATE CHECK
    // =================================================

    if (!date) {

        table.innerHTML = `
            <p class="no-students">
                ⚠️ Please select attendance date.
            </p>
        `;

        return;
    }


    // =================================================
    // SUBJECT CHECK
    // =================================================

    if (!subject) {

        table.innerHTML = `
            <p class="no-students">
                ⚠️ Please select subject.
            </p>
        `;

        return;
    }


    // =================================================
    // FIND STUDENTS OF SELECTED CLASS
    // =================================================

    const classStudents =
        students.filter(function (student) {

            return student.class === selectedClass;

        });


    // Attendance information
    if (info) {

        info.innerText =
            subject + " • " + date;

    }


    // =================================================
    // NO STUDENTS
    // =================================================

    if (classStudents.length === 0) {

        table.innerHTML = `

            <div class="empty-attendance">

                <div>🎓</div>

                <h3>No Students Found</h3>

                <p>
                    No registered students found
                    in ${selectedClass}.
                </p>

            </div>

        `;

        return;
    }


    // =================================================
    // ATTENDANCE KEY
    // =================================================

    const attendanceKey =
        date + "_" + subject;


    // =================================================
    // CREATE STUDENT TABLE
    // =================================================

    let html = `

        <div class="attendance-table-wrapper">

            <table class="attendance-mark-table">

                <thead>

                    <tr>

                        <th>Roll No.</th>

                        <th>Student Name</th>

                        <th>Username</th>

                        <th>Present</th>

                        <th>Absent</th>

                    </tr>

                </thead>

                <tbody>

    `;


    // =================================================
    // ADD STUDENTS
    // =================================================

    classStudents.forEach(
        function (student, index) {

            let oldStatus = "Present";


            // Check previous attendance
            if (
                student.attendance &&
                student.attendance[attendanceKey]
            ) {

                oldStatus =
                    student.attendance[attendanceKey];

            }


            html += `

                <tr>

                    <td>
                        ${
                            student.roll ||
                            String(index + 1).padStart(2, "0")
                        }
                    </td>


                    <td>

                        <strong>
                            ${student.name || "-"}
                        </strong>

                    </td>


                    <td>
                        ${student.username || "-"}
                    </td>


                    <td>

                        <label class="attendance-option">

                            <input
                                type="radio"
                                name="attendance_${student.id}"
                                value="Present"
                                ${
                                    oldStatus === "Present"
                                    ? "checked"
                                    : ""
                                }
                            >

                            <span>
                                Present
                            </span>

                        </label>

                    </td>


                    <td>

                        <label class="attendance-option">

                            <input
                                type="radio"
                                name="attendance_${student.id}"
                                value="Absent"
                                ${
                                    oldStatus === "Absent"
                                    ? "checked"
                                    : ""
                                }
                            >

                            <span>
                                Absent
                            </span>

                        </label>

                    </td>

                </tr>

            `;

        }
    );


    html += `

                </tbody>

            </table>

        </div>

    `;


    table.innerHTML = html;

}


// =====================================================
// SAVE ATTENDANCE
// =====================================================

function saveAttendance() {

    let students =
        JSON.parse(
            localStorage.getItem("students")
        ) || [];


    const classSelect =
        document.getElementById("attClass");

    const subjectSelect =
        document.getElementById("attSubject");

    const dateInput =
        document.getElementById("attDate");


    if (
        !classSelect ||
        !subjectSelect ||
        !dateInput
    ) {
        return;
    }


    const selectedClass =
        classSelect.value;

    const subject =
        subjectSelect.value;

    const date =
        dateInput.value;


    // =================================================
    // DATE CHECK
    // =================================================

    if (!date) {

        alert(
            "⚠️ Please select attendance date."
        );

        return;
    }


    // =================================================
    // SUBJECT CHECK
    // =================================================

    if (!subject) {

        alert(
            "⚠️ Please select subject."
        );

        return;
    }


    // =================================================
    // FIND CLASS STUDENTS
    // =================================================

    const classStudents =
        students.filter(function (student) {

            return student.class === selectedClass;

        });


    if (classStudents.length === 0) {

        alert(
            "❌ No students found in this class."
        );

        return;
    }


    const attendanceKey =
        date + "_" + subject;


    let present = 0;
    let absent = 0;


    // =================================================
    // SAVE ATTENDANCE
    // =================================================

    students.forEach(function (student) {

        if (
            student.class !== selectedClass
        ) {
            return;
        }


        const selected =
            document.querySelector(
                `input[name="attendance_${student.id}"]:checked`
            );


        if (!selected) {
            return;
        }


        // Create attendance object
        if (!student.attendance) {

            student.attendance = {};

        }


        // Save Present / Absent
        student.attendance[attendanceKey] =
            selected.value;


        if (
            selected.value === "Present"
        ) {

            present++;

        } else {

            absent++;

        }

    });


    // =================================================
    // SAVE TO LOCAL STORAGE
    // =================================================

    localStorage.setItem(
        "students",
        JSON.stringify(students)
    );


    // =================================================
    // SUCCESS MESSAGE
    // =================================================

    alert(

        "✅ Attendance Saved Successfully!\n\n" +

        "Class: " +
        selectedClass +

        "\nSubject: " +
        subject +

        "\nDate: " +
        date +

        "\n\nPresent: " +
        present +

        "\nAbsent: " +
        absent

    );

}


// =====================================================
// LOGOUT
// =====================================================

window.logoutUser = function () {

    localStorage.removeItem("loggedIn");
    localStorage.removeItem("userRole");
    localStorage.removeItem("currentUser");

    window.location.href = "login.html";

};


window.logout = function () {

    localStorage.removeItem("loggedIn");
    localStorage.removeItem("userRole");
    localStorage.removeItem("currentUser");

    window.location.href = "login.html";

};


// =====================================================
// LOGIN ROLE BUTTON
// =====================================================

window.setLoginRole = function (role) {

    window.loginRole = role;

    const studentBtn =
        document.getElementById("studentRole");

    const facultyBtn =
        document.getElementById("facultyRole");


    if (studentBtn && facultyBtn) {

        studentBtn.classList.remove("active");
        facultyBtn.classList.remove("active");


        if (role === "student") {

            studentBtn.classList.add("active");

        } else {

            facultyBtn.classList.add("active");

        }

    }

};


// =====================================================
// LOGIN BUTTON
// =====================================================

document.addEventListener("DOMContentLoaded", function () {

    const loginForm =
        document.getElementById("loginForm");


    if (!loginForm) {
        return;
    }


    loginForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const usernameInput =
                document.getElementById("loginUsername");

            const passwordInput =
                document.getElementById("loginPassword");

            const message =
                document.getElementById("loginMessage");


            const username =
                usernameInput
                    ? usernameInput.value.trim()
                    : "";


            const password =
                passwordInput
                    ? passwordInput.value.trim()
                    : "";


            // =================================================
            // FACULTY LOGIN
            // =================================================

            if (window.loginRole === "faculty") {

                if (
                    username === "faculty" &&
                    password === "faculty123"
                ) {

                    localStorage.setItem(
                        "loggedIn",
                        "true"
                    );

                    localStorage.setItem(
                        "userRole",
                        "faculty"
                    );

                    localStorage.setItem(
                        "currentUser",
                        "faculty"
                    );


                    window.location.href =
                        "faculty-dashboard.html";

                } else {

                    if (message) {

                        message.innerText =
                            "❌ Invalid faculty username or password.";

                        message.style.color =
                            "red";

                    }

                }

                return;

            }


            // =================================================
            // STUDENT LOGIN
            // =================================================

            const students =
                JSON.parse(
                    localStorage.getItem("students")
                ) || [];


            const student =
                students.find(function (user) {

                    return (
                        user.username &&
                        user.username.toLowerCase() ===
                        username.toLowerCase() &&
                        user.password === password
                    );

                });


            if (student) {

                localStorage.setItem(
                    "loggedIn",
                    "true"
                );

                localStorage.setItem(
                    "userRole",
                    "student"
                );

                localStorage.setItem(
                    "currentUser",
                    student.username
                );


                window.location.href =
                    "student-dashboard.html";

            } else {

                if (message) {

                    message.innerText =
                        "❌ Invalid username or password.";

                    message.style.color =
                        "red";

                }

            }

        }
    );

});


// =====================================================
// STUDENT DASHBOARD - ATTENDANCE DISPLAY
// =====================================================

document.addEventListener("DOMContentLoaded", function () {

    const studentName =
        document.getElementById("studentName");


    if (!studentName) {
        return;
    }


    const currentUsername =
        localStorage.getItem("currentUser");


    if (!currentUsername) {
        return;
    }


    const students =
        JSON.parse(
            localStorage.getItem("students")
        ) || [];


    const student =
        students.find(function (user) {

            return (
                user.username &&
                user.username.toLowerCase() ===
                String(currentUsername).toLowerCase()
            );

        });


    if (!student) {
        return;
    }


    // =================================================
    // STUDENT NAME
    // =================================================

    studentName.innerText =
        "Welcome " + student.name + " 👋";


    // =================================================
    // STUDENT INFORMATION
    // =================================================

    const studentInfo =
        document.getElementById("studentInfo");


    if (studentInfo) {

        studentInfo.innerText =
            "Roll No: " +
            (student.roll || "-") +
            " • Class: " +
            (student.class || "-");

    }


    // =================================================
    // ATTENDANCE CALCULATION
    // =================================================

    let present = 0;
    let absent = 0;

    const subjectData = {};


    if (student.attendance) {

        Object.keys(student.attendance).forEach(
            function (key) {

                const status =
                    student.attendance[key];


                const separator =
                    key.indexOf("_");


                if (separator === -1) {
                    return;
                }


                const subject =
                    key.substring(separator + 1);


                if (!subject) {
                    return;
                }


                // Overall attendance
                if (status === "Present") {

                    present++;

                }


                if (status === "Absent") {

                    absent++;

                }


                // Subject-wise attendance
                if (!subjectData[subject]) {

                    subjectData[subject] = {
                        present: 0,
                        absent: 0
                    };

                }


                if (status === "Present") {

                    subjectData[subject].present++;

                } else if (status === "Absent") {

                    subjectData[subject].absent++;

                }

            }
        );

    }


    // =================================================
    // DASHBOARD CARDS
    // =================================================

    const totalClasses =
        present + absent;


    const percentage =
        totalClasses > 0
            ? ((present / totalClasses) * 100).toFixed(1)
            : 0;


    const totalClassesElement =
        document.getElementById("totalClasses");

    const studentPresentElement =
        document.getElementById("studentPresent");

    const studentAbsentElement =
        document.getElementById("studentAbsent");

    const studentPercentageElement =
        document.getElementById("studentPercentage");


    if (totalClassesElement) {

        totalClassesElement.innerText =
            totalClasses;

    }


    if (studentPresentElement) {

        studentPresentElement.innerText =
            present;

    }


    if (studentAbsentElement) {

        studentAbsentElement.innerText =
            absent;

    }


    if (studentPercentageElement) {

        studentPercentageElement.innerText =
            percentage + "%";

    }


    // =================================================
    // SUBJECT-WISE ATTENDANCE
    // =================================================

    const subjectContainer =
        document.getElementById("subjectAttendance");


    if (!subjectContainer) {
        return;
    }


    if (Object.keys(subjectData).length === 0) {

        subjectContainer.innerHTML = `
            <p class="no-students">
                📚 No attendance records available yet.
            </p>
        `;

        return;
    }


    let html = `

        <div class="table-container">

            <table>

                <thead>

                    <tr>

                        <th>Subject</th>

                        <th>Present</th>

                        <th>Absent</th>

                        <th>Total Classes</th>

                        <th>Attendance %</th>

                    </tr>

                </thead>

                <tbody>

    `;


    Object.keys(subjectData).forEach(
        function (subject) {

            const data =
                subjectData[subject];


            const total =
                data.present + data.absent;


            const percent =
                total > 0
                    ? ((data.present / total) * 100).toFixed(1)
                    : 0;


            html += `

                <tr>

                    <td>
                        <strong>${subject}</strong>
                    </td>

                    <td>
                        ${data.present}
                    </td>

                    <td>
                        ${data.absent}
                    </td>

                    <td>
                        ${total}
                    </td>

                    <td>
                        <strong>${percent}%</strong>
                    </td>

                </tr>

            `;

        }
    );


    html += `

                </tbody>

            </table>

        </div>

    `;


    subjectContainer.innerHTML =
        html;

});


// =====================================================
// STUDENT SUBJECT-WISE ATTENDANCE
// =====================================================

document.addEventListener("DOMContentLoaded", function () {

    const subjectAttendance =
        document.getElementById("subjectAttendance");


    if (!subjectAttendance) {
        return;
    }


    const currentUser =
        localStorage.getItem("currentUser");


    if (!currentUser) {
        return;
    }


    const students =
        JSON.parse(
            localStorage.getItem("students")
        ) || [];


    const student =
        students.find(function (user) {

            return (
                user.username &&
                user.username.toLowerCase() ===
                currentUser.toLowerCase()
            );

        });


    if (!student) {

        subjectAttendance.innerHTML = `
            <div class="empty-attendance">
                <h3>Student Not Found</h3>
                <p>Please login again.</p>
            </div>
        `;

        return;
    }


    if (
        !student.attendance ||
        Object.keys(student.attendance).length === 0
    ) {

        subjectAttendance.innerHTML = `
            <div class="empty-attendance">
                <div>📚</div>
                <h3>No Attendance Records</h3>
                <p>Your attendance has not been marked yet.</p>
            </div>
        `;

        return;
    }


    // =================================================
    // SUBJECT-WISE DATA
    // =================================================

    const subjects = {};


    Object.entries(student.attendance).forEach(
        function ([key, status]) {

            const separator =
                key.indexOf("_");


            if (separator === -1) {
                return;
            }


            const subject =
                key.substring(separator + 1);


            if (!subject) {
                return;
            }


            if (!subjects[subject]) {

                subjects[subject] = {
                    present: 0,
                    absent: 0,
                    total: 0
                };

            }


            subjects[subject].total++;


            if (status === "Present") {

                subjects[subject].present++;

            }


            if (status === "Absent") {

                subjects[subject].absent++;

            }

        }
    );


    // =================================================
    // CREATE TABLE
    // =================================================

    let html = `

        <div class="table-card">

            <div class="table-container">

                <table>

                    <thead>

                        <tr>

                            <th>Subject</th>

                            <th>Present</th>

                            <th>Absent</th>

                            <th>Total Classes</th>

                            <th>Attendance %</th>

                        </tr>

                    </thead>

                    <tbody>

    `;


    Object.keys(subjects).forEach(
        function (subject) {

            const data =
                subjects[subject];


            const percentage =
                data.total > 0
                    ? ((data.present / data.total) * 100).toFixed(1)
                    : 0;


            html += `

                <tr>

                    <td>
                        <strong>${subject}</strong>
                    </td>

                    <td>
                        ${data.present}
                    </td>

                    <td>
                        ${data.absent}
                    </td>

                    <td>
                        ${data.total}
                    </td>

                    <td>
                        <strong>${percentage}%</strong>
                    </td>

                </tr>

            `;

        }
    );


    html += `

                    </tbody>

                </table>

            </div>

        </div>

    `;


    subjectAttendance.innerHTML =
        html;

});


// =====================================================
// STUDENT ATTENDANCE HISTORY
// =====================================================

document.addEventListener("DOMContentLoaded", function () {

    const historyContainer =
        document.getElementById("attendanceHistory");


    if (!historyContainer) {
        return;
    }


    const currentUser =
        localStorage.getItem("currentUser");


    const students =
        JSON.parse(
            localStorage.getItem("students")
        ) || [];


    const student =
        students.find(function (user) {

            return (
                user.username &&
                String(user.username).toLowerCase() ===
                String(currentUser).toLowerCase()
            );

        });


    // =================================================
    // STUDENT NOT FOUND
    // =================================================

    if (!student) {

        historyContainer.innerHTML = `
            <div class="no-history">

                <h3>⚠️ Student Not Found</h3>

                <p>
                    Please login again.
                </p>

            </div>
        `;

        return;
    }


    // =================================================
    // NO ATTENDANCE
    // =================================================

    if (
        !student.attendance ||
        Object.keys(student.attendance).length === 0
    ) {

        historyContainer.innerHTML = `
            <div class="no-history">

                <div style="font-size:40px;">📚</div>

                <h3>No Attendance History</h3>

                <p>
                    Your attendance has not been marked yet.
                </p>

            </div>
        `;

        return;
    }


    // =================================================
    // GET ATTENDANCE RECORDS
    // =================================================

    let records = [];


    Object.keys(student.attendance).forEach(
        function (key) {

            const separator =
                key.indexOf("_");


            if (separator === -1) {
                return;
            }


            const date =
                key.substring(0, separator);


            const subject =
                key.substring(separator + 1);


            const status =
                student.attendance[key];


            records.push({

                date: date,

                subject: subject,

                status: status

            });

        }
    );


    // =================================================
    // SORT NEWEST DATE FIRST
    // =================================================

    records.sort(function (a, b) {

        return b.date.localeCompare(a.date);

    });


    // =================================================
    // CREATE TABLE
    // =================================================

    let html = `

        <div class="history-card">

            <h2>Attendance History</h2>

            <div class="table-container">

                <table class="history-table">

                    <thead>

                        <tr>

                            <th>Date</th>

                            <th>Subject</th>

                            <th>Status</th>

                        </tr>

                    </thead>

                    <tbody>

    `;


    records.forEach(
        function (record) {

            let statusClass = "";


            if (record.status === "Present") {

                statusClass =
                    "history-present";

            } else if (record.status === "Absent") {

                statusClass =
                    "history-absent";

            }


            html += `

                <tr>

                    <td>
                        ${record.date}
                    </td>

                    <td>
                        <strong>
                            ${record.subject}
                        </strong>
                    </td>

                    <td class="${statusClass}">
                        ${record.status}
                    </td>

                </tr>

            `;

        }
    );


    html += `

                    </tbody>

                </table>

            </div>

        </div>

    `;


    historyContainer.innerHTML =
        html;

});


// =====================================================
// STUDENT APPLY LEAVE
// =====================================================

function applyLeave() {

    const leaveDateElement =
        document.getElementById("leaveDate");

    const leaveReasonElement =
        document.getElementById("leaveReason");

    const leaveMessageElement =
        document.getElementById("leaveMessage");

    const messageBox =
        document.getElementById("leaveMessageBox");


    if (
        !leaveDateElement ||
        !leaveReasonElement ||
        !leaveMessageElement ||
        !messageBox
    ) {
        return;
    }


    const leaveDate =
        leaveDateElement.value;

    const leaveReason =
        leaveReasonElement.value;

    const leaveMessage =
        leaveMessageElement.value.trim();


    // =================================================
    // CHECK DATE
    // =================================================

    if (!leaveDate) {

        messageBox.innerText =
            "⚠️ Please select leave date.";

        messageBox.style.color =
            "red";

        return;
    }


    // =================================================
    // CHECK MESSAGE
    // =================================================

    if (!leaveMessage) {

        messageBox.innerText =
            "⚠️ Please enter leave message.";

        messageBox.style.color =
            "red";

        return;
    }


    // =================================================
    // CURRENT LOGGED-IN STUDENT
    // =================================================

    const currentUser =
        localStorage.getItem("currentUser");


    if (!currentUser) {

        messageBox.innerText =
            "❌ Please login again.";

        messageBox.style.color =
            "red";

        return;
    }


    // =================================================
    // GET EXISTING LEAVE REQUESTS
    // =================================================

    let leaves =
        JSON.parse(
            localStorage.getItem("leaveRequests")
        ) || [];


    // =================================================
    // GET STUDENTS
    // =================================================

    const students =
        JSON.parse(
            localStorage.getItem("students")
        ) || [];


    // =================================================
    // FIND STUDENT
    // =================================================

    const student =
        students.find(function (user) {

            return (
                user.username &&
                user.username.toLowerCase() ===
                currentUser.toLowerCase()
            );

        });


    if (!student) {

        messageBox.innerText =
            "❌ Student not found.";

        messageBox.style.color =
            "red";

        return;
    }


    // =================================================
    // CREATE LEAVE REQUEST
    // =================================================

    const leaveRequest = {

        id: Date.now(),

        username:
            student.username,

        studentName:
            student.name,

        roll:
            student.roll || "",

        class:
            student.class || "",

        email:
            student.email || "",

        date:
            leaveDate,

        reason:
            leaveReason,

        message:
            leaveMessage,

        status:
            "Pending",

        createdAt:
            new Date().toISOString()

    };


    // =================================================
    // SAVE REQUEST
    // =================================================

    leaves.push(leaveRequest);


    localStorage.setItem(
        "leaveRequests",
        JSON.stringify(leaves)
    );


    // =================================================
    // SUCCESS MESSAGE
    // =================================================

    messageBox.innerText =
        "✅ Leave request submitted successfully!";

    messageBox.style.color =
        "green";


    // =================================================
    // CLEAR FORM
    // =================================================

    leaveDateElement.value = "";

    leaveMessageElement.value = "";

}


// =====================================================
// STUDENT LEAVE STATUS
// =====================================================

document.addEventListener("DOMContentLoaded", function () {

    const studentLeaves =
        document.getElementById("studentLeaves");


    if (!studentLeaves) {
        return;
    }


    const currentUser =
        localStorage.getItem("currentUser");


    if (!currentUser) {

        studentLeaves.innerHTML = `
            <div class="empty-attendance">
                <h3>Please Login Again</h3>
            </div>
        `;

        return;
    }


    const leaves =
        JSON.parse(
            localStorage.getItem("leaveRequests")
        ) || [];


    // =================================================
    // CURRENT STUDENT LEAVES
    // =================================================

    const myLeaves =
        leaves.filter(function (leave) {

            return (
                leave.username &&
                leave.username.toLowerCase() ===
                currentUser.toLowerCase()
            );

        });


    // =================================================
    // NO LEAVE REQUESTS
    // =================================================

    if (myLeaves.length === 0) {

        studentLeaves.innerHTML = `
            <div class="empty-attendance">

                <div>📝</div>

                <h3>No Leave Requests</h3>

                <p>
                    You have not submitted any leave request yet.
                </p>

            </div>
        `;

        return;
    }


    // =================================================
    // CREATE TABLE
    // =================================================

    let html = `

        <div class="table-container">

            <table>

                <thead>

                    <tr>

                        <th>Leave Date</th>

                        <th>Reason</th>

                        <th>Message</th>

                        <th>Status</th>

                    </tr>

                </thead>

                <tbody>

    `;


    myLeaves.forEach(function (leave) {

        let statusClass = "";


        if (leave.status === "Approved") {

            statusClass = "history-present";

        } else if (leave.status === "Rejected") {

            statusClass = "history-absent";

        }


        html += `

            <tr>

                <td>
                    ${leave.date || "-"}
                </td>

                <td>
                    <strong>
                        ${leave.reason || "-"}
                    </strong>
                </td>

                <td>
                    ${leave.message || "-"}
                </td>

                <td class="${statusClass}">
                    <strong>
                        ${leave.status || "Pending"}
                    </strong>
                </td>

            </tr>

        `;

    });


    html += `

                </tbody>

            </table>

        </div>

    `;


    studentLeaves.innerHTML =
        html;

});


// =====================================================
// FACULTY LEAVE REQUESTS
// =====================================================

window.loadFacultyLeaves = function () {

    const table =
        document.getElementById("facultyLeaves");


    if (!table) {
        return;
    }


    const leaves =
        JSON.parse(
            localStorage.getItem("leaveRequests")
        ) || [];


    table.innerHTML = "";


    // =================================================
    // NO LEAVE REQUESTS
    // =================================================

    if (leaves.length === 0) {

        table.innerHTML = `
            <tr>

                <td
                    colspan="8"
                    class="no-students"
                >
                    📝 No leave requests found.
                </td>

            </tr>
        `;

        return;
    }


    // =================================================
    // DISPLAY LEAVE REQUESTS
    // =================================================

    leaves.forEach(function (leave, index) {

        let statusClass = "";

        if (leave.status === "Approved") {

            statusClass = "history-present";

        } else if (leave.status === "Rejected") {

            statusClass = "history-absent";

        }


        // =================================================
        // ACTION BUTTONS
        // =================================================

        let actionButtons = "";


        if (leave.status === "Pending") {

            actionButtons = `

                <button
                    type="button"
                    class="approve-btn"
                    onclick="updateLeaveStatus(${leave.id}, 'Approved')"
                >
                    ✅ Approve
                </button>

                <button
                    type="button"
                    class="reject-btn"
                    onclick="updateLeaveStatus(${leave.id}, 'Rejected')"
                >
                    ❌ Reject
                </button>

            `;

        } else if (leave.status === "Approved") {

            actionButtons = `

                <span class="leave-action-done">
                    ✅ Approved
                </span>

            `;

        } else if (leave.status === "Rejected") {

            actionButtons = `

                <span class="leave-action-done">
                    ❌ Rejected
                </span>

            `;

        }


        table.innerHTML += `

            <tr>

                <td>
                    ${index + 1}
                </td>

                <td>
                    <strong>
                        ${leave.studentName || "-"}
                    </strong>
                </td>

                <td>
                    ${leave.username || "-"}
                </td>

                <td>
                    ${leave.class || "-"}
                </td>

                <td>
                    ${leave.date || "-"}
                </td>

                <td>

                    <strong>
                        ${leave.reason || "-"}
                    </strong>

                    <br>

                    <small>
                        ${leave.message || ""}
                    </small>

                </td>

                <td class="${statusClass}">

                    <strong>
                        ${leave.status || "Pending"}
                    </strong>

                </td>

                <td>

                    <div class="leave-actions">

                        ${actionButtons}

                    </div>

                </td>

            </tr>

        `;

    });

};


// =====================================================
// UPDATE LEAVE STATUS
// =====================================================

window.updateLeaveStatus = function (
    leaveId,
    newStatus
) {

    let leaves =
        JSON.parse(
            localStorage.getItem("leaveRequests")
        ) || [];


    // =================================================
    // FIND LEAVE REQUEST
    // =================================================

    const leave =
        leaves.find(function (item) {

            return String(item.id) ===
                   String(leaveId);

        });


    if (!leave) {

        alert(
            "❌ Leave request not found."
        );

        return;
    }


    // =================================================
    // CONFIRM ACTION
    // =================================================

    let confirmMessage = "";


    if (newStatus === "Approved") {

        confirmMessage =
            "Are you sure you want to approve this leave request?";

    } else if (newStatus === "Rejected") {

        confirmMessage =
            "Are you sure you want to reject this leave request?";

    }


    if (!confirm(confirmMessage)) {

        return;

    }


    // =================================================
    // UPDATE STATUS
    // =================================================

    leave.status =
        newStatus;


    // =================================================
    // SAVE UPDATED LEAVE REQUESTS
    // =================================================

    localStorage.setItem(
        "leaveRequests",
        JSON.stringify(leaves)
    );


    // =================================================
    // SUCCESS MESSAGE
    // =================================================

    if (newStatus === "Approved") {

        alert(
            "✅ Leave request approved successfully!"
        );

    } else {

        alert(
            "❌ Leave request rejected successfully!"
        );

    }


    // =================================================
    // RELOAD FACULTY TABLE
    // =================================================

    loadFacultyLeaves();

};


// =====================================================
// AUTO LOAD FACULTY LEAVES
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadFacultyLeaves();

    }
);
// =====================================================
// STUDENT REGISTRATION
// =====================================================

document.addEventListener("DOMContentLoaded", function () {

    const registerForm =
        document.getElementById("registerForm");

    if (!registerForm) {
        return;
    }

    registerForm.addEventListener("submit", function (event) {

        event.preventDefault();

        // Get form values
        const name =
            document.getElementById("regName").value.trim();

        const username =
            document.getElementById("regUsername").value.trim();

        const email =
            document.getElementById("regEmail").value.trim();

        const roll =
            document.getElementById("regRoll").value.trim();

        const studentClass =
            document.getElementById("regClass").value;

        const message =
            document.getElementById("registerMessage");


        // =================================================
        // VALIDATION
        // =================================================

        if (
            !name ||
            !username ||
            !email ||
            !roll ||
            !studentClass
        ) {

            if (message) {
                message.innerText =
                    "⚠️ Please fill all details.";
                message.style.color = "red";
            }

            return;
        }


        // =================================================
        // GET EXISTING STUDENTS
        // =================================================

        let students =
            JSON.parse(
                localStorage.getItem("students")
            ) || [];


        // =================================================
        // CHECK DUPLICATE USERNAME
        // =================================================

        const existingStudent =
            students.find(function (student) {

                return (
                    student.username &&
                    student.username.toLowerCase() ===
                    username.toLowerCase()
                );

            });


        if (existingStudent) {

            if (message) {
                message.innerText =
                    "❌ Username already exists.";
                message.style.color = "red";
            }

            return;
        }


        // =================================================
        // CHECK DUPLICATE ROLL NUMBER
        // =================================================

        const existingRoll =
            students.find(function (student) {

                return (
                    student.roll &&
                    student.roll.toLowerCase() ===
                    roll.toLowerCase()
                );

            });


        if (existingRoll) {

            if (message) {
                message.innerText =
                    "❌ Roll number already exists.";
                message.style.color = "red";
            }

            return;
        }


        // =================================================
        // CREATE NEW STUDENT
        // =================================================

        const newStudent = {

            id: Date.now(),

            name: name,

            username: username,

            email: email,

            roll: roll,

            class: studentClass,

            password: "Student@123",

            attendance: {}

        };


        // =================================================
        // SAVE STUDENT
        // =================================================

        students.push(newStudent);

        localStorage.setItem(
            "students",
            JSON.stringify(students)
        );


        // =================================================
        // SUCCESS MESSAGE
        // =================================================

        if (message) {

            message.innerText =
                "✅ Student account created successfully!";

            message.style.color = "green";

        }


        // =================================================
        // CLEAR FORM
        // =================================================

        registerForm.reset();


        // =================================================
        // GO TO LOGIN PAGE
        // =================================================

        setTimeout(function () {

            window.location.href = "login.html";

        }, 1500);

    });

});
// =====================================================
// SEARCH ATTENDANCE BY DATE
// =====================================================

window.searchAttendanceByDate = function () {

    const dateInput =
        document.getElementById("historyDate");

    const historyContainer =
        document.getElementById("attendanceHistory");

    if (!dateInput || !historyContainer) {
        return;
    }

    const selectedDate = dateInput.value;

    if (!selectedDate) {

        alert("⚠️ Please select a date.");

        return;
    }


    // CURRENT LOGGED-IN USER
    const currentUser =
        localStorage.getItem("currentUser");

    if (!currentUser) {

        historyContainer.innerHTML = `
            <div class="no-history">
                <h3>⚠️ Please Login Again</h3>
            </div>
        `;

        return;
    }


    // GET STUDENTS
    const students =
        JSON.parse(
            localStorage.getItem("students")
        ) || [];


    // FIND STUDENT
    const student =
        students.find(function (user) {

            return (
                user.username &&
                user.username.toLowerCase() ===
                currentUser.toLowerCase()
            );

        });


    if (!student) {

        historyContainer.innerHTML = `
            <div class="no-history">

                <h3>⚠️ Student Not Found</h3>

                <p>Please login again.</p>

            </div>
        `;

        return;
    }


    // CHECK ATTENDANCE
    if (
        !student.attendance ||
        Object.keys(student.attendance).length === 0
    ) {

        historyContainer.innerHTML = `
            <div class="no-history">

                <div style="font-size:40px;">
                    📚
                </div>

                <h3>No Attendance Records</h3>

                <p>
                    Your attendance has not been marked yet.
                </p>

            </div>
        `;

        return;
    }


    // =================================================
    // FIND ATTENDANCE FOR SELECTED DATE
    // =================================================

    let records = [];


    Object.keys(student.attendance).forEach(
        function (key) {

            const separator =
                key.indexOf("_");

            if (separator === -1) {
                return;
            }


            const date =
                key.substring(0, separator);

            const subject =
                key.substring(separator + 1);

            const status =
                student.attendance[key];


            if (date === selectedDate) {

                records.push({

                    date: date,

                    subject: subject,

                    status: status

                });

            }

        }
    );


    // =================================================
    // NO ATTENDANCE FOR SELECTED DATE
    // =================================================

    if (records.length === 0) {

        historyContainer.innerHTML = `

            <div class="no-history">

                <div style="font-size:40px;">
                    📅
                </div>

                <h3>No Attendance Found</h3>

                <p>
                    No attendance record found for
                    <strong>${selectedDate}</strong>.
                </p>

            </div>

        `;

        return;
    }


    // =================================================
    // CREATE SEARCH RESULT TABLE
    // =================================================

    let html = `

        <div class="history-card">

            <h2>
                Attendance for ${selectedDate}
            </h2>

            <div class="table-container">

                <table class="history-table">

                    <thead>

                        <tr>

                            <th>Date</th>

                            <th>Subject</th>

                            <th>Status</th>

                        </tr>

                    </thead>

                    <tbody>

    `;


    records.forEach(
        function (record) {

            let statusClass = "";


            if (record.status === "Present") {

                statusClass =
                    "history-present";

            }
            else if (
                record.status === "Absent"
            ) {

                statusClass =
                    "history-absent";

            }


            html += `

                <tr>

                    <td>
                        ${record.date}
                    </td>

                    <td>
                        <strong>
                            ${record.subject}
                        </strong>
                    </td>

                    <td class="${statusClass}">
                        <strong>
                            ${record.status}
                        </strong>
                    </td>

                </tr>

            `;

        }
    );


    html += `

                    </tbody>

                </table>

            </div>

        </div>

    `;


    historyContainer.innerHTML =
        html;

};


// =====================================================
// SHOW ALL ATTENDANCE
// =====================================================

window.showAllAttendance = function () {

    const dateInput =
        document.getElementById("historyDate");

    if (dateInput) {
        dateInput.value = "";
    }

    // Reload page to show complete history
    location.reload();

};
function togglePassword() {
    const password = document.getElementById("loginPassword");

    if (password.type === "password") {
        password.type = "text";
    } else {
        password.type = "password";
    }
}
