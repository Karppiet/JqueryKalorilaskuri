function checkForm2() {
    // estetään lomakkeen uudelleenlataus
    event.preventDefault();
    // alustetaan x
    let x = true;
    // asetetaan muuttujaan oikea kenttä
    let day = $("#day");
    let meal = $("#eating");
    let kcal = $("#kcal");
    let cErr = $("#calErr");
    let dErr = $("#dayErr");
    let mErr = $("#mealErr");

    console.log(day.val())
    // tsekataan että päivä on valittu, lisätään virheilmoitus jos näin ei ole
    let chosenDay = day.val();
    if (!chosenDay) {
      console.log("Päivä pitää olla valittuna");
  
      day.css("outline","3px solid red");
      dErr.html(`<p style="color:red">Päivä pitää olla valittuna</p>`);
      x = false;
    } else {
      // tyhjennetään virheilmoitukset
      day.css("outline","");
      dErr.html("");
    }
    // tsekataan että ateria valittu
    let chosenMeal = meal.val();
    if (!chosenMeal) {
      console.log("Ateria pitää olla valittuna");
  
      meal.css("outline","3px solid red");
      mErr.html(`<p style="color:red">Ateria pitää olla valittuna</p>`);
      x = false;
    } else {
      //tyhjennetään virheilmoitukset
      meal.css("outline","");
      mErr.html("");
    }
  
    // tsekataan syötetty määärä kaloreita ja muutetaan x falseksi jos luvut eivät täsmää
    if (kcal.val() < 1 || kcal.val() > 3000 || isNaN(kcal.val()) == true) {
      kcal.css("outline","3px solid red");
      cErr.html(`<p style="color:red">Kalorit pitää olla väliltä 1-3000 kcal</p>`);
      x = false;
    } else {
      // tyhjennetään virheilmoitukset
      kcal.css("outline","")
      cErr.html("");
    }
  
    // jos x jää true arvolle ajetaan calculateIntake funktio sekä tyhjennetään virheilmoitukset
    if (x == true) {
      calculateIntake();
  
      // day.style.outline = "";
      // meal.style.outline = "";
      // kcal.style.border = "";
        kcal.val() === "";
      
      // dErr.innerHTML = "";
      // mErr.innerHTML = "";
      // cErr.innerHTML = "";
      
    } else {
      console.log("täytä oikeat arvot");
    }
  }
  
  function calculateIntake() {
    // estetään lomakkeen uudelleenlataus
    event.preventDefault();
    // haetaan arvot
    let weekday = $("#day").val();
    let eat = $("#eating").val();
    let cal = $("#kcal").val();
    // logataan arvoja
    console.log(weekday, eat, cal);
    // luodaan objekti
    let dataObject = { day: weekday, eating: eat, calories: cal };
    // laitetaan muuttujaan storedData energyLog JSON objektin haku local storagesta, tai luodaan sellainen
    // jos ei sellaista ole, sekä parsetaan
    // energyLog javascript objektiksi
    let storedData = JSON.parse(localStorage.getItem("energyLog")) || [];
  
    // liitetään storedDataan listan sisälle dataObjectin sisältö loppuun
    storedData.push(dataObject);
  
    // asetetaan energyLog nimeksi Json objektille ja muutetaan storedData stringiksi ja laitetaan objekti local storageen
    localStorage.setItem("energyLog", JSON.stringify(storedData));
  
    // Katsotaan että storedData ei ole tyhjä
    if (storedData !== null) {
      createTable();
     
    }
  
    for (let i = 0; i < storedData.length; i++) {
      console.log(storedData[i].day);
    }
  
  
  
    energySum();
  }
  
  function deleteDataEntry() {
    event.preventDefault();
    let storedData = JSON.parse(localStorage.getItem("energyLog")) || [];
    localStorage.setItem("energyLog", JSON.stringify(storedData.slice(0, -1)));
    createTable();
    energySum();
  }
  
  function createTable() {
    let storedData = JSON.parse(localStorage.getItem("energyLog")) || [];
    // valitaan tablearea sekä luodaan taulukko ja sen osat
    let tablearea = $('#tablearea');
    let table = $('<table>');
    let thead = $('<thead>');
    let tbody = $('<tbody>');
    //luodaan taulukon otsikot arrayhin
    let headerRow = $('<tr>');
    let headers = ["Päivä", "Ateria", "Kalorit"];
    // ajetaan jokaiselle headersin funktio joka luo otsikkotason rivit
    headers.forEach((headerText) => {
      let th = $('<th>').text(headerText);
      headerRow.append(th);
      // th.textContent = headerText;
     
      // headerRow.appendChild(th);
    });
    // sijoittaa lapsielementin headerRow theadiin
    thead.append(headerRow);
  
    // loopin avulla luodaan body tason rivit
    for (let i = 0; i < storedData.length; i++) {
      let tr = $('<tr>');
      // let tr = document.createElement("tr");
      let td = $('<td>');
      // let td = document.createElement("td");
      td.text(storedData[i].day);
      
      let tdEating = $('<td>').text(storedData[i].eating);
      // let tdEating = document.createElement("td");
      // tdEating.text(storedData[i].eating);
  
      let tdCal = $('<td>').text(storedData[i].calories);
      // tdCal.text(storedData[i].calories);
  
      //liitetään rivit lapsielementteinä riviin
      tr.append(td, tdEating, tdCal);
      tbody.append(tr);
    
      // tbody.appendChild(tr);
    }
    // liitetän headi ja body taulukkoon lapsielementtinä
    table.css('color', 'white');
    table.append(thead);
    table.append(tbody);
    // table.appendChild(thead);
    // table.appendChild(tbody);
    //tyhjätään taulukko duplikaattien muodostumisen varalle
    tablearea.html("");
    // liitetään taulukko tableareaan lapsielementtinä
    tablearea.append(table);
    // tablearea.appendChild(table);
  }
  
  function energySum() {
    let storedData = JSON.parse(localStorage.getItem("energyLog")) || [];
    //alustetaan summa
    let sum = 0;
  
    //ajetaan jokaiselle storedDatan elementille funktio iterateFunction
    storedData.forEach(iterateFunction);
  
    // funktio lisää sum muuttujaan kalorit ja laskee ne yhteen
    function iterateFunction(value) {
      sum += parseInt(value.calories);
    }
  
    console.log(sum);
  
    //haetaan energyResults div IDn avulla
    let result = $('#energyResults');
  
    // liitetään sum muuttuja h3 tagin sisällä diviin
    result.html(`<h3>Yhteensä: ${sum} KCAL</h3>`);
  }
  