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
    const splitData = parseText();

    document.getElementById("myTable").innerHTML = `
        <table style="font-family: arial, sans-serif; border-collapse: collapse; width: 100%;">
            <tr>
                <th style="border: 1px solid #dddddd; text-align: left; padding: 8px;">Match Number</th>
                <th style="border: 1px solid #dddddd; text-align: left; padding: 8px;">Team Number</th>
                <th style="border: 1px solid #dddddd; text-align: left; padding: 8px;">Autonomous Actions</th>
                <th style="border: 1px solid #dddddd; text-align: left; padding: 8px;">Teleop Actions</th>
                <th style="border: 1px solid #dddddd; text-align: left; padding: 8px;">Endgame Actions</th>
                <th style="border: 1px solid #dddddd; text-align: left; padding: 8px;">Overall Performance</th>
            </tr>
            <tr>
                <td style="border: 1px solid #dddddd; text-align: left; padding: 8px;">${splitData[0]}</td>
                <td style="border: 1px solid #dddddd; text-align: left; padding: 8px;">${splitData[1]}</td>
                <td style="border: 1px solid #dddddd; text-align: left; padding: 8px;">${splitData[2]} (AutoLeave), ${splitData[3]} (Coral), ${splitData[4]} (Algae)</td>
                <td style="border: 1px solid #dddddd; text-align: left; padding: 8px;">${splitData[5]} (Coral Scored), ${splitData[6]} (Processor Interaction)</td>
                <td style="border: 1px solid #dddddd; text-align: left; padding: 8px;">${splitData[7]} (Cage Attach), ${splitData[8]} (Barge Parking)</td>
                <td style="border: 1px solid #dddddd; text-align: left; padding: 8px;">${splitData[9]} (Overall Performance)</td>
            </tr>
        </table>
    `;

    // Send data to Google Sheets
    submitDataToGoogleSheets(splitData);
}

function submitDataToGoogleSheets(splitData) {
    const formData = new FormData();
    formData.append('Match Number', splitData[0]);
    formData.append('Team Number', splitData[1]);
    formData.append('Autonomous Actions', `${splitData[2]} (AutoLeave), ${splitData[3]} (Coral Scored), ${splitData[4]} (Algae Dislodged), ${splitData[5]} (Auto Ranking Point)`);
    formData.append('Teleop Actions', `${splitData[6]} (Coral Scored), ${splitData[7]} (Processor Interaction), ${splitData[8]} (Algae Scored in Processor), ${splitData[9]} (Coral Collection Effectiveness)`);
    formData.append('Endgame Actions', `${splitData[10]} (Which Cage), ${splitData[11]} (Cage Parking), ${splitData[12]} (Barge Parking)`);
    formData.append('Overall Performance', $splitData[13]);

    // Submit the form data to the Google Sheets script
    fetch('https://script.google.com/macros/s/AKfycbyuop7CV1OKZhyZ-m1nqhgLdCMDOwluWWRIsVWVCMKKqxSE4YdOq8pYmuqC0efHHzkwPw/exec', {
        method: 'POST',
        body: formData
    }).then(response => response.json())
    .then(data => {
        console.log('Form submitted successfully:', data);
    }).catch(error => {
        console.error('Error submitting form:', error);
    });
}
