// variables
const form = document.querySelector('form')
const container = document.querySelector('.container')

document.addEventListener('DOMContentLoaded', () => {
    submitForm()
})

function submitForm() {
    form.addEventListener('submit', async (e) => {
        e.preventDefault()

        const submitBtn = document.querySelector('#submit-btn')
        submitBtn.disabled = true

        const formData = new FormData(e.target)
        const data = Object.fromEntries(formData)

        if([data.fname, data.lname, data.email].some(field => field.trim() === '')) {
            createNotification('Todos los campos son obligatorios.')
            submitBtn.disabled = false
            return
        }

        try {
            createNotification('Registrando...')

            const response = await fetch('/submit', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data)
            })

            const result = await response.json()

            if(response.ok) {

                form.reset()
                window.location.href = 'confirmation.html'
                submitBtn.disabled = false

            } else {
                createNotification(result.message)
                submitBtn.disabled = false
            }

        } catch (error) {
            createNotification('Ha habido un error, intenta de nuevo.')
            submitBtn.disabled = false
        }
    })
}

function createNotification(text) {
    const notificationContainer = document.createElement('DIV')
    notificationContainer.classList.add('notification-container')

    const existingNotification = document.querySelector('.notification-container')
    existingNotification?.remove() //Check if there is an existing alert and removes it.

    const notification = document.createElement('P')
    notification.classList.add('notification')
    notification.textContent = text

    notificationContainer.appendChild(notification)

    form.parentElement.insertBefore(notificationContainer, form)

    setTimeout(() => {
        notificationContainer.remove()
    }, 3000);
}