// CONFIG FIREBASE (GANTI DENGAN PUNYA KAMU)
const firebaseConfig = {
  apiKey: "API_KEY",
  authDomain: "PROJECT.firebaseapp.com",
  projectId: "PROJECT_ID"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

let coin = 0;

// REGISTER
function register() {
  const email = emailInput();
  const pass = passInput();

  auth.createUserWithEmailAndPassword(email, pass)
    .then(user => {
      db.collection("users").doc(user.user.uid).set({
        coin: 1000
      });
    });
}

// LOGIN
function login() {
  auth.signInWithEmailAndPassword(emailInput(), passInput());
}

// LOGOUT
function logout() {
  auth.signOut();
}

// AUTO LOGIN CHECK
auth.onAuthStateChanged(user => {
  if (user) {
    document.getElementById("auth").style.display = "none";
    document.getElementById("game").style.display = "block";

    db.collection("users").doc(user.uid).onSnapshot(doc => {
      coin = doc.data().coin;
      document.getElementById("coin").innerText = coin;
    });
  } else {
    document.getElementById("auth").style.display = "block";
    document.getElementById("game").style.display = "none";
  }
});

// SLOT GAME
function spin() {
  if (coin <= 0) return alert("Coin habis!");

  coin -= 10;

  const symbols = ["🍒","🍋","⭐","💎"];
  let r = [
    rand(symbols),
    rand(symbols),
    rand(symbols)
  ];

  setSlot(r);

  if (r[0] === r[1] && r[1] === r[2]) {
    coin += 100;
    alert("MENANG!");
  }

  saveCoin();
}

// HELPER
function rand(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function setSlot(r) {
  document.getElementById("s1").innerText = r[0];
  document.getElementById("s2").innerText = r[1];
  document.getElementById("s3").innerText = r[2];
}

function saveCoin() {
  const user = auth.currentUser;
  db.collection("users").doc(user.uid).update({
    coin: coin
  });
}

function emailInput() {
  return document.getElementById("email").value;
}

function passInput() {
  return document.getElementById("password").value;
}
