# Documentation de la classe `OchoClient`

La classe `OchoClient` est un client HTTP léger qui permet d'effectuer des requêtes HTTP (GET, POST, PUT, PATCH, DELETE) vers une API REST. Elle utilise `XMLHttpRequest` sous le capot et offre des fonctionnalités telles que la gestion des en-têtes, le suivi de la progression des requêtes, la gestion des erreurs HTTP, et la personnalisation des options de requête.

## Installation

Aucune installation particulière n'est nécessaire. La classe `OchoClient` peut être utilisée directement dans un environnement JavaScript moderne.

## Utilisation

### Initialisation

Pour utiliser `OchoClient`, vous devez d'abord créer une instance de la classe en fournissant l'URL de base de l'API et éventuellement des options par défaut. Voici plusieurs exemples d'initialisation avec différentes configurations :

#### Exemple 1 : Initialisation simple avec une URL de base

```javascript
const apiClient = new OchoClient("https://api.example.com");
```

Dans cet exemple, seule l'URL de base est fournie. Aucune option par défaut n'est spécifiée, donc les requêtes utiliseront les valeurs par défaut (pas de timeout, pas d'en-têtes personnalisés, etc.).

#### Exemple 2 : Initialisation avec des en-têtes par défaut

```javascript
const apiClient = new OchoClient("https://api.example.com", {
  headers: {
    Authorization: "Bearer your-token",
    "X-Custom-Header": "custom-value",
  },
});
```

Ici, des en-têtes par défaut sont définis pour toutes les requêtes. Ces en-têtes seront automatiquement ajoutés à chaque requête, sauf si vous les remplacez dans les options spécifiques à une requête.

#### Exemple 3 : Initialisation avec un timeout par défaut

```javascript
const apiClient = new OchoClient("https://api.example.com", {
  timeout: 5000, // 5 secondes
});
```

Dans cet exemple, un timeout de 5 secondes est défini par défaut pour toutes les requêtes. Si une requête dépasse ce délai, elle sera automatiquement annulée.

#### Exemple 4 : Initialisation avec des options de gestion des erreurs

```javascript
const apiClient = new OchoClient("https://api.example.com", {
  throwHttpErrors: false, // Désactive le rejet automatique des erreurs HTTP
});
```

Avec cette configuration, les erreurs HTTP (status >= 400) ne seront pas automatiquement rejetées. Vous devrez gérer manuellement les erreurs dans votre code.


#### Exemple 5 : Initialisation avec plusieurs options combinées

```javascript
const apiClient = new OchoClient("https://api.example.com", {
  headers: {
    Authorization: "Bearer your-token",
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 secondes
});
```

Cet exemple combine plusieurs options : des en-têtes par défaut et un timeout de 10 secondes.

### Méthodes disponibles

#### `sendRequest(method, endpoint, options = {}, onProgress = null)`

Cette méthode est utilisée pour envoyer une requête HTTP. Elle est appelée en interne par les autres méthodes (`get`, `post`, `put`, `patch`, `delete`).

- **`method`** (string): La méthode HTTP à utiliser (`GET`, `POST`, `PUT`, `PATCH`, `DELETE`).
- **`endpoint`** (string): Le point de terminaison de l'API.
- **`options`** (object): Options supplémentaires pour la requête (headers, body, timeout, etc.).
- **`onProgress`** (function): Une fonction de rappel pour suivre la progression de la requête.

#### `request(method, endpoint, options = {}, onProgress = null)`

Cette méthode est un alias pour `sendRequest`.

#### `get(endpoint, options = {}, onProgress)`

Envoie une requête GET.

#### `post(endpoint, options = {}, onProgress)`

Envoie une requête POST.

#### `put(endpoint, options = {}, onProgress)`

Envoie une requête PUT.

#### `patch(endpoint, options = {}, onProgress)`

Envoie une requête PATCH.

#### `delete(endpoint, options = {}, onProgress)`

Envoie une requête DELETE.

### Options de requête

Les options suivantes peuvent être passées à chaque méthode de requête :

- **`headers`** (object): En-têtes HTTP supplémentaires.
- **`body`** (object|string|FormData): Le corps de la requête.
- **`throwHttpErrors`** (boolean): Si `true`, les erreurs HTTP (status >= 400) seront rejetées. Par défaut à `true`.
- **`timeout`** (number): Délai d'expiration de la requête en millisecondes. Par défaut à `0` (pas de timeout).

### Gestion des erreurs

Les erreurs HTTP (status >= 400) peuvent être gérées en utilisant l'option `throwHttpErrors`. Si cette option est activée, les erreurs HTTP seront rejetées et pourront être capturées avec `.catch()`.

### Suivi de la progression

Vous pouvez suivre la progression des requêtes (en particulier pour les uploads) en fournissant une fonction de rappel `onProgress`.

### Exemples d'utilisation

#### Requête GET

```javascript
apiClient
  .get("users")
  .then(({ data }) => {
    console.log("Réponse :", data);
  })
  .catch((error) => {
    console.error("Erreur :", error.message);
  });
```

#### Requête POST avec corps

```javascript
apiClient
  .post("users", {
    body: { name: "Jane Doe", email: "jane@example.com" },
  })
  .then(({ data }) => {
    console.log("Utilisateur créé :", data);
  })
  .catch((error) => {
    console.error("Erreur lors de la création :", error.message);
  });
```

#### Requête POST avec suivi de la progression

```javascript
const onProgress = (progress, event) => {
  if (progress !== null) {
    console.log(`Progression : ${progress.toFixed(2)}%`);
  } else {
    console.log("Progression inconnue.");
  }
};

const fileData = new FormData();
fileData.append("file", myFile);

apiClient
  .post(
    "upload",
    {
      body: fileData,
    },
    onProgress
  )
  .then(({ data }) => {
    console.log("Fichier uploadé :", data);
  })
  .catch((error) => {
    console.error("Erreur d'upload :", error.message);
  });
```

#### Gestion des erreurs

```javascript
apiClient.get("invalid-endpoint").catch((error) => {
  console.error("Erreur détectée :", error.message);
});
```

#### Requête avec timeout

```javascript
apiClient
  .get("users", { timeout: 2000 })
  .then(({ data }) => {
    console.log("Réponse :", data);
  })
  .catch((error) => {
    console.error("Erreur ou timeout :", error.message);
  });
```

#### Requête avec en-têtes spécifiques

```javascript
apiClient
  .get("users/1", {
    headers: {
      "X-Custom-Header": "CustomValue",
    },
  })
  .then(({ data }) => {
    console.log("Utilisateur :", data);
  })
  .catch(console.error);
```

#### Utilisation dans une fonction asynchrone

```javascript
async function fetchUsers() {
  try {
    const { data: users } = await apiClient.get("users");
    console.log("Liste des utilisateurs :", users);
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des utilisateurs :",
      error.message
    );
  }
}
```

## Contexte d'utilisation

### Formulaire avec suivi de la progression

```javascript
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
      "/data",
      {
        body: formData,
      },
      function onProgress(progress) {
        message.classList.remove("success");
        message.classList.remove("error");
        if (progress !== null) {
          console.log(progress);
          message.textContent = `Progression : ${Math.floor(progress)}%`;
          if (progress === 100) {
            setTimeout(() => {
              message.textContent = "Traitement...";
            }, 100);
          }
        }
      }
    )
    .then(({ data, status, statusText }) => {
      console.log("Réponse du serveur:", data);
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
```

### Affichage des données

```javascript
const dataDisplay = document.querySelector(".data-display");

function fetchData() {
  apiClient
    .get("/data")
    .then(({ data, status, statusText }) => {
      console.log("Données récupérées:", data);
      if (dataDisplay) {
        displayData(data);
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
        ${data.map((item) => `<li>${item.name} - ${item.email}</li>`).join("")}
      </ul>
    `;
  } else {
    dataDisplay.textContent = "Aucune donnée disponible.";
  }
}

dataDisplay && fetchData();
```

## Conclusion

La classe `OchoClient` est un outil puissant et flexible pour interagir avec des API REST. Elle offre une interface simple pour envoyer des requêtes HTTP, gérer les erreurs, et suivre la progression des requêtes. Que vous travailliez sur une application web ou un projet backend, `OchoClient` peut simplifier vos interactions HTTP.