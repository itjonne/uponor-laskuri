import Companies from "./Companies";

const Outputs = ({outputs}) => {
  console.log(outputs);
  const keys = Object.keys(outputs);

  const calculateClassName = (position, length) => {
    return position === length - 1 ? 'bold' : '';
  }

  return (
    <div>
      {keys.map(key => (
        <div>
        <div className="otsikko">{key}</div>
        <div className="row">
          <div className="column">
            {outputs[key].labels.map((label,i) => <div className={calculateClassName(i, outputs[key].labels.length)} key={label}>{label}</div>)}     
          </div>
            <Companies data={outputs[key].companies} />
        </div>    
        </div>  
      ))}
    </div>
  )
  
};

export default Outputs;
