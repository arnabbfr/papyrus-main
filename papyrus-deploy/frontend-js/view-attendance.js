document.addEventListener('DOMContentLoaded', function() {
    // DOM elements
    const attendanceTable = document.getElementById('attendanceTable');
    const summaryElement = document.getElementById('summary');
    const totalStudentsElement = document.getElementById('totalStudents');
    const avgAttendanceElement = document.getElementById('avgAttendance');
    const ncCountElement = document.getElementById('ncCount');
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    
    // Load and display attendance data
    function loadAttendanceData(filterText = '') {
        try {
            // Get data from localStorage
            const data = localStorage.getItem('papyrusAttendanceData');
            
            if (!data) {
                summaryElement.textContent = 'No attendance data found. Please mark attendance first.';
                attendanceTable.innerHTML = '';
                updateStats([], []);
                return;
            }
            
            const attendanceData = JSON.parse(data);
            
            if (!Array.isArray(attendanceData) || attendanceData.length === 0) {
                summaryElement.textContent = 'No students found in the attendance system.';
                attendanceTable.innerHTML = '';
                updateStats([], []);
                return;
            }
            
            // Apply filter if provided
            const filteredData = filterText 
                ? attendanceData.filter(student => 
                    student.name.toLowerCase().includes(filterText.toLowerCase()) ||
                    student.rollNo.toLowerCase().includes(filterText.toLowerCase()))
                : attendanceData;
            
            // Display students
            displayAttendanceData(filteredData);
            
            // Update summary and stats
            updateStats(attendanceData, filteredData);
            
        } catch (error) {
            console.error('Error loading attendance data:', error);
            summaryElement.textContent = 'Error loading attendance data. Please try again.';
            attendanceTable.innerHTML = '';
        }
    }
    
    // Display attendance data in table
    function displayAttendanceData(students) {
        attendanceTable.innerHTML = '';
        
        students.forEach(student => {
            // Calculate attendance percentage
            const totalDays = student.attendanceHistory ? student.attendanceHistory.length : 0;
            const presentDays = student.attendanceHistory ? 
                student.attendanceHistory.filter(status => status === 'Present').length : 0;
            
            const attendancePercentage = totalDays > 0 
                ? Math.round((presentDays / totalDays) * 100) 
                : 0;
            
            // Create row
            const row = document.createElement('tr');
            const isNC = attendancePercentage < 75;
            
            row.innerHTML = `
                <td>${student.name}</td>
                <td>${student.rollNo}</td>
                <td>${attendancePercentage}%</td>
                <td class="${isNC ? 'nc' : ''}">${isNC ? 'NC' : 'OK'}</td>
            `;
            
            attendanceTable.appendChild(row);
        });
    }
    
    // Update summary and statistics
    function updateStats(allStudents, filteredStudents) {
        totalStudentsElement.textContent = allStudents.length;

        // Calculate average attendance
        let totalPercentage = 0;
        let ncStudents = 0;
        
        allStudents.forEach(student => {
            const totalDays = student.attendanceHistory ? student.attendanceHistory.length : 0;
            const presentDays = student.attendanceHistory ? 
                student.attendanceHistory.filter(status => status === 'Present').length : 0;
            
            const attendancePercentage = totalDays > 0 
                ? (presentDays / totalDays) * 100 
                : 0;
            
            totalPercentage += attendancePercentage;
            
            if (attendancePercentage < 75) {
                ncStudents++;
            }
        });
        
        const averageAttendance = allStudents.length > 0 
            ? Math.round(totalPercentage / allStudents.length) 
            : 0;
        
        avgAttendanceElement.textContent = `${averageAttendance}%`;
        ncCountElement.textContent = ncStudents;
        
        // Update summary text
        if (filteredStudents.length === 0) {
            summaryElement.textContent = 'No students match your search criteria.';
        } else if (filteredStudents.length < allStudents.length) {
            summaryElement.textContent = `Showing ${filteredStudents.length} of ${allStudents.length} students.`;
        } else {
            summaryElement.textContent = `Displaying attendance for ${allStudents.length} students. Average attendance: ${averageAttendance}%.`;
        }
    }

    // Search functionality
    searchBtn.addEventListener('click', function() {
        const filterText = searchInput.value.trim();
        loadAttendanceData(filterText);
    });

    searchInput.addEventListener('keyup', function(event) {
        if (event.key === 'Enter') {
            const filterText = searchInput.value.trim();
            loadAttendanceData(filterText);
        }
    });

    // Initial load
    loadAttendanceData();
});;