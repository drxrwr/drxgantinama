document.getElementById("process-btn").addEventListener("click", () => {
    const fileInput = document.getElementById("file-upload");
    const mode = document.getElementById("mode-select").value;
    const fileList = document.getElementById("file-list");

    fileList.innerHTML = ""; // Clear previous results

    if (!fileInput.files.length) {
        alert("Please upload at least one file!");
        return;
    }

    Array.from(fileInput.files).forEach((file) => {
        const fileName = file.name;
        const fileExtension = fileName.slice(fileName.lastIndexOf("."));
        const baseName = fileName.slice(0, fileName.lastIndexOf("."));
        let newFileName = "";
        let errorMessage = "";

        switch (mode) {
            case "normal":
                newFileName = baseName + fileExtension;
                break;
            case "brackets":
                const match = baseName.match(/([^)]+)/);
                if (match) {
                    newFileName = match[1] + fileExtension;
                } else {
                    errorMessage = "Tidak ada tanda kurung dalam nama file.";
                }
                break;
            case "1-char":
            case "2-char":
            case "3-char":
            case "4-char":
                const numChars = parseInt(mode.split("-")[0]);
                if (baseName.length >= numChars) {
                    newFileName =
                        baseName.slice(-numChars) + fileExtension;
                } else {
                    errorMessage = `Jumlah karakter melebihi panjang nama file.`;
                }
                break;
            default:
                break;
        }

        // Create file item
        const fileItem = document.createElement("div");
        fileItem.classList.add("file-item");

        // Display file name and action buttons
        fileItem.innerHTML = `
            <span>${fileName}</span>
            ${
                mode === "normal"
                    ? `<input type="text" placeholder="Masukkan nama baru..." value="${newFileName}" />`
                    : ""
            }
            <button class="download-btn ${
                errorMessage ? "red" : "green"
            }">${errorMessage ? "Error" : newFileName}</button>
            ${
                errorMessage
                    ? `<span class="error-message">${errorMessage}</span>`
                    : ""
            }
        `;

        // Handle download
        if (!errorMessage) {
            const downloadButton = fileItem.querySelector(".download-btn");
            downloadButton.addEventListener("click", () => {
                const blob = new Blob([file], { type: file.type });
                const link = document.createElement("a");
                link.href = URL.createObjectURL(blob);
                link.download =
                    mode === "normal"
                        ? fileItem.querySelector("input").value || fileName
                        : newFileName;
                link.click();
            });
        }

        fileList.appendChild(fileItem);
    });
});
