// Init SpeechSynth API
const synth = window.speechSynthesis;

// DOM Elements

const textForm = document.querySelector('form');
const textInput = document.querySelector('#text-input');
const voiceSelect = document.querySelector('#voice-select');
const rate = document.querySelector('#rate');
const rateValue = document.querySelector('#rate-value');
const pitch = document.querySelector('#pitch');
const pitchValue = document.querySelector('#pitch-value');
const body = document.querySelector('body');

// Init voices array
let voices = [];

const getVoices = () => {
	voices = synth.getVoices();

	// Loop through voices and create an option for each one
	voices.forEach(voice => {
		// create option elemenr
		const option = document.createElement('option')
		// Fill option with voice and language
		option.textContent = voice.name + '('+ voice.lang +')';

		// Set needed option attributes
		option.setAttribute('data-lang', voice.lang);
		option.setAttribute('data-name', voice.name);
		voiceSelect.appendChild(option);
	});
}

getVoices();//For firefox as onvoicedchanged isnt supported there

if(synth.onvoiceschanged !== undefined){
	synth.onvoiceschanged = getVoices;
}

// Speak
const speak = () => {
	// Check if speaking
	if(synth.speaking){
		console.error('Already speaking...');
		return;
	}

	if(textInput.value !== '') {

		// Show background image
		body.style.background = '#000 url(dist/img/wave.gif)';
		body.style.backgroundRepeat = 'repeat-x';
		body.style.backgroundSize = '100% 100%';

		// Get text to speak out
		const speakText = new SpeechSynthesisUtterance(textInput.value);
		// End Speaking
		speakText.onend = e =>{
			body.style.background = '#000';

		}
		// Speak Error
		speakText.onerror = e => {
			console.error('Something went wrong');
		}
		// Grab selected voice
		const selectedVoice = voiceSelect.selectedOptions[0].getAttribute('data-name');

		// Loop through voices
		voices.forEach(voice =>{
			if(voice.name === selectedVoice){
				speakText.voice = voice;
			}
		});

		// Set pitch and rate
		speakText.rate = rate.value;
		speakText.pitch = pitch.value;

		// Speak
		synth.speak(speakText);
	}else{
		console.error('Nothing')
	}

};

// EVEN LISTENERS

// TEXT FORM SUBMIT
textForm.addEventListener('submit', e => {
	e.preventDefault();
	speak();
	textInput.blur();
});

// Rate value change
rate.addEventListener('change', e => rateValue.textContent = rate.value);

// Pitch value change
pitch.addEventListener('change', e => rateValue.textContent = pitch.value);

// Voice select activate speak
 voiceSelect.addEventListener('change', e => speak());