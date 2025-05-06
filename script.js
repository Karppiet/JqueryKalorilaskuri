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
    // tsekataan että päivä on valittu, lisätään virheilmoitus jos näin ei ole
    if (day.value == "") {
      console.log("Päivä pitää olla valittuna");
  
      day.css("outline","3px solid red");
      dErr.innerHTML = `<p style="color:red">Päivä pitää olla valittuna</p>`;
      x = false;
    } else {
      // tyhjennetään virheilmoitukset
      day.css("outline","");
      dErr.innerHTML = "";
    }
    // tsekataan että ateria valittu
    if (meal.value == "") {
      console.log("Ateria pitää olla valittuna");
  
      meal.style.outline = "3px solid red";
      mErr.innerHTML = `<p style="color:red">Ateria pitää olla valittuna</p>`;
      x = false;
    } else {
      //tyhjennetään virheilmoitukset
      meal.style.outline = "";
      mErr.innerHTML = "";
    }
  
    // tsekataan syötetty määärä kaloreita ja muutetaan x falseksi jos luvut eivät täsmää
    if (kcal.value < 1 || kcal.value > 3000 || isNaN(kcal.value) == true) {
      kcal.style.border = "3px solid red";
      cErr.innerHTML = `<p style="color:red">Kalorit pitää olla väliltä 1-3000 kcal</p>`;
      x = false;
    } else {
      // tyhjennetään virheilmoitukset
      kcal.style.border = "";
      cErr.innerHTML = "";
    }
  
    // jos x jää true arvolle ajetaan calculateIntake funktio sekä tyhjennetään virheilmoitukset
    if (x == true) {
      calculateIntake();
  
      // day.style.outline = "";
      // meal.style.outline = "";
      // kcal.style.border = "";
        kcal.value = "";
      
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
    let weekday = document.querySelector("#day").value;
    let eat = document.querySelector("#eating").value;
    let cal = document.querySelector("#kcal").value;
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
    let tablearea = document.querySelector("#tablearea");
    let table = document.createElement("table");
    let thead = document.createElement("thead");
    let tbody = document.createElement("tbody");
    //luodaan taulukon otsikot arrayhin
    let headerRow = document.createElement("tr");
    let headers = ["Päivä", "Ateria", "Kalorit"];
    // ajetaan jokaiselle headersin funktio joka luo otsikkotason rivit
    headers.forEach((headerText) => {
      let th = document.createElement("th");
      th.textContent = headerText;
      headerRow.appendChild(th);
    });
    // sijoittaa lapsielementin headerRow theadiin
    thead.appendChild(headerRow);
  
    // loopin avulla luodaan body tason rivit
    for (let i = 0; i < storedData.length; i++) {
      let tr = document.createElement("tr");
  
      let td = document.createElement("td");
      td.textContent = storedData[i].day;
  
      let tdEating = document.createElement("td");
      tdEating.textContent = storedData[i].eating;
  
      let tdCal = document.createElement("td");
      tdCal.textContent = storedData[i].calories;
  
      //liitetään rivit lapsielementteinä riviin
      tr.appendChild(td);
      tr.appendChild(tdEating);
      tr.appendChild(tdCal);
      tbody.appendChild(tr);
    }
    // liitetän headi ja body taulukkoon lapsielementtinä
    table.style.color = "white";
    table.appendChild(thead);
    table.appendChild(tbody);
    //tyhjätään taulukko duplikaattien muodostumisen varalle
    tablearea.innerHTML = "";
    // liitetään taulukko tableareaan lapsielementtinä
    tablearea.appendChild(table);
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
    let result = document.querySelector("#energyResults");
  
    // liitetään sum muuttuja h3 tagin sisällä diviin
    result.innerHTML = `<h3>Yhteensä: ${sum} KCAL</h3>`;
  }
  