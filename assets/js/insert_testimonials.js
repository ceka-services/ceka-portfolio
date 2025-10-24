  (function () {
    if (document.getElementById('testimonialForm')) {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
      script.onload = initTestimonialForm;
      document.head.appendChild(script);
    }
  })();

  async function initTestimonialForm() {
    const supabase = window.supabase.createClient(
      'https://hsvxveceqqjubnfqywlh.supabase.co',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhzdnh2ZWNlcXFqdWJuZnF5d2xoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEyNDA1ODEsImV4cCI6MjA3NjgxNjU4MX0.AIzcwu_KmwSz4FUkxRgesvPmBsu-6x3EIEfZDxl7ADc'
    );

    // تفعيل تقييم النجوم
    const stars = document.querySelectorAll('#ratingStars span');
    let selectedRating = 5;
    const ratingInput = document.getElementById('ratingValue');
    ratingInput.value = 5;

    stars.forEach(star => {
      star.addEventListener('click', () => {
        selectedRating = parseInt(star.dataset.value);
        ratingInput.value = selectedRating;
        stars.forEach((s, i) => s.classList.toggle('active', i < selectedRating));
      });
      star.addEventListener('mouseover', () => {
        const v = parseInt(star.dataset.value);
        stars.forEach((s, i) => s.style.color = i < v ? '#ffc107' : '#ddd');
      });
      star.addEventListener('mouseout', () => {
        stars.forEach((s, i) => s.style.color = i < selectedRating ? '#ffc107' : '#ddd');
      });
    });

    // إرسال الفورم
    document.getElementById('testimonialForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      const msg = document.getElementById('testimonialMessage');
      msg.innerHTML = '<div class="text-info">جاري الإرسال...</div>';

      const name = document.getElementById('clientName').value.trim();
      const job = document.getElementById('jobTitle').value.trim();
      const content = document.getElementById('testimonialContent').value.trim();
      const rating = parseInt(ratingInput.value);
      const file = document.getElementById('avatarUpload')?.files[0];

      if (!name || !content) {
        msg.innerHTML = '<div class="text-danger">الرجاء ملء الحقول المطلوبة.</div>';
        return;
      }

      let avatarPath = null;
      if (file) {
        const fileName = `testimonial_${Date.now()}_${file.name}`;
        const { error: upErr } = await supabase.storage.from('testimonials').upload(`public/${fileName}`, file);
        if (upErr) {
          msg.innerHTML = '<div class="text-danger">فشل رفع الصورة.</div>';
          return;
        }
        avatarPath = `public/${fileName}`;
      }

      const { error } = await supabase.from('testimonials').insert([{
        name,
        job_title: job || null,
        content,
        rating,
        avatar_path: avatarPath,
        is_approved: false
      }]);

      if (error) {
        console.error('خطأ الإرسال:', error);
        msg.innerHTML = '<div class="text-danger">فشل الإرسال. حاول لاحقًا.</div>';
      } else {
        msg.innerHTML = '<div class="text-success">شكرًا لك! سيتم عرض رأيك بعد الموافقة.</div>';
        document.getElementById('testimonialForm').reset();
        // إعادة تعيين النجوم
        selectedRating = 5;
        stars.forEach((s, i) => s.classList.toggle('active', i < 5));
      }
    });
  }
