import '../styles/chartsModal.css';

type ChartProps = {
  show: boolean,
  toggleChartsModal: () => void;
}

const ChartsModal = (props: ChartProps) => {

  const showModalClassName = props.show ? "modal display-block" : "modal display-none";

  return (
    <div className={showModalClassName}>
      <section className="modal-main">
        <img src={require('../img/charts.png')} alt="charts" className="chartImage" />
        <button type="button" onClick={props.toggleChartsModal}>
          Close
        </button>
      </section>
    </div>
  )
}


export default ChartsModal;