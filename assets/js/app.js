// التأكد من تسجيل الدخول
auth.onAuthStateChanged(user => {
  if(user){
    const uid = user.uid;
    // جلب بيانات المستخدم
    db.collection('users').doc(uid).get().then(doc => {
      if(doc.exists){
        const data = doc.data();
        document.getElementById('userInfo').innerHTML = `
          <h3>بيانات العميل</h3>
          <p><strong>الاسم:</strong> ${data.fullName}</p>
          <p><strong>الجوال:</strong> ${data.phone}</p>
          <p><strong>رقم الهوية:</strong> ${data.nationalId}</p>
          <p><strong>الإيميل:</strong> ${data.email}</p>
        `;
      }
    });

    // جلب بيانات المحفظة والرصيد (يمكنك تعديلها لاحقاً لإضافة حقول أخرى)
    db.collection('wallets').doc(uid).get().then(doc => {
      if(doc.exists){
        const wallet = doc.data();
        document.getElementById('walletInfo').innerHTML = `
          <h3>المحفظة والرصيد</h3>
          <p><strong>الرصيد:</strong> ${wallet.balance || 0} ريال سعودي</p>
        `;
      } else {
        document.getElementById('walletInfo').innerHTML = `
          <h3>المحفظة والرصيد</h3>
          <p>الرصيد: 0 ريال سعودي</p>
        `;
      }
    });

    // بيانات السحب (البنوك المحلية السعودية افتراضياً)
    document.getElementById('withdrawInfo').innerHTML = `
      <h3>السحب عبر البنوك المحلية</h3>
      <select id="bankSelect">
        <option>البنك الأهلي</option>
        <option>مصرف الراجحي</option>
        <option>البنك السعودي الفرنسي</option>
        <option>البنك السعودي للاستثمار</option>
        <option>البنك العربي الوطني</option>
        <option>بنك الرياض</option>
      </select>
      <p>أدخل المبلغ المراد سحبه:</p>
      <input type="number" id="withdrawAmount" placeholder="المبلغ بالريال">
      <button id="withdrawBtn">سحب</button>
    `;

    // عملية السحب
    document.getElementById('withdrawBtn').addEventListener('click', ()=>{
      const amount = parseFloat(document.getElementById('withdrawAmount').value);
      if(isNaN(amount) || amount <=0){
        alert('أدخل مبلغ صالح للسحب');
        return;
      }
      const bank = document.getElementById('bankSelect').value;
      // هنا تضيف عملية إرسال البيانات أو تعديل الرصيد في Firebase
      alert(`تم تقديم طلب سحب ${amount} ريال إلى ${bank}`);
    });

  } else {
    // لو المستخدم غير مسجل دخول
    window.location.href = 'login.html';
  }
});
