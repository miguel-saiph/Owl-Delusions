export const calculatePositions = (init, final, quantity) => {
  let position = [];
  let value = 0;
  let space = (final - init) / (quantity - 1);
  for(let i=0; i<quantity; i++){
      if(i==0){
          value = init;
      }
      else if(i == quantity-1){
          value = final;
      }
      else {
          value = position[i-1] + space;
      }
      value = roundTo(value, 3);
      position.push(value);
  }
  return position;
}

const roundTo = (value, decimal) => {
  let factorTxt = '1';
  for (let i = 0; i<decimal; i++){
      factorTxt = factorTxt + '0';
  }
  let factor = parseInt(factorTxt, 10);
  let newValue = parseInt((value * factor), 10);
  newValue = newValue / factor;
  return newValue;
}