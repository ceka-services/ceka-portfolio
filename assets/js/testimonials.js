 (function () {
    if (document.getElementById('testimonials')) {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
      script.onload = loadTestimonials;
      document.head.appendChild(script);
    }
  })();

  async function loadTestimonials() {
    const supabase = window.supabase.createClient(
      'https://hsvxveceqqjubnfqywlh.supabase.co',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhzdnh2ZWNlcXFqdWJuZnF5d2xoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEyNDA1ODEsImV4cCI6MjA3NjgxNjU4MX0.AIzcwu_KmwSz4FUkxRgesvPmBsu-6x3EIEfZDxl7ADc'
    );

    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .eq('is_approved', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ خطأ في جلب الآراء:', error);
      return;
    }

    const container = document.getElementById('testimonials');
    const carouselInner = document.querySelector('#carouselExampleCaptions .carousel-inner');
    
    if (!data || data.length === 0) {
      container.style.display = 'none';
      return;
    }

    let items = '';
    data.forEach((t, i) => {
      // الصورة
      let img = 'images/testimonials/default.png';
      if (t.avatar_path) {
        const { data: urlData } = supabase.storage.from('testimonials').getPublicUrl(t.avatar_path);
        img = urlData.publicUrl;
      }

      // النجوم
      let stars = '';
      const r = t.rating || 5;
      for (let i = 1; i <= 5; i++) {
        stars += i <= r ? '<i class="fas fa-star"></i>' : '<i class="far fa-star"></i>';
      }

      items += `
        <div class="carousel-item ${i === 0 ? 'active' : ''}">
          <div class="testimonials__card">
            <p class="lh-lg">
              <i class="fas fa-quote-right"></i>
              <span class="content-text">${t.content}</span>
              <i class="fas fa-quote-left"></i>
              <div class="ratings p-1">${stars}</div>
            </p>
          </div>
          <div class="testimonials__picture">
            <img src="${img}" alt="${t.name}" class="rounded-circle img-fluid">
          </div>
          <div class="testimonials__name">
            <h3>${t.name}</h3>
            <p class="fw-light">${t.job_title || ''}</p>
          </div>
        </div>
      `;
    });

    carouselInner.innerHTML = items;
  }