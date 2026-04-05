<div class="landing-page" id="landing-page">
  <!-- Section A: Hero -->
  <section class="landing-hero">
    <div class="hero-bg-overlay"></div>
    <div class="container-narrow">
      <div class="hero-content">
        <span class="hero-badge">[[themes/cop:landing.hero_badge]]</span>
        <h1>[[themes/cop:landing.hero_title]]</h1>
        <p>[[themes/cop:landing.hero_desc]]</p>
        <div class="hero-btns">
          <a href="{relative_path}/register" class="btn-primary-lg">[[themes/cop:landing.hero_cta_join]] <i class="fa fa-arrow-right"></i></a>
          <a href="#pillars" class="btn-outline-lg">[[themes/cop:landing.hero_cta_discover]]</a>
        </div>
      </div>
    </div>
  </section>

  <!-- Section B: Overview Grid (Bento Style) -->
  <section class="landing-overview" id="pillars">
    <div class="container-narrow">
      <div class="section-header-left">
        <h2 class="section-title">[[themes/cop:landing.overview_title]]</h2>
        <p>[[themes/cop:landing.overview_desc]]</p>
      </div>

      <div class="bento-grid">
        <!-- Directory Preview -->
        <div class="bento-card bento-directory">
          <img class="bento-image" src="{relative_path}/plugins/nodebb-theme-cop/cop/landing/directory.jpg" alt="[[themes/cop:landing.directory_title]]" />
          <h3>[[themes/cop:landing.directory_title]]</h3>
          <p>[[themes/cop:landing.directory_desc]]</p>
          <div class="directory-avatars">
            <div class="avatar"><img src="https://ui-avatars.com/api/?name=Jean+K&background=2D6A4F&color=fff" alt=""></div>
            <div class="avatar"><img src="https://ui-avatars.com/api/?name=Marie+O&background=F47B20&color=fff" alt=""></div>
            <div class="avatar"><img src="https://ui-avatars.com/api/?name=Paul+D&background=D32F2F&color=fff" alt=""></div>
            <div class="avatar-plus">+280</div>
          </div>
          <a href="{relative_path}/directory" class="btn-ghost-sm">[[themes/cop:landing.directory_btn]]</a>
        </div>

        <!-- Latest Event -->
        <div class="bento-card bento-event">
          <div class="event-top">
            <div class="event-date-block">
              <span class="event-month">AVR</span>
              <span class="event-day">12</span>
            </div>
            <div class="event-info">
              <div class="event-tag">[[themes/cop:landing.event_tag]]</div>
              <h4>[[themes/cop:landing.event_title]]</h4>
            </div>
          </div>
          <img class="event-image" src="{relative_path}/plugins/nodebb-theme-cop/cop/landing/event.jpg" alt="[[themes/cop:landing.event_title]]" />
          <div class="event-details">
            <span><i class="fa fa-clock-o"></i> 10:00 — 12:00 WAT</span>
            <span><i class="fa fa-video-camera"></i> Zoom</span>
          </div>
          <a href="{relative_path}/categories" class="btn-glass">[[themes/cop:landing.event_btn]] <i class="fa fa-external-link"></i></a>
        </div>

        <!-- Feature Highlight -->
        <div class="bento-card bento-highlight">
          <div class="highlight-inner">
            <div class="highlight-icon-wrap">
              <i class="fa fa-shield"></i>
            </div>
            <div class="highlight-text">
              <h4>[[themes/cop:landing.highlight_title]]</h4>
              <p>[[themes/cop:landing.highlight_desc]]</p>
            </div>
            <img class="highlight-img" src="{relative_path}/plugins/nodebb-theme-cop/cop/landing/highlight.jpg" alt="[[themes/cop:landing.highlight_title]]" />
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Section C: The Pillars -->
  <section class="landing-pillars">
    <div class="pillar-row pillar-row--dark">
      <div class="container-narrow">
        <div class="pillar-content">
          <div class="pillar-text">
            <span class="pillar-label">[[themes/cop:landing.pillar1_label]]</span>
            <h2>[[themes/cop:landing.pillar1_title]]</h2>
            <p>[[themes/cop:landing.pillar1_desc]]</p>
            <ul class="pillar-list">
              <li><i class="fa fa-check"></i> [[themes/cop:landing.pillar1_feat1]]</li>
              <li><i class="fa fa-check"></i> [[themes/cop:landing.pillar1_feat2]]</li>
              <li><i class="fa fa-check"></i> [[themes/cop:landing.pillar1_feat3]]</li>
            </ul>
            <a href="{relative_path}/categories" class="btn-link">[[themes/cop:landing.pillar1_link]] <i class="fa fa-chevron-right"></i></a>
          </div>
          <div class="pillar-visual">
            <img class="pillar-image" src="{relative_path}/plugins/nodebb-theme-cop/cop/landing/pillar-dialogue.jpg" alt="[[themes/cop:landing.pillar1_title]]" />
          </div>
        </div>
      </div>
    </div>

    <div class="pillar-row pillar-row--orange">
      <div class="container-narrow">
        <div class="pillar-content reverse">
          <div class="pillar-text">
            <span class="pillar-label">[[themes/cop:landing.pillar2_label]]</span>
            <h2>[[themes/cop:landing.pillar2_title]]</h2>
            <p>[[themes/cop:landing.pillar2_desc]]</p>
            <ul class="pillar-list">
              <li><i class="fa fa-magic"></i> [[themes/cop:landing.pillar2_feat1]]</li>
              <li><i class="fa fa-search"></i> [[themes/cop:landing.pillar2_feat2]]</li>
              <li><i class="fa fa-lock"></i> [[themes/cop:landing.pillar2_feat3]]</li>
            </ul>
            <a href="{relative_path}/documents" class="btn-link">[[themes/cop:landing.pillar2_link]] <i class="fa fa-chevron-right"></i></a>
          </div>
          <div class="pillar-visual">
            <div class="visual-mockup visual-mockup--docs">
              <div class="mock-doc">
                <div class="doc-icon"><i class="fa fa-file-pdf-o"></i></div>
                <div class="doc-title">[[themes/cop:landing.doc_title]]</div>
                <div class="doc-meta">[[themes/cop:landing.doc_meta]]</div>
                <div class="doc-lines">
                  <div class="doc-line"></div>
                  <div class="doc-line"></div>
                  <div class="doc-line"></div>
                  <div class="doc-line"></div>
                </div>
                <div class="doc-ai-summary">
                  <div class="ai-badge"><i class="fa fa-bolt"></i> [[themes/cop:landing.doc_ai_badge]]</div>
                  <p class="ai-text">[[themes/cop:landing.doc_ai_text]]</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Section D: Role Selection -->
  <section class="landing-roles">
    <div class="container-narrow">
      <div class="section-header">
        <span class="section-subtitle">[[themes/cop:landing.roles_subtitle]]</span>
        <h2 class="section-title">[[themes/cop:landing.roles_title]]</h2>
      </div>
      <div class="role-grid">
        <div class="role-card" data-role="decideur">
          <div class="role-icon role-icon--teal"><i class="fa fa-university"></i></div>
          <div class="role-info">
            <h3>[[themes/cop:landing.role1_title]]</h3>
            <p>[[themes/cop:landing.role1_desc]]</p>
          </div>
        </div>
        <div class="role-card" data-role="chercheur">
          <div class="role-icon role-icon--orange"><i class="fa fa-flask"></i></div>
          <div class="role-info">
            <h3>[[themes/cop:landing.role2_title]]</h3>
            <p>[[themes/cop:landing.role2_desc]]</p>
          </div>
        </div>
        <div class="role-card" data-role="evaluateur">
          <div class="role-icon role-icon--green"><i class="fa fa-check-circle"></i></div>
          <div class="role-info">
            <h3>[[themes/cop:landing.role3_title]]</h3>
            <p>[[themes/cop:landing.role3_desc]]</p>
          </div>
        </div>
        <div class="role-card" data-role="etudiant">
          <div class="role-icon role-icon--red"><i class="fa fa-graduation-cap"></i></div>
          <div class="role-info">
            <h3>[[themes/cop:landing.role4_title]]</h3>
            <p>[[themes/cop:landing.role4_desc]]</p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Section E: Final CTA -->
  <section class="landing-cta">
    <div class="container-narrow">
      <div class="cta-box">
        <h2>[[themes/cop:landing.cta_title]]</h2>
        <p>[[themes/cop:landing.cta_desc]]</p>
        <div class="cta-btns">
          <a href="{relative_path}/register" class="btn-primary-xl">[[themes/cop:landing.cta_register]]</a>
          <a href="{relative_path}/login" class="btn-link-white">[[themes/cop:landing.cta_login]]</a>
        </div>
      </div>
    </div>
  </section>

  <!-- Section F: Partners -->
  <section class="landing-partners">
    <div class="container-narrow">
      <div class="section-header">
        <span class="section-subtitle">[[themes/cop:landing.partners_subtitle]]</span>
        <h2 class="section-title">[[themes/cop:landing.partners_title]]</h2>
      </div>
      <div class="partners-grid">
        <div class="partner-card">
          <img src="{relative_path}/plugins/nodebb-theme-cop/cop/partner-clear-fa.png" alt="CLEAR FA" class="partner-logo" />
        </div>
        <div class="partner-card">
          <img src="{relative_path}/plugins/nodebb-theme-cop/cop/partner-afd.png" alt="AFD" class="partner-logo" />
        </div>
        <div class="partner-card">
          <img src="{relative_path}/plugins/nodebb-theme-cop/cop/partner-cesag.png" alt="CESAG" class="partner-logo" />
        </div>
        <div class="partner-card">
          <img src="{relative_path}/plugins/nodebb-theme-cop/cop/partner-gei.jpeg" alt="GEI" class="partner-logo" />
        </div>
      </div>
    </div>
  </section>

  <!-- Pre-footer -->
  <div class="landing-prefooter">
    <div class="container-narrow">
      <div class="prefooter-grid">
        <div class="prefooter-brand">
          <div class="prefooter-brand__row">
            <div class="prefooter-brand__logo-wrap">
              {{{ if brand:logo }}}
              <img src="{brand:logo}?{config.cache-buster}" alt="{config.siteTitle}" class="footer-logo">
              {{{ end }}}
              {{{ if !brand:logo }}}
              <img src="{relative_path}/plugins/nodebb-theme-cop/cop/logo.JPG" alt="{config.siteTitle}" class="footer-logo">
              {{{ end }}}
            </div>
            <div class="prefooter-brand__text">
              <p>[[themes/cop:landing.prefooter_ministry]]<br>[[themes/cop:landing.prefooter_country]]</p>
              <div class="status-indicator">
                <span class="pulse-dot"></span>
                <span>[[themes/cop:landing.prefooter_status]]</span>
              </div>
            </div>
          </div>
        </div>
        <div class="prefooter-nav">
          <div class="nav-col">
            <h4>[[themes/cop:landing.prefooter_platform]]</h4>
            <ul>
              <li><a href="{relative_path}/categories">[[themes/cop:landing.prefooter_forums]]</a></li>
              <li><a href="{relative_path}/documents">[[themes/cop:landing.prefooter_docs]]</a></li>
              <li><a href="{relative_path}/directory">[[themes/cop:landing.prefooter_directory]]</a></li>
            </ul>
          </div>
          <div class="nav-col">
            <h4>[[themes/cop:landing.prefooter_support]]</h4>
            <ul>
              <li><a href="{relative_path}/register">[[themes/cop:landing.prefooter_register]]</a></li>
              <li><a href="{relative_path}/login">[[themes/cop:landing.prefooter_login]]</a></li>
              <li><a href="#">[[themes/cop:landing.prefooter_contact]]</a></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
