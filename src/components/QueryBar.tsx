// promQL Query Bar
import '../styles/queryBar.css';

function QueryBar(props: any) {
    // const [status, setStatus] = useState(0);
    const handleClick = (string: string) => {
      console.log('inside button handleclick', string)
      props.setStatus(string)
      // adding active effect functionality
      
    }


    return (
      <div className="query-container">
        <div className='query-bar'>
        <img className='sub' src={require('../img/Ekkremis-sm.png')} />
            <button onClick={() => {handleClick('pending')}} className='query-btn'>Pending</button>
            <button onClick={() => {handleClick('unknown')}} className='query-btn'>Unknown</button>
            <button onClick={() => {handleClick('running')}} className='query-btn'>Running</button>
            <button onClick={() => {handleClick('failed')}} className='query-btn'>Failed</button>
            <button onClick={() => {handleClick('successful')}} className='query-btn'>Successful</button>
            <button onClick={() => {handleClick('summary')}} className='query-btn'>Summary</button>
        </div>
      </div>
    );
  }
  
  export default QueryBar;