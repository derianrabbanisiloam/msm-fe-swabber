export function dateFormatter(date: any, isLocal: boolean) {
    const d = new Date(date);

    const month = new Array(12);
    month[0] = '01';
    month[1] = '02';
    month[2] = '03';
    month[3] = '04';
    month[4] = '05';
    month[5] = '06';
    month[6] = '07';
    month[7] = '08';
    month[8] = '09';
    month[9] = '10';
    month[10] = '11';
    month[11] = '12';

    let myDate = d.getDate().toString();
    myDate = myDate.length === 1 ? `0${myDate}` : myDate;
    const myMonth = month[d.getMonth()];
    const myYear = d.getFullYear();
    const fullDateFormat = isLocal ? `${myDate}-${myMonth}-${myYear}` : `${myYear}-${myMonth}-${myDate}`;

    return fullDateFormat;
}

export function localSpliter(date: any, isLocal: boolean) {
    const d = date.split('-');
    const fullDate = isLocal ? d : `${d[2]}-${d[1]}-${d[0]}`;

    return fullDate;
}

export function regionTime(timeZone = 7, data = new Date()) {
    const milisecond = new Date(data).getTime() + (timeZone * 60 * 60 * 1000);
    
    return milisecond;
  }


 export async function  printPreview(data){
    var type = 'application/pdf';
    let blob = null;
    
    const blobURL = URL.createObjectURL(pdfBlobConversion(data, 'application/pdf'));
    const theWindow = window.open(blobURL, 'targetWindow', 'toolbar=no,location=1,status=no,menubar=no,scrollbars=yes,resizable=yes,width=800,height=600');
    const theDoc = theWindow.document;
    const theScript = document.createElement('script');

    function injectThis() {
        window.print();
    }
    theScript.innerHTML = 'window.onload = ${injectThis.toString()};';
    theDoc.body.appendChild(theScript);
}


function pdfBlobConversion(b64Data, contentType) {
      contentType = contentType || '';
      var sliceSize = 512;
      b64Data = b64Data.replace(/^[^,]+,/, '');
      b64Data = b64Data.replace(/\s/g, '');
      var byteCharacters = window.atob(b64Data);
      var byteArrays = [];

      for ( var offset = 0; offset < byteCharacters.length; offset = offset + sliceSize ) {
        let slice = byteCharacters.slice(offset, offset + sliceSize);  
        let byteNumbers = new Array(slice.length);
        for (var i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i);
        }

        let byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
      }

      let blob = new Blob(byteArrays, { type: contentType });
      return blob;
    }

