import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured, please follow instructions in README.md",
      }
    });
    return;
  }

  const userPrompt = req.body.prompt;

  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: generatePrompt(userPrompt),
      max_tokens: 100,
      temperature: 0.6,
    });
    res.status(200).json({ result: completion.data.choices[0].text });
  } catch(error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        }
      });
    }
  }
}

function generatePrompt(userPrompt) {
  console.log(userPrompt)
  return `Actua como un medico de triage, interroga los sintomas de los pacientes e indicales si su padecimiento puede esperar en casa o deben ir a urgencias.

Ejemplo:
Paciente: Tengo dolor de cabeza.
Medico: ¿Qué tan fuerte es el dolor del 1 al 10?
Paciente: 1
Medico: ¿Estas embarazada?
Paciente: No
Medico: Puede esperar en casa. Si el dolor aumenta, persiste o inicia con fiebre, vaya a urgencias.

Inicia a continuación:
Paciente: ${userPrompt}
Medico: `;
}
