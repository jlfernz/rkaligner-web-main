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
  const logoutButton = document.createElement('button')
  logoutButton.style.position = 'absolute';
  logoutButton.style.top = '20px';
  logoutButton.style.right = '20px';
  logoutButton.style.height = '20px';
  logoutButton.style.width = '80px';
  logoutButton.textContent = 'Logout';
  logoutButton.setAttribute('id', 'logoutBtn');
  logoutButton.addEventListener('click', function(event) {
    window.location.href = '/login';
  });
  parent.appendChild(logoutButton);

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
    parent.removeChild(logoutButton);
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
    parent.removeChild(logoutButton);
    localStorage.clear();
    // add `?.` or optional chaining to avoid error of undefined
  } else if (location.pathname == '/importer' && hasImporter?.length && username?.user?.length) {
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
  } else if (location.pathname == '/admin_view_files' && username?.user?.length && username?.is_admin) {
    hasLogin[0].style.display = 'none';
    hasRegister[0].style.display = 'none';
    hasImporter[0].style.display = 'none';
    child[0].style.display = 'none';
    child[1].style.display = 'none';
    hasScore[0].style.display = 'none';
    parent.style.backgroundSize = 'auto';
    adminFilesTable();
  }
  else if (location.pathname == '/score' && username?.user?.length) {
    hasLogin[0].style.display = 'none';
    hasRegister[0].style.display = 'none';
    hasImporter[0].style.display = 'none';
    filesTable[0].style.display = 'none';
    child[0].style.display = 'none';
    child[1].style.display = 'none';
    hasScore[0].style.display = 'flex';
    parent.style.backgroundSize = 'auto';
    filename.innerHTML = localStorage.getItem('selectedFile') ? JSON.parse(localStorage.getItem('selectedFile'))[0]?.filename || '' : localStorage.getItem('resultFilename');
    createScoreTable();
  }

  else if (location.pathname == '/selected-file' && username?.user?.length) {
    hasLogin[0].style.display = 'none';
    hasRegister[0].style.display = 'none';
    hasImporter[0].style.display = 'none';
    filesTable[0].style.display = 'none';
    child[0].style.display = 'none';
    child[1].style.display = 'none';
    hasScore[0].style.display = 'flex';
    parent.style.backgroundSize = 'auto';
    filename.innerHTML = localStorage.getItem('selectedFile') ? JSON.parse(localStorage.getItem('selectedFile'))[0]?.filename || '' : localStorage.getItem('resultFilename');
    if (username?.is_admin) {
      createAdminFileViewer();
    } else {
      createUserFileViewer();
    }
  }
  else if (location.pathname == '/edit-selected-file' && username?.user?.length) {
    hasLogin[0].style.display = 'none';
    hasRegister[0].style.display = 'none';
    hasImporter[0].style.display = 'none';
    filesTable[0].style.display = 'none';
    child[0].style.display = 'none';
    child[1].style.display = 'none';
    hasScore[0].style.display = 'flex';
    parent.style.backgroundSize = 'auto';
    if (username?.is_admin) {
      createAdminFileEditor();
    }
  }

  else if (location.pathname == '/aligned-files' && username?.user?.length) {
    hasLogin[0].style.display = 'none';
    hasRegister[0].style.display = 'none';
    hasImporter[0].style.display = 'none';
    child[0].style.display = 'none';
    child[1].style.display = 'none';
    hasScore[0].style.display = 'none';
    parent.style.backgroundSize = 'auto';
    createFilesTable()
  }
  else {
    localStorage.clear();
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
    saveResults()
  })

  const editIcon = document.getElementById('admin-edit-files')
  const user = JSON.parse(localStorage.getItem('user'))

    if (location.pathname == '/selected-file' && user?.user?.is_admin) {
      editIcon.style.display = 'block';
    } else {
      editIcon.style.display = 'none';
    }

  $('#admin-edit-files').click(function (event) {
    event.preventDefault();
    window.location.href = '/edit-selected-file';
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

function clearLocalStorageExceptUser(user) {
  localStorage.clear();
  localStorage.setItem('user', user);
}

function createScoreTable() {
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

    for (var i = 0; i < responseItems.length; i++) {
      var row = document.createElement('tr');
      var sourceCell = document.createElement('td');
      sourceCell.innerHTML = responseItems[i].source;
      sourceCell.setAttribute('rowspan', '3');
      row.style.borderTop = '1px solid';
      row.appendChild(sourceCell);

      for (var j = 0; j < responseItems[i].target.length; j++) {
        var targetCell = document.createElement('td');
        var scoreCell = document.createElement('td');
        const answerScore = responseItems[i].target[j]?.score || responseItems[i].target[j]?.Score
        const answerText = responseItems[i].target[j]?.answer || responseItems[i].target[j]?.text || responseItems[i].target[j]?.target || responseItems[i].target[j]?.Target
        targetCell.innerHTML = answerText;
        scoreCell.innerHTML = answerScore.toFixed(2);
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
      const sourceText = selectedFile.data[i]?.text || selectedFile.data[i]?.source;
      var sourceCell = document.createElement('td');
      sourceCell.innerHTML = sourceText;
      sourceCell.setAttribute('rowspan', '3');
      row.style.borderTop = '1px solid';
      row.appendChild(sourceCell);

      const selectedFileAnswers = selectedFile.data[i]?.answers || selectedFile.data[i]?.target || (Array.isArray(selectedFile.data[i]?.source) ? selectedFile.data[i]?.source : []);
      for (var j = 0; j < selectedFileAnswers.length; j++) {
        const answerScore = selectedFileAnswers[j]?.score || selectedFileAnswers[j]?.Score;
        const answerText = selectedFileAnswers[j]?.answer || selectedFileAnswers[j]?.target || selectedFileAnswers[j]?.Target || (typeof selectedFileAnswers[j]?.source === 'string' ? selectedFileAnswers[j]?.source : '');
        var targetCell = document.createElement('td');
        var scoreCell = document.createElement('td');
        targetCell.innerHTML = answerText;
        scoreCell.innerHTML = answerScore?.toFixed(2);
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

function createAdminFileEditor() {
  const hasScore = document.querySelector('.wrapper__score-table');
  const responseItems = JSON.parse(localStorage.getItem('selectedFile'));

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

    const selectedFile = responseItems[0];
    for (var i = 0; i < selectedFile.data.length; i++) {
      const selectedFileAnswers = selectedFile.data[i]?.answers || selectedFile.data[i]?.target || (Array.isArray(selectedFile.data[i]?.source) ? selectedFile.data[i]?.source : []);
      const sortedAnswers = selectedFileAnswers.sort((a, b) => (b?.score || b?.Score) - (a?.score || a?.Score))
      var row = document.createElement('tr');
      var sourceCell = document.createElement('td');
      var textEl = document.createElement('span')
      var editBoxCell = document.createElement('td');
      var input = document.createElement('input');
      const selectedAnswerInputValue = localStorage.getItem(`source${i}`) ? localStorage.getItem(`source${i}`) : ''
      input.setAttribute('type', 'text');
      input.setAttribute('id', `selectedAnswer${i}`);
      input.classList.add('selected-answer-editor')

      textEl.innerHTML = typeof selectedFile.data[i]?.source === 'string' ? selectedFile.data[i]?.source : selectedFile.data[i]?.text;
      sourceCell.appendChild(textEl)
      editBoxCell.appendChild(input);
      row.appendChild(sourceCell);
      row.appendChild(editBoxCell);

      if (sortedAnswers.length) {
        input.value = sortedAnswers[0]?.answer || sortedAnswers[0]?.text || sortedAnswers[0]?.target || sortedAnswers[0]?.Target;
        for (var j = 0; j < sortedAnswers.length; j++) {
          const answerScore = sortedAnswers[j]?.score || sortedAnswers[j]?.Score
          const answerText = sortedAnswers[j]?.answer || sortedAnswers[j]?.text || sortedAnswers[j]?.target || sortedAnswers[j]?.Target;
          var answersWithScoreWrapper = document.createElement('div')
          var answerNoScoreWrapper = document.createElement('div')
          answersWithScoreWrapper.classList.add('answer-with-score-row')
          answerNoScoreWrapper.classList.add('answer-no-score-row')
          var answerRadioOption = document.createElement('input');
          var answerRadioLabel = document.createElement('label');
          var scoreCell = document.createElement('span');
          answerRadioOption.type = 'radio';
          answerRadioOption.name = `source-answer${i}`
          answerRadioOption.value = answerText;
          // first / highest score defaulted to radio checked
          answerRadioOption.checked = !j ? true : false;
          answerRadioOption.classList.add('answer-only')
          answerRadioLabel.textContent = answerText
          scoreCell.classList.add('score-only')
          scoreCell.innerHTML = answerScore?.toFixed(2);
          // group radio and its label
          answerNoScoreWrapper.appendChild(answerRadioOption)
          answerNoScoreWrapper.appendChild(answerRadioLabel)
          // add onclick event listener
          answerNoScoreWrapper.addEventListener('click', (function (answer, iteration, inputEl) {
            return function () {
              localStorage.setItem(`source${iteration}`, answer)
              if (answer) {
                inputEl.value = answer; // manipulate the value of the input element
              }
            }
          })(answerText, i, input));
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

    table.appendChild(tbody);

    // append table to document
    hasScore.appendChild(table);
  }

}

function createAdminFileViewer(isAdminEditing) {
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
    if (!isAdminEditing) {
      for (var i = 0; i < selectedFile.data.length; i++) {
        var row = document.createElement('tr');
        const selectedFileText = selectedFile.data[i]?.text || selectedFile.data[i]?.source;
        var sourceCell = document.createElement('td');
        sourceCell.innerHTML = selectedFileText;
        sourceCell.setAttribute('rowspan', '3');
        row.style.borderTop = '1px solid';
        row.appendChild(sourceCell);

        const selectedFileAnswers = selectedFile.data[i]?.answers || selectedFile.data[i]?.target;
        for (var j = 0; j < selectedFileAnswers.length; j++) {
          const answerScore = selectedFileAnswers[j]?.score || selectedFileAnswers[j]?.Score;
          const answerText = selectedFileAnswers[j]?.answer || selectedFileAnswers[j]?.text || selectedFileAnswers[j]?.target || selectedFileAnswers[j]?.Target;
          var targetCell = document.createElement('td');
          var scoreCell = document.createElement('td');
          targetCell.innerHTML = answerText;
          scoreCell.innerHTML = answerScore.toFixed(2);
          row.appendChild(targetCell);
          row.appendChild(scoreCell);
          table.appendChild(row);
          row = document.createElement('tr');
        }
      }
    } else {
      for (var i = 0; i < selectedFile.data.length; i++) {
        const selectedFileAnswers = selectedFile.data[i]?.answers || selectedFile.data[i]?.source;
        const sortedAnswers = selectedFileAnswers.sort((a, b) => (b?.score || b?.Score) - (a?.score || a?.Score))
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
            const answerScore = sortedAnswers[j]?.score || sortedAnswers[j]?.Score
            const answerText = sortedAnswers[j]?.answer || sortedAnswers[j]?.text || sortedAnswers[j]?.target || sortedAnswers[j]?.Target;
            var answersWithScoreWrapper = document.createElement('div')
            var answerNoScoreWrapper = document.createElement('div')
            answersWithScoreWrapper.classList.add('answer-with-score-row')
            answerNoScoreWrapper.classList.add('answer-no-score-row')
            var answerRadioOption = document.createElement('input');
            var answerRadioLabel = document.createElement('label');
            var scoreCell = document.createElement('span');
            answerRadioOption.type = 'radio';
            answerRadioOption.name = `source-answer${i}`
            answerRadioOption.value = answerText;
            answerRadioOption.classList.add('answer-only')
            answerRadioLabel.textContent = answerText
            scoreCell.classList.add('score-only')
            scoreCell.innerHTML = answerScore?.toFixed(2);
            // group radio and its label
            answerNoScoreWrapper.appendChild(answerRadioOption)
            answerNoScoreWrapper.appendChild(answerRadioLabel)
            // add onclick event listener
            answerNoScoreWrapper.addEventListener('click', (function (answer, iteration, inputEl) {
              return function () {
                localStorage.setItem(`source${iteration}`, answer)
                if (answer) {
                  inputEl.value = answer; // manipulate the value of the input element
                }
              }
            })(answerText, i, input));
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
      var row = document.createElement('tr');
      var sourceCell = document.createElement('td');
      sourceCell.innerHTML = `<a href="#" onclick="getUserFileById('${responseItems[i].id}')" alt="view results"> ${responseItems[i].source}</a>`;
      sourceCell.setAttribute('rowspan', '3');
      row.style.borderTop = '1px solid';
      row.appendChild(sourceCell);

      for (var j = 0; j < responseItems[i].target.length; j++) {
        const answerScore = responseItems[i].target[j]?.score || responseItems[i].target[j]?.Score
        const answerText = responseItems[i].target[j]?.answer || responseItems[i].target[j]?.text || responseItems[i].target[j]?.target || responseItems[i].target[j]?.Target
        var targetCell = document.createElement('td');
        var scoreCell = document.createElement('td');
        targetCell.innerHTML = answerText;
        scoreCell.innerHTML = answerScore.toFixed(2);
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
      const isValidated = resultsArr[i]?.validated;
      var row = document.createElement('tr');
      var filesCell = document.createElement('td');
      var usersCell = document.createElement('td');
      var dateCell = document.createElement('td');
      var downloadCell = document.createElement('td');
      filesCell.innerHTML = `<a onclick="getUserFileById('${resultsArr[i].id}')" alt="view results"> ${resultsArr[i].filename}</a>`;
      usersCell.innerHTML = resultsArr[i].email;
      dateCell.innerHTML =
        new Date(resultsArr[i].date).toDateString()
      downloadCell.innerHTML = isValidated ? `<img onclick="handleDownloadFile('${encodeURIComponent(JSON.stringify(resultsArr[i]))}')" class="downloader-icon" id="${resultsArr[i].date}" src="../static/images/download-arrow.png" alt="save results" />` : null;
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
      const isValidated = resultsArr[i]?.validated
      var row = document.createElement('tr');
      var filesCell = document.createElement('td');
      var dateCell = document.createElement('td');
      var downloadCell = document.createElement('td');
      filesCell.innerHTML = `<a onclick="getUserFileById('${resultsArr[i].id}')" alt="view results"> ${resultsArr[i].filename}</a>`;
      dateCell.innerHTML =
        new Date(resultsArr[i].date).toDateString()
      downloadCell.innerHTML = isValidated ? `<img onclick="handleDownloadFile('${encodeURIComponent(JSON.stringify(resultsArr[i]))}')" class="downloader-icon" id="${resultsArr[i].date}" src="../static/images/download-arrow.png" alt="save results" />` : null;
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
  var addFileButton = document.createElement('div');
  addFileButton.innerHTML = `<img class="importer-icon" src="../static/images/plus.png" alt="import new file" />`;
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
  const fileData = JSON.parse(decodeURIComponent(selectedFile));
  const titleColumn = [
    'Source',
    'Answers'
  ];
  const csvData = [titleColumn.join(',')]; // Create a row with column headers

  for (let i = 0; i < fileData.data.length; i++) {
    const source = fileData.data[i];
    const highestScoreObj = source.answers.reduce((highestScore, currentScore) => {
      if (currentScore.score > highestScore.score) {
        return currentScore;
      } else {
        return highestScore;
      }
    });
    const highestScoreText = highestScoreObj.answer || highestScoreObj.target || highestScoreObj.Target;
    const sourceText = source.text;
    const row = [sourceText, highestScoreText].map(escapeCSV).join(',');
    csvData.push(row); // Add the row to the csvData array
  }

  const blob = new Blob([csvData.join('\n')], { type: 'text/csv' });
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
  const sourceItems = JSON.parse(localStorage.getItem('source'));
  const answerItems = JSON.parse(localStorage.getItem('answers'));
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
        var row1 = document.createElement('tr');
        var answerCell = document.createElement('td');
        var emptyAnswerCell = document.createElement('td');
        var emptyScoreCell = document.createElement('td');

        answerCell.innerHTML = new (radioObject['radio' + j]);
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
        localStorage.setItem('selectedFile', JSON.stringify(res.results))
        localStorage.setItem('resultFilename', res.filename);
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
  const { results } = alignedFiles
  const filename = localStorage.getItem('resultFilename');
  const username = JSON.parse(localStorage.getItem('user'));
  const selectedFile = JSON.parse(localStorage.getItem('selectedFile'));
  const { is_admin, user } = username

  if (selectedFile && user) {
    const data = {
      source: selectedFile?.data || selectedFile,
      filename: filename,
      email: user,
      id: selectedFile?.id || selectedFile[0]?.id,
      is_validated: is_admin ? true : false,
    };
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
        localStorage.setItem('user', JSON.stringify(response))
        return response
      })
      .then(() => {
        displayAllFiles()
      })
      .catch(err => console.log('error', err));
  }
}
