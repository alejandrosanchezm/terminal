/* eslint-disable react/prop-types */
import InnerTerminal from "./InnerTerminal";
import Window from '../Window';
import { useEffect } from "react";
// 

const LOCAL_STORAGE_TERMINAL_KEY = "LOCAL_STORAGE_TERMINAL_KEY";

export default function Terminal(props) {

  useEffect(() => {
    localStorage.removeItem(LOCAL_STORAGE_TERMINAL_KEY)
  }, [])

  return (
    <Window title={'Terminal'} {...props} style={{backgroundColor: "#323133"}}>
      <InnerTerminal />
    </Window>
  )
}