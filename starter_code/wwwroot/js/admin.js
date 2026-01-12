document.addEventListener('DOMContentLoaded', () => {
    const tabOrganiser = document.getElementById('tab-organiser');
    const tabEvent = document.getElementById('tab-event');
    const tabComment = document.getElementById('tab-comment');

    const formOrganiser = document.getElementById('form-organiser');
    const formEvent = document.getElementById('form-event');
    const formComment = document.getElementById('add-comment');

    function hideAllForms() {
        formOrganiser.classList.add('hidden');
        formEvent.classList.add('hidden');
        formComment.classList.add('hidden');
    }

    tabOrganiser.addEventListener('change', () => {
        if (tabOrganiser.checked) {
            hideAllForms();
            formOrganiser.classList.remove('hidden');
        }
    });

    tabEvent.addEventListener('change', () => {
        if (tabEvent.checked) {
            hideAllForms();
            formEvent.classList.remove('hidden');
        }
    });

    tabComment.addEventListener('change', () => {
        if (tabComment.checked) {
            hideAllForms();
            formComment.classList.remove('hidden');
        }
    });
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

    //Event Form
    const eventForm = document.getElementById('form-event')

    const categoryInput = document.getElementById('category');
    const titleInput = document.getElementById('title');
    const descriptionInput = document.getElementById('description');
    const locationInput = document.getElementById('location');
    const imageUrlsInput = document.getElementById('imageurls');
    const organiserInput = document.getElementById('organiser');

    eventForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        try {
            const token = await getAuthToken();

            const response = await fetch("https://localhost:7068/api/Events", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    id: null,
                    category: categoryInput.value,
                    title: titleInput.value,
                    description: descriptionInput.value,
                    location: locationInput.value,
                    imageUrls: imageurls.value,
                    organiser: organiserInput.value
                })
            });

            const result = await response.json();
            console.log("Event added successfully:", result);

            formEvent.reset();
        } catch (error) {
            console.error("Error adding event:", error);
        }
    });

    // Add comment Form
    const commentForm = document.getElementById('add-comment')

    const authorInput = document.getElementById('author');
    const messageInput = document.getElementById('message');
    const commentEventInput = document.getElementById('event');
    commentForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        try {
            const token = await getAuthToken();

            const response = await fetch('https://localhost:7068/api/Comments', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    id: null,
                    author: authorInput.value,
                    content: messageInput.value,
                    event: commentEventInput.value
                })
            });

            const result = await response.json();
            console.log("Comment added successfully:", result);

            commentForm.reset();
        } catch (error) {
            console.error("Error adding comment:", error);
        }
    });

    //Add Organsier Form
    const organiserForm = document.getElementById('form-organiser')

    const organiserNameInput = document.getElementById('organiserName');
    const emailInput = document.getElementById('email');

    organiserForm.addEventListener('submit', async (organiser) => {
        organiser.preventDefault();

        try {
            const token = await getAuthToken();

            const response = await fetch("https://localhost:7068/api/Organizers", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    id: null,
                    fullname: organiserNameInput.value,
                    email: emailInput.value
                })
            });

            const result = await response.json();
            console.log("Comment added successfully:", result);

            organiserForm.reset();
        } catch (error) {
            console.error("Error adding organiser:", error);
        }
    });


});
