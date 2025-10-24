
  import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

  const supabase = createClient(
    'https://hsvxveceqqjubnfqywlh.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhzdnh2ZWNlcXFqdWJuZnF5d2xoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEyNDA1ODEsImV4cCI6MjA3NjgxNjU4MX0.AIzcwu_KmwSz4FUkxRgesvPmBsu-6x3EIEfZDxl7ADc'
  );

  
  const form = document.querySelector('form[action="#"]');
  const button = form.querySelector('button');

  button.addEventListener('click', async (e) => {
    e.preventDefault(); 

    const firstName = document.getElementById('inputFirstName')?.value.trim();
    const lastName = document.getElementById('inputLastName')?.value.trim();
    const contact = document.getElementById('inputEmail')?.value.trim();
    const message = document.getElementById('message')?.value.trim();

    if (!firstName || !lastName || !contact) {
      alert('الرجاء ملء الحقول المطلوبة.');
      return;
    }

    const bookingData = {
      first_name: firstName,
      last_name: lastName,
      contact_info: contact,
      message: message || null
    };

    console.log('جارٍ إرسال البيانات:', bookingData); 

    const { error } = await supabase.from('bookings').insert([bookingData]);

    if (error) {
      console.error('❌ خطأ Supabase:', error);
      alert('فشل الإرسال: ' + (error.message || 'حدث خطأ غير معروف'));
    } else {
      alert('تم إرسال الحجز!');
      form.reset();
    }
  });