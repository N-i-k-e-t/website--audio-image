const canvas = document.getElementById('visualizer');
const ctx = canvas.getContext('2d');
const playButton = document.getElementById('playButton'); 
const audioInput = document.getElementById('audioFile');

const audioContext = new AudioContext();
audioContext.resume(); 

audioInput.addEventListener('change', () => {
    const file = audioInput.files[0];
    const reader = new FileReader();

    reader.onload = function(e) {
        playButton.disabled = false;

        const source = audioContext.createMediaElementSource(e.target.result);
        const analyser = audioContext.createAnalyser(); 
        source.connect(analyser);
        analyser.connect(audioContext.destination);

    analyser.fftSize = 256;  // Adjust as needed 
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    function renderFrame() {
        requestAnimationFrame(renderFrame);
        analyser.getByteFrequencyData(dataArray);

        ctx.clearRect(0, 0, canvas.width, canvas.height); 

       // Dynamic Color Mapping
        function getColor(frequencyIndex) {
            const hue = Math.round((frequencyIndex / bufferLength) * 360);  
            return `hsl(${hue}, 100%, 50%)`; 
        }

        // Smooth Animation 
        let targetRadius = 0; 

        // Visual Mapping Loop
        const barWidth = (canvas.width / bufferLength) * 2.5;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
            const barHeight = dataArray[i];

            const radius = barHeight + 20;
            targetRadius = Math.max(targetRadius, radius); 

            // Smoothly approach the target
            const radiusDecay = 0.95;
            targetRadius *= radiusDecay; 

            ctx.beginPath();
            ctx.arc(x, canvas.height / 2, targetRadius, 0, Math.PI * 2);
            ctx.fillStyle = getColor(i); // Use the dynamic color
            ctx.fill(); 

            x += barWidth + 1;
        }
    } 

    renderFrame(); 
}); 


    reader.readAsArrayBuffer(file);
    playButton.disabled = true; 
});


