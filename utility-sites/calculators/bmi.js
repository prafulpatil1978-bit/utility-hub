document.addEventListener('DOMContentLoaded', () => {
    const weightInput = document.getElementById('weight');
    const weightUnitSelect = document.getElementById('weightUnit');
    const heightInput = document.getElementById('height');
    const heightUnitSelect = document.getElementById('heightUnit');
    const calculateBmiBtn = document.getElementById('calculateBmiBtn');
    const bmiResultSpan = document.getElementById('bmiResult');
    const bmiCategorySpan = document.getElementById('bmiCategory');

    function calculateBMI() {
        let weight = parseFloat(weightInput.value);
        let height = parseFloat(heightInput.value);

        if (isNaN(weight) || isNaN(height) || weight <= 0 || height <= 0) {
            bmiResultSpan.textContent = 'N/A';
            bmiCategorySpan.textContent = 'Please enter valid weight and height.';
            return;
        }

        // Convert weight to kg if in lbs
        if (weightUnitSelect.value === 'lbs') {
            weight *= 0.453592; // 1 lbs = 0.453592 kg
        }

        // Convert height to meters if in inches or cm
        if (heightUnitSelect.value === 'inches') {
            height *= 0.0254; // 1 inch = 0.0254 meters
        } else if (heightUnitSelect.value === 'cm') {
            height /= 100; // 1 cm = 0.01 meters
        }

        const bmi = weight / (height * height);
        bmiResultSpan.textContent = bmi.toFixed(2);
        bmiCategorySpan.textContent = getBMICategory(bmi);
    }

    function getBMICategory(bmi) {
        if (bmi < 18.5) {
            return 'Underweight';
        } else if (bmi >= 18.5 && bmi < 24.9) {
            return 'Normal weight';
        } else if (bmi >= 25 && bmi < 29.9) {
            return 'Overweight';
        } else {
            return 'Obese';
        }
    }

    // Event Listeners
    calculateBmiBtn.addEventListener('click', calculateBMI);
    weightInput.addEventListener('input', calculateBMI);
    weightUnitSelect.addEventListener('change', calculateBMI);
    heightInput.addEventListener('input', calculateBMI);
    heightUnitSelect.addEventListener('change', calculateBMI);

    // Initial calculation
    calculateBMI();
});
