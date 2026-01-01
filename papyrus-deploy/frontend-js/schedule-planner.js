 // Shared Events Storage Module
const EventStorage = {
    // Key used in localStorage
    STORAGE_KEY: 'papyrus_events',
    
    // Get all stored events
    getEvents: function() {
        const storedEvents = localStorage.getItem(this.STORAGE_KEY);
        return storedEvents ? JSON.parse(storedEvents) : [];
    },
    
    // Save events to storage
    saveEvents: function(events) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(events));
        
        // Dispatch a custom event to notify other tabs/pages of the change
        window.dispatchEvent(new CustomEvent('papyrusEventsUpdated', {
            detail: { events }
        }));
    },
    
    // Add a new event
    addEvent: function(event) {
        const events = this.getEvents();
        // Ensure unique ID
        event.id = events.length > 0 ? Math.max(...events.map(e => e.id)) + 1 : 1;
        events.push(event);
        this.saveEvents(events);
        return event;
    },
    
    // Delete an event
    deleteEvent: function(eventId) {
        const events = this.getEvents().filter(event => event.id !== eventId);
        this.saveEvents(events);
    },
    
    // Update an existing event
    updateEvent: function(updatedEvent) {
        const events = this.getEvents();
        const index = events.findIndex(e => e.id === updatedEvent.id);
        if (index !== -1) {
            events[index] = updatedEvent;
            this.saveEvents(events);
            return true;
        }
        return false;
    }
};

// Initialize planner.html page
function initPlanner() {
    // Calendar functionality
    const calendarGrid = document.getElementById('calendarGrid');
    const monthYearElement = document.getElementById('monthYear');
    const prevMonthBtn = document.getElementById('prevMonth');
    const nextMonthBtn = document.getElementById('nextMonth');
    const todayBtn = document.getElementById('today');
    const eventForm = document.getElementById('eventForm');
    const upcomingEventsList = document.getElementById('upcomingEventsList');
    
    let currentDate = new Date();
    let currentMonth = currentDate.getMonth();
    let currentYear = currentDate.getFullYear();
    
    // Generate calendar
    function generateCalendar(month, year) {
        calendarGrid.innerHTML = '';
        
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const daysInPrevMonth = new Date(year, month, 0).getDate();
        
        monthYearElement.textContent = new Date(year, month).toLocaleString('default', { month: 'long', year: 'numeric' });
        
        // Previous month days
        for (let i = firstDay - 1; i >= 0; i--) {
            const day = daysInPrevMonth - i;
            const prevMonth = month === 0 ? 11 : month - 1;
            const prevYear = month === 0 ? year - 1 : year;
            const dateStr = `${prevYear}-${String(prevMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            
            const cell = createDateCell(day, dateStr, true);
            calendarGrid.appendChild(cell);
        }
        
        // Current month days
        const today = new Date();
        for (let i = 1; i <= daysInMonth; i++) {
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
            const isToday = i === today.getDate() && month === today.getMonth() && year === today.getFullYear();

            const cell = createDateCell(i, dateStr, false, isToday);
            calendarGrid.appendChild(cell);
        }
        
        // Next month days
        const cellsAdded = firstDay + daysInMonth;
        const cellsNeeded = Math.ceil(cellsAdded / 7) * 7;
        
        for (let i = 1; i <= cellsNeeded - cellsAdded; i++) {
            const nextMonth = month === 11 ? 0 : month + 1;
            const nextYear = month === 11 ? year + 1 : year;
            const dateStr = `${nextYear}-${String(nextMonth + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
            
            const cell = createDateCell(i, dateStr, true);
            calendarGrid.appendChild(cell);
        }
        
        renderUpcomingEvents();
    }
    
    function createDateCell(day, dateStr, otherMonth = false, isToday = false) {
        const cell = document.createElement('div');
        cell.className = `date-cell ${otherMonth ? 'other-month' : ''} ${isToday ? 'today' : ''}`;
        cell.dataset.date = dateStr;
        
        const dateNumber = document.createElement('div');
        dateNumber.className = 'date-number';
        dateNumber.textContent = day;
        cell.appendChild(dateNumber);
        
        // Add events for this date from storage
        const events = EventStorage.getEvents();
        const dateEvents = events.filter(event => event.date === dateStr);
        
        dateEvents.forEach(event => {
            const eventElement = document.createElement('div');
            eventElement.className = `event ${event.type}-event`;
            eventElement.textContent = event.title;
            eventElement.dataset.eventId = event.id;
            cell.appendChild(eventElement);
        });
        
        cell.addEventListener('click', function() {
            document.getElementById('eventDate').value = dateStr;
        });
        
        return cell;
    }
    
    function renderUpcomingEvents() {
        upcomingEventsList.innerHTML = '';
        
        // Get events from storage
        const events = EventStorage.getEvents();
        
        // Sort events by date and time
        const sortedEvents = [...events].sort((a, b) => {
            if (a.date !== b.date) return a.date.localeCompare(b.date);
            return a.time.localeCompare(b.time);
        });
        
        // Filter to show only upcoming events (from today onwards)
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const upcomingEvents = sortedEvents.filter(event => {
            const eventDate = new Date(event.date);
            return eventDate >= today;
        }).slice(0, 5); // Show only next 5 events
        
        upcomingEvents.forEach(event => {
            const eventDate = new Date(event.date);
            const eventItem = document.createElement('div');
            eventItem.className = `event-item ${event.type}`;
            
            const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            
            eventItem.innerHTML = `
                <div class="event-date">
                    <div class="event-date-number">${eventDate.getDate()}</div>
                    <div class="event-date-month">${monthNames[eventDate.getMonth()]}</div>
                </div>
                <div class="event-details">
                    <div class="event-title">${event.title}
                        <span class="event-type ${event.type}">${event.type}</span>
                    </div>
                    <div class="event-time">${formatTime(event.time)}</div>
                </div>
                <div class="event-actions">
                    <button class="action-btn edit-btn" data-id="${event.id}">✏️</button>
                    <button class="action-btn delete-btn" data-id="${event.id}">🗑️</button>
                </div>
            `;
            
            upcomingEventsList.appendChild(eventItem);
        });
        
        if (upcomingEvents.length === 0) {
            const noEvents = document.createElement('div');
            noEvents.textContent = 'No upcoming events';
            noEvents.style.padding = '10px';
            noEvents.style.textAlign = 'center';
            noEvents.style.color = '#666';
            upcomingEventsList.appendChild(noEvents);
        }
        
        // Add event listeners for edit and delete buttons
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                const eventId = parseInt(this.dataset.id);
                deleteEvent(eventId);
            });
        });
    }
    
    function formatTime(timeString) {
        const [hours, minutes] = timeString.split(':');
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const formattedHour = hour % 12 || 12;
        return `${formattedHour}:${minutes} ${ampm}`;
    }
    
    function deleteEvent(eventId) {
        if (confirm('Are you sure you want to delete this event?')) {
            EventStorage.deleteEvent(eventId);
            generateCalendar(currentMonth, currentYear);
        }
    }
    
    // Event listeners for calendar navigation
    prevMonthBtn.addEventListener('click', function() {
        currentMonth--;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        }
        generateCalendar(currentMonth, currentYear);
    });
    
    nextMonthBtn.addEventListener('click', function() {
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        generateCalendar(currentMonth, currentYear);
    });
    
    todayBtn.addEventListener('click', function() {
        const now = new Date();
        currentMonth = now.getMonth();
        currentYear = now.getFullYear();
        generateCalendar(currentMonth, currentYear);
    });
    
    // Event form submission
    eventForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const title = document.getElementById('eventTitle').value;
        const type = document.getElementById('eventType').value;
        const date = document.getElementById('eventDate').value;
        const time = document.getElementById('eventTime').value;
        const description = document.getElementById('eventDescription').value;
        
        const newEvent = {
            title,
            type,
            date,
            time,
            description
        };
        
        // Save to storage
        EventStorage.addEvent(newEvent);
        
        // Reset form
        eventForm.reset();
        
        // Update calendar
        generateCalendar(currentMonth, currentYear);
        
        alert('Event added successfully!');
    });
    
    document.getElementById('cancelBtn').addEventListener('click', function() {
        eventForm.reset();
    });
    
    // Set today's date as default in the form
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    document.getElementById('eventDate').value = `${yyyy}-${mm}-${dd}`;
    
    // Listen for storage events from other tabs/pages
    window.addEventListener('papyrusEventsUpdated', function() {
        generateCalendar(currentMonth, currentYear);
    });
    
    window.addEventListener('storage', function(e) {
        if (e.key === EventStorage.STORAGE_KEY) {
            generateCalendar(currentMonth, currentYear);
        }
    });
    
    // Initialize calendar
    generateCalendar(currentMonth, currentYear);
}

// Initialize viewer.html page
function initViewer() {
    // Calendar functionality
    const calendarGrid = document.getElementById('calendarGrid');
    const monthYearElement = document.getElementById('monthYear');
    const prevMonthBtn = document.getElementById('prevMonth');
    const nextMonthBtn = document.getElementById('nextMonth');
    const todayBtn = document.getElementById('today');
    const upcomingEventsList = document.getElementById('upcomingEventsList');
    const refreshButton = document.getElementById('refreshButton');
    const lastUpdatedElement = document.getElementById('lastUpdated');
    const eventModal = document.getElementById('eventModal');
    const closeModal = document.getElementById('closeModal');
    
    let currentDate = new Date();
    let currentMonth = currentDate.getMonth();
    let currentYear = currentDate.getFullYear();
    
    // Generate calendar
    function generateCalendar(month, year) {
        calendarGrid.innerHTML = '';
        
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const daysInPrevMonth = new Date(year, month, 0).getDate();
        
        monthYearElement.textContent = new Date(year, month).toLocaleString('default', { month: 'long', year: 'numeric' });
        
        // Previous month days
        for (let i = firstDay - 1; i >= 0; i--) {
            const day = daysInPrevMonth - i;
            const prevMonth = month === 0 ? 11 : month - 1;
            const prevYear = month === 0 ? year - 1 : year;
            const dateStr = `${prevYear}-${String(prevMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            
            const cell = createDateCell(day, dateStr, true);
            calendarGrid.appendChild(cell);
        }
        
        // Current month days
        const today = new Date();
        for (let i = 1; i <= daysInMonth; i++) {
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
            const isToday = i === today.getDate() && month === today.getMonth() && year === today.getFullYear();

            const cell = createDateCell(i, dateStr, false, isToday);
            calendarGrid.appendChild(cell);
        }
        
        // Next month days
        const cellsAdded = firstDay + daysInMonth;
        const cellsNeeded = Math.ceil(cellsAdded / 7) * 7;
        
        for (let i = 1; i <= cellsNeeded - cellsAdded; i++) {
            const nextMonth = month === 11 ? 0 : month + 1;
            const nextYear = month === 11 ? year + 1 : year;
            const dateStr = `${nextYear}-${String(nextMonth + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
            
            const cell = createDateCell(i, dateStr, true);
            calendarGrid.appendChild(cell);
        }
        
        renderUpcomingEvents();
    }
    
    function createDateCell(day, dateStr, otherMonth = false, isToday = false) {
        const cell = document.createElement('div');
        cell.className = `date-cell ${otherMonth ? 'other-month' : ''} ${isToday ? 'today' : ''}`;
        cell.dataset.date = dateStr;
        
        const dateNumber = document.createElement('div');
        dateNumber.className = 'date-number';
        dateNumber.textContent = day;
        cell.appendChild(dateNumber);
        
        // Get events from storage
        const events = EventStorage.getEvents();
        
        // Add events for this date
        const dateEvents = events.filter(event => event.date === dateStr);
        dateEvents.forEach(event => {
            const eventElement = document.createElement('div');
            eventElement.className = `event ${event.type}-event`;
            eventElement.textContent = event.title;
            eventElement.dataset.eventId = event.id;
            
            eventElement.addEventListener('click', function(e) {
                e.stopPropagation();
                showEventDetails(event.id);
            });
            
            cell.appendChild(eventElement);
        });
        
        return cell;
    }

    function showEventDetails(eventId) {
        const events = EventStorage.getEvents();
        const event = events.find(e => e.id === eventId);
        if (!event) return;
        
        // Format date for display
        const eventDate = new Date(event.date);
        const formattedDate = eventDate.toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
        
        // Set modal content
        document.getElementById('modalTitle').textContent = event.title;
        document.getElementById('modalType').textContent = event.type.charAt(0).toUpperCase() + event.type.slice(1);
        document.getElementById('modalType').className = `modal-event-type ${event.type}`;
        document.getElementById('modalDate').textContent = formattedDate;
        document.getElementById('modalTime').textContent = formatTime(event.time);
        document.getElementById('modalDescription').textContent = event.description || 'No description provided';
        
        // Show modal
        eventModal.style.display = 'flex';
    }
    
    function renderUpcomingEvents() {
        upcomingEventsList.innerHTML = '';
        
        // Get events from storage
        const events = EventStorage.getEvents();
        
        // Sort events by date and time
        const sortedEvents = [...events].sort((a, b) => {
            if (a.date !== b.date) return a.date.localeCompare(b.date);
            return a.time.localeCompare(b.time);
        });
        
        // Filter to show only upcoming events (from today onwards)
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const upcomingEvents = sortedEvents.filter(event => {
            const eventDate = new Date(event.date);
            return eventDate >= today;
        }).slice(0, 5); // Show only next 5 events
        
        upcomingEvents.forEach(event => {
            const eventDate = new Date(event.date);
            const eventItem = document.createElement('div');
            eventItem.className = `event-item ${event.type}`;
            eventItem.dataset.eventId = event.id;
            
            const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            
            eventItem.innerHTML = `
                <div class="event-date">
                    <div class="event-date-number">${eventDate.getDate()}</div>
                    <div class="event-date-month">${monthNames[eventDate.getMonth()]}</div>
                </div>
                <div class="event-details">
                    <div class="event-title">${event.title}
                        <span class="event-type ${event.type}">${event.type}</span>
                    </div>
                    <div class="event-time">${formatTime(event.time)}</div>
                </div>
            `;
            
            eventItem.addEventListener('click', function() {
                showEventDetails(event.id);
            });
            
            upcomingEventsList.appendChild(eventItem);
        });
        
        if (upcomingEvents.length === 0) {
            const noEvents = document.createElement('div');
            noEvents.textContent = 'No upcoming events';
            noEvents.style.padding = '10px';
            noEvents.style.textAlign = 'center';
            noEvents.style.color = '#666';
            upcomingEventsList.appendChild(noEvents);
        }
    }
    
    function formatTime(timeString) {
        const [hours, minutes] = timeString.split(':');
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const formattedHour = hour % 12 || 12;
        return `${formattedHour}:${minutes} ${ampm}`;
    }
    
    function updateLastUpdated() {
        const now = new Date();
        lastUpdatedElement.textContent = `Last updated: ${now.toLocaleDateString('en-US', { 
            month: 'long', 
            day: 'numeric', 
            year: 'numeric'
        })}, ${now.toLocaleTimeString('en-US', { 
            hour: 'numeric', 
            minute: '2-digit'
        })}`;
    }
    
    // Event listeners for calendar navigation
    prevMonthBtn.addEventListener('click', function() {
        currentMonth--;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        }
        generateCalendar(currentMonth, currentYear);
    });
    
    nextMonthBtn.addEventListener('click', function() {
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        generateCalendar(currentMonth, currentYear);
    });
    
    todayBtn.addEventListener('click', function() {
        const now = new Date();
        currentMonth = now.getMonth();
        currentYear = now.getFullYear();
        generateCalendar(currentMonth, currentYear);
    });
    
    // Refresh button
    refreshButton.addEventListener('click', function() {
        refreshButton.textContent = "Loading...";
        refreshButton.disabled = true;
        
        // Simulate a short delay
        setTimeout(() => {
            generateCalendar(currentMonth, currentYear);
            updateLastUpdated();
            
            refreshButton.textContent = "Refresh Events";
            refreshButton.disabled = false;
        }, 500);
    });
    
    // Close modal
    closeModal.addEventListener('click', function() {
        eventModal.style.display = 'none';
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === eventModal) {
            eventModal.style.display = 'none';
        }
    });
    
    // Listen for storage events from other tabs/pages
    window.addEventListener('papyrusEventsUpdated', function() {
        generateCalendar(currentMonth, currentYear);
        updateLastUpdated();
    });
    
    window.addEventListener('storage', function(e) {
        if (e.key === EventStorage.STORAGE_KEY) {
            generateCalendar(currentMonth, currentYear);
            updateLastUpdated();
        }
    });
    
    // Initialize calendar and last updated time
    generateCalendar(currentMonth, currentYear);
    updateLastUpdated();
}

// Initialize the page based on which HTML file we're in
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're in planner or viewer
    const isPlanner = document.querySelector('form#eventForm');
    const isViewer = document.querySelector('.view-mode-badge');
    
    if (isPlanner) {
        initPlanner();
    } else if (isViewer) {
        initViewer();
    }
});