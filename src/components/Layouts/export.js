export const downloadCSV=(data,name)=> {
    const namefile  = name 
    const array = data
    const csv = 'data:text/csv;charset=utf-8,' + createCSV(array); //Creates CSV File Format
    const excel = encodeURI(csv); //Links to CSV 
  
    const link = document.createElement('a');
    link.setAttribute('href', excel); //Links to CSV File 
    link.setAttribute('download', namefile); //Filename that CSV is saved as
    link.click();
  }
function createCSV(array){
    var keys = Object.keys(array[0]); //Collects Table Headers
    var result = ''; //CSV Contents
    result += keys.join(','); //Comma Seperates Headers
    result += '\n'; //New Row
    
    array.forEach(function(item){ //Goes Through Each Array Object
      keys.forEach(function(key){//Goes Through Each Object value
        result += item[key] + ','; //Comma Seperates Each Key Value in a Row
      })
      result += '\n';//Creates New Row
    })
    return result;
  }