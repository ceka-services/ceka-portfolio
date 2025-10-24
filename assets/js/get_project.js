
  import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

  const supabaseUrl = 'https://hsvxveceqqjubnfqywlh.supabase.co';
  const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhzdnh2ZWNlcXFqdWJuZnF5d2xoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEyNDA1ODEsImV4cCI6MjA3NjgxNjU4MX0.AIzcwu_KmwSz4FUkxRgesvPmBsu-6x3EIEfZDxl7ADc';
  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  function getImageUrl(path) {
    if (!path) return 'images/portfolio/default.jpg';
    const { data } = supabase.storage.from('projects').getPublicUrl(path);
    return data.publicUrl;
  }

  async function loadProjects(category = 'all') {
    let query = supabase.from('projects').select('*').order('created_at', { ascending: false });

    if (category !== 'all') {
      query = query.eq('category', category);
    }

    const { data, error } = await query;

    if (error) {
      console.error('خطأ:', error);
      document.getElementById('projects-container').innerHTML = '<p class="text-center text-danger">فشل التحميل.</p>';
      return;
    }

    const projectsHTML = data.map(project => `
      <div class="col-lg-4 col-md-6 mb-4">
        <div class="portfolio-box shadow">
          <img 
            src="${getImageUrl(project.image_path)}" 
            alt="${project.title}" 
            title="${project.title}"
            class="img-fluid portfolio-img-project"
          >
          <div class="portfolio-info">
            <a href="${project.live_url || '#'}" target="_blank" rel="noopener">
              <div class="caption">
                <h4>${project.title}</h4>
                <p>${project.category || 'غير مصنف'}</p>
              </div>
            </a>
          </div>
        </div>
      </div>
    `).join('');

    document.getElementById('projects-container').innerHTML = projectsHTML || '<p class="text-center">لا توجد مشاريع.</p>';
  }

  loadProjects();

  document.querySelectorAll('.filter-btn').forEach(button => {
    button.addEventListener('click', () => {
      const category = button.dataset.category;
      loadProjects(category);
      
      document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
    });
  });
