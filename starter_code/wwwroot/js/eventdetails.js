document.addEventListener('DOMContentLoaded', async () => {

    const setElement = (id, value, prop = 'innerText') => {
        const el = document.getElementById(id);
        if (el && value) el[prop] = value;
    };

    async function getAuthToken() {
        try {
            const response = await fetch("https://localhost:7068/api/Auth", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ fullname: "guest" })
            });
            const data = await response.json();
            return data.token;
        } catch (error) {
            console.error("Auth Error:", error);
            return null;
        }
    }

    const params = new URLSearchParams(window.location.search);
    const eventId = params.get('id');

    if (!eventId) {
        window.location.href = 'Events.html';
        return;
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
    function buildCarousel(event) {
        const carousel = document.querySelector("#dynamic-carousel");

        try {
            const images = event.images
            const total = images.length;

            for (let i = 0; i < total; i++) {
                const imageUrl = images[i];
                const slideHtml = buildCarouselSlide(event.id, imageUrl, i, total);
                carousel.innerHTML += slideHtml;
            }
        } catch (error) {
            console.error("Error building carousel:", error);
        }
    }

    try {
        const token = await getAuthToken();

        const response = await fetch(`https://localhost:7068/api/Events/${eventId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) throw new Error('Event not found or API error');

        const event = await response.json();
        console.log("Event Data:", event);

        buildCarousel(event);

        //Populate Event Details
        setElement('event-title', event.title || 'Untitled Event');
        setElement('event-description', `<p>${event.description || 'No description available.'}</p>`, 'innerHTML');
        setElement('event-category', event.category || 'EVENT DETAILS');
        setElement('event-location', event.location);

        if (event.eventDate) {
            const dateStr = new Date(event.eventDate).toLocaleDateString('en-US', {
                year: 'numeric', month: 'short', day: 'numeric'
            }).toUpperCase();
            setElement('event-date', dateStr);
        }

        //Populate Organizer
        setElement('organizer-fullname', event.organizer?.fullname || "Unknown Organizer");
        setElement('organizer-email', event.organizer?.email);
        setElement('organizer-image', event.organizer?.imageUrl, 'src');

        //Populate Comments
        const commentsContainer = document.getElementById('comments-container');

        if (commentsContainer) {
            const commentsList = event.comments || [];

            if (commentsList.length > 0) {
                commentsContainer.innerHTML = commentsList.map(comment => `
                    <div class="card bg-base-100 w-full shadow-sm border border-base-200">
                        <div class="card-body">
                            <h2 class="card-title">${comment.author || 'Anonymous'}</h2>
                            <p>${comment.content}</p>
                        </div>
                    </div>
                `).join('');
            } else {
                commentsContainer.innerHTML = '<p class="text-center text-gray-500 italic py-4">No comments yet.</p>';
            }
        }

    } catch (error) {
        console.error("Error loading event:", error);

    }
});