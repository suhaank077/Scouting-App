function domReady(fn) { 
    if ( 
        document.readyState === "complete" || 
        document.readyState === "interactive"
    ) { 
        setTimeout(fn, 1000); 
    } else { 
        document.addEventListener("DOMContentLoaded", fn); 
    } 
} 

let data = "";
domReady(function () { 
  
    // If found you qr code 
    function onScanSuccess(decodeText, decodeResult) { 
        // alert("You Qr is : " + decodeText, decodeResult);
        data = decodeText;
        createTable();
    } 
  
    let htmlscanner = new Html5QrcodeScanner( 
        "my-qr-reader", 
        { fps: 10, qrbos: 250 } 
    ); 
    htmlscanner.render(onScanSuccess); 
});

function parseText() {
    // Separate the text in data which is separated by a | for example "1|2|3" would mean match one, two cubes, 3 cones
    const splitData = data.split("|");
    // return the array
    return splitData;
}

function createTable() {
    // Redo with for loops
    // Create .env file to store API link
    // sketchy af rn
    document.getElementById("myTable").innerHTML = `
    <table style="font-family: arial, sans-serif; border-collapse: collapse; width: 100%;">
        <tr>
            <th style="border: 1px solid #dddddd; text-align: left; padding: 8px;">Match Number</th>
            <th style="border: 1px solid #dddddd; text-align: left; padding: 8px;">Teleop stat 1</th>
            <th style="border: 1px solid #dddddd; text-align: left; padding: 8px;">Teleop stat 2</th>
            <th style="border: 1px solid #dddddd; text-align: left; padding: 8px;">Teleop stat 3</th>
            <th style="border: 1px solid #dddddd; text-align: left; padding: 8px;">Auto stat 1</th>
            <th style="border: 1px solid #dddddd; text-align: left; padding: 8px;">Auto stat 2</th>
            <th style="border: 1px solid #dddddd; text-align: left; padding: 8px;">Auto stat 3</th>
        </tr>
        <tr>
            <td style="border: 1px solid #dddddd; text-align: left; padding: 8px;">`+ parseText()[0]+ `</td>
            <td style="border: 1px solid #dddddd; text-align: left; padding: 8px;">`+ parseText()[1]+ `</td>
            <td style="border: 1px solid #dddddd; text-align: left; padding: 8px;">`+ parseText()[2]+ `</td>
            <td style="border: 1px solid #dddddd; text-align: left; padding: 8px;">`+ parseText()[3]+ `</td>
            <td style="border: 1px solid #dddddd; text-align: left; padding: 8px;">`+ parseText()[4]+ `</td>
            <td style="border: 1px solid #dddddd; text-align: left; padding: 8px;">`+ parseText()[5]+ `</td>
            <td style="border: 1px solid #dddddd; text-align: left; padding: 8px;">`+ parseText()[6]+ `</td>
        </tr>
    </table>

    <form method="POST" action="https://script.google.com/macros/s/AKfycbyuop7CV1OKZhyZ-m1nqhgLdCMDOwluWWRIsVWVCMKKqxSE4YdOq8pYmuqC0efHHzkwPw/exec">
        <input type="hidden" name="Match Number" value="`+ parseText()[0]+ `">
        <input type="hidden" name="Teleop stat 1" value="`+ parseText()[1]+ `">
        <input type="hidden" name="Teleop stat 2" value="`+ parseText()[2]+ `">
        <input type="hidden" name="Teleop stat 3" value="`+ parseText()[3]+ `">
        <input type="hidden" name="Auto stat 1" value="`+ parseText()[4]+ `">
        <input type="hidden" name="Auto stat 2" value="`+ parseText()[5]+ `">
        <input type="hidden" name="Auto stat 3" value="`+ parseText()[6]+ `">
        <button type="submit">Send to Spreadsheet</button>
    </form>
  ;`
}