import React, { useEffect, useState } from 'react';
import XLSX from 'xlsx';
import XLSX_CALC from 'xlsx-calc';
import _ from 'lodash';
import { useForm } from "react-hook-form";
import Inputs from './Inputs'
import Outputs from './Outputs'

const Calculator = () => {
  const [inputs, setInputs] = useState([]);
  const [outputs, setOutputs] = useState([]);
  const [workbook, setWorkbook] = useState(null);
  const { register, handleSubmit, formState: { errors } } = useForm();
  const onSubmit = data => setInputsToExcel(data);

  const setInputsToExcel = (data) => {
    if (workbook) {
      const worksheet = workbook.Sheets["Lähtötiedot"];
      for (let key of Object.keys(data)) {
        worksheet[key].v = parseFloat(data[key]);
        worksheet[key].w = data[key]
      }
      getOutputsFromExcel();
    } else {

      alert('Lisääpä exceli ni lähtee toimimaan')
    }
  }

  // https://github.com/fabiooshiro/xlsx-calc
  const getOutputsFromExcel = () => {
    // Tää ajaa kaikki funktiot
    XLSX_CALC(workbook);

    // Kopataan kaikki kilpailijat
    // Otsikko rivillä 33
    const companies = {
      vip: {label: 'F', values: 'G', data: {}},
      thermo: {label: 'I', values: 'J', data: {}},
      rauheat: {label: 'L', values: 'M', data: {}},
      calpex: {label: 'O', values: 'P', data: {}},
      terrendis: {label: 'R', values: 'S', data: {}},
      microflex: {label: 'U', values: 'V', data: {}},
      meltex: {label: 'X', values: 'Y', data: {}} 
    }

    const outputData = {
      'Lämpöhäviöt': {labels: [], companies: []},
      'Lämpöhäviökustannukset': {labels: [], companies: []},
      'Kumulatiivinen Lämpöhäviökustannus': {labels: [], companies: []},
      'Ero Ecoflex Vip Tuotteisiin': {labels: [], companies: []},
    }

    if (workbook) {
      const outputSheet = workbook.SheetNames[2];
      const worksheet = workbook.Sheets[outputSheet];
      
      // ==== Lämpöhäviöt ===== 34-36
      const lampohavioArray = _.range(34, 37);
      let lampohavioLabels = [];      
      lampohavioLabels.push("Merkki:")  
      for (let value of lampohavioArray) {
        const label = worksheet[`C${value}`].v + " " + worksheet[`D${value}`].v + ":";
        lampohavioLabels.push(label);
      }
      outputData['Lämpöhäviöt'].labels = lampohavioLabels;

      for (let company of Object.keys(companies)) {
        let yritys = {};
        const locationString = companies[company].label + '33';
        const nimi = worksheet[locationString].v;
        const data = [];
        for (let value of lampohavioArray) {
          const values = worksheet[`${companies[company].values}${value}`].v;
          
          data.push(parseInt(values));
        }
        yritys['nimi'] = nimi;
        yritys['data'] = data;
        outputData['Lämpöhäviöt'].companies.push(yritys);
        
      }

      // ==== Lämpöhäviökustannukset ==== 38-40 
      const kustannuksetArray = _.range(38, 41);
      let kustannuksetLabels = [];   
      kustannuksetLabels.push("Merkki:")     
      for (let value of kustannuksetArray) {
        const label = worksheet[`C${value}`].v + " " + worksheet[`D${value}`].v + ":";
        kustannuksetLabels.push(label);
      }
      outputData['Lämpöhäviökustannukset'].labels = kustannuksetLabels;

      for (let company of Object.keys(companies)) {
        let yritys = {};
        const locationString = companies[company].label + '33';
        const nimi = worksheet[locationString].v;
        const data = [];
        for (let value of kustannuksetArray) {
          const values = worksheet[`${companies[company].values}${value}`].v;
          data.push(parseInt(values));
        }
        yritys['nimi'] = nimi;
        yritys['data'] = data;
        outputData['Lämpöhäviökustannukset'].companies.push(yritys);
      }

      //  ===== Kumulatiiviset kustannukset =======
      const kumulatiivisetArray = _.range(43, 47);
      let kumulatiivisetLabels = [];
      kumulatiivisetLabels.push('Merkki:')        
      for (let value of kumulatiivisetArray) {
        const label = worksheet[`C${value}`].v + " " + worksheet[`D${value}`].v + ":";
        kumulatiivisetLabels.push(label);
      }
      outputData['Kumulatiivinen Lämpöhäviökustannus'].labels = kumulatiivisetLabels;

      for (let company of Object.keys(companies)) {
        let yritys = {};
        const locationString = companies[company].label + '33';
        const nimi = worksheet[locationString].v;
        const data = [];
        for (let value of kumulatiivisetArray) {
          const values = worksheet[`${companies[company].values}${value}`].v;
          data.push(parseInt(values));
        }
        yritys['nimi'] = nimi;
        yritys['data'] = data;
        outputData['Kumulatiivinen Lämpöhäviökustannus'].companies.push(yritys);
      }

      //  ===== Ero ecoflex tuotteisiin =======
      const eroArray = _.range(49, 52);
      let eroLabels = []; 
      eroLabels.push("Merkki:")       
      for (let value of eroArray) {
        const label = worksheet[`C${value}`].v + " " + worksheet[`D${value}`].v + ":";
        eroLabels.push(label);
      }
      outputData['Ero Ecoflex Vip Tuotteisiin'].labels = eroLabels;


      for (let company of Object.keys(companies)) {
        let yritys = {};
        const locationString = companies[company].label + '33';
        const nimi = worksheet[locationString].v;
        const data = [];
        for (let value of eroArray) {
          let values = 0;
          
          if (worksheet[`${companies[company].values}${value}`] === undefined) {
            values = 0;   
          }
          else {
            values = worksheet[`${companies[company].values}${value}`].v;
          }
          data.push(parseInt(values));
        }
        yritys['nimi'] = nimi;
        yritys['data'] = data;
        outputData['Ero Ecoflex Vip Tuotteisiin'].companies.push(yritys);
      }
      setOutputs(outputData);
    }
  }

  const createLocationString = (letter, number) => letter + number.toString();

  useEffect(() => {
    const readExcel = () => {
      const input = document.getElementById('input');
      input && input.addEventListener('change', handleExcelUpload, false);
    }
    const handleExcelUpload = (e) => {
      e.preventDefault();
  
      const files = e.target.files;
      const f = files[0];
      
      const reader = new FileReader();
      // Tällä avataan workbook
      reader.onload = function (e) {
          var data = e.target.result;
          let workbook = XLSX.read(data, {type: 'binary'});
          
          workbook && createInputs(workbook);
          setWorkbook(workbook);
      };
      reader.readAsBinaryString(f)
    }

    const createInputs = (workbook) => {
      var worksheet = workbook.Sheets["Lähtötiedot"];
      
      // ====== PUTKET ======
      // THERMO C/D 5-17
      const thermoArray = _.range(5, 18);
      const inputsArray = [];
      const putket = [];
  
      putket.push(<div className="otsikko">THERMO</div>);
      for (let value of thermoArray) { 
        putket.push(createInput(worksheet[createLocationString('C', value)], worksheet[createLocationString('D', value)], createLocationString('D', value)));    
      }
  
      // AQUA C/D 20-29
      const aquaArray = _.range(20, 30);
      putket.push(<div className="otsikko">AQUA</div>);
      for (let value of aquaArray) { 
        putket.push(createInput(worksheet[createLocationString('C', value)], worksheet[createLocationString('D', value)], createLocationString('D', value)));    
      }
      // Tehdään blocki
      const putketBlock = <div key="putketBlock" className="inputBlock">{putket}</div>;
      inputsArray.push(putketBlock);

      // ====== Lämpötilat ========
      // F/G 5-9
      const lampotilaArray = _.range(5,10);
      const lampotilat = [];
      lampotilat.push(<div className="otsikko">LÄMPÖTILAT</div>);
      for (let value of lampotilaArray) {
        lampotilat.push(createInput(worksheet[createLocationString('F', value)], worksheet[createLocationString('G', value)], createLocationString('G', value)));
      }
      const lampotilatBlock = <div key="lampotilatBlock" className="inputBlock">{lampotilat}</div>;
      inputsArray.push(lampotilatBlock);

      // ======= Käyttöajat =======
      // F/G 11-12
      const kayttoajatArray = _.range(11,13);
      const kayttoajat = [];
      kayttoajat.push(<div className="otsikko">KÄYTTÖAIKA (Tuntia Vuodessa)</div>);
      for (let value of kayttoajatArray) {
        kayttoajat.push(createInput(worksheet[createLocationString('F', value)], worksheet[createLocationString('G', value)], createLocationString('G', value)));
      }
      const kayttoajatBlock = <div key="kayttoajatBlock" className="inputBlock">{kayttoajat}</div>;
      inputsArray.push(kayttoajatBlock);

      // ====== Energian hinta =======
      const energianHintaArray = _.range(14,15);
      const energianHinta = [];
      energianHinta.push(<div className="otsikko">ENERGIAN HINTA (€/kWh)</div>);
      for (let value of energianHintaArray) {
        energianHinta.push(createInput(worksheet[createLocationString('F', value)], worksheet[createLocationString('G', value)], createLocationString('G', value)));
      }
      const energianHintaBlock = <div key="energianhintaBlock" className="inputBlock">{energianHinta}</div>;
      inputsArray.push(energianHintaBlock);
      setInputs(inputsArray);
    }

    const createInput = (label, value, location) => {
      const labelValue = label.v ? label.v : "undefined";
      const valueValue = value.v ? value.v : 0;
  
      return <div className="row" key={`${label}-${location}`}><label>{labelValue}</label><input defaultValue={valueValue} {...register(location, {min: 0, max: 99999})}  /></div> 
    }

    readExcel(); 
  }, [register]);

  return (
    <div className="container">
      <div className="input">
        <h1>Tiputa tähän excel</h1>
        <input id="input" type="file"></input>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Inputs inputs={inputs} />
        <input className="submit" type="submit" value="Laske"></input>
        {Object.keys(errors).length > 0 && <p className="red">Syöttövirhe</p>}
      </form>
      <Outputs outputs={outputs} />
    </div>
  );
};

export default Calculator;
