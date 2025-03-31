// Function to generate a unique UUID
const generateUUID = () => crypto.randomUUID();

// Save data to localStorage
const saveToLocalStorage = (data) => {
  localStorage.setItem("students", JSON.stringify(data));
};

// Get data from localStorage
const getFromLocalStorage = () => JSON.parse(localStorage.getItem("students")) || [];

const studentForm = document.getElementById("studentForm");
const submitBtn = document.getElementById("submitBtn");
const recordsBody = document.getElementById("recordsBody");
const searchInput = document.getElementById("searchInput");
const mainSection = document.getElementById("mainSection");
const viewSection = document.getElementById("viewSection");
const marksheetSection = document.getElementById("marksheetSection");
const studentDetails = document.getElementById("studentDetails");
const viewBackBtn = document.getElementById("viewBackBtn");
const marksheetBtn = document.getElementById("marksheetBtn");
const marksheetBackBtn = document.getElementById("marksheetBackBtn");

let students = getFromLocalStorage(); // Load initial data from localStorage
let editingIndex = null; // Tracks the index of the student being edited

// Event listener for the Submit button
submitBtn.addEventListener("click", () => {
  const student = {
    id: editingIndex !== null ? students[editingIndex].id : generateUUID(),
    firstName: document.getElementById("firstName").value.trim(),
    lastName: document.getElementById("lastName").value.trim(),
    dob: document.getElementById("dob").value,
    gender: document.getElementById("gender").value,
    fatherName: document.getElementById("fatherName").value.trim(),
    motherName: document.getElementById("motherName").value.trim(),
    address: document.getElementById("address").value.trim(),
    contact: document.getElementById("contact").value.trim(),
    class: document.getElementById("class").value.trim(),
    rollNo: document.getElementById("rollNo").value.trim(),
  };

  // Validate the student object
  if (!validateStudent(student)) {
    alert("Please fill in all required fields!");
    return;
  }

  if (editingIndex !== null) {
    // Update existing student record
    students[editingIndex] = student;
    alert("Student record updated successfully!");
    editingIndex = null; // Reset editing index
  } else {
    // Add new student record
    students.push(student);
    alert("Student added successfully!");
  }

  saveToLocalStorage(students); // Save updated students array to local storage
  renderRecords(); // Refresh the table
  studentForm.reset(); // Clear the form
  submitBtn.textContent = "Submit"; // Reset button text
});

// Function to render student records in the table
function renderRecords() {
  recordsBody.innerHTML = "";
  students.forEach((student, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td class="border p-2">${index + 1}</td>
      <td class="border p-2">${student.firstName}</td>
      <td class="border p-2">${student.lastName}</td>
      <td class="border p-2">${student.dob}</td>
      <td class="border p-2">${student.gender}</td>
      <td class="border p-2">${student.fatherName}</td>
      <td class="border p-2">${student.motherName}</td>
      <td class="border p-2">${student.address}</td>
      <td class="border p-2">${student.contact}</td>
      <td class="border p-2">${student.class}</td>
      <td class="border p-2">${student.rollNo}</td>
      <td class="border p-2">
        <button class="bg-blue-500 text-white px-2 rounded" onclick="viewStudent(${index})">View</button>
        <button class="bg-yellow-500 text-white px-2 rounded" onclick="editStudent(${index})">Edit</button>
        <button class="bg-red-500 text-white px-2 rounded" onclick="deleteStudent(${index})">Delete</button>
      </td>`;
    recordsBody.appendChild(row);
  });
}

// Function to view individual student details
function viewStudent(index) {
  const student = students[index];
  mainSection.classList.add("hidden");
  viewSection.classList.remove("hidden");
  studentDetails.innerHTML = `
    <p><strong>First Name:</strong> ${student.firstName}</p>
    <p><strong>Last Name:</strong> ${student.lastName}</p>
    <p><strong>Date of Birth:</strong> ${student.dob}</p>
    <p><strong>Gender:</strong> ${student.gender}</p>
    <p><strong>Father's Name:</strong> ${student.fatherName}</p>
    <p><strong>Mother's Name:</strong> ${student.motherName}</p>
    <p><strong>Address:</strong> ${student.address}</p>
    <p><strong>Contact:</strong> ${student.contact}</p>
    <p><strong>Class:</strong> ${student.class}</p>
    <p><strong>Roll No.:</strong> ${student.rollNo}</p>`;
}

// Function to edit a student record
function editStudent(index) {
  const student = students[index];
  editingIndex = index; // Track the index being edited
  document.getElementById("firstName").value = student.firstName;
  document.getElementById("lastName").value = student.lastName;
  document.getElementById("dob").value = student.dob;
  document.getElementById("gender").value = student.gender;
  document.getElementById("fatherName").value = student.fatherName;
  document.getElementById("motherName").value = student.motherName;
  document.getElementById("address").value = student.address;
  document.getElementById("contact").value = student.contact;
  document.getElementById("class").value = student.class;
  document.getElementById("rollNo").value = student.rollNo;

  submitBtn.textContent = "Update"; // Change button text to indicate edit mode
}

// Function to delete a student record
function deleteStudent(index) {
  if (confirm("Are you sure you want to delete this student?")) {
    students.splice(index, 1);
    alert("Student deleted successfully!");
    saveToLocalStorage(students); // Save updated array to local storage
    renderRecords(); // Refresh the table
  }
}

// Function to validate student input
function validateStudent(student) {
  return student.firstName && student.lastName && student.dob && student.gender && student.rollNo;
}

// Load and render records on page load
window.addEventListener("load", renderRecords);

// Event listeners for navigation buttons
viewBackBtn.addEventListener("click", () => {
  mainSection.classList.remove("hidden");
  viewSection.classList.add("hidden");
});

marksheetBtn.addEventListener("click", () => {
  viewSection.classList.add("hidden");
  marksheetSection.classList.remove("hidden");
});

marksheetBackBtn.addEventListener("click", () => {
  marksheetSection.classList.add("hidden");
  mainSection.classList.remove("hidden");
});

// Search functionality
searchInput.addEventListener('input', () => {
    const query = searchInput.value.toLowerCase();
    const filteredStudents = students.filter(student =>
        student.firstName.toLowerCase().includes(query) ||
        student.rollNo.toLowerCase().includes(query)
    );
    renderFilteredRecords(filteredStudents);

    // Automatically clear search input after 1 second if results are rendered
    if (query) {
        setTimeout(() => {
            searchInput.value = '';
        }, 1000);
    }
});

// Function to render filtered student records
function renderFilteredRecords(filteredStudents) {
    recordsBody.innerHTML = '';
    filteredStudents.forEach((student, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="border p-2">${index + 1}</td>
            <td class="border p-2">${student.firstName}</td>
            <td class="border p-2">${student.lastName}</td>
            <td class="border p-2">${student.dob}</td>
            <td class="border p-2">${student.gender}</td>
            <td class="border p-2">${student.fatherName}</td>
            <td class="border p-2">${student.motherName}</td>
            <td class="border p-2">${student.address}</td>
            <td class="border p-2">${student.contact}</td>
            <td class="border p-2">${student.class}</td>
            <td class="border p-2">${student.rollNo}</td>
            <td class="border p-2">
                <button class="bg-blue-500 text-white px-2 rounded" onclick="viewStudent(${index})">View</button>
                <button class="bg-yellow-500 text-white px-2 rounded" onclick="editStudent(${index})">Edit</button>
                <button class="bg-red-500 text-white px-2 rounded" onclick="deleteStudent(${index})">Delete</button>
            </td>`;
        recordsBody.appendChild(row);
    });
}

// Function to edit marks and recalculate GPA
function editMarks(subject) {
  const marksInput = document.getElementById(subject + "Marks");
  const gradeCell = document.getElementById(subject + "Grade");

  // Update grades based on marks
  const marks = parseFloat(marksInput.value);
  const grade = calculateGrade(marks);
  gradeCell.textContent = grade;

  // Recalculate GPA based on all subject marks
  recalculateGPA();
}

// Function to calculate the grade based on marks
function calculateGrade(marks) {
  if (marks >= 90) return "A+";
  if (marks >= 80) return "A";
  if (marks >= 70) return "B+";
  if (marks >= 60) return "B";
  if (marks >= 50) return "C";
  return "F";
}

// Function to recalculate the GPA
function recalculateGPA() {
  const subjects = ["nepali", "english", "math", "science", "social", "computer"];
  let totalMarks = 0;

  subjects.forEach(subject => {
    const marks = parseFloat(document.getElementById(subject + "Marks").value);
    totalMarks += marks;
  });

  const gpa = totalMarks / subjects.length; // Average marks as GPA
  document.getElementById("gpa").textContent = gpa.toFixed(2);
}

window.addEventListener("load", () => {
  recalculateGPA(); // Calculate GPA on page load
});

// Export as CSV
function exportToCSV() {
  const subjects = ["nepali", "english", "math", "science", "social", "computer"];
  let csvContent = "Subject,Marks,Grade\n";

  subjects.forEach(subject => {
    const marks = document.getElementById(subject + "Marks").value;
    const grade = document.getElementById(subject + "Grade").textContent;
    csvContent += `${subject.charAt(0).toUpperCase() + subject.slice(1)},${marks},${grade}\n`;
  });

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  if (link.download !== undefined) {
    link.setAttribute("href", URL.createObjectURL(blob));
    link.setAttribute("download", "marksheet.csv");
    link.click();
  }
}

// Export as PDF (with student details)
function downloadPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  
  // // Add student details at the top
  // const studentName = document.getElementById("studentName").value;
  // const rollNumber = document.getElementById("rollNumber").value;
  // const Class = document.getElementById("studentClass").value;
  // const DOB = document.getElementById("dob").value;

  // doc.setFontSize(16);
  // doc.text(`Student Name: ${studentName}`, 20, 20);
  // doc.text(`Roll Number: ${rollNumber}`, 20, 30);
  // doc.text(`Class: ${Class}`, 20, 30);
  // doc.text(`Date of birth: ${DOB}`,20,30);

  // Add marksheet table
  doc.autoTable({
    head: [['Subject', 'Marks', 'Grade']],
    body: [
      ['Nepali', document.getElementById('nepaliMarks').value, document.getElementById('nepaliGrade').textContent],
      ['English', document.getElementById('englishMarks').value, document.getElementById('englishGrade').textContent],
      ['Mathematics', document.getElementById('mathMarks').value, document.getElementById('mathGrade').textContent],
      ['Science', document.getElementById('scienceMarks').value, document.getElementById('scienceGrade').textContent],
      ['Social Studies', document.getElementById('socialMarks').value, document.getElementById('socialGrade').textContent],
      ['Computer Science', document.getElementById('computerMarks').value, document.getElementById('computerGrade').textContent],
    ]
  });

  // Add GPA
  const gpa = document.getElementById("gpa").textContent;
  doc.text(`GPA: ${gpa}`, 20, doc.lastAutoTable.finalY + 10);

  doc.save("marksheet.pdf");
}

<<<<<<< HEAD

=======
>>>>>>> a1857e859991c12860182a0251c540721a420b36
