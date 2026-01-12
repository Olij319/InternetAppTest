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

const fullnameInput = document.querySelector('#fullname');
const emailInput = document.querySelector('#email');
const phoneInput = document.querySelector('#phone');
const messageInput = document.querySelector('#message');

const fullnameError = document.querySelector('#fullnameError');
const emailError = document.querySelector('#emailError');
const phoneError = document.querySelector('#phoneError');
const messageError = document.querySelector('#messageError');

const organiserForm = document.querySelector('#organiserForm')


let isFormValid = false;
function validateFullname() {
    if (!fullnameInput.value) {
        fullnameError.textContent = "Full Name is required.";
        fullnameError.classList.remove("hidden");
        return false;
    } else if (!fullnameInput.value.match(/^[a-zA-Z\s]{3,50}$/)) {
        fullnameError.textContent = "Full Name must be 3-50 alphabetic characters.";
        fullnameError.classList.remove("hidden");
        return false;
    } else {
        fullnameError.classList.add("hidden");
        return true;
    }
}

function validateEmail() {
    if (!emailInput.value) {
        emailError.textContent = "Email is required.";
        emailError.classList.remove("hidden");
        return false;
    } else if (!emailInput.value.match(/^\S+@\S+\.\S+$/)) {
        emailError.textContent = "Please enter a valid email address.";
        emailError.classList.remove("hidden");
        return false;
    } else {
        emailError.classList.add("hidden");
        return true;
    }
}
function validatePhone() {

    if (!phoneInput.value) {
        phoneError.textContent = "Phone Number is required.";
        phoneError.classList.remove("hidden");
        return false;
    }

    else if (!phoneInput.value.match(/^[0-9]{10}$/)) {
        phoneError.textContent = "Only digits, please";
        phoneError.classList.remove("hidden");
        return false;
    }
    else {
        phoneError.classList.add("hidden");
        return true;
    }

}

function validateMessage() {
    const messageLength = messageInput.value.trim().length;

    if (messageLength < 3) {
        messageError.textContent = "Message must be at least 3 characters.";
        messageError.classList.remove("hidden");
        return false;
    } else if (messageLength > 1000) {
        messageError.textContent = "Message must be no more than 1000 characters.";
        messageError.classList.remove("hidden");
        return false;
    } else {
        messageError.classList.add("hidden");
        return true;
    }
}


async function postFormData() {
    const formData = {
        Fullname: fullnameInput.value,
        Email: emailInput.value,
        Content: messageInput.value,
        Phone: phoneInput.value
    };

    try {
        const token = await getAuthToken();

        const response = await fetch("https://localhost:7068/api/Messages", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(formData),
        });

        if (!response.ok) {
            throw new Error("Network response was not ok");
        }

        const result = await response.json();
        console.log("Form submitted successfully:", result);
        document.querySelector("#successMessage").classList.remove("hidden");
        organiserForm.reset();
    }
    catch (error) {
        console.error("Error submitting form:", error);
        alert("There was an error submitting the form. Please try again.");
    }
}

// Form submission handler
organiserForm.addEventListener('submit', function (event) {
    event.preventDefault();

    const isNameValid = validateFullname();
    const isEmailValid = validateEmail();
    const isMessageValid = validateMessage();
    const isPhoneValid = validatePhone();

    if (isNameValid && isEmailValid && isMessageValid && isPhoneValid) {
        postFormData();
    }
});


