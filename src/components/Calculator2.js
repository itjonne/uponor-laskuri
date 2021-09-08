import React, {useEffect} from 'react'
import XLSX from 'xlsx';
import laskuri from '../laskuri.xlsx';

const Calculator2 = () => {
  useEffect(() => {
    const workbook = XLSX.readFile(laskuri);
    console.log(workbook)
  }, [])
  
  return (
   <div></div> 
  )
};

export default Calculator2;
