let files = [
            { name: "Human Resource Management.pdf", url: "files/HRM.pdf" },
            { name: "JAVA.pdf", url: "files/Maths_Sem1.pdf" },
            { name: "Data_Structure.pdf", url: "files/Physics_Sem1.pdf" },
            { name: "DBMS.pdf", url: "files/Chemistry_Sem1.pdf" }
        ];

        function renderFileList() {
            const fileList = document.getElementById("fileList");
            if (files.length === 0) {
                fileList.innerHTML = "No files available.";
                return;
            }
            fileList.innerHTML = files.map(file => `
                <li>
                    <span>${file.name}</span>
                    <a href="${file.url}" download="${file.name}" class="download-btn">Download</a>
                </li>
            `).join("");
        }

        document.addEventListener("DOMContentLoaded", renderFileList);