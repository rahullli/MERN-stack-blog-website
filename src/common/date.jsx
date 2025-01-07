let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export const getDate = (timestamp) =>{
    let date = new Date(timestamp);
    return `${date.getDate()} ${months[date.getMonth()]}`
}
