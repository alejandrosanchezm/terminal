import InnerCalendar from "./innerCalendar";
import Window from '../Window';

// eslint-disable-next-line react/prop-types
export default function Calendar(props) {

  return (
    <Window title={'Calendario'} {...props} style={{maxHeight: '580px'}}>
      <InnerCalendar />
    </Window>
  )
}