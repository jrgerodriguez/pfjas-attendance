const formulario = document.getElementById("formulario");

formulario.addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData(e.target);
  const data = Object.fromEntries(formData);

  //Ningun campo vacio
  if ([data.email, data.password].some((field) => field.trim() === "")) {
    alert('Todos los campos son obligatorios.');
    return;
  }

  try {
    const response = await fetch("/iniciar-sesion", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
    })

    const result = await response.json()

    if(response.ok) {
        window.location.href = '/sesion-iniciada.html'
    } else {
        alert(result.message);
    }
  } catch (error) {
    alert('Network error. Please try again.')
  }
});
