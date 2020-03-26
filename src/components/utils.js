export function isTokenValid(createAt) {
    const initialDate = createAt.getTime();
    var endDate = new Date().getTime();
    var diff = (endDate - initialDate) / (1000 * 60);
    return !(parseInt(diff) >= 150)
}