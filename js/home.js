import { drawChartAttemps, drawChartEvolution } from "./graph.js";
import { loginPage } from "./login.js"
import { getAttemps, simulateEvolution } from "./utils.js";

let homeHTML = `
    <div class="navbar">
        <div class="nav-title-link" >
            <a href="/"> <img src="./assets/images/logo.png" class="nav-title"> </a>
            <div class="nav-content-right">
                <span id="name"></span>
                <p id="logout">
                    <img src="./assets/images/logout.png" class="nav-title">
                </p>
            </div>    
        </div>
    </div>
    <div id="main-content">
        <div id="portfolio-header">
            <div id="portfolio-header-image-container">
                <img src="./assets/images/1311.png" class="portfolio-header-image">
               <!-- <a class="no-underline" target="_blank" href="https://opensea.io/assets/0xe0be388ab81c47b0f098d2030a1c9ef190691a8a/1311">
                    <span class="image-caption">Unemployables #1311</span>
                </a> -->
            </div>
            <div id="portfolio-header-text-container">
                <div class="header-text">
                    <span class="main-title"></span>
                    <div class="body-text">I’m a freelance designer and developer who aims to help other creatives build out their portfolios, skillset, and businesses.</div>
                </div>
                <a class="button" id="my-work-link">
                    <span class="button-text">Check out my projects</span> 
                    <image src="./assets/images/arrow-right.png" class="right-arrow-icon"/>
                </a>
            </div>
        </div>
        <div class="first-bloc">
            <div class="audit-div">
                <h1> Audits </h1>
                <div class="audit">
                </div>
            </div>    
            <div class="xp">
                <div class="xp-value"> </div>
                <div class="last-activity">
                    <span> </span>
                    <div class="border-activity">
                        <div class="activity"> </div>
                    </div>    
                </div>
            </div>
        </div>     
        <div class="second-bloc">
            <div class="skill-div">
                <h1>Best Skills </h1>
                <div class="skills">
                </div> 
            </div>
        </div>
        
        <div class="graph1">
            <h1> Nombre de tentative par exercice</h1>          
            <div id="chart_div" style="width:10%; height:300px"></div>
        </div>   
        <div class="graph2">
            <h1> Progression en fonction du temps</h1>        
            <div id="chart_div2" style="height:500px"></div>
        </div>    
    </div>
`

export function homePage(dataQuery={}){
    console.log("dataquery", dataQuery);
    let container = document.getElementById("container")
    container.style.display = "block"
    container.innerHTML = homeHTML
    
    let userInfo = dataQuery.data.user[0]
    document.getElementById("name").textContent = `${userInfo.firstName} ${userInfo.lastName}`
    document.querySelector(".main-title").textContent = `Hey, I'm @${userInfo.login}.`
    document.getElementById("my-work-link").href = `https://learn.zone01dakar.sn/git/${userInfo.login}`

    let xpValue = Math.round(dataQuery.data.xp.aggregate.sum.amount / 1000) || 0
    document.querySelector(".xp-value").innerHTML = `<p class="value-xp">${xpValue} <span class="kb">kB<span><p>`
    
    let last_activity = dataQuery.data.last_activity
    
    let activity = document.querySelector(".last-activity")
    let span = activity.querySelector("span")
    span.textContent = "Last activity"
    let divActivity = activity.querySelector(".activity")

    if(last_activity.length != 0){
        for(let val of last_activity){
            let div = document.createElement("div")
            div.classList.add("one")
            let p = document.createElement("p")
            p.textContent = `${val.object.name}  ${(val.amount/1000).toFixed(1)} kB`
            div.appendChild(p)
            divActivity.appendChild(div)
        }
    }else{
        divActivity.innerHTML = `<h1 style="color: red; text-align: center"> There are no activity </h1>`
    }
    //Pour les audits
    let auditsDiv = document.querySelector(".audit")
    let audits = userInfo.auditList
    if(audits.length != 0){
        for(let audit of audits){
            let block = document.createElement("div")
            block.classList.add("block-audit")
            let res = audit.grade
            let result = res < 1 ? "FAIL" : "PASS";

            block.innerHTML = `
                <p> <span class="project">${audit.group.object.name} — </span> <span class="captain">${audit.group.captainLogin} </span></p>
                <span class="result"> ${result} </span>
            `
            block.querySelector(".result").style.color = res < 1 ? "red" : "green"
            auditsDiv.appendChild(block)
        }
    }else{
        auditsDiv.innerHTML = `<h1 style="color: red; text-align: center"> There are no audits </h1>`
    }
    //Pour les skills
    let skillsDiv = document.querySelector(".skills")
    let skills = dataQuery.data.skills
    if (skills.length != 0){
        for(let skill of skills){
            let div = document.createElement("div")
            div.classList.add("one-skill")
            div.innerHTML = `
                <p> ${skill.type} </p>
                <span> ${skill.amount}%</span>
                <div class="align-center">
                    <div class="evolution"></div>
                    <div class="black" style="background: black">
                </div>    
            `
            div.querySelector(".evolution").style = `width:${skill.amount}%;`
            div.querySelector(".black").style = `width:${100 - skill.amount}%;`

            skillsDiv.appendChild(div)
        }
    }else{
        skillsDiv.innerHTML = `<h1 style="color: red; text-align: center"> There are no skills </h1>`
    }
    //Pour les graphes
    let attemps = getAttemps(dataQuery.data.attemps)
    drawChartAttemps(attemps)//Pour le graphique des tentatives par exercices
    
    //Pour le graphique de la progression
    let evolution = simulateEvolution(dataQuery.data.xpProgression)
    drawChartEvolution(evolution)

    document.getElementById("logout").addEventListener("click", (event) =>{
        event.preventDefault()
        localStorage.removeItem('jwtToken')
        loginPage()
    })
}

