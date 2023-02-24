import {useEffect, useRef, useState} from "react"
import {useRouter} from "next/router"
import {E, connect, updateState} from "/utils/state"
import "focus-visible/dist/focus-visible"
import {Button, Center, Heading, Image, Input, Text, VStack, useColorMode} from "@chakra-ui/react"
import NextHead from "next/head"

const EVENT = "wss://None-dndCharacterSite.api.pynecone.app/event"
export default function Component() {
const [state, setState] = useState({"image": "", "prompt": "", "text": "Add a prompt to generate a character!", "events": [{"name": "state.hydrate"}]})
const [result, setResult] = useState({"state": null, "events": [], "processing": false})
const router = useRouter()
const socket = useRef(null)
const { isReady } = router;
const { colorMode, toggleColorMode } = useColorMode()
const Event = events => setState({
  ...state,
  events: [...state.events, ...events],
})
useEffect(() => {
  if(!isReady) {
    return;
  }
  const reconnectSocket = () => {
    socket.current.reconnect()
  }
  if (typeof socket.current !== 'undefined') {
    if (!socket.current) {
      window.addEventListener('focus', reconnectSocket)
      connect(socket, state, setState, result, setResult, router, EVENT)
    }
  }
  const update = async () => {
    if (result.state != null) {
      setState({
        ...result.state,
        events: [...state.events, ...result.events],
      })
      setResult({
        state: null,
        events: [],
        processing: false,
      })
    }
    await updateState(state, setState, result, setResult, router, socket.current)
  }
  update()
})
return (
<Center sx={{"paddingTop": "10%"}}><VStack sx={{"width": "50%"}}><Heading sx={{"fontSize": "2em", "width": "500px", "text-align": "center"}}>{`Generate a Dungeons and Dragons Character!`}</Heading>
<Input type="text"
value={state.prompt}
placeholder="Type and press enter..."
onChange={(_e) => Event([E("state.set_prompt", {value:_e.target.value})])}
sx={{"width": "500px"}}/>
<Button onClick={() => Event([E("state.generate", {})])}
sx={{"width": "500px"}}>{`Generate`}</Button>
<Text sx={{"width": "500px", "text-align": "center", "font-size": "20px"}}>{state.text}</Text>
<Image src={state.image}
sx={{"width": "500px", "height": "auto", "borderRadius": "50px", "border": "5px solid #555", "boxShadow": "lg"}}/></VStack>
<NextHead><title>{`AI Character Generator`}</title>
<meta name="description"
content="A Pynecone app."/>
<meta property="og:image"
content="/icon.png"/></NextHead></Center>
)
}