document.addEventListener('DOMContentLoaded', () => {
    const unitAmountInput = document.getElementById('unitAmount');
    const fromUnitTypeSelect = document.getElementById('fromUnitType');
    const fromUnitSelect = document.getElementById('fromUnit');
    const toUnitSelect = document.getElementById('toUnit');
    const convertUnitBtn = document.getElementById('convertUnitBtn');
    const convertedUnitValueSpan = document.getElementById('convertedUnitValue');

    const units = {
        length: {
            meter: 1,
            kilometer: 1000,
            centimeter: 0.01,
            millimeter: 0.001,
            mile: 1609.34,
            yard: 0.9144,
            foot: 0.3048,
            inch: 0.0254
        },
        weight: {
            kilogram: 1,
            gram: 0.001,
            milligram: 0.000001,
            pound: 0.453592,
            ounce: 0.0283495
        },
        temperature: {
            celsius: { to_base: (c) => c, from_base: (c) => c },
            fahrenheit: { to_base: (f) => (f - 32) * 5/9, from_base: (c) => (c * 9/5) + 32 },
            kelvin: { to_base: (k) => k - 273.15, from_base: (c) => c + 273.15 }
        }
    };

    // Populate unit dropdowns based on selected type
    function populateUnits() {
        const selectedType = fromUnitTypeSelect.value;
        const selectedUnits = units[selectedType];

        fromUnitSelect.innerHTML = '';
        toUnitSelect.innerHTML = '';

        for (const unit in selectedUnits) {
            const option1 = document.createElement('option');
            option1.value = unit;
            option1.textContent = unit.charAt(0).toUpperCase() + unit.slice(1);
            fromUnitSelect.appendChild(option1);

            const option2 = document.createElement('option');
            option2.value = unit;
            option2.textContent = unit.charAt(0).toUpperCase() + unit.slice(1);
            toUnitSelect.appendChild(option2);
        }
        // Set default selections if possible
        if (selectedType === 'length') {
            fromUnitSelect.value = 'meter';
            toUnitSelect.value = 'kilometer';
        } else if (selectedType === 'weight') {
            fromUnitSelect.value = 'kilogram';
            toUnitSelect.value = 'pound';
        } else if (selectedType === 'temperature') {
            fromUnitSelect.value = 'celsius';
            toUnitSelect.value = 'fahrenheit';
        }
    }

    // Perform unit conversion
    function convertUnit() {
        const amount = parseFloat(unitAmountInput.value);
        const fromType = fromUnitTypeSelect.value;
        const fromUnit = fromUnitSelect.value;
        const toUnit = toUnitSelect.value;

        if (isNaN(amount) || amount <= 0) {
            convertedUnitValueSpan.textContent = 'Please enter a valid amount.';
            return;
        }

        let convertedValue;

        if (fromType === 'temperature') {
            const fromUnitObj = units.temperature[fromUnit];
            const toUnitObj = units.temperature[toUnit];

            // Convert to Celsius (base for temperature conversions)
            const amountInCelsius = fromUnitObj.to_base(amount);
            // Convert from Celsius to target unit
            convertedValue = toUnitObj.from_base(amountInCelsius);

        } else {
            const fromValueInBase = amount * units[fromType][fromUnit];
            convertedValue = fromValueInBase / units[fromType][toUnit];
        }
        convertedUnitValueSpan.textContent = convertedValue.toFixed(4);
    }

    // Event Listeners
    fromUnitTypeSelect.addEventListener('change', () => {
        populateUnits();
        convertUnit();
    });
    fromUnitSelect.addEventListener('change', convertUnit);
    toUnitSelect.addEventListener('change', convertUnit);
    unitAmountInput.addEventListener('input', convertUnit);
    convertUnitBtn.addEventListener('click', convertUnit);

    // Initial populate and conversion
    populateUnits();
    convertUnit();
});
