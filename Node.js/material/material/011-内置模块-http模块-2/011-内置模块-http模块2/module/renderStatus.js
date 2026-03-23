function renderStatus(url){
    var arr = ["/home","/list"]
    return arr.includes(url) ? 200 : 404
}

module.exports = {
    renderStatus
}