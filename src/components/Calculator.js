import React, { useEffect, useState } from 'react';
import XLSX from 'xlsx';
import _ from 'lodash';
import { useForm } from "react-hook-form";
import Inputs from './Inputs'
import Outputs from './Outputs'

const Calculator = () => {
  const [inputs, setInputs] = useState([]);
  const [outputs, setOutputs] = useState([]);
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const onSubmit = data => console.log('data', data);

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
    };
    reader.readAsBinaryString(f)
  }

  const createLocationString = (letter, number) => letter + number.toString();

  const createInput = (label, value, location) => {
    const labelValue = label.v ? label.v : "undefined";
    const valueValue = value.v ? value.v : 0;

    return <label>{labelValue}<input defaultValue={valueValue} {...register(location)}  /></label> 
  }

  const createInputs = (workbook) => {
    var worksheet = workbook.Sheets["Lähtötiedot"];

    // THERMO C/D 5-17
    const thermoArray = _.range(5, 18);
    const inputsArray = [];

    inputsArray.push(<div className="otsikko">THERMO</div>);
    for (let value of thermoArray) { 
      inputsArray.push(createInput(worksheet[createLocationString('C', value)], worksheet[createLocationString('D', value)], createLocationString('D', value)));    
    }

    // AQUA C/D 20-29
    const aquaArray = _.range(20, 30);
    inputsArray.push(<div className="otsikko">AQUA</div>);
    for (let value of aquaArray) { 
      inputsArray.push(createInput(worksheet[createLocationString('C', value)], worksheet[createLocationString('D', value)], createLocationString('D', value)));    
    }

    // Lämpötilat
    inputsArray.push(<div className="otsikko">LÄMPÖTILAT</div>);
    // Käyttöaika (tuntia vuodessa)
    inputsArray.push(<div className="otsikko">KÄYTTÖAIKA (Tuntia Vuodessa)</div>);
    // Energian hinta
    inputsArray.push(<div className="otsikko">ENERGIAN HINTA (€/kWh)</div>);
    setInputs(inputsArray);
  }



  useEffect(() => {
    const readExcel = () => {
      const input = document.getElementById('input');
      input && input.addEventListener('change', handleExcelUpload, false);
    }
    readExcel(); 
  }, [handleExcelUpload]);

  return (
    <div>
      <div>
        <h1>Tiputa tähän excel</h1>
        <input id="input" type="file"></input>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Inputs inputs={inputs} />
        <input type="submit"></input>
      </form>
      <Outputs outputs={outputs} />
    </div>
  );
};

export default Calculator;
