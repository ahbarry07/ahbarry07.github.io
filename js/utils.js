
export function getAttemps(attempts) {
    // Créer un dictionnaire pour stocker les objets en fonction de leur nom
    const objDict = {};
    
    // Remplir le dictionnaire
    attempts.forEach(attempt => {
        const name = attempt.object.name;
        const count = attempt.object.progresses_aggregate.aggregate.count;
        // Si l'objet avec ce nom n'existe pas encore, l'initialiser
        if (!objDict[name]) {
            objDict[name] = { name: name, count: count };
        } else {
            // Sinon, si le count est plus grand, le mettre à jour
            if (count > objDict[name].count) {
                objDict[name].count = count;
            }
        }
    });
    
    // Convertir le dictionnaire en tableau d'objets
    const sortedResults = Object.values(objDict);
    
    // Trier le tableau par ordre décroissant du count
    sortedResults.sort((a, b) => b.count - a.count);
    
    const attemps_20 = sortedResults.slice(0, 20)
    return attemps_20;
}
export function simulateEvolution(xpByProject) {
    // Trier les objets par date de création
    xpByProject.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    
    const evolution = {};
    let totalAmount = 0;
    
    xpByProject.forEach(entry => {
        const date = formatDate(entry.createdAt); // Convertir et formater la date
        totalAmount += entry.amount;
        evolution[date] = {date: date, kb: Math.round(totalAmount/1000)}; // Stocker le montant cumulé pour cette date
    });

    // console.log("TEST", fillMissingMonths(evolution));
    
    return Object.values((evolution));
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    return `${month} ${year}`;
}
