
// Firebase config
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// تسجيل مستخدم
if(document.getElementById('registerForm')){
    document.getElementById('registerForm').addEventListener('submit', (e)=>{
        e.preventDefault();
        const fullName = document.getElementById('fullName').value;
        const phone = document.getElementById('phone').value;
        const nationalId = document.getElementById('nationalId').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        auth.createUserWithEmailAndPassword(email,password).then(cred=>{
            return db.collection('users').doc(cred.user.uid).set({
                fullName, phone, nationalId, email, createdAt: new Date()
            });
        }).then(()=>{ alert('تم التسجيل بنجاح'); window.location.href='login.html'; })
        .catch(err=> alert(err.message));
    });
}

// تسجيل دخول
if(document.getElementById('loginForm')){
    document.getElementById('loginForm').addEventListener('submit',(e)=>{
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        auth.signInWithEmailAndPassword(email,password)
        .then(()=> window.location.href='dashboard.html')
        .catch(err=> alert(err.message));
    });
}
