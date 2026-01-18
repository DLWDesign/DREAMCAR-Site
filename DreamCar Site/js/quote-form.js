document.addEventListener('DOMContentLoaded', () => {
    const makeSelect = document.getElementById('make');
    const modelSelect = document.getElementById('model');

    // Check if carModels is loaded and the select elements exist
    if (typeof carModels !== 'undefined' && makeSelect && modelSelect) {
        // Populate the make dropdown
        const makes = Object.keys(carModels).sort();
        for (const make of makes) {
            const option = document.createElement('option');
            option.value = make;
            option.textContent = make;
            makeSelect.appendChild(option);
        }

        // Add event listener to the make dropdown
        makeSelect.addEventListener('change', () => {
            const selectedMake = makeSelect.value;

            // Clear the model dropdown
            modelSelect.innerHTML = '<option value="" disabled selected>Seleziona Modello</option>';

            if (selectedMake && carModels[selectedMake]) {
                // Populate the model dropdown
                const models = carModels[selectedMake].sort();
                for (const model of models) {
                    const option = document.createElement('option');
                    option.value = model;
                    option.textContent = model;
                    modelSelect.appendChild(option);
                }
                // Enable the model dropdown
                modelSelect.disabled = false;
            } else {
                // Disable if no make is selected
                modelSelect.disabled = true;
            }
        });
    }

    // Populate the year dropdown
    const yearSelect = document.getElementById('year');
    if (yearSelect) {
        const currentYear = new Date().getFullYear();
        const startYear = 1960;

        for (let year = currentYear; year >= startYear; year--) {
            const option = document.createElement('option');
            option.value = year;
            option.textContent = year;
            yearSelect.appendChild(option);
        }
    }

    // Handle "Other" insurance company selection
    const insuranceCompanySelect = document.getElementById('insurance-company');
    const otherInsuranceCompanyGroup = document.getElementById('other-insurance-company-group');
    const otherInsuranceCompanyInput = document.getElementById('other-insurance-company');

    if (insuranceCompanySelect && otherInsuranceCompanyGroup && otherInsuranceCompanyInput) {
        insuranceCompanySelect.addEventListener('change', () => {
            if (insuranceCompanySelect.value === 'Altro') {
                otherInsuranceCompanyGroup.style.display = 'block';
                otherInsuranceCompanyInput.setAttribute('required', 'true');
            } else {
                otherInsuranceCompanyGroup.style.display = 'none';
                otherInsuranceCompanyInput.removeAttribute('required');
                otherInsuranceCompanyInput.value = ''; // Clear the input when hidden
            }
        });
    }

    // Handle previous accidents description
    const accidentsYesRadio = document.getElementById('accidents-yes');
    const accidentsNoRadio = document.getElementById('accidents-no');
    const previousAccidentsDescriptionGroup = document.getElementById('previous-accidents-description-group');
    const previousAccidentsDescription = document.getElementById('previous-accidents-description');

    if (accidentsYesRadio && accidentsNoRadio && previousAccidentsDescriptionGroup && previousAccidentsDescription) {
        const toggleAccidentsDescription = () => {
            if (accidentsYesRadio.checked) {
                previousAccidentsDescriptionGroup.style.display = 'block';
                previousAccidentsDescription.setAttribute('required', 'true');
            } else {
                previousAccidentsDescriptionGroup.style.display = 'none';
                previousAccidentsDescription.removeAttribute('required');
                previousAccidentsDescription.value = ''; // Clear the input when hidden
            }
        };

        accidentsYesRadio.addEventListener('change', toggleAccidentsDescription);
        accidentsNoRadio.addEventListener('change', toggleAccidentsDescription);

        // Initial check in case "Yes" is pre-selected or page is reloaded
        toggleAccidentsDescription();
    }
});