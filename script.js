const BASE_URL = "https://dbioz2ek0e.execute-api.ap-south-1.amazonaws.com/mockapi/get-employees";

let currentpage = 1;
let currentlimit = 10;
let currentfilter = "";
let currentfiltervalue = "";
let currentsort = "";
let currentorder = "";

const departmentFilter = document.getElementById("department-filter");
const genderFilter = document.getElementById("gender-filter");
const salarySort = document.getElementById("salary-sort");
const employeetable = document.getElementById("employee-table");
const previousbutton = document.getElementById("Previous");
const nextbutton = document.getElementById("Next");

departmentFilter.addEventListener("change", () => {
  currentfilter = "department";
  currentfiltervalue = departmentFilter.value;
  fetchEmployees();
});

genderFilter.addEventListener("change", () => {
  currentfilter = "gender";
  currentfiltervalue = genderFilter.value;
  fetchEmployees();
});

salarySort.addEventListener("change", () => {
  currentsort = "salary";
  currentorder = salarySort.value;
  fetchEmployees();
});

previousbutton.addEventListener("click", () => {
  if (currentpage > 1) {
    currentpage--;
    fetchEmployees();
  }
});

nextbutton.addEventListener("click", () => {
  currentpage++;
  fetchEmployees();
});

function fetchEmployees() {
  const url = `${BASE_URL}?page=${currentpage}&limit=${currentlimit}&filterBy=${currentfilter}&filterValue=${currentfiltervalue}&sort=${currentsort}&order=${currentorder}`;
  fetch(url)
    .then((response) => response.json())
    .then(data => {
      displayEmployees(data.data);
      updatePagination(data.pagination);
      updatePagination(data.length);
    })
    .catch(error=>console.log('Error fetching employees:', error));
        
  }

  function displayEmployees(employees) {
    employeetable.innerHTML = "";
    employees.forEach((employee) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${employee.id}</td>
        <td>${employee.name}</td>
        <td>${employee.department}</td>
        <td>${employee.gender}</td>
        <td>${employee.salary}</td>
      `;
      employeetable.appendChild(row);
    });
  }
      
function updatePagination(length) {
  const pagination = document.getElementById("pagination");
  pagination.innerHTML = "";
  const totalPages = Math.ceil(length / currentlimit);
  for (let i = 1; i <= totalPages; i++) {
    const button = document.createElement("button");
    button.textContent = i;
    button.addEventListener("click", () => {
      currentpage = i;
      fetchEmployees();
    });
    pagination.appendChild(button);
  }
}

previousbutton.disabled = isFirstPage(); // Disabled
nextbutton.disabled = isLastPage(); // Disabled

fetchEmployees();