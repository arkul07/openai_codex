import express from 'express'
import * as dotenv from 'dotenv'
import cors from 'cors'
import { Configuration, OpenAIApi } from 'openai'
import { appendFile } from 'fs'

dotenv.config()

const configuration = new Configuration({
  apiKey: process.env.OPEN_AI_API_KEY
})

const openai = new OpenAIApi(configuration)

const app = express()

app.use(cors())
app.use(express.json())

app.get('/', async (req, res) => {
  res.status(200).send({
    message: 'Hello from Codex'
  })
})

app.post('/', async (req, res) => {
  try {
    const prompt = req.body.prompt

    const response = await openai.createChatCompletion({
      model: 'gpt-4-turbo', // or "gpt-4-turbo-16k" for a version with more context length
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: prompt }
      ],
      max_tokens: 2000, // Adjust the number of tokens as needed
      temperature: 0.7 // Adjust the temperature for more or less randomness
    })

    // Extract the response content
    const completion = response.data.choices[0].message.content
    console.log(completion)

    res.status(200).send({
      bot: response.data.choices[0].message.content
    })
  } catch (error) {
    console.log(error)
    res.status(500).send({ error })
  }
})

app.listen(4000, () => console.log('Server Started'))
