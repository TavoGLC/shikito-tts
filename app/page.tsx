"use client"

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast"
import { useState, useEffect } from "react"

import * as tf from '@tensorflow/tfjs';

function ValidateWords(word:string){
  const characters = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','ñ','o','p','q','r','s','t','u','v','w','x','y','z','á','é','í','ó','ú']
  const wrd = word.toLocaleLowerCase()
  let newWord = ""
  for (const c of wrd){
    if (characters.includes(c)){
      newWord = newWord.concat(c)
    }
  }
  return newWord
}

function EncodeCharacter(character:string){
  const characters = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','ñ','o','p','q','r','s','t','u','v','w','x','y','z','á','é','í','ó','ú']
  const encoding = []
  for (var i = 0; i < characters.length; i++) {
    if (character === characters[i]){
      encoding.push(1)
    }
    else{
      encoding.push(0)
    }
  }
  return encoding
}

function EncodeWord(word:string){
  const encoding = []
  const paddingLength = 16-word.length
  for (const c of word){
    encoding.push(EncodeCharacter(c))
  }
  for (var i = 0; i < paddingLength; i++){
    encoding.push(EncodeCharacter(" "))
  }
  return encoding
}

function GenerateAudio(model:tf.LayersModel|null,data:string){
  let audio:any = []
  if(model!= null){
    const encodedData = EncodeWord(data)
    const ardata = tf.tensor3d([encodedData])
    const localdata = (model.predict(ardata) as tf.Tensor)
    audio = localdata.arraySync() as any
  }
  return audio[0]
}

function PlaySoundFromArray(array:any) {
  const sound = new Float32Array(array)
  const sampleRate = 44100
  const audioContext = new AudioContext({sampleRate});
  const audioBuffer = audioContext.createBuffer(1, sound.length, sampleRate);
  audioBuffer.copyToChannel(sound, 0);
  const source = audioContext.createBufferSource();
  source.connect(audioContext.destination);
  source.buffer = audioBuffer;
  source.start();
}

const sleep = (delay:number) => new Promise((resolve) => setTimeout(resolve, delay))

async function PlayAudio(model:tf.LayersModel|null,text:string){
  const formatedText = text.replaceAll('\n', ' ')
  const words = formatedText.split(" ")
  
  for (const wrd of words){
    const processedWord = ValidateWords(wrd)
    let finalWord
    if (processedWord.length>16){
      finalWord = processedWord.slice(0,16)
    }
    else{
      finalWord = processedWord
    }
    const localArray = GenerateAudio(model,finalWord)
    PlaySoundFromArray(localArray.slice(500,44100))
    await sleep(980)
  }
}

export default function Home() {

  const { toast } = useToast()

  ///const URLs = ['http://localhost:3000/shikitito-model/model.json','http://localhost:3000/shikito-model/model.json']
  const URLs = ['https://shikito-tts.vercel.app/shikitito-model/model.json','https://shikito-tts.vercel.app/shikito-model/model.json']
  
  const [modelURL, setModelURL] = useState(URLs[1])
  const [audioModel, setAudioModel] = useState<null|tf.LayersModel>(null)

  useEffect(()=>{
    const LoadModel = async () => {
      const model = await tf.loadLayersModel(modelURL);
      setAudioModel(model)
    }
    LoadModel()}
    ,[modelURL])
  
  const [text, setText] = useState("introduce el texto por favor")

  return (
    <main>
      <div className="flex flex-col h-screen justify-center items-center space-y-10">

        <div className="flex flex-col justify-center items-center">
          <p className="text-[25px]">shikito-TTS </p>
          <p className="text-[15px]">el sintetizador de voz más pequeño del mundo</p>
          <p className="text-[10px]">shikito-TTS es un modelo destilado de myshell-ai/MeloTTS-Spanish</p>
        </div>
        <div className="flex flex-col justify-center items-center space-y-2">
          <p className="text-[15px]">Selecciona el modelo </p>
          <div className="space-x-10">
            <Button 
              onClick={() => {
                setModelURL(URLs[0])
                toast({
                  variant: "destructive",
                  title: "Cargando el modelo shikitito",
                  description: "Cuidado el uso del modelo shikitito por periodos prolongados puede abrir puertas dimensionales y atraer otras entidades chungas.",
                })
              }}>
              shikititio
            </Button>
            <Button 
              onClick={() => {
                setModelURL(URLs[1])
                toast({
                  title: "Cargando el modelo shikito",
                  description: "Modelo shikito cargado",
                })
              }}>
              shikito
            </Button>
          </div>
          <p className="text-[15px]"> Recuerda que por el momento los modelos shikitos no pueden procesar números por lo que estos caracteres serán removidos. </p>
        </div>
        <div className="flex flex-col justify-center items-center w-1/2 space-y-2">
          <Textarea className="min-h-[200px]" placeholder="Introduce el texto por favor :3" value={text} onChange={e => setText(e.target.value)}></Textarea>
          <Button onClick={()=> PlayAudio(audioModel,text)}> genera el audio </Button>
        </div>
        <div className="flex flex-col justify-center items-center w-1/2 space-y-2">
        <p className="text-[15px]"> Recuerda que puedes realizar donaciones al proyecto o adquirir otros modelos de síntesis de voz a través del siguiente link. </p>
          <Link href="https://buymeacoffee.com/tavoglc" target="_blank" rel="noopener noreferrer">
            <Button title="Donate :3"> Donaciones </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
