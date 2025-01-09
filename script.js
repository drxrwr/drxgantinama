document.getElementById('renameBtn').addEventListener('click', () => {
  const files = document.getElementById('fileInput').files;
  const renameOption = document.getElementById('renameOption').value;
  const output = document.getElementById('output');
  output.innerHTML = ''; // Clear previous output

  if (!files.length) {
    alert('Please upload at least one file.');
    return;
  }

  Array.from(files).forEach(file => {
    const originalName = file.name;
    const extension = originalName.substring(originalName.lastIndexOf('.'));
    let newName = '';

    switch (renameOption) {
      case 'normal':
        newName = prompt(`Enter new name for ${originalName} (without extension):`);
        if (newName) newName += extension;
        break;

      case 'brackets':
        const match = originalName.match(/([^)]+)/);
        newName = match ? `${match[1]}${extension}` : `NoBrackets${extension}`;
        break;

      default:
        const numChars = parseInt(renameOption, 10);
        const baseName = originalName.slice(0, originalName.lastIndexOf('.'));
        newName = baseName.slice(-numChars) + extension;
        break;
    }

    if (newName) {
      const fileItem = document.createElement('div');
      fileItem.className = 'file-item';
      fileItem.innerHTML = `
        <span>${originalName}</span>
        <button onclick="downloadFile('${newName}')">Download</button>
      `;
      output.appendChild(fileItem);
    }
  });
});

function downloadFile(newName) {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([''], { type: 'application/octet-stream' }));
  a.download = newName;
  a.click();
}
