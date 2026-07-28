document.addEventListener('DOMContentLoaded', () => {
    const lmpInput = document.getElementById('lastMenstrualPeriod');
    const calculateDueDateBtn = document.getElementById('calculateDueDateBtn');
    const dueDateResultSpan = document.getElementById('dueDateResult');
    const currentWeekResultSpan = document.getElementById('currentWeekResult');

    // Set max date to today
    const today = new Date();
    lmpInput.setAttribute('max', today.toISOString().split('T')[0]);

    function calculateDueDate() {
        const lmpDateStr = lmpInput.value;

        if (!lmpDateStr) {
            dueDateResultSpan.textContent = 'N/A';
            currentWeekResultSpan.textContent = 'Please select your Last Menstrual Period start date.';
            return;
        }

        const lmpDate = new Date(lmpDateStr);
        const todayDate = new Date();

        // Naegele's Rule: Add 280 days (40 weeks) to LMP
        const dueDate = new Date(lmpDate);
        dueDate.setDate(lmpDate.getDate() + 280);

        dueDateResultSpan.textContent = dueDate.toDateString();

        // Calculate current week of pregnancy
        const timeDiff = todayDate.getTime() - lmpDate.getTime();
        const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
        const currentWeek = Math.floor(daysDiff / 7);

        if (currentWeek >= 0) {
            currentWeekResultSpan.textContent = `Week ${currentWeek + 1}`; // +1 to make it 1-indexed week
        } else {
            currentWeekResultSpan.textContent = 'Before pregnancy or invalid date.';
        }
    }

    // Event Listeners
    calculateDueDateBtn.addEventListener('click', calculateDueDate);
    lmpInput.addEventListener('change', calculateDueDate); // Calculate on date change

    // Initial calculation if a date is pre-filled (though unlikely for a fresh load)
    calculateDueDate();
});
