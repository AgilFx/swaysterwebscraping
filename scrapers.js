const puppeteer = require('puppeteer');

const addScholarship = async (athleteName,schoolName,sportName,year) => {
    const response = await fetch('https://swayster-app.bubbleapps.io/version-test/api/1.1/wf/add-scholarship',{
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

const addCommitment = async (athleteName,schoolName,sportName,year) => {
    const response = await fetch('https://swayster-app.bubbleapps.io/version-test/api/1.1/wf/add-commitment',{
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


async function scrapeData(url,skipScholarshipCollection,sport,year) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);

    //const [el] = await page.$x(''); //the x path of the html element to get; we are pulling out the first item of this array with the [el] variable formatting because this would return an array
    //const txt = await el.getProperty('textContent');
    //const rawTxt = await src.jsonValue();
    //console.log(rawTxt);


    
    const evenrows = await page.$$(".evenrow");
    const oddrows = await page.$$(".oddrow");
    
    async function getData(rows) {
        for(var i=0;i<rows.length;i++) { //replace i<1 with i<rows.length, i<1 was used only to speed up testing with one iteration
            const row = rows[i];
            const schoolCol = await row.$(".school-logo");
            //console.log(row);
            const a = await schoolCol.$("a");
            //console.log(a);
            const linkTxt = await a.getProperty('href');
            const link = await linkTxt.jsonValue();
            console.log(link);
            const image = await a.$("img"); 
            console.log(image);
            if(!image && skipScholarshipCollection === false) { //if the athlete has commited there is an image of the commited school, if athlete commited we don't gather the data
                const athletePage = await browser.newPage();
                await athletePage.goto(link);
                const athleteNameContainer = await athletePage.$(".player-name");
                //console.log('The athlete name container is:');
                //console.log(athleteNameContainer);
                const athleteNameElement = await athleteNameContainer.$("h1");
                const athleteNameTxtElement = await athleteNameElement.getProperty("textContent");
                const athleteName = await athleteNameTxtElement.jsonValue();
                console.log(athleteName);
                const [schoolListContainer] = await athletePage.$$("#PlayerFiles");
                //console.log(schoolListContainer);
                const schoolRows = await schoolListContainer.$$("tr");
                console.log(schoolRows);
                for(var j=1;j<schoolRows.length;j++) { //start from row #2 beacuse row #1 is the label of the table fields, that's why j=1 instead of j=0
                    const schoolLinks = await schoolRows[j].$$("a");
                    //console.log(schoolLink[1]);
                    if(schoolLinks[1]) {
                        const schoolTextContent = await schoolLinks[1].getProperty("textContent");
                        const schoolName = await schoolTextContent.jsonValue();
                        console.log(schoolName);
                        await addScholarship(athleteName,schoolName,sport,year);
                    }
                }   
            }
            else if (image){ //an image exists in the row and we will record the commitment status
                const schoolNameElement = await schoolCol.$(".school-name");
                const schoolNameTxtElement = await schoolNameElement.getProperty("textContent");
                const schoolName = await schoolNameTxtElement.jsonValue();
                const athleteNameDiv = await row.$(".name");
                const athleteNameElement = await athleteNameDiv.$("a");
                const athleteNameTxtElement = await athleteNameElement.getProperty("textContent");
                const athleteName = await athleteNameTxtElement.jsonValue();
                await addCommitment(athleteName,schoolName,sport,year);
            }
        }
    }

    await getData(evenrows);
    await getData(oddrows);

    browser.close();
}


//do we still need to add a workflow which changes the position dropdown and goes page by page to collect the athlete data scholarship data and commitment status
//we are not importing athlete data from this site for more than just the sports of football and basketball

//const footballURL = 'http://www.espn.com/college-sports/football/recruiting/playerrankings/_/class/2024/view/position/order/true/position/athlete';
//const basketballURL = 'http://www.espn.com/college-sports/basketball/recruiting/playerrankings/_/class/2024/order/true';


scrapeData('http://www.espn.com/college-sports/basketball/recruiting/playerrankings/_/order/true',false,'Basketball',2023);

//to run this file simply enter node scrapers.js

/*
Completed list:
Basketball 2025 Athletes http://www.espn.com/college-sports/basketball/recruiting/playerrankings/_/class/2025/view/super60/sort/rank/order/true
Football 2024 Athletes http://www.espn.com/college-sports/football/recruiting/playerrankings/_/class/2024/view/position/order/true/position/athlete
Basketball 2024 Athletes http://www.espn.com/college-sports/basketball/recruiting/playerrankings/_/class/2024/order/true
Football 2023 Athletes http://www.espn.com/college-sports/football/recruiting/playerrankings/_/view/position/order/true/position/athlete
Basketball 2023 Athletes http://www.espn.com/college-sports/basketball/recruiting/playerrankings/_/order/true
*/