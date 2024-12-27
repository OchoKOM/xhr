class OchoClient {
  constructor(baseUrl, defaultOptions = {}) {
    if (!baseUrl || typeof baseUrl !== "string") {
      throw new Error("baseUrl doit être une chaîne de caractères valide.");
    }

    this.baseUrl = baseUrl.replace(/\/$/, ""); // Supprime les "/" en fin d'URL
    this.defaultOptions = {
      headers: {},
      body: null,
      throwHttpErrors: true,
      timeout: 0, // Pas de timeout par défaut
      ...defaultOptions, // Permet à l'utilisateur de personnaliser les options par défaut
    };
  }

  sendRequest(method, endpoint, options = {}, onProgress = null) {

    if (
      !method ||
      !["GET", "POST", "PUT", "PATCH", "DELETE"].includes(method.toUpperCase())
    ) {
      throw new Error("Méthode HTTP invalide.");
    }

    if (!endpoint || typeof endpoint !== "string") {
      throw new Error("endpoint doit être une chaîne de caractères valide.");
    }

    const mergedOptions = {
      ...this.defaultOptions,
      ...options,
      headers: { ...this.defaultOptions.headers, ...options.headers }, // Fusion des en-têtes
    };

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open(
        method.toUpperCase(),
        `${this.baseUrl}/${endpoint.replace(/^\//, "")}`
      );

      // Application des en-têtes HTTP
      Object.entries(mergedOptions.headers).forEach(([key, value]) => {
        xhr.setRequestHeader(key, value);
      });

      // Gestion du timeout
      if (mergedOptions.timeout > 0) {
        xhr.timeout = mergedOptions.timeout;
      }

      // Gestion de la progression
      if (typeof onProgress === "function") {
        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const progress = (event.loaded / event.total) * 100;
            onProgress(progress, event);
          } else {
            onProgress(null, event); // Taille inconnue
          }
        };
      }

      xhr.onload = () => {
        if (xhr.readyState === XMLHttpRequest.DONE) {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              const data = JSON.parse(xhr.response);
              resolve(data);
            } catch (error) {
              if (mergedOptions.throwHttpErrors) {
                reject(new Error("Erreur de parsing JSON"));
              } else {
                console.error(error);
                resolve(xhr.response); // Retourne la réponse brute
              }
            }
          } else if (mergedOptions.throwHttpErrors) {
            reject(new Error(`Erreur HTTP ${xhr.status}: ${xhr.statusText}`));
          } else {
            resolve(xhr.response);
          }
        }
      };

      xhr.onerror = () => {
        reject(new Error("Erreur réseau"));
      };

      xhr.ontimeout = () => {
        reject(new Error(`Requête expirée après ${mergedOptions.timeout} ms`));
      };

      // Préparation et envoi du corps de la requête
      if (mergedOptions.body) {
        if (mergedOptions.body instanceof FormData) {
          xhr.send(mergedOptions.body);
        } else if (typeof mergedOptions.body === "object") {
          xhr.send(JSON.stringify(mergedOptions.body));
        } else {
          xhr.send(mergedOptions.body);
        }
      } else {
        xhr.send();
      }
    });
  }

  request(method, endpoint, options = {}, onProgress = null) {
    return this.sendRequest(method, endpoint, options, onProgress);
  }

  get(endpoint, options = {}, onProgress) {
    return this.request("GET", endpoint, options, onProgress);
  }

  post(endpoint, options = {}, onProgress) {
    return this.request("POST", endpoint, options, onProgress);
  }

  put(endpoint, options = {}, onProgress) {
    return this.request("PUT", endpoint, options, onProgress);
  }

  patch(endpoint, options = {}, onProgress) {
    return this.request("PATCH", endpoint, options, onProgress);
  }

  delete(endpoint, options = {}, onProgress) {
    return this.request("DELETE", endpoint, options, onProgress);
  }
}

// Exemple d'utilisation
// todo: On appele la classe avec notre url de base
const apiClient = new OchoClient("/xhr", {
  headers: {
    Authorization: "Bearer your-token",
    "X-Custom-Header": "custom-value",
  },
});

//* Exemple avec plus de contexte
const dataForm = document.getElementById("dataForm");
const message = document.querySelector(".message");

function submitForm(event) {
  event.preventDefault(); // Empêcher l'envoi du formulaire classique

  const formData = new FormData(dataForm);

  // Afficher le message de progression
  message.classList.add("progress");
  message.textContent = "Envoi en cours...";

  // Envoi des données via POST
  apiClient
    .post(
      "/api/data",
      {
        body: formData,
      },
      function onProgress(progress) {
        message.classList.remove("success")
        message.classList.remove("error")
        if (progress !== null) {
          console.log(progress);
          message.textContent = `Progression : ${Math.floor(progress)}%`;
          if (progress === 100) {
            message.textContent = "Traitement..."
          }
        }
      }
    )
    .then((response) => {
      console.log("Réponse du serveur:", response);
      message.classList.remove("progress");
      message.classList.add("success");
      message.textContent = "Données envoyées avec succès!";

      // Réinitialiser le formulaire après succès
      dataForm.reset();
    })
    .catch((error) => {
      console.error("Erreur lors de l'envoi des données:", error);
      message.classList.remove("progress");
      message.classList.add("error");
      message.textContent = "Erreur lors de l'envoi des données.";
    });
}

// Attacher l'événement de soumission du formulaire
dataForm && dataForm.addEventListener("submit", submitForm);

const dataDisplay = document.querySelector(".data-display");

function fetchData() {
  apiClient
    .get("/api/data",)
    .then((response) => {
      console.log("Données récupérées:", response);
      if (dataDisplay) {
        displayData(response);
      }
    })
    .catch((error) => {
      console.error("Erreur lors de la récupération des données:", error);
      dataDisplay.textContent = "Erreur lors de la récupération des données.";
    });
}

function displayData(data) {
  if (data && Array.isArray(data) && data.length > 0) {
    dataDisplay.innerHTML = `
      <ul>
        ${data.map(item => `<li>${item.name} - ${item.email}</li>`).join('')}
      </ul>
    `;
  } else {
    dataDisplay.textContent = "Aucune donnée disponible.";
  }
}

dataDisplay && fetchData();