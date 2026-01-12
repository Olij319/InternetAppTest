
async function getAuthToken() {
    const response = await fetch("https://localhost:7068/api/Auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            fullname: "guest"
        })
    })
    const data = await response.json();
    console.log("Token: ", data.token);
    return data.token;
}


async function getEvents() {
    const token = await getAuthToken();

    const response = await fetch('https://localhost:7068/api/Events?Category=&Title=&Description=&Location=&Search=', {
        headers: {
            Authorization: `Bearer ${token}`
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

function buildCarouselSlide(id, imageUrl, index, total) {
    const prevIndex = (index === 0) ? total - 1 : index - 1;
    const nextIndex = (index === total - 1) ? 0 : index + 1;

    return `
    <div id="slide${index}" class="carousel-item relative w-full">
        <img src="${imageUrl}" alt="Event ${id}" class="w-full h-[50vh] object-contain" />
        <div class="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
            <a href="#slide${prevIndex}" class="btn btn-circle">❮</a>
            <a href="#slide${nextIndex}" class="btn btn-circle">❯</a>
        </div>
    </div>
    `;
}

async function buildCarousel() {
    try {
        const events = await getEvents();
        const total = events.length;

        for (let i = 0; i < total; i++) {
            const { id, imageUrls } = events[i];
            const slideHtml = buildCarouselSlide(id, imageUrls, i, total);
            carousel.innerHTML += slideHtml;
        }
    }
    catch (error) {
        console.error("Error building carousel:", error);

    }
}
let carousel = document.querySelector("#carousel-content")
buildCarousel();

function buildCard(id, title, imageUrl) {
    return `
    <div class="card bg-base-100 w-96 shadow-sm">
        <figure class="px-10 pt-10">
        <img src="${imageUrl}" alt="${title}" class="rounded-xl imageContent" />
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
buildAPICards(3);

