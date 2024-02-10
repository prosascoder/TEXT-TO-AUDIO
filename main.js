let speech = new SpeechSynthesisUtterance();
        let voices = [];
        let voiceSelect = document.querySelector("#voice-select");
        let recordedChunks = [];

        window.speechSynthesis.onvoiceschanged = () => {
            voices = window.speechSynthesis.getVoices();
            populateVoiceList();
        }

        function populateVoiceList() {
            voices.forEach((voice, i) => {
                let option = document.createElement("option");
                option.textContent = voice.name;
                option.setAttribute("data-lang", voice.lang);
                option.setAttribute("data-name", voice.name);
                voiceSelect.appendChild(option);
            });
        }

        document.querySelector("#speak-btn").addEventListener("click", () => {
            speech.text = document.querySelector("#text-to-read").value;
            let selectedVoice = voiceSelect.selectedOptions[0].getAttribute("data-name");
            voices.forEach((voice) => {
                if (voice.name === selectedVoice) {
                    speech.voice = voice;
                }
            });
            window.speechSynthesis.speak(speech);
        });

        document.querySelector("#record-btn").addEventListener("click", () => {
            recordedChunks = [];
            navigator.mediaDevices.getUserMedia({ audio: true })
                .then(stream => {
                    let mediaRecorder = new MediaRecorder(stream);
                    mediaRecorder.ondataavailable = function (e) {
                        if (e.data.size > 0) {
                            recordedChunks.push(e.data);
                        }
                    };
                    mediaRecorder.onstop = function () {
                        let blob = new Blob(recordedChunks, { 'type': 'audio/wav' });
                        let url = URL.createObjectURL(blob);
                        document.querySelector("#download-btn").href = url;
                    };
                    mediaRecorder.start();
                    setTimeout(() => {
                        mediaRecorder.stop();
                    }, 5000); // Record for 5 seconds, adjust as needed
                });
        });
