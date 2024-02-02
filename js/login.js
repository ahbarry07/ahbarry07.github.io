import { homePage } from "./home.js"
import { graphqlQuery } from "./query.js"

export function loginPage(){

    let container = document.getElementById("container")
    container.style = ` display: flex; align-content: center; align-items: center; justify-content:center; padding: 0 50px; height: 100vh; padding-top: 20px;`

    container.innerHTML = `
        <div class="login">
            <p id="alert"> </p>
            <div class="z01">
                <div class="form">
                    <form action="" method="post">
                        <div class="name">
                            <label for="">Email or Username</label>
                            <input type="text" name="email" id="email" required>
                        </div>
                        <div class="password">
                            <label for="">Password</label>
                            <input type="password" name="password" id="password" required>
                        </div>
                        <button id="signIn">SIGN IN</button>
                    </form>
                </div>
            </div>    
        </div>    
    `

    document.getElementById("signIn").addEventListener("click", (event) =>{
        event.preventDefault()
    
        const email = document.getElementById("email").value
        const passWord = document.getElementById("password").value
        
        let credentials = `${email}:${passWord}`
        let encodedCredentials = btoa(credentials)
        
        fetch("https://learn.zone01dakar.sn/api/auth/signin", {
            method: 'POST',
            headers:{
                'Authorization': `Basic ${encodedCredentials}`
            },
        }).then(response =>{
            if (response.status == 200){
                response.json().then(data =>{
                    let jwtToken = data
                    saveJwtToLocalStorage(jwtToken) //Sauvegarder le token dans le local Storage
                   
                    let result = fetchGraphQLData(jwtToken, graphqlQuery)
                    result.then(dataQuery =>{
                        homePage(dataQuery)
                    })
                })
            }else{
                response.json().then(data => {
                    document.getElementById("alert").textContent = data.error
                })
            }
        })
    })
}

export async function fetchGraphQLData (jwtToken, graphqlQuery) {
   
    const response = await fetch('https://learn.zone01dakar.sn/api/graphql-engine/v1/graphql', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwtToken}`
        },
        body: JSON.stringify({ query: graphqlQuery })
    });
  
    if (response.status == 200) {
        const data = await response.json();
        return data;
    } else {
        throw new Error('Erreur lors de la requête GraphQL');
    }
};

const saveJwtToLocalStorage = (jwtToken) => {
    localStorage.setItem('jwtToken', jwtToken);
};