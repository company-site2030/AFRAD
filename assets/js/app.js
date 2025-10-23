import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAkTnnJRI_N-uIN-Z8d-3Bz_c_A0rl96DY",
  authDomain: "afrad-9cac8.firebaseapp.com",
  projectId: "afrad-9cac8",
  storageBucket: "afrad-9cac8.firebasestorage.app",
  messagingSenderId: "131437320877",
  appId: "1:131437320877:web:13f8f134785c13d861c424"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// --- تسجيل ---
const registerForm = document.getElementById('registerForm');
if(registerForm){
  registerForm.addEventListener('submit', async (e)=>{
    e.preventDefault();
    const fullName = document.getElementById('fullName').value;
    const phone = document.getElementById('phone').value;
    const nationalId = document.getElementById('nationalId').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    try{
      const userCredential = await createUserWithEmailAndPassword(auth,email,password);
      const uid = userCredential.user.uid;
      await setDoc(doc(db,'users',uid),{fullName,phone,nationalId,email,createdAt:serverTimestamp()});
      await setDoc(doc(db,'wallets',uid),{balance:0});
      alert('تم التسجيل بنجاح');
      window.location.href='login.html';
    }catch(err){ alert(err.message); }
  });
}

// --- تسجيل دخول ---
const loginForm = document.getElementById('loginForm');
if(loginForm){
  loginForm.addEventListener('submit', async (e)=>{
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    try{
      await signInWithEmailAndPassword(auth,email,password);
      window.location.href='dashboard.html';
    }catch(err){ alert(err.message); }
  });
}

// --- Dashboard ---
onAuthStateChanged(auth, async (user)=>{
  if(user){
    const uid = user.uid;

    // بيانات المستخدم
    const userInfoEl = document.getElementById('userInfo');
    if(userInfoEl){
      const userDoc = await getDoc(doc(db,'users',uid));
      if(userDoc.exists()){
        const data = userDoc.data();
        userInfoEl.innerHTML = `<h3>بيانات العميل</h3>
          <p><strong>الاسم:</strong> ${data.fullName}</p>
          <p><strong>الجوال:</strong> ${data.phone}</p>
          <p><strong>رقم الهوية:</strong> ${data.nationalId}</p>
          <p><strong>الإيميل:</strong> ${data.email}</p>`;
      }
    }

    // المحفظة
    const walletInfoEl = document.getElementById('walletInfo');
    if(walletInfoEl){
      const walletDoc = await getDoc(doc(db,'wallets',uid));
      let balance = 0;
      if(walletDoc.exists()) balance = walletDoc.data().balance||0;
      walletInfoEl.innerHTML = `<h3>المحفظة والرصيد</h3><p><strong>الرصيد:</strong> ${balance}</p>`;
    }

    // السحب
    const withdrawEl = document.getElementById('withdrawInfo');
    if(withdrawEl){
      withdrawEl.innerHTML = `<h3>السحب عبر البنوك المحلية</h3>
        <select id="bankSelect">
          <option>البنك الأهلي</option>
          <option>مصرف الراجحي</option>
          <option>البنك السعودي الفرنسي</option>
          <option>البنك السعودي للاستثمار</option>
          <option>البنك العربي الوطني</option>
          <option>بنك الرياض</option>
        </select>
        <p>أدخل المبلغ المراد سحبه:</p>
        <input type="number" id="withdrawAmount" placeholder="المبلغ">
        <button id="withdrawBtn">سحب</button>`;
      document.getElementById('withdrawBtn').addEventListener('click',()=>{
        const amount = parseFloat(document.getElementById('withdrawAmount').value);
        const bank = document.getElementById('bankSelect').value;
        if(isNaN(amount) || amount<=0){ alert('أدخل مبلغ صالح للسحب'); return;}
        alert(`تم تقديم طلب سحب ${amount} إلى ${bank}`);
      });
    }

  } else {
    // إذا لم يكن مسجل الدخول
    if(window.location.pathname.includes('dashboard.html')){
      window.location.href='login.html';
    }
  }
});

// --- Logout ---
const logoutBtn = document.getElementById('logoutBtn');
if(logoutBtn){
  logoutBtn.addEventListener('click', async ()=>{
    await signOut(auth);
    window.location.href='login.html';
  });
}
