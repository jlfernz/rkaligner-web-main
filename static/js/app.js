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
  const username = JSON.parse(localStorage.getItem('user'))
  const { user, is_admin } = username

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
    localStorage.clear();
  } else if (location.pathname == '/register' && hasRegister?.length) {
    hasRegister[0].style.display = 'flex';
    if (hasLogin.length && hasLogin[0]?.style && hasImporter[0]?.style) {
      hasLogin[0].style.display = 'none';
      hasImporter[0].style.display = 'none';
      hasScore[0].style.display = 'none';
      filesTable[0].style.display = 'none';
    }
    localStorage.clear();
  } else if (location.pathname == '/importer' && hasImporter?.length && user?.length) {
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
  }  else if (location.pathname == '/admin_view_files' && user?.length && is_admin) {
    hasLogin[0].style.display = 'none';
    hasRegister[0].style.display = 'none';
    hasImporter[0].style.display = 'none';
    child[0].style.display = 'none';
    child[1].style.display = 'none';
    hasScore[0].style.display = 'none';
    parent.style.backgroundSize = 'auto';
    adminFilesTable();
  }
  else if (location.pathname == '/score' && user?.length) {
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
  } 
  
  else if (location.pathname == '/selected-file' && user?.length) {
    hasLogin[0].style.display = 'none';
    hasRegister[0].style.display = 'none';
    hasImporter[0].style.display = 'none';
    filesTable[0].style.display = 'none';
    child[0].style.display = 'none';
    child[1].style.display = 'none';
    hasScore[0].style.display = 'flex';
    parent.style.backgroundSize = 'auto';
    // filename.innerHTML = localStorage.getItem('resultFilename').toString();
    if (is_admin) {
      createAdminFileViewer();
    } else {
      createUserFileViewer();
    }
  }

  else if (location.pathname == '/aligned-files' && user?.length) {
    hasLogin[0].style.display = 'none';
    hasRegister[0].style.display = 'none';
    hasImporter[0].style.display = 'none';
    child[0].style.display = 'none';
    child[1].style.display = 'none';
    hasScore[0].style.display = 'none';
    // filename.style.display = 'none';
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
    // event.preventDefault()
    console.log('saving...');
    saveResults()
  })
  const editIcon = document.getElementById('admin-edit-files')
  const isAdminEditingFiles = localStorage.getItem('isAdminEditingFiles')
  if (isAdminEditingFiles != 'false' || !isAdminEditingFiles) {
    editIcon.style.display = 'none';
  } else {
    editIcon.style.display = 'block';
  }

  $('#admin-edit-files').click(function (event) {
    event.preventDefault()
    console.log('editIcon', editIcon);
    if (isAdminEditingFiles != 'false' || !isAdminEditingFiles) {
      localStorage.setItem('isAdminEditingFiles', false)
    } else {
      localStorage.setItem('isAdminEditingFiles', true)
    }
    window.location.href = '/selected-file'
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
  const responseItems = JSON.parse(localStorage.getItem('response'))
  console.log('responseItems', (responseItems));
  if (responseItems) {
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
  
    for (var i = 0; i < responseItems.length; i++) {
      console.log('inside for loop', (responseItems[i]))
      var row = document.createElement('tr');
      var sourceCell = document.createElement('td');
      sourceCell.innerHTML =`<a href="#" onclick="getUserFileById('${responseItems[i].id}')" alt="view results"> ${responseItems[i].source}</a>`;
      sourceCell.setAttribute('rowspan', '3');
      row.style.borderTop = '1px solid';
      row.appendChild(sourceCell);

      for (var j = 0; j < responseItems[i].target.length; j++) {
        var targetCell = document.createElement('td');
        var scoreCell = document.createElement('td');
        console.log('responseItems[i].target[j]', responseItems[i].target[j]);
        targetCell.innerHTML = responseItems[i].target[j].Target;
        scoreCell.innerHTML = responseItems[i].target[j].Score.toFixed(2);
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


function createUserFileViewer() {
  const hasScore = document.querySelector('.wrapper__score-table');
  const responseItems = JSON.parse(localStorage.getItem('selectedFile'))
  if (responseItems) {
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

    const selectedFile = responseItems[0]
  
    for (var i = 0; i < selectedFile.data.length; i++) {
      var row = document.createElement('tr');
      var sourceCell = document.createElement('td');
      sourceCell.innerHTML = selectedFile.data[i].text;
      sourceCell.setAttribute('rowspan', '3');
      row.style.borderTop = '1px solid';
      row.appendChild(sourceCell);

      const selectedFileAnswers = selectedFile.data[i].answers
      for (var j = 0; j < selectedFileAnswers.length; j++) {
        var targetCell = document.createElement('td');
        var scoreCell = document.createElement('td');
        targetCell.innerHTML = selectedFileAnswers[j].answer;
        scoreCell.innerHTML = selectedFileAnswers[j].score?.toFixed(2);
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

function createAdminFileViewer() {
  const hasScore = document.querySelector('.wrapper__score-table');
  const responseItems = JSON.parse(localStorage.getItem('selectedFile'));
  const isEditing = localStorage.getItem('isAdminEditingFiles');

  if (responseItems) {
    var table = document.createElement('table');
    var thead = document.createElement('thead');
    var tbody = document.createElement('tbody');
    
    // create header row
    var headerRow = document.createElement('tr');
    var sourceHeader = document.createElement('th');
    // var scoreHeader = document.createElement('th');
    var targetHeader = document.createElement('th');
    var editIconHeader = document.createElement('th');
    var targetHeader = document.createElement('th');
    sourceHeader.innerHTML = 'Source Language';
    targetHeader.innerHTML = 'Target Language';
    editIconHeader.innerHTML = 'Edit';
    headerRow.appendChild(sourceHeader);
    headerRow.appendChild(targetHeader);
    headerRow.appendChild(editIconHeader);
    thead.appendChild(headerRow);
    table.appendChild(thead);

    const selectedFile = responseItems[0]
    if (isEditing != 'true') {
      for (var i = 0; i < selectedFile.data.length; i++) {
        var row = document.createElement('tr');
        var sourceCell = document.createElement('td');
        sourceCell.innerHTML = selectedFile.data[i].text;
        sourceCell.setAttribute('rowspan', '3');
        row.style.borderTop = '1px solid';
        row.appendChild(sourceCell);
  
        const selectedFileAnswers = selectedFile.data[i].answers
        for (var j = 0; j < selectedFileAnswers.length; j++) {
          var targetCell = document.createElement('td');
          var scoreCell = document.createElement('td');
          targetCell.innerHTML = selectedFileAnswers[j].answer;
          scoreCell.innerHTML = selectedFileAnswers[j].score?.toFixed(2);
          row.appendChild(targetCell);
          row.appendChild(scoreCell);
          table.appendChild(row);
          row = document.createElement('tr');
        }
      }
    } else {
      for (var i = 0; i < selectedFile.data.length; i++) {
        const selectedFileAnswers = selectedFile.data[i].answers;
        const sortedAnswers = selectedFileAnswers.sort((a, b) => b.score - a.score)
        var row = document.createElement('tr');
          var sourceCell = document.createElement('td');
          var textEl = document.createElement('span')
          var editBoxCell = document.createElement('td');
          var input = document.createElement('input');
          const selectedAnswerInputValue = localStorage.getItem(`source${i}`) ? localStorage.getItem(`source${i}`) : ''
          input.setAttribute('type', 'text');
          input.setAttribute('id', `selectedAnswer${i}`);
          input.classList.add('selected-answer-editor')
  
          textEl.innerHTML = selectedFile.data[i].text;
          sourceCell.appendChild(textEl)
          editBoxCell.appendChild(input);
          row.appendChild(sourceCell);
          row.appendChild(editBoxCell);
  
          if (sortedAnswers.length) {
            for (var j = 0; j < sortedAnswers.length; j++) {
              var answersWithScoreWrapper = document.createElement('div')
              var answerNoScoreWrapper = document.createElement('div')
              answersWithScoreWrapper.classList.add('answer-with-score-row')
              answerNoScoreWrapper.classList.add('answer-no-score-row')
              var answerRadioOption = document.createElement('input');
              var answerRadioLabel = document.createElement('label');
              var scoreCell = document.createElement('span');
              answerRadioOption.type = 'radio';
              answerRadioOption.name = `source-answer${i}`
              answerRadioOption.value = sortedAnswers[j].answer;
              answerRadioOption.classList.add('answer-only')
              answerRadioLabel.textContent = sortedAnswers[j].answer;
              scoreCell.classList.add('score-only')
              scoreCell.innerHTML = sortedAnswers[j].score?.toFixed(2);
              // group radio and its label
              answerNoScoreWrapper.appendChild(answerRadioOption)
              answerNoScoreWrapper.appendChild(answerRadioLabel)
              // add onclick event listener
              answerNoScoreWrapper.addEventListener('click', (function(answer, iteration, inputEl) {
                return function() {
                  localStorage.setItem(`source${iteration}`, answer)
                  if (answer) {
                    inputEl.value = answer; // manipulate the value of the input element
                  }
                }
              })(sortedAnswers[j]?.answer, i, input));
              // then append the radio with label to answerWithScoreWrapper
              answersWithScoreWrapper.appendChild(answerNoScoreWrapper)
              answersWithScoreWrapper.appendChild(scoreCell)
              // answersRadioGroup.appendChild(answersWithScoreWrapper)
              sourceCell.appendChild(answersWithScoreWrapper)
              row.appendChild(sourceCell);
              row.appendChild(editBoxCell);
            }
          }
        row.style.borderTop = '1px solid';
        table.appendChild(row);
        row = document.createElement('tr');
      }
    }
    table.appendChild(tbody);
  
    // append table to document
    hasScore.appendChild(table);
  }

}

function adminScoreTable() {
  const hasScore = document.querySelector('.wrapper__score-table');
  const responseItems = JSON.parse(localStorage.getItem('response'))
  console.log('responseItems', (responseItems));
  if (responseItems) {
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
  
    for (var i = 0; i < responseItems.length; i++) {
      console.log('inside for loop', (responseItems[i]))
      var row = document.createElement('tr');
      var sourceCell = document.createElement('td');
      sourceCell.innerHTML =`<a href="#" onclick="getUserFileById('${responseItems[i].id}')" alt="view results"> ${responseItems[i].source}</a>`;
      sourceCell.setAttribute('rowspan', '3');
      row.style.borderTop = '1px solid';
      row.appendChild(sourceCell);

      for (var j = 0; j < responseItems[i].target.length; j++) {
        var targetCell = document.createElement('td');
        var scoreCell = document.createElement('td');
        console.log('responseItems[i].target[j]', responseItems[i].target[j]);
        targetCell.innerHTML = responseItems[i].target[j].Target;
        scoreCell.innerHTML = responseItems[i].target[j].Score.toFixed(2);
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


function adminFilesTable() {
  const filesTable = document.querySelector('.wrapper__files-table');
  const results = JSON.parse(localStorage.getItem('alignedFiles'));
  const resultsArr = results && results.results ? JSON.parse(results.results) : [];

  if (resultsArr && resultsArr.length) {
    var table = document.createElement('table');
    var thead = document.createElement('thead');
    var tbody = document.createElement('tbody');

    // create header row
    var headerRow = document.createElement('tr');
    var filenameHeader = document.createElement('th');
    var emailHeader = document.createElement('th');
    var dateHeader = document.createElement('th');
    var downloadHeader = document.createElement('th');
    filenameHeader.innerHTML = 'FILE NAME';
    emailHeader.innerHTML = 'EMAIL';
    dateHeader.innerHTML = 'DATE MODIFIED';
    downloadHeader.innerHTML = '';
    headerRow.appendChild(filenameHeader);
    headerRow.appendChild(emailHeader);
    headerRow.appendChild(dateHeader);
    headerRow.appendChild(downloadHeader);
    thead.appendChild(headerRow);
    table.appendChild(thead);

    for (var i = 0; i < resultsArr.length; i++) {
      var row = document.createElement('tr');
      var filesCell = document.createElement('td');
      var usersCell = document.createElement('td');
      var dateCell = document.createElement('td');
      var downloadCell = document.createElement('td');
      filesCell.innerHTML = `<a onclick="getUserFileById('${resultsArr[i].id}')" alt="view results"> ${resultsArr[i].filename.toString()}</a>`;
      usersCell.innerHTML = resultsArr[i].email;
      dateCell.innerHTML =
        new Date(resultsArr[i].date).toDateString()
      downloadCell.innerHTML =`<img onclick="handleDownloadFile('${encodeURIComponent(JSON.stringify(resultsArr[i]))}')" class="downloader-icon" id="${resultsArr[i].date}" src="../static/images/download-arrow.png" alt="save results" />`;
      row.appendChild(filesCell);
      row.appendChild(usersCell);
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

function createFilesTable() {
  const filesTable = document.querySelector('.wrapper__files-table');
  const results = JSON.parse(localStorage.getItem('alignedFiles'));
  const resultsArr = results && results.results ? JSON.parse(results.results) : results ? JSON.parse(results) : [];

  if (resultsArr && resultsArr.length) {
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

    for (var i = 0; i < resultsArr.length; i++) {
      var row = document.createElement('tr');
      var filesCell = document.createElement('td');
      var dateCell = document.createElement('td');
      var downloadCell = document.createElement('td');
      filesCell.innerHTML = `<a onclick="getUserFileById('${resultsArr[i].id}')" alt="view results"> ${resultsArr[i].filename.toString()}</a>`;
      dateCell.innerHTML =
        new Date(resultsArr[i].date).toDateString()
      downloadCell.innerHTML =`<img onclick="handleDownloadFile('${encodeURIComponent(JSON.stringify(resultsArr[i]))}')" class="downloader-icon" id="${resultsArr[i].date}" src="../static/images/download-arrow.png" alt="save results" />`;
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
  else {
    var table = document.createElement('table');
    var thead = document.createElement('thead');
    var tbody = document.createElement('tbody');

    // create header row
    var headerRow = document.createElement('tr');
    var filenameHeader = document.createElement('th');
    var dateHeader = document.createElement('th');
    var downloadHeader = document.createElement('th');
    var bodyCenter = document.createElement('tr');
    filenameHeader.innerHTML = 'FILE NAME';
    dateHeader.innerHTML = 'DATE MODIFIED';
    downloadHeader.innerHTML = '';
    bodyCenter.innerHTML = 'NO FILES';
    headerRow.appendChild(filenameHeader);
    headerRow.appendChild(dateHeader);
    headerRow.appendChild(downloadHeader);
    thead.appendChild(headerRow);
    thead.appendChild(bodyCenter);
    table.appendChild(thead);


    table.appendChild(tbody);

    // append table to document
    filesTable.appendChild(table);
    
  }
  var addFileButton = document.createElement('button');
  addFileButton.classList.add('new-file-btn');
  filesTable.appendChild(addFileButton);
  addFileButton.addEventListener('click', function () {
    window.location.href = '/importer'
  })
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
  console.log('FILEDATA: ', fileData)
  const csvData = fileData.data.map((source,  idx) => {
    // compare 3 items which is max 
    const highestScore = source.answers[0]
    // console.log('INDEX NI: ', idx)
    // console.log('Highest score NI: ', highestScore.Target + '\n')
    

    return (escapeCSV(`${highestScore.Target}`) + '\n')

    //   !idx ? 
    //   escapeCSV(`${source.text}`) : '' +
    //   ',' +
    //   escapeCSV(`${highestScore.Target}`) +
    //   ',' +
    //   '\n'
    // )

  });

  // console.log('csvData', csvData);

  // const blob = new Blob([csvData], {type: 'text/csv'});
  // const url = URL.createObjectURL(blob);
  // const link = document.createElement('a');
  // link.download = `rkaligner-${fileData.filename}.csv`;
  // link.href = url;
  // link.click();
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
        localStorage.setItem('response', JSON.stringify(res.results))
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
  const alignedFiles = JSON.parse(localStorage.getItem('alignedFiles'));
  const {results} = alignedFiles
  const username = JSON.parse(localStorage.getItem('user'));
  const selectedFile = JSON.parse(localStorage.getItem('selectedFile'));
  const {is_admin, user} = username

  console.log('selectedFile', selectedFile, selectedFile[0], user);
  if (selectedFile && user) {
    const file = selectedFile[0];
    console.log('file', file.data);
    const data = {
      source: file.data,
      filename: file.filename,
      email: user,
      id: file.id,
      is_validated: is_admin ? true : false, 
    };
    console.log('is_admin', is_admin);
    fetch('/save-results', {
      method: is_admin ? 'PUT' : 'POST',
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' },
    })
      .then((res) => res.json())
      .then((res) => {
        localStorage.setItem('alignedFiles', JSON.stringify(res.results));
        localStorage.removeItem('answers');
        localStorage.removeItem('source');

      })
      .then(() => {
        window.location.href = '/aligned-files';
      })
      .catch((err) => {
        console.log('error', err);
      });
  }
}

function getUserFileById(fileId) {
  fetch(`/get_id/${fileId}`, {
    method: 'GET'
  })
    .then(response => response.json())
    .then(data => {
      localStorage.setItem('selectedFile', data.results)
      if (data.error) {
        console.error(data.error);
      } else {
        console.log(data.result);
      }
    }).then(() => window.location.href = '/selected-file')
    .catch(error => console.error(error));
}

function displayAllFiles() {
  const { is_admin, user } = JSON.parse(localStorage.getItem("user"))
  if (is_admin) { 
    fetch('/admin_fetch_allfiles', {
      method: 'POST',
      body: JSON.stringify({
        email: user,
      }),
      headers: { 'Content-Type': 'application/json' },
    }).then((res) => res.json())
      .then((response) => {
        localStorage.setItem('alignedFiles', JSON.stringify(response))
        return response
      }).then(() => window.location.href = '/admin_view_files')
  }
  else {
    fetch('/user_fetch_files', {
      method: 'POST',
      body: JSON.stringify({
        email: user,
      }),
      headers: { 'Content-Type': 'application/json' },
    }).then((res) => res.json())
      .then((response) => {
        localStorage.setItem('alignedFiles', JSON.stringify(response))
        return response
      }).then(() => window.location.href = '/aligned-files')
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
      console.log(response)
      console.log(response.user)
      localStorage.setItem('user', JSON.stringify(response))
      return response
    })
    .then(() => {
      displayAllFiles()
    })
    .catch(err => console.log('error', err));
  }
}
