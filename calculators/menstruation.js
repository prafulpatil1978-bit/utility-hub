document.addEventListener('DOMContentLoaded', () => {
    const lastPeriodStartInput = document.getElementById('lastPeriodStart');
    const cycleLengthInput = document.getElementById('cycleLength');
    const calculateMenstruationBtn = document.getElementById('calculateMenstruationBtn');
    const nextPeriodResultSpan = document.getElementById('nextPeriodResult');
    const fertileWindowResultSpan = document.getElementById('fertileWindowResult');

    // Set max date to today
    const today = new Date();
    lastPeriodStartInput.setAttribute('max', today.toISOString().split('T')[0]);

    function calculateMenstruation() {
        const lastPeriodStartStr = lastPeriodStartInput.value;
        const cycleLength = parseInt(cycleLengthInput.value, 10);

        if (!lastPeriodStartStr || isNaN(cycleLength) || cycleLength < 20 || cycleLength > 45) {
            nextPeriodResultSpan.textContent = 'N/A';
            fertileWindowResultSpan.textContent = 'Please enter valid dates and cycle length (20-45 days).';
            return;
        }

        const lastPeriodStartDate = new Date(lastPeriodStartStr);

        // Calculate estimated next period start date
        const nextPeriodDate = new Date(lastPeriodStartDate);
        nextPeriodDate.setDate(lastPeriodStartDate.getDate() + cycleLength);
        nextPeriodResultSpan.textContent = nextPeriodDate.toDateString();

        // Calculate fertile window (typically 5 days before ovulation to 1-2 days after)
        // Ovulation is roughly 14 days before the *next* period, assuming a 28-day cycle average for calculation base
        const ovulationDate = new Date(nextPeriodDate);
        ovulationDate.setDate(nextPeriodDate.getDate() - 14);

        const fertileWindowStart = new Date(ovulationDate);
        fertileWindowStart.setDate(ovulationDate.getDate() - 5); // 5 days before ovulation

        const fertileWindowEnd = new Date(ovulationDate);
        fertileWindowEnd.setDate(ovulationDate.getDate() + 2); // 2 days after ovulation

        fertileWindowResultSpan.textContent = 
            `${fertileWindowStart.toDateString()} - ${fertileWindowEnd.toDateString()}`;
    }

    // Event Listeners
    calculateMenstruationBtn.addEventListener('click', calculateMenstruation);
    lastPeriodStartInput.addEventListener('change', calculateMenstruation);
    cycleLengthInput.addEventListener('input', calculateMenstruation);

    // Initial calculation
    calculateMenstruation();
});
