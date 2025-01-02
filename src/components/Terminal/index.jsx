/* eslint-disable react/prop-types */
import InnerTerminal from "./InnerTerminal";
import Window from '../Window';

export default function Terminal(props) {

  return (
    <Window title={'Terminal'} {...props} style={{backgroundColor: "#323133"}}>
      <InnerTerminal open={props.open}/>
    </Window>
  )
}