
// todo: Une requête get
apiClient.get("users").then((data) => {
    console.log("Réponse :", data);
  }).catch((error) => {
    console.error("Erreur :", error.message);
  });
  
  // todo: Une requête post avec des options
  apiClient.post("users", {
    body: { name: "Jane Doe", email: "jane@example.com" },
  }).then((data) => {
    console.log("Utilisateur créé :", data);
  }).catch((error) => {
    console.error("Erreur lors de la création :", error.message);
  });
  
  
  // todo: Une requête POST avec progression
  const onProgress = (progress, event) => {
    if (progress !== null) {
      console.log(`Progression : ${progress.toFixed(2)}%`);
    } else {
      console.log("Progression inconnue.");
    }
  };
  
  const fileData = new FormData();
  fileData.append("file", myFile);
  
  apiClient.post("upload", {
    body: fileData,
  }, onProgress).then((data) => {
    console.log("Fichier uploadé :", data);
  }).catch((error) => {
    console.error("Erreur d'upload :", error.message);
  });
  
  // ? Exemple de gestion d'erreurs
  apiClient.get("invalid-endpoint").catch((error) => {
    console.error("Erreur détectée :", error.message);
  });
  
  // ? Exemple avec timeout par requête
  apiClient.get("users", { timeout: 2000 }).then((data) => {
    console.log("Réponse :", data);
  }).catch((error) => {
    console.error("Erreur ou timeout :", error.message);
  });
  
  // ? Exemple avec en-têtes spécifiques
  apiClient.get("users/1", {
    headers: {
      "X-Custom-Header": "CustomValue",
    },
  }).then((data) => {
    console.log("Utilisateur :", data);
  }).catch(console.error);
  
  // ! Exemple dans une fonction asynchrone
  async function fetchUsers() {
    try {
      const users = await apiClient.get("users");
      console.log("Liste des utilisateurs :", users);
    } catch (error) {
      console.error("Erreur lors de la récupération des utilisateurs :", error.message);
    }
  }