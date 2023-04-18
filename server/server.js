import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import { OpenAIApi, Configuration } from "openai";

dotenv.config()

const configuration = new Configuration({
    apiKey: process.env.OPEN_AI_API_KEY,
});

const openAi = new OpenAIApi(configuration);

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", async (req, res) => {
    res.status(200).json({data: "welcome to my server"})
});

app.post("/", async(req, res) => {
    try {
        const prompt = req.body.prompt;

        const response = await openAi.createCompletion({
            model: "text-davinci-003",
            prompt: `${prompt}`,
            temperature: 0,
            max_tokens: 2000,
            top_p: 1,
            frequency_penalty: 0.5,
            presence_penalty: 0,
        });

        res.status(200).send({
            bot: response.data.choices[0].text
        });
        
    } catch (error) {
        console.log(error);
    }
})


const PORT = process.env.PORT || 3699;
app.listen(PORT, () => console.log(`app running on port : ${PORT}`));