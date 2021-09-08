import Calculator from './components/Calculator';
import Calculator2 from './components/Calculator2';

function App() {
  return (
    <div className="container">
      <img alt="logo" src="https://www.uponor.fi/-/media/uponor-internet/logos/uponor-logo.svg?la=fi-FI&hash=AACF752265B07BFE259A4FAD36EA34174B922D21"></img>
      <h1>Lämpöhävikkilaskuri</h1>
      <p>Excel-taulukko täytyy tässä versiossa vielä lisätä käsin, tulevaisuudessa voidaan ladata palvelimelta.</p>
      <Calculator />
    </div>
  );
}

export default App;
