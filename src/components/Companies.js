const Companies = ({data}) => {
  const calculateClassName = (position, length) => {
    return position === length - 1 ? 'bold' : '';
  }
  return (
    Object.keys(data).map((key,i) => (
      <div className="company" key={`company-${i}`}>
        <div className="bold">{data[key].nimi}</div>
      <div className="column">
        {data[key].data.map((value,i) => <div className={calculateClassName(i, data[key].data.length)} key={`${value}-${i}`}>{value.toFixed(0)}</div>)}     
      </div>
      </div>

    ))
  );
};

export default Companies;
