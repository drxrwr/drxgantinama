document.getElementById('processButton').addEventListener('click', () => {
  const files = document.getElementById('fileInput').files;
  const renameMode = document.getElementById('renameMode').value;
  const fileList = document.getElementById('fileList');
  fileList.innerHTML = '';

  Array.from(files).forEach((file) => {
    const fileName = file.name;
    const fileExtension = fileName.substring(fileName.lastIndexOf('.'));
    const baseName = fileName.substring(0, fileName.lastIndexOf('.'));

    const fileItem = document.createElement('div');
    fileItem.className = 'file-item';

    const fileNameElement = document.createElement('div');
    fileNameElement.textContent = `Nama File Asli: ${fileName}`;
    fileItem.appendChild(fileNameElement);

    let newFileName = '';
    let error = '';

    if (renameMode === 'normal') {
      const input = document.createElement('input');
      input.type = 'text';
      input.placeholder = 'Masukkan nama baru (opsional)';
      fileItem.appendChild(input);

      newFileName = fileName; // Default to original name if not changed
      const button = createDownloadButton(newFileName, file);
      input.addEventListener('input', () => {
        button.dataset.filename = input.value ? input.value + fileExtension : fileName;
      });
      fileItem.appendChild(button);
    } else if (renameMode === 'brackets') {
      const match = baseName.match(/([^)]+)$/);
      if (match) {
        newFileName = match[1] + fileExtension;
      } else {
        error = 'Tidak ada tanda kurung pada nama file.';
      }
      fileItem.appendChild(createDownloadButton(newFileName, file, error));
    } else if (renameMode.startsWith('last')) {
      const charCount = parseInt(renameMode.replace('last', ''), 10);
      if (baseName.length >= charCount) {
        newFileName = baseName.slice(-charCount) + fileExtension;
      } else {
        error = 'Jumlah karakter melebihi panjang nama file.';
      }
      fileItem.appendChild(createDownloadButton(newFileName, file, error));
    }

    if (error) {
      const errorElement = document.createElement('div');
      errorElement.className = 'error';
      errorElement.textContent = error;
      fileItem.appendChild(errorElement);
    }

    fileList.appendChild(fileItem);
  });
});

function createDownloadButton(newFileName, file, error = '') {
  const button = document.createElement('button');
  button.textContent = error ? 'Error' : `Download (${newFileName})`;
  button.className = `download-button ${error ? 'red' : 'green'}`;

  if (!error) {
    button.dataset.filename = newFileName;
    button.addEventListener('click', () => downloadFile(file, newFileName));
  }

  return button;
}

function downloadFile(file, newFileName) {
  const url = URL.createObjectURL(file);
  const a = document.createElement('a');
  a.href = url;
  a.download = newFileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
