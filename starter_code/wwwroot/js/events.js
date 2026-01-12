
async function getAuthToken(){
    const response = await fetch("https://localhost:7068/api/Auth",{
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            fullname: "guest"})
})
    const data = await response.json();
    console.log("Token: ", data.token);
    return data.token;
}

async function getEvents(){
    const token = await getAuthToken();

    const response = await fetch('https://localhost:7068/api/Events?Category=&Title=&Description=&Location=&Search=', {
        headers: {
            Authorization:`Bearer ${token}`
        }
    })
        //.then(data => data.json())
        //.then(events => console.log(events))

    if (!response.ok) {
        throw new Error(`Failed to fetch events: ${response.status}`);
    }

    //return await response.json();
    const events = await response.json();
    return events;
}

/*window.addEventListener('scroll', function () {
    const scrollPosition = window.scrollY + window.innerHeight;
    const pageHeight = document.documentElement.scrollHeight;

    if (scrollPosition >= pageHeight - 100) {
        console.log("You're near the bottom of the page!");
        buildAPICards(3);
    }
});*/


function buildCard(id, title, imageUrl) {
    return `
    <div class="card bg-base-100 w-96 shadow-sm">
        <figure class="px-10 pt-10 overflow-visible relative z-10">
        <img src="${imageUrl}" alt="${title}" class="rounded-xl" style="transition: transform 0.5s ease;"onmouseover="this.style.transform='scale(1.5)'"onmouseout="this.style.transform='scale(1)'" />
        </figure>
        <div class="card-body items-center text-center">
            <h2 class="card-title">${title}</h2>
            <div class="card-actions">
                <a href="event-detail.html?id=${id}" class="btn btn-primary">Read More</a>
            </div>
        </div>
    </div>
    `;
}
async function buildAPICards(n) {
    try {
        const events = await getEvents();

        for (let i = 0; i < n; i++) {
            const { id, title, imageUrls } = events[i];
            const cardHtml = buildCard(id, title, imageUrls);
            dynamicContent.innerHTML += cardHtml;
        }
    } catch (error) {
        console.error("Error building cards:", error);
    }
}

let dynamicContent = document.querySelector("#dynamic-content");
buildAPICards(15);