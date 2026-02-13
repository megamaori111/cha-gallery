const firebaseConfig = {
  apiKey: "PASTE_YOURS",
  authDomain: "PASTE_YOURS",
  projectId: "PASTE_YOURS",
  storageBucket: "PASTE_YOURS"
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

let user;

// LOGIN
function login() {
  const provider = new firebase.auth.GoogleAuthProvider();
  auth.signInWithPopup(provider);
}

function anonLogin() {
  auth.signInAnonymously();
}

auth.onAuthStateChanged(u => {
  user = u;
  loadMemes();
});

// UPLOAD
async function upload() {
  const file = document.getElementById("file").files[0];
  const ref = storage.ref().child("memes/" + file.name);

  await ref.put(file);
  const url = await ref.getDownloadURL();

  await db.collection("memes").add({
    url,
    owner: user.uid
  });

  loadMemes();
}

// LOAD
async function loadMemes() {
  const gallery = document.getElementById("gallery");
  gallery.innerHTML = "";

  const snapshot = await db.collection("memes").get();

  snapshot.forEach(doc => {
    const data = doc.data();

    const div = document.createElement("div");
    div.innerHTML = `
      <img src="${data.url}">
      <br>
      <button onclick="trade('${doc.id}')">Trade</button>
    `;

    gallery.appendChild(div);
  });
}

function trade(id) {
  alert("Trading system coming next 🔥");
}
