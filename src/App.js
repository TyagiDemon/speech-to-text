import React from "react";
import SpeechRecognition, {
	useSpeechRecognition,
} from "react-speech-recognition";
import axios from "axios";
import { useState } from "react";
import { API } from "./key";

const App = () => {
	const [translated, setTranslated] = useState("");
	const {
		transcript,
		listening,
		resetTranscript,
		browserSupportsSpeechRecognition,
	} = useSpeechRecognition();

	if (!browserSupportsSpeechRecognition) {
		return <span>Browser doesn't support speech recognition.</span>;
	}

	async function convert() {
		const encodedParams = new URLSearchParams();
		encodedParams.append("q", transcript);
		encodedParams.append("target", "hi");
		encodedParams.append("source", "en");

		const options = {
			method: "POST",
			url: "https://google-translate1.p.rapidapi.com/language/translate/v2",
			headers: {
				"content-type": "application/x-www-form-urlencoded",
				"Accept-Encoding": "application/gzip",
				"X-RapidAPI-Key": API,
				"X-RapidAPI-Host": "google-translate1.p.rapidapi.com",
			},
			data: encodedParams,
		};

		await axios
			.request(options)
			.then(function (response) {
				setTranslated(response.data.data.translations[0].translatedText);
				console.log(translated);
			})
			.catch(function (error) {
				console.error(error);
			});
	}

	return (
		<div className="min-h-screen flex flex-col items-center justify-center gap-2 bg-gray-50">
			<div className="text-lg">Microphone: {listening ? "on" : "off"}</div>
			<div className="flex gap-4">
				<button
					onClick={SpeechRecognition.startListening}
					className="bg-green-700 px-4 py-2 rounded-lg text-xl font-bold text-white hover:scale-105 transition"
				>
					START
				</button>
				<button
					onClick={SpeechRecognition.stopListening}
					className="bg-red-700 px-4 py-2 rounded-lg text-xl font-bold text-white hover:scale-105 transition"
				>
					STOP
				</button>
				<button
					onClick={()=>{resetTranscript(); setTranslated("")}}
					className="bg-blue-700 px-4 py-2 rounded-lg text-xl font-bold text-white hover:scale-105 transition"
				>
					RESET
				</button>
			</div>
			<div className="font-mono">{transcript}</div>
			<button
				onClick={() => convert()}
				className="p-2 bg-purple-600 rounded-lg text-lime-100 font-semibold text-lg hover:scale-105 transition"
			>
				Convert to Hindi
			</button>
			<div>{translated}</div>
		</div>
	);
};
export default App;
