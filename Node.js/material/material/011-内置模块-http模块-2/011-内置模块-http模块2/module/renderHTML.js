function renderHTML(url){
    switch(url){
        case "/home":
            return `
                <html>    
                    <b>hello world</b>
                    <div>home页面</div>
                </html>    
            `

        case "/list":
            return `
                <html>    
                    <b>hello world</b>
                    <div style="font-size: 20px">list页面</div>
                </html>    
            `
        default:
            return `
                <html>    
                    <div>404 not found</div>
                </html>    
            `
    }
    
}

exports.renderHTML = renderHTML