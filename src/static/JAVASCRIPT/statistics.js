function download_csv(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);
  
    element.style.display = 'none';
    document.body.appendChild(element);
  
    element.click();
  
    document.body.removeChild(element);
  }
  function download_svg(uri, name) {
    var link = document.createElement("a");
    link.download = name;
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    delete link;
  }
async function sendHorror() {

    const year1 = document.getElementById('year1Horror').value
    const year2 = document.getElementById('year2Horror').value
    const type = document.getElementById('typeHorror').value
    var xArray;
    var yArray;

    console.log("[sendHorror] year1 =", year1, " year2 =", year2, "type =", type)
    const url = 'http://localhost:5500/statistics/horror'
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            year1,
            year2,
            type
        }),
    }).then(response => {

        if (!response.ok) {
            throw new Error('Incorrect URL: The URL is incorrect and the server returned a ' + response.status + ' status');
          } else {
            return response.json();
        }
    }).then(json => {
        xArray = json[0]
        yArray = json[1]
        var data = [{
            x: xArray,
            y: yArray,
            type: "bar"  }];
            var layout = {title:"Evolution of horror movie length"};
      
      Plotly.newPlot("myPlotHorror", data, layout);
    }).catch(err => {
        console.log(err)
      })
     
}
async function exportHorror(){
    
    const year1 = document.getElementById('year1Horror').value
    const year2 = document.getElementById('year2Horror').value
    const type = document.getElementById('typeHorror').value
    var xArray;
    var yArray;

    console.log("[sendHorror] year1 =", year1, " year2 =", year2, "type =", type)
    const url = 'http://localhost:5500/statistics/horror'
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            year1,
            year2,
            type
        }),
    }).then(response => {

        if (!response.ok) {
            throw new Error('Incorrect URL: The URL is incorrect and the server returned a ' + response.status + ' status');
          } else {
            return response.json();
        }
    }).then(json => {
        if(type == 'csv'){
            let xArray = json[0]
            let yArray = json[1]
            const rows = []
            let n = xArray.length
            for(let i = 0; i < n; i++){
                rows.push([xArray[i],  yArray[i]])
            }
            let csvContent = "";
            rows.forEach(function(rowArray) {
            let row = rowArray.join(",");
            csvContent += row + "\r\n";
            })
            let name ="horror".concat(xArray[0]).concat("_").concat(xArray[n-1]).concat(".csv")
            console.log("Downloading",name)
            download_csv(name, csvContent)
        }
        else if(type == 'webp'){
            xArray = json[0]
            yArray = json[1]
            let n = xArray.length
            var data = [{
                x: xArray,
                y: yArray,
                type: "bar"  }];
                var layout = {title:"Evolution of horror movie length"};
          let img_svg
          Plotly.newPlot("myPlotHorror", data, layout).then(
            function(gd){
              Plotly.toImage(gd,{format:'webp', height:1000, width:1000})
                 .then(
                     function(url){
                        //console.log(url)
                        download_svg(url, "horror".concat(xArray[0]).concat("_").concat(xArray[n-1]).concat(".webp"))
                    }
                )
            }
        );
        }
        else if(type == 'svg'){
            xArray = json[0]
            yArray = json[1]
            let n = xArray.length
            var data = [{
                x: xArray,
                y: yArray,
                type: "bar"  }];
                var layout = {title:"Evolution of horror movie length"};
          let img_svg
          Plotly.newPlot("myPlotHorror", data, layout).then(
            function(gd){
              Plotly.toImage(gd,{format:'svg', height:1000, width:1000})
                 .then(
                     function(url){
                        //console.log(url)
                        download_svg(url, "horror".concat(xArray[0]).concat("_").concat(xArray[n-1]).concat(".svg"))
                    }
                )
            }
        );
    }
    }).catch(err => {
        console.log(err)
      })
}
async function sendTop10() {

    const category = document.getElementById('category').value
    const type = document.getElementById('typeTop10').value

    console.log("[sendTop10] category =", category, "type =", type)
    const url = 'http://localhost:5500/statistics/top10'
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            category,
            type
        }),
    }).then(response => {

        if (!response.ok) {
            throw new Error('Incorrect URL: The URL is incorrect and the server returned a ' + response.status + ' status');
          } else {
            return response.json();
        }
    }).then(json => {
        xArray = json[0]
        yArray = json[1]
        var data = [{
            y: xArray, // aici le-am inversat sa arate mai ok
            x: yArray,
            type: "bar",
            orientation: "h"  }];
            var layout = {title:"Top 10 directors"};
      
      Plotly.newPlot("myPlotTop10", data, layout);
    }).catch(err => {
        console.log(err)
      })
}
async function exportTop10(){
    
    const category = document.getElementById('category').value
    const type = document.getElementById('typeTop10').value

    console.log("[sendTop10] category =", category, "type =", type)
    const url = 'http://localhost:5500/statistics/top10'
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            category,
            type
        }),
    }).then(response => {

        if (!response.ok) {
            throw new Error('Incorrect URL: The URL is incorrect and the server returned a ' + response.status + ' status');
          } else {
            return response.json();
        }
    }).then(json => {
        if(type == 'csv'){
            let xArray = json[0]
            let yArray = json[1]
            const rows = []
            let n = xArray.length
            for(let i = 0; i < n; i++){
                rows.push([xArray[i],  yArray[i]])
            }
            let csvContent = "";
            rows.forEach(function(rowArray) {
            let row = rowArray.join(",");
            csvContent += row + "\r\n";
            })
            let name ="Top_10_Directors".concat("_").concat(category.replaceAll(" ", "_")).concat(".csv")
            console.log("Downloading",name)
            download_csv(name, csvContent)
        }
        else if(type == 'webp'){
            xArray = json[0]
            yArray = json[1]
            var data = [{
                y: xArray, // aici le-am inversat sa arate mai ok
                x: yArray,
                type: "bar",
                orientation: "h"  }];
                var layout = {title:"Top 10 directors"};
          
          Plotly.newPlot("myPlotTop10", data, layout).then(
            function(gd){
              Plotly.toImage(gd,{format:'webp', height:1000, width:1000})
                 .then(
                     function(url){
                        //console.log(url)
                        download_svg(url, "Top_10_Directors".concat("_").concat(category.replaceAll(" ", "_")).concat(".webp"))
                    }
                )
            }
        );
        }
        else if(type == 'svg'){
            xArray = json[0]
            yArray = json[1]
            var data = [{
                y: xArray, // aici le-am inversat sa arate mai ok
                x: yArray,
                type: "bar",
                orientation: "h"  }];
                var layout = {title:"Top 10 directors"};
          
          Plotly.newPlot("myPlotTop10", data, layout).then(
            function(gd){
              Plotly.toImage(gd,{format:'svg', height:1000, width:1000})
                 .then(
                     function(url){
                        //console.log(url)
                        download_svg(url, "Top_10_Directors".concat("_").concat(category.replaceAll(" ", "_")).concat(".svg"))
                    }
                )
            }
        );
        }
    }).catch(err => {
        console.log(err)
      })
}
async function sendHowMany() {

    const genre = document.getElementById('genre').value
    const type = document.getElementById('typeTop10').value
    const year = document.getElementById('yearHowMany').value

    console.log("[sendHowMany] genre =", genre,"year =",year, "type =", type)
    const url = 'http://localhost:5500/statistics/howmany'
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            genre,
            year,
            type
        }),
    }).then(response => {

        if (!response.ok) {
            throw new Error('Incorrect URL: The URL is incorrect and the server returned a ' + response.status + ' status');
          } else {
            return response.json();
        }
    }).then(json => {
        xArray = json[0]
        yArray = json[1]
        var data = [{
            x: xArray,
            y: yArray,
            type: "bar"  }];
            var layout = {title:"Netflix vs Disney | ".concat(genre)};
      
      Plotly.newPlot("myPlotHowMany", data, layout);
    }).catch(err => {
        console.log(err)
      })
}
async function exportHowMany(){
    const genre = document.getElementById('genre').value
    const type = document.getElementById('typeTop10').value
    const year = document.getElementById('yearHowMany').value

    console.log("[sendHowMany] genre =", genre,"year =",year, "type =", type)
    const url = 'http://localhost:5500/statistics/howmany'
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            genre,
            year,
            type
        }),
    }).then(response => {

        if (!response.ok) {
            throw new Error('Incorrect URL: The URL is incorrect and the server returned a ' + response.status + ' status');
          } else {
            return response.json();
        }
    }).then(json => {
        if(type == 'csv'){
            let xArray = json[0]
            let yArray = json[1]
            const rows = []
            let n = xArray.length
            for(let i = 0; i < n; i++){
                rows.push([xArray[i],  yArray[i]])
            }
            let csvContent = "";
            rows.forEach(function(rowArray) {
            let row = rowArray.join(",");
            csvContent += row + "\r\n";
            })
            let name ="Netflix_vs_Disney".concat("_").concat(genre).concat(".csv")
            console.log("Downloading",name)
            download_csv(name, csvContent)
        }
        else if(type == 'webp'){
            xArray = json[0]
            yArray = json[1]
            var data = [{
                x: xArray,
                y: yArray,
                type: "bar"  }];
                var layout = {title:"Netflix vs Disney | ".concat(genre)};
          
          Plotly.newPlot("myPlotHowMany", data, layout).then(
            function(gd){
              Plotly.toImage(gd,{format:'webp', height:1000, width:1000})
                 .then(
                     function(url){
                        //console.log(url)
                        download_svg(url, "Netflix_vs_Disney".concat("_").concat(genre).concat(".webp"))
                    }
                )
            }
        );
        }
        else if(type == 'svg'){
            xArray = json[0]
        yArray = json[1]
        var data = [{
            x: xArray,
            y: yArray,
            type: "bar"  }];
            var layout = {title:"Netflix vs Disney | ".concat(genre)};
      
      Plotly.newPlot("myPlotHowMany", data, layout).then(
        function(gd){
          Plotly.toImage(gd,{format:'svg', height:1000, width:1000})
             .then(
                 function(url){
                    //console.log(url)
                    download_svg(url, "Netflix_vs_Disney".concat("_").concat(genre).concat(".svg"))
                }
            )
        }
    );
        }
    }).catch(err => {
        console.log(err)
      })
}