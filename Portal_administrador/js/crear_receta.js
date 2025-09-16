function nextSectionCR(currentSectionCR) {
    /*if (currentSectionCR === 2 && !validarSeccion()) {
        return;  esto no nos sirve por q todos son obligatorrios xd
    }*/
    
    // Resto del código para cambiar sección...
    document.getElementById(`section${currentSectionCR}`).classList.remove('active');
    document.getElementById(`section${currentSectionCR + 1}`).classList.add('active');
    updateProgressBar(currentSectionCR + 1);
}


    function prevSectionCR(currentSectionCR) {
        document.getElementById(`section${currentSectionCR}`).classList.remove('active');
        document.getElementById(`section${currentSectionCR - 1}`).classList.add('active');
        updateProgressBar(currentSectionCR - 1);
    }

    function updateProgressBar(currentStep) {
        const steps = document.querySelectorAll('.progress-step');
        steps.forEach((step, index) => {
            if (index < currentStep) {
                step.classList.add('active');
                step.classList.remove('inactive');
            } else {
                step.classList.remove('active');
                step.classList.add('inactive');
            }
        });
    }