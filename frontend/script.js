const API_URL = "http://127.0.0.1:8000";

const tbody = document.getElementById("students-body");
const message = document.getElementById("message");
const form = document.getElementById("student-form");

function makeCell(text) {
    const td = document.createElement("td");
    td.textContent = text;
    return td;
}

function renderStudents(list) {
    tbody.innerHTML = "";
    if (list.length === 0) {
        const row = document.createElement("tr");
        const cell = makeCell("No students yet.");
        cell.colSpan = 5;
        row.appendChild(cell);
        tbody.appendChild(row);
        return;
    }

    for (const s of list) {
        const row = document.createElement("tr");

        // Normal text cells banayein
        const idCell = makeCell(s.id);
        const nameCell = makeCell(s.name);
        const ageCell = makeCell(s.age);
        const cityCell = makeCell(s.city);

        row.appendChild(idCell);
        row.appendChild(nameCell);
        row.appendChild(ageCell);
        row.appendChild(cityCell);
        
        const actionCell = document.createElement("td");

       
        const btnDelete = document.createElement("button");
        btnDelete.textContent = "Delete";
        btnDelete.className = "delete-btn";
        btnDelete.addEventListener("click", () => {
            deleteStudent(s.id, s.name);
        });

        
        const btnEdit = document.createElement("button");
        btnEdit.textContent = "Edit";
        btnEdit.className = "edit-btn";

        
        const btnSave = document.createElement("button");
        btnSave.textContent = "Save";
        btnSave.className = "save-btn";
        btnSave.style.display = "none";

        
        const btnCancel = document.createElement("button");
        btnCancel.textContent = "Cancel";
        btnCancel.className = "cancel-btn";
        btnCancel.style.display = "none";
        
        
        btnEdit.addEventListener("click", () => {
            // 1. Text cells ko input fields mein badlein taake user type kar sake
            nameCell.innerHTML = `<input type="text" id="edit-name-${s.id}" value="${s.name}">`;
            ageCell.innerHTML = `<input type="number" id="edit-age-${s.id}" value="${s.age}">`;
            cityCell.innerHTML = `<input type="text" id="edit-city-${s.id}" value="${s.city}">`;

            
            btnEdit.style.display = "none";
            btnDelete.style.display = "none";
            btnSave.style.display = "inline-block";
            btnCancel.style.display = "inline-block";
        });

        
        btnCancel.addEventListener("click", () => {
            renderStudents(list);
        });

        
        btnSave.addEventListener("click", () => {
            // 1. Input fields se naya badla hua data uthein
            const updatedName = document.getElementById(`edit-name-${s.id}`).value.trim();
            const updatedAge = Number(document.getElementById(`edit-age-${s.id}`).value);
            const updatedCity = document.getElementById(`edit-city-${s.id}`).value.trim();

            if (!updatedName || !updatedAge || !updatedCity) {
                alert("Please fill all fields!");
                return;
            }
            editStudent(s.id, updatedName, updatedAge, updatedCity);
        });

        actionCell.appendChild(btnEdit);
        actionCell.appendChild(btnSave);
        actionCell.appendChild(btnCancel);
        actionCell.appendChild(btnDelete);
        row.appendChild(actionCell);
        
        tbody.appendChild(row);
    }
} 

async function loadStudents() {
    try {
        const response = await fetch(`${API_URL}/students`);
        if (!response.ok) {
            throw new Error(`Server replied with status ${response.status}`);
        }

        const students = await response.json();
        renderStudents(students);
    } catch (error) {
        console.error("Could not load students:", error);
        message.textContent = "Could not load students. Check the console.";
        message.style.color = "red";
    }
}

async function addStudent(newStudent) {
    try {
        const response = await fetch(`${API_URL}/students`, {
            method: "POST",
            headers: {"content-Type": "application/json"},
            body: JSON.stringify(newStudent),
        });

        if (!response.ok) {
            throw new Error(`Server replied ${response.status}`)
        }

        const saved = await response.json()

        message.textContent = `Added ${saved.name}`;
        message.style.color = "green";

        form.reset();
        await loadStudents()
    } catch (error) {
        console.error("could not add the student", error);
        message.textContent = "Could not add the student";
        message.style.color = "red";
    }
}

async function deleteStudent(id, name) {
    const sure = confirm(`Delete ${name}?`);
    if (!sure) {
        return;
    }

    try {
        const response = await fetch(`${API_URL}/students/${id}`, { method: "DELETE"});

        if (response.status === 404){
            message.textContent = `${name} not found / check server as well`;
            message.style.color = 'orange';
            await loadStudents();
            return;
        }

        if (!response.ok) {
            throw new Error(`server replied with ${response.status}`);
        }

        message.textContent = `Deleted ${name}.`
        message.style.color = "green";
        await loadStudents();
    } catch (error) {
        console.error("could not delete the student: ", error);
        message.textContent = "Could not delete the student"
        message.style.color = "red";
    }
}

// Sahi backend connection aur poora data update karne ka logic
async function editStudent(id, name, age, city) {
    try {
        const response = await fetch(`${API_URL}/students/${id}`, { 
            method: "PUT", // 'path' galat thha, isey 'PUT' ya 'PATCH' hona chahiye aapke backend ke mutabiq
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({ name: name, age: age, city: city })
        });

        if (response.status === 404){
            message.textContent = `${name} not found / check server`;
            message.style.color = 'orange';
            await loadStudents();
            return;
        }

        if (!response.ok) {
            throw new Error(`server replied with ${response.status}`);
        }

        message.textContent = `Updated student to ${name}.`
        message.style.color = "green";
        await loadStudents();
    }
    catch (error) {
        console.error(error);
        message.textContent = "Could not edit the student";
        message.style.color = "red";
    }
}

form.addEventListener("submit", (event) => {
    event.preventDefault();
    const name = document.getElementById("name").value.trim();
    const age = Number(document.getElementById("age").value);
    const city = document.getElementById("city").value.trim();

    addStudent({ name, age, city });
});

loadStudents();
