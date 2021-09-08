
import React, {useState, useEffect} from 'react';
import _ from "lodash";
import { useForm } from "react-hook-form";

import XLSX from 'xlsx';

const Laskuri = () => {
  const [workbook, setWorkbook] = useState(null);
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const onSubmit = data => console.log('data', data);

  useEffect(() => {
    const input = document.getElementById('input');
    console.log('input found', input);
    input && input.addEventListener('change', handleUpload, false);
  }, []);

  const createInput = (label, value, location) => {
    return <label>{label}<input defaultValue={value} {...register(location)}  /></label> 
  }

  const getInputs = () => {
    var second_sheet_name = workbook.SheetNames[1];
    var worksheet = workbook.Sheets[second_sheet_name];
    console.log(worksheet);
    // 5 - 18
    const thermo = _.range(5, 19);
    const aqua = _.range(20, 31);
    let inputs = [];

    for (let value of thermo) {
      const getLocation = (letter) => letter + value.toString();
      console.log(getLocation('C'));
      console.log(worksheet[getLocation('C')].v);
      inputs.push(createInput(worksheet[getLocation('C')].v, worksheet[getLocation('D')].v, getLocation('D')));    
    }

    inputs.push(<p>VÄLI</p>)

    for (let value of aqua) {
      const getLocation = (letter) => letter + value.toString();
      console.log(getLocation('C'));
      console.log(worksheet[getLocation('C')].v);
      inputs.push(createInput(worksheet[getLocation('C')].v, worksheet[getLocation('D')].v, getLocation('D')));    
    }

    console.log(thermo);
    console.log('inputs', inputs);
    return inputs;
  
  }

  const handleUpload = (e) => {
    console.log('handling');
    e.preventDefault();

    var files = e.target.files, f = files[0];
    console.log(files);
    var reader = new FileReader();
    reader.onload = function (e) {
        var data = e.target.result;
        let workbook = XLSX.read(data, {type: 'binary'});
        console.log('workbook', workbook);
        setWorkbook(workbook);
        const wsname = workbook.SheetNames[0];
        const ws = workbook.Sheets[wsname];
     
        /* Convert array to json
        const dataParse = XLSX.utils.sheet_to_json(ws, {header:1});
        console.log(dataParse);
        */
    };
    reader.readAsBinaryString(f)
}

  workbook && getInputs();

  return (
    <div>
      <input id="input" type="file"></input>
      <form onSubmit={handleSubmit(onSubmit)}>
        {workbook && getInputs()}
        <input type="submit" />
      </form>
    </div>
  )
};

export default Laskuri;
