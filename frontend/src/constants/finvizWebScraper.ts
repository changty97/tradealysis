
import axios from 'axios'
import cheerio from 'cheerio'

const finvizURL = 'https://finviz.com/quote.ashx?t=arec'

function getFinvizData(): string[] {
    let stockInfo: string[] = []
    axios(finvizURL)
    .then(response => {
        const html = response.data
        const $ = cheerio.load(html)
        // Price
        $('.table-dark-row:nth-child(11) .snapshot-td2:nth-child(12)', html).each(function(){
            const price = $(this).text()
            stockInfo.push(price)
        })
        // 52-Week High; 52-Week Low
        $('.table-dark-row:nth-child(6) .snapshot-td2:nth-child(10)', html).each(function(){
            let high = $(this).text().substr(0, $(this).text().indexOf(' '))
            stockInfo.push(high)
            let low = $(this).text().substr($(this).text().indexOf(' ') + 3)
            stockInfo.push(low)

        })
        // Volume Average
        $('.table-dark-row:nth-child(11) .snapshot-td2:nth-child(10)', html).each(function(){
            const average = $(this).text()
            stockInfo.push(average)
        })
        // Sector and Industry Name
        $('.fullview-title .fullview-links .tab-link:nth-child(2)', html).each(function(){
            const industry = $(this).text()
            stockInfo.push(industry)
        })
        // Shares Outstanding
        $('.table-dark-row:nth-child(1) .snapshot-td2:nth-child(10)', html).each(function(){
            const outstanding = $(this).text()
            stockInfo.push(outstanding)
        })
        // Shares Float
        $('.table-dark-row:nth-child(2) .snapshot-td2:nth-child(10)', html).each(function(){
            const float = $(this).text()
            stockInfo.push(float)
        })
        console.log("Finviz Data: ", stockInfo)
    }).catch(err => console.log(err));
    return stockInfo
}

export { getFinvizData };
