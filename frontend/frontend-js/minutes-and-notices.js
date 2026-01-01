async function fetchNotices() {
            try {
                const response = await fetch('fetch_notices.php'); // Change this to your backend API
                const notices = await response.json();
                
                const noticeList = document.getElementById("noticeList");
                if (notices.length === 0) {
                    noticeList.innerHTML = "<p class='error-message'>No notices available.</p>";
                    return;
                }
                noticeList.innerHTML = notices.map(notice => `
                    <li>
                        <span>${notice.title}</span>
                        <a href="${notice.url}" download="${notice.title}" class="download-btn">Download</a>
                    </li>
                `).join("");
            } catch (error) {
                document.getElementById("noticeList").innerHTML = "<p class='error-message'>Failed to fetch notices.</p>";
                console.error("Error fetching notices:", error);
            }
        }

        document.addEventListener("DOMContentLoaded", fetchNotices);