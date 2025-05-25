const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logout");
const generatePDFBtn = document.getElementById("generatePDF");
const loginForm = document.getElementById("loginForm");

const loginTimeText = document.getElementById("loginTime");
const hoursWorkedText = document.getElementById("hoursWorked");

let isLoggedIn = false;
let loginTime = null;
let interval;
let chart;
let chartData = [0, 0, 0, 0, 0, 0, 0]; // Mon-Sun

function updateChart() {
  const today = new Date().getDay();
  chartData[today === 0 ? 6 : today - 1] = parseFloat(hoursWorkedText.textContent.split(": ")[1]);
  chart.data.datasets[0].data = chartData;
  chart.update();
}

loginBtn.onclick = () => {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  if (email && password) {
    isLoggedIn = true;
    loginTime = new Date();
    loginTimeText.textContent = `Login Time: ${loginTime.toLocaleTimeString()}`;
    loginForm.style.display = "none";
    alert("Login successful and attendance marked!");

    interval = setInterval(() => {
      const now = new Date();
      const diff = (now - loginTime) / (1000 * 60 * 60);
      const hours = diff.toFixed(2);
      hoursWorkedText.textContent = `Hours Worked: ${hours}`;
      updateChart();
    }, 60000);
  } else {
    alert("Please enter both email and password.");
  }
};

logoutBtn.onclick = () => {
  clearInterval(interval);
  isLoggedIn = false;
  loginTime = null;
  hoursWorkedText.textContent = "Hours Worked: 0";
  loginTimeText.textContent = "Login Time: --";
  loginForm.style.display = "block";
  alert("Logged out successfully.");
};

generatePDFBtn.onclick = () => {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  doc.text("Attendance Report", 10, 10);
  doc.text(`Login Time: ${loginTime ? loginTime.toString() : "N/A"}`, 10, 20);
  doc.text(hoursWorkedText.textContent, 10, 30);
  doc.save("attendance_report.pdf");
};

// Chart Initialization
const ctx = document.getElementById("barChart").getContext("2d");
chart = new Chart(ctx, {
  type: "bar",
  data: {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [{
      label: "Hours Worked",
      data: chartData,
      backgroundColor: "#60A5FA"
    }]
  },
  options: {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true
      }
    }
  }
});
