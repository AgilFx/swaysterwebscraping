const addScholarship = async (athleteName,schoolName,sportName,year) => {
    const response = await fetch('https://swayster-app.bubbleapps.io/version-test/api/1.1/wf/add-scholarship/initialize',{
        method: "POST",
        headers:{"content-type":"application/json"},
        body:JSON.stringify({
            athleteName:athleteName,
            schoolName:schoolName,
            sportName:sportName,
            year:year
        })
    });
    const data = await response.json();
    console.log(data);
}
//addScholarship('Evan Little','University of Washington','Football',2024);

const addSigning = async (athleteName,schoolName,sportName,year) => {
    const response = await fetch('https://swayster-app.bubbleapps.io/version-test/api/1.1/wf/add-commitment/initialize',{
        method: "POST",
        headers:{"content-type":"application/json"},
        body:JSON.stringify({
            athleteName:athleteName,
            schoolName:schoolName,
            sportName:sportName,
            year:year
        })
    });
    const data = await response.json();
    console.log(data);
}

addSigning('Evan Little', 'University of Washington','Football',2024);