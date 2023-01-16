function toggleView() {
  const hasLogin = document.querySelectorAll('.wrapper__login');
  const hasRegister = document.querySelectorAll('.wrapper__registration');
  const hasImporter = document.querySelectorAll('.wrapper__importer');
  const hasScore = document.querySelectorAll('.wrapper__score-table');
  const filesTable = document.querySelectorAll('.wrapper__files-table');
  const content = document.querySelector('#landing-page__yellow_bot');
  const child = document.querySelectorAll('.child')
  const parent = document.querySelector('.parent');
  const filename = document.querySelector('#score-title');
  const username = localStorage.getItem('user')

  if (
    (location.pathname == '/login' || location.pathname == '/') &&
    hasLogin?.length
  ) {
    if (hasRegister.length && hasRegister[0]?.style && hasImporter[0]?.style) {
      hasRegister[0].style.display = 'none';
      hasImporter[0].style.display = 'none';
      hasScore[0].style.display = 'none';
      filesTable[0].style.display = 'none';
    }
    hasLogin[0].style.display = 'flex';
  } else if (location.pathname == '/register' && hasRegister?.length) {
    hasRegister[0].style.display = 'flex';
    if (hasLogin.length && hasLogin[0]?.style && hasImporter[0]?.style) {
      hasLogin[0].style.display = 'none';
      hasImporter[0].style.display = 'none';
      hasScore[0].style.display = 'none';
      filesTable[0].style.display = 'none';
    }
  } else if (location.pathname == '/importer' && hasImporter?.length && username?.length) {
    hasImporter[0].style.display = 'flex';
    if (content) {
      content.style.background = 'transparent';
      hasScore[0].style.display = 'none';
    }
    if (hasLogin.length && hasRegister[0]?.style && hasLogin[0]?.style) {
      hasLogin[0].style.display = 'none';
      hasRegister[0].style.display = 'none';
      hasScore[0].style.display = 'none';
      filesTable[0].style.display = 'none';
    }
  } else if (location.pathname == '/score' && username?.length) {
    hasLogin[0].style.display = 'none';
    hasRegister[0].style.display = 'none';
    hasImporter[0].style.display = 'none';
    filesTable[0].style.display = 'none';
    child[0].style.display = 'none';
    child[1].style.display = 'none';
    hasScore[0].style.display = 'flex';
    parent.style.backgroundSize = 'auto';
    filename.innerHTML = localStorage.getItem('resultFilename').toString();
    createScoreTable();
    // createScoreTableWithSelector();
  } else if (location.pathname == '/aligned-files' && username?.length) {
    hasLogin[0].style.display = 'none';
    hasRegister[0].style.display = 'none';
    hasImporter[0].style.display = 'none';
    child[0].style.display = 'none';
    child[1].style.display = 'none';
    hasScore[0].style.display = 'none';
    filename.style.display = 'none';
    parent.style.backgroundSize = 'auto';
    createFilesTable()
  }
  else {
    window.location.href = '/login'
  }
}

$(document).ready(function () {
  homeLocation = window.location.hash;
  const dashboard = document.querySelector('#landing-page__yellow_bot');
  const hasContent = document.querySelectorAll("[class*='wrapper__']")[0];

  // jquery listener click login button
  $('#login').submit(function (event) {
    event.preventDefault();
    handleLogin();
  });

  // jquery listener onclick ihanay button
  $('#importer').click(function (event) {
    // prevents page from reloading
    event.preventDefault();
    // sends the source and target file to BE for computation
    handleImportFile();
  });

  // jquery listener if uploader target file is clicked
  $('#targetFilePickerBtn').click(function (event) {
    event.preventDefault();
    // passing either 'target' or 'source'
    // to identify the target file from source
    // when saving tempt data to localStorage
    openFilePicker('target');
  });

  // jquery listener if uploader source file is clicked
  $('#sourceFilePickerBtn').click(function (event) {
    event.preventDefault();
    openFilePicker('source');
  });

  $('#results-saver').click(function (event) {
    event.preventDefault()
    console.log('saving...');
    saveResults()
  })

  // decides which elements to hide or show
  // depending on current url
  toggleView();
});

async function openFilePicker(fileLocation) {
  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.accept = '.txt, .csv'
  fileInput.style.display = 'none';
  fileInput.onchange = () => handleFileSelection(fileLocation, fileInput.files[0]);
  document.body.appendChild(fileInput);
  fileInput.click();
  document.body.removeChild(fileInput);
}

function createScoreTable() {
  const hasScore = document.querySelector('.wrapper__score-table');
  const sourceItems = JSON.parse(localStorage.getItem('source'))
  console.log('sourceItems', (sourceItems));
  if (sourceItems) {
    var table = document.createElement('table');
    var thead = document.createElement('thead');
    var tbody = document.createElement('tbody');
    
    // create header row
    var headerRow = document.createElement('tr');
    var sourceHeader = document.createElement('th');
    var scoreHeader = document.createElement('th');
    var targetHeader = document.createElement('th');
    var scoreHeader = document.createElement('th');
    var targetHeader = document.createElement('th');
    sourceHeader.innerHTML = 'Source Language';
    targetHeader.innerHTML = 'Target Language';
    scoreHeader.innerHTML = 'Score';
    headerRow.appendChild(sourceHeader);
    headerRow.appendChild(targetHeader);
    headerRow.appendChild(scoreHeader);
    thead.appendChild(headerRow);
    table.appendChild(thead);
  
    for (var i = 0; i < sourceItems.length; i++) {
      var row = document.createElement('tr');
      var sourceCell = document.createElement('td');
      sourceCell.innerHTML = sourceItems[i].text;
      sourceCell.setAttribute('rowspan', '3');
      row.style.borderTop = '1px solid';
      row.appendChild(sourceCell);
      for (var j = 0; j < sourceItems[i].answers.length; j++) {
        var targetCell = document.createElement('td');
        var scoreCell = document.createElement('td');
        console.log('sourceItems[i].answers[j]', sourceItems[i].answers[j]);
        targetCell.innerHTML = sourceItems[i].answers[j].answer;
        scoreCell.innerHTML = sourceItems[i].answers[j].score.toFixed(2);
        row.appendChild(targetCell);
        row.appendChild(scoreCell);
        table.appendChild(row);
        row = document.createElement('tr');
      }
    }
    table.appendChild(tbody);
  
    // append table to document
    hasScore.appendChild(table);
  }

}

function createFilesTable() {
  const filesTable = document.querySelector('.wrapper__files-table');
  const results = JSON.parse(JSON.parse(localStorage.getItem('allResults')));
  // const answerItems = JSON.parse(localStorage.getItem('answers'));
  // const answerItems = JSON.parse(localStorage.getItem('answers'));
  console.log('res', results)
  if (results && results.length) {
    var table = document.createElement('table');
    var thead = document.createElement('thead');
    var tbody = document.createElement('tbody');

    // create header row
    var headerRow = document.createElement('tr');
    var filenameHeader = document.createElement('th');
    var dateHeader = document.createElement('th');
    var downloadHeader = document.createElement('th');
    filenameHeader.innerHTML = 'FILE NAME';
    dateHeader.innerHTML = 'DATE MODIFIED';
    downloadHeader.innerHTML = '';
    headerRow.appendChild(filenameHeader);
    headerRow.appendChild(dateHeader);
    headerRow.appendChild(downloadHeader);
    thead.appendChild(headerRow);
    table.appendChild(thead);

    for (var i = 0; i < results.length; i++) {
      var row = document.createElement('tr');
      var filesCell = document.createElement('td');
      var dateCell = document.createElement('td');
      var downloadCell = document.createElement('td');
      filesCell.innerHTML = results[i].filename.toString();
      dateCell.innerHTML =
        new Date(results[i].date).toDateString()
      downloadCell.innerHTML =`<img onclick="handleDownloadFile('${encodeURIComponent(JSON.stringify(results[i]))}')" class="downloader-icon" id="${results[i].date}" src="../static/images/diskette.png" alt="save results" />`;
      row.appendChild(filesCell);
      row.appendChild(dateCell);
      row.appendChild(downloadCell);
      table.appendChild(row);
      row = document.createElement('tr');
    }
    table.appendChild(tbody);

    // append table to document
    filesTable.appendChild(table);
  }
}

const escapeCSV = (str) => {
  if (str.match && str.match(/,|"|\n|\r|\n\n/)) {
    return `"${str.replaceAll(/"/g, '""')}"`;
  } else {
    return str;
  }
};

function handleDownloadFile(selectedFile) {
  // here we get different data type since answer are hardcoded values from db.
  // Therefore we get different data type.
  const fileData = JSON.parse(decodeURIComponent(selectedFile));
  const titleColumn = [
    'Source,',
    'Answers,',
    'Score,',
    '\n'
  ];

  const csvData = fileData.data.map(source => {
    return source.answers.map(item => {
      return (
        escapeCSV(`${source.text}`) +
        ',' +
        escapeCSV(`${item.answer}`) +
        ',' +
        item.score +
        '\n'
      )
    })

  });

  console.log('csvData', csvData);

  const blob = new Blob([csvData], {type: 'text/csv'});
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.download = `rkaligner-${fileData.filename}.csv`;
  link.href = url;
  link.click();
}

function handleFileSelection(fileLocation, file) {
  const fileName = file.name;
  const sourceFileName = document.getElementById(`${fileLocation}File`)
  sourceFileName.textContent = fileName;

  const fileReader = new FileReader();
  fileReader.onload = function (event) {
    const fileContent = event.target.result;
    const fileData = fileContent.split('\n');
    localStorage.setItem(
      `temp${fileLocation}`,
      JSON.stringify(fileData)
    );
  };
  fileReader.readAsText(file);
}

function createScoreTableWithSelector() {
  const hasScore = document.querySelector('.wrapper__score-table');
  // Array from python needs 2x JSON.parse()
  // First parse will render string
  // Next will be array :)
  const sourceItems = JSON.parse(localStorage.getItem('source'));
  const answerItems = JSON.parse(localStorage.getItem('answers'));
  console.log('sourceItems', sourceItems);
  console.log('answerItems', answerItems);
  if (sourceItems && answerItems) {
    var table = document.createElement('table');
    var thead = document.createElement('thead');
    var tbody = document.createElement('tbody');

    // create header row
    var headerRow = document.createElement('tr');
    var sourceHeader = document.createElement('th');
    var scoreHeader = document.createElement('th');
    var targetHeader = document.createElement('th');
    var scoreHeader = document.createElement('th');
    var targetHeader = document.createElement('th');
    sourceHeader.innerHTML = 'Source Language';
    targetHeader.innerHTML = 'Target Language';
    scoreHeader.innerHTML = 'Edit';
    headerRow.appendChild(sourceHeader);
    headerRow.appendChild(targetHeader);
    headerRow.appendChild(scoreHeader);
    thead.appendChild(headerRow);
    table.appendChild(thead);
    const radioObject = {}
    
    for (var i = 0; i < sourceItems.length; i++) {
      var row = document.createElement('tr');
      var sourceCell = document.createElement('td');
      var scoreCell = document.createElement('td');
      var targetCell = document.createElement('td');
      sourceCell.innerHTML = sourceItems[i];
      targetCell.innerHTML = `<input class="selected-answer" id="selected-answer-${i}-${j}" required type="text" placeholder="Pangalan ng file">`;
      scoreCell.innerHTML = `<img class="downloader-icon" id="${i}" src="../static/images/edit-icon.png" alt="edit" />`;

      row.appendChild(sourceCell);
      row.appendChild(targetCell);
      row.appendChild(scoreCell);
      table.appendChild(row);

      for (var j = 0; j < answerItems.length; j++) {
        radioObject['radio' + j] = document.createElement('input');
        radioObject['radio' + j].setAttribute('name', `radio-group-${j}`);
        radioObject['radio' + j].setAttribute('value', answerItems[j]);
        console.log(radioObject);
        var row1 = document.createElement('tr');
        var answerCell = document.createElement('td');
        var emptyAnswerCell = document.createElement('td');
        var emptyScoreCell = document.createElement('td');

        answerCell.innerHTML = new(radioObject['radio' + j]);
        emptyAnswerCell.innerHTML = `<span>&nbsp</span>`;
        emptyScoreCell.innerHTML = `<span>&nbsp</span>`;
        row1.appendChild(answerCell);
        table.appendChild(row1);
      }
      row1.appendChild(emptyAnswerCell);
      row1.appendChild(emptyScoreCell);
    }
    table.appendChild(tbody);
    hasScore.appendChild(table);
  }
}

function handleFileSelection(fileLocation, file) {
  const fileName = file.name;
  const sourceFileName = document.getElementById(`${fileLocation}File`);
  sourceFileName.textContent = fileName;

  const fileReader = new FileReader();
  fileReader.onload = function (event) {
    const fileContent = event.target.result;
    const fileData = fileContent.split('\n');
    localStorage.setItem(`temp${fileLocation}`, JSON.stringify(fileData));
  };
  fileReader.readAsText(file);
}

function handleImportFile() {
  const tempSource = localStorage.getItem('tempsource')
  const temptarget = localStorage.getItem('temptarget')
  const fileName = document.querySelector('#importer-filename').value;
  if (tempSource && tempSource.length && temptarget && temptarget.length) {
    const data = {
      source: tempSource,
      target: temptarget,
      fileName,
    };
    fetch('/import_file', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' },
    })
      .then((res) => res.json()).then((res) => {
        localStorage.setItem('source', JSON.stringify(res.results))
        localStorage.setItem('resultFilename', res.filename.toString());
      }).then(() => {
        window.location.href = '/score'
        localStorage.removeItem('tempsource');
        localStorage.removeItem('temptarget');
      }
      )
      .catch((err) => {
        console.log('error', err)
      });
  }
  else {
    alert('No data found on Source/Target File. Please upload your Source and Target files')
  }
}

function saveResults() {
  const source = localStorage.getItem('source');
  const answers = localStorage.getItem('answers');
  const filename = localStorage.getItem('resultFilename');
  // we use username to easily filter all_results
  // of specific username from db 
  const username = localStorage.getItem('user');
  if (source && source.length && source && source.length && filename && username) {
    console.log('source', source);
    console.log('answers', answers);
    console.log('filename', filename);
    const data = {
      source: source,
      answers: answers,
      filename: filename,
      username: username,
    };
    fetch('/save-results', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' },
    })
      .then((res) => res.json())
      .then((res) => {
        localStorage.setItem('allResults', JSON.stringify(res.results));
        localStorage.removeItem('answers');
        localStorage.removeItem('source');

      })
      .then(() => {
        window.location.href = '/aligned-files';
      })
      .catch((err) => {
        console.log('error', err);
      });
  } else {
    alert(
      'No data found on Source/Target File. Please upload your Source and Target files'
    );
  }
}

function handleLogin() {
  const email = document.querySelector(
    '#login #email'
  ).value;
  const password = document.querySelector(
    '#login #password'
  ).value;

  console.log(email, password);

  if (email && password) {
    fetch('/login_submit', {
      method: 'POST',
      body: JSON.stringify({
        email: email,
        password: password,
      }),
      headers: { 'Content-Type': 'application/json' },
    }).then((res) => res.json())
    .then((response) => {
      localStorage.setItem('user', response.user)
    }).then(() => window.location.href = '/importer')
    .catch(err => console.log('error', err));
  }
}
